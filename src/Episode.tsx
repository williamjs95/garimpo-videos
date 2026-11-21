import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Captions, Handle, Hook } from "./Overlay";
import { Sound } from "./Sound";
import { Stage } from "./Stage";
import { colors } from "./theme";
import { layoutLines, type TimedLine } from "./timing";
import type { EpisodeProps } from "./types";

export const Episode: React.FC<EpisodeProps> = ({
  hook,
  lines,
  cast,
  backgrounds,
  props,
  showHandle,
  outro,
  speechRate = 1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const timed = layoutLines(lines, speechRate);
  const current = currentLine(timed, frame);
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
        speechRate={speechRate}
      />

      <Captions
        speechRate={speechRate}
        line={line}
        lineFrom={current.from}
        speaker={cast.find((c) => c.id === line.character)}
      />

      <Hook text={hook} />

      {showHandle ? (
        <Handle durationInFrames={durationInFrames} outro={outro} />
      ) : null}

      <Sound lines={lines} timed={timed} />

      {timed.map((t) => {
        const l = lines[t.index];
        return l ? (
          <Sequence
            key={t.index}
            from={t.from}
            durationInFrames={t.durationInFrames}
            layout="none"
          >
            <Audio
              src={staticFile(l.audio)}
              playbackRate={speechRate}
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
