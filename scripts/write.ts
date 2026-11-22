/**
 * Writes a new episode script with the OpenAI text model.
 * Usage: npm run write -- "ideia opcional do episódio"
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  EPISODES,
  ROOT,
  type EpisodeScript,
  episodeDir,
  loadCast,
  log,
  MODELS,
  openai,
  readJson,
  writeJson,
} from "./lib/shared.ts";

const idea = process.argv.slice(2).join(" ").trim();
const cast = loadCast();
const ids = cast.characters.map((c) => c.id);
const locations = Object.keys(cast.locations);
const poses = Object.keys(cast.poses);

const previous = existsSync(EPISODES)
  ? readdirSync(EPISODES)
      .filter((d) => existsSync(join(EPISODES, d, "script.json")))
      .map((d) => readJson<EpisodeScript>(join(EPISODES, d, "script.json")))
  : [];
const guide = readFileSync(join(ROOT, "docs", "guia-de-comedia.md"), "utf8");

const mentions = previous.filter((e) => e.mentionsGarimpo).length;

const system = `Você é roteirista de uma série cômica de animação curta (TikTok, Reels, Shorts) em português do Brasil, ambientada numa galeria comercial de bairro.

ELENCO FIXO (cada um reage a tudo pela sua perspectiva; nunca troque):
${cast.characters.map((c) => `- ${c.id} (${c.name}): ${c.role} Bordão: "${c.catchphrase}"`).join("\n")}

CENÁRIOS DISPONÍVEIS: ${locations.join(", ")}
POSES DISPONÍVEIS: ${poses.join(", ")}

HISTÓRICO: ${previous.length} episódios escritos, ${mentions} com menção direta a vender para o governo ou ao Garimpo. Respeite a proporção 80/15/5 do guia: só escreva menção direta se o histórico estiver abaixo de 5%.

GUIA DE COMÉDIA (obrigatório; siga os princípios, o formato, as leis do mundo e passe no checklist)
${guide}

SAÍDA
- "hook" é o texto na tela no primeiro frame: 4 a 7 palavras, sem emoji, no tom de fofoca (ex.: "A liquidação da loja da frente").
- "emotion" de cada fala é a indicação de atuação (ex.: "cochichando, deliciada", "fria, seca").
- "pose", "camera", "move", "plateia", "som", "fx", "fxProp" e "fxTarget" seguem a seção "Direção de cena" do guia. Quando não se aplicam, use "".
- "props": lista dos objetos usados em "queda" e em "cenario", com "id" em kebab-case e "description" em inglês para o desenhista (ex.: "small toy quadcopter drone"). Lista vazia se não houver.
- "cenario": objetos que ficam em cena o episódio inteiro ao lado de um personagem (ex.: uma torre de caixas junto da Kátia). Cada item tem "prop" (id declarado em "props"), "junto" (personagem), "lado" ("esquerda" ou "direita") e "altura" em pixels (um personagem tem uns 1000). Lista vazia se não houver.
- "posicoes": ordem dos personagens em cena, da esquerda para a direita. Lista vazia usa a ordem em que aparecem.
- Batida muda (olhar para a câmera, ronco, placa levantada): fala com "text" e "emotion" vazios e "pausaMs" entre 800 e 1500. "placa" é o texto da placa que o personagem levanta, ou "". Nas falas normais, "pausaMs" é 0 e "placa" é "".
- "estado": lista de {quem, pose} que passa a valer daquela fala em diante (ex.: alguém dorme: pose "dormindo"). Pose "" desfaz. Lista vazia na maioria das falas. A pose "dormindo" nunca fala.
- Não escreva chamada para o site nem despedida: todo episódio já termina com o fecho fixo da série (íris e endereço na tela), depois do gancho final.
- "mentionsGarimpo": true só se alguma fala citar o Garimpo ou vender para o governo.

POST
- tiktok/reels: legenda curta (até 150 caracteres), no tom da série, com uma pergunta que puxe comentário ou marcação ("toda galeria tem uma Kátia"). Sem link e sem citar o Garimpo.
- shortsTitle: até 70 caracteres. shortsDescription: 1-2 frases.
- hashtags: 4 a 6, sem #garimpo, nichadas (humor, comércio, lojista, pequenos negócios).
- slug: kebab-case curto, sem acentos.`;

const user = idea
  ? `Ideia do episódio: ${idea}`
  : `Invente um episódio novo. Evite repetir estes títulos: ${previous.map((p) => p.title).join("; ") || "(nenhum ainda)"}`;

const schema = {
  type: "object",
  additionalProperties: false,
  required: [
    "slug",
    "title",
    "hook",
    "mentionsGarimpo",
    "props",
    "cenario",
    "posicoes",
    "lines",
    "post",
  ],
  properties: {
    slug: { type: "string" },
    title: { type: "string" },
    hook: { type: "string" },
    mentionsGarimpo: { type: "boolean" },
    cenario: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["prop", "junto", "lado", "altura"],
        properties: {
          prop: { type: "string" },
          junto: { type: "string", enum: ids },
          lado: { type: "string", enum: ["esquerda", "direita"] },
          altura: { type: "number" },
        },
      },
    },
    props: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "description"],
        properties: {
          id: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    posicoes: { type: "array", items: { type: "string", enum: ids } },
    lines: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "character",
          "text",
          "emotion",
          "location",
          "pose",
          "camera",
          "com",
          "fx",
          "fxProp",
          "fxTarget",
          "move",
          "plateia",
          "som",
          "placa",
          "pausaMs",
          "estado",
        ],
        properties: {
          character: { type: "string", enum: ids },
          text: { type: "string" },
          emotion: {
            type: "string",
            description:
              "Como a fala deve soar, em poucas palavras (ex.: indignada, cochichando).",
          },
          location: { type: "string", enum: locations },
          pose: { type: "string", enum: poses },
          camera: { type: "string", enum: ["normal", "close", "dupla"] },
          com: { type: "string", enum: ["", ...ids] },
          fx: {
            type: "string",
            enum: ["", "brilho", "queda", "brilho+queda", "coracoes", "briga"],
          },
          fxProp: { type: "string" },
          fxTarget: { type: "string", enum: ["", ...ids] },
          move: { type: "string", enum: ["", "entra", "sai"] },
          plateia: { type: "string", enum: ["", ...poses] },
          som: {
            type: "string",
            enum: ["", "scratch", "ding", "whoosh", "ronco", "tique"],
          },
          placa: { type: "string" },
          pausaMs: { type: "number" },
          estado: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["quem", "pose"],
              properties: {
                quem: { type: "string", enum: ids },
                pose: { type: "string", enum: ["", ...poses] },
              },
            },
          },
        },
      },
    },
    post: {
      type: "object",
      additionalProperties: false,
      required: [
        "tiktok",
        "reels",
        "shortsTitle",
        "shortsDescription",
        "hashtags",
      ],
      properties: {
        tiktok: { type: "string" },
        reels: { type: "string" },
        shortsTitle: { type: "string" },
        shortsDescription: { type: "string" },
        hashtags: { type: "array", items: { type: "string" } },
      },
    },
  },
} as const;

log(`Escrevendo roteiro com ${MODELS.text}…`);
const res = await openai().chat.completions.create({
  model: MODELS.text,
  messages: [
    { role: "system", content: system },
    { role: "user", content: user },
  ],
  response_format: {
    type: "json_schema",
    json_schema: { name: "episode", strict: true, schema },
  },
});

const content = res.choices[0]?.message.content;
if (!content) throw new Error("O modelo não devolveu roteiro.");
const script = JSON.parse(content) as EpisodeScript;

let slug = script.slug
  .toLowerCase()
  .replace(/[^a-z0-9-]+/g, "-")
  .replace(/^-|-$/g, "");
if (existsSync(episodeDir(slug))) slug = `${slug}-${Date.now().toString(36)}`;
script.slug = slug;
// Episodes are numbered in the order they are written.
script.number = Math.max(0, ...previous.map((p) => p.number ?? 0)) + 1;

writeJson(join(episodeDir(slug), "script.json"), script);

log(`Roteiro salvo em episodes/${slug}/script.json`);
console.log(`\n${script.title}\nGancho: ${script.hook}\n`);
for (const l of script.lines) console.log(`  ${l.character}: ${l.text}`);
console.log(`\nPróximo passo: npm run voice -- ${slug}`);
