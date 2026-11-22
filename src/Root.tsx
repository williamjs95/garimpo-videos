import { type CalculateMetadataFunction, Composition } from "remotion";
import { Episode } from "./Episode";
import { totalFrames } from "./timing";
import { type EpisodeProps, FPS } from "./types";

const calculateMetadata: CalculateMetadataFunction<EpisodeProps> = ({
  props,
}) => ({
  durationInFrames: totalFrames(props.lines, props.speechRate),
  defaultOutName: props.slug,
});

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Episode"
      component={Episode}
      durationInFrames={90}
      fps={FPS}
      width={1080}
      height={1920}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        slug: "vazio",
        hook: "Rode npm run make",
        lines: [],
        cast: [],
        backgrounds: {},
        props: {},
      }}
    />
  );
};
