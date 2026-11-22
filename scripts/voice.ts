/**
 * Voices every line with OpenAI TTS, then transcribes each clip with word
 * timestamps to drive captions. Writes episodes/<slug>/props.json.
 * Usage: npm run voice -- <slug>
 */
import {
  createReadStream,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_MUSIC,
  type EpisodeProps,
  type Line,
  type Mouth,
  type Word,
} from "../src/types.ts";
import { findFeet } from "./lib/feet.ts";
import {
  hear,
  LIMIT,
  listen,
  levelVoice,
  longestPause,
  MAX_PAUSE,
  missed,
} from "./lib/diction.ts";
import { tmpdir } from "node:os";
import {
  type Character,
  type EpisodeScript,
  type ScriptLine,
  episodeDir,
  loadCast,
  log,
  MODELS,
  MUTE_POSES,
  openai,
  PUBLIC,
  readJson,
  requireSlug,
  voiceFile,
  writeJson,
} from "./lib/shared.ts";

/** Playback speed-up applied at render (pitch preserved). Override with SPEECH_RATE. */
const SPEECH_RATE = Number(process.env.SPEECH_RATE ?? "1.1");

const slug = requireSlug();
const script = readJson<EpisodeScript>(join(episodeDir(slug), "script.json"));
const cast = loadCast();
const audioDir = join(PUBLIC, "episodes", slug);
mkdirSync(audioDir, { recursive: true });

const poseIds = Object.keys(cast.poses);
const propIds = (script.props ?? []).map((p) => p.id);
for (const l of script.lines) {
  if (l.text.trim() && MUTE_POSES.includes(l.pose)) {
    throw new Error(`A pose "${l.pose}" não fala. Use outra nesta fala.`);
  }
  if (!poseIds.includes(l.pose)) {
    throw new Error(
      `Pose desconhecida "${l.pose}". Use: ${poseIds.join(", ")}`,
    );
  }
  if (
    (l.fx.includes("queda") || l.fx === "arremesso") &&
    !propIds.includes(l.fxProp)
  ) {
    throw new Error(`Objeto "${l.fxProp}" não está em "props" do roteiro.`);
  }
}

for (const s of script.cenario ?? []) {
  if (!propIds.includes(s.prop)) {
    throw new Error(`Objeto "${s.prop}" do cenário não está em "props".`);
  }
  if (!cast.characters.some((c) => c.id === s.junto)) {
    throw new Error(`Personagem desconhecido no cenário: ${s.junto}`);
  }
}

const missingArt = [
  ...cast.characters.flatMap((c) =>
    poseIds.flatMap((p) => [
      join(PUBLIC, "cast", c.id, `${p}.png`),
      ...(MUTE_POSES.includes(p)
        ? []
        : [join(PUBLIC, "cast", c.id, `${p}-fala.png`)]),
    ]),
  ),
  ...cast.characters.map((c) => join(PUBLIC, "cast", c.id, "mouths.json")),
  ...Object.keys(cast.locations).map((l) => join(PUBLIC, "bg", `${l}.png`)),
  ...propIds.map((p) => join(PUBLIC, "props", `${p}.png`)),
].filter((p) => !existsSync(p));
if (missingArt.length > 0) {
  throw new Error(
    `Falta arte (${missingArt.length} arquivos). Rode npm run art primeiro.`,
  );
}
if (!existsSync(join(PUBLIC, DEFAULT_MUSIC))) {
  throw new Error("Falta a música da série. Rode npm run sfx primeiro.");
}

const names = cast.characters.map((c) => c.name);
/** Lines a listener may not understand, reported at the end. */
const unclear: string[] = [];
let slowed = 0;

const lines: Line[] = [];
for (const [i, l] of script.lines.entries()) {
  const character = cast.characters.find((c) => c.id === l.character);
  if (!character) throw new Error(`Personagem desconhecido: ${l.character}`);

  // A silent beat: a stare, a snore, a sign held up. Nothing to record.
  if (!l.text.trim()) {
    lines.push({
      character: character.id,
      text: "",
      emotion: "",
      location: l.location,
      pose: l.pose,
      camera: l.camera,
      com: l.com ?? "",
      fx: l.fx,
      fxProp: l.fxProp,
      fxTarget: l.fxTarget,
      move: l.move ?? "",
      plateia: l.plateia ?? "",
      som: l.som ?? "",
      placa: l.placa ?? "",
      estado: l.estado ?? [],
      offsetMs: 0,
      audio: "",
      // Line lengths are divided by the speech rate at render; a pause is not speech.
      durationMs: (l.pausaMs || 1000) * SPEECH_RATE,
      words: [],
    });
    continue;
  }

  const file = voiceFile(character, l);
  const path = join(audioDir, file);

  if (!existsSync(path)) {
    log(`Voz ${i + 1}/${script.lines.length} (${character.name})`);
    writeFileSync(path, await speak(character, l));
  }

  // Every line plays at the same level, so quiet takes are not lost.
  const leveled = path.replace(/\.mp3$/, ".nivel.mp3");
  if (!existsSync(leveled)) levelVoice(path, leveled);

  // Heard as the viewer hears it. A line that is only clear at normal speed
  // plays at normal speed; one that is unclear either way is reported.
  let rate: number | undefined;
  const fast = missed(l.text, await hear(path, SPEECH_RATE, names));
  if (fast > LIMIT) {
    const normal = missed(l.text, await hear(path, 1, names));
    if (normal <= LIMIT) {
      rate = 1;
      slowed++;
    } else {
      unclear.push(
        `${character.name}: "${l.text}" (${Math.round(Math.min(fast, normal) * 100)}% das palavras não entendidas)`,
      );
    }
  }

  const tr = await openai().audio.transcriptions.create({
    model: MODELS.transcribe,
    file: createReadStream(path),
    language: "pt",
    prompt: l.text,
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  // Skip the silence before the first word; every timing below starts there.
  const offsetMs = Math.max(
    0,
    Math.round((tr.words?.[0]?.start ?? 0) * 1000) - 60,
  );
  const words: Word[] = (tr.words ?? []).map((w) => ({
    text: w.word,
    startMs: Math.round(w.start * 1000) - offsetMs,
    endMs: Math.round(w.end * 1000) - offsetMs,
  }));

  lines.push({
    character: character.id,
    text: l.text,
    emotion: l.emotion,
    location: l.location,
    pose: l.pose,
    camera: l.camera,
    com: l.com ?? "",
    fx: l.fx,
    fxProp: l.fxProp,
    fxTarget: l.fxTarget,
    move: l.move ?? "",
    plateia: l.plateia ?? "",
    som: l.som ?? "",
    placa: l.placa ?? "",
    tela: l.tela ?? "",
    estado: l.estado ?? [],
    ...(rate ? { rate } : {}),
    offsetMs,
    audio: `episodes/${slug}/${file.replace(/\.mp3$/, ".nivel.mp3")}`,
    // Cut trailing silence: end shortly after the last spoken word.
    durationMs: Math.min(
      Math.round(tr.duration * 1000) - offsetMs,
      (words.at(-1)?.endMs ?? Infinity) + 150,
    ),
    words: alignToScript(l.text, words),
  });
}

/** Words only, lowercase and without accents, to compare what was said with the script. */
function plain(text: string): string[] {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/**
 * Voices one line. Audio models act the line (accent, emotion, pacing); the
 * plain TTS models read it. An acted take is redone if it strays from the script.
 */
async function speak(character: Character, line: ScriptLine): Promise<Buffer> {
  if (!MODELS.tts.startsWith("gpt-audio")) {
    const speech = await openai().audio.speech.create({
      model: MODELS.tts,
      voice: character.voice,
      input: line.text,
      instructions: `${character.voiceStyle} Nesta fala, soe: ${line.emotion}. Ritmo ágil de esquete, sem pausas longas. Português do Brasil.`,
      speed: MODELS.ttsSpeed,
      response_format: "mp3",
    });
    return Buffer.from(await speech.arrayBuffer());
  }

  const wanted = plain(line.text).length;
  // The best take so far, by how much of it a listener would miss.
  let best: { data: Buffer; miss: number } | undefined;
  for (let attempt = 1; ; attempt++) {
    const res = await openai().chat.completions.create({
      model: MODELS.tts,
      modalities: ["text", "audio"],
      audio: { voice: character.voice, format: "mp3" },
      messages: [
        {
          role: "system",
          content: `Você é dublador brasileiro de desenho animado de comédia. Interprete o personagem: ${character.voiceStyle} Fale em português do Brasil com dicção clara: articule cada sílaba e termine cada palavra, mesmo com emoção forte. Grite pela intenção, sem estourar nem embolar a voz. Ritmo vivo de esquete, sem atropelar as palavras, sem pausas longas e sem silêncio no começo. Diga EXATAMENTE a fala que receber, sem acrescentar, cortar nem comentar nada.`,
        },
        {
          role: "user",
          content: `Atuação: ${line.emotion}.\nFala: "${line.text}"`,
        },
      ],
    });
    const audio = res.choices[0]?.message.audio;
    const said = plain(audio?.transcript ?? "").length;
    if (audio && Math.abs(said - wanted) <= 1) {
      const data = Buffer.from(audio.data, "base64");
      const take = join(tmpdir(), `take-${process.pid}-${attempt}.mp3`);
      writeFileSync(take, data);
      const heard = await listen(take, SPEECH_RATE, names);
      const miss = missed(line.text, heard.text);
      const pause = Math.max(longestPause(take) / SPEECH_RATE, heard.gap);
      // A long pause in the middle counts against the take like a lost word.
      const score = miss + (pause > MAX_PAUSE ? 0.3 : 0);
      if (!best || score < best.miss) best = { data, miss: score };
      if (miss <= LIMIT && pause <= MAX_PAUSE) return data;
      log(
        miss > LIMIT
          ? `Fala pouco clara (${Math.round(miss * 100)}% perdido), gravando de novo…`
          : `Pausa de ${pause.toFixed(1)}s no meio da fala, gravando de novo…`,
      );
    } else {
      log("A voz fugiu do roteiro, gravando de novo…");
    }
    if (attempt >= 4) {
      if (best) return best.data;
      throw new Error(`A voz não seguiu o roteiro na fala: "${line.text}"`);
    }
  }
}

/**
 * Whisper may spell words differently from the script. Keep its timings but
 * show the script's words when the counts match, so captions have no typos.
 */
function alignToScript(text: string, words: Word[]): Word[] {
  const tokens = text.split(/\s+/).filter(Boolean);
  if (tokens.length === words.length) {
    return words.map((w, i) => ({ ...w, text: tokens[i] }));
  }
  // Counts differ: spread the script's words over the spoken span, weighted by length.
  const first = words[0];
  const last = words.at(-1);
  if (!first || !last) return words;
  const span = last.endMs - first.startMs;
  const total = tokens.reduce((n, t) => n + t.length, 0);
  let cursor = first.startMs;
  return tokens.map((t) => {
    const startMs = Math.round(cursor);
    cursor += (span * t.length) / total;
    return { text: t, startMs, endMs: Math.round(cursor) };
  });
}

const props: EpisodeProps = {
  slug,
  number: script.number,
  order: script.posicoes ?? [],
  hook: script.hook,
  lines,
  cast: cast.characters.map((c) => ({
    id: c.id,
    name: c.name,
    color: c.color,
    dir: `cast/${c.id}`,
    scale: c.scale ?? 1,
    mouths: readJson<Record<string, Mouth>>(
      join(PUBLIC, "cast", c.id, "mouths.json"),
    ),
    blink: readJson<Mouth | null>(join(PUBLIC, "cast", c.id, "blink.json")),
    feet: findFeet(join(PUBLIC, "cast", c.id, "neutro.png")),
  })),
  backgrounds: Object.fromEntries(
    Object.keys(cast.locations).map((l) => [l, `bg/${l}.png`]),
  ),
  props: Object.fromEntries(propIds.map((p) => [p, `props/${p}.png`])),
  weights: Object.fromEntries(
    (script.props ?? []).map((p) => [p.id, p.peso ?? "medio"]),
  ),
  scenery: (script.cenario ?? []).map((s) => ({
    prop: s.prop,
    beside: s.junto,
    side: s.lado === "direita" ? 1 : -1,
    height: s.altura ?? 900,
  })),
  // Drop a licensed track at public/music/trilha.mp3 to replace the built-in theme.
  music: existsSync(join(PUBLIC, "music", "trilha.mp3"))
    ? "music/trilha.mp3"
    : DEFAULT_MUSIC,
  speechRate: SPEECH_RATE,
};

writeJson(join(episodeDir(slug), "props.json"), props);
const total = lines.reduce((s, l) => s + l.durationMs, 0) / 1000;
log(`Vozes e legendas prontas (${total.toFixed(1)}s de fala).`);
log(
  `Dicção: ${lines.filter((l) => l.text).length} falas conferidas, ${slowed} tocadas em velocidade normal para ficarem claras.`,
);
if (unclear.length > 0) {
  log(
    `Atenção, ${unclear.length} fala(s) ainda pouco clara(s). Reescreva ou mude a atuação e rode de novo:`,
  );
  for (const u of unclear) console.log(`  - ${u}`);
}
console.log(`Próximo passo: npm run render -- ${slug}`);
