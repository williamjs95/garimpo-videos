import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "./theme";
import type { TimedLine } from "./timing";
import {
  type CastMember,
  DROP_FALL_FRAMES as FALL,
  type Line,
  type Mouth,
} from "./types";

// The stage is a wide world the 9:16 camera travels over. Characters keep
// their spot for the whole scene; the camera moves to whoever speaks.
const VIEW_W = 1080;
const VIEW_H = 1920;
const WORLD_W = 2880;
const WORLD_H = 1920;
const CHAR_H = 1180;
const CHAR_W = (CHAR_H * 1024) / 1536;
const FLOOR = 1790;
const SPACING = 560;
const PROP = 340;
/** Frames a character takes to walk in or out. */
const WALK = 16;
/** How far outside their spot a character starts when walking in. */
const WALK_FROM = 900;

type Camera = { x: number; y: number; z: number };

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const mix = (a: Camera, b: Camera, t: number): Camera => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: lerp(a.z, b.z, t),
});

/** Everyone who speaks or gets hit in a location, in order of appearance. */
export const presentIn = (lines: Line[], location: string): string[] => {
  const ids: string[] = [];
  for (const l of lines) {
    if (l.location !== location) continue;
    for (const id of [l.character, l.fx.includes("queda") ? l.fxTarget : ""]) {
      if (id && !ids.includes(id)) ids.push(id);
    }
  }
  return ids;
};

const heightOf = (cast: CastMember[], id: string): number =>
  CHAR_H * (cast.find((c) => c.id === id)?.scale ?? 1);

const slotX = (count: number, index: number): number =>
  WORLD_W / 2 + (index - (count - 1) / 2) * SPACING;

const isSpeaking = (line: Line, ms: number): boolean =>
  line.words.some((w) => ms >= w.startMs && ms <= w.endMs + 60);

export const Stage: React.FC<{
  lines: Line[];
  timed: TimedLine[];
  index: number;
  cast: CastMember[];
  backgrounds: Record<string, string>;
  props: Record<string, string>;
  speechRate: number;
}> = ({ lines, timed, index, cast, backgrounds, props, speechRate }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = lines[index];
  const time = timed[index];
  if (!line || !time) return null;

  const local = frame - time.from;
  const ms = (local / fps) * 1000 * speechRate;
  const present = presentIn(lines, line.location);
  const xOf = (id: string): number =>
    slotX(present.length, Math.max(0, present.indexOf(id)));

  const shot = (l: Line): Camera =>
    l.camera === "close"
      ? {
          x: xOf(l.character),
          y: FLOOR - heightOf(cast, l.character) * 0.74,
          z: 1.5,
        }
      : { x: xOf(l.character), y: 1040, z: 1.12 };
  const dropShot = (l: Line): Camera => ({
    x: lerp(xOf(l.character), xOf(l.fxTarget), 0.7),
    y: 1000,
    z: 1.15,
  });
  /** Where the camera rests when a line ends. */
  const restShot = (l: Line): Camera =>
    l.fx.includes("queda") ? dropShot(l) : shot(l);

  // Camera: glide from the previous speaker, or punch in on a new location.
  const prev = lines[index - 1];
  const arrive = spring({
    frame: local,
    fps,
    config: { damping: 22, stiffness: 170 },
  });
  let cam = shot(line);
  if (prev && prev.location === line.location) {
    cam = mix(restShot(prev), cam, arrive);
  } else {
    cam = { ...cam, z: cam.z * interpolate(arrive, [0, 1], [1.1, 1]) };
  }
  // A slow push keeps a held shot alive.
  cam.z *= 1 + 0.025 * Math.min(1, local / time.durationInFrames);

  const dropStart = time.speechFrames + 2;
  const sinceImpact = local - dropStart - FALL;
  const dropping = line.fx.includes("queda") && local >= dropStart;
  if (dropping) {
    const move = spring({
      frame: local - dropStart,
      fps,
      config: { damping: 20, stiffness: 160 },
    });
    cam = mix(cam, dropShot(line), move);
  }
  const hit = line.fx.includes("queda") && sinceImpact >= 0;
  // Gags from earlier lines of this scene leave their mark: the prop stays on
  // the floor and whoever was hit stays shocked until they speak again.
  const aftermath: Line[] = [];
  for (let i = index - 1; i >= 0; i--) {
    const l = lines[i];
    if (!l || l.location !== line.location) break;
    if (l.fx.includes("queda")) aftermath.push(l);
  }
  const stillShocked = (id: string): boolean =>
    aftermath.some((l) => l.fxTarget === id);
  const shake = hit ? 24 * Math.exp(-sinceImpact / 5) : 0;

  const tx =
    Math.min(
      0,
      Math.max(VIEW_W - WORLD_W * cam.z, VIEW_W / 2 - cam.x * cam.z),
    ) +
    shake * Math.sin(local * 2.3);
  const ty =
    Math.min(
      0,
      Math.max(VIEW_H - WORLD_H * cam.z, VIEW_H / 2 - cam.y * cam.z),
    ) +
    shake * Math.cos(local * 3.1);

  /**
   * Where a character is relative to their spot: walking in on an "entra"
   * line, walking out after a "sai" line, or off stage in between.
   */
  const walkOf = (
    id: string,
  ): { dx: number; gone: boolean; stride: number } => {
    const side = xOf(id) < WORLD_W / 2 ? -1 : 1;
    const own = lines
      .map((l, i) => ({ l, i }))
      .filter(({ l }) => l.location === line.location && l.character === id);
    let gone = own[0]?.l.move === "entra";
    for (const { l, i } of own) {
      if (i > index) break;
      if (l.move === "entra") {
        if (i < index) gone = false;
        else {
          const t = Math.min(1, local / WALK);
          const eased = 1 - (1 - t) ** 3;
          return {
            dx: (1 - eased) * side * WALK_FROM,
            gone: false,
            stride: t < 1 ? local : 0,
          };
        }
      } else if (l.move === "sai") {
        if (i < index) gone = true;
        else {
          const t = Math.min(
            1,
            Math.max(0, (local - time.speechFrames) / WALK),
          );
          return {
            dx: t * t * side * WALK_FROM,
            gone: t >= 1,
            stride: t > 0 ? local : 0,
          };
        }
      } else if (i <= index) gone = false;
    }
    return { dx: 0, gone, stride: 0 };
  };

  // The speaker gets a small jolt on every word, like a hand beat.
  const lastWord = line.words.findLast((w) => ms >= w.startMs);
  const emphasis = lastWord ? Math.exp(-(ms - lastWord.startMs) / 110) : 0;

  const background = backgrounds[line.location];
  const speakerX = xOf(line.character);
  const glowY = FLOOR - heightOf(cast, line.character) * 0.72;
  // Speaker is drawn last so they overlap their neighbours.
  const order = [...present].sort(
    (a, b) => Number(a === line.character) - Number(b === line.character),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div
        style={{
          position: "absolute",
          width: WORLD_W,
          height: WORLD_H,
          transformOrigin: "0 0",
          transform: `translate(${tx}px, ${ty}px) scale(${cam.z})`,
        }}
      >
        {background ? (
          <Img
            src={staticFile(background)}
            style={{ position: "absolute", width: WORLD_W, height: WORLD_H }}
          />
        ) : null}

        {line.fx.includes("brilho") ? (
          <Rays x={speakerX} y={glowY} local={local} />
        ) : null}

        {order.map((id) => {
          const member = cast.find((c) => c.id === id);
          if (!member) return null;
          const speaker = id === line.character;
          const struck = hit && id === line.fxTarget;
          const walk = walkOf(id);
          if (walk.gone) return null;
          return (
            <Character
              key={id}
              member={member}
              poses={posesOf(lines, id)}
              pose={
                speaker
                  ? line.pose
                  : struck || stillShocked(id)
                    ? "chocado"
                    : line.plateia || "neutro"
              }
              x={xOf(id) + walk.dx}
              stride={walk.stride}
              toward={Math.sign(speakerX - xOf(id))}
              reacting={!speaker && line.plateia !== ""}
              emphasis={speaker ? emphasis : 0}
              local={local}
              phase={present.indexOf(id) * 23}
              speaker={speaker}
              talking={speaker && isSpeaking(line, ms)}
              squash={struck ? Math.exp(-sinceImpact / 4) : 0}
            />
          );
        })}

        {line.fx.includes("brilho") ? (
          <Sparkles x={speakerX} y={glowY} local={local} />
        ) : null}

        {aftermath.map((l) =>
          props[l.fxProp] ? (
            <Drop
              key={`${l.fxProp}-${l.fxTarget}`}
              src={props[l.fxProp] as string}
              x={xOf(l.fxTarget)}
              headTop={FLOOR - heightOf(cast, l.fxTarget) * 0.96}
              since={999}
            />
          ) : null,
        )}

        {dropping && props[line.fxProp] ? (
          <Drop
            src={props[line.fxProp] as string}
            x={xOf(line.fxTarget)}
            headTop={FLOOR - heightOf(cast, line.fxTarget) * 0.96}
            since={local - dropStart}
          />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** CSS mask that shows only one region of a drawing, with a soft edge. */
const region = (m: Mouth): string =>
  `radial-gradient(ellipse ${m.rx * 100}% ${m.ry * 100}% at ${m.x * 100}% ${m.y * 100}%, black 55%, transparent 100%)`;

/** Every drawing a character needs in this episode, so they are all preloaded. */
const posesOf = (lines: Line[], id: string): string[] => {
  const poses = new Set(["neutro"]);
  for (const l of lines) {
    if (l.character === id) poses.add(l.pose);
    else if (l.plateia) poses.add(l.plateia);
    if (l.fx.includes("queda") && l.fxTarget === id) poses.add("chocado");
  }
  return [...poses];
};

const Character: React.FC<{
  member: CastMember;
  poses: string[];
  pose: string;
  x: number;
  local: number;
  phase: number;
  speaker: boolean;
  talking: boolean;
  squash: number;
  /** Frames into a walk, or 0 when standing. */
  stride: number;
  /** -1 or 1: side the current speaker is on. 0 for the speaker. */
  toward: number;
  /** Listener was given a reaction pose for this line. */
  reacting: boolean;
  /** 0 to 1 pulse on each spoken word. */
  emphasis: number;
}> = ({
  member,
  poses,
  pose,
  x,
  local,
  phase,
  speaker,
  talking,
  squash,
  stride,
  toward,
  reacting,
  emphasis,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Anticipation pop when a character takes the line.
  const pop = speaker
    ? spring({ frame: local, fps, config: { damping: 9, stiffness: 200 } })
    : 1;
  const breath = Math.sin((frame + phase) / 14) * 0.006;
  // Listeners turn to whoever speaks, a beat after the line starts, and hop
  // when the line gives them a reaction.
  const attention = spring({
    frame: local - 3 - (phase % 5),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const hop = reacting
    ? Math.sin(Math.min(1, Math.max(0, (local - 2) / 9)) * Math.PI) * 34
    : 0;
  const walking = stride > 0;
  const step = walking ? Math.abs(Math.sin(stride * 0.75)) * 24 : 0;
  const bob =
    (talking ? -Math.abs(Math.sin(local * 0.9)) * 8 : 0) -
    emphasis * 7 -
    hop -
    step;
  const tilt =
    (walking ? Math.sin(stride * 0.75) * 4 : 0) +
    (talking ? Math.sin(local * 0.33) * 1.6 : 0) +
    toward * 2.4 * attention;
  const scaleY =
    (0.94 + 0.06 * pop + breath + 0.02 * emphasis) * (1 - 0.2 * squash);
  const scaleX = (1 - breath - 0.01 * emphasis) * (1 + 0.14 * squash);

  // Blink every three seconds or so, each character on their own beat.
  const blinking =
    member.blink !== null && (frame + phase * 7) % 96 < 4 && !talking;

  // Lip sync: flap the mouth about six times a second while a word is spoken.
  const mouthOpen = talking && Math.floor(local / 2.5) % 2 === 0;
  const shown = poses.includes(pose) ? pose : "neutro";

  return (
    <div
      style={{
        position: "absolute",
        left: x - (CHAR_W * member.scale) / 2,
        top: FLOOR - CHAR_H * member.scale,
        width: CHAR_W * member.scale,
        height: CHAR_H * member.scale,
        transformOrigin: "50% 100%",
        transform: `translateY(${bob}px) rotate(${tilt}deg) scale(${scaleX}, ${scaleY})`,
        filter: speaker ? undefined : "brightness(0.9) saturate(0.9)",
      }}
    >
      {poses.map((p) => {
        const mouth = member.mouths[p];
        const fill = {
          position: "absolute",
          width: "100%",
          height: "100%",
        } as const;
        // Only the mouth region of the talking drawing is shown, so the
        // slight color drift between the two drawings never flickers.
        const mask = mouth ? region(mouth) : undefined;
        return (
          <div key={p} style={{ ...fill, opacity: p === shown ? 1 : 0 }}>
            <Img src={staticFile(`${member.dir}/${p}.png`)} style={fill} />
            {mouth ? (
              <Img
                src={staticFile(`${member.dir}/${p}-fala.png`)}
                style={{
                  ...fill,
                  opacity: mouthOpen ? 1 : 0,
                  maskImage: mask,
                  WebkitMaskImage: mask,
                }}
              />
            ) : null}
            {p === "neutro" && member.blink ? (
              <Img
                src={staticFile(`${member.dir}/neutro-pisca.png`)}
                style={{
                  ...fill,
                  opacity: blinking ? 1 : 0,
                  maskImage: region(member.blink),
                  WebkitMaskImage: region(member.blink),
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

/** Golden rays behind a character having an idea. */
const Rays: React.FC<{ x: number; y: number; local: number }> = ({
  x,
  y,
  local,
}) => {
  const { fps } = useVideoConfig();
  const grow = spring({
    frame: local,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const size = 1500;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        opacity: 0.85,
        transform: `scale(${grow}) rotate(${local * 1.4}deg)`,
        background: `repeating-conic-gradient(${colors.goldBright} 0deg 9deg, transparent 9deg 24deg)`,
        maskImage:
          "radial-gradient(circle, black 10%, rgba(0,0,0,0.6) 35%, transparent 68%)",
        WebkitMaskImage:
          "radial-gradient(circle, black 10%, rgba(0,0,0,0.6) 35%, transparent 68%)",
      }}
    />
  );
};

const Sparkles: React.FC<{ x: number; y: number; local: number }> = ({
  x,
  y,
  local,
}) => (
  <>
    {Array.from({ length: 7 }, (_, i) => {
      const angle = (i / 7) * Math.PI * 2 + local * 0.02;
      const radius = 330 + (i % 3) * 60;
      const twinkle = Math.abs(Math.sin(local / 4 + i * 1.7));
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x + Math.cos(angle) * radius - 40,
            top: y + Math.sin(angle) * radius - 40,
            width: 80,
            height: 80,
            fontSize: 80,
            lineHeight: "80px",
            textAlign: "center",
            color: colors.goldBright,
            WebkitTextStroke: `5px ${colors.ink}`,
            paintOrder: "stroke fill",
            transform: `scale(${0.4 + twinkle})`,
          }}
        >
          ✦
        </div>
      );
    })}
  </>
);

/** A prop that falls on a character's head, then bounces off to the floor. */
const Drop: React.FC<{
  src: string;
  x: number;
  headTop: number;
  since: number;
}> = ({ src, x, headTop, since }) => {
  const rest = headTop - PROP * 0.55;
  const after = since - FALL;
  let left = x;
  let top = lerp(-PROP - 200, rest, Math.min(1, since / FALL) ** 2);
  let rotate = -12;
  if (after > 0) {
    left = x + Math.min(300, after * 11);
    top = Math.min(FLOOR - PROP * 0.8, rest - 20 * after + 1.3 * after * after);
    rotate = -12 + Math.min(100, after * 9);
  }
  return (
    <>
      {after >= 0 && after < 6 ? (
        <div
          style={{
            position: "absolute",
            left: x - 160,
            top: headTop - 160,
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: `14px solid ${colors.card}`,
            opacity: 1 - after / 6,
            transform: `scale(${0.4 + after / 5})`,
          }}
        />
      ) : null}
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: left - PROP / 2,
          top,
          width: PROP,
          height: PROP,
          objectFit: "contain",
          transform: `rotate(${rotate}deg)`,
        }}
      />
    </>
  );
};
