# garimpo-videos

Série cômica em vídeo vertical ambientada numa galeria comercial de bairro. Promove o Garimpo
(garimpoeditais.com.br, sem ponto entre "garimpo" e "editais") de forma indireta: a marca aparece em
piscadelas (os nomes Lici e Zé Garimpo, a bateia que brilha), no link da bio, no comentário fixado e no
fecho fixo de todo vídeo (íris, bateia e o endereço escrito na tela, com a vinheta da série). O fecho é
canônico: não há opção de desligar por episódio, e nenhuma fala cita o site.

## Antes de escrever ou revisar qualquer roteiro

Leia `docs/guia-de-comedia.md` e `docs/diario-da-serie.md`, e passe o roteiro pelo checklist do guia.
Todo episódio considera o desenvolvimento dos personagens no longo prazo: decida, pelo diário, o que ele
acrescenta a pelo menos um personagem (faceta, par ou gesto), e atualize o diário depois de produzir. O guia traz a premissa, o elenco,
a proporção de temas (80/15/5), a estrutura do episódio e o filtro "isso parece anúncio? Então corta".
A pesquisa que o embasa está em `reports/Comédia e drama em esquetes curtos.md` (notas brutas em
`research_notes/`). `scripts/write.ts` já injeta o guia no prompt.

## Comandos

- `npm run lint` roda ESLint e TypeScript (não há testes automatizados).
- Pipeline: `npm run write`, `art`, `voice -- <slug>`, `render -- <slug>`. Veja o README.
- `npm run sfx` gera os efeitos e a música original da série (`public/music/trilha.wav` e `vinheta.wav`).
  Um arquivo `public/music/trilha.mp3` substitui a trilha de fundo.

## Arte

- Poses e bocas são edições do desenho-base (`public/cast/<id>/neutro.png`). `npm run art -- <id>` apaga
  e redesenha o personagem inteiro, inclusive o base.
- Evite descrições que lembrem personagens famosos (um eletricista de bigode, macacão e boné foi
  bloqueado pelo filtro de imagens).
