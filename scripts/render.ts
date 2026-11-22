/**
 * Renders episodes/<slug>/props.json to out/<slug>.mp4, plus three check stills
 * (hook, middle, last frame) and episodes/<slug>/post.md ready to paste.
 * Usage: npm run render -- <slug>
 */
import { execFileSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { totalFrames } from "../src/timing.ts";
import type { EpisodeProps } from "../src/types.ts";
import {
  type EpisodeScript,
  episodeDir,
  log,
  outName,
  readJson,
  requireSlug,
  ROOT,
} from "./lib/shared.ts";
import { masterVideo } from "./lib/diction.ts";

const slug = requireSlug();
const dir = episodeDir(slug);
const propsPath = join(dir, "props.json");
const props = readJson<EpisodeProps>(propsPath);
const script = readJson<EpisodeScript>(join(dir, "script.json"));
const frames = totalFrames(props.lines, props.speechRate);
const name = outName(script);
const episode = script.number ? `Episódio ${script.number}: ` : "";
const ep = script.number ? `Ep. ${script.number} · ` : "";

const remotion = (args: string[]): void => {
  execFileSync("npx", ["remotion", ...args, `--props=${propsPath}`], {
    cwd: ROOT,
    stdio: "inherit",
  });
};

log("Renderizando quadros de conferência…");
for (const [still, frame] of [
  ["1-gancho", 10],
  ["2-meio", Math.floor(frames / 2)],
  ["3-final", frames - 1],
] as const) {
  remotion([
    "still",
    "Episode",
    join("out", name, `${still}.png`),
    `--frame=${frame}`,
  ]);
}

log("Renderizando vídeo 1080x1920…");
const raw = join("out", `${name}.bruto.mp4`);
remotion(["render", "Episode", raw, "--codec=h264", "--crf=20"]);

// Same loudness as the rest of the feed (about -14 LUFS), so nobody has to
// turn the phone up to understand the lines.
log("Ajustando o volume final…");
const master = masterVideo(join(ROOT, raw), join(ROOT, "out", `${name}.mp4`));
rmSync(join(ROOT, raw));
log(`Volume final: ${master.lufs} LUFS, pico ${master.peak} dBTP`);

const tags = script.post.hashtags
  .map((h) => (h.startsWith("#") ? h : `#${h}`))
  .join(" ");
writeFileSync(
  join(dir, "post.md"),
  `# ${episode}${script.title}

Vídeo: out/${name}.mp4

## TikTok
${ep}${script.post.tiktok}

${tags}

## Instagram Reels
${ep}${script.post.reels}

${tags}

## YouTube Shorts
Título: ${script.post.shortsTitle}${script.number ? ` | Ep. ${script.number}` : ""}

${script.post.shortsDescription}

${tags} #shorts
`,
);

log(`Pronto: out/${name}.mp4`);
console.log(`Legendas dos posts: episodes/${slug}/post.md`);
console.log(`Conferência: out/${name}/1-gancho.png, 2-meio.png, 3-final.png`);
