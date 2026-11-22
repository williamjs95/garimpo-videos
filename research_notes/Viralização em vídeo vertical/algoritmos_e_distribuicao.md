# Algoritmos e distribuição: como TikTok, Instagram Reels e YouTube Shorts decidem o alcance (estado em nov/2026)

Source-status legend used throughout:
- **[opened]**: I fetched the page and read its content (via a summarising fetch tool).
- **[search summary]**: I saw only a search-engine summary or snippet, not the page itself. Treat as lower confidence.
- **PLATFORM** = first-party statement, **INDEP** = independent research or journalism, **VENDOR** = marketing or analytics vendor data or blog.
- Anything dated before 2024 is flagged **(pre-2024, possibly outdated)**.

Research date: 2026-11-22. About 20 tool calls. Several primary pages (Mosseri's own Instagram videos, Creator Insider videos, TikTok Creator Academy) could not be opened directly. Where only secondary coverage was available, I say so.

---

## 1. What each platform has officially said about its recommendation system and ranking signals

### Takeaway
All three platforms say they rank videos by predicted viewer behaviour, and none publishes weights. The signals they name most often are watch or completion time, shares/sends, likes, skips or swipe-aways, and explicit negative feedback. Instagram has been the most specific: since Jan 2025 Mosseri has named watch time, likes per reach and sends per reach as the top signals, and sends matter "slightly more" for reaching non-followers. YouTube describes Shorts ranking mainly as "did people choose to watch rather than swipe away." TikTok's official page lists the predicted interactions but gives no relative weights.

### Cited Findings

**TikTok (PLATFORM)**
- TikTok's Safety Center page "Introduction to the TikTok recommendation system" (undated, footer "© 2025") describes a pipeline. (1) Retrieve a pool of videos that "passed initial moderation." (2) Predict "the likelihood you will interact with a given video." (3) Rank by combined score: "By combining prediction scores for each of these interactions, we can arrive at an overall score for each video." (4) Run a similarity check that replaces consecutive videos that are too alike, for example the same sound. (5) Apply further recommendation rules. — [TikTok Safety Center](https://www.tiktok.com/safety/en/policies-and-engagement/recommendation-system) [opened]
- Predicted interactions listed on that page: liking, sharing, commenting, "Not Interested", following the author or visiting their profile, finishing, skipping, favoriting, time spent viewing, and tapping the soundtrack. Video-level signals: time posted, region posted from, author language, soundtrack, length, hashtags. User-level signals: region, device language and OS, recent watched, finished, liked and skipped videos, and follows. The list is called "non-exhaustive" and "dynamic." — [TikTok Safety Center](https://www.tiktok.com/safety/en/policies-and-engagement/recommendation-system) [opened]
- The page uses collaborative filtering: "if another user has engaged with two of the same videos that you have interacted with, the system may predict" you will engage with a third. — [TikTok Safety Center](https://www.tiktok.com/safety/en/policies-and-engagement/recommendation-system) [opened]
- Diversity rules: the feed should include "content from creators in your region," and the system promotes "a variety of content and topics." Content from accounts under 16 is never recommended in For You. — [TikTok Safety Center](https://www.tiktok.com/safety/en/policies-and-engagement/recommendation-system) [opened]
- The page gives **no relative weights**. The often-repeated claim that "watching to the end is a stronger signal than country" comes from TikTok's 2020 Newsroom post "How TikTok recommends videos #ForYou" **(pre-2024, possibly outdated)**, which I did not open. — mentioned via [search summary]; see [Hootsuite](https://blog.hootsuite.com/tiktok-algorithm/) (VENDOR) [search summary]
- Nov 2025: TikTok announced a test of an AI-generated-content slider in "Manage topics", letting users choose how much AI content they see. — reported in [Relay blog](https://relaystudio.ai/blog/tiktok-ai-generated-content-rules) and [contentiq](https://contentiq.media/rules/tiktok) (VENDOR) [search summary]

**Instagram (PLATFORM)**
- "Instagram Ranking Explained" (Adam Mosseri, **May 31, 2023, pre-2024, possibly outdated** but still Instagram's canonical explainer). Reels signals in order of importance: (1) your activity ("which reels you've liked, saved, reshared, commented on, and engaged with recently"), (2) your history with the poster, (3) information about the reel ("audio track or visuals… as well as popularity"), (4) information about the poster ("number of followers or level of engagement"). — [about.instagram.com](https://about.instagram.com/blog/announcements/instagram-ranking-explained) [opened]
- On **Jan 22, 2025**, Mosseri named the three most important signals as watch time, likes, and sends. He told creators to track **average watch time, likes per reach, and sends per reach**: "Likes are slightly more important for connected content, and sends are slightly more important for unconnected content." — compiled by [Buffer](https://buffer.com/resources/instagram-algorithms/), [Kompozy](https://kompozy.io/news/instagram-mosseri-ranking-signals-guidance), [Creatorlane](https://creatorlanehq.com/blog/instagram-algorithm-2026-mosseri-vs-measured) (VENDOR, quoting Mosseri's Instagram video) [search summary]
- The widely repeated claim that "sends are worth 3–5× likes" is **not** something Mosseri said. He said "slightly more important." Nor did he rank watch time as #1. He named three signals without ordering them. — [Creatorlane](https://creatorlanehq.com/blog/instagram-algorithm-2026-mosseri-vs-measured) (VENDOR) [search summary]
- One vendor reports that on **Oct 23, 2026** Mosseri said Instagram focuses "a lot more" on content people send to a friend than on comments. I could not corroborate this with a second source. — [search summary via Kompozy/Zoomsphere-type compilations](https://www.zoomsphere.com/blog/instagram-algorithm-2026-what-actually-gets-reach) (VENDOR) [search summary]
- 2026 Mosseri statements compiled by Pepper Agency (Oct 19, 2026; no per-statement dates):
  - Instagram predicts how likely you are to watch, engage with or share a post.
  - Engagement rate and post-view behaviour (shares, saves, comments, profile visits, follows, watch-through) matter more than raw views.
  - Public posts are shown to non-followers to test them with new audiences.
  - Scheduling a Reel does not hurt reach.
  - Reposting a feed post to Stories does not boost the original.
  - Original content is preferred over reposts.
  — [Pepper Agency](https://www.pepperagency.com/blog/every-instagram-update-adam-mosseri-has-shared-in-2026---updated-october-2026) (VENDOR compilation) [opened]
- Instagram added "Your Algorithm" or topic controls, letting users view and adjust their inferred interests ("Favourites" mean more, "Not interested" means less). — [Pepper Agency](https://www.pepperagency.com/blog/every-instagram-update-adam-mosseri-has-shared-in-2026---updated-october-2026) [opened]

**YouTube (PLATFORM)**
- YouTube Help, "How YouTube recommendations work" (undated, ©2026): "The Shorts Feed is personalized to reflect what we think you want to see next." Platform-wide signals listed: watch history, search history, subscriptions, likes, dislikes, "Not interested", "Don't recommend channel", and **satisfaction surveys**. No Shorts-specific weights. — [YouTube Help 16089387](https://support.google.com/youtube/answer/16089387?hl=en) [opened]
- The same page says AI-made videos "can be recommended as broadly as videos made without AI." — [YouTube Help 16089387](https://support.google.com/youtube/answer/16089387?hl=en) [opened]
- **Aug 2023 (pre-2024, possibly outdated)**: Shorts product lead Todd Sherman (Creator Insider) said Shorts ranking depends on whether viewers **choose to watch rather than swipe away**. The Shorts feed favours more variety than long-form. A view used to require a "meaningful threshold" of intent. — [TechCrunch, Aug 25 2023](https://techcrunch.com/2023/08/25/youtube-demystifies-the-shorts-algorithm-views-and-answers-other-creator-questions/) [search summary]
- The "Viewed vs. swiped away" metric in YouTube Studio (Content → Shorts) is the share of feed impressions where the viewer stayed. YouTube publishes **no official benchmark**. Third-party "70%+ = viral" figures are folklore. — [growcreator](https://growcreator.pro/blog/viewed-vs-swiped-away-youtube-shorts), [creatoressentials](https://www.creatoressentials.com/glossary/viewed-vs-swiped-away/) (VENDOR) [search summary]
- **Jul 2022 (pre-2024, possibly outdated)**: YouTube said Shorts and long-form have separate recommendation systems ("we separate Shorts and long-form content from watch history"). Every Short gets a chance regardless of channel size. Performance depends on whether viewers "watch and not skip." Channels that made Shorts "seemed to be growing faster." — [Search Engine Journal, Jul 29 2022](https://www.searchenginejournal.com/youtube-shorts-algorithm/543939/) [opened]
- **Changed Mar 31, 2025**: a Shorts "view" now counts every start or replay, with no minimum watch time. The old, stricter metric survives as **"engaged views"** (Analytics Advanced Mode) and still governs YPP eligibility and revenue share (10M engaged Shorts views in 90 days is one YPP path). — [ppc.land](https://ppc.land/youtube-changes-how-shorts-views-are-counted-from-march-31/), [TubeBuddy](https://www.tubebuddy.com/blog/youtube-shorts-view-count-update-what-creators-need-to-know-about-the-new-metrics/) (VENDOR/trade press) [search summary]
- Several vendors report the start-based view count was extended to long-form, podcasts and live on **Aug 24, 2026**. I did not confirm this with YouTube's own announcement. — [vidIQ](https://vidiq.com/blog/post/youtube-view-count-update/) (VENDOR) [search summary]

### Inferences
- Across all three platforms the common currency is "predicted satisfaction per impression." Ratios such as per-reach sends and likes, viewed vs. swiped, and completion matter more than absolute counts. A small account is judged on the same per-impression terms as a big one.
- Since Mar 2025, YouTube's headline view counts are inflated relative to TikTok and Instagram. To compare episodes across platforms, use YouTube's **engaged views**.
- The 2025–2026 changes are: Instagram's explicit per-reach framing (Jan 2025), YouTube's view-count redefinition (Mar 2025), new user-side topic and AI controls on TikTok (Nov 2025) and Instagram (2025–26), and Instagram's stronger emphasis on sends (Oct 2026, single source).

### Gaps
- Could not open Mosseri's original Jan 2025 or Oct 2026 videos. Quotes come via vendor transcriptions.
- Could not open TikTok's 2020 Newsroom post or current Creator Academy pages. I found no TikTok first-party page with signal weights.
- I found no first-party YouTube statement from 2025–2026 that details Shorts ranking beyond the Help page.

---

## 2. How initial testing works (seed audiences, batches, gating)

### Takeaway
All three platforms confirm that new content is shown to some initial audience and that its performance shapes further distribution. "Batches" of 200–500 viewers with fixed gates are **inferred folklore** with no first-party source. Instagram documents a real testing tool, **Trial Reels**, which shows a Reel to non-followers first.

### Cited Findings
- TikTok officially describes only retrieval, then prediction, then ranking. Its recommendation page has **no description of staged testing of new videos**. — [TikTok Safety Center](https://www.tiktok.com/safety/en/policies-and-engagement/recommendation-system) [opened]
- Mosseri (2026, per compilation): public posts are shown to non-followers so Instagram can test them with new audiences ("breaking content"), which lets smaller creators break through. — [Pepper Agency](https://www.pepperagency.com/blog/every-instagram-update-adam-mosseri-has-shared-in-2026---updated-october-2026) [opened]
- Instagram Help (quoted second-hand) on Trial Reels: a trial reel "may get limited reach if Instagram detects that you've previously shared the same content." Trials that fail never reach followers. Instagram later limited the number of Trial Reels per 30 days. Blogs claim caps of 5–20 per day, which is unverified. — [creatorflow](https://creatorflow.so/blog/instagram-trial-reels/), [avramify](https://www.avramify.com/blogs/news/the-trial-reels-update-nobody-is-talking-about) (VENDOR) [search summary]; 30-day limit from [Pepper Agency](https://www.pepperagency.com/blog/every-instagram-update-adam-mosseri-has-shared-in-2026---updated-october-2026) [opened]
- Mosseri encouraged creators to use Trial Reels for experimentation and confirmed they can be scheduled. — [Pepper Agency](https://www.pepperagency.com/blog/every-instagram-update-adam-mosseri-has-shared-in-2026---updated-october-2026) [opened]
- YouTube (2023, via secondary write-ups): because Shorts views mostly come from the feed with no conscious click, "the algorithm tests the Shorts to determine its value." — attributed to Todd Sherman in [growcreator](https://growcreator.pro/blog/viewed-vs-swiped-away-youtube-shorts) (VENDOR) [search summary] **(pre-2024)**
- YouTube (2022): every Short gets a chance regardless of channel size, and an audience "is often built over time." — [SEJ](https://www.searchenginejournal.com/youtube-shorts-algorithm/543939/) [opened] **(pre-2024)**

### Inferences
- The documented part is that new posts get exposure to non-followers and early per-impression behaviour drives more exposure. The **undocumented** parts are batch sizes, time windows ("first hour"), and fixed percentage thresholds.
- Trial Reels give this channel a cheap way to A/B test hooks or episode cold-opens with non-followers on Instagram. Each trial must be new content: re-uploading a feed Reel as a trial gets suppressed.

### Gaps
- No platform publishes seed-audience size or gate thresholds. No independent study I found measures TikTok's "batch" mechanism directly.

---

## 3. Which engagement signals weigh most for non-follower reach

### Takeaway
First-party: Instagram says **sends per reach** matter slightly more for non-follower reach, while likes matter more for followers. Watch time is a top-3 signal. YouTube Shorts: the decisive early signal is **viewed vs. swiped away**, then watching without skipping. TikTok lists finish, skip, time spent, share, like, comment and follow, unweighted. Independent audits find **watch time / rewatch** is the strongest personalisation factor on TikTok.

### Cited Findings
- Instagram: "sends are slightly more important for unconnected content" (Jan 22, 2025). — [Kompozy](https://kompozy.io/news/instagram-mosseri-ranking-signals-guidance), [Buffer](https://buffer.com/resources/instagram-algorithms/) [search summary]
- Instagram: post-view behaviour (shares, saves, comments, profile visits, follows, watch-through) matters more than raw views (Mosseri 2026, via compilation). — [Pepper Agency](https://www.pepperagency.com/blog/every-instagram-update-adam-mosseri-has-shared-in-2026---updated-october-2026) [opened]
- Instagram: a single-source report says Mosseri (Oct 23, 2026) emphasised sends to a friend "a lot more" than comments. — [search summary](https://www.zoomsphere.com/blog/instagram-algorithm-2026-what-actually-gets-reach) [unverified]
- INDEP, TikTok sockpuppet audit (Mosnar et al., Kempelen Institute, SIGIR '25, data Jan–Feb 2025):
  - **Watch duration is the strongest personalisation factor**, and the effect grows with repeated viewing. Watching 400% of a video's length (rewatching about 4×) had a strong effect, 200% was similar to 100%, and under 100% had little effect.
  - **Follow was weaker than watch**, which contradicts Boeker & Urman 2022, who found follow strongest.
  - Likes on target interests produced exploration first, then a sharp rise in on-interest videos after about 1,000 videos.
  — [arXiv 2504.18140](https://arxiv.org/html/2504.18140v1) [opened]
- INDEP: Boeker & Urman (2022, **pre-2024, possibly outdated**) found following and watch time the strongest influences on the TikTok feed. — cited in [Kaplan et al., arXiv 2605.10690 (May 2026)](https://arxiv.org/html/2605.10690) [search summary]; original [arXiv 2201.12271](https://ar5iv.labs.arxiv.org/html/2201.12271) [search summary]
- Note that these audits measure what shapes **a viewer's** feed (personalisation), not what makes **a creator's** video spread. They support the claim that watch-through and rewatch are heavily weighted, but only indirectly.
- VENDOR: a "3.3 billion Shorts" study reportedly found that videos with 70–90% viewed-vs-swiped consistently outperformed others. Methodology unknown. — via [growcreator](https://growcreator.pro/blog/viewed-vs-swiped-away-youtube-shorts) [search summary]

### Inferences
- Order of priority for a 30–40 s comedy episode:
  1. First-second hold (stops the swipe on YouTube, drives watch time everywhere).
  2. Completion and **rewatch**. A short, loopable punchline pays off, since audits show rewatch above 100% boosts personalisation.
  3. **Shareability to a specific friend** ("manda pro seu amigo que…"). This is Instagram's explicit non-follower lever and a TikTok prediction target.
  4. Likes and comments, mainly for followers.
- Asking for comments gets less emphasis than earning sends, given Instagram's reported 2026 shift. This is an inference from a single source.

### Gaps
- No platform gives numeric weights. No independent study measures creator-side reach drivers with causal design in 2025–2026.

---

## 4. Originality and reposting rules (watermarks, cross-posting, AI labels, unoriginal content)

### Takeaway
All three platforms penalise **recycled or watermarked** content in recommendations. Posting your **own** original video natively on all three, without another app's watermark, is not penalised by any rule I found. AI disclosure labels by themselves do not reduce reach on YouTube or TikTok, per their official wording. YouTube's July 2025 "inauthentic content" change concerns **monetisation** of mass-produced or repetitive content. It is not a reach rule, and it was framed as a renamed existing rule.

### Cited Findings
**Instagram**
- Instagram aims to make less visible "low-resolution or watermarked reels," "reels that are muted or contain borders," "reels that are majority text," and "reels that have already been posted on Instagram." It is also "experimenting with new notifications… when the reach of their reel may be limited due to a watermark." (May 31, 2023, **pre-2024**) — [about.instagram.com](https://about.instagram.com/blog/announcements/instagram-ranking-explained) [opened]
- **Apr 30, 2024**: Instagram replaced reposts with originals in recommendations, labelled reposts with a link to the original creator, and removed aggregators from recommendations. Content counts as unoriginal unless "meaningfully edited." — [TechCrunch Apr 30 2024](https://techcrunch.com/2024/04/30/instagram-is-updating-its-ranking-systems-to-surface-more-content-from-smaller-original-creators) [search summary]
- **Apr 30, 2026**: the penalty was extended from Reels to photos and carousels. Accounts that repost too many become **ineligible for recommendations** to non-followers. Followers still see them. Meaningful changes include "unique text, creative edits, and voiceover," or adding a perspective, joke or context. Speed changes or a screenshot of the original poster "isn't enough." — [Tubefilter Apr 30 2026](https://tubefilter.com/2026/04/30/instagram-removes-algorithm-recommendations-repost-content-aggregator) [opened]; [PetaPixel](https://petapixel.com/2026/04/30/new-instagram-policies-target-reposted-content/) [search summary]
- Aggregator status is judged over roughly a month of activity, not post by post (Mosseri). — [search summary of PetaPixel/Tubefilter coverage](https://petapixel.com/2026/04/30/new-instagram-policies-target-reposted-content/). The specific "10 reposts in 30 days" threshold appears only in blogs and is **unverified**. — [aubrium](https://aubrium.com/blog/instagram-war-on-reposts) (VENDOR) [search summary]
- Cross-posting: one report says Mosseri stated (Oct 30, 2026) that Instagram does not demote content made with other apps **as long as it has no watermark**. — [search summary, compilation](https://www.zoomsphere.com/blog/instagram-algorithm-2026-what-actually-gets-reach) [unverified single source]. This is consistent with the 2023 watermark rule above.
- Re-posting the same Reel file again "will probably get less reach" (Mosseri, via a video summary). — [heymark](https://heymark.ai/en/guides/adam-mosseri-repurpose-instagram-reels/) (VENDOR) [search summary]
- AI on Meta: the "AI info" label for AI-*edited* content sits in the post menu, not on the post. I found **no Meta or Mosseri statement that the label lowers reach**. Separate rule: accounts with AI personas that do not add an "AI-generated profile" label may become non-recommendable. — [Meta Help](https://www.meta.com/en-gb/help/artificial-intelligence/1783222608822690/), [MediaPost](https://www.mediapost.com/publications/article/417580/instagram-limits-creators-reach-for-profiles-with.html) [search summary]

**TikTok**
- Per TikTok's Community Guidelines (quoted second-hand), unoriginal content, including clips with another platform's watermark or logo and "low-quality or minimally edited content," is **ineligible for the For You feed** rather than removed. FYF-ineligible content is also excluded from the Creator Rewards Program. — [contentiq](https://contentiq.media/rules/tiktok), [shapelessai](https://shapelessai.com/notes/unoriginal-content-rules-youtube-tiktok-instagram) (VENDOR) [search summary]
- TikTok on AI labels (quoted second-hand): "Applying the label will not have an impact on organic engagement with your content, provided that your content isn't violative and meets our For You feed eligibility standards." Labelling is required for realistic AI content. — [primores](https://primores.org/blog/tiktok-ai-generated-content-label/), [relaystudio](https://relaystudio.ai/blog/tiktok-ai-generated-content-rules) [search summary]
- TikTok's own recommendation page lists "Championing opportunities for original and creative expression" as a design goal but states no originality rule. — [TikTok Safety Center](https://www.tiktok.com/safety/en/policies-and-engagement/recommendation-system) [opened]

**YouTube**
- **Jul 15, 2025**: the YPP rule "repetitious content" was renamed **"inauthentic content"**, described as "mass-produced or repetitive" content often seen as spam. Examples: narrated stories with only superficial differences, and slideshows with the same narration. YouTube called it a clarification, not a new policy. Reaction and clip channels are not specifically targeted. — [TechCrunch Jul 9 2025](https://techcrunch.com/2025/07/09/youtube-prepares-crackdown-on-mass-produced-and-repetitive-videos-as-concern-over-ai-slop-grows), [Social Media Today](https://www.socialmediatoday.com/news/youtube-clarifies-monetization-update-inauthentic-repeated-content/752892/), [SEJ](https://www.searchenginejournal.com/youtube-clarifies-monetization-update-targeting-spam-not-reaction-channels/550123/) [search summary]
- YouTube Help: disclosing altered or synthetic content won't limit a video's audience or its monetisation eligibility. YouTube may add a label itself if content could mislead. — [YouTube Help 14328491](https://support.google.com/youtube/answer/14328491), [YouTube blog, Mar 2024](https://blog.youtube/news-and-events/disclosing-ai-generated-content) [search summary]
- AI videos "can be recommended as broadly as videos made without AI." — [YouTube Help 16089387](https://support.google.com/youtube/answer/16089387?hl=en) [opened]

### Inferences
- For this channel: export a **clean master** without any watermark and upload it natively to each platform. Never download from TikTok and re-upload with its watermark. Since it is the brand's own content, it should not count as "aggregator" reposting.
- Risk area: YouTube's "inauthentic content" monetisation rule targets templated, mass-produced series with superficial variation. An AI-assisted animated series with a recurring cast and set should make each episode visibly distinct in script and joke so it doesn't read as "repetitive." The rule touches monetisation, not reach.
- Disclosure labels appear to be required for *realistic* AI content. Clearly cartoon animation is likely out of scope. Not verified on the help pages; see Gaps.

### Gaps
- I did not open TikTok's current Community Guidelines FYF-eligibility section or YouTube's disclosure help page to confirm whether stylised animation is exempt from AI disclosure.
- No independent measurement of whether cross-posting the same file to all three platforms affects reach. No platform penalises it explicitly, apart from watermarks.
- I could not reconcile conflicting dates (Feb vs Apr 2026) for Instagram's photo and carousel expansion. Tubefilter's Apr 30, 2026 is the best-sourced.

---

## 5. Search on short-form platforms (keywords, on-screen text, speech, hashtags)

### Takeaway
TikTok officially lists hashtags as a video signal and offers Creator Search Insights. That TikTok search reads spoken words (transcribed audio), on-screen text and captions is consistent industry consensus but **not confirmed by a first-party page I could open**. Hashtags are no longer among Instagram's named top signals.

### Cited Findings
- TikTok lists "hashtags" among video information signals, alongside soundtrack and length, without weights. — [TikTok Safety Center](https://www.tiktok.com/safety/en/policies-and-engagement/recommendation-system) [opened]
- Industry consensus: TikTok search matches spoken audio (auto-transcribed), captions, on-screen text and hashtags against queries. Ranking then blends keyword match with engagement. TikTok does not publish relative weights. Creator Search Insights and autocomplete are the recommended keyword research tools. — [Sotrender, Aug 2025](https://www.sotrender.com/blog/2025/08/tiktok-algorithm/), [Sked Social](https://skedsocial.com/blog/social-search-how-to-optimize-for-discoverability-on-tiktok-and-instagram-2025), [trygoviral](https://trygoviral.com/tiktok-seo) (VENDOR) [search summary]
- Hashtags are not among the top signals Mosseri named in Jan 2025. I found no 2026 Mosseri hashtag statement. — [search summary of Mosseri compilations](https://www.zoomsphere.com/blog/instagram-algorithm-2026-what-actually-gets-reach) [search summary]
- YouTube: search history influences future recommendations generally. There is no Shorts-specific search guidance on the Help page. — [YouTube Help 16089387](https://support.google.com/youtube/answer/16089387?hl=en) [opened]

### Inferences
- Comedy is mostly discovered in feeds, not search, but a light layer of searchable words costs little. Examples: a spoken line or caption naming the theme, such as "licitação," "edital," "camelô," "galeria." Portuguese keywords in caption and on-screen title help both TikTok search and the B2B audience who might search "editais."
- Use 3–5 relevant hashtags at most, treating them as metadata and not as reach drivers.

### Gaps
- No first-party confirmation, opened by me, that TikTok or Instagram index spoken words for search. No Brazil-specific data on short-form search behaviour (Núcleo/Folha not searched due to budget).

---

## 6. Posting factors: frequency, time, consistency, length, series

### Takeaway
Platforms say little. Mosseri advises matching frequency to your resources and says scheduling does not hurt. Maximum lengths have grown (Shorts 3 min since Oct 2024, Reels 3 min since Jan 2025), but no platform says length is directly rewarded. Vendor data is correlational and conflicting: Buffer finds longer TikToks get higher median views, and Socialinsider finds 30–60 s Reels get the best reach rate. 30–40 s sits in a competitive band.

### Cited Findings
- Mosseri: balance posting frequency against available time and resources rather than posting as much as possible. Scheduling doesn't hurt reach. — [Pepper Agency](https://www.pepperagency.com/blog/every-instagram-update-adam-mosseri-has-shared-in-2026---updated-october-2026) [opened]
- Mosseri reportedly: shorter is better for Reels because completion and rewatches feed recommendation. — [Kompozy](https://kompozy.io/creator-growth/grow-instagram-with-reels) (VENDOR) [search summary, unverified wording]
- Instagram Reels max length rose to 3 minutes in Jan 2025 (Mosseri video). — [Social Media Today](https://www.socialmediatoday.com/news/instagram-officially-expands-reels-length-to-3-minutes/737766/) [search summary]. One blog claims a 20-minute cap in 2026, which is unverified. — [dataslayer](https://www.dataslayer.ai/blog/instagram-algorithm-2025-complete-guide-for-marketers) [search summary]
- YouTube Shorts max length rose from 60 s to 3 min in Oct 2024. — [Social Media Today](https://www.socialmediatoday.com/news/instagram-officially-expands-reels-length-to-3-minutes/737766/) [search summary]
- TikTok lists video **length** as a signal, direction unspecified. — [TikTok Safety Center](https://www.tiktok.com/safety/en/policies-and-engagement/recommendation-system) [opened]
- YouTube (2022): mixing Shorts and long-form on one channel is unlikely to hurt. Shorts and long-form are recommended separately. — [SEJ](https://www.searchenginejournal.com/youtube-shorts-algorithm/543939/) [opened] **(pre-2024)**
- VENDOR, Buffer (Mar 2025, 1.1M TikToks, skewed toward small accounts): median views were 432.5 for clips over 60 s versus 194 for 5–10 s clips. Correlational. — via [search summary](https://www.usefastlane.ai/blog/short-form-video-benchmarks) [search summary]
- VENDOR, Socialinsider (2026, about 140k Reels): the highest reach rate (5.60%) was for 30–60 s Reels. — via [search summary](https://inmagic.ai/instagram-reels-statistics/) [search summary]
- VENDOR, Buffer (Aug 2025, 2.1M posts, 102k accounts): on Instagram, 3–5 posts per week more than doubled follower growth versus 1–2, with about 12% more reach per post. On TikTok, views per post were about 17% higher at 2–5 posts per week, about 29% at 6–10, and about 34% at 11+, flattening after that. — via [search summary](https://futuretweets.com/social-media-algorithm-posting-frequency-penalty-2026/) [search summary; primary not opened]
- VENDOR, Metricool 2026 (24.4M Instagram posts, 375k accounts): Reels reach down about 35% year on year, average watch time per Reel 8.5 s. Reels get about 30% fewer views than TikTok videos. Metricool 2025: YouTube Shorts reach down 31% year on year. — [Metricool PDF](https://metricool.com/wp-content/uploads/Social-Media-Study-2026-EN.pdf), [MarketingTech News](https://www.marketingtechnews.net/news/what-the-data-tells-us-about-short-form-video-insights-from-metricools-2025-state-of-short-form-video-report/) [search summary; PDF snippet garbled]
- Posting time: TikTok lists "time posted" as a signal. Mosseri says the feed is "roughly in chronological order," so newer posts generally have an advantage. — [TikTok Safety Center](https://www.tiktok.com/safety/en/policies-and-engagement/recommendation-system) [opened]; [Pepper Agency](https://www.pepperagency.com/blog/every-instagram-update-adam-mosseri-has-shared-in-2026---updated-october-2026) [opened]

### Inferences
- 30–40 s is a sound length. It is long enough for a setup, escalation and punchline, and short enough for high completion and rewatch. Metricool's 8.5 s average watch time shows that the first seconds decide most outcomes regardless of length.
- Consistency matters more than volume. Buffer's frequency gains are modest (+12–34%) and correlational. A sustainable weekly cadence, such as 2–3 episodes a week, beats bursts.
- Series and playlists: I found no first-party evidence that series formats boost feed distribution. Their plausible value is in follow conversion and binge on profile pages (inference).

### Gaps
- No first-party data on whether 30–40 s is favoured or penalised against 15 s or 60+ s. No platform statement on series or playlists (TikTok Series, YouTube playlists, Instagram series) affecting reach. Best-time-to-post data for Brazil (BRT) not found in this pass.

---

## 7. Academic and independent audits, and their limits

### Takeaway
Sock-puppet audits of TikTok consistently find **watch time / rewatch** to be a dominant personalisation signal, with follows, likes and location also mattering. A 2025 reproduction shows such findings are fragile: poor reproducibility, results that hinge on the metric chosen, and validity that is only short-term. Audits measure viewer-side personalisation, not creator-side virality.

### Cited Findings
- Mosnar et al., "Revisiting Algorithmic Audits of TikTok: Poor Reproducibility and Short-term Validity of Findings" (SIGIR '25, arXiv Apr 25 2025; data Jan–Feb 2025). It replicates Boeker & Urman 2022 and Vombatkere et al. 2024. Findings: watch is strongest, rewatch at 400% strongest of all, and follow is weaker than before. Baseline similarity between concurrent bots fell to about 10–11% from 35%, suggesting a more diverse feed. Ads appeared in about 1 in 4 feed items, livestreams in about 1 in 20. Limits: about 9 person-months of effort, missing code in prior studies, 20 bots banned, conclusions sensitive to the similarity metric, and follow possibly broken on the web interface. The authors call their conclusions short-term. — [arXiv 2504.18140](https://arxiv.org/html/2504.18140v1) [opened]
- Boeker & Urman, "An Empirical Investigation of Personalization Factors on TikTok" (2022, **pre-2024**). Sock puppets tested language, location, follow and like. Follow and watch time were the strongest. — [arXiv 2201.12271](https://ar5iv.labs.arxiv.org/html/2201.12271) [search summary]
- Kaplan et al., "When 'For You' Isn't For You: Measuring User Agency in TikTok's Algorithmic Feed" (arXiv 2605.10690, May 2026). The feed infers preferences from implicit signals such as watch duration. Introduces "cloning" of sock puppets with identical histories for counterfactual tests. — [arXiv 2605.10690](https://arxiv.org/html/2605.10690) [search summary]
- Northeastern (Jun 9, 2026) reported research on how much the "Not interested" control actually changes TikTok's feed. — [Northeastern News](https://news.northeastern.edu/2026/06/09/tiktok-not-interested-algorithm-control/) [search summary; details not verified]
- "Dynamics of Algorithmic Content Amplification on TikTok" (arXiv 2503.20231, Mar 2025) studies how quickly the For You feed detects bot interests, using LLM relevance judging. — [arXiv 2503.20231](https://arxiv.org/html/2503.20231) [search summary]
- WSJ's 2021 sock-puppet investigation ("Inside TikTok's algorithm") is widely cited for "watch time is key" (**pre-2024, possibly outdated**). I did not open it.

### Inferences
- Independent evidence supports the platforms' implied emphasis on watch time and rewatch, but no audit gives a creator-side recipe. Treat every "algorithm hack" as perishable.
- I found no comparable independent audits of Instagram Reels or YouTube Shorts ranking in this pass. TikTok dominates the audit literature.

### Gaps
- I did not find independent audits of Reels or Shorts, Brazil-specific audits (Núcleo, Rest of World), or Mozilla's YouTube RegretsReporter follow-ups for Shorts within the tool budget.
- No independent study of reach predictors at creator level (for example, regression of views on shares and completion) from 2025–2026 was found.
