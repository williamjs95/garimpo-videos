/**
 * Applies each character's color correction (cast.json "cores") to all of
 * their drawings. Safe to run again: a marker file stops a second pass.
 * Usage: npm run cores            (every character)
 *        npm run cores -- lici    (one character)
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { recolorCharacter } from "./lib/color.ts";
import { loadCast, log, PUBLIC, readJson } from "./lib/shared.ts";

const cast = loadCast();
const only = process.argv[2];
for (const c of cast.characters) {
  if (!c.cores || (only && only !== c.id)) continue;
  const dir = join(PUBLIC, "cast", c.id);
  const mouthsFile = join(dir, "mouths.json");
  const mouths = existsSync(mouthsFile)
    ? readJson<Record<string, { y: number; ry: number }>>(mouthsFile)
    : {};
  const n = recolorCharacter(dir, c.cores, Object.keys(cast.poses), mouths);
  log(
    n
      ? `${c.name}: cores corrigidas em ${n} desenhos`
      : `${c.name}: já estava corrigido`,
  );
}
