# Grafismo e efeitos: legendas, cartelas, transições e efeitos em vídeo vertical (Remotion), estado 2026

Research date: 2026-11-22. Context: 1080x1920, 30 fps, 30-40 s animated comedy.
Legend for source status: **[opened]** = page fetched and read; **[summary]** = only seen via search-result summary (verify before quoting). Categories: **PLATFORM** (official platform/vendor-of-tool docs), **INDEPENDENT** (academic, broadcaster, encyclopedic), **VENDOR** (caption/editing tool companies selling the thing they measure).
Budget note: about 20 tool calls; several official pages (BBC, Netflix partner site, TikTok Creative Center) could not be fetched, so some numbers are from secondary summaries and flagged.

## 1. Captions on short-form: readability, style, retention, accessibility

### Takeaway
Broadcast subtitle standards give firm numbers (around 8% of frame height per line, at most 2 lines, about 37-42 characters per line, 160-180 wpm, at least 5/6 s per event, a box or outline for contrast). Nobody has published a peer-reviewed study of animated word-highlight captions on short-form retention. The 15-34% "watch-time lift" figures all come from vendors. Academic work on keyword highlighting finds it helps learning but can distract in ordinary viewing.

### Cited Findings
**INDEPENDENT / broadcaster guidance**
- BBC: line height for 16:9 online content is reportedly 8% of active video height. That figure comes via a third-party blog, not the BBC page. — [md-subs blog](https://www.md-subs.com/blog/saa-subtitle-font-size) [summary]. A BBC R&D CSUN talk ("How big should subtitles be?") asks whether subtitles need to be authored above 8% line height and questions whether one size formula exists, so 8% is a baseline still under study, not a fixed rule. — [BBC R&D CSUN talk](https://bbc.github.io/csun/how_big_should_subtitles_be/index.html) [summary]
- BBC reading speed: 160-180 wpm is the most repeated figure; about 15 cps is also quoted. — [Clevercast summary of BBC guidelines](https://clevercast.com/bbc-subtitling-guidelines) [summary]. The official BBC guide (bbc.co.uk/accessibility/forproducts/guides/subtitles) could not be fetched in this session. The bbc.github.io/subtitle-guidelines URL returned 404.
- Channel 4 (guide dated 2026-06): about 2 seconds per subtitle line. — [Channel 4 Full Subtitling Guidelines PDF](https://assets-corporate.channel4.com/_flysystem/s3/documents/2026-06/CHANNEL%204%20FULL%20SUBTITLING%20GUIDELINES%20new.pdf) [summary]
- Netflix: 42 characters per line max in most Latin-script language guides (16 for Chinese). Minimum event duration 5/6 s (20 frames at 24 fps), maximum 7 s. — [Netflix Timed Text Style Guide: General Requirements](https://backlothelp.netflix.com/hc/en-us/articles/215758617); [Netflix FAQ max characters](https://backlothelp.netflix.com/hc/en-us/articles/215274938-What-is-the-maximum-number-of-characters-per-line-allowed-in-Timed-Text-assets); [PT-BR guide](https://backlothelp.netflix.com/hc/en-us/articles/215600497-Portuguese-Brazil-Timed-Text-Style-Guide) [summary]
- Netflix reading speed: 20 cps for adult programs and 17 cps for children's, per 3Play Media's summary; some language guides use 17 cps adult and 13 cps child. Check the Brazilian Portuguese guide for the exact cps that applies here. — [3Play Media OTT caption specs](https://www.3playmedia.com/blog/captioning-specs-ott-providers/) [summary]
- Line length range of 37-42 characters is common across standards. — search summary citing academic subtitling literature (salford/rgu repositories, [UCL Press OA book](https://library.oapen.org/bitstream/20.500.12657/51813/1/9781787357105.pdf)) [summary]
- Contrast: WCAG 2.x requires 4.5:1 text contrast for normal text and 3:1 for large text. This is general knowledge, not fetched in this session; source would be [W3C WCAG 2.2 SC 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum) [not opened].

**INDEPENDENT / academic on highlighting**
- Time-synchronized keyword highlights were the preferred design for language learning, but participants found them "too distracting to replace standard captions in everyday viewing." — [arXiv 2307.05870 "Useful but Distracting"](https://ar5iv.labs.arxiv.org/html/2307.05870) [summary] (2023, possibly outdated)
- Young learners: enhanced (highlighted) captions improved form recognition of target words. — [Benjamins, LLLT 61](https://benjamins.com/catalog/lllt.61.03fin) [summary]
- Deaf and hard-of-hearing viewers preferred lecture captions with important words highlighted. — [NSF PAR 10170034](https://par.nsf.gov/servlets/purl/10170034) [summary] (pre-2024)

**VENDOR data (treat as marketing)**
- An internal test of 7 animated caption styles against plain auto-captions on 80 short videos found word-by-word emphasis gave +34% watch time. — [Fluxnote blog](https://fluxnote.io/blog/ai-captions-that-improve-watch-time) [summary]
- Word-by-word highlighting gives "+18-23% average watch time" over static captions; no source given. — [Blitzcut](https://blitzcutai.com/blog/animated-captions-vs-static-captions) [summary]
- 15-25% completion-rate difference between sentence-at-a-time and highlighted word-by-word captions. — [OpusClip caption presets blog](https://www.opus.pro/blog/best-caption-presets-styles-boost-retention) or [dev.to clamper_ai](https://dev.to/clamper_ai/how-ai-caption-styles-affect-watch-time-and-engagement-409i) [summary; exact attribution among these vendors unclear]
- Vendor caveat: aggressive captions over complex on-screen action can hurt retention through cognitive overload. — [CapCut caption timing](https://www.capcut.com/create/caption-timing-viewer-attention) [summary]
- Placement advice from an editing vendor (dated 2026-09-07): 1-2 short lines broken by meaning. Test the longest two-line caption and the widest animated word, not just the first sentence. Protect contrast with a plate, shadow, outline or opaque box. Don't align the last word against the right edge on Reels. Avoid two competing caption systems (burned-in plus platform auto-captions). — [Reap safe-zones guide](https://reap.video/blog/short-form-video-safe-zones) [opened]

### Inferences
- Applied to 1920 px height, BBC's 8% line height is about 150 px per line. That is far bigger than typical short-form captions, but BBC numbers assume a TV viewed across a room. On a phone held at about 30 cm, the common short-form practice of a 70-100 px cap-height bold sans is plausible. No source gives a phone-specific number (see Gaps).
- Four words per page at short-form speech rates is roughly 1-1.5 s per page, which is at or above Netflix's 5/6 s minimum. That fits the guidance, provided pages never flash shorter than about 20-25 frames at 30 fps.
- The current setup (thick dark stroke, gold active word, 4 words, about 400 px from the bottom) matches vendor "best practice." The evidence for the gold highlight raising retention is vendor-only. The academic hint is that highlighting draws attention but can distract, so a subtle active-word change (color only, small scale) is safer than big bounces when the cartoon action itself carries the joke.
- Stroke vs box: no source compares them on retention. Broadcasters (BBC/Netflix) traditionally use a box or outline for contrast. A thick stroke plus shadow is fine against busy cartoon backgrounds if contrast reaches at least 4.5:1.

### Gaps
- No phone-specific font-size study for vertical video was found; the BBC R&D talk may contain one but was not opened.
- No peer-reviewed A/B on karaoke highlight vs static, emoji in captions, or pop-in scale for short-form retention.
- Could not open the official BBC guide or the Netflix English general-requirements page to confirm cps/wpm.
- Speaker name tags: no evidence found either way; BBC traditionally uses colour per speaker (not verified this session).

## 2. Safe zones for TikTok, Reels and Shorts (2026)

### Takeaway
No platform publishes an official organic-content safe zone. The published numbers come from ad specs (Google, Meta, TikTok Creative Center) and vendor checkers, and they disagree by 100+ px. The conservative consensus is a centered box of about 900x1400 in 1080x1920. Bottom margins run from about 480 px to 672 px, and essential text should stay out of the bottom quarter on TikTok.

### Cited Findings
- Official resources are mostly for ads: [Google "Universal Video Ad Safe Zones" PDF](https://services.google.com/fh/files/misc/universalsafezones-youtube.pdf), [Meta Reels ads safe-zone page](https://www.facebook.com/business/ads/facebook-instagram-reels-ads), [TikTok Creative Center accelerator](https://ads.tiktok.com/business/creativecenter/quicktok/online/tiktok_creative_accelerator/pc/en). The Reap guide warns these "should not be presented as permanent pixel rules for all organic Shorts, Reels or TikToks." — [Reap, 2026-09-07](https://reap.video/blog/short-form-video-safe-zones) [opened]
- Reap's conservative cross-platform margins: sides 10-15% (108-162 px), top about 15% (288 px), bottom 25-35% (480-672 px). Right side holds the action rail; bottom holds account name, caption, audio, and commerce controls. — [Reap](https://reap.video/blog/short-form-video-safe-zones) [opened]
- Universal safe zone of 900x1400 centered. TikTok 900x1492 with a 108 px top block; Reels 996x1400. — [AdaptlyPost 2026 guide (PT)](https://adaptlypost.com/pt/blog/social-media-safe-zones-2026-complete-guide) [summary]
- TikTok margins: 240 px top, 660 px bottom, 120 px each side. Buttons take about 300 px on the right from y=840 down. — [Upload-Post checker](https://www.upload-post.com/tools/safe-zone-checker/) [summary]
- Meta Reels ad specs (as cited by a checker): leave 14% top (about 269 px), 35% bottom (about 672 px), 6% each side (about 65 px). — [Bundle.social checker](https://bundle.social/tools/safe-zone-checker) [summary]
- Other 2026 measurement claims: [ManyPixels TikTok specs](https://www.manypixels.co/blog/social-media-design/tiktok-ad-specs), [Wildandfree 2026](https://wildandfreetools.com/blog/vertical-video-safe-zones-guide-2026/) [summary only]

### Inferences
- Conflict summary for the bottom margin: Upload-Post (TikTok) 660 px, Meta 35% = 672 px, Reap 480-672 px, AdaptlyPost about 260 px (implied by 1400 centered). The captions' current baseline is about 400 px above the bottom, which sits inside the bottom UI band for TikTok and Reels under the stricter sources. Moving the caption block so its bottom edge is about 560-680 px up, or at least its lowest line is above about 500 px, would clear all sources except the most conservative. The speaker tag above it must also stay below the top margin, which is easy.
- Right rail: keep caption lines inside x ≤ about 900-960 (120-180 px right margin); the action rail starts around y≈840 on TikTok per Upload-Post.
- The closing card's URL should sit in the vertical middle third (y about 600-1300), not the bottom.

### Gaps
- No official TikTok, Instagram or YouTube organic safe-zone document for 2026 was found.
- The Google PDF and Meta page were not opened; their exact figures are unverified here.

## 3. Title cards, first frame, on-screen text duration, cover frames

### Takeaway
Platform documentation here is thin. The evidence found covers mechanics (choosing the cover frame) more than which first frame works best. Advice converges on a first frame that is readable at thumbnail size, with an identifiable subject and motion or bold text in the first second. On-screen text duration can borrow subtitle rules: at least 5/6 s and about 2 s per line.

### Cited Findings
- YouTube Shorts: creators can choose and edit a thumbnail frame after upload in the app (text, filters, emoji). Custom-uploaded Shorts thumbnails were rolled out (YPP creators). — [YouTube Blog, Studio custom thumbnail updates](https://blog.youtube/news-and-events/youtube-studio-custom-thumbnail-updates/) [summary]; [Search Engine Journal](https://www.searchenginejournal.com/youtube-rolls-out-new-shorts-thumbnail-editing-features/526162/) [summary]
- Frame choice: main subject identifiable at a glance; essential words readable at small sizes. — [CapCut (vendor)](https://www.capcut.com/create/ai-image-generator/short-thumbnail-frame-choice) [summary]
- TikTok: cover can be a frame or an uploaded image. Many creators default to the first frame. The cover title overlay shows only on the profile grid, not in the For You feed. — [Loomly](https://loomly.com/blog/tiktok-thumbnails) [summary]
- First second: use movement, bold text, a question, or an attention-grabbing visual. — [vidIQ Shorts thumbnails](https://vidiq.com/blog/post/youtube-shorts-custom-thumbnails/) [summary, vendor/creator-tool]
- Text duration baseline: Channel 4 uses about 2 s per line; Netflix minimum is 5/6 s. — see section 1 sources.

### Inferences
- A 2.6 s title card with script lettering over rings, before any character or action, delays the hook. With no hard data, the cross-source advice (subject plus motion in the first second) suggests putting a character mid-action behind or alongside the title from frame 0. Shortening the isolated title to about 1-1.5 s, or overlaying it on the opening scene, keeps the series branding.
- Script lettering is harder to read at thumbnail size than a bold sans (general typography principle, unsourced here). If the title is also the cover frame, it needs a bold, high-contrast line.

### Gaps
- No official TikTok Creative Center or Creator Academy page on first-frame composition (face vs text vs action) was retrieved.
- No independent retention data on title-card length in short-form.

## 4. Transitions and pacing in comedy

### Takeaway
Comedy editing advice is consistent and mostly practitioner-level (pre-2024 for the classics). Timing is decided in a few frames. Hard cuts after the punchline beat decorative transitions. Whip pans and smash cuts work as comic devices when they are the joke (a reveal or contrast), and they become gimmicks when used as routine connectors. Leave room after the laugh.

### Cited Findings
- Editing decides whether a joke lands; a few frames added or trimmed matter. — [PremiumBeat, editing comedy scenes](https://www.premiumbeat.com/blog/how-to-edit-comedy-scenes-for-maximum-laughs) [summary]
- Cut on action or reaction to punctuate comic beats; keep action and reaction in the same shot when possible (the Jackie Chan editing lesson). — [Fiveable study guide](https://fiveable.me/cinematography/unit-12/visual-approaches-comedy-action/study-guide/Coi7x1GCgWeqQe4O); [Finchley](https://finchley.co.uk/finchley-learning/comedy-video-secrets-adding-humor-with-transitions-in-adobe-video-editing) [summary]
- Whip pan: a fast pan out in one direction, then into the next shot at the same direction and speed, with motion blur hiding the cut. Good for reveals; a gimmick if overused. — [Nikon UK, 10 pacing tricks](https://www.nikon.co.uk/en_GB/learn-and-explore/magazine/tips-and-tricks/cut-to-the-chase-10-tricks-to-add-pace-and-energy-to-your-edits); [AIR Media-Tech](https://air.io/youtube-hacks/editing-tricks-for-fast-paced-funny-videos) [summary]
- Cut right after the punchline ("leave them wanting more"). — [Descript blog](https://www.descript.com/blog/article/learn-how-to-edit-a-comedy-clip-and-make-your-jokes-land) [summary]
- Allow for the length of the audience's laugh; a long laugh can drown the next joke. — [Reisz, The Technique of Film Editing (1958)](https://lantern.mediahist.org/catalog/techniquefilmedit00reis_0107) [summary] (historic)
- Smash cut and Gilligan cut as comic devices (contrast between statement and outcome). — [Adobe smash cut](https://www.adobe.com/creativecloud/video/post-production/cuts-in-film/smash-cut.html); [TV Tropes Gilligan Cut](https://tvtropes.org/Main/GilliganCut) [summary]

### Inferences
- For a 30-40 s sketch, the default should be hard cuts. Reserve one stylized move per episode (whip pan, smash cut to an iris, a zoom punch-in on the reaction) for the punchline or the twist. A 3-5 frame zoom punch-in (scale 1.0 to 1.15) on the reaction is cheap in Remotion and reads as a "camera" beat.
- After the punchline, hold about 0.5-1 s on the reaction before the closing card. On social there is no audience laugh, but the joke needs time to register.

### Gaps
- No quantitative evidence (retention curves) on transition types in short-form comedy.

## 5. Cartoon effects vocabulary and procedural drawing

### Takeaway
Mort Walker's *Lexicon of Comicana* (1980; new edition 2025) is the standard naming system for comic symbols. It names emanata, plewds, squeans, briffits, grawlixes, agitrons, hites, indotherms and blurgits/swalloops. Smear frames are well documented in animation (1940s onward). "Impact frames" (flash-white, inverted, starburst) are poorly sourced in text form. Every one of these effects is simple geometry that can be drawn with SVG paths plus seeded randomness.

### Cited Findings
- Lexicon of Comicana terms: **emanata** (lines radiating from the head for shock or surprise); **plewds** (flying sweat drops for stress or effort); **squeans** (starbursts or bubbles for dizziness or drunkenness); **briffits** (dust clouds left by a fast exit); **grawlixes** (symbol strings for swearing); **agitrons** (wiggly lines for shaking); **hites** (speed lines); **blurgits/swalloops** (curved motion arcs); **indotherms** (wavy rising lines for heat or smell). Some terms (briffits, squeans, plewds) are credited to Charlie Rice. First published 1980, new edition 2025. — [Wikipedia: The Lexicon of Comicana](https://en.wikipedia.org/wiki/The_Lexicon_of_Comicana); [Wikipedia talk page](https://www.wikipedia.com/wiki/Talk:The_Lexicon_of_Comicana); [Internet Archive scan](https://archive.org/details/lexicon-of-comicana/mode/2up) [summary]
- Motion lines trope catalogue. — [TV Tropes Motion Lines](https://tvtropes.org/pmwiki/pmwiki.php/Main/MotionLines) [summary]
- Smear frame: a single frame that shows fast motion by distorting or elongating the subject between key poses, over 1-2 frames, or by drawing multiple limbs in one frame. In use since the 1940s; loses impact if overused. — [Wikipedia: Smear frame](https://en.wikipedia.org/wiki/Smear_frame); [Bloop Animation](https://www.bloopanimation.com/the-art-of-smear-frames/); [CG Wire 2026](https://blog.cg-wire.com/smear-frames/) [summary]
- Impact frames described as contact-moment frames with starburst shapes, cracked textures or flash-white backgrounds. Only one weak commercial source was found. — [Alibaba insights](https://www.alibaba.com/product-insights/how-to-draw-dynamic-action-scenes-like-japanese-animators.html) [summary; low reliability]

### Inferences (implementation, engineering judgment, not sourced)
- Current effects map onto the lexicon as follows: gold rays = emanata/"idea" lines; dust cloud = briffit/fight cloud; dizzy stars = squeans; Zzz and "!"/"?" are standard symbolia. Missing high-value items for comedy: plewds (sweat drops for embarrassment), agitrons (trembling), speed lines/hites on entrances and exits, an anger vein (manga cross-popping vein), and grawlixes for a censored outburst, which also suits brand-safe swearing.
- Procedural recipes for Remotion:
  - Speed lines: N `<line>`s from the edges toward a focal point. Length and opacity come from `random(\`sl-${i}\`)`, and they re-randomize every 2-3 frames (seed by `Math.floor(frame/2)`) to get the boiling look.
  - Impact frame: 1-2 frames of a full-screen white `<rect>` or `filter: invert(1)` on the scene, plus a starburst polygon (alternating radii r1/r2 over 12-20 points). Flashing white for 1 frame is fine, but avoid repeated flashes above 3 per second (WCAG 2.3.1, three-flash threshold; not opened, general knowledge).
  - Smear: scale the character along the motion vector (scaleX 1.4, scaleY 0.8) for 1-2 frames, plus a few duplicated low-opacity copies offset backward.
  - Onomatopoeia ("PÁ!", "TOIN!"): bold condensed font, thick stroke, slight rotation, scale spring overshoot (spring from 0 to 1.2 to 1.0 over about 6-8 frames), shown about 0.5-0.8 s.
  - Comic background: radial halftone dot pattern via SVG `<pattern>` with circles whose radius scales with distance, or a burst of alternating-color triangles behind a character for the "focus" beat.

### Gaps
- No authoritative source on impact-frame conventions (anime sakuga references were not retrieved).
- McCloud's *Understanding Comics* was not consulted this session.

## 6. Texture and finishing (grain, paper, halftone, chromatic aberration, vignette, LUTs)

### Takeaway
SVG `feTurbulence` grain is cheap to author and tiny. Render cost depends mainly on `numOctaves` (keep it ≤ 3-4) and on whether the GPU is present. Remotion's docs flag CSS blur, shadows, gradients and canvas as GPU-heavy, slow on cloud instances, and better replaced with precomputed images. No evidence was found on which finishes look "dated," so judgments here are taste.

### Cited Findings
- `fractalNoise` gives film-like grain where `turbulence` gives marbling. Desaturate with `feColorMatrix`; use `stitchTiles="stitch"` for seamless tiles. — [Frontend Masters "Grainy Gradients"](https://frontendmasters.com/blog/?p=6066); [CSS-Tricks](https://css-tricks.com/?p=335760); [MDN feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence) [summary]
- `numOctaves` above 3-4 costs performance for little visible gain; above 5 the difference is practically invisible. — [Codrops feTurbulence article (2019)](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/) [summary] (pre-2024 but still valid SVG spec behavior)
- A WebKit bug documents a performance problem with feTurbulence plus feColorMatrix grain. — [WebKit bug 287982](https://bugs.webkit.org/show_bug.cgi?id=287982) [summary]. Remotion renders in Chromium, so this bug is less relevant.
- Replacing a 120 KB grain image with an SVG under 300 bytes, used as a low-opacity overlay. — [jeantinland.com](https://www.jeantinland.com/blog/120kb-less/) [summary]
- Remotion performance: `box-shadow`, `text-shadow`, `linear-gradient()`, `radial-gradient()`, `filter: blur()`, `filter: drop-shadow()`, 2D canvas and WebGL are GPU-heavy. "Compute instances in the cloud do not have a GPU and may take a long time to render these effects. Consider replacing those effects with a precomputed image." Other tips: tune `--concurrency` with `npx remotion benchmark`; JPEG frames are faster than PNG; use `--log=verbose` to find the slowest frames; `useMemo` for expensive computation. — [Remotion docs: Performance](https://www.remotion.dev/docs/performance) [opened]

### Inferences
- Static grain (one fixed seed) looks like paper texture; animated grain (change `seed` on feTurbulence every 2 frames) looks like film. For flat cartoon art, a static paper texture at 4-8% opacity plus a soft vignette is low-risk polish. Heavy chromatic aberration and VHS looks read as trend effects. That is taste, unsourced.
- The text-shadow/stroke on captions and the radial gradients for the rings and rays are GPU-heavy per Remotion. If renders run on a laptop with a GPU, this is fine. On CI or Lambda, pre-render the rings and rays to PNG.
- Grain on top of captions reduces their contrast. Put grain below the caption layer.

### Gaps
- No source found for halftone via SVG filters, LUT application in Remotion, or measured render-time costs per effect.

## 7. Remotion specifics: determinism, effects, packages, showcases

### Takeaway
Remotion requires deterministic randomness: `random(seed)`, never `Math.random()`, because frames render in parallel across tabs and threads. Since v4.0.464 Remotion ships `@remotion/effects`: blur, pixelate, iris wipe and others, chainable, with custom effects via `createEffect()` on Canvas2D, WebGL2 or WebGPU. `@remotion/transitions` provides wipe, iris and clockWipe presentations inside `TransitionSeries`. I did not open the docs for the other packages in the brief (`noise`, `paths`, `shapes`, `lottie`, `three`, `skia`, `google-fonts`) this session.

### Cited Findings
- `random(seed)` returns 0-1 deterministically from a number or string seed. Calling `random()` with no seed throws. `random(null)` is truly random. `Math.random()` triggers an ESLint warning because Remotion renders "across multiple threads and opens the website several times." String seeds like `random(\`x-${i}\`)` give stable per-item values. — [Remotion docs: random()](https://www.remotion.dev/docs/random) [opened]
- `@remotion/effects`: available from v4.0.464. Effects such as `blur({radius})` and `pixelate({blockSize})` go in an `effects` array and apply in order. They work on `<Solid>`, `<HtmlInCanvas>`, `<Video>`, `<Img>`, `<CanvasImage>`, `<AnimatedImage>`, `<Gif>`, Rive, and `@remotion/shapes` (from v4.0.474). `effectsOutputSize` sets the processing resolution; "a larger effect resolution increases processing and canvas memory." Custom effects use `createEffect()` (2D Canvas, WebGL2 or WebGPU), with Studio controls. Shader-based transitions also accept `effects`. — [Remotion docs: Effects](https://www.remotion.dev/docs/effects) [opened]; [Effects API](https://www.remotion.dev/docs/effects/api) [opened; full effect list did not render]
- An `irisWipe` effect exists at `@remotion/effects/iris-wipe`, separate from the `iris()` transition. — [Remotion docs: iris wipe effect](https://www.remotion.dev/docs/effects/iris-wipe) [summary]
- `@remotion/transitions`: `TransitionSeries` with `.Sequence` and `.Transition` (presentation plus timing such as `linearTiming({durationInFrames})` or springTiming). Presentations include `wipe()` (8 directions, e.g. "from-left"), `iris()` (circular mask expanding from the center), and `clockWipe()` (circular sweep). — [TransitionSeries](https://remotion.dev/docs/transitions/transitionseries); [presentations](https://www.remotion.dev/docs/transitions/presentations); [wipe](https://www.remotion.dev/docs/transitions/presentations/wipe); [iris](https://www.remotion.dev/docs/transitions/presentations/iris); [clock-wipe](https://www.remotion.dev/docs/transitions/presentations/clock-wipe) [summary]
- Performance guidance: see section 6. — [Remotion Performance](https://www.remotion.dev/docs/performance) [opened]

### Inferences
- The closing card's iris close and open could move from custom CSS to `TransitionSeries` with `iris()`, or to the `irisWipe` effect. That saves code, but check that the iris can be centered on the last speaker. The docs summary says it expands "from the center"; an offset option was not verified.
- Every procedural effect (sparkles, dust puffs, stars, speed lines) should seed with a stable string per element plus, if boiling is wanted, `Math.floor(frame / k)`. This keeps renders identical across concurrency settings.
- The locally installed `remotion-markup`, `remotion-captions` and `remotion-best-practices` skills in this environment likely contain current API details for fonts, captions and Lottie. The report writer or implementer should consult them, since I did not verify package docs for `@remotion/noise`, `@remotion/paths`, `@remotion/shapes`, `@remotion/lottie`, `@remotion/google-fonts`, `@remotion/three` or `@remotion/skia`.

### Gaps
- No pages were opened for `@remotion/noise` (noise2D/3D/4D), `@remotion/paths` (evolvePath for stroke-draw lettering, useful for writing the URL in script), `@remotion/shapes`, `@remotion/lottie`, `@remotion/three`, `@remotion/skia` or font loading. Their APIs and the existence of animated-cartoon showcase projects are unverified here.
- The full list of `@remotion/effects` built-ins (whether grain, noise, vignette or chromatic aberration exist) did not render. Check https://www.remotion.dev/docs/effects/api in a browser.
- No Remotion showcase of animated cartoons was found in this session.
