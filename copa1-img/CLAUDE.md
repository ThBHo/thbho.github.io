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

## Look
- Palette from Thor's chart (Nov–Dec 2026): ivory/cream base, burgundy headings, gold accents, deep teal for closing buttons.
- Real photos first (Drive COPA1 (Webpage) and COPA1 photo folders); AI images only after the thbho-visual-qa skill.
- Hero slides 16:9, main subject on the side away from the text (text sits bottom-left on this page).
- Share card `og/Copa1BeachJomtien.jpg`: warm cream R2-style card (template agents/r2/og-card/card.html), Copacabana logo only.
