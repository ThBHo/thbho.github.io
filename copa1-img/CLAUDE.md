# Copacabana Beach Jomtien page (Copa1BeachJomtien.html, copa1-img/) — rules for every edit

Owner chat: "COPA1 Beach Jomtien Webpage". Other chats: leave a row in the ThB.Ho Update Log instead of editing here.

## Build
- `git pull origin main` before any work; confirm nothing is left unpushed when done.
- Live: https://thbho.com/Copa1BeachJomtien.html. Links, og:image and canonical use https://thbho.com/ only; never delete CNAME;
  never put this page on creators.thbho.com.
- `CoralReefSale-v2.html` and `ccr-img/` belong to the Coral Reef chat: read only (the page links to it and reuses
  `ccr-img/hero-2026-10-22.jpg` for the Coral Reef card).
- Test desktop + mobile (no page errors, no broken images, no horizontal overflow) before every push.

## Content
- Copa1 = Copacabana Group's first project, finished and ready to move in; three groups: from developer (`dev`), `resale`, `rent`.
  Keep the "PAGE UNDER DEVELOPMENT · DRAFT01" bar and noindex until Thor says otherwise.
- Units live in `UNITS` in the page (fields documented above it). Every price, rent and yield comes from Thor's latest list;
  never guess. Developer units = cells with a visible price in the developer price list PDF in Drive COPA1 (Webpage)
  (coloured cells = sold; red price = Thai quota, blue = foreign quota; id = letter + floor + stack no. (A2 on floor 44 = A4402, same code as the rental team), sqm = price ÷ price/sqm).
  Current list: 24 Nov 2026, 89 units; it also states sinking fund 500 THB/sqm once and maintenance 50 THB/sqm, 12 months ahead. The old 2566 Sales Kit is used only for building facts and unit types, marked "รอยืนยัน".
- Rent units are NOT in the page: they load from `copa1-img/rent-units.json`, built by `copa1-img/build_rent.py` from the rental
  team's "Daily Updated Units & Rentout.xlsx" (Drive id 1R7noilOQjL_2oKfxMnoee2JeqSYKMx04, tab "Price list"; achieved-rent
  medians from tab "Rent Out Units"). Status Available → avail, Future Available → soon (+ free-from date). "Yearly Rates" =
  per month on a 1-year contract (rentYM). Public fields only: the workbook and the Owner Master hold owner names, phones,
  emails, bank accounts, deposits, owner rates and remarks — never commit them; this repo is public. `?m=rent` opens the rent tab.
  The rental back office (contracts, owner payments, bookings) belongs to the chat "COPA1 Rental Backend", not this one.
- Investor section shows only confirmed actual rents; the calculator is an estimate from the visitor's own inputs. No guaranteed returns.
- Phone number: not shown until Thor confirms it. LINE = tappable oaMessage button (@copacabanajomtien), never a QR.
- Hero video: set `HERO_VIDEO` to a compressed clip in `copa1-img/hero/` (source: Drive COPA1 (Webpage) › Copa1ReadyToMoveIn001.mp4).
- Brand footer: WIDEROOMS logo + https://thbho.com/EngWiderooms.html and th.ho logo + https://thbho.com/AIGymmateXFactory.html.

## Plans
- `copa1-img/floor/f-<floor>.jpg` (54 floors, 6–59, incl. 12A and 53A; no floor 13 or 54) and `copa1-img/plan/type-<1..15>.jpg`
  come from the developer Sales Kit (Feb 2021, preliminary) — always captioned "for reference". Unit → kit type in `kitType()`;
  E-stack 80 sqm pool units (type 16) have no plan page. Labels on the plans are raster, so units are not auto-highlighted:
  the caption tells the visitor which label to look for.
- Position plate (unit sheet, card button "ตำแหน่ง & แปลน") and the "ผังห้องตามชั้น" tower follow the R2 page. `FS` in the page lists
  which stacks exist on each floor, read by eye from every Sales Kit floor plan (25 Nov 2026); `plateCells()` places them
  (A block at the beach end; B01–B09, C01–C10 top row = Pattaya side; E06–E01, D09–D01 bottom row = Jomtien side).
  Every listed unit must sit on a stack in `FS` for its floor — check this after each price-list or rent-feed change.
- `copa1-img/plan3d/t01..t14.jpg, t15a/t15b/t16a/t16b.jpg` = semi-3D unit plans (Hybrid AI, Flow NB2.1 + number/structure fixes,
  drawn from the Rev.13 plans in `plan13/`), approved by Thor 26 Nov 2026 and shown first in the unit sheet and lightbox
  (`plan3d()`; label "Hybrid AI image"). Pool units: B stack = Type 15 (t15a FL ≤35, t15b FL 37–57), E stack = Type 16
  (t16a FL 8–24, 30, 32; t16b FL 26, 28, 34–56). Masters and originals: Drive "Unit Plan (AI Upgraded)" 162BTMRD-ADQNo62eYMNzHRGA5yfxLiss.
- `copa1-img/plan/r-*.jpg` = newer plan cards from the rental team (Drive folder 13YVUCpTc7XsyNaXiqWQxBbrT_1fOxKor), shown first.
- Real unit photos per rent unit live in that same Drive folder (one folder per unit code); not on the page yet.

## Unit pages (26 Nov 2026, Thor: "หน้าละห้อง" in the ASN layout)
- Every unit has its own page `Copa1BeachJomtien.html#/u/<CODE>` (`renderUnit()`): ASN layout — back link, tags, title,
  photo mosaic (sample-room photos + 3D plan + facilities, with the "sample room / Hybrid AI" note), then two columns:
  highlights, details grid, position plate + floor bar, plans, location | sticky price card (sale and/or rent, LINE ask, share, 3D plan);
  "similar units" at the bottom. Card photo/title and the unit sheet button "เปิดหน้าห้องนี้" open it.
- Share links: `copa1/u/<CODE>.html` (noindex stub with og tags → redirects to the page) + card `copa1-img/og/u-<CODE>.jpg`
  (warm cream card, template `copa1-img/og-card/card.html`, Copacabana logo only, gold price label).
  Re-run `python3 copa1-img/build_units.py` after every price-list change and every `build_rent.py` run; it rewrites stubs and
  only re-renders cards whose label/photo changed. Old stubs are kept so shared links never break (page shows "not in the list").
- No owner data and no phone number on unit pages; prices come only from UNITS / rent-units.json.
- Next: real photos per rent unit (Drive folder 13YVUCpTc7XsyNaXiqWQxBbrT_1fOxKor) should replace the sample photos once added.

## Look
- Dec 2026 chart check (Thor's reading for Dec 2569, Google Doc 1OgS5TLj-SGcSMhL-DTbQpf-PC4LAu2jFSVx35UZ86Yw): dark surfaces need gold +
  burgundy or cream; no light-blue/aqua as a large background (hero keeps warm slides h1, h4, h2; aqua-heavy h3/h5 left out);
  closing buttons deep teal (LINE button is teal with a small LINE-green dot, no neon green); real photos before prices; warm tone,
  no price-war wording; launch day/time from the reading's best days (currently 14 Dec 19:00–21:00, backup 12 Dec 19:00–21:00).
- Palette from Thor's chart (Nov–Dec 2026): ivory/cream base, burgundy headings, gold accents, deep teal for closing buttons.
- Real photos first (Drive COPA1 (Webpage) and COPA1 photo folders); AI images only after the thbho-visual-qa skill.
- Hero slides 16:9, main subject on the side away from the text (text sits bottom-left on this page).
- Share card `og/Copa1BeachJomtien.jpg`: warm cream R2-style card (template agents/r2/og-card/card.html), Copacabana logo only.

## Featured units + real photos (26 Nov 2026)
- `copa1-img/units/units.json`: `units[CODE] = {n, src?, srcFloor?, pos?}` → photos `copa1-img/units/<CODE>/01..NN.jpg` (01 = show photo; `pos` = object-position for the card crop). `featured.dev` / `featured.rent` = 6 + 6 codes shown in `#picks`.
- Sale units without their own photos use real photos of the same layout in the same stack on a LOWER floor (`src`), labelled on card + unit page. Never use a higher-floor source (view would overstate).
- Photos: originals copied to Drive "COPA1 (Webpage)/Unit Photos · ภาพจริงห้องแนะนำ (สำหรับเว็บ)" (1xjdkUeO1kMNq357OzA99QCmCPkjpIyOL); web set = gentle Python grade (/tmp grade: gray-world 40%, shadow lift, mild contrast, slight warmth), 1600px q82. AI (Flow) edits only go live after QA + Thor's OK in Drive.
- Facilities: `copa1-img/fac/<key>-N.jpg` (f59, f40, g, garden, lobby, sauna) from Drive "COPA Facilities"; `FACS` in the page holds floor + x (0 = A/beach end … 1 = C10/D01 end); every unit page appends the first photo of the 3 nearest facilities (`nearFac`).
- build_units.py uses `units/<CODE>/01.jpg` for the share card when it exists.

## Hybrid AI unit photos (26 Nov 2026, approved by Thor)
- Thor's rule for condo photo edits: about half of each unit's photos are new camera angles (structure and furniture unchanged), light changed to the most beautiful morning/evening golden hour.
- units.json `ai: [indices]` = photos that are Hybrid AI (Google Flow, Nano Banana 2.1); the page tags them "Hybrid AI · มุมใหม่/แสงเย็น". Originals + all AI versions stay in Drive › COPA1 (Webpage) › Unit Photos › <unit> › "AI มุมใหม่ + แสงเย็น…".
- Hero = 7 slides; h9 is a Hybrid AI golden-hour relight (tagged on the slide).
- Still to do: A3404, E4204 (new angles), more for B3901, B4508, D3403, C5501, D4609 — Flow flagged "unusual activity" when jobs were sent quickly; go slowly.
- QA rule from Thor (26 Nov): furniture in a new-angle image must sit where the unit plan puts it (e.g. dining table never opposite the sofa when the plan has it by the kitchen). Rejected and reverted to real photos: A4202-07, D4609-05, D4609-10, D3403-04, C5501-04.

## Lucky numbers (Thor, 26 Nov 2026 · central guide https://docs.google.com/document/d/1XAm63oj69YPruBK0X9h_nbWXZ0psOnQUiA-zBXbKop0/edit)
- Main 2·7·9, second 8·0·3, avoid 5. COPA1 is Draft01 so applied now: hero 7 slides, 7 s per slide; unit list pages 27; picks link 9; unit page mosaic 7 tiles; room photos per unit 9 via units.json `pick` (B4508 7; E4204 6 → needs 1 more). Filter buckets stay as they were (Thor, 26 Nov: COPA1 is not his own project, so lucky numbers are applied lightly here; featured units stay 6 per side, 3D plan stays 1 per type).
- Never change real data: unit prices, rents, unit counts, sizes. WIDEROOMS service packages (decor / rental management) follow the guide's price rules if they appear here.

## Unit tools (Thor, 26 Nov 2026 — same idea as the R2 unit pages)
- Every unit page (#/u/<code>) has "พิมพ์ใบเสนอราคา" (A4 print / PDF: logo, ref, issue date, price-list basis, 3D plan + 2 photos with Hybrid AI tags, specs, sale/rent prices from the data only, notes, proposer name/tel typed by whoever prints, saved in localStorage copa1.quoteBy) and "สร้างโพสต์โซเชียล" (canvas post 4:5/1:1/9:16/16:9, platforms, 3 caption styles, TH/EN, price/QR/hashtag switches, Hybrid AI label drawn on AI photos, burgundy band + gold rule).
- No price-validity period or fees are printed (money terms need Thor). ?quote=1 on a unit link opens the quotation box.

## MBTI · feng shui · Personalized Matching · Destiny Match (Thor, 26 Nov 2026 — same engines as R2 / Coral Reef)
- Loads shared hai/destiny.js + hai/profile.js (do not edit those here; they belong to the Core chat). COPA1 feeds them through window.HAI_HOST and PF_HOST in the last <script> of Copa1BeachJomtien.html.
- persona(u): name, 3 highlights, 2 temperaments, 3 MBTI types, computed only from side (front ≈ W, pattaya ≈ N, jomtien ≈ S — APPROXIMATE, from the floor-plate labels; confirm with a compass before calling it exact), floor band (<16 low, <36 mid, <50 high, else top), type (J = jacuzzi, P = private pool, 2BRJ = 2 beds) and price/sqm vs the same type.
- Unit page: "บุคลิกของห้อง · MBTI" + "ฮวงจุ้ย" (facing, Bagua element, sun, decor tones) + Destiny CTA. Cards: MBTI chips. Home section #match (HAIP panel + Destiny card), nav "MBTI · ดวง", views #/match and #/destiny[/CODE].
- Birth data is computed in the browser only; the client profile is the shared localStorage "hai-profile".
