/**
 * Generates the fixed cast, backgrounds and episode props. Existing files are
 * kept, so the cast stays consistent across episodes.
 *
 * Each character has one base drawing; every pose is an edit of that base, and
 * every pose has a mouth-open twin for lip sync.
 *
 * Usage: npm run art              (only missing files)
 *        npm run art -- ze        (redraw one character, location or prop)
 */
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { toFile } from "openai";
import {
  EPISODES,
  type EpisodeScript,
  loadCast,
  log,
  MODELS,
  openai,
  PUBLIC,
  readJson,
  writeJson,
} from "./lib/shared.ts";
import { matchColors } from "./lib/color.ts";
import { findMouth } from "./lib/mouth.ts";
import type { Mouth } from "../src/types.ts";

type Size = "1024x1536" | "1536x1024" | "1024x1024";

const cast = loadCast();
const only = process.argv[2];

/** The image safety filter has false positives on output; a fresh attempt usually passes. */
const withModerationRetry = async <T>(
  fn: () => Promise<T>,
  attempts = 3,
): Promise<T> => {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (err) {
      const blocked = (err as { code?: string }).code === "moderation_blocked";
      if (!blocked || i >= attempts) throw err;
      log(
        `Bloqueado pelo filtro de segurança, tentando de novo (${i + 1}/${attempts})…`,
      );
    }
  }
};

const save = (out: string, b64: string | undefined): void => {
  if (!b64) throw new Error(`Imagem vazia para ${out}`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(b64, "base64"));
};

const generate = async (
  prompt: string,
  out: string,
  size: Size,
  transparent: boolean,
  model = MODELS.image,
): Promise<void> => {
  const b64 = await withModerationRetry(async () => {
    const res = await openai().images.generate({
      model,
      prompt,
      size,
      quality: "medium",
      background: transparent ? "transparent" : "opaque",
      output_format: "png",
      n: 1,
    });
    return res.data?.[0]?.b64_json;
  });
  save(out, b64);
};

/** Redraws `source` with a change, keeping the character recognisable. */
const edit = async (
  source: string,
  prompt: string,
  out: string,
): Promise<void> => {
  const b64 = await withModerationRetry(async () => {
    const res = await openai().images.edit({
      model: MODELS.imageEdit,
      image: await toFile(createReadStream(source), null, {
        type: "image/png",
      }),
      prompt,
      size: "1024x1536",
      quality: "medium",
      background: "transparent",
      output_format: "png",
      // High fidelity keeps every pose aligned with the base drawing.
      ...(MODELS.imageEdit === "gpt-image-1.5"
        ? { input_fidelity: "high" as const }
        : {}),
    });
    return res.data?.[0]?.b64_json;
  });
  save(out, b64);
};

/** Runs tasks a few at a time, to stay under the images-per-minute limit. */
const pool = async (
  tasks: (() => Promise<void>)[],
  size = 3,
): Promise<void> => {
  const queue = [...tasks];
  const worker = async (): Promise<void> => {
    for (let task = queue.shift(); task; task = queue.shift()) await task();
  };
  await Promise.all(Array.from({ length: size }, worker));
};

const SAME =
  "Keep the exact same character, outfit, colors, art style, outline thickness, body proportions, size and position in the frame. Plain transparent background.";

const drawCharacter = async (id: string): Promise<void> => {
  const c = cast.characters.find((x) => x.id === id);
  if (!c) return;
  const dir = join(PUBLIC, "cast", c.id);
  if (only === c.id) rmSync(dir, { recursive: true, force: true });

  const base = join(dir, "neutro.png");
  if (!existsSync(base)) {
    log(`Desenhando ${c.name}…`);
    await generate(
      `${cast.style}. Character: ${c.look}. Expression: ${cast.poses.neutro}.`,
      base,
      "1024x1536",
      true,
      // Same model as the poses, so the base and its edits share one look.
      MODELS.imageEdit,
    );
  }

  const poses = Object.entries(cast.poses).filter(([p]) => p !== "neutro");
  await pool(
    poses
      .filter(([p]) => !existsSync(join(dir, `${p}.png`)))
      .map(([p, desc]) => async () => {
        log(`${c.name}: pose ${p}`);
        await edit(
          base,
          `${SAME} Change only the facial expression and the arms: ${c.poses?.[p] ?? desc}.`,
          join(dir, `${p}.png`),
        );
      }),
  );

  await pool(
    Object.keys(cast.poses)
      .filter((p) => !existsSync(join(dir, `${p}-fala.png`)))
      .map((p) => async () => {
        log(`${c.name}: boca aberta (${p})`);
        await edit(
          join(dir, `${p}.png`),
          `${SAME} Change only the mouth: wide open in the middle of speaking, showing the inside of the mouth. Everything else pixel-identical.`,
          join(dir, `${p}-fala.png`),
        );
      }),
  );

  const blink = join(dir, "neutro-pisca.png");
  if (!existsSync(blink)) {
    log(`${c.name}: piscando`);
    await edit(
      base,
      `${SAME} Change only the eyes: both eyes fully closed, eyelids down, in the middle of a blink. Everything else pixel-identical.`,
      blink,
    );
  }
};

const paintLocation = async (id: string, desc: string): Promise<void> => {
  const out = join(PUBLIC, "bg", `${id}.png`);
  if (only ? only !== id : existsSync(out)) return;
  log(`Pintando cenário ${id}…`);
  await generate(
    `2D cartoon background illustration, wide landscape composition, flat colors, soft shading, muted cool palette (dusty teal, grey-blue, pale cream, soft lilac), low contrast and slightly desaturated so colorful characters stand out in front, no orange or red dominance, no people, no text, no lettering on signs, straight-on view, empty floor across the whole lower third for characters to stand: ${desc}`,
    out,
    "1536x1024",
    false,
  );
};

/** Props are declared by episode scripts and shared across episodes by id. */
const episodeProps = (): Map<string, string> => {
  const props = new Map<string, string>();
  if (!existsSync(EPISODES)) return props;
  for (const d of readdirSync(EPISODES)) {
    const path = join(EPISODES, d, "script.json");
    if (!existsSync(path)) continue;
    for (const p of readJson<EpisodeScript>(path).props ?? []) {
      props.set(p.id, p.description);
    }
  }
  return props;
};

const drawProp = async (id: string, desc: string): Promise<void> => {
  const out = join(PUBLIC, "props", `${id}.png`);
  if (only ? only !== id : existsSync(out)) return;
  log(`Desenhando objeto ${id}…`);
  await generate(
    `2D cartoon object, flat colors with soft cel shading, thick clean dark-brown outlines, bright clear colors, single object centered, filling the frame, plain transparent background, no text, no people: ${desc}`,
    out,
    "1024x1024",
    true,
  );
};

await pool(
  cast.characters
    .filter((c) => !only || only === c.id)
    .map((c) => () => drawCharacter(c.id)),
  2,
);
await pool(
  Object.entries(cast.locations).map(
    ([id, desc]) =>
      () =>
        paintLocation(id, desc),
  ),
);
await pool(
  [...episodeProps()].map(
    ([id, desc]) =>
      () =>
        drawProp(id, desc),
  ),
);

// Pull every drawing back to its base colors, then locate each mouth so the
// animation can swap only that region when talking.
for (const c of cast.characters) {
  const dir = join(PUBLIC, "cast", c.id);
  const base = join(dir, "neutro.png");
  for (const p of Object.keys(cast.poses)) {
    for (const file of [`${p}.png`, `${p}-fala.png`]) {
      const path = join(dir, file);
      if (path !== base && existsSync(path)) matchColors(path, base);
    }
  }
  const blink = join(dir, "neutro-pisca.png");
  if (existsSync(blink)) matchColors(blink, base);
  const pairs = Object.keys(cast.poses)
    .map((p) => ({
      pose: p,
      closed: join(dir, `${p}.png`),
      open: join(dir, `${p}-fala.png`),
    }))
    .filter((p) => existsSync(p.closed) && existsSync(p.open));
  // First pass finds where this character's mouth usually is; the second
  // searches only around that height, so eyes and hands are never picked.
  const heights = pairs
    .map((p) => findMouth(p.closed, p.open)?.y)
    .filter((y) => y !== undefined)
    .sort((x, y) => x - y);
  const typical = heights[Math.floor(heights.length / 2)] ?? 0.3;
  const mouths: Record<string, Mouth> = {};
  for (const p of pairs) {
    const mouth = findMouth(p.closed, p.open, [typical - 0.07, typical + 0.07]);
    if (mouth) mouths[p.pose] = mouth;
    else
      log(`${c.name} (${p.pose}): boca não localizada, fala só com movimento`);
  }
  writeJson(join(dir, "mouths.json"), mouths);

  // The eyes are just above the mouth; a blink covers both, so take them whole.
  const eyes = existsSync(blink)
    ? findMouth(base, blink, [typical - 0.17, typical - 0.03], true)
    : undefined;
  if (!eyes) log(`${c.name}: olhos não localizados, não vai piscar`);
  writeJson(join(dir, "blink.json"), eyes ?? null);
}

log("Arte pronta em public/cast, public/bg e public/props");
