# Cut-out (puppet) rigging, lip sync for pt-BR, and doing it in Remotion

Research date: 2026-11-22. Each citation says whether I **opened** the page (WebFetch) or only saw a **search summary**. Anything older than 2023 is marked **[pre-2023]**. The project context comes from the brief: one full-body PNG per pose, transforms on the whole image, an open-mouth version masked to an ellipse flapping about 6 times per second, a closed-eye version masked to the eyes, and Whisper word timestamps for every line.

Per the coordinator's priority update, the lip sync section (Q2) goes deepest and focuses on Brazilian Portuguese.

---

## Q1. How professional cut-out tools rig characters, and what a minimal useful rig contains

### Takeaway
Every professional tool uses the same two building blocks: (1) a hierarchy of separate parts, each rotating around its own pivot (pegs or bones), and (2) **drawing substitution**, which swaps one drawing inside a part, such as a mouth, hand or eye set. Mesh deformation (Harmony deformers, Spine, Live2D, Rive meshes) is an optional third layer. Practitioners report that simple replacements are often the best-looking and fastest approach for cut-out work.

### Cited Findings
- Harmony docs: deformers "can substantially increase the range of movements a cut-out character rig can perform without drawing new poses". They can deform a single drawing layer or a hierarchy of layers. Curve and Envelope deformers need Harmony Premium, not Advanced. — [Toon Boom, How to Use Deformers (Harmony 22)](https://docs.toonboom.com/help/harmony-22/advanced/getting-started/deformation.html) (search summary; versions 14 to 24 of the same page exist)
- Harmony also has a cut-out overview page ("About Cut-out Animation"). I did not open it. — [Toon Boom Harmony 15 docs](https://docs.toonboom.com/help/harmony-15/advanced/cut-out-animation/about-cut-out-animation.html) (search summary only, **[pre-2023]**). The Harmony 21 "How to Rig a Cut-out Character" page returned 404 when opened: https://docs.toonboom.com/help/harmony-21/premium/getting-started/character-building.html
- Moho: the review site says Smart Bones and Smart Warp are what make Moho's rigging stand out, and calls the learning curve for rigged-puppet work below average. The same review says Harmony's Smart Bone system is "the easiest way to make rigged characters that feel more hand drawn", but takes digging to master. — [Bloop Animation, Moho vs Toon Boom Harmony](https://www.bloopanimation.com/moho-vs-toon-boom-harmony/) (search summary; opinion piece)
- Moho **switch layers** (a layer that holds several drawings and shows one at a time) have a limit: "you are mostly forced to use the same set of bones to bend drawings that can be very different from each other." The "Switch Bones" workaround puts each arm variant, with its own bones, inside a switch layer driven by a Smart Bone. The thread is attributed to a Moho product manager. — [Lost Marble forum, "Switch Bones" technique](https://www.lostmarble.com/forum/viewtopic.php?p=173251) (search summary, date unknown, probably **[pre-2023]**)
- A forum user who mostly works on cut-out projects concludes that "simple replacements are often the best-looking and fastest approach". — [Lost Marble forum (hands thread)](https://lostmarble.com/forum/viewtopic.php?p=208748) (search summary; anecdotal)
- Adobe Character Animator puppets are layered PSD/AI files with fixed layer names. The mouth is a group named "Mouth" holding 14 shapes: 3 silent (Neutral, Smile, Surprised) and 11 visemes (Ah, D, Ee, F, O, M, Oh, R, S, Uh, W-Oo). Speech audio drives the visemes, the webcam drives the silent shapes, and you can import an audio file with "Compute Lip Sync Take from Scene Audio". — [Adobe, Lip sync mouth shapes](https://www.adobe.com/learn/adobe-character-animator/web/lip-sync-mouth-shapes) (opened; published 2026-07-21)
- South Park: I found only a forum claim that the show "now use[s] mostly Maya". There were no production sources on how their puppet library is structured. — [Adobe Community thread](https://community.adobe.com/questions-91/south-park-done-with-maya-1501205) (search summary; weak source)

### Inferences (mine, not from sources)
- A minimal rig that would be a real step up for this project, in order of payoff: **(1) a separate mouth layer with a mouth set** (the owner's priority); (2) separate eyes, or at least eyelids, plus pupils for darts; (3) brows as a separate layer (raise/lower only); (4) head separate from the torso, pivoting at the neck; (5) arms only if gestures are wanted, as replacement drawings (2 to 3 arm poses swapped whole) rather than jointed limbs. Each part needs a pivot point recorded in a JSON file next to the PNGs.
- "Drawing substitution" is what the project already does with whole bodies. The cheapest upgrade is to do the same thing per part: keep the body swaps, and substitute only mouths, eyelids and brows inside fixed anchor rectangles on each pose.
- Mesh deformation (Spine, Live2D) is not needed for a comedy short in this style. Replacement plus rotation is the South Park / Character Animator aesthetic, and that is what the series looks like now.

### Gaps
- No primary sources on South Park, Archer, Rick and Morty or Bluey rig breakdowns. Searches returned fan rigs and forum posts only.
- Not covered: Spine, Live2D and Rive editor-side rigging docs (bones, meshes, parameters, state machines). I ran out of budget, and they matter little for the recommended path.

---

## Q2. Lip sync done well, with depth on Brazilian Portuguese

### Takeaway
The standard cartoon set is 6 basic shapes plus up to 3 extra (Rhubarb A-H/X, which descends from Hanna-Barbera and Preston Blair). It covers pt-BR adequately if you map pt-BR phonemes into it yourself, because the visible differences in Portuguese (nasality, the lh/nh sounds, final r/s) are mostly not visible on the lips. The hard part is getting **phoneme timings for Portuguese**. Rhubarb's good recognizer is English-only, and its "phonetic" mode is officially less precise. Montreal Forced Aligner has a Portuguese acoustic model and a pt-BR dictionary. Azure gives viseme events only for speech that Azure synthesizes. The cheapest clear win over open/closed flapping is **audio-loudness-driven openness (3 to 4 levels) plus text-driven overrides for closed lips (p/b/m) and rounded lips (o/u/ão)**, timed with the Whisper word timestamps the project already has.

### Cited Findings: mouth-shape sets
- Rhubarb's shapes. **Basic:** A = closed with slight lip pressure (P, B, M); B = slightly open, teeth clenched (most consonants K, S, T, and EE); C = open (EH, AE; also an in-between when moving from A or B to D); D = wide open (AA); E = slightly rounded (AO, ER; also the in-between from C or D to F); F = puckered (UW, OW, W). **Extended:** G = upper teeth on lower lip (F, V); H = tongue raised behind upper teeth (long L), open about as far as C; X = idle/rest, like A but relaxed. — [Rhubarb Lip Sync README](https://github.com/DanielSWolf/rhubarb-lip-sync) (opened)
- The README says the six basic shapes "were reportedly invented at Hanna-Barbera" and became a de facto standard used at Disney and Warner Bros. Its Preston Blair mapping: A = MBP, B = etc, C = E, D = AI, E = O, F = U, G = FV, H = L, X = rest. — [Rhubarb README](https://github.com/DanielSWolf/rhubarb-lip-sync) (opened)
- The README says good results need at least the first six shapes (A-F) drawn. — [Rhubarb README / forks](https://github.com/wzpan/rhubarb-lip-sync) (search summary)
- Timing details from the README: D can appear just *before* the sound it anticipates (its example shows D before the AY sound); C is inserted as an in-between so the D-to-B transition looks smooth; the output always ends on a closed mouth (X or A). — [Rhubarb README](https://github.com/DanielSWolf/rhubarb-lip-sync) (opened)
- Adobe Character Animator uses 11 visemes plus 3 silent shapes. You can fine-tune the take on the timeline by trimming, swapping or replacing visemes with Silence. — [Adobe](https://www.adobe.com/learn/adobe-character-animator/web/lip-sync-mouth-shapes) (opened, 2026)
- Azure defines 22 viseme IDs (0 = silence ... 21 = p/b/m), each mapped to IPA phoneme groups, e.g. 15 = s, z; 16 = ʃ, tʃ, dʒ, ʒ; 18 = f, v; 19 = d, t, n; 20 = k, g, ŋ; 7 = w, u; 8 = o; 6 = j, i, ɪ. Timestamps are an "Audio offset" in 100-ns ticks. The 2D SVG output is **en-US only**; viseme IDs and blend shapes are offered for the locales on the language-support page. — [Microsoft Learn, Get facial position with viseme](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-speech-synthesis-viseme) (opened; ms.date 2026-02-25)
- Azure visemes come from the TTS workflow: "Neural TTS turns input text or SSML into... speech. Speech audio output can be accompanied by viseme ID...", via the synthesizer's `VisemeReceived` event. — same page (opened). The page describes no way to get visemes for **pre-recorded** audio.

### Cited Findings: pt-BR phonemes and visemes
- Amazon Polly's pt-BR phoneme/viseme table, as rendered. Consonants: ɾ (pi**r**a) → t; b, m, p → p; d, n, t, l → t; d͡ʒ (ida**de**), t͡ʃ (noi**te**), ʃ (**ch**ato), ʒ (**j**acto) → S; f, v → f; g, k, χ (ca**rr**o) → k; j → i; ʎ (ga**lh**o), ɲ (pi**nh**a) → J; s, z → s; w (ma**u**) → u. Vowels: a, ã → a; ɛ (caf**é**) → E; i, ĩ → i; o, õ → o; ɔ (cot**ó**) → "U"; u, ũ → u. — [AWS Polly docs, pt-BR phoneme table](https://docs.aws.amazon.com/pt_br/polly/latest/dg/ph-table-portuguese-br.html) (opened; machine-translated page)
  - **Data-quality warning:** the rendered page lists the closed vowel /e/ (p**e**ga) and nasal /ẽ/ (mov**e**m) as "p" with viseme "p". That is almost certainly a translation or rendering error (it should be e → e). Using "p" would close the lips on every "e", so do not copy that row.
  - Takeaways from the table: Polly maps **nasal vowels to the same viseme as their oral counterparts** (ã → a, õ → o, ĩ → i, ũ → u); puts **lh/nh** in their own palatal viseme "J"; maps the **carioca/paulista "rr" (χ) to the velar k viseme**; and maps **"te/de" (tʃ/dʒ) to the "sh" viseme S**, which matters because pt-BR "noite", "cidade", "gente" are very frequent.
- De Martino's dissertation (Unicamp, 2005) is the reference academic work. It defines a pt-BR viseme set from a linguistic corpus, with geometric and temporal descriptions and anticipatory and perseverative **coarticulation**. A companion article built the set from video of one São Paulo speaker for a talking head. — [Unicamp article (iberdiscap04)](https://www.dca.fee.unicamp.br/~leopini/private/pubs/artigo_iberdiscap04.pdf); [core.ac.uk PDF](https://core.ac.uk/download/296838789.pdf) (search summary only, **[pre-2023]**; I did not extract the viseme table)
- A USP undergraduate thesis (2008) built a talking avatar using **eSpeak** for text-to-phoneme, with phonemes mapped to viseme groups via an IPA/ASCII table. — [USP poster](https://bcc.ime.usp.br/tccs/2008/andrea/conteudo/poster.pdf) (search summary, **[pre-2023]**)
- A Unicamp supervised project (2024) interpolates between mouth images with the FILM frame-interpolation network to animate syllables from visemes. — [IME Unicamp PDF](https://ime.unicamp.br/~mac/db/2024-1S-223615.pdf) (search summary)

### Cited Findings: getting phoneme/viseme timing from Portuguese audio
- **Rhubarb recognizers:** PocketSphinx is the default and "English only". "Phonetic" is language-independent: it recognizes sounds and syllables rather than words, and is "usually less precise". `--dialogFile` takes the line's text (UTF-8); the README recommends always using it, even if the text is not exact. Output can be TSV, XML, JSON (cues with start, end and value A-H/X) or .dat for Moho/OpenToonz. Input is WAV or Ogg. `--extendedShapes ""` restricts output to A-F. — [Rhubarb README](https://github.com/DanielSWolf/rhubarb-lip-sync) (opened; no release date visible in the capture)
- Non-English support came in Rhubarb 1.9.0 via phonetic recognition. One integration guide says phonetic "may give better results for other languages". I found no measurements of phonetic-mode quality for Portuguese. — [awesome.ecosyste.ms summary](https://awesome.ecosyste.ms/projects/github.com%2Fdanielswolf%2Frhubarb-lip-sync); [AniMesuro Godot integration](https://www.github.com/AniMesuro/rhubarb-lipsync-tp-integration-godot) (search summary)
  - Inference: the dialog text probably helps less in phonetic mode, since that mode does not use the English word dictionary. Test it on 2 or 3 real lines before relying on it.
- **Rhubarb WASM port** (`rhubarb-lip-sync-wasm`, MIT): `Rhubarb.getLipSync(pcmBuffer, { dialogText })` takes 16 kHz raw PCM and returns `mouthCues[]` with start, end and value A-H/X. It uses PocketSphinx, so it is in effect English-only. The README's API heading and example disagree on the input type. — [unpkg README v0.1.8](https://unpkg.com/rhubarb-lip-sync-wasm@0.1.8/README.md) (opened)
- **Montreal Forced Aligner:** the `portuguese_mfa` acoustic model (HMM-GMM) aligns Portuguese "across Brazil and Portugal dialects". The model card says v3.3.0, 2026. The `portuguese_brazil_mfa` **dictionary** comes from WikiPron: about 213k words, 40 phones. Install with `mfa model download dictionary portuguese_brazil_mfa`. The dictionary docs warn that coverage can be weaker for varieties other than the modeled one. — [Hugging Face, MontrealCorpusTools/portuguese_mfa](https://huggingface.co/MontrealCorpusTools/portuguese_mfa); [mfa-models docs, pt-BR dictionary](https://mfa-models.readthedocs.io/en/latest/dictionary/Portuguese/Portuguese%20(Brazil)%20MFA%20dictionary%20v2_0_0a.html) (search summary)
- **WhisperX:** its paper recommends a base LibriSpeech wav2vec2 model as the default aligner and found that a larger phoneme model does not reliably help. Character-level Portuguese wav2vec2 CTC models exist on Hugging Face, e.g. `jonatasgrosman/wav2vec2-large-xlsr-53-portuguese`. — [WhisperX paper, arXiv 2303.00747](https://arxiv.org/pdf/2303.00747) (search summary, 2023); [HF model](https://huggingface.co/jonatasgrosman/wav2vec2-large-xlsr-53-portuguese) (search summary, **[pre-2023]**). I did not confirm which Portuguese model WhisperX loads by default.
- A CPqD paper describes wav2vec2-based **phonetic segmentation for Brazilian Portuguese** (research system). — [SBrT library PDF](https://biblioteca.sbrt.org.br/articlefile/4446.pdf) (search summary)
- **Azure TTS** gives viseme events only while it synthesizes the speech (see above). I could not confirm from the language-support page whether pt-BR has viseme IDs: my fetch was truncated before the viseme section. — [Azure language support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts) (opened, truncated)
- Research on audio-to-video talking faces reports that models trained mostly on English perform poorly on other languages. — [arXiv 2510.06612](https://arxiv.org/html/2510.06612v1) (search summary)

### Inferences: a pt-BR viseme set for this project (mine)
A 7 + 1 shape set, close to Rhubarb's so tools stay compatible:

| Shape | Use for (pt-BR) | Rhubarb |
|---|---|---|
| **FECHADA** (lips pressed) | p, b, m, including the nasal coda of "um", "também", "sem", which is usually realized with a closed or nearly closed mouth | A |
| **DENTES** (slightly open, teeth) | s, z, t, d, n, l, r/ɾ, k, g, rr (χ), "ch/j" (ʃ/ʒ), "te/de" (tʃ/dʒ), lh, nh, i/ĩ, final -s and -r | B |
| **MEIO** (mid open) | e/ẽ (closed e), ɛ ("é"), and the in-between | C |
| **ABERTA** (wide) | a, ã, "ão" onset, "ai" | D |
| **REDONDA-ABERTA** | ɔ ("ó"), o/õ, "ou"; the in-between to U | E |
| **BICO** (pucker) | u/ũ, w (the "u" glide in "mau", "quando"), the end of "ão" (it glides to a rounded -w) | F |
| **F/V** (teeth on lip) | f, v (frequent: "fazer", "você", "vai") | G |
| **REPOUSO** | pauses | X |

- Rhubarb's **H** (L with tongue up) can be dropped: pt-BR final "l" is vocalized to [w] ("Brasil" ends in BICO), and intervocalic l reads fine as DENTES.
- **Nasal vowels** (ã/õ/ẽ/ĩ/ũ) need no extra shape. Polly also maps them to the oral vowel; nasality is not visible on the lips. **"ão"** becomes two cues: ABERTA then BICO. **"em"/"ens"** at the end of a word ("tem", "também") is a nasal diphthong [ẽj̃]: MEIO then DENTES, with no lip closure despite the letter "m".
- **Open vs closed e/o:** one MEIO shape for both e's is fine at cartoon resolution; o/ó share REDONDA-ABERTA. Only distinguish them if a character has a big, expressive mouth.
- **lh/nh** become DENTES (the tongue is invisible). Polly's separate "J" viseme is not worth a drawing.
- **Final "s"** becomes DENTES (carioca [ʃ] too), and **final "r"** becomes DENTES or the previous vowel held (it is often dropped in speech: "falar" = "falá").
- Answer to "does a 6-9 shape set cover pt-BR?": **yes, with remapping**, not with new shapes. The missing piece is a pt-BR phoneme front end. Rhubarb's English recognizer would map Portuguese audio onto English phonemes.

### Inferences: practical pipelines, cheapest first (mine)
1. **Amplitude + text overrides (recommended first step).**
   - Compute an RMS loudness envelope per video frame (30 fps) from the voice WAV at build time and store it in JSON. Remotion also offers audio-data utilities (`@remotion/media-utils`), but precomputing keeps rendering deterministic.
   - Quantize it into **3 openness levels** (DENTES / MEIO / ABERTA) with hysteresis, and smooth it so the mouth never changes more often than every 2 frames.
   - Override from the text: inside each Whisper word, place letters proportionally by character count (or better, by a simple syllable count). Force **FECHADA** for 2 frames at each p/b/m, **BICO** for o/u/ão endings, and **F/V** at f/v. Force **REPOUSO** when the envelope is below the silence threshold.
   - Gain over the current flap: the mouth follows the actual syllable rhythm and loudness instead of a fixed 6 Hz square wave, closes visibly on the bilabials (the cue viewers notice most), and rounds on "o/u". It needs 5 to 6 mouth drawings per pose.
2. **Grapheme-to-phoneme + word timestamps.** Use `espeak-ng -v pt-br` (or the Python `phonemizer`) for the phonemes of each word, spread them across the Whisper word span (vowels weighted longer than consonants), map them with the table above, and blend with the amplitude envelope for openness. That is better than the letter heuristic for "te/de", "ão", final "-em" and silent letters. Not verified: I did not open the espeak-ng or phonemizer docs.
3. **Forced alignment (best timing).** MFA with `portuguese_mfa` + `portuguese_brazil_mfa` gives real phone boundaries from the script text and audio, at about 10 ms resolution. Run it offline in Python (conda), export JSON, and feed the same viseme map. This is closest to "full viseme sync".
4. **Rhubarb phonetic mode.** It is the easiest to wire (`-r phonetic -f json --dialogFile`), but its quality on Portuguese is unknown and it was officially "less precise". It is worth a 10-minute A/B test against option 1.
5. **Azure viseme events** only fit if the project switches its voices to Azure TTS. They do not work for the current recordings.

- **Full viseme sync vs amplitude + overrides:** with the coarticulation rules below, at phone-screen size and 30 fps, option 1 likely gets most of the visible gain. Viewers mainly read jaw opening rhythm, closures on m/b/p, and rounding. Forced alignment pays off on slow lines, close-ups and words with strong lip shapes ("você", "vamos", "pão").
- **Craft rules worth coding regardless of pipeline:**
  - Lead the audio by **1 to 2 frames**: show the shape slightly before the sound. Rhubarb itself places D before the sound it anticipates.
  - Hold every shape **at least 2 frames** (at 30 fps), and drop cues shorter than that unless they are FECHADA.
  - Insert an in-between (MEIO or REDONDA) when jumping ABERTA ↔ FECHADA or ABERTA ↔ BICO, as Rhubarb does with C and E.
  - **Hold the last shape** briefly, then ease to REPOUSO instead of snapping shut. Rhubarb always ends closed.

### Gaps
- Not confirmed: whether Azure supports pt-BR viseme IDs (page truncated). I found no source on getting Polly speech marks for pre-recorded audio (inference: Polly visemes, like Azure's, apply only to its own TTS).
- No measured comparison of amplitude-driven vs viseme lip sync quality. I found no study, so the claim that amplitude + overrides gets most of the gain is my judgement.
- Not opened: the De Martino pt-BR viseme table, espeak-ng pt-br docs, the WhisperX language-to-model table, and Papagayo and OVR LipSync docs.
- Open audio-to-viseme models for 2D cartoon mouths: none found. Wav2Lip-style models generate photoreal video, not discrete cartoon mouth cues.

---

## Q3. Eyes and brows

### Takeaway
Animator guidance ties blinks to **head turns, eye-direction changes, shifts in thought, and emotion**, not to a fixed clock. Since the project has no gesture data, the most practical code is a hybrid: seeded random intervals plus forced blinks on pose swaps.

### Cited Findings
- A fast head turn "would almost always get us to blink", usually placed near the middle or end of the turn. A blink often covers a change of eye direction. — [Bloop Animation, blinking animation](https://www.bloopanimation.com/blinking-animation/) (search summary)
- "Three things dictate 99.9999% of the blinks I've ever animated: head turns, shifts in thought, and emotion" (against the "blink every 2 seconds" rule). Blinking on emphasized words is also suggested. — [Animation Mentor blog, blinks and eye movement](https://www.animationmentor.com/blog/tutorial-animate-blinks-eye-movement/) (search summary, date unknown)
- Blink speed and size can express mood: slow for tired or sad, quick for excited or nervous. — [search summary of the animator tutorials above](https://www.bloopanimation.com/blinking-animation/)
- Conversational gaze modeling research (eye darts, gaze aversion while speaking). — [Toronto DGP, S3 conversational gaze paper](https://dgp.toronto.edu/projects/s3-conversational-gaze/S3_Gaze_Animation/paper_pdf.pdf) (search summary; not read)
- Azure's blend shapes include eyeBlink, eyeLook*, browInnerUp, browOuterUp and browDown per frame at 60 fps, but they are generated for TTS only. — [Microsoft Learn viseme page](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-speech-synthesis-viseme) (opened)

### Inferences (mine)
- Blink rules:
  - Force a blink on **every pose swap** (it hides the swap, like a blink covering a head turn) and on the frame before a character's first word in a shot.
  - Otherwise, schedule blinks with Remotion's seeded `random(seed)` at 2 to 6 s intervals. Make about 1 in 5 a double blink.
  - At 30 fps, a blink is about 1 frame half-closed, 1 to 2 frames closed, 1 frame half-open. That is my estimate; no source gave frame counts.
- **Brows:** raise them for 6 to 10 frames on the stressed word of each line. The script can mark it, or pick the loudest word by RMS peak. A separate brow layer moved with translateY is enough; no new drawings are needed.
- **Pupils** (if eyes are separated): the listener looks toward the speaker, and the speaker makes small darts of 2 to 4 px every 1 to 2 s. Both are deterministic from shot data.

### Gaps
- No authoritative frame counts for blink timing. I found no source for "blink before speaking"; that rule is my inference.

---

## Q4. Secondary motion driven by audio or word timing

### Takeaway
Within my budget I found no dedicated sources on procedural head bobs or gestures. What follows comes from the general findings above plus my own inference.

### Cited Findings
- Harmony docs say deformers extend a rig's range without new drawings (the basis for squash and bend on parts). — [Toon Boom deformers](https://docs.toonboom.com/help/harmony-22/advanced/getting-started/deformation.html) (search summary)
- Animators put accents (blinks) on emphasized words. — [Animation Mentor blog](https://www.animationmentor.com/blog/tutorial-animate-blinks-eye-movement/) (search summary)

### Inferences (mine)
- **Head bob on stressed syllables:** at the RMS peaks within each word (local maxima above a threshold, at least 8 frames apart), add a damped spring nod of 2 to 4° rotation plus 1 to 2% squash, using Remotion's `spring()` with a frame offset. That only works once the head is a separate layer. With the current whole-body PNG, apply a much smaller nod (about 1°) to the whole image, pivoting at the feet.
- **Idle breathing:** a sine on scaleY of about 1% on the torso (or the whole image, pivot at the feet), with a period of 3 to 4 s and a phase offset per character so two characters don't breathe in sync.
- **Gestures:** swap to the "explaining" arm drawing on words the script tags as emphasis, hold at least 12 frames, and ease back. Overlapping action on hair or held objects requires those parts to be separate layers, each lagging the head rotation by 2 to 3 frames.

### Gaps
- Not covered: research or production write-ups on audio-driven procedural body motion for 2D.

---

## Q5. Implementing it in Remotion

### Takeaway
Remotion renders each frame as a pure function of the frame number, so layered PNGs with CSS transforms and per-part `transform-origin` are the safest and fastest path. Rive has an official Remotion package. Lottie has a documented flicker risk. Spine has no Remotion integration.

### Cited Findings
- Remotion renders the React tree once per frame; the output must depend only on frame, props and `useVideoConfig()`. Seeded randomness is required: no `Math.random`, no wall-clock time. — [Remotion docs via search summary](https://www.remotion.dev/api) (search summary)
- `@remotion/rive` provides `<RemotionRiveCanvas src fit alignment artboard animation onLoad assetLoader ...>` (available since v3.3.75). It "synchronizes with Remotion's time" (mechanism not stated), and a ref exposes the Rive animation instance, artboard and renderer. The page does not mention **state machines**. — [Remotion docs, RemotionRiveCanvas](https://www.remotion.dev/docs/rive/remotionrivecanvas) (opened)
- `@remotion/lottie` uses lottie-web `goToAndStop`, and the docs warn that rendering may not be deterministic, which can cause flicker. — [Remotion Lottie docs](https://www.remotion.dev/docs/lottie) (search summary)
- Remotion's third-party page lists Rive and Lottie, not Spine. — [Remotion third-party](https://www.remotion.dev/docs/third-party) (search summary)
- spine-pixi-v8 renders via WebGL, WebGPU or Canvas. Canvas lacks slot objects, tint black and blend modes. The runtime's major.minor version must match the Spine Editor version used for export. — [Esoteric, spine-pixi docs](https://esotericsoftware.com/spine-pixi) (search summary)
- Searches turned up no Remotion package or example for character rigs or lip sync, and no Remotion + Rhubarb integration. — [search results](https://github.com/DanielSWolf/rhubarb-lip-sync) (search summary)

### Inferences (mine)
- **Recommended architecture:**
  - Each pose PNG gets a sidecar `rig.json` holding the anchor rectangles for mouth, eyes and brows (and later the head pivot).
  - A `<Mouth>` component draws `cast/<id>/<pose>/mouth_<SHAPE>.png` absolutely positioned in the mouth rectangle, chosen by `mouthCueAt(frame)` from precomputed cues (JSON, built in `npm run voice`).
  - Everything is plain `<Img>` + CSS transforms. That is deterministic, needs no WebGL, and is cheap at 1080x1920, 30 fps: a few extra `<img>` per character.
  - Preload with `staticFile` so no frame renders before its image has loaded.
- Spine or Rive would add an editor tool, a binary asset format and a WebGL canvas. Rive fits Remotion better (official package) but is only worth it if you want mesh deformation; the replacement approach covers this project's needs.
- Keep lip sync cue generation **offline** (Node/Python script at voice time), never at render time, so rendering stays a pure lookup.

### Gaps
- Not confirmed: how `@remotion/rive` seeks (by time or by frame) and whether state machine inputs can be driven per frame. No performance benchmarks found.

---

## Q6. Producing the parts (mouth sets from the existing drawing)

### Takeaway
I found no sources on AI layer splitting or on generating mouth sets with image models in this session. Everything here is inference, grounded in the project's CLAUDE.md, which says poses and mouths are already edits of `neutro.png`.

### Cited Findings
- Adobe advises starting from its provided "Chad" mouth set, or using it as a guide, and says a responsive mouth set takes experimentation. — [Adobe](https://www.adobe.com/learn/adobe-character-animator/web/lip-sync-mouth-shapes) (opened, 2026)
- Rhubarb needs at least A-F drawn; G, H and X are optional. — [Rhubarb README](https://github.com/DanielSWolf/rhubarb-lip-sync) (opened)

### Inferences (mine)
- **One image edit per shape, on a mouth crop, not the full body.** Crop a square around the mouth from the pose PNG (2 to 3x the mouth width, so there is context), ask the image model for each shape by description ("lips pressed together", "teeth showing, slightly open", "wide open 'ah'", "rounded 'o'", "puckered 'u'", "upper teeth on lower lip"), then paste only the mouth area back through a soft elliptical mask. That is the same compositing the project already does.
- **Alignment and color drift pitfalls, with fixes:**
  - Lock the canvas size and position: edit at the crop's exact pixel size.
  - Reject outputs whose area outside the mask differs from the input by more than a small threshold (pixel difference). That catches shifted jaws, redrawn chins and changed line weight.
  - Color-match skin and lip tones by sampling the base crop and applying a per-channel histogram or mean shift to each output.
  - Keep line colour and thickness: prompt for the same outline width, and reject outputs that change it.
  - Generate all shapes in one session from the same reference, so the style stays consistent.
  - Make the mask feather smaller than the lip outline so no double contour appears.
- **Per pose or shared?** Mouths drawn for `neutro` can be reused on poses with the same head angle. Angry and shocked faces probably need their own sets, because the expression changes the mouth's shape. Start with neutral + one shared set, and add per-pose sets only where the mismatch shows.
- **Count:** 6 shapes (FECHADA, DENTES, MEIO, ABERTA, REDONDA, BICO) + F/V = 7 edits per character per head angle. Adding REPOUSO (or reusing the neutral closed mouth) makes 8.

### Gaps
- Not researched: SAM or other segmentation, layer-generation models (e.g. layered-image diffusion), and published workflows for AI-generated mouth sets with consistency metrics.
