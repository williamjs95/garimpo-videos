# Outras dimensões de ofício (além de roteiro e física da animação) para comédia animada vertical de 30-40 s

Legend for source access, used on every finding:
- **[OPENED]** = I fetched and read the page.
- **[SEARCH]** = I only saw a search-engine summary/snippet of the page; wording and numbers were not verified on the page itself.
- **[FAILED]** = I tried to open it and could not (403/404/unreadable); anything attributed to it comes from a search summary.
- **(vendor)** = commercial blog/tool with an interest in the topic; **(platform)** = first-party platform document; **(independent)** = academic, trade-guild or practitioner source.
- Research date: 2026-11-22. Items dated before 2023 are flagged "pre-2023, possibly outdated" (for craft history this matters little; for platform behaviour it matters a lot).

## 1. Sound design and mix (intelligibility, loudness, ducking, phone speakers, cartoon SFX)

### Takeaway
No platform publishes an official loudness spec for organic short-form video; the defensible working target is about -14 LUFS integrated with a -1 dBTP true-peak ceiling, and the more important, better-evidenced rule is the internal balance: background music roughly 10+ LU below speech (more for ambience), with nothing important below ~250 Hz because phone speakers barely reproduce it. Classic cartoon sound (Treg Brown) got its comedy from real-world sounds placed incongruously on cartoon action, not from "boing" libraries alone.

### Cited Findings
Loudness targets
- "None of them publishes an official LUFS target" (TikTok, Instagram, Meta); observed behaviour "clusters internal targets somewhere around -14 LUFS" but this is not a figure the platform can be held to. YouTube also "publishes no official number"; -14 LUFS is an observed value — [Fora Soft, "LUFS targets per platform 2026", published 2026-06-05](https://www.forasoft.com/learn/audio-for-video/articles-audio/lufs-targets-per-platform-2026) [OPENED] (vendor, but it cites its sources and separates observed from documented)
- YouTube normalization is turn-down only: "Turns down only; never boosts", so a quiet master stays quiet — same Fora Soft article [OPENED] (vendor); the same claim appears in a search summary of [Production Advice (Ian Shepherd)](https://productionadvice.co.uk/youtube-music/) [SEARCH] (independent engineer; page not opened, date unknown)
- Recommended social default: -14 LUFS integrated, peaks at -1 dBTP; anything louder is a deliberate trade-off. Creators often master at -10 to -12 LUFS to grab attention, which the article calls "a content strategy, not a standard" — [Fora Soft](https://www.forasoft.com/learn/audio-for-video/articles-audio/lufs-targets-per-platform-2026) [OPENED] (vendor)
- Lossy encoding can push inter-sample peaks over the ceiling: "If the master runs hot, also check a lossy encode". Spotify asks for -2 dBTP on masters louder than -14 LUFS "because loud masters pick up more distortion in lossy encoding" — [Fora Soft](https://www.forasoft.com/learn/audio-for-video/articles-audio/lufs-targets-per-platform-2026) [OPENED], citing [Spotify loudness normalization](https://support.spotify.com/us/artists/article/loudness-normalization/) (platform; not opened by me)
- Meta is described as using "adaptive loudness" via xHE-AAC that adjusts to playback context; the article does not say whether quiet audio is lifted on TikTok/Instagram — [Fora Soft](https://www.forasoft.com/learn/audio-for-video/articles-audio/lufs-targets-per-platform-2026) [OPENED] (vendor; I did not find Meta's own statement)
- Conflicting vendor figures for TikTok/Instagram seen in search summaries only: -14 LUFS ([vloggingpro tool](https://vloggingpro.com/tools/audio-loudness/)), "around -16 LUFS" ([cloudfront-hosted guide](https://d1lex0gkhzvix9.cloudfront.net/tiktok-instagram-reels-loudness)), "-10 to -12" and "-9 to -12" ([opus.pro](https://opus.pro/blog/best-loudness-normalizers), [dev.to](https://dev.to/arthurvalle1_a2586dd2b4bc/mastering-for-reels-tiktok-and-youtube-shorts-the-lufs-14-standard-2ck5)) [all SEARCH] (vendor). These disagree with each other and none cites a platform document.
- A limiter ceiling of -2 dBTP as a safety margin is suggested by one source in the same search summary — [instagit/video-use doc](https://instagit.com/browser-use/video-use/social-media-loudness-normalization-targets.md) [SEARCH] (third-party doc of an open-source tool: -14 LUFS, -1 dBTP, LRA 11)

Speech versus music/effects balance
- A 2019 Audio Engineering Society paper (University of Salford repository) studied how far background should sit below speech when ducking; non-experts preferred a gap about 4 LU wider than experts; 1 LU = 1 dB — [Salford repository file 1488623](https://salford-repository.worktribe.com/OutputFile/1488623) [FAILED 403; figures from SEARCH] (independent, pre-2023 but perceptual, unlikely to be outdated)
- Companion Salford work: suggested range of 16 to 23 LU between speech and background; another summary of the same line of work cites roughly 10 LU between commentary and music and at least 15 LU against ambience — [Salford repository file 1489990](https://salford-repository.worktribe.com/OutputFile/1489990) and [1488623](https://salford-repository.worktribe.com/OutputFile/1488623) [SEARCH only] (independent). The exact conditions behind each number were not verified.
- Editor rules of thumb: dialogue peaking around -12 to -6 dB, music roughly 18 to 25 dB below it, about -18 dB as a common ducking amount — [Storyblocks](https://www.storyblocks.com/resources/tutorials/how-to-balance-audio-premiere-pro), [Pixflow](https://pixflow.net/blog/?p=92478) [SEARCH] (vendor tutorials; peak-meter figures, not LUFS)

Phone speakers
- Small portable speakers "cannot generate significant open-air acoustic output at frequencies below approximately 250 Hz"; another patent puts phone speaker resonance "usually around 500 Hz" — USPTO patent documents [9596530](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9596530) and [12604141](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12604141) [SEARCH] (independent but patents, not measurements; which quote belongs to which patent was not verified)
- Measurement write-up on popular smartphones: 4-5 kHz "shall be very careful band" on all devices, with sensitive frequencies around 1 kHz, 2.5 kHz and 3.5 kHz — [Audiokinetic blog, "Loudness and frequency response on popular smart phones"](https://www.audiokinetic.com/en/blog/loudness-and-frequency-response-on-popular-smart-phones) [SEARCH] (vendor of game-audio middleware; date not verified, likely pre-2023)

Cartoon sound design
- Ben Burtt on Treg Brown: he "used real sound effects for comic purposes and for exaggeration"; when Wile E. Coyote crashed, Brown used a thunderclap and a destroyer alert siren rather than a cymbal or bass-drum hit; the Road Runner was built from high-speed aircraft sounds; the Tasmanian Devil came from the inertia starter of a JN-5 Jenny biplane. "Associating these real-world sounds with the events in the cartoon" made the action more realistic and melodramatic — [Designing Sound, "Treg Brown and the Sound of Looney Tunes", 2009](https://designingsound.org/2009/12/treg-brown-and-the-sound-of-looney-tunes/) [OPENED] (independent; pre-2023, historical)
- Brown worked on the Warner sound-effects library for Looney Tunes/Merrie Melodies 1936-1963 — [Wikipedia, Treg Brown](https://en.wikipedia.org/wiki/Treg_Brown) [SEARCH]. Note the Designing Sound page gives 1933-1966 (Burtt's recollection); the two sources conflict on dates.
- A Motion Picture Sound Editors magazine piece describes his work as creating comedy and unease "through the contrast of what you see and what you hear", a "masterclass in timing and incongruity" — [MPSE Wavelength, Winter 2026](https://digital.copcomm.com/i/1541592-winter-2026/35) [SEARCH] (independent trade guild)

### Inferences
- For this series (AI voice + synthesized SFX + quiet synth theme), the checkable mix spec that the evidence supports is: integrated about -14 LUFS for the full mix; true peak no higher than -1 dBTP (measure after AAC encode, or use -2 dBTP if mastering hotter); music bed at least ~10 LU below dialogue while someone speaks, ambience ~15 LU or more below. These can be measured in code with ffmpeg's `loudnorm`/`ebur128` filters (my suggestion; no source consulted on ffmpeg).
- Because YouTube only turns down, mixing well below -14 LUFS makes the episode quieter than neighbours in the Shorts feed; there is no evidence that mixing louder than -14 helps on YouTube.
- Any synthesized SFX or theme whose energy sits mostly below ~250 Hz (sub "thuds", bass notes) will be inaudible on a phone speaker; put the identifying part of each effect in the 500 Hz-4 kHz band and check the mix on a phone in mono.
- The 1-5 kHz band is where both speech intelligibility and phone-speaker harshness live; carving the music there (rather than only lowering it) is the logical consequence, but I found no source giving a specific EQ recipe.
- Brown's method suggests a cheap upgrade path for synthesized effects: prefer recognisable real-world sounds mismatched to the action over generic synth "bloops".

### Gaps
- No first-party TikTok, Instagram or YouTube document stating a loudness target was found; I also did not find an independent engineer's measurement of TikTok/Reels normalization that I could open. Treat every TikTok/Reels LUFS number as unverified.
- The AES/Salford paper could not be opened (403); participant count, programme material and exact recommended LU values need checking at the source before being quoted as research findings.
- Nothing found on room tone/ambience to avoid a "dead" track in animation, nor on Hanna-Barbera library practice, nor on how exactly Brown timed effects to frames (the Designing Sound page says nothing about frame timing).
- No source found on frequency carving recipes or on mono-compatibility checks for phone playback.
- No evidence found on how the 1.1x speed-up affects intelligibility of synthetic Portuguese speech.

## 2. Music and scoring (mickey-mousing, stingers, silence, loops)

### Takeaway
Scholarship treats tight audio-visual synchronisation as fundamental to comedy because comedy depends on timing, but warns it need not be constant and can produce unintended humour when overdone; I found no usable source on silence before a punchline or on loop fatigue.

### Cited Findings
- Mickey-mousing = music synchronised tightly to on-screen action; first known use in Steamboat Willie (1928), scored by Wilfred Jackson — [Wikipedia, Mickey Mousing](https://en.wikipedia.org/wiki/Mickey_Mousing) [SEARCH]
- Miguel Mera's chapter "The audiovisual architecture of musical pauses, punchlines, and jablines: Paddington's punctuation" (Palgrave Handbook of Music in Comedy Cinema) argues that because timing is central to comedy, audiovisual synchronisation is fundamental to its success; music can prepare the audience for slapstick before it happens; precise sync may not always be needed — [University of Southampton eprints 485563](https://eprints.soton.ac.uk/485563/) [FAILED 403; from SEARCH] and [City University open-access copy](https://openaccess.city.ac.uk/id/eprint/30838/1/Audiovisual%20Architecture.pdf) [SEARCH, not opened] (independent, academic)
- Stingers: the 1960s Batman series used a brass stinger chord for every punch that landed — [TV Tropes, Mickey Mousing](https://tvtropes.org/pmwiki/pmwiki.php/Main/MickeyMousing) [SEARCH] (fan wiki, low authority)
- Stylised sync "tells the audience that what they are watching is heightened, artificial, and meant to feel that way" — [StudioBinder, Mickey Mousing](https://www.studiobinder.com/blog/mickey-mousing/) [SEARCH] (vendor)
- Mickey-mousing may also create unintentional humour — [Wikipedia, Mickey Mousing](https://en.wikipedia.org/wiki/Mickey_Mousing) [SEARCH]
- Related retention datum: in a vendor analysis of brand Facebook Reels, speech starting in the first 3 s beat music-only openings (+11.7% 3 s retention, +24.7% 10 s, +6.6% 30 s) — [Emplifi, "What keeps viewers watching Facebook Reels?", 2026-03-19](https://emplifi.io/?p=23678) [OPENED] (vendor data; sample size and method not stated)

### Inferences
- With a "quiet synthesized background theme", the cheapest comedic upgrade is punctuation rather than a continuous bed: hit one or two key actions per episode with a synchronised accent (stinger) and let the rest stay neutral, since the academic view is that sync need not be constant.
- The Mera chapter title itself ("musical pauses, punchlines") indicates that dropping the music before a punchline is a recognised device, but I could not read the argument, so this remains an inference.
- A series-wide identical loop is a plausible fatigue risk across episodes, but that is my reasoning, not a finding.

### Gaps
- Could not open the Mera chapter (403 on Southampton; City copy not attempted). It is the best lead on musical pauses and punchlines.
- No source found on silence before a punchline in scoring, on Carl Stalling's working method, or on risks of repetitive music loops in short-form video.
- No platform guidance found on original versus trending audio for reach in 2026.

## 3. Voice performance (voice direction and AI text-to-speech)

### Takeaway
Voice directors say the performance is acting first and technique second; for the AI voices the hard facts are operational: OpenAI's `gpt-4o-mini-tts`, `tts-1` and `tts-1-hd` shut down on 2027-01-06, voices are "optimized for English", style is steered through a free-text `instructions` field, and users report instruction-following and voice consistency varying between requests and model snapshots.

### Cited Findings
Voice direction
- Andrea Romano: "it's about acting, acting, acting"; she cannot teach acting in a four-hour session, while microphone technique and animation acting can be taught quickly — [Backstage interview](https://www.backstage.com/magazine/article/andrea-romano-batman-casting-director-interview-77465/) [SEARCH] (independent; date not verified, probably pre-2023)
- A voice director must know acting terminology and show kindness; the voice track is recorded before animation — [Shacknews interview with Andrea Romano](https://www.shacknews.com/article/113000/interview-andrea-romano-on-what-makes-a-good-voice-director) [SEARCH] (independent; 2019, pre-2023)

OpenAI text-to-speech (first-party documentation)
- "The `tts-1`, `tts-1-hd`, and `gpt-4o-mini-tts` models are deprecated and will shut down on January 6, 2027." Suggested migration is `gpt-realtime-2.1-mini` through the Realtime API, which "isn't a supported model for `/v1/audio/speech`" (a workflow change, not a drop-in swap) — [OpenAI, Text to speech guide](https://developers.openai.com/api/docs/guides/text-to-speech.md) [OPENED 2026-11-22] (platform)
- For `gpt-4o-mini-tts`, prompts can control accent, emotional range, intonation, impressions, speech speed, tone and whispering, through a natural-language `instructions` string (doc example: "Speak in a cheerful and positive tone.") — [OpenAI TTS guide](https://developers.openai.com/api/docs/guides/text-to-speech.md) [OPENED] (platform)
- 13 built-in voices listed (alloy, ash, ballad, coral, echo, fable, nova, onyx, sage, shimmer, verse, marin, cedar); "For best quality, we recommend using `marin` or `cedar`." The page's intro says 11 voices, an internal inconsistency — [OpenAI TTS guide](https://developers.openai.com/api/docs/guides/text-to-speech.md) [OPENED] (platform)
- "Voices are currently optimized for English." Portuguese is in the supported-language list (the model "generally follows" Whisper's language support) — [OpenAI TTS guide](https://developers.openai.com/api/docs/guides/text-to-speech.md) [OPENED] (platform)
- Output formats: MP3 (default), Opus, AAC, FLAC, WAV, PCM (24 kHz 16-bit) — [OpenAI TTS guide](https://developers.openai.com/api/docs/guides/text-to-speech.md) [OPENED] (platform)
- Policy: users must be given "a clear disclosure ... that the TTS voice they are hearing is AI-generated and not a human voice" — [OpenAI TTS guide](https://developers.openai.com/api/docs/guides/text-to-speech.md) [OPENED] (platform)
- Custom voices can be created "from a speaker's consent recording and matching audio sample" (eligibility on a separate page, not read) — [OpenAI TTS guide](https://developers.openai.com/api/docs/guides/text-to-speech.md) [OPENED] (platform)
- In the Realtime API the `speed` parameter "changes playback rate, not how the model composes speech"; to sound faster, add pacing instructions (sample: "Deliver your audio response fast, but do not sound rushed.") — [OpenAI Cookbook, Realtime prompting guide](https://developers.openai.com/cookbook/examples/realtime_prompting_guide) [SEARCH] (platform; written for realtime models, not the speech endpoint)
- The realtime prompt skeleton includes an optional "Reference Pronunciations" section for brand terms (example: say "SQL" as "sequel") — same Cookbook guide and [eWeek summary](https://www.eweek.com/news/openai-realtime-prompting-tips/) [SEARCH]
- A voice choice does not guarantee a regional accent; a specific accent has to be prompted and tested — [OpenAI, Prompting GPT-Live](https://developers.openai.com/api/docs/guides/live-prompting.md) [SEARCH] (platform; about a different model family)
- The model follows sample phrases closely, which can make output repetitive; ambiguous or conflicting instructions degrade performance — [OpenAI Cookbook, Realtime prompting guide](https://developers.openai.com/cookbook/examples/realtime_prompting_guide) [SEARCH] (platform)

User reports (anecdotal)
- After an update the model "doesn't follow TTS instructions most of the time"; a user reports recovering the old behaviour by pinning `gpt-4o-mini-tts-2025-03-20` — [OpenAI community thread](https://community.openai.com/t/voice-instruction-with-gpt-4o-mini-tts/1372075) [SEARCH] (forum, unverified)
- Voice inconsistency between requests with the same instructions has been reported — [OpenAI community thread](https://community.openai.com/t/gpt-4o-mini-tts-voice-inconsistency-between-requests/1224969) [SEARCH] (forum, unverified)

### Inferences
- The January 2027 shutdown is roughly six weeks after this research date. If the series' "OpenAI audio model" is one of the three deprecated models, the voice pipeline needs migration and every character voice must be re-auditioned; this is the single most urgent item in these notes. Which model the project actually uses was not checked.
- Since the documented speed control for the newer models is playback rate and pacing is otherwise a prompting matter, the series' "1.1x" speed-up is a post-process; asking for brisk delivery in `instructions` and speeding up less may sound more natural, but that needs an A/B listen, not a citation.
- Practical consistency controls implied by the docs and forum reports: pin a dated model snapshot, keep one fixed `instructions` block per character, keep a per-character pronunciation list (brand name, "Lici", "Zé Garimpo", place names), and listen to every take end to end.
- "Optimized for English" plus "accent must be prompted and tested" means Brazilian Portuguese regional accents are not guaranteed; treat each accent as something to verify by ear per episode.
- Contrast between characters (pitch, pace, energy) is the standard casting logic in animation, but I did not find a voice-director quote stating it; listed as a gap.

### Gaps
- No source found with voice-director specifics on energy, contrast between characters, breaths or overlapping lines (the Romano interviews were seen only as search summaries and stay general).
- No documentation or test found on OpenAI TTS quality in Brazilian Portuguese, on regional accents (e.g. nordestino, caipira, carioca), or on truncated/clipped endings of takes and how to avoid them.
- Input length limit for the speech endpoint is not stated on the page I opened.
- The Realtime/Cookbook guidance was not opened; quotes come from search summaries.

## 4. Lip sync in limited animation

### Takeaway
Limited-animation lip sync runs on a small fixed set of mouth drawings: six basic shapes attributed to Hanna-Barbera are described as the minimum, with up to three optional extras; timing matters as much as shape count, and holding the open mouth 2-3 frames past the end of the audio makes sync feel tighter.

### Cited Findings
- Six basic mouth shapes (A-F) plus three optional (G, H, X), nine in total. A = closed for P/B/M; B = slightly open, teeth clenched, for most consonants (K, S, T) and EE; C = open for EH/AE; D = wide open for AA; E = slightly rounded for AO/ER; F = puckered for UW/OW/W; G = teeth on lip for F/V; H = tongue up for long L; X = idle/rest — [Rhubarb Lip Sync README](https://github.com/DanielSWolf/rhubarb-lip-sync) [OPENED] (independent open-source tool)
- The six basic shapes were reportedly "invented at the Hanna-Barbera studios" for shows like Scooby-Doo and The Flintstones and later used widely; they are "the absolute minimum you have to draw for your character" — [Rhubarb Lip Sync README](https://github.com/DanielSWolf/rhubarb-lip-sync) [OPENED] (the Hanna-Barbera attribution is the README's claim, without a citation)
- Toon Boom Harmony's automatic lip sync uses eight "animation phonemes" (A, B, C, D, E, F, G and X for silence); the letters do not correspond to actual sounds — [Toon Boom Harmony docs, About Lip-sync](https://docs.toonboom.com/help/harmony-20/premium/sound/about-lip-sync.html) [SEARCH] (vendor documentation)
- Preston Blair chart counts vary by source: "nine shapes cover most dialogue; simpler styles may use five or six" ([Frameo](https://frameo.ai/en/learn/animation-mouth-chart), vendor), "the basic ten shapes of the Preston Blair phoneme series" ([hobbyist blog, 2007](https://impossiblekisses.blogspot.com/2007/10/lip-synching-for-animation.html), pre-2023) [both SEARCH]. Sources disagree; the count depends on how sounds are merged.
- A viseme is the mouth shape representing a phoneme; several phonemes share one shape — [Autodesk Softimage docs](https://download.autodesk.com/global/docs/softimage2014/en_us/files/face_lipsync_AboutPhonemesandVisemes.htm) [SEARCH] (vendor; 2014, pre-2023)
- South Park: one forum post says it uses 12 mouth shapes for phonemes, with no source given — [Synthiam forum](https://synthiam.com/Community/Questions/Southpark-type-Animation-An-Effective-Substitute-For-Moving-1248) [SEARCH] (unreliable)
- End-of-line timing: keep the mouth open slightly past the audio, "usually done by moving the closed-mouth state two or three frames into the silence of the waveform"; holds of "5-6 frames past the audio" are possible and 1-2 frames also works; use the extension only at the end of a sentence; if the final sound is closed (the M in "come"), place the closed frame near the real end; do not combine the extension with a slow closing in-between or it looks "visually mushy" — [Animator Island, "A Lip-sync Must-Know for Limited Style Animation"](https://www.animatorisland.com/?p=3446) [OPENED] (independent practitioner; date not noted, frame counts presumably at 24 fps)
- Viewer perception claim from the same article: with the visual lingering slightly, "the two actually feel MORE synced" and the character feels "more solid" — [Animator Island](https://www.animatorisland.com/?p=3446) [OPENED] (practitioner opinion, not a study)

### Inferences
- Checkable standard for this series: each character has at least the six shapes (closed, clenched/EE, open, wide, rounded, puckered) plus a rest mouth; anything below that is under the documented minimum for viseme sync.
- Rhubarb outputs these shapes from audio and accepts the dialogue text as a hint; that makes viseme-based sync feasible in a code-driven pipeline as an alternative to amplitude flaps. Its recognisers target English, so quality on Portuguese is unverified (my recollection of the tool, not something on the page section I read).
- The 2-3 frame hold at 24 fps is about 80-125 ms, i.e. roughly 3-4 frames at 30 fps.
- The closed mouth on P/B/M is the shape most likely to be noticed when missing, because it is the only fully closed viseme; an amplitude-driven flap cannot guarantee it. This is reasoning from the shape table, not a cited perception result.

### Gaps
- No reliable source found for the number of mouths used by South Park or by Flash-era shows, nor a primary source for Preston Blair's chart (Advanced Animation) count.
- No study found comparing amplitude-driven flap with viseme-based sync, or measuring what viewers notice (asynchrony thresholds, tolerance in cartoons).
- No source found on Portuguese-specific visemes (nasal vowels, "lh", "nh").

## 5. Cinematography and staging in 9:16

### Takeaway
There is no official safe-area spec for organic posts on any of the three platforms; the published margins are advertising guidance, and third-party pixel tables conflict, so the conservative working rule is to keep faces, captions and gags out of roughly the top 15%, bottom 25-35% and outer 10-15% sides, then check a private upload in each app. Vertical staging guidance favours alternating singles over side-by-side two-shots, and comedy editors favour wider framing that shows body language.

### Cited Findings
Safe areas
- A cross-platform conservative margin: top about 15%, left/right about 10-15%, bottom about 25-35%, stated as a working value and explicitly not an official specification (on 1080x1920 that is 288 px top, 108-162 px sides, 480-672 px bottom; the pixel conversion is arithmetic, not from the source) — [Reap, "YouTube Shorts, Reels and TikTok Safe Zones", updated 2026-09-07](https://reap.video/blog/short-form-video-safe-zones) [OPENED] (vendor)
- The first-party sources behind such tables are all ad-focused: Google's "Universal Video Ad Safe Zones" PDF, Meta's Reels ads guidance and safe-zone checker, and TikTok's Creative Center guidance for advertisers; they "should not be treated as permanent pixel rules for organic posts" — [Reap](https://reap.video/blog/short-form-video-safe-zones) [OPENED] (vendor), pointing to [Google PDF](https://services.google.com/fh/files/misc/universalsafezones-youtube.pdf) [FAILED: opened but the diagrams are images I could not read], [Meta Reels ads page](https://www.facebook.com/business/ads/facebook-instagram-reels-ads) and [TikTok Creative Center](https://ads.tiktok.com/business/creativecenter/quicktok/online/tiktok_creative_accelerator/pc/en) (platform; not opened)
- YouTube Shorts margins attributed to Google's published values: 288 px top, 672 px bottom, 48 px sides, with 192 px on the right — [bundle.social safe-zone checker](https://bundle.social/tools/safe-zone-checker) [SEARCH] (vendor; I could not confirm against the Google PDF)
- TikTok figures conflict between vendors: 240 px top / 660 px bottom / 120 px sides with buttons taking 300 px on the right from 840 px down, versus 108 px top / 320 px bottom / 60 px left / 120 px right — [search summary of vendor tools and guides incl. Ignite Social Media](https://www.ignitesocialmedia.com/content-creation/what-are-the-safe-zones-for-tiktoks-and-instagram-reels/) and [upload-post checker](https://www.upload-post.com/tools/safe-zone-checker/) [SEARCH] (vendor; which figure belongs to which page was not verified)
- Other vendor fallbacks: a centred 900x1400 px zone, or a 1080x1420 px area — [adaptlypost](https://adaptlypost.com/blog/social-media-safe-zones-2026-complete-guide), [predis.ai](https://predis.ai/resources/tiktok-safe-zone-guide/) [SEARCH] (vendor; attribution approximate)
- TikTok's bottom overlay grows with post caption length (one guide claims ~80 px for one line, 250+ px for three lines with hashtags), so no single pixel-perfect zone exists — [vendor guide in search summary, e.g. House of Marketers](https://www.houseofmarketers.com/guide-to-safe-zones-tiktok-facebook-instagram-stories) [SEARCH] (vendor, unconfirmed by TikTok)
- June 2026: YouTube introduced an optional Clear Screen mode for Shorts that hides overlays; viewers may not enable it — [Reap](https://reap.video/blog/short-form-video-safe-zones) [OPENED], citing [YouTube blog](https://blog.youtube/news-and-events/youtube-shorts-experience-updates-features/) (platform; not opened)
- One 2026 guide notes auto-generated captions are now on by default on TikTok, Reels and Shorts, adding overlays the margins do not account for — [vendor guide in search summary](https://wildandfreetools.com/blog/vertical-video-safe-zones-guide-2026/) [SEARCH] (vendor, unverified; attribution approximate)

Framing and staging
- In 9:16, two actors side by side look awkward; alternate singles and let the cut carry the exchange — [dev.to, "Vertical video composition for drama"](https://dev.to/cartney/vertical-video-composition-for-drama-the-2026-guide-567l) and [invideo](https://invideo.io/blog/ai-micro-drama-vertical-shot-generation/) [SEARCH] (blog/vendor opinion)
- Put the face in the upper third and leave space lower in the frame for captions — [invideo](https://invideo.io/blog/ai-micro-drama-vertical-shot-generation/) [SEARCH] (vendor opinion, not a standard)
- 180-degree rule: keep the camera on one side of the line of action running through two characters to preserve screen direction; cross it only deliberately — [LibreTexts, Video Composition](https://human.libretexts.org/Bookshelves/Theater_Film_and_Storytelling/Documentary_Culture/09%3A_Video_Aesthetics/9.05%3A_Video_Composition) [SEARCH] (independent textbook)
- Comedy "often plays better in wide shots that show body language"; close-ups are for dramatic emotion — [Roger Nygard, CineMontage, 2022-03-02](https://cinemontage.org/?p=58217) [OPENED] (independent, editors' guild magazine; pre-2023 but craft advice)
- Vendor retention data (brand Facebook Reels): vertical beat other formats (+9.1% 3 s, +23% 10 s, +38.5% 30 s retention); a person visible for at least 1 s in the first 3 s gave +3.6% (3 s), +10.1% (10 s), -2.4% (30 s); a slow-paced start was about equal at 3 s and +7.7% at 30 s — [Emplifi, 2026-03-19](https://emplifi.io/?p=23678) [OPENED] (vendor; no sample size or method; Facebook only; the page has internal inconsistencies between its text and its table)

### Inferences
- A defensible single template for 1080x1920: keep captions, faces and key props inside roughly x = 110-920 (wider margin on the right for the button column) and y = 290-1250, i.e. clear of the top 15% and bottom ~35%. This takes the most conservative of the conflicting figures; it is an inference, not a published spec.
- The title card (first 2.6 s) and the closing card should obey the same box, because the first frame is also the frame most likely to be covered by UI and used as cover.
- For a two-character dialogue in 9:16, the options consistent with the sources are (a) a wide two-shot with characters stacked in depth or kept small, good for physical comedy, or (b) alternating singles that keep each character on a constant side and facing direction (180-degree rule). Flipping a cut-out character's facing between shots breaks screen direction.
- Nygard's "wide for comedy" and the vendor advice "alternate singles" pull in different directions; a reasonable resolution is wide for physical gags and reactions that involve the body, singles for verbal punchlines.

### Gaps
- No first-party safe-zone numbers were verified by me for any platform; Google's PDF could not be read (image-only), TikTok and Meta pages were not opened.
- No large-sample data found on shot length or cut rate for short-form video; no average-shot-length figure for comedy.
- No authoritative vertical-specific headroom or shot-size convention found; the IAFOR paper ["Filmmaking Theory for Vertical Video Production" (2019)](https://papers.iafor.org/wp-content/uploads/papers/euromedia2019/EuroMedia2019_52556.pdf) surfaced in search but was not opened (pre-2023).
- Nothing found on cut versus camera move in short-form.

## 6. Color, light and depth

### Takeaway
The findable guidance is qualitative: separate elements by value contrast first, plan colour across the episode with a colour script, and fake depth with layered backgrounds that move at different speeds and get lighter, less saturated and less detailed with distance. I found no numeric standards and nothing specific on rim light, shadows or vignettes.

### Cited Findings
- Differences in value are what let the eye separate elements of an image and understand the design — [School of Motion, "How (and Why) to Use Contrasting Values in Motion Design"](https://www.schoolofmotion.com/blog/how-why-use-contrast-values-motion-design-tutorial) [SEARCH] (vendor/education; date not verified)
- A colour script is a sequential visual outline mapping colour, lighting and emotional beats across a film — [Envato Tuts+, "How to: colourscripts for animation"](https://photography.tutsplus.com/tutorials/how-to-colourscripts-animation--cms-38391) [SEARCH] (vendor/education)
- Colour can be treated as an element independent of character and background, carrying emotional meaning for both — [Tony White, chapter "Color Script" (Taylor & Francis)](https://www.taylorfrancis.com/chapters/mono/10.4324/9780080927848-22/color-script-tony-white) [SEARCH] (independent book; pre-2023)
- Colour scripting can signal how abstract the fictional world is, or cue that a different kind of sequence (e.g. a musical bit) is starting — [Blender Studio, "Color scripting"](https://studio.blender.org/blog/color-scripting/) [SEARCH] (independent studio blog)
- Complementary hues at full saturation give a vibrant, high-contrast look that needs care to avoid being jarring — [Baianat, "The power of color in animation"](https://baianat.com/articles/the-power-of-color-in-animation) [SEARCH] (vendor)
- Parallax: closer layers move faster than distant ones; the technique descends from the multiplane camera used since the 1930s — [Fiveable 2D animation study guide, "Parallax scrolling and multi-plane techniques"](https://library.fiveable.me/2d-animation/unit-22/parallax-scrolling-multi-plane-techniques/study-guide/Mbdp6dUdC2ja2FmS) [SEARCH] (education vendor)
- Digital multiplane: background layers are spread along the Z-axis and the camera moves through them; no physical multiplane camera needed — [Toon Boom Harmony docs, About Multiplane](https://docs.toonboom.com/help/harmony-24/advanced/staging/about-multiplane.html) [SEARCH] (vendor documentation)
- Atmospheric perspective: contrast, saturation and detail decrease as objects recede, and the environment gets lighter going back in space — [Fiveable study guide](https://library.fiveable.me/2d-animation/unit-22/parallax-scrolling-multi-plane-techniques/study-guide/Mbdp6dUdC2ja2FmS) and [Binus University, "Backgrounds that Breathe: Creating Depth in Flat Worlds", 2025-11-04](https://binus.ac.id/bandung/dkv/2025/11/04/backgrounds-that-breathe-creating-depth-in-flat-worlds/) [SEARCH] (education)

### Inferences
- A checkable test that follows from the value-contrast principle: convert a frame to greyscale and confirm each character still separates from the background, and that the speaking character's face is the highest-contrast area in frame.
- For flat cut-out characters on a painted gallery background, the low-cost depth stack implied by the sources is: backgrounds lighter, less saturated and less detailed than characters; two or three background layers with slight differential movement on any camera move; a foreground element (counter, plant, door frame) in front of the characters.
- A one-row colour script per episode (one swatch strip per beat: setup, escalation, punchline, closing card) is a cheap planning artifact that makes episodes visually distinct while keeping the series palette.

### Gaps
- Nothing found from Pixar/Disney artists on colour scripts (no Lou Romano or Ralph Eggleston material surfaced).
- No source found on rim light, cast or contact shadows, vignettes, or how low-budget 2D shows specifically add depth; no numeric contrast or saturation targets.
- All sources in this section were seen only as search summaries.

## 7. Editing and comedic timing

### Takeaway
Working comedy editors say the joke lives or dies within a few frames: never cut before a punchline finishes, remove every pause the joke does not need, hold on the reactor rather than cutting away, and spend more effort on clean setups than on punchlines. I found no measured shot-length data for comedy or short-form.

### Cited Findings
- Roger Nygard cut away five frames before a punchline ended on The Mind of the Married Man and calls it a mistake: hold until the speaker finishes; continuity is secondary to comedy — [CineMontage, "Want to Edit Funnier? Let Roger Nygard Show You How", 2022-03-02](https://cinemontage.org/?p=58217) [OPENED] (independent; pre-2023, craft advice)
- On Veep he removed a single frame from each head-bump to make the hits read as more violent — [CineMontage](https://cinemontage.org/?p=58217) [OPENED]
- Pauses should be cut unless the joke needs them: "No longer than absolutely necessary to make a point." Conversely, on Crashing he added pauses back to emphasise awkward moments — [CineMontage](https://cinemontage.org/?p=58217) [OPENED]
- Amateurs leave momentum-killers (pauses, "um") under reaction shots — [CineMontage](https://cinemontage.org/?p=58217) [OPENED]
- Curb Your Enthusiasm spent more time fixing setups than punchlines; many lines are laid "over the back of Larry David's head" to tighten setups — [CineMontage](https://cinemontage.org/?p=58217) [OPENED]
- Julian Doyle's pacing axiom: "If an audience does not want to know what's going to happen next, then cut fast." — [CineMontage](https://cinemontage.org/?p=58217) [OPENED]
- Alec Berg: an A+ laugh is "ten times as good" as a B+ laugh; "four or five massive laughs" make a classic, while a hundred B+ laughs are less memorable — [CineMontage](https://cinemontage.org/?p=58217) [OPENED]
- Rule of three in montage: two shots feel inadequate, four verges on overindulgence — [CineMontage](https://cinemontage.org/?p=58217) [OPENED]
- "Two frames can make the difference between funny and not funny"; attributed Chuck Jones line: "The difference between a laugh and no laugh can be as little as one frame." — [search summary of comedy-editing articles incl. PremiumBeat](https://www.premiumbeat.com/blog/how-to-edit-comedy-scenes-for-maximum-laughs) [SEARCH] (vendor; the Chuck Jones attribution was not verified)
- Hold on the character after the line instead of cutting away; the pause builds to the punchline — [PremiumBeat](https://www.premiumbeat.com/blog/how-to-edit-comedy-scenes-for-maximum-laughs) [SEARCH] (vendor)
- A pause before the punchline lets the audience form an expectation; too long a pause loses attention — [MasterClass, Guide to Comedic Timing](https://masterclass.com/articles/guide-to-comedic-timing) and [Backstage, Comedic Timing 101](https://www.backstage.com/magazine/article/comedic-timing-tips-75129/) [SEARCH] (vendor/trade)
- Vendor data, brand Facebook Reels: pacing of the first three seconds had minimal effect on retention; slow overall pacing correlated with +7.8% 30-second retention — [Emplifi, 2026-03-19](https://emplifi.io/?p=23678) [OPENED] (vendor; correlations, no method or sample size)

### Inferences
- At 30 fps one frame is 33 ms; the practitioners' "one to five frames" corresponds to roughly 30-170 ms. In a code-driven pipeline this means pause lengths before and after punchlines should be explicit, per-line parameters that can be tuned in single-frame steps, not a global gap between lines.
- With no live audience, the "room for the laugh" is the hold on the reaction pose after the punchline; the editors' rule suggests keeping a short held reaction rather than cutting straight to the closing card.
- Berg's "few massive laughs" argues for building a 30-40 s episode around one strong punchline (plus perhaps a button) and using saved time on setup clarity, consistent with Curb's setup-first practice.
- The Emplifi result runs against the common advice that faster cutting always retains better; it is weak evidence (vendor, Facebook, brands), but it means "more cuts" should not be assumed to be an improvement.

### Gaps
- No average-shot-length figures for comedy or for short-form video were found, and no large-sample study on pattern interrupts and retention.
- The University of Rochester undergraduate paper ["Crafting Comedy: Sound, Silence and Framing in Sitcoms"](https://www.rochester.edu/college/ugresearch/jur/crafting-comedy-sound-silence-and-framing-in-sitcoms/) surfaced but was not opened.
- No animation-specific source (e.g. Chuck Jones or Tex Avery on holds and frame counts) was verified.

## 8. Captions and typography

### Takeaway
Broadcast subtitle standards give the only firm numbers found (BBC: about 160-180 words per minute, text within a line height of 8% of video height for 16:9, system fonts), and none of them was written for word-by-word captions in vertical video; the one relevant study found time-synchronised keyword highlights "useful but distracting" for most viewers. Vendor data suggests on-screen text helps music-led videos and may slightly hurt speech-led ones.

### Cited Findings
- BBC subtitle reading speed: 160-180 words per minute, i.e. about 0.33 to 0.375 s per word; DCMP's standard is 130-160 wpm — [Clevercast summary of the BBC Subtitle Guidelines](https://clevercast.com/bbc-subtitling-guidelines) [SEARCH] (vendor summary of a broadcaster standard; the BBC page itself could not be fetched: [bbc.co.uk guide](https://www.bbc.co.uk/accessibility/forproducts/guides/subtitles/) [FAILED])
- BBC online guidance for 16:9: subtitle text should fit within a line height of 8% of the active video height, and line length should be about 68% of the video width; 37 characters per line is the legacy Teletext figure — [Clevercast](https://clevercast.com/bbc-subtitling-guidelines) and [3Play Media](https://www.3playmedia.com/?p=15228) [SEARCH] (vendor summaries; sources disagree on whether the BBC prescribes a character maximum)
- BBC R&D presented research asking whether subtitles need to be bigger than 8% line height — [BBC, "How big should subtitles be?" (CSUN presentation)](https://bbc.github.io/csun/how_big_should_subtitles_be/index.html) [SEARCH] (independent broadcaster research; date not verified, possibly pre-2023)
- BBC recommends system fonts for readability (Helvetica on iOS, Roboto on Android) or BBC Reith Sans — [Clevercast](https://clevercast.com/bbc-subtitling-guidelines) and the [BBC CSUN presentation](https://bbc.github.io/csun/how_big_should_subtitles_be/index.html) [SEARCH]
- Study "Useful but Distracting: Keyword Highlights and Time-Synchronization in Captions for Language Learning" (arXiv 2307.05870, 2023): highlights were distracting enough that most users preferred standard captions unless explicitly trying to learn — [arXiv](https://arxiv.org/abs/2307.05870) [SEARCH] (independent academic; language-learning context, not entertainment)
- A 2025 arXiv paper on real-time AR captioning for deaf and hard-of-hearing students ran a study to find which word-by-word highlighting style is least distracting for karaoke-like presentation (results not seen) — [arXiv 2501.02233](https://arxiv.org/pdf/2501.02233) [SEARCH] (independent academic)
- Vendor retention data, brand Facebook Reels: text overlay across all videos +5.1% (3 s) and +7.6% (10 s) retention; in music-based Reels +4%, +6.6% and +9.8% (30 s); in speech-driven Reels -6% (10 s) and -4.5% (30 s) — [Emplifi, 2026-03-19](https://emplifi.io/?p=23678) [OPENED] (vendor; "text overlay" is not the same as dialogue captions; no sample size; internal inconsistencies between text and table)
- Caption placement per platform (vendor advice): central lower-middle area, clear of the right-hand controls and bottom metadata; on TikTok avoid the lowest quarter; do not align the last word against the right edge on Reels — [Reap, 2026-09-07](https://reap.video/blog/short-form-video-safe-zones) [OPENED] (vendor)
- Unsourced vendor statistic: 68% of TikTok views and 54% of Reels views begin with sound off or very low, citing only "a 2025 study" — [search summary, likely Flixier](https://flixier.com/blog/how-to-increase-video-engagement) [SEARCH] (vendor, unverifiable; attribution to this page is approximate)

### Inferences
- Speaking-rate check: if the 1.1x-accelerated dialogue exceeds about 180 wpm (3 words per second), it is above the BBC's comfortable reading range for block subtitles; word-by-word display removes eye travel but also removes look-ahead, so a brisk comedy line is the worst case. Count words per second per line as a routine check.
- Size check: 8% of 1920 px is about 154 px of line height. The BBC figure was defined for 16:9 on TV/desktop, so it is only an order-of-magnitude anchor; on a phone held at arm's length a similar or larger proportion is plausible, but I found no vertical-video research to confirm it.
- The Emplifi split (text helps music-led, slightly hurts speech-led videos) and the arXiv "useful but distracting" finding both suggest restraint: keep captions for accessibility and sound-off viewing, but avoid extra animated text and heavy per-word effects competing with the characters' faces and the gag.
- WCAG's 4.5:1 contrast ratio for normal text and 3:1 for large text is the standard accessibility yardstick for caption colour against its backing (from my background knowledge; no source was consulted in this research, so verify at w3.org before quoting).

### Gaps
- The BBC guidelines page could not be opened (github.io path 404, bbc.co.uk blocked); all BBC numbers here are second-hand and should be verified at the source.
- No platform guidance (TikTok, Meta, YouTube) on caption font size, words per screen or highlight style was found; no eye-tracking study of word-by-word captions in short-form video was found.
- No W3C/WCAG page was consulted.
- No data found on the share of sound-off viewing from a named, checkable study.

## 9. Covers/thumbnails and the first frame

### Takeaway
YouTube publishes no benchmarks for Shorts retention or "viewed vs swiped away", so targets in circulation are creator-reported; the only moderately data-backed first-seconds finding I could open is a vendor analysis in which speech starting within the first 3 seconds outperformed music-only openings. Cover rules differ per platform and the non-YouTube details were not verified.

### Cited Findings
- YouTube defines "Viewed vs. swiped away" as the percentage of times viewers viewed a Short versus swiped away — [YouTube Help, Understand your content performance](https://support.google.com/youtube/answer/12220281) [SEARCH] (platform)
- YouTube publishes no official benchmark or cutoff for viewed-vs-swiped or other Shorts metrics; circulating targets come from creator-reported data — [Creator Essentials glossary](https://www.creatoressentials.com/glossary/viewed-vs-swiped-away/) and [1of10](https://1of10.com/blog/youtube-shorts-analytics/) [SEARCH] (vendor; attribution approximate)
- Creator-reported rules of thumb: viewed share 70-79% "decent", 80%+ "strong"; average percentage viewed for Shorts under 35 s of 80-90%, 90%+ strong — [vendor guide in search summary, e.g. Shortimize](https://www.shortimize.com/blog/youtube-shorts-retention-rate) [SEARCH] (vendor, not platform data; attribution approximate)
- vidIQ reports its own Shorts averaging 73.6% average percentage viewed (trailing 12 months to June 2026) — [vidIQ](https://vidiq.com/blog/post/youtube-shorts-algorithm/) [SEARCH] (vendor, single channel)
- Average percentage viewed can exceed 100% because Shorts replay automatically and replays count — [search summary of Shorts analytics guides, e.g. Buffer](https://buffer.com/resources/the-creators-guide-to-youtube-shorts-analytics) [SEARCH] (vendor; attribution approximate)
- Speech beginning within the first 3 s versus music-only: +11.7% 3-second, +24.7% 10-second, +6.6% 30-second retention; person visible in first 3 s: +3.6%, +10.1%, -2.4%; pacing of the first three seconds had minimal impact — [Emplifi, "What keeps viewers watching Facebook Reels?", 2026-03-19](https://emplifi.io/?p=23678) [OPENED] (vendor; brand Facebook Reels only; sample size, period and statistical method not stated)
- For micro-length videos (up to 7 s) seamless loops raised replay rate by 18.7%, reach by 23.6% and engagement rate by 16.1% — [Emplifi](https://emplifi.io/?p=23678) [OPENED] (vendor; not directly applicable to 30-40 s episodes)
- YouTube: vertical videos with 16:9 custom thumbnails get an auto-generated 4:5 thumbnail on home, explore and subscription pages; the custom one still shows on the watch page and non-mobile surfaces — [YouTube Help, Add video thumbnails](https://support.google.com/youtube/answer/72431) [SEARCH] (platform)
- Shorts: the thumbnail is a frame chosen in the mobile app before or after upload, not editable in Studio — [third-party guide](https://shortsfast.com/blog/select-a-thumbnail-frame-for-shorts-feeds/) and [Search Engine Journal on new Shorts thumbnail editing features](https://www.searchenginejournal.com/youtube-rolls-out-new-shorts-thumbnail-editing-features/526162/) [SEARCH] (vendor/trade; may be outdated by 2026 changes)
- TikTok: the cover is a frame selected on the post screen — [Metricool help](https://help.metricool.com/en/article/af6upv) [SEARCH] (vendor describing platform behaviour)
- Instagram Reels: sources disagree on whether a custom cover image can be uploaded through scheduling tools; one vendor gives a grid display crop of about 1080x1350 (4:5) for a 1080x1920 cover — [Metricool help](https://help.metricool.com/en/article/af6upv) and [Agorapulse help](https://support.agorapulse.com/en/articles/8773180-how-do-i-choose-a-custom-thumbnail) [SEARCH] (vendor; unverified against Instagram's help centre)
- Weak evidence, listed only so it is not mistaken for strong: a dev.to post claims a 0.84 correlation between first-3-second retention and overall performance from 120 videos on the author's own three accounts — [dev.to](https://dev.to/bulkdl/hook-engineering-the-science-of-the-first-3-seconds-in-short-form-video-2026-2jp9) [SEARCH] (anecdotal)

### Inferences
- The series opens with a title card for 2.6 s. The only opened dataset says speech in the first 3 s is the strongest of the measured opening signals, so a line of dialogue (or a cold-open gag) spoken over or before the title card is a testable change; the evidence is vendor-grade and from Facebook, so treat it as a hypothesis to A/B, not a rule.
- Because the feed and profile grid crop to about 4:5 on at least YouTube (confirmed by platform help in a search summary) and reportedly Instagram, the cover frame's title and faces should sit inside the central 1080x1350 region (y = 285 to 1635 on a 1920-tall frame), which also keeps them out of the top/bottom UI bands.
- If the cover must be a frame from the video (Shorts, TikTok), the episode should contain at least one frame composed as a cover: character plus readable title inside the 4:5 centre.
- With no platform benchmarks, the right yardstick is the series' own history: track viewed-vs-swiped, average percentage viewed and the retention curve at 3 s per episode and compare episode to episode.

### Gaps
- No first-party statement from TikTok, Instagram or YouTube on how covers or the first frame affect distribution was found; no large-sample independent study on first-second retention was found (the "million videos" type of analysis did not surface).
- TikTok and Instagram cover specifications were not verified on their help pages.
- The Emplifi page reports correlations without sample size; its loop retention figures appear only in a table that conflicts with its body text.
