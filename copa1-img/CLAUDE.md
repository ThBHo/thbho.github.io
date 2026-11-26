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

## Look
- Dec 2026 chart check (Thor's reading for Dec 2569, Google Doc 1OgS5TLj-SGcSMhL-DTbQpf-PC4LAu2jFSVx35UZ86Yw): dark surfaces need gold +
  burgundy or cream; no light-blue/aqua as a large background (hero keeps warm slides h1, h4, h2; aqua-heavy h3/h5 left out);
  closing buttons deep teal (LINE button is teal with a small LINE-green dot, no neon green); real photos before prices; warm tone,
  no price-war wording; launch day/time from the reading's best days (currently 14 Dec 19:00–21:00, backup 12 Dec 19:00–21:00).
- Palette from Thor's chart (Nov–Dec 2026): ivory/cream base, burgundy headings, gold accents, deep teal for closing buttons.
- Real photos first (Drive COPA1 (Webpage) and COPA1 photo folders); AI images only after the thbho-visual-qa skill.
- Hero slides 16:9, main subject on the side away from the text (text sits bottom-left on this page).
- Share card `og/Copa1BeachJomtien.jpg`: warm cream R2-style card (template agents/r2/og-card/card.html), Copacabana logo only.
