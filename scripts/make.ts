/**
 * Full pipeline: script -> art (only missing) -> voices + captions -> render.
 * Usage: npm run make -- "ideia opcional"
 */
import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { EPISODES, ROOT } from "./lib/shared.ts";

const run = (script: string, args: string[] = []): void => {
  execFileSync("node", [join("scripts", script), ...args], {
    cwd: ROOT,
    stdio: "inherit",
  });
};

run("write.ts", process.argv.slice(2));
const newest = readdirSync(EPISODES)
  .filter((d) => !d.startsWith("_"))
  .map((d) => ({ d, t: statSync(join(EPISODES, d)).mtimeMs }))
  .sort((a, b) => b.t - a.t)[0]?.d;
if (!newest) throw new Error("Nenhum episódio criado.");

run("art.ts");
run("voice.ts", [newest]);
run("render.ts", [newest]);
