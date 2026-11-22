import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Captions, EndCard, Hook } from "./Overlay";
import { Sound } from "./Sound";
import { Stage } from "./Stage";
import { colors } from "./theme";
import { END_CARD_FRAMES, layoutLines, type TimedLine } from "./timing";
import { DEFAULT_MUSIC, type EpisodeProps } from "./types";

export const Episode: React.FC<EpisodeProps> = ({
  hook,
  lines,
  cast,
  backgrounds,
  props,
  scenery = [],
  order = [],
  weights = {},
  number,
  music = DEFAULT_MUSIC,
  speechRate = 1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const timed = layoutLines(lines, speechRate);
  const cardFrom = durationInFrames - END_CARD_FRAMES;
  // The last line holds on screen while the iris closes over it.
  const current = currentLine(timed, Math.min(frame, cardFrom - 1));
  const line = lines[current.index];

  if (!line)
    return <AbsoluteFill style={{ backgroundColor: colors.background }} />;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <Stage
        lines={lines}
        timed={timed}
        index={current.index}
        cast={cast}
        backgrounds={backgrounds}
        props={props}
        scenery={scenery}
        order={order}
        weights={weights}
        speechRate={speechRate}
      />

      <Captions
        speechRate={line.rate ?? speechRate}
        line={line}
        lineFrom={current.from}
        speaker={cast.find((c) => c.id === line.character)}
      />

      <Hook text={hook} number={number} />

      <EndCard from={cardFrom} />

      <Sound
        lines={lines}
        timed={timed}
        music={music}
        cardFrom={cardFrom}
        weights={weights}
      />

      {timed.map((t) => {
        const l = lines[t.index];
        return l?.audio ? (
          <Sequence
            key={t.index}
            from={t.from}
            durationInFrames={t.durationInFrames}
            layout="none"
          >
            <Audio
              src={staticFile(l.audio)}
              playbackRate={l.rate ?? speechRate}
              trimBefore={Math.round((l.offsetMs / 1000) * fps)}
            />
          </Sequence>
        ) : null;
      })}
    </AbsoluteFill>
  );
};

const currentLine = (timed: TimedLine[], frame: number): TimedLine => {
  const found = [...timed].reverse().find((t) => frame >= t.from);
  return (
    found ??
    timed[0] ?? { index: 0, from: 0, durationInFrames: 1, speechFrames: 1 }
  );
};
