# Visual craft for polished low-budget 2D animation (vertical 9:16 cut-out series)

Source key: **[opened]** means I fetched and read the page. **[search summary]** means I only saw a search-engine summary or snippet, so treat it as weaker. Inferences for our setup (flat cut-out characters with dark-brown outlines, muted cool painted background 2880x1920, 9:16 camera glide, blurred oval shadow, dimmed non-speakers) are kept in the "Inferences" subsections only.

Research budget note: about 17 tool calls in total. Strong primary material was found for Bluey (art director's own Substack and an It's Nice That feature), Hilda (Toon Boom / Mercury Filmworks), Pixar color scripts and Gurney's atmospheric perspective. For Gravity Falls, Steven Universe, Gumball, Adventure Time, anime comedy reaction backgrounds, line weight rules and ambient background motion I found little or nothing primary. Those are listed under Gaps.

---

## 1. Character design for readability and appeal

### Takeaway
The industry-standard checks are the solid-black silhouette test and a consistent shape language (round = friendly, square = stable/dependable, triangle = aggressive/dynamic). Proportions are measured in head units, and pushing them is the main lever for comedy and age. I found no primary source giving numeric phone-size readability rules.

### Cited Findings
- Silhouette test: fill the character solid black. If it is not immediately identifiable, the design needs work. Readability means a viewer understands what is happening "even in a single frame", and animators block key poses as silhouettes to check line of action and posture. [search summary] — [BINUS DKV, "The Power of Silhouette"](https://binus.ac.id/bandung/dkv/2025/11/04/the-power-of-silhouette-designing-readable-characters-in-motion/); [Fiveable study guide](https://fiveable.me/2d-animation/unit-13/creating-character-silhouettes-shapes/study-guide/1oo2tSb8S1byAuIV)
- Test the character against a busy background so its outline does not merge into the environment. [search summary] — [BINUS DKV](https://binus.ac.id/bandung/dkv/2025/11/04/the-power-of-silhouette-designing-readable-characters-in-motion/)
- "Silhouette tests overall recognizability while shape language communicates emotional subtext." Silhouette, proportions and visual role should stay clear from concept through animation. [search summary] — [RocketBrush blog](https://rocketbrush.com/blog/shape-language-in-game-character-design-how-to-make-characters-readable-and-consistent). The same article's "70% of impact comes from silhouette" figure is a rule of thumb, not a measured result.
- Bancroft's shape vocabulary, as cited secondhand: circles read as "chubby, bouncy, smooth, rounded"; squares as "boring, flat sided, ordered, bold, rigid" (dependable); triangles as "sharp, angular, pointy, jagged". Villains are "often based upon dominant triangular concepts." [search summary, secondary citation of Bancroft 2006] — [SlideShare, "Shapes in character design"](https://www.slideshare.net/slideshow/shape-character-design/47771715)
- Bancroft (2006, p.132, cited secondhand): varying proportions and body shape creates visual interest while revealing personality. His book's p.43 is cited for pushing proportions (e.g. to change apparent age). [search summary] — [SlideShare](https://www.slideshare.net/slideshow/shapes-32441225/32441225); [Digital Learning Commons, character proportions](https://sites.google.com/view/digital-learning-commons/guides/sketch/character-proportions)
- The head is the standard unit for body proportion. Toon Boom gives "a standard character is six heads high." [search summary] — [Toon Boom Learn, character proportions](https://learn.toonboom.com/modules/character-design/topic/character-proportions)
- "Long legs + small torso = elegant or comical." [search summary] — [Interlochen, character design tips](https://www.interlochen.org/online/character-design-tips-how-to-use-form-for-eye-catching-characters)
- Bluey applied one shape language to the whole world, "big, friendly, rounded rectangles", down to cupboard knobs. The art director describes circles as soft and friendly, horizontals as calm, verticals as upright and diagonals as unbalanced. A single shape language gives the crew a rule for small decisions: in the "kettle test", round kettles and kettles with too many diagonals were rejected in favor of a chunky rectangular one. [opened] — [It's Nice That, Catriona Drummond on Bluey's world](https://www.itsnicethat.com/features/how-we-built-bluey-s-world-cartoon-background-scenery-art-director-catriona-drummond-animation-090725); [Drummond, "Creating Bluey" ch. 2](https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art-891)
- Bluey avoided network pressure toward oversaturated colors that cause eye strain. Creator Joe Brumm wanted the visuals to be "beautiful" and "enthralling and enticing to look at." [opened] — [Drummond, "Creating Bluey" ch. 1](https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art)
- Gravity Falls (fan analysis, not an interview): the Pines family's red color scheme is read as a deliberate "heroic color" choice. [search summary, weak source] — [TV Tropes analysis](https://tvtropes.org/pmwiki/pmwiki.php/Analysis/GravityFalls)

### Inferences
- Run the silhouette test on every pose PNG. Because the characters are full-body cut-outs, each pose can be thresholded to black automatically and viewed at phone scale. At 1080 px wide, a full-body character about 900 to 1100 px tall is roughly 6 to 8 cm on a phone screen. Gestures that rely on hands overlapping the torso will disappear in silhouette, so arms should break the body outline in key comedic poses.
- Give each cast member one dominant shape and one dominant hue family, and do not repeat the hue family between characters who often share the frame. In a gallery with a muted cool background, warm or saturated hues (reds, oranges, yellows, magentas) separate best. The "heroic red" reading is a fan interpretation, but it fits the general rule that saturated warm color draws the eye.
- Comedy proportions: the 6-head figure is the "standard" baseline. Comedic characters usually sit well below it (bigger heads), and pushing one dimension (very tall and thin vs. short and round) makes pairs read instantly.
- Thick dark-brown outlines should keep one weight across all characters at the same screen scale. If a pose PNG is scaled down, its line gets thinner and the mismatch shows, so generate poses at a fixed scale.

### Gaps
- I could not open Bancroft's or Lamb's books, Disney or Cartoon Saloon model sheets, or Steven Universe / Gravity Falls style guides. Bancroft is cited secondhand only.
- No primary numeric rules on line weight, minimum feature size at phone resolution, or color separation between characters. A Disney Research paper on character design for children of different ages exists ([PDF](https://la.disneyresearch.com/wp-content/uploads/Designing-Animated-Characters-for-Children-of-Different-Ages-Paper.pdf)) but the fetch returned unreadable binary, so its findings are not recorded.

---

## 2. Backgrounds and layout

### Takeaway
On a TV budget, shows keep backgrounds simple, flatten perspective, give characters a wide level ground plane, and use contrast to steer attention. Hilda draws and colors backgrounds the same way as characters so the show looks "drawn all by the same hand". Bluey does the opposite of black lines: background lines are colored to match the object and its light.

### Cited Findings
- Bluey backgrounds were kept "super simple" because the audience is preschool, and they were designed around characters that were already locked. [opened] — [It's Nice That](https://www.itsnicethat.com/features/how-we-built-bluey-s-world-cartoon-background-scenery-art-director-catriona-drummond-animation-090725)
- Bluey perspective trick: backgrounds "appear to be 1 point perspective", with flat camera-facing planes, but are built in two-point perspective with the vanishing points placed on opposite sides of the back wall ("inside the two-point perspective cube"). This gives a wide, level ground plane for acting while staying flat. A cramped one-point kitchen left no room for the characters. [opened] — [Drummond ch. 2](https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art-891); [It's Nice That](https://www.itsnicethat.com/features/how-we-built-bluey-s-world-cartoon-background-scenery-art-director-catriona-drummond-animation-090725)
- "The majority of Bluey camera staging is straight ahead and very flat." "Stylise and flatten more complicated environments and perspectives." Camera angles and lighting drama were stripped back, following Brisbane painters Katy Edwards and Debra Hood. [opened] — [Drummond ch. 2](https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art-891)
- Objects are "cute, simplified and chunky" with "doll house proportions". [opened] — [Drummond ch. 2](https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art-891)
- Staging rule: a character should not partly block an important prop (example: a chair). [opened] — [It's Nice That](https://www.itsnicethat.com/features/how-we-built-bluey-s-world-cartoon-background-scenery-art-director-catriona-drummond-animation-090725)
- Bluey has no black line art in backgrounds: lines are colored to match the local object and the light hitting it. [opened] — [Drummond ch. 2](https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art-891)
- On Bluey, art directors drew background roughs, color roughs, props, characters and VFX, then handed them to design and rigging departments. A "style bible" documented the look for the wider crew. The Heeler house exterior was designed first to set the style, then interiors, over about three months. [opened / search summary] — [Drummond ch. 1](https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art); [Bluey search summary of Drummond Substack](https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art-891)
- Hilda (Mercury Filmworks): the goal is for the show to "appear drawn all by the same hand"; "the way our backgrounds are drawn and coloured is similar to how the characters are drawn and coloured." It keeps a small set of specific palettes. Because animation is minimalist, "we use contrast to direct the audience's view and focus." [opened] — [Toon Boom, Mercury Filmworks on Hilda](https://www.toonboom.com/mercury-filmworks-on-the-craft-and-magic-behind-hilda)
- Hilda reviewers note "broad color fields and simple shapes" closer to graphic design, and Animation Magazine mentions a "limited color palette". [search summary] — [Verde Magazine](https://verdemagazine.com/heartwarming-hilda-series-has-story-and-style); [Animation Magazine, Andy Coyle](https://animationmagazine.net/2022/05/hilda-director-andy-coyle-on-the-joys-and-challenges-of-making-the-hit-show)
- Gravity Falls' background layouts and paintings were praised as "more sophisticated and appealing" than much TV fare; credits line art to Sean Jimenez and painting to Elle Michalka. [search summary] — [Cartoon Brew web roundup](https://www.cartoonbrew.com/classic/web-roundup-j-p-miller-gravity-falls-and-classic-illustration-65553.html). *The Art of Gravity Falls* contains episode-by-episode background art and color keys. [search summary] — [Penguin listing](https://www.penguin.com.au/books/the-art-of-gravity-falls-9781368117869)
- Steven Universe backgrounds (per a credit listing): direction by Kevin Dart, design by Steven Sugar, Emily Walus and Sam Bosma, painting by Elle Michalka and Amanda Winterstein. Sources disagree on exact titles. [search summary] — [Gizmodo, "Welcome to the home of the Crystal Gems"](https://gizmodo.com/welcome-to-the-home-of-the-crystal-gems-1459116648); [Art of the Title](https://www.artofthetitle.com/title/steven-universe)
- General legibility thresholds from web accessibility (not animation): 4.5:1 minimum contrast for body text, 3:1 for large elements, 7:1 enhanced; use higher contrast over patterned backgrounds; over a moving painting, a static element can meet a completely different local background later in the shot. [search summary] — [MDN color contrast](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast); [W3C G145](https://www.w3.org/WAI/WCAG22/Techniques/general/G145.html); [Open Design, text over moving backgrounds](https://open-design.ai/blog/text-over-moving-backgrounds/)

### Inferences
- Our setup is the reverse of Hilda's "same hand": characters have thick dark-brown outlines and bright cel colors, the background is painted and muted. That is fine for readability (style contrast separates figure from ground) but it risks looking like stickers on a painting. Cheap fixes that follow Bluey and Hilda: tint the background linework (if any) toward the local color instead of dark brown; pick the background's light/shadow colors from the same small palette as the characters' shadow tones; and lay a light shared texture or grade over both layers so they sit in the same "air".
- Floor line: Bluey's level, wide ground plane is exactly what a horizontal camera glide over a 2880 px world needs. Keep the floor horizon at one height across the whole panorama, and place every character's feet (and the oval shadow) on that band. Flat, camera-facing shop fronts (one-point look) avoid perspective mismatches when the camera pans.
- Value: keep the background mostly in a narrow mid-to-light value band with low chroma, and reserve the darkest darks (outlines) and highest chroma for characters. The WCAG 3:1 "large element" ratio is not an animation rule, but it is a usable, measurable proxy: sample character fill vs. the background behind it and check that the luminance ratio is at least about 3:1, at both ends of the camera glide.
- In 9:16, keep detail low in the band where characters stand (roughly the middle 40 to 60 percent of the frame height) and allow more detail above (signs, ceiling) and in the floor area.
- Keep important props from being covered by characters (Bluey's chair rule), especially the bateia gag prop.

### Gaps
- No primary interview on Gumball, Adventure Time, The Simpsons, Gravity Falls or Steven Universe background painting technique was found within the budget.
- No animation-specific numeric rule for character/background value separation was found. The 3:1 figure is borrowed from accessibility.
- Nothing found on vertical 9:16 layout in animation specifically.

---

## 3. Color scripts and color per scene

### Takeaway
A color script is a small, low-detail strip of thumbnails (Pixar's started as pastels) that maps color, light and mood across the story. TV shows use a cheaper equivalent: scene "keys" or color keys painted in advance for key shots and reused for neighboring shots. For light color, Bluey's rule is to push light and shadow warmer or cooler than the local color and never use neutral grey shadows.

### Cited Findings
- On Toy Story, Ralph Eggleston "went through the whole script and he made small pastel drawings of each scene, and concentrated on the basic color" (John Lasseter). Lasseter had never seen a color script before, and Pixar made them for every film after that. [search summary] — [MoMA audio, Pixar: 20 Years of Animation](https://www.moma.org/audio/playlist/192/2581)
- Eggleston: color scripts are an efficient way to convey color, light, emotion and mood and to show others what the final picture will look like; "The color script is a map of the color." [search summary] — [MoMA interview transcript](https://www.moma.org/interactives/redstudio/interviews/behind/content/eggleston/assets/transcripts.php); [Cartoon Brew obituary](https://www.cartoonbrew.com/rip/ralph-eggleston-a-cornerstone-of-pixars-visual-style-dies-at-56-220781.html)
- Hilda "plans out scene keys in advance": keys combine background, characters and props to "define specific lighting, staging, color design and camera issues", and are reused as reference for similar surrounding scenes. The team avoids iterating in compositing. [opened] — [Toon Boom, Mercury Filmworks on Hilda](https://www.toonboom.com/mercury-filmworks-on-the-craft-and-magic-behind-hilda)
- Bluey: color is "a simplified and slightly more vivid representation of the light in Brisbane"; "always err towards more colourful choices with lighting"; avoid neutral shadow tones (a fence shadow tinted blue rather than grey); when unsure, push a light or shadow cooler or warmer than the local object color. Brisbane light "paints everything golden" with corrugated roofs falling into blue shadow. [opened] — [Drummond ch. 2](https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art-891); [It's Nice That](https://www.itsnicethat.com/features/how-we-built-bluey-s-world-cartoon-background-scenery-art-director-catriona-drummond-animation-090725)
- Bluey's current art director Costa Kassab sets the "look" of each episode, especially for new locations (a park, a shopping centre). [search summary] — [Bluey's Brisbane podcast episode](https://blueysbrisbane.captivate.fm/episode/master-of-the-blueyverse-art-director-costa-kassab-discusses-the-bluey-world)
- Hilda lighting is applied to character rigs "as a manual piece" and animators pose with lighting already on, making it "more of an artistic choice that comes from art direction." [opened] — [Toon Boom](https://www.toonboom.com/mercury-filmworks-on-the-craft-and-magic-behind-hilda)

### Inferences
- A cheap color script for a 30 to 60 s episode: one thumbnail per beat (setup, escalation, punchline, button), painted as a flat overall grade (tint color + strength) over the same gallery background. The galeria background is fixed, so the variation lives in the grade, not in repainting.
- For a punchline or reveal, a sudden shift in grade (e.g. warm spotlight on the speaker, cooler and darker surround) is the TV-budget version of a color-script beat. Return to the base grade on the next beat so the shift reads as an event.
- Apply Bluey's "no neutral shadows" to our oval contact shadow: tint it toward a deep blue-violet or warm brown taken from the palette rather than pure black at low opacity. Same for the dimming of non-speakers: dim toward the scene's shadow color (cool lilac/blue-grey) instead of toward grey/black, so it reads as "in shadow" rather than "washed out".
- One palette per location (gallery corridor, each shop interior) and one base light temperature per time of day keeps episodes consistent.

### Gaps
- No primary source on how TV comedies specifically change color for punchlines. The Pixar material is about feature films.
- I did not find a TV show's actual color key sheets with numbers.

---

## 4. Light and depth in flat 2D

### Takeaway
Distance cues have a clear physical basis: farther things get lighter (for darks), lower in contrast, less saturated and bluer, and the change is geometric rather than linear. Parallax (layers moving at different speeds), layered Gaussian blur for depth of field, vignettes (including off-center ones to steer the eye) and grain are standard compositing tools. I found no source stating the strengths TV shows actually use.

### Cited Findings
- Gurney's worked example: a dark tree nearby at value #8 and a hill 12 miles away at #2 implies dark objects shift about one step lighter per two miles. He then suggests the shift is probably geometric: a "veil" model where each layer of air lightens darks by 50 percent (#10 at 20 ft, #5 at 40 ft, #2.5 at 60 ft, #1.25 at 80 ft). He doubts a precise rule is useful because humidity and air quality matter. [opened] — [Gurney Journey, "Atmospheric distance and value" (2013)](https://gurneyjourney.blogspot.com/2013/07/atmospheric-distance-and-value.html); see also [Gurney Substack](https://jamesgurney.substack.com/p/atmospheric-value-and-distance) [search summary]
- A surface that looks halfway between black and white reflects only about 18 percent of the light of white (David Briggs, quoted by Gurney), so perceived value is nonlinear in luminance. [opened] — [Gurney Journey](https://gurneyjourney.blogspot.com/2013/07/atmospheric-distance-and-value.html)
- Saturation falls off with distance: "a good rule of thumb in general", with exceptions for self-luminous things (the setting sun). Distant tones "go bluer" on clear days (Rayleigh scattering takes on the sky's color); fog adds little color. Briggs suggests light grey or blue-grey veils, with objects approaching sky color at a declining rate. [opened] — [Gurney Journey](https://gurneyjourney.blogspot.com/2013/07/atmospheric-distance-and-value.html)
- Secondary sources agree: distant things get lighter, cooler and lower in contrast, with detail reduced. Eclectic Light recommends checking value range with a value viewer. [search summary] — [Eclectic Light, aerial perspective](https://eclecticlight.co/2015/04/23/making-space-4-aerial-perspective/); [LibreTexts, color modulation and reduction in detail](https://human.libretexts.org/Courses/Coalinga_College/Drawing_Perspectives/05%3A_Atmospheric_Perspective/5.02%3A_Key_Concepts-_Color_Modulation_Value_Changes_and_Reduction_in_Detail)
- Parallax: "separate your elements in layers, and then animate them at different speeds." Depth of field in 2D: "the simplest way ... is by applying the Gaussian Blur effect to different layers in After Effects." A vignette was originally centered "but in animation we can use it more creatively to highlight different areas of an image." [search summary only; the page returned 401 when opened] — [ART204 gitbook, Camera effects](https://gibias.gitbooks.io/art204/content/unit4/camera.html)
- Common "film look" post stack: chromatic aberration, motion blur, depth of field, lens distortion, vignette, curves, vibrance, glow and film grain; animated grain overlays expose intensity, size and frame rate. [search summary] — [Vimeo film-look tutorial](https://vimeo.com/17889687); [Framer grain overlay](https://www.framer.com/marketplace/components/grainoverlay/); [Adobe AE Noise & Grain docs](https://helpx.adobe.com/after-effects/using/noise-grain-effects.html)
- Hilda's lighting is a manual layer on character rigs (see section 3), which is how a TV show gets character light without 3D. [opened] — [Toon Boom](https://www.toonboom.com/mercury-filmworks-on-the-craft-and-magic-behind-hilda)
- Bluey deliberately strips back lighting drama and keeps staging flat. [opened] — [Drummond ch. 2](https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art-891)

### Inferences
- For our 2880 px world, split the background into at least 3 layers: far (back wall / distant shops), mid (shop fronts the characters stand in front of) and a foreground layer (a pillar, plant, railing or bench edge that passes in front of the camera occasionally). Typical parallax speed ratios (my assumption, not sourced): foreground about 1.3 to 1.6x the camera move, mid 1.0x, far 0.5 to 0.8x. Even a single foreground element sliding past during a glide sells depth more than blur does.
- Atmospheric perspective inside a shopping gallery is weak physically (tens of meters, not miles), so apply it lightly: far layer slightly lighter, lower contrast, a bit bluer/lilac. That matches the existing cool palette.
- Depth of field: blur only the foreground pass-by element (strong, e.g. 8 to 20 px at 1080 width) and maybe the far layer (light, 1 to 3 px). Do not blur the character plane. Values are my assumption.
- Contact shadow: the soft oval works; add a smaller, darker core right under the feet (two stacked ellipses: a wide soft one and a narrow tighter one) to fake ambient occlusion so characters do not look like they hover. Tint the shadow (section 3).
- Rim light: a thin light edge on the side facing the scene's main light source is a cheap way to tie a cut-out to the background; at minimum, a subtle overall color multiply on characters taken from the background's light color.
- Vignette and grain: keep both subtle so they read as texture, not as effect. Grain is also useful to unify the crisp vector-like characters with the painted background. Strength is a judgment call; no TV-specific numbers were found.

### Gaps
- No source states what grain, vignette or blur strengths TV/web series actually use.
- No primary source on rim light or ambient occlusion fakes in TV 2D was found.

---

## 5. Making a static painted background feel alive

### Takeaway
I found no primary source in the budget on ambient background motion in limited TV animation. Only general compositing material (parallax, layered camera) was found.

### Cited Findings
- Hilda calls its minimalism a deliberate choice to build a "living, breathing world." [opened] — [Toon Boom](https://www.toonboom.com/mercury-filmworks-on-the-craft-and-magic-behind-hilda)
- Crowd shots are "always a challenge" in TV animation and Hilda designs them carefully in pre-production. [opened] — [Toon Boom](https://www.toonboom.com/mercury-filmworks-on-the-craft-and-magic-behind-hilda)
- Layered parallax camera moves are the standard way to add depth to a static scene. [search summary] — [ART204 gitbook](https://gibias.gitbooks.io/art204/content/unit4/camera.html)

### Inferences
- Cheap ambient loops that suit a shopping gallery: a fluorescent tube flicker (one or two brief dips per 10 s, not constant), a slowly cycling LED/neon shop sign, a ceiling fan, a TV in a shop window with changing colors, a plant leaf sway, dust specks in a light beam, distant silhouette passers-by on the far layer (simple shapes, low contrast, slow). Keep them at low contrast and away from the speaking character's head so they do not compete with the joke.
- Because the gallery is shared across episodes, building these loops once pays off on every episode.
- Ambient motion can also be a comedy tool: stop it (sign goes dark, fan stops) on a punchline as a silent beat.

### Gaps
- No interview or article on how TV shows (e.g. The Simpsons, Gumball, Bluey) handle ambient motion on static backgrounds was found. This section needs another search pass.

---

## 6. Visual comedy devices in 2D

### Takeaway
Smears (since the 1940s) and impact frames are single-frame tricks that make speed or contact read. Japanese practice puts speed lines on the background and keeps the character clean. Comedy reaction shots rely on delayed reactions and graphic shortcuts (super-deformed, loss of detail, symbol over the head). I found no primary source on when these feel cheap.

### Cited Findings
- A smear frame simulates motion blur between keys; the technique dates back to the 1940s. [search summary] — [Wikipedia, Smear frame](https://en.wikipedia.org/wiki/Smear_frame); [Bloop Animation, The Art of Smear Frames](https://www.bloopanimation.com/the-art-of-smear-frames/)
- Smears make "the jump from Pose A to Pose B read as speed instead of teleportation." [search summary] — [Prolific Studio blog](https://prolificstudio.co/blog/smear-frames/)
- An impact frame is a single frame of distorted or stylized art (a flash or burst of lines) marking contact; the style spread online in July 2023 after One Piece scenes. [search summary] — [Know Your Meme, Impact frames](https://knowyourmeme.com/memes/cultures/impact-frames)
- Japanese artists traditionally speed-line the background and keep the character in focus; Western artists more often draw the lines on the character. [search summary] — [TV Tropes, Speed Lines](https://www.tvtropes.org/pmwiki/pmwiki.php/Main/SpeedLines)
- Silent anime reaction shots: comedy often depends on a delayed reaction; characters may go super-deformed, lose facial detail, become a shadow, or show an impossible symbol above the head. [search summary] — [Geek Vibes Nation, silent anime reaction shots](https://geekvibesnation.com/why-silent-anime-reaction-shots-feel-so-loud/)
- An Alibaba "product insights" page attributes a quote about impact frames to a My Hero Academia director. Unverified; do not use. — [Alibaba page](https://www.alibaba.com/product-insights/how-to-draw-dynamic-action-scenes-like-japanese-animators.html)

### Inferences
- With one image per pose and no in-betweens, our cheapest devices are: (a) a background swap on a reaction (cut the gallery to a flat color or radial speed-line pattern behind the character for 0.5 to 1.5 s), which follows the Japanese "lines on the background" convention and needs no new character art; (b) a 2 to 4 frame zoom punch (scale 1.0 to about 1.15 with a fast ease) on the reactor; (c) a single-frame white or inverted flash as an impact frame; (d) a freeze with a paper/halftone texture for a "record scratch" beat.
- To avoid cheapness: use each device at most once or twice per episode and tie it to the biggest beat, keep the delayed-reaction pause before it (the pause is the joke, the device is punctuation), and make the swapped background come from the show's palette.

### Gaps
- No primary source (interview, book) on when these devices enhance comedy vs. feel cheap. The comedy linkage is my inference.

---

## 7. Consistency and style guides

### Takeaway
A model sheet holds turnarounds (front, 3/4 front, side, 3/4 back, back), proportions/construction lines, poses, expressions, annotations and labeled color swatches. Studios bind model sheets into a style guide that can include color guides, logos and fonts. TV shows like Bluey keep a "style bible" with written rules (shape language, proportions, line color, shadow color) and Hilda uses scene keys as reference for consistency.

### Cited Findings
- Model sheet contents: turnaround in standard views (front, side, 3/4 front, 3/4 back, back); poses; annotations (height, distinctive details); proportions and construction lines; exact labeled color swatches picked with a color picker (RGB/CMYK values). [search summary] — [Wikipedia, Model sheet](https://en.wikipedia.org/wiki/Model_sheet); [21 Draw, character design sheet](https://www.21-draw.com/how-to-make-a-character-design-sheet/); [CG Wire, Character sheets](https://blog.cg-wire.com/character-sheet-animation)
- "The studio will compile the model sheets into a single booklet, also known as a style guide", which may also include color guides, logos and fonts. [search summary] — [Wikipedia, Model sheet](https://en.wikipedia.org/wiki/Model_sheet)
- Bluey's style bible rules (written as short imperatives): "big, friendly, rounded rectangles"; "cute, simplified and chunky" with "doll house proportions"; "No literal dog gags"; flat, straight-ahead staging; flatten complex environments; no black line art; no neutral shadows; err toward colorful light. Each design was checked against three questions: does it suit the creator's vision, does it work across the whole world, and can it be reproduced within budget and schedule. [opened] — [Drummond ch. 2](https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art-891); [Drummond ch. 1](https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art)
- Hilda: a small set of specific palettes; scene keys reused as reference for neighboring scenes; "purposely simplified a process" and avoided "bells and whistles that we don't need" to keep a drawn look. [opened] — [Toon Boom](https://www.toonboom.com/mercury-filmworks-on-the-craft-and-magic-behind-hilda)
- Line weight hierarchy is mentioned in clean-up course notes but with no specifics. [search summary] — [FlipHTML5 course notes](https://fliphtml5.com/rfyzx/uzns/AnimationInformationsPart2)

### Inferences
- For this project, a one-page style bible in `docs/` would hold: per-character color swatches (hex), outline color and width in px at the canonical render scale, the head-unit proportion for each character, the background palette swatches, shadow color and opacity, dim amount for non-speakers, floor-line Y coordinate, and the list of short imperative rules (Bluey-style). Since poses are AI-generated edits of `neutro.png`, an automated check is feasible: compare each pose's dominant colors against the swatches (flag drift above a tolerance), compare outline thickness and character height in px against the base, and run the silhouette threshold test.
- Scene keys: paint/grade one key frame per location and lighting state and reuse it, which is Hilda's method and matches a fixed-gallery series.

### Gaps
- No real model sheet or style guide from Disney, Cartoon Saloon, Gravity Falls, Bluey or Steven Universe was opened. No numeric line-weight standards found.
