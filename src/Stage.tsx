import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, displayFont } from "./theme";
import type { TimedLine } from "./timing";
import {
  type CastMember,
  DROP_FALL_FRAMES,
  DROP_HANG_FRAMES as HANG,
  type Line,
  type Mouth,
  type Scenery,
  type Weight,
  WEIGHTS,
  weightOf,
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
export const presentIn = (
  lines: Line[],
  location: string,
  order: string[] = [],
): string[] => {
  const ids: string[] = [];
  for (const l of lines) {
    if (l.location !== location) continue;
    for (const id of [l.character, l.fx.includes("queda") ? l.fxTarget : ""]) {
      if (id && !ids.includes(id)) ids.push(id);
    }
  }
  // Anyone the episode placed by hand goes first, in that order.
  const rank = (id: string): number =>
    order.includes(id) ? order.indexOf(id) : order.length + ids.indexOf(id);
  return [...ids].sort((a, b) => rank(a) - rank(b));
};

const heightOf = (cast: CastMember[], id: string): number =>
  CHAR_H * (cast.find((c) => c.id === id)?.scale ?? 1);

/**
 * Height of a point on a character's drawing (0 = soles line of the image,
 * 1 = top), in world pixels. Drawings have empty space under the shoes, so
 * each one is lowered until its soles touch the floor.
 */
const levelOf = (cast: CastMember[], id: string, at: number): number => {
  const feet = cast.find((c) => c.id === id)?.feet ?? 1;
  return FLOOR - heightOf(cast, id) * (at - (1 - feet));
};

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
  scenery: Scenery[];
  order: string[];
  weights: Record<string, Weight>;
  speechRate: number;
}> = ({
  lines,
  timed,
  index,
  cast,
  backgrounds,
  props,
  scenery,
  order: placed,
  weights,
  speechRate,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = lines[index];
  const time = timed[index];
  if (!line || !time) return null;

  const local = frame - time.from;
  const ms = (local / fps) * 1000 * (line.rate ?? speechRate);
  const present = presentIn(lines, line.location, placed);
  const xOf = (id: string): number =>
    slotX(present.length, Math.max(0, present.indexOf(id)));

  const shot = (l: Line): Camera => {
    // Two-shot: both characters in frame, for a line aimed at someone.
    // A throw is framed the same way, so the object is seen leaving and landing.
    const partner =
      l.fx === "arremesso"
        ? l.fxTarget
        : l.camera === "dupla"
          ? l.com || l.fxTarget
          : "";
    if (partner) {
      return {
        x: (xOf(l.character) + xOf(partner)) / 2,
        y: 1000,
        z: 1.02,
      };
    }
    return l.camera === "close"
      ? {
          x: xOf(l.character),
          y: levelOf(cast, l.character, 0.74),
          z: 1.5,
        }
      : { x: xOf(l.character), y: 1040, z: 1.12 };
  };

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
  const weight = weightOf(weights, line.fxProp);
  const sinceImpact = local - dropStart - HANG - weight.fall;
  // On impact everything freezes for a beat; reactions start after it.
  const afterHold = Math.max(0, sinceImpact - weight.hold);
  const dropping = line.fx.includes("queda") && local >= dropStart;
  // The prop hangs overhead for a beat before it falls: time to look up.
  const hanging = dropping && sinceImpact < 0;
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
    if (l.fx.includes("queda") || l.fx === "briga") aftermath.push(l);
  }
  const stillShocked = (id: string): boolean =>
    aftermath.some((l) => l.fxTarget === id);
  // Poses that stick: whoever fell asleep stays asleep, whatever is said.
  const stuck: Record<string, string> = {};
  lines.forEach((l, i) => {
    if (i > index || l.location !== line.location) return;
    for (const s of l.estado ?? []) {
      // The speaker's own change waits until they finish the line.
      if (i === index && s.quem === l.character && local < time.speechFrames)
        continue;
      if (s.pose) stuck[s.quem] = s.pose;
      else delete stuck[s.quem];
    }
  });
  const poseOf = (id: string): string => {
    const struck = hit && id === line.fxTarget;
    if (id === line.character) {
      return local >= time.speechFrames && stuck[id] ? stuck[id] : line.pose;
    }
    if (stuck[id]) return stuck[id];
    if (struck || stillShocked(id) || noticed(id)) return "chocado";
    return line.plateia || "neutro";
  };
  // The pose each character held when line i ended: where a take starts from.
  const settledPose = (i: number, id: string): string => {
    const l = lines[i];
    if (!l) return "neutro";
    const held: Record<string, string> = {};
    lines.forEach((x, j) => {
      if (j > i || x.location !== l.location) return;
      for (const s of x.estado ?? []) {
        if (s.pose) held[s.quem] = s.pose;
        else delete held[s.quem];
      }
    });
    if (held[id]) return held[id];
    if (l.character === id) return l.pose;
    for (let j = i; j >= 0; j--) {
      const x = lines[j];
      if (!x || x.location !== l.location) break;
      if ((x.fx.includes("queda") || x.fx === "briga") && x.fxTarget === id)
        return "chocado";
    }
    return l.plateia || "neutro";
  };
  const fromPose = (id: string): string =>
    prev && prev.location === line.location
      ? settledPose(index - 1, id)
      : poseOf(id);
  // Listeners react one after another, a few frames apart, never in unison.
  const listeners = present.filter((id) => id !== line.character);
  const changeAt = (id: string): number =>
    id === line.character ? 0 : 2 + listeners.indexOf(id) * 3;

  // While the prop hangs, the others notice one by one; whoever is under it
  // notices last, just before it falls.
  const noticeAt = (id: string): number =>
    dropStart +
    (id === line.fxTarget
      ? HANG - 4
      : 2 + Math.max(0, listeners.indexOf(id)) * 2);
  function noticed(id: string): boolean {
    return hanging && local >= noticeAt(id);
  }
  const calm = (id: string): string =>
    stuck[id] ?? (stillShocked(id) ? "chocado" : line.plateia || "neutro");

  const shake = hit
    ? sinceImpact < weight.hold
      ? weight.shake
      : weight.shake * Math.exp(-afterHold / 5)
    : line.fx === "briga"
      ? 9
      : 0;

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
  ): { dx: number; gone: boolean; stride: number; landed?: number } => {
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
            // Skids to a stop: a squash that springs back.
            landed: t < 1 ? 0 : Math.exp(-(local - WALK) / 4) * 0.45,
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
  const glowY = levelOf(cast, line.character, 0.72);
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

        {scenery.map((s) => {
          const src = props[s.prop];
          if (!src || !present.includes(s.beside)) return null;
          // It sways before something falls off it, and shudders after.
          const falls = line.fx.includes("queda") && line.fxTarget === s.beside;
          const sway = falls
            ? Math.sin(local * 0.9) *
              (sinceImpact >= 0
                ? 3 * Math.exp(-sinceImpact / 8)
                : 2.5 * Math.min(1, Math.max(0, (local - dropStart + 14) / 14)))
            : 0;
          return (
            <Img
              key={`${s.prop}-${s.beside}`}
              src={staticFile(src)}
              style={{
                position: "absolute",
                left: xOf(s.beside) + s.side * 300 - s.height / 2,
                top: FLOOR - 30 - s.height,
                width: s.height,
                height: s.height,
                objectFit: "contain",
                objectPosition: "50% 100%",
                transformOrigin: "50% 100%",
                transform: `rotate(${sway}deg)`,
              }}
            />
          );
        })}

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
              pose={poseOf(id)}
              from={
                dropping && !speaker && !stuck[id] ? calm(id) : fromPose(id)
              }
              changeAt={
                dropping && !speaker && !stuck[id] ? noticeAt(id) : changeAt(id)
              }
              x={xOf(id) + walk.dx}
              stride={walk.stride}
              toward={Math.sign(speakerX - xOf(id))}
              reacting={!speaker && !stuck[id] && line.plateia !== ""}
              catching={
                line.fx === "arremesso" && id === line.fxTarget
                  ? local - TOSS_AT - TOSS_FRAMES
                  : -1
              }
              emphasis={speaker ? emphasis : 0}
              local={local}
              phase={present.indexOf(id) * 23}
              speaker={speaker}
              talking={speaker && isSpeaking(line, ms)}
              squash={
                (struck
                  ? weight.squash *
                    (sinceImpact < weight.hold ? 1 : Math.exp(-afterHold / 4))
                  : 0) + (walk.landed ?? 0)
              }
            />
          );
        })}

        {line.fx.includes("brilho") ? (
          <Sparkles x={speakerX} y={glowY} local={local} />
        ) : null}

        {line.fx === "coracoes" ? (
          <Hearts
            x={speakerX}
            y={levelOf(cast, line.character, 0.9)}
            local={local}
          />
        ) : null}

        {line.fx === "arremesso" && props[line.fxProp] ? (
          <Toss
            src={props[line.fxProp] as string}
            from={speakerX}
            to={xOf(line.fxTarget)}
            y={levelOf(cast, line.character, 0.5)}
            since={local - TOSS_AT}
          />
        ) : null}

        {line.fx === "briga" ? (
          <Brawl
            x={(speakerX + xOf(line.fxTarget)) / 2}
            local={local}
            total={time.durationInFrames}
          />
        ) : null}

        {present.map((id) => {
          if (walkOf(id).gone) return null;
          const top = levelOf(cast, id, 0.97);
          if (poseOf(id) === "dormindo") {
            return <Snore key={id} x={xOf(id)} y={top} phase={xOf(id)} />;
          }
          if ((hit && id === line.fxTarget) || stillShocked(id)) {
            return <Dizzy key={id} x={xOf(id)} y={top} local={local} />;
          }
          const glyph =
            id === line.character
              ? undefined
              : noticed(id)
                ? "!"
                : MARKS[line.plateia];
          return glyph ? (
            <Mark
              key={id}
              glyph={glyph}
              x={xOf(id)}
              y={top}
              local={local}
              phase={present.indexOf(id)}
            />
          ) : null;
        })}

        {line.placa ? (
          <Sign
            text={line.placa}
            x={speakerX + 175}
            y={levelOf(cast, line.character, 0.62)}
            local={local}
          />
        ) : null}

        {line.tela ? (
          <Phone
            screen={line.tela}
            x={speakerX + 235}
            y={levelOf(cast, line.character, 0.52)}
            local={local}
          />
        ) : null}

        {aftermath.map((l) =>
          props[l.fxProp] ? (
            <Drop
              key={`${l.fxProp}-${l.fxTarget}`}
              src={props[l.fxProp] as string}
              x={xOf(l.fxTarget)}
              headTop={levelOf(cast, l.fxTarget, 0.96)}
              since={999}
              local={0}
              weight={weightOf(weights, l.fxProp)}
            />
          ) : null,
        )}

        {dropping && props[line.fxProp] ? (
          <Drop
            src={props[line.fxProp] as string}
            x={xOf(line.fxTarget)}
            headTop={levelOf(cast, line.fxTarget, 0.96)}
            since={local - dropStart}
            local={local}
            weight={weight}
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
    if (l.fx.includes("queda")) poses.add("chocado");
    for (const s of l.estado ?? [])
      if (s.quem === id && s.pose) poses.add(s.pose);
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
  /** Frames since this character caught a thrown prop; negative before. */
  catching: number;
  /** Pose held before this line; a change from it plays as a take. */
  from: string;
  /** Frame of the line the change happens on (listeners are staggered). */
  changeAt: number;
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
  catching,
  from,
  changeAt,
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
    ? Math.sin(Math.min(1, Math.max(0, (local - changeAt) / 9)) * Math.PI) * 24
    : 0;
  // A little jump on the catch.
  const grab =
    catching >= 0 ? Math.sin(Math.min(1, catching / 8) * Math.PI) * 40 : 0;
  const walking = stride > 0;

  // A take: the body sinks a little in the old pose (anticipation), the new
  // drawing appears already stretched, then settles with a small wobble.
  // Timings follow the classic take (School of Motion), converted to 30 fps.
  const strong = ["chocado", "animado", "bravo"].includes(pose);
  const antic = strong ? 6 : 4;
  const amount = strong ? 1 : 0.5;
  const sinceChange = local - changeAt;
  const changing = from !== pose && !walking;
  let drawn = pose;
  let take = 1;
  if (changing && sinceChange < antic) {
    drawn = from;
    if (sinceChange >= 0) {
      take = 1 - 0.08 * amount * (1 - (1 - sinceChange / antic) ** 2);
    }
  } else if (changing && sinceChange < antic + 20) {
    const u = sinceChange - antic;
    take = 1 + 0.1 * amount * Math.exp(-u / 4) * Math.cos(u * 0.6);
  }

  const step = walking ? Math.abs(Math.sin(stride * 0.75)) * 24 : 0;
  const bob =
    (talking ? -Math.abs(Math.sin(local * 0.9)) * 8 : 0) -
    emphasis * 7 -
    hop -
    grab -
    step;
  const tilt =
    (walking ? Math.sin(stride * 0.75) * 4 + toward * 7 : 0) +
    (talking ? Math.sin(local * 0.33) * 1.6 : 0) +
    toward * 2.4 * attention;
  // Running stretches the body tall and thin; an impact squashes it flat.
  const stretch = walking ? 0.07 : 0;
  // Squash and stretch keep the body's area: what it loses in height it
  // gains in width.
  const scaleY =
    (0.94 + 0.06 * pop + breath + 0.02 * emphasis) *
    (1 - 0.2 * squash) *
    (1 + stretch) *
    take;
  const scaleX =
    ((1 - breath - 0.01 * emphasis) * (1 - stretch)) /
    (1 - 0.2 * squash) /
    take;

  // Blink every three seconds or so, each character on their own beat.
  const blinking =
    member.blink !== null && (frame + phase * 7) % 96 < 4 && !talking;

  // Lip sync: flap the mouth about six times a second while a word is spoken.
  const mouthOpen = talking && Math.floor(local / 2.5) % 2 === 0;
  const shown = poses.includes(drawn) ? drawn : "neutro";
  // Soles on the floor line, with a shadow that shrinks as the body lifts.
  const sink = (1 - (member.feet ?? 1)) * CHAR_H * member.scale;
  const shadowW = CHAR_W * member.scale * 0.56;
  const lift = Math.min(1, Math.max(0, -bob) / 90);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - shadowW / 2,
          top: FLOOR - 26,
          width: shadowW,
          height: 52,
          borderRadius: "50%",
          backgroundColor: colors.ink,
          opacity: 0.26 * (1 - 0.5 * lift),
          filter: "blur(6px)",
          transform: `scale(${(1 - 0.3 * lift) * (1 + 0.14 * squash)})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - (CHAR_W * member.scale) / 2,
          top: FLOOR - CHAR_H * member.scale + sink,
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
    </>
  );
};

/** Comic-book mark over a listener's head, by reaction pose. */
const MARKS: Record<string, string> = { chocado: "!", pensando: "?" };

const Mark: React.FC<{
  glyph: string;
  x: number;
  y: number;
  local: number;
  phase: number;
}> = ({ glyph, x, y, local, phase }) => {
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: local - 3 - phase * 2,
    fps,
    config: { damping: 8, stiffness: 220 },
  });
  const size = 190;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2 + 70,
        top: y - size - 10 - 34 * Math.min(1, pop),
        width: size,
        height: size,
        fontFamily: displayFont,
        fontWeight: 800,
        fontSize: size,
        lineHeight: `${size}px`,
        textAlign: "center",
        color: colors.goldBright,
        WebkitTextStroke: `16px ${colors.ink}`,
        paintOrder: "stroke fill",
        transformOrigin: "50% 100%",
        transform: `scale(${pop}) rotate(${10 + Math.sin(local / 5 + phase) * 5}deg)`,
      }}
    >
      {glyph}
    </div>
  );
};

/** Frame of the line a thrown prop leaves the hand, and how long it flies. */
export const TOSS_AT = 10;
export const TOSS_FRAMES = 16;

/** A prop thrown in a spinning arc from one character to another, who catches it. */
const Toss: React.FC<{
  src: string;
  from: number;
  to: number;
  y: number;
  since: number;
}> = ({ src, from, to, y, since }) => {
  if (since < 0 || since > TOSS_FRAMES + 5) return null;
  const t = Math.min(1, since / TOSS_FRAMES);
  const size = 190;
  // After the catch it shrinks into the hand.
  const caught = Math.max(0, since - TOSS_FRAMES) / 5;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left: lerp(from, to, t) - size / 2,
        top: y - Math.sin(t * Math.PI) * 520 - size / 2,
        width: size,
        height: size,
        objectFit: "contain",
        transform: `rotate(${since * 34}deg) scale(${1 - caught})`,
      }}
    />
  );
};

/** Hearts drifting up around someone smitten. */
const Hearts: React.FC<{ x: number; y: number; local: number }> = ({
  x,
  y,
  local,
}) => (
  <>
    {Array.from({ length: 6 }, (_, i) => {
      const t = ((local * 1.1 + i * 9) % 54) / 54;
      const side = i % 2 === 0 ? -1 : 1;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x + side * (150 + (i % 3) * 55) + Math.sin(t * 6 + i) * 22,
            top: y + 120 - t * 420,
            fontSize: 96,
            lineHeight: 1,
            color: HEART,
            WebkitTextStroke: `9px ${colors.ink}`,
            paintOrder: "stroke fill",
            opacity: Math.min(1, t * 6) * Math.min(1, (1 - t) * 3),
            transform: `scale(${0.6 + t * 0.6}) rotate(${side * 14}deg)`,
          }}
        >
          ♥
        </div>
      );
    })}
  </>
);
const HEART = "#e5484d";

/**
 * Cartoon scuffle: a churning dust cloud hides the two fighters, with stars
 * flying out. Nobody is shown getting hurt.
 */
const Brawl: React.FC<{ x: number; local: number; total: number }> = ({
  x,
  local,
  total,
}) => {
  const { fps } = useVideoConfig();
  const grow = spring({ frame: local, fps, config: { damping: 11 } });
  const fade = interpolate(local, [total - 7, total], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cy = FLOOR - 560;
  return (
    <div style={{ opacity: fade }}>
      {Array.from({ length: 11 }, (_, i) => {
        const angle = (i / 11) * Math.PI * 2 + local * 0.35;
        const r = 210 + Math.sin(local * 0.9 + i * 2.1) * 60;
        const size = 420 + Math.sin(local * 0.7 + i) * 70;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(angle) * r * 1.75 - size / 2,
              top: cy + Math.sin(angle) * r - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: colors.card,
              border: `12px solid ${colors.ink}`,
              transform: `scale(${grow})`,
            }}
          />
        );
      })}
      {/* The filling, so no outline shows through the middle. */}
      <div
        style={{
          position: "absolute",
          left: x - 500,
          top: cy - 340,
          width: 1000,
          height: 680,
          borderRadius: "50%",
          backgroundColor: colors.card,
          transform: `scale(${grow})`,
        }}
      />
      {["✦", "!", "✦", "#", "!", "✦"].map((glyph, i) => {
        const t = ((local + i * 5) % 16) / 16;
        const angle = i * 1.05 + Math.floor((local + i * 5) / 16) * 0.8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(angle) * (200 + t * 420) - 60,
              top: cy + Math.sin(angle) * (160 + t * 330) - 60,
              width: 120,
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 110,
              lineHeight: "120px",
              textAlign: "center",
              color: i % 2 ? HEART : colors.goldBright,
              WebkitTextStroke: `9px ${colors.ink}`,
              paintOrder: "stroke fill",
              opacity: 1 - t,
              transform: `rotate(${local * 9 + i * 40}deg)`,
            }}
          >
            {glyph}
          </div>
        );
      })}
    </div>
  );
};

/** Floating Zs over someone asleep. */
const Snore: React.FC<{ x: number; y: number; phase: number }> = ({
  x,
  y,
  phase,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 1, 2].map((i) => {
        // Each Z drifts up and away, growing, then starts over.
        const t = ((frame + phase + i * 15) % 45) / 45;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + 90 + t * 150,
              top: y - 40 - t * 260,
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 70 + t * 80,
              lineHeight: 1,
              color: colors.card,
              WebkitTextStroke: `12px ${colors.ink}`,
              paintOrder: "stroke fill",
              opacity: Math.min(1, t * 5) * Math.min(1, (1 - t) * 3),
              transform: `rotate(${-12 + t * 20}deg)`,
            }}
          >
            Z
          </div>
        );
      })}
    </>
  );
};

/** The speaker's phone, held up big enough to read: a label and a value. */
const Phone: React.FC<{
  screen: string;
  x: number;
  y: number;
  local: number;
}> = ({ screen, x, y, local }) => {
  const { fps } = useVideoConfig();
  const [label = "", value = ""] = screen.split("|");
  const up = spring({
    frame: local - 5,
    fps,
    config: { damping: 10, stiffness: 170 },
  });
  const width = 370;
  const height = 560;
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height,
        width,
        height,
        boxSizing: "border-box",
        padding: "56px 20px 30px",
        borderRadius: 54,
        border: `14px solid ${colors.ink}`,
        backgroundColor: colors.card,
        boxShadow: `0 14px 0 ${colors.ink}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        textAlign: "center",
        transformOrigin: "30% 100%",
        transform: `scale(${up}) rotate(${7 + Math.sin(local / 7) * 1.5}deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          width: 96,
          height: 16,
          borderRadius: 8,
          backgroundColor: colors.ink,
        }}
      />
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          // Long labels shrink so they fit on one or two lines.
          fontSize: label.length > 10 ? 34 : 50,
          lineHeight: 1.05,
          color: colors.card,
          backgroundColor: colors.terra,
          padding: "12px 22px",
          borderRadius: 999,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          // A short value (a score) fills the screen; a phrase wraps smaller.
          fontSize: value.length <= 3 ? 210 : value.length <= 6 ? 116 : 70,
          lineHeight: 1.05,
          color: colors.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
};

/** A hand-painted sign on a stick, held up instead of speaking. */
const Sign: React.FC<{ text: string; x: number; y: number; local: number }> = ({
  text,
  x,
  y,
  local,
}) => {
  const { fps } = useVideoConfig();
  const up = spring({
    frame: local - 4,
    fps,
    config: { damping: 9, stiffness: 150 },
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x - 300,
        top: y - 260,
        width: 600,
        height: 1200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transformOrigin: "50% 100%",
        transform: `translateY(${(1 - up) * 900}px) rotate(${4 + Math.sin(local / 6) * 1.5}deg)`,
      }}
    >
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 76,
          lineHeight: 1.1,
          color: colors.ink,
          backgroundColor: colors.card,
          padding: "30px 36px",
          border: `12px solid ${colors.ink}`,
          borderRadius: 18,
          boxShadow: `0 12px 0 ${colors.ink}`,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
      <div
        style={{
          width: 34,
          flex: 1,
          marginTop: -6,
          backgroundColor: colors.terra,
          border: `10px solid ${colors.ink}`,
          borderTop: "none",
        }}
      />
    </div>
  );
};

/** Stars circling the head of whoever just got hit. */
const Dizzy: React.FC<{ x: number; y: number; local: number }> = ({
  x,
  y,
  local,
}) => (
  <>
    {Array.from({ length: 3 }, (_, i) => {
      const angle = local * 0.22 + (i / 3) * Math.PI * 2;
      const depth = Math.sin(angle);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x + Math.cos(angle) * 170 - 35,
            top: y - 20 + depth * 34 - 35,
            width: 70,
            height: 70,
            fontSize: 70,
            lineHeight: "70px",
            textAlign: "center",
            color: colors.goldBright,
            WebkitTextStroke: `5px ${colors.ink}`,
            paintOrder: "stroke fill",
            opacity: 0.6 + 0.4 * (depth + 1) * 0.5,
            transform: `scale(${0.75 + 0.25 * depth})`,
          }}
        >
          ✦
        </div>
      );
    })}
  </>
);

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
  local: number;
  weight: (typeof WEIGHTS)[Weight];
}> = ({ src, x, headTop, since, local, weight }) => {
  const rest = headTop - PROP * 0.55;
  const hover = rest - 430;
  const fall = weight.fall;
  const after = since - HANG - fall;
  // Light things drift down swaying; heavy ones drop straight.
  const light = fall > DROP_FALL_FRAMES;
  let left = x;
  // Drops in, hangs wobbling, then falls the rest of the way.
  const enter = 1 - (1 - Math.min(1, since / 5)) ** 3;
  const t = Math.min(1, (since - HANG) / fall);
  let top =
    since < HANG
      ? lerp(-PROP - 200, hover, enter) + Math.sin(local * 1.3) * 7
      : lerp(hover, rest, light ? t : t ** 2);
  let rotate = since < HANG ? -12 + Math.sin(local * 0.9) * 5 : -12;
  if (since >= HANG && after < 0 && light) {
    left = x + Math.sin(since * 0.45) * 60 * (1 - t);
    rotate = -12 + Math.sin(since * 0.45) * 25 * (1 - t);
  }
  // Rests on the head during the impact freeze, then bounces off.
  const off = after - weight.hold;
  if (after >= 0 && off <= 0) top = rest;
  if (off > 0) {
    const b = weight.bounce;
    left = x + Math.min(300 * b + 40, off * 11 * b);
    top = Math.min(FLOOR - PROP * 0.8, rest - 20 * b * off + 1.3 * off * off);
    rotate = -12 + Math.min(100 * b + 10, off * 9 * b);
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
