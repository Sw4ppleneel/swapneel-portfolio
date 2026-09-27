# VISION — swapneel.premchand, rebuilt

> A prompt to myself, written before a single line of code. Build exactly this. Where it says
> *verify*, look before assuming.

## The one-sentence idea

**A wandering soul's night walk through his own world.** The visitor arrives in a pixel-art night,
meets an engineer who builds systems for when things break, and on the way finds out he also reads,
writes, plays guitar, games and collects moments. It should feel like midnight, cinematic and a bit
feral. It has to stay **professional first**: a recruiter or founder should be able to get "who is
this, what has he shipped, how do I reach him" inside 20 seconds, even if they never scroll past the
fold.

## Restraint principle (added after review: "don't just make it random flashy")

Every element has to earn its place by saying something true about him. Motion is slow and
deliberate. There's one playful system (the Pokémon dialog box) rather than ten gimmicks, and the
easter egg stays hidden. When in doubt, cut it. The tech work gets the most space and the calmest
typography.

## Who he is (source of truth, carried over from the current site)

- Swapneel Premchand · CS + AI @ Plaksha University · Mohali, IN
- **Founder, Tulips.edu**: multi-tenant school ERP, live in 3 schools (confirmed by him; LinkedIn agrees), self-hosted, and he takes the
  2 a.m. pages himself.
- **Research Assistant** with Prof. Anuj Kapoor (University of Missouri): causal inference on a
  digital-physiotherapy platform, covering staggered DiD, causal ML and provider-exit shocks.
- **AWS Student Builder Campus Leader**, 2026 Global University Program (from Aug 2026).
- Projects: **SxQLear** (schema archaeology, local-first), **Asclepius** (1st / 450 teams),
  **Paeon AI** (2nd / 30 teams).
- Thesis line (keep it, it's his): *"I build AI systems for when things break, not just when they
  work."*
- Off the clock: reading, writing, guitar, music, gaming. From the moodboard: Pokémon on a DS, a white
  Strat, headphones on a laptop, the moon with a plane crossing it, a whale swimming through space,
  Jujutsu-Kaisen-style ink, Jordan 1s, "viva la vida", "jack of all trades, master of none…"
- Hackathons (from his LinkedIn): **Hack-n-Win 3.0**, CGC University Mohali, Mar 2026: 1st of 450+
  teams, plus 2nd for best MongoDB use case, with *Team Deranked*, building Asclepius.
  **Plaksha MediThon 2026**, Feb 2026: first runner-up (₹50,000) for Paeon AI, a compliance-first
  digital medical rep. **CTLC Reel Challenge**, Plaksha, Feb 2026: 3rd place (a creative win).
- Instagram bio: *"What a Drag! / Dum spiro, spero"*. Latest post caption: *"Difficult roads truly
  lead to beautiful places"* (Spiti Valley). These are real lines of his; use them.
- Books, top three: *The Alchemist*, *The Subtle Art of Not Giving a F\*ck*, *To Kill a Mockingbird*.
  The shelf keeps going: *The God Equation* (Michio Kaku, a favourite), *Diary of a Wimpy Kid* (favourite
  series), Colleen Hoover's *It Ends With Us*, *It Starts With Us* and *Verity*.
- Games: BGMI (his night-gaming love), Age of Mythology (he loves Greek philosophy), The Witcher,
  Prince of Persia, NFS Most Wanted, GTA, Project IGI, Road Rash, CS:GO, the Clash games, Brawl Stars
  and Pokémon.
- Anime: *Violet Evergarden*, *Vinland Saga*, *Jujutsu Kaisen* (Gojo). Violet is about writing
  letters, and Vinland is about strength that chooses kindness ("I have no enemies"). Both tie
  straight into his writing and his motto.
- Writes **poetry and short stories**. I don't have his texts, so I won't invent any. The writing
  panel says the notebook exists and invites people to ask, and there's a data slot for real
  excerpts later.
- **A total Poké-nerd** who grew up on a DS. **Loves anime**, and lives by Gojo Satoru's
  *strength and kindness* mentality: be the strongest in the room and use it to look after people.
  That is also exactly how he talks about reliability, so it's the emotional core of the site.

## Update from his LinkedIn export (Sep 2026)

- Current roles: Founder, Tulips.edu (since Jun '26); Founder's Office Intern at Flyback (since Aug '26),
  where he's the sole engineer (platform + CRM rebuild, a two-pass hybrid matcher with human-in-the-loop
  review, scrapers and ATS ingestion). Flyback is now PRJ—02, and **CitefyMe** (a research RAG with claim-level verification and honest
  eval findings) is PRJ—03.
- Past roles: RA with Prof. Kapoor (May–Aug '26), AWS Campus Ambassador (Aug–Sep '26, 300+ students).
- Certifications appear as "badges earned" under moves learned.
- **Guilds joined** (clubs), from 4b onwards:
  - Geek Room Plaksha, Technical Lead: Prayas, Colossus, the Trackshift '26 site.
  - LEAP AI@Plaksha: OLM research, the LLM gallery.
  - Cyber Defense Club: DaVinci Node AI jailbreaking, CTF workshops ×2.
  - GDG Ranchi.

**Structure change:** "the work" is split into **experience** (EXP—01 Tulips + topology demo, 02 Flyback,
03 AWS Campus Ambassador, 04 University of Missouri RA, which absorbs the old research section) and
**projects** (PRJ—01 CitefyMe, 02 SxQLear, 03 Asclepius, 04 Paeon). The nav reads experience · projects ·
guilds · off the clock · pictures.

## The visual language: three voices, each with one job

The moodboard is a **collage on deep midnight navy**. Cream paper strips carry typewriter text,
lowercase serif phrases float in the gaps, and B&W photographs are hit with rare, hot colour (a red
Ferrari, orange fire, pink lips, baby-blue sneakers). I translate that into three voices, and each
one does exactly one job:

| Voice | Job | Treatment |
|---|---|---|
| **Editorial** | identity and feeling | High-contrast display serif with swash (the "Feral." energy) for names and section titles, plus lowercase serif phrases that end in a period: *consume.*, *viva la vida.* |
| **Paper / typewriter** | punchlines and labels | Cream tape strips set slightly askew with torn edges, in a typewriter face. Used sparingly, the way the moodboard does it. |
| **Pixel** | the world, motion, icons, play | Hero scene, section sprites, cursor, interest "inventory", the interactive systems demo. Crisp `image-rendering: pixelated`, never blurry. |

The tech facts (stack, metrics, logs) go in a small mono/pixel face, precise and quiet.

**The Pokémon layer is a system, not a sticker.** The classic Game Boy dialog box (double-line
border, blinking ▼, text typing out letter by letter) is the site's **system-message component**,
used for form results, "email copied!", the boot line, the demo log and inventory panels. Consistent
use is what makes it feel native rather than gimmicky.
**IP rule:** only *original* pixel art that evokes the style. No official sprites, logos, creature
names or character art, from Pokémon or from JJK.

**Palette** (tokens on `:root`):
- `--night` #0A0D26 (base, the moodboard navy) · `--night-2` #121640 (raised)
- `--paper` #ECE4D2 (tape, cream text) · `--ink` #1A1A1A (text on paper)
- `--moon` #D9DCE6 (silver B&W)
- Accents, **one per section, never mixed**: `--ember` #FF6A1A (fire, used for primary actions),
  `--ferrari` #C8102E, `--sky` #9CC3E6 (Jordans), `--lip` #C98BA6,
  `--infinity` #6FD3FF (Six-Eyes blue, reserved for the Gojo moments and the easter egg)

**Type** (Google Fonts, 4 families maximum): display serif (DM Serif Display or Gloock, whichever
matches "Feral." better once rendered), a readable text serif for body, Special Elite for the tape,
and Silkscreen / Pixelify Sans for pixel labels.

It's dark by default. The night *is* the concept, so there's no light-mode toggle.

## The walk: sections in order

**0 · Boot (≤1.2 s, skippable).** Black screen, a pixel cursor blinks, then the typewriter prints
`wandering…` and the night fades in. Returning visitors skip it (sessionStorage).

**1 · Hero: the night.** A full-bleed **procedural pixel-art motion scene on canvas** instead of a
video file: an internal resolution of about 320×180, scaled up, looping forever and weighing almost
nothing.
- Deep navy sky with a dithered gradient, twinkling stars and a big pixel moon, with a **tiny plane
  crossing the moon** every ~20 s (a nod to the moodboard).
- A **whale drifting slowly through the stars** (the space whale).
- Parallax layers (distant hills, a city skyline with a few lit windows, a road), all driven gently
  by mouse and scroll.
- **A lone pixel figure walking**, guitar on his back, headphones on: the wandering soul. He stops,
  looks at the moon and keeps walking.
- Overlay, left-aligned and editorial: huge serif **"Swapneel."**, with the lowercase line *builds
  systems for when things break.* under it, and four askew tape strips:
  `ENGINEER BY DAY,` `PHILOSOPHER BY NIGHT,` `MUSICIAN BY CHOICE,` `REBEL BY FATE.`
- A mono status line: `CS + AI @ PLAKSHA · MOHALI · NOW: TULIPS.EDU / CAUSAL INFERENCE / AWS`
- Two actions only: **See the work** and **Get in touch** (ember).
- *Stretch goal, only if it earns its weight:* the "minimal aesthetic render". A low-poly Three.js
  moon/figure rendered at low resolution through an ordered-dither shader, so it reads as pixel art.
  Default to the 2D scene; it matches the rest and is far easier to control.

**2 · consume. (who I am).** Two halves side by side:
- Left, editorial: one short manifesto paragraph covering the wandering, the building and why failure
  modes are what interest him. (*strength & kindness* was cut at his request: it was repeating.)
- Right, pixel: **his own Pokédex entry** in a red handheld-dex frame.
  `No.001 SWAPNEEL · the Wandering Engineer · TYPE: TECH / PSYCHIC ·
  ABILITY: Unfazed (battle-tested) · HIDDEN ABILITY: 2 a.m. Pager`
  Dex text: *"Often found at night, building systems that refuse to fall over. Carries a guitar.
  Has never once lost to a bug for long."* (a nod to his "I always win" tape).
  Below it, **base-stat bars** carrying the real proof points: *3 schools in prod · 1st / 450 ·
  2nd / 30 · 2 yrs on call*.

**3 · Work: the main event, and the biggest section.** Tech comes first, so this is where most of
the effort goes.
- Four projects as **editorial spreads** rather than cards: a big serif name, a one-line pitch, a
  small pixel illustration per project (a school bell for Tulips, a magnifier over tables for
  SxQLear, a brain scan for Asclepius, a pill and a phone for Paeon), the stack in pixel tags and a
  status tape (`IN PRODUCTION`, `1ST / 450 TEAMS`).
- Keep the **"Failure-mode thinking"** block for each project. It's the differentiator.
- **Rebuild the Tulips topology demo in pixel art**: tiny pixel servers (API, Postgres, R2). Click
  one to knock it out and it sparks, goes dark, and the pixel log reports what really happens (same
  copy as today, including the "no fallback" honesty).

**4 · Research.** A quieter spread for the causal inference work: identification, causal ML and
sequence models. Moon-silver accent. It should read like a paper abstract, credible and calm.

**5 · jack of all trades (off the clock).** The tape reads *jack of all trades, master of none…*,
and then a second strip slides in: *…but oftentimes better than master of one.* This is an **RPG
inventory grid** of pixel items, and each one opens a small panel:
Six slots and no filler, each built only from facts he gave:
- 📖 **reads**: a pixel bookshelf with three spines (The Alchemist, The Subtle Art…, To Kill a
  Mockingbird)
- ✒️ **writes**: poetry and short stories, in the editorial serif, with *"the notebook stays
  private for now — ask me for one."* and a slot for real excerpts
- 🎸 **guitar & music**: a pixel Strat; click the strings to strum a real chord (WebAudio, silent
  until interaction)
- 🎮 **games**: a pixel clamshell DS that flips open to a dialog box. He's been a Poké-nerd since
  the DS days. No invented favourites list.
- 📺 **anime**: Violet Evergarden, Vinland Saga and JJK, each with one line on why, and the tape
  the full 83-title log below (deduped and title-cased from his list)
- ✈️ **wander**: *"difficult roads truly lead to beautiful places."*, which jumps to the gallery

**6 · viva la vida. (the pictures).** *Verified on gallery-play.be:* a big headline builds line by
line with a blur-in, then a **3D ring of photo cards** assembles on scroll. There are 12 columns of
3 cards spaced around a cylinder (`perspective ≈ 1760px`, `preserve-3d`), and the whole ring is
tilted about 5° on Z. Each card has a small caption in its corner. The ring rotates with scroll and
can be dragged with inertia, and hovering a card shows a "view" overlay. Built with GSAP
ScrollTrigger + Draggable + Inertia over a faint map texture.
My version:
- The headline is *"difficult roads lead to beautiful places."*
- The ring sits on navy with faint pixel stars, and each card has a typewriter caption (*spiti
  valley · jul '26*, *hack-n-win · 1st / 450*).
- Cards are B&W at rest and bloom to colour on hover. Clicking a card opens it full-size with its
  caption.
- Implemented in plain CSS 3D + a small JS rotation/drag/inertia loop, no GSAP needed.
- Mobile gets a smaller-radius ring plus swipe.
- **Content, per his direction ("latest carousels + some good ones, no old images"):** the Spiti
  (Jul 2026) and Dharamshala (May 2026) carousels, one Oct 2025 shot, the Hack-n-Win and MediThon
  photos from LinkedIn, the CTLC reel win, a Tulips.edu screenshot, and **original pixel-art cards
  drawn live on canvas** (moon + plane, space whale, the night walk) to fill out the ring. Nothing
  from 2024.

**7 · Stack: "moves learned".** Compact pixel badges in four groups (Core, AI/ML, Backend & Cloud,
Data), each group styled like a move list (a `TYPE` chip + name). Readable in 3 seconds, no logo
soup.

**8 · Get in touch.** *Verified on legencymedia.com:* a "Get in touch" arrow-bubble button is
**always visible** in the fixed nav and repeats at the end of each section. The contact page is a
**3-step guided form** ("Step 1 of 3": 01 your details, 02 your project, 03 timing), where step 2 is
**clickable chips** ("What kind of support do you need?") instead of typing, with a "Prefer a
conversation?" escape hatch.
My version:
- The fixed nav holds a pixel arrow-bubble **Get in touch** button that opens a side panel from
  anywhere.
- Three steps in the dialog-box style: **01** name + email → **02** chips (*internship / full-time
  role · build something together · research collab · hackathon team · talk books, anime or guitar ·
  just saying hi*) → **03** an optional note, then send.
- Beside the form, the direct routes exactly as they are today: email (tap to copy),
  GitHub, LinkedIn.
- The section closes on a huge serif line: *let's build something that survives.*
- Success and failure feedback arrive in the dialog box: *"Your message was sent! SWAPNEEL will
  reply soon. ▼"*
- **Keep all the existing plumbing untouched**: `POST /api/messages` (DB + Telegram ping), the
  EmailJS auto-reply (same service/template/params `from_name`, `reply_to`, `message`; the chips and
  the note are composed into `message`), the honeypot, and the hidden owner inbox opened by clicking
  his name in the footer.

**Footer.** No motto line. © 2026 Swapneel Premchand (the admin trigger) ·
Mohali · a tiny walking pixel figure.

## Easter egg: Domain Expansion

Type `domain` anywhere (or use the Konami code). The UI freezes, a dialog box reads
*"Domain Expansion…"*, and the whole screen collapses into an original pixel **infinite void**:
`--infinity` blue and violet rings spiralling into a black centre, stars streaming inward and the
site's text scattering. After ~3 s, the line *"throughout the night, I alone keep prod up."*
appears, and everything snaps back. Same reduced-motion rule: under reduced motion it's a static
frame plus the line.

## Motion rules

- The night moves slowly. The UI moves crisply: 200–400 ms, ease-out, no bounce except pixel pops.
- Scroll reveals: text rises with a slight blur-in, and tape strips "slap" on with a 2° overshoot.
- **Pixel cursor** replaces the amber particle trail: a small pixel arrow that leaves a short trail
  of ember/cream star dust, turns into a hand over links and is disabled on touch.
- `prefers-reduced-motion`: the hero renders one still frame, and reveals and trails are off.
- The canvas pauses when it's offscreen or the tab is hidden.

## Engineering constraints

- **Stay static**: HTML/CSS/vanilla JS, no build step, so the current Vercel setup (static root +
  `api/index.py` FastAPI function) keeps working unchanged.
- Split into `index.html`, `assets/css/site.css` and `assets/js/{hero,gallery,inventory,contact,
  admin,cursor}.js`, with photos in `assets/photos/` (WebP, 2 sizes, lazy-loaded, fixed aspect boxes
  so there's no layout shift).
- External scripts only from cdnjs / jsdelivr (GSAP if needed, EmailJS already there).
- Budget: first paint <1.5 s on 4G, hero JS <25 KB, and no video files.
- Mobile at 375 px is designed, not squeezed: the hero recomposes (figure centred, tapes stacked),
  the gallery swipes and the inventory becomes a 3-column grid.
- Accessibility: real text (never text baked into the canvas), AA contrast over the scene,
  keyboard-operable gallery/inventory/demo and alt text on every photo.

## What "legendary" means here (the acceptance test)

1. In the first 5 seconds someone says "oh, that's cool" *and* knows he's an engineer.
2. Nothing looks like a template. The collage + pixel + editorial mix is his alone.
3. Every playful element also proves craft (the guitar actually plays, the servers actually fail).
4. It takes one tap to reach him from anywhere.
5. It still looks deliberate on a phone and with motion turned off.
