import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, colors, displayFont } from "./theme";
import { type CastMember, END_CARD_MS, type Line } from "./types";

// 9:16 safe zones (1080x1920): keep top ~120px, bottom ~320px and right ~120px clear.
const CAPTION_BOTTOM = 400;
const WORDS_PER_PAGE = 4;

export const Captions: React.FC<{
  line: Line;
  lineFrom: number;
  speechRate: number;
  speaker?: CastMember;
}> = ({ line, lineFrom, speechRate, speaker }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = ((frame - lineFrom) / fps) * 1000 * speechRate;

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

/** On-screen hook from frame 0 (many people watch muted), then it tucks away. */
export const Hook: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = spring({
    frame: frame - Math.round(2.6 * fps),
    fps,
    config: { damping: 200 },
  });
  if (out >= 0.999) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
      <div
        style={{
          maxWidth: 880,
          fontFamily: displayFont,
          fontSize: 88,
          lineHeight: 1.05,
          textAlign: "center",
          color: colors.card,
          backgroundColor: colors.terra,
          padding: "22px 36px",
          borderRadius: 28,
          boxShadow: `0 10px 0 ${colors.ink}`,
          transform: `translateY(${-out * 500}px) rotate(-1.5deg)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Optional end card: site handle, plus the series call to action when there is one. */
export const Handle: React.FC<{ durationInFrames: number; outro?: string }> = ({
  durationInFrames,
  outro,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = durationInFrames - Math.round((END_CARD_MS / 1000) * fps);
  if (frame < start) return null;
  const opacity = interpolate(frame, [start, start + 8], [0, 1], {
    extrapolateRight: "clamp",
  });
  const pop = spring({
    frame: frame - start - 6,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  return (
    <AbsoluteFill
      style={{ alignItems: "center", paddingTop: 170, gap: 24, opacity }}
    >
      {outro ? (
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 96,
            color: colors.card,
            backgroundColor: colors.terra,
            padding: "18px 44px",
            borderRadius: 28,
            boxShadow: `0 10px 0 ${colors.ink}`,
            transform: `scale(${pop}) rotate(-2deg)`,
          }}
        >
          {outro}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 48,
          color: colors.ink,
          backgroundColor: colors.card,
          padding: "10px 28px",
          borderRadius: 999,
          border: `4px solid ${colors.gold}`,
        }}
      >
        garimpoeditais.com.br
      </div>
    </AbsoluteFill>
  );
};
