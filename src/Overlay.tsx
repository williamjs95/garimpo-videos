import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, colors, displayFont, scriptFont } from "./theme";
import { type CastMember, type Line, SITE } from "./types";

// 9:16 safe zones (1080x1920): keep top ~120px, bottom ~320px and right ~120px clear.
const CAPTION_BOTTOM = 400;
const WORDS_PER_PAGE = 4;
// Closing card: where a close-up face sits, when the card opens, and the pan's size.
const IRIS_X = 540;
const IRIS_Y = 860;
const CARD_AT = 19;
const PAN = 1000;

export const Captions: React.FC<{
  line: Line;
  lineFrom: number;
  speechRate: number;
  speaker?: CastMember;
}> = ({ line, lineFrom, speechRate, speaker }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = ((frame - lineFrom) / fps) * 1000 * speechRate;

  // A silent beat has nothing to caption.
  if (!line.text) return null;
  const words =
    line.words.length > 0
      ? line.words
      : [{ text: line.text, startMs: 0, endMs: line.durationMs }];
  const activeIndex = Math.max(
    0,
    words.findLastIndex((w) => ms >= w.startMs),
  );
  const pageStart = Math.floor(activeIndex / WORDS_PER_PAGE) * WORDS_PER_PAGE;
  // Words appear as they are spoken, so the punch word is never shown early.
  const page = words.slice(pageStart, activeIndex + 1);
  const pageFrame = Math.round(
    ((words[pageStart]?.startMs ?? 0) / 1000 / speechRate) * fps,
  );
  const pop = spring({
    frame: frame - lineFrom - pageFrame,
    fps,
    config: { damping: 12, stiffness: 220 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: CAPTION_BOTTOM,
      }}
    >
      {speaker ? (
        <div
          style={{
            fontFamily: bodyFont,
            fontSize: 40,
            color: colors.card,
            backgroundColor: speaker.color,
            padding: "6px 22px",
            borderRadius: 999,
            marginBottom: 18,
            border: `4px solid ${colors.card}`,
            boxShadow: `0 6px 0 ${colors.ink}`,
            letterSpacing: 1,
          }}
        >
          {speaker.name}
        </div>
      ) : null}
      <div
        style={{
          maxWidth: 860,
          minHeight: 170,
          textAlign: "center",
          fontFamily: bodyFont,
          fontSize: 76,
          lineHeight: 1.12,
          color: "white",
          WebkitTextStroke: `14px ${colors.ink}`,
          paintOrder: "stroke fill",
          transform: `scale(${interpolate(pop, [0, 1], [0.85, 1])})`,
        }}
      >
        {page.map((w, i) => (
          <span
            key={`${pageStart + i}`}
            style={{
              color:
                pageStart + i === activeIndex ? colors.goldBright : "white",
            }}
          >
            {w.text}{" "}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Title card on screen from frame 0 (many people watch muted), then it tucks
 * away. Same pan rings and lettering as the closing card, so the two match.
 */
export const Hook: React.FC<{ text: string; number?: number }> = ({
  text,
  number,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = spring({
    frame: frame - Math.round(2.6 * fps),
    fps,
    config: { damping: 200 },
  });
  if (out >= 0.999) return null;
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        paddingTop: 150,
        transform: `translateY(${-out * 620}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 900,
          padding: "30px 48px 36px",
          borderRadius: 36,
          border: `10px solid ${colors.ink}`,
          boxShadow: `0 14px 0 ${colors.ink}`,
          background: `repeating-radial-gradient(circle at 50% 120%, ${colors.goldBright} 0 40px, ${colors.gold} 40px 80px)`,
          transform: "rotate(-1.5deg)",
          textAlign: "center",
        }}
      >
        {number ? (
          <div
            style={{
              position: "absolute",
              top: -44,
              left: 36,
              fontFamily: displayFont,
              fontSize: 40,
              color: colors.card,
              backgroundColor: colors.terra,
              padding: "6px 24px",
              borderRadius: 999,
              border: `6px solid ${colors.ink}`,
              transform: "rotate(-3deg)",
            }}
          >
            Episódio {number}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: scriptFont,
            fontSize: 84,
            lineHeight: 1.18,
            color: colors.card,
            WebkitTextStroke: `14px ${colors.ink}`,
            paintOrder: "stroke fill",
            textShadow: `0 8px 0 ${colors.ink}`,
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * The closing every episode ends on, in the tradition of classic cartoon
 * sign-offs: an iris shuts on the last speaker, then opens on the gold pan
 * seen from above while the site address writes itself across it.
 */
export const EndCard: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - from;
  if (t < 0) return null;

  // Close fast, hesitate on the face, then shut.
  const iris = interpolate(t, [0, 9, 14, 18], [1300, 190, 170, 0], {
    extrapolateRight: "clamp",
  });
  const open = spring({
    frame: t - CARD_AT,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const wrote = (start: number, end: number): number =>
    interpolate(t, [start, end], [0, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const sparkle = spring({
    frame: t - 53,
    fps,
    config: { damping: 8, stiffness: 200 },
  });
  const settle = spring({
    frame: t - 53,
    fps,
    config: { damping: 10, stiffness: 220 },
  });
  const script = {
    fontFamily: scriptFont,
    color: colors.card,
    WebkitTextStroke: `14px ${colors.ink}`,
    paintOrder: "stroke fill",
    textShadow: `0 10px 0 ${colors.ink}`,
    lineHeight: 1.25,
    padding: "0 30px",
    whiteSpace: "nowrap",
  } as const;
  const [name, tld] = [
    SITE.slice(0, SITE.indexOf(".")),
    SITE.slice(SITE.indexOf(".")),
  ];

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${IRIS_X}px ${IRIS_Y}px, transparent ${iris}px, ${colors.ink} ${iris + 3}px)`,
        }}
      />
      {t >= CARD_AT ? (
        <AbsoluteFill
          style={{
            backgroundColor: colors.terra,
            alignItems: "center",
            justifyContent: "center",
            clipPath: `circle(${open * 1300}px at 50% 50%)`,
          }}
        >
          {/* The pan from above: its ridges are the rings of the sign-off. */}
          <div
            style={{
              position: "absolute",
              width: PAN,
              height: PAN,
              borderRadius: "50%",
              background: `repeating-radial-gradient(circle, ${colors.goldBright} 0 46px, ${colors.gold} 46px 92px)`,
              border: `22px solid ${colors.ink}`,
              boxShadow: `0 26px 0 ${colors.ink}`,
              transform: `scale(${0.9 + 0.1 * open})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: PAN,
              height: PAN,
              borderRadius: "50%",
              opacity: 0.5,
              background:
                "conic-gradient(from 0deg, transparent 0 8%, white 14%, transparent 22% 55%, white 61%, transparent 68%)",
              transform: `rotate(${t * 1.2 - 30}deg)`,
              mixBlendMode: "soft-light",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `rotate(-7deg) scale(${1 + 0.06 * settle * (1 - settle) * 4})`,
            }}
          >
            <div
              style={{
                ...script,
                fontSize: 138,
                clipPath: `inset(-40px ${100 - wrote(CARD_AT + 8, CARD_AT + 24)}% -40px 0)`,
              }}
            >
              {name}
            </div>
            <div
              style={{
                ...script,
                fontSize: 112,
                marginTop: -34,
                marginLeft: 300,
                clipPath: `inset(-40px ${100 - wrote(CARD_AT + 24, CARD_AT + 33)}% -40px 0)`,
              }}
            >
              {tld}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 820,
              top: 660,
              fontSize: 150,
              lineHeight: "150px",
              color: colors.card,
              WebkitTextStroke: `8px ${colors.ink}`,
              paintOrder: "stroke fill",
              transform: `scale(${sparkle}) rotate(${t * 2}deg)`,
            }}
          >
            ✦
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
