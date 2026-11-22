/**
 * Reports how well each line of an episode can be understood, as a viewer
 * hears it: at its playback speed, transcribed without seeing the script.
 * Changes nothing. Usage: npm run diccao -- <slug>
 */
import { join } from "node:path";
import type { EpisodeProps } from "../src/types.ts";
import { hear, LIMIT, missed } from "./lib/diction.ts";
import {
  episodeDir,
  loadCast,
  log,
  PUBLIC,
  readJson,
  requireSlug,
} from "./lib/shared.ts";

const slug = requireSlug();
const props = readJson<EpisodeProps>(join(episodeDir(slug), "props.json"));
const names = loadCast().characters.map((c) => c.name);
let unclear = 0;
for (const l of props.lines) {
  if (!l.text) continue;
  const rate = l.rate ?? props.speechRate ?? 1;
  const heard = await hear(join(PUBLIC, l.audio), rate, names);
  const miss = missed(l.text, heard);
  if (miss > LIMIT) unclear++;
  const mark = miss > LIMIT ? "✗" : "✓";
  console.log(
    `${mark} ${String(Math.round(miss * 100)).padStart(3)}%  ${l.character}: "${l.text}"`,
  );
  if (miss > LIMIT) console.log(`         ouvido: "${heard.trim()}"`);
}
log(`${unclear} fala(s) pouco clara(s) em ${slug}.`);
