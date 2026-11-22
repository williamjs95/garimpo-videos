# Consistent 2D cartoon character and background art from AI image generation (state as of Nov 2026)

Research date: 2026-11-22. About 20 tool calls. Status markers used below:
- **[opened]** means I fetched the page and read it (sometimes only part of it, as noted).
- **[summary]** means I only saw a search-engine summary or snippet.
- Source types: **OFFICIAL** (vendor docs), **INDEP** (independent test or press), **ANECDOTE** (blog, forum or tutorial), **PAPER** (research paper).
- Anything dated before 2025 is flagged as possibly outdated.

## 1. State of the art for character consistency (OpenAI gpt-image vs alternatives)

### Takeaway
**Urgent: both models this project uses, `gpt-image-1.5` and `gpt-image-1-mini`, shut down on Dec 1, 2026, about 9 days after this note was written.** OpenAI names `gpt-image-2.6-sunburst` / `gpt-image-2.6-flare` as replacements. `gpt-image-2` (Apr 2026) always uses high input fidelity but reportedly cannot output transparent backgrounds. OpenAI's own docs still list "recurring character consistency" as a known limitation and say pixel-exact preservation needs compositing, not prompting. Among alternatives, Nano Banana (Gemini) and FLUX.2 are reference-image models with explicit multi-reference character slots. Recraft V4 Styles is the option built for locking a style and producing native SVG.

### Cited Findings

**OpenAI model lifecycle (OFFICIAL)**
- Deprecations table [opened], [OpenAI deprecations](https://developers.openai.com/api/docs/deprecations), read 2026-11-22:
  - `gpt-image-1-mini` shuts down Dec 1, 2026. Replacement: `gpt-image-2.6-sunburst` or `gpt-image-2.6-flare`. Announced Jun 2, 2026.
  - `gpt-image-1.5` and `gpt-image-1.5-2025-12-16` shut down Dec 1, 2026. Same replacements. Announced Jun 2, 2026.
  - `gpt-image-2` and `gpt-image-2-2026-04-21` shut down Feb 10, 2027. Replacement: 2.6 Sunburst/Flare. Announced Nov 10, 2026.
  - `gpt-image-1` was shut down Oct 23, 2026.
  - `dall-e-2` and `dall-e-3` were shut down May 12, 2026.
- The models page lists four current image models [opened], [OpenAI models](https://developers.openai.com/api/docs/models):
  - GPT-Image-2.6 Sunburst: "Image generation and editing for detailed visual work"
  - GPT-Image-2.6 Flare: "Image generation and editing for fast iteration"
  - GPT-Image-2.5 Sunburst: "Our most capable model for image generation and editing"
  - GPT-Image-2.5 Flare: "Fast, high-quality everyday image generation"
- The image generation guide says Sunburst is for work where "editing precision matters most" and Flare is for "fast, high-quality everyday image generation" [opened, first 100k chars + remainder], [OpenAI image generation guide](https://developers.openai.com/api/docs/guides/image-generation).

**Masks and markup (OFFICIAL)**
- Masking is "entirely prompt-based." The model "may not follow its exact shape with complete precision." With several input images, the mask applies to the first one. Same guide [opened].
- **This explains the mouth drift: a mask does not stop pixels outside it from changing.**
- GPT-Image-2.5/2.6 add "markup" as an alternative to masks. It cannot be combined with `mask`.
  - The markup layer is a transparent PNG overlay on the first image and must match its width and height.
  - Each image is capped at 16,777,216 px and the markup file at 50 MB.
  - Same guide [opened].
- New `complexity` parameter: `low`/`medium`/`high`, default `high`. Higher complexity "can increase latency and introduce unwanted changes." Same guide [opened].
  - Inference: try `complexity: low` for small edits such as mouth or eye twins.

**Input fidelity, sizes and transparency (OFFICIAL unless marked)**
- `input_fidelity` on `gpt-image-2`: "omit this parameter; the API doesn't allow changing it". All inputs are processed at high fidelity. Same guide [opened].
- The guide doesn't describe `input_fidelity` for 2.5/2.6 in the portions I read. → Gap.
- Sizes for 2.5/2.6: recommended 1024x1024, 1536x1024, 1024x1536. Custom sizes must have width and height in multiples of 16. On 2.5, "resolutions above 2560x1440 are experimental." Same guide [opened].
- Sizes for `gpt-image-2`: any size with max edge 3840 px and long:short ratio ≤ 3:1. Same guide [opened].
- Transparency: set `background: "transparent"` with `output_format` `png` or `webp`. The guide does not list support per model [opened].
- fal's comparison table says `gpt-image-2` does **not** support transparent backgrounds, while gpt-image-1.5 does (auto/transparent/opaque) [opened] (INDEP/vendor), [fal, 2026-05-06](https://fal.ai/learn/tools/gpt-image-2-vs-gpt-image-1-5).
  - The same table: `gpt-image-2` launched Apr 21, 2026. gpt-image-1.5 had only 3 fixed sizes.
- Transparency on 2.6 Flare works with `background=transparent` plus PNG/WEBP; JPG, SVG and GIF are rejected [opened] (vendor doc), [Runware 2.6 Flare transparent guide, dated 2026-11-05](https://runware.ai/docs/models/openai-gpt-image-2-6-flare/guides/transparent-backgrounds). Caveats:
  - Light edge fringes show up as an outline on dark backgrounds.
  - Baked-in contact shadows become a semi-transparent grey band attached to the asset.
  - Frosted glass comes back opaque.
- Conflicting source on 2.6 transparency: Artlist's help page (updated 2026-11-08) lists transparent background on 2.5 only [summary], [Artlist GPT Image 2 family](https://help.artlist.io/hc/en-us/articles/39018863931165-GPT-Image-2-Family).
  - **Test 2.6 Sunburst transparency yourself before migrating.**

**Pricing and limitations (OFFICIAL)**
- Per-image cost from the guide's table (1024x1536 portrait) [opened]:

  | Model | Low | Medium | High |
  |---|---|---|---|
  | gpt-image-1.5 | $0.013 | $0.05 | $0.20 |
  | gpt-image-1-mini | $0.006 | $0.015 | $0.052 |
  | gpt-image-2 | $0.005 | $0.041 | $0.165 |

- Token prices:
  - 2.6: $30 per 1M image output tokens.
  - 2.5: $8 per 1M image input tokens, $2 cached; $30 per 1M output tokens.
  - Partial images cost an extra 100 output tokens each.
  - Same guide [opened].
- Limitations stated by OpenAI [opened]: "may struggle to keep recurring characters or brand elements consistent." Also precise text placement and layout-sensitive composition. Complex prompts may take up to 2 minutes.
- Org verification may be required for GPT Image models [opened].

**Prompting guide for 2.5/2.6 (OFFICIAL)** [opened, first 100k chars], [OpenAI image prompting guide](https://developers.openai.com/api/docs/guides/image-prompting)
- "create a reusable character reference to help preserve appearance across scenes, poses, and pages"
- "Do not redesign the character", "Same facial features, proportions, and color palette"
- "Keep all other aspects of the image unchanged", "Do not change anything else", "Replace only the clothing"
- "Pass the previous output as the next edit input, request one change, and repeat the details to preserve." If it drifts, "restate critical constraints."
- **"composite the approved edit into the original image instead of relying on prompting alone"** when pixel-level preservation matters.
- Give each reference image a role: "its palette, texture, or visual medium."
- To avoid unwanted additions (relevant to the "Zzz" problem): "No extra text, no watermarks, no unrelated logos"; "Do not add new elements or text"; "Do not add a solid backdrop, checkerboard, scenery, or shadow."
- "A drawn checkerboard is not transparency." Request transparency in the API, not only in the prompt.

**gpt-image-1.5 background (OFFICIAL press + INDEP)**
- Released Dec 2025. OpenAI: "stronger at image preservation and editing than GPT Image 1" [summary], [OpenAI, The new ChatGPT Images is here](https://openai.com/index/new-chatgpt-images-is-here/).
- A developer forum thread reports API reference confusion over whether `input_fidelity` applies to 1.5 and whether it defaults to low when omitted [summary] (ANECDOTE), [OpenAI community thread](https://community.openai.com/t/gpt-image-1-5-decreased-image-render-quality/1371885).
  - Possible contributor to drift if the parameter was silently ignored.

**Google Gemini / Nano Banana (OFFICIAL)** [opened, first 100k chars], [Google AI Studio image generation docs](https://aistudio.google.com/docs/image-generation)
- Current models:
  - Nano Banana 2.1 (`gemini-nano-banana-2.1`): the recommended workhorse.
  - Nano Banana 2 (`gemini-3.1-flash-image`): previous generation.
  - Nano Banana 2 Lite (`gemini-3.1-flash-lite-image`): "not optimized for multiple reference inputs or multi-turn editing."
  - Nano Banana Pro (`gemini-3-pro-image`): premium model.
  - Nano Banana (`gemini-2.5-flash-image`): legacy.
  - Imagen has been shut down.
- References: up to 14 mixed images.
  - 2.1 / 3.1 Flash: up to 10 object images and up to 4 character images.
  - Pro: up to 6 object, 5 character and 3 style references.
- Output at 1K/2K/4K. "All generated images include a SynthID watermark."
- Transparent background is not mentioned in the portion I read. → Gap.
  - Inference: probably needs background removal afterwards.
- Practitioner guides (ANECDOTE) [summary]:
  - Start with "Same character as the reference image."
  - Set the style explicitly, because the model won't necessarily copy the reference's style. [Flick.art guide](https://flick.art/blog/img2img-consistent-character/nano-banana); [SelfieLab guide, 2026-02-16](https://selfielab.me/blog/nano-banana-pro-consistent-character-sheets-guide-20260216).
  - Consistency percentages ("93%", "95%+") quoted in such blogs could not be verified. Ignore them.
- Independent opinion, Dec 2025: GPT Image 1.5 improved editing but "still not the model that beats Nano Banana Pro" [summary] (ANECDOTE), [Adam Holter](https://adam.holter.com/chatgpt-images-v1-5-is-here-better-editing-still-not-the-model-that-beats-nano-banana-pro/).

**Black Forest Labs FLUX.2 (OFFICIAL / INDEP)**
- Launched Nov 25, 2025, with multi-reference support for up to 10 images, aimed at character, product and style consistency [summary], [BFL blog](https://bfl.ai/blog/flux-2). VentureBeat reported the same 10-reference figure [summary], [VentureBeat](https://venturebeat.com/ai/black-forest-labs-launches-flux-2-ai-image-models-to-challenge-nano-banana).
- BFL's character-consistency guide [opened], [BFL docs](https://docs.bfl.ai/guides/usecases_editing_character_consistency):
  - Supply reference images and describe the new pose or scene.
  - Do iterative single-change edits.
  - Do style transfer while keeping the first image's colors.
  - "explicitly state what should stay unchanged."
  - No seed, hex-color or cartoon-specific notes appeared on that page.
- FLUX.1 Kontext (mid-2025, PAPER) is the predecessor, noted for iterative multi-turn edits [summary], [arXiv 2506.15742](https://arxiv.org/abs/2506.15742).

**Recraft V4 Styles (OFFICIAL + resellers)** [summary]
- A model line "dedicated" to style-consistent generation that always requires a style. A style can be built from 1 to 10 reference images and must be used with the model it was created with. [Recraft V4 Styles docs](https://www.recraft.ai/docs/api-reference/models/recraft-v4-styles).
- Native SVG variants: V4 Styles Vector at $0.05 and V4 Styles Pro Vector at $0.12 per image (same docs).
- fal exposes `style_id` and `style_match` ("precise"/"flexible") [summary], [fal Recraft V4 text-to-vector](https://fal.ai/models/recraft/v4/style/text-to-vector/llms.txt).
- A reseller says Pro Vector takes at most 5 references, which conflicts with the 1-10 range above [summary], [OpenRouter listing](https://openrouter.ai/recraft/recraft-v4-styles-pro-vector).

**Not researched this round**
- Midjourney `--cref`/`--oref`, Ideogram character reference and SD/LoRA/IP-Adapter/ControlNet were not checked for 2026 status. See Gaps.

### Inferences
- **Migration is forced and immediate.** Plan to regenerate or re-edit the cast on a 2.6 model, or on `gpt-image-2` plus a background-removal step, before Dec 1. Freeze the existing PNGs as the canonical "model sheet" now.
- Since masks are only guidance on every OpenAI model, mouth and eye twins should be made this way:
  1. Generate the edit.
  2. Crop only the mouth or eye region from the output.
  3. Composite it back onto the untouched base in code (sharp/ImageMagick). OpenAI itself recommends this.
  - This fixes color and line drift outside the region and keeps the mouth at the base position by construction.
- Losing glasses and clipboard, and getting a "Zzz", are prompt-adherence failures. Fix them with explicit preserve-lists ("keeps glasses and clipboard") and negative lists ("Do not add text, letters, symbols, Zzz"). Also use a QA step: compare the output against the base with a vision model or manually.
- Nano Banana's separate "character image" slots and FLUX.2's 10 references fit a turnaround or model-sheet workflow best. Recraft fits best if the goal is SVG output in one locked style.

### Gaps
- Whether 2.5/2.6 support `input_fidelity`, and whether 2.6 Sunburst supports transparency (sources conflict).
- OpenAI rate limits per tier for image models (not in the guide portions read).
- 2026 status of Midjourney character/omni reference, Ideogram character, and Stable Diffusion/SDXL/Flux LoRA + IP-Adapter + ControlNet workflows. Not researched this round; must not be inferred from pre-2025 knowledge.
- No independent benchmark found comparing these models specifically on flat 2D cartoon consistency.

## 2. Techniques that keep a character on-model

### Takeaway
Official guidance from OpenAI and BFL converges on four steps: a canonical reference image or sheet, one change per edit, restating preserved details every time, and compositing the changed region back onto the original. Fixed seeds are not exposed by OpenAI's API in anything I read. Color locking is done by prompt plus post-processing.

### Cited Findings
- Keep a reusable character reference. Repeat defining details and the palette in every prompt. Do one change per edit, chained from the previous output. Restate constraints on drift. Composite for pixel-exact preservation. [OpenAI prompting guide](https://developers.openai.com/api/docs/guides/image-prompting) [opened] (OFFICIAL)
- Supply references, state what stays unchanged, and edit iteratively. [BFL character consistency guide](https://docs.bfl.ai/guides/usecases_editing_character_consistency) [opened] (OFFICIAL)
- Generate a character sheet with Nano Banana Pro, then reuse it as the reference. [SelfieLab](https://selfielab.me/blog/nano-banana-pro-consistent-character-sheets-guide-20260216); [michydev](https://www.michydev.com/nano-banana-pro-consistent-character-thumbnail-to-reel/) [summary] (ANECDOTE)
- Recraft style IDs reused across API calls with `style_match: precise` act as a style lock. [fal Recraft V4](https://fal.ai/models/recraft/v4/style/text-to-vector/llms.txt) [summary]
- The OpenAI edit mask is not exact [opened], so region-limited edits must be enforced by compositing. [OpenAI image generation guide](https://developers.openai.com/api/docs/guides/image-generation)

### Inferences
These steps are proposed; none comes from a single source.
- **Palette lock in post.** Extract the base drawing's palette (it is flat cartoon, so maybe 8-16 colors per character). Then snap every pose or edit to the nearest palette color: k-means or nearest-neighbor remap in sharp or Python, protecting anti-aliased edges.
  - This directly attacks the color drift and is cheap.
- **Line-weight drift.** Upscale or downscale all poses through the same pipeline. Optionally re-trace them through vectorization at fixed stroke settings (see section 4).
- **Turnaround / model sheet.** Generate one sheet with front, 3/4 and side views plus a close-up of accessories (glasses, clipboard). Attach it as a second reference to every pose edit, so the model "sees" the accessories even when the pose hides them.

### Gaps
- No source documents seed control on OpenAI models. BFL's guide page did not mention seeds either, though the BFL API historically has a seed parameter (unverified for 2026).

## 3. Art for cut-out animation (layers, anchors, visemes, parallax)

### Takeaway
There is no end-to-end AI tool that outputs a rig-ready, viseme-equipped cut-out character. The practical 2026 path combines three pieces:
- **Layer decomposition models** such as Qwen-Image-Layered (Apache-2.0, CVPR 2026) or commercial "image to layers" tools.
- **Mouth sets** made by masked edit plus compositing at a fixed anchor.
- **Audio-to-viseme tools** such as Rhubarb for timing.

### Cited Findings
- **Qwen-Image-Layered** (arXiv 2512.15603, Dec 17, 2025; CVPR 2026 poster) [summary] (PAPER/OFFICIAL repo):
  - Decomposes one RGB image into a variable number of semantically separated RGBA layers (e.g. 3 or 8), and layers can be recursively decomposed.
  - Available through diffusers `QwenImageLayeredPipeline` under Apache 2.0. Community tools export PSD.
  - [arXiv](https://arxiv.org/abs/2512.15603); [GitHub](https://github.com/QwenLM/Qwen-Image-Layered); [HF](https://huggingface.co/Qwen/Qwen-Image-Layered); [CVPR page](https://cvpr.thecvf.com/virtual/2026/poster/38225).
- **"Generative Cutout Animation"** (Puhachov et al., Computer Graphics Forum, 2026) [summary] (PAPER):
  - Builds rigs from rectangular cutout canvases attached to bones.
  - The authors say they do not do Live2D-level layering, so eyes and mouth stay on one part.
  - [Wiley](https://onlinelibrary.wiley.com/doi/10.1111/cgf.70422).
- **Commercial layer separators** claim AI splitting of front hair, back hair, eyes, brows, mouth, head, torso and accessories, with inpainting of hidden areas. Rigging is still done in Live2D, Spine or After Effects. [imagetolayers.com](https://www.imagetolayers.com/solutions/rig-ready-character-layers) [summary] (vendor, unverified)
- **Viseme tooling:**
  - LipSync Studio (Blender) does audio → visemes and can download Rhubarb [summary], [Superhive](https://superhivemarket.com/products/lipsync-studio--audio-driven-mouth-animation-for-blender).
  - Adobe Character Animator needs viseme layers inside a tagged Mouth group [summary] (ANECDOTE, forum, 2021, possibly outdated), [Adobe community](https://community.adobe.com/t5/character-animator-discussions/lip-synch-not-working-at-all/td-p/12403047).
  - The JALI viseme model (SIGGRAPH 2016, older) is the reference for co-articulation [summary], [JALI PDF](https://dgp.toronto.edu/~elf/JALISIG16.pdf).

### Inferences
- **Mouth set for this project.** Generate a mouth sheet per character, for example the Preston Blair / Rhubarb set A-H plus X (rest), as edits of a head crop.
  - Composite each mouth onto the base inside a fixed bounding box anchored at the base mouth center.
  - Store offsets in the character JSON so Remotion places mouths at one anchor. This fixes "mouths move away from base position."
- **Eye blink.** Do the same: an eyelid overlay layer composited over the eye region, instead of a full-image closed-eye twin.
- **Head/arm separation.** Qwen-Image-Layered or a manual split of the existing base gives a head layer for a subtle head bob, cheaper than generating new full poses.
- **Parallax.** Generate the background as a plate. Then run layer decomposition, or a separate transparent edit, to pull a foreground layer (counter, shelf edge) for 2-3 parallax planes.

### Gaps
- No practitioner write-ups (GDC/CTN talks, indie studio blogs) found this round on AI art for cut-out series production specifically.
- No tests found of Qwen-Image-Layered on flat cartoon characters.

## 4. Upscaling, resolution and vectorization

### Takeaway
For a 1080x1920 frame with a 1.5x camera zoom, character art needs roughly 1.5-2x more pixels than a 1024x1536 base provides when the character fills most of the frame. Options:
- Generate larger: `gpt-image-2` allows edges up to 3840 px; 2.6 allows custom sizes in multiples of 16.
- Upscale.
- Vectorize: VTracer handles color art, Potrace only binary images. Recraft outputs native SVG.

### Cited Findings
- `gpt-image-2` supports any size up to a 3840 px edge with ratio ≤ 3:1. On 2.5, above 2560x1440 is "experimental." Nano Banana outputs up to 4K. [OpenAI guide](https://developers.openai.com/api/docs/guides/image-generation) [opened]; [Google docs](https://aistudio.google.com/docs/image-generation) [opened]
- VTracer:
  - Handles colored images; Potrace accepts only binarized input.
  - VTracer skips Potrace's expensive polygon search, which makes it faster.
  - Has a `bw` preset and color modes.
  - [VTracer GitHub](https://github.com/visioncortex/vtracer) [summary] (OFFICIAL repo)
  - Speed and accuracy claims in third-party blogs are unreliable, per the search summary.
- Recraft V4 Styles Vector outputs SVG directly ($0.05 / $0.12 Pro). [Recraft docs](https://www.recraft.ai/docs/api-reference/models/recraft-v4-styles) [summary]

### Inferences
- **Resolution math (my calculation).** A character 80% of frame height is about 1536 px on screen. At 1.5x zoom that becomes about 2300 px, so a 1536 px-tall base gets upscaled about 1.5x and goes soft.
  - Either generate at about 2048x3072 (now possible on 2.6 / `gpt-image-2`) or run a 2x upscaler.
  - Upscaler families such as Real-ESRGAN anime models were not researched in 2026; see Gaps.
- **Vectorization helps flat cartoon art.** It gives resolution independence for zooms, uniform edges and an implicit palette reduction.
  - It can round off fine details (glasses frames, small text).
  - Tracing line art separately from fills preserves line weight better.
  - Remotion renders SVG natively.
- **Backgrounds** only need about 1.5x frame coverage: 1620x2880 for 1.5x zoom. A 1536x1024 landscape plate cropped vertically is far too small. Generate backgrounds at 9:16 or at least 2048 px on the long side.

### Gaps
- No 2026 comparison of AI upscalers for cartoon art (Real-ESRGAN anime, Topaz, Recraft upscale, Magnific) was found this round.

## 5. Backgrounds: consistent locations, perspective, variants

### Takeaway
Edit-based variation from one master plate works with all reference-capable models: change the time of day, push in to a close-up, keep everything else. Matching floor line and perspective to characters is not handled by any model feature. It has to be enforced by composition: a fixed horizon and floor-line height in every plate, and characters placed in code.

### Cited Findings
- Iterative edits that change setting or weather while keeping the subject. [BFL guide](https://docs.bfl.ai/guides/usecases_editing_character_consistency) [opened]
- Style transfer keeping the reference's colors. Same source.
- OpenAI: assign references a palette or medium role; "Keep all other aspects of the image unchanged." [OpenAI prompting guide](https://developers.openai.com/api/docs/guides/image-prompting) [opened]
- OpenAI lists layout-sensitive composition as a limitation. [OpenAI guide](https://developers.openai.com/api/docs/guides/image-generation) [opened]
- Nano Banana Pro takes up to 3 style references, separate from object references. [Google docs](https://aistudio.google.com/docs/image-generation) [opened]

### Inferences
- **Master plate per location.** Make one high-res master plate per location. Derive time-of-day, angle and close-up variants by edit, passing the master as the first image.
- **Fixed geometry.** Every prompt states the horizon and floor line, e.g. "eye-level camera, horizon at 40% of image height, floor meets wall at 70%." Verify and crop in code.
- **Move off `gpt-image-1-mini` for backgrounds.** It is being retired. Switching to the same model family as the characters may also reduce style mismatch between characters and backgrounds.

### Gaps
- No source found on automatic perspective matching between AI characters and AI backgrounds.

## 6. Costs, rate limits, content policy, legal/platform status

### Takeaway
At 2026 prices, generating a full cast is cheap: tens of cents per image even at high quality. Moderation has an `auto`/`low` setting.

On copyright, as of Mar 2026, purely AI-generated images are not copyrightable in the US. The Supreme Court denied cert in Thaler, and the USCO Part 2 report (Jan 2025) holds that prompting alone is not authorship. Human selection, arrangement and editing can be protected.

YouTube requires disclosure only for realistic synthetic content and exempts animation. Its monetization risk comes from "repetitive/inauthentic" content, not from AI use itself.

### Cited Findings
- **Prices:** see the section 1 table. gpt-image-2 high 1024x1536 costs $0.165; 2.6 is $30 per 1M output tokens. [OpenAI guide](https://developers.openai.com/api/docs/guides/image-generation) [opened]
- **Moderation parameter** [opened], same guide:
  - `auto` (default) is "Standard filtering that seeks to limit creating certain categories of potentially age-inappropriate content."
  - `low` is "less restrictive."
  - The `user` parameter is deprecated in favor of `safety_identifier`.
- **Famous-character resemblance:** the project's own CLAUDE.md records that a moustached electrician in overalls and cap got blocked. I found no official 2026 OpenAI doc text listing resemblance rules. → Gap.
- **Copyright:**
  - USCO Part 2 (Jan 29, 2025, possibly outdated, but still the operative guidance): wholly AI-generated output is not protected; AI-assisted work and AI material within a larger human work is not barred; iterative prompting is not sufficient authorship. [Copyright Office NewsNet](https://www.copyright.gov/newsnet/2025/1060.html); [Copyright Alliance summary](https://copyrightalliance.org/ai-report-part-2-copyrightability/) [summary]
  - The Supreme Court denied cert in Thaler v. Perlmutter (No. 25-449) on Mar 2, 2026. [Mayer Brown, 2026-03-11](https://www.mayerbrown.com/en/insights/publications/2026/03/supreme-court-denies-review-in-ai-authorship-case) [summary]
  - Brazilian law was not researched.
- **YouTube disclosure** [summary], [YouTube Help 14328491](https://support.google.com/youtube/answer/14328491):
  - Disclose realistic altered or synthetic content. Unrealistic or animated content is exempt.
  - Disclosure "won't limit a video's audience or impact its eligibility to earn money."
  - YouTube may auto-apply labels based on C2PA metadata or detection.
- **YouTube monetization** [summary], [TechRepublic](https://techrepublic.com/article/news-youtube-ai-video-monetization-rules):
  - The update does not ban AI videos. Repetitive AI-generated content, emotionally manipulative content and AI avatars on sensitive topics are limited.
  - Creative use of AI with unique value remains eligible.
  - Stricter claims of penalties for non-disclosure in a June 2026 article contradict YouTube's help page; treat them as unverified. [primetel.com.cy](https://primetel.com.cy/youtube-adds-mandatory-disclosure-b-badges-for-ai-generated-and-altered-content-8705)
- **Watermarks:** Gemini images always carry SynthID. [Google docs](https://aistudio.google.com/docs/image-generation) [opened]
  - Inference: platforms may auto-label these via detection or C2PA, even though cartoon content is disclosure-exempt on YouTube.

### Inferences
- A cartoon series made with AI art does not need YouTube's synthetic-content toggle. The episodic writing and voice work help it stay clear of "repetitive content" flags.
- **Trademark rather than copyright.** The characters' visual designs likely cannot be copyrighted as raw AI output. Protection would come from human edits and compositing (which strengthen the authorship claim) and from trademark on names like "Lici" / "Zé Garimpo", if that matters.

### Gaps
- OpenAI image rate limits by tier for 2.6 models.
- TikTok and Instagram AI-label rules for 2026.
- Brazilian copyright position on AI works.
- OpenAI's 2026 policy text on public figures and copyrighted character resemblance.
