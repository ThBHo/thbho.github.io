# R2 by Clare (agents/r2/) — rules for every edit

Owner chat: "Riviera by Clare Resale Webpage". Other chats: leave a row in the ThB.Ho Update Log instead of editing here.

## Build
- `git pull origin main` before any work and before `python3 agents/r2/build.py`; confirm nothing is left unpushed.
- Never edit `Riviera2Resale*.html` directly: edit `data.js`, `text.js`, `app.js`, `r2.css`, `shell.html`, `contact.js`,
  bump `"version"` in `pages.json`, then run build.py (it also writes `feed.json` for co-selling members).
- `Riviera2Resale-8A05.html` is frozen (booked unit); don't touch it.
- Shared engine `hai/` belongs to the Core chat; don't edit it. `NetworkRegistry.html` may be edited from this chat.
- Keep `hai/destiny.js?v=` at the newest number the Core chat announces.

## Content
- Links, og:image and canonical use https://thbho.com/ only; never delete CNAME.
- Unit pages (`Riviera2Resale-<CODE>.html`) are shared by every agent: no Clare sales phone, LINE, e-mail or office
  address anywhere in them. Sales contacts live only in `contact.js`, which build.py adds to pages without `UNIT_PAGE`.
  The quotation shows the name and number of whoever prints it (typed in the quote dialog).
- Describe the units as "resale units of Clare Pattaya Property"; never say Clare bought units to resell.
- No link between the ASN site and R2. In Clare documents, never name ASN: say "agent พันธมิตร".
- Brand links: real estate work, so the WIDEROOMS link (https://thbho.com/EngWiderooms.html) goes with the
  Hybrid AI by ThB.Ho link (https://thbho.com/AIGymmateXFactory.html).
- No price or the word "free" for future phases of the back-office tools unless Thor confirmed it.
- Ads, quotations, proposals and sales documents: run the thbho-fortune-check skill before delivery
  (Clare's team has no Match Profile yet, so match on Thor's chart only).
- Share cards (og:image) for R2 carry only Clare Pattaya Property's logo (skill thbho-share-card).

## Share cards (og:image)
- One 1200×630 card per page in `riviera-img/og/og-<CODE|main|matching|destiny>.jpg`, Clare logo only, gold price label.
- The label shows the selling price, so re-make the cards when prices or units change:
  `cd agents/r2/og-card && python3 make.py` (Playwright; paths inside point at /home/claude — adjust), copy `out/*.jpg`
  to `riviera-img/og/`, bump `?v=` on og:image/twitter:image in pages.json, run build.py.
- Quotation print keeps the gold rule under the header and above the total (fortune check, 21 Nov 2026).

## Fortune check (team chart, 21 Nov 2026)
- Customer-facing R2 work follows the charts of Thor (page admin) and the main sellers Koy and Kung.
  Team brief: Drive › ThB.Ho (Main) › AI Personalized Matching › 02 Match Briefs › Partners & Agents.
- Palette: warm ivory base (Earth), coral prices (Fire), teal/green buttons (Wood), gold in every piece;
  no navy/black-dominant surfaces (dark mode is warm charcoal). Never print anyone's chart or MBTI on the site.
- `MONTH_ACCENT` in app.js sets `--month` (the gold→month strip under the top bar) per Chinese solar month.
  The scheduled task "R2 ดวงรายเดือน" (25th of each month, 12:25) extends and checks it.

## Phone app (PWA, 21 Nov 2026)
- `agents/r2/app/` (manifest + icons) and `agents/r2/app-tabs.js` (HAI_APP tabs/screens); build.py adds them only to the
  main, matching and destiny pages. Unit pages never get the app (shared by every agent).
- Shared files `hai/pwa.js` and `/hai-sw.js` belong to Core: don't edit. The home sections sit in `<div id="homeView">`
  so the app can show one screen per tab (sections are hidden, never removed).
- Tabs: หน้าแรก #/ · ค้นหาห้อง #/units · ที่บันทึก (shortlist, `R2App.showSaved`) · ติดต่อ #/contact · more: #/about, #matching, #destiny.

## Shared with every AI (23 Nov 2026)
- Unit sheet "R2 by Clare · รายการยูนิต" (folder "สำหรับ AI ทุกตัว"):
  https://docs.google.com/spreadsheets/d/1kYpA3rY8QueVBpBP0F8uo6tDyHSuuqTXK_yKfYob5xA/edit — owned by this chat.
  Whenever a price, promo, status or hidden unit changes in data.js, update its Units tab and the "ข้อมูล ณ" date.
- Every change: one dated line with links in "00 Sync Index"
  (https://docs.google.com/document/d/1DtoOBMIyFJSdR26Z4d86jAV76I1dv99aIwg5pDeBcfg/edit) + a row in the Update Log.
- Birth data lives only in the Match Profiles sheet; never in docs, calendar, index lines or this repo.
- Documents for Koy and Kung: cream/white base + gold, burgundy only as small accents (no black-red).
