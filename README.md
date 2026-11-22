# garimpo-videos

Série cômica em vídeo vertical (TikTok, Reels, Shorts) ambientada numa galeria comercial de bairro, com elenco fixo: Dona Lici, Zé Garimpo, Seu Norberto e Kátia. A marca Garimpo aparece em piscadelas (os nomes, a bateia do Zé que brilha), no link da bio e no fecho fixo de todo vídeo, em que o endereço do site se escreve na tela. A premissa, o elenco e as regras de roteiro estão em [docs/guia-de-comedia.md](docs/guia-de-comedia.md).

Único custo: a sua chave da OpenAI. O Remotion renderiza localmente e é grátis para equipes de até 3 pessoas ([licença](https://www.remotion.dev/docs/license)).

## Primeira vez

```bash
npm install
cp .env.example .env.local   # cole sua OPENAI_API_KEY
npm run art               # desenha elenco (6 poses, com boca aberta e fechada), cenários e objetos
npm run sfx               # gera os efeitos sonoros e a música da série
```

Confira as imagens em `public/cast` e `public/bg`. Não gostou de alguma? Ajuste a descrição em `cast.json` e redesenhe só ela: `npm run art -- ze`. Isso refaz o personagem inteiro, com todas as poses. O `art` só desenha o que falta, então rode de novo sempre que um roteiro declarar um objeto novo.

## Um episódio, do roteiro ao MP4

```bash
npm run make                          # inventa um episódio
npm run make -- "O cliente pede desconto no Pix"
```

Ou passo a passo, para revisar entre as etapas:

| Comando | O que faz | Saída |
|---|---|---|
| `npm run write -- "ideia"` | Roteiro com gancho, falas e legendas dos posts | `episodes/<slug>/script.json` |
| `npm run voice -- <slug>` | Voz de cada fala + tempo de cada palavra (para a legenda) | `public/episodes/<slug>/*.mp3`, `episodes/<slug>/props.json` |
| `npm run render -- <slug>` | Vídeo 1080×1920 + 3 quadros de conferência + textos dos posts | `out/<slug>.mp4`, `out/<slug>/*.png`, `episodes/<slug>/post.md` |
| `npm run dev` | Abre o Remotion Studio para ajustar o visual | — |

Para mudar uma fala: edite `script.json`, apague o mp3 daquela fala em `public/episodes/<slug>/` e rode `voice` e `render` de novo. As vozes que já existem não são regeradas.

## Publicar

Abra `episodes/<slug>/post.md`, suba `out/<slug>.mp4` no app de cada rede e cole a legenda correspondente. No TikTok, escolha um som em alta com volume baixo para ganhar alcance.

## Onde mexer

- Premissa, elenco, temas e regras de roteiro: `docs/guia-de-comedia.md` (o `write` carrega esse arquivo)
- Personagens, vozes, poses, altura e cenários: `cast.json`
- Animação (palco, câmera, boca, sombras, objetos de cenário, símbolos de reação, brilho, queda de objeto): `src/Stage.tsx`
- Legenda, gancho e o fecho da série (íris, bateia e endereço do site): `src/Overlay.tsx`
- Som: `src/Sound.tsx` (efeitos automáticos a partir do que acontece em cena, trilha de fundo e vinheta do fecho)
- Música: a trilha e a vinheta são composição própria, sintetizada em `scripts/sfx.ts` (`npm run sfx`). Para usar outra trilha de fundo, salve o arquivo como `public/music/trilha.mp3` e rode `npm run voice -- <slug>` de novo
- Modelos da OpenAI e velocidade da fala: `.env.local` (veja `.env.example`)

## Direção de cena no roteiro

Cada fala do `script.json` traz a direção de quem fala e de quem escuta: `pose`, `camera`, `move` (entra ou
sai andando), `plateia` (reação de quem escuta), `som` e `fx` (brilho, queda de objeto). A lista completa,
com quando usar cada um, está na seção "Direção de cena" de [docs/guia-de-comedia.md](docs/guia-de-comedia.md).
Objetos novos entram na lista `props` do roteiro e são desenhados pelo `npm run art`.
