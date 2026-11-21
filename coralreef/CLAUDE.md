# Coral Reef Sale Page (CoralReefSale*.html, ccr-img/) — rules for every edit

Owner chat: "Coral Reef Sale Page". Other chats: leave a row in the ThB.Ho Update Log instead of editing here.

## Build
- `git pull origin main` before any work; confirm nothing is left unpushed when done.
- `CoralReefSale-v2.html` (live: https://thbho.com/CoralReefSale-v2.html) is the source of truth: edit it directly.
  Don't rebuild it from older local build pipelines (they predate analytics, domain and price-list changes).
- `CoralReefSale.html` (v1) is a separate Claude artifact, not in this repo.
- Shared engine `hai/` belongs to the Core chat; don't edit it. Keep `hai/destiny.js?v=` at the newest number
  the Core chat announces (20261119d as of 19 Nov 2026).
- Test desktop + mobile (no page errors, no broken images, no horizontal overflow) before every push.

## Content
- Coral Reef = condo, sale only, one location (Jomtien), under construction (handover Q4 2570). The page is a
  sales tool for sales staff and agents, not the official project site; keep the "PAGE UNDER DEVELOPMENT · DRAFT01" bar
  and noindex until Thor says otherwise.
- Every number comes from a source (price list, Sales Kit, Drive); never guess. Price list in use: 10 Nov 2026 (450 units).
- No rental-yield promises, no competitor names, no "ปลอดภัย 100%", no buyer personal data.
- Links, og:image and canonical use https://thbho.com/ only; never delete CNAME.
- LINE contact = tappable "send a message" button, never a QR on the page.
- Brand footer (real estate work): WIDEROOMS house logo + link https://thbho.com/EngWiderooms.html, and the th.ho logo +
  link to Hybrid AI by ThB.Ho https://thbho.com/AIGymmateXFactory.html (logos in ccr-img/brand/).

## Photos
- Show-unit photos live in `ccr-img/show/{prefix}-{n}.jpg`, 1400×1050 (4:3), listed in `SHOW` in the page:
  `kit: [prefix, photo order, label, (optional) numbers whose window view is simulated]`. First in the order = card cover.
- Retouching may change light and colour only; structure and furniture stay as in the real photo.
- A photo whose window view was replaced keeps a burned-in "ภาพจำลองวิว · Simulated view" badge (top-left, so the
  gallery caption doesn't cover it) and is listed in the 4th SHOW element (caption key `v2.gSim`); keep the real
  garden-view original in the gallery as reference.
- Old photos stay in the gallery after the new ones as reference until Thor picks which to delete.
- Renders and AI images are labelled "ภาพจำลอง". AI images go through the thbho-visual-qa skill.
- Hero slides: 16:9, main subject on the right (left side holds the darkened text area).

## Sales documents
- Ads, quotations, proposals, executive summaries and other sales documents: run the thbho-fortune-check skill before
  delivery. The Coral Reef sales team has no Match Profile yet, so match on Thor's chart only.
- Share cards (og:image) carry only the Copacabana Coral Reef logo (skill thbho-share-card).
- Save the latest version of every work document to Thor's Drive work folder; move a replaced version to "เก่า".
  Documents being sent to someone: one Drive folder per recipient/send, files numbered, plus a Google Calendar entry.
- Sales/commission figures per person are sensitive: managers and accounting only.
