# Hybrid AI Agent Network: site engine and agent playbook

ภาษาไทยสั้นๆ: โฟลเดอร์ `hai/` คือระบบกลางที่ทุก agent ในเครือข่ายใช้ร่วมกัน (หน้าทรัพย์ ค้นหา แผนที่ จับคู่ MBTI ฮวงจุ้ย Destiny Match ใบปลิว แชร์ 6 ภาษา)
แต่ละ agent มีโฟลเดอร์ของตัวเองใน `agents/<id>/` (ข้อมูลติดต่อ Sheet ทรัพย์ ข้อความแบรนด์) และหน้าเว็บของตัวเอง 1 ไฟล์
แก้ระบบกลางที่ `hai/` ครั้งเดียว ทุก agent ได้ของใหม่พร้อมกัน ห้ามแก้ข้อมูลของ agent หนึ่งในไฟล์ของอีกรายเด็ดขาด

Owner: THOR · [WIDEROOMS](https://thbho.github.io/EngWiderooms.html) · [Hybrid AI by ThB.Ho](https://thbho.github.io/AIGymmateXFactory.html)
First agent: ASN Exclusive Property (Pattaya), `ASNProperty.html` + `agents/asn/`. Split from one file on 3 Nov 2026 with identical output (12 routes × 4 languages compared).

## Files and load order

A page shell (e.g. `ASNProperty.html`) holds the agent's `<head>` (title, og tags, favicon) and body markup, then loads, in this order:

| # | File | Shared? | What it holds |
|---|---|---|---|
| 1 | `hai/engine.css` | shared | all styles; `:root` holds the network default palette (teal + brass) and the fixed `--key-*` colours |
| 1b | `agents/<id>/theme.css` | agent | the agent's palette: overrides `:root` (light + both dark blocks) and `--key-*` |
| 2 | `insight/kit.js`, `hai/destiny.js` | shared | Living Insight kit, Destiny Match (`asn-destiny.js` is now a stub that loads `hai/destiny.js` for old cached shells; shared art in `hai/img/destiny-*.jpg`) |
| 3 | `agents/<id>/config.js` | agent | `SHEET_CSV`, `UPDATED`, `CONTACT` (incl. `facebookName`), `ZONES` (approximate zone centres), `LISTINGS` snapshot, `REVIEWS`, `SLIDES`, `FEATURED`, `TOP_PICKS`, `SITE`, `PROJECTS` |
| 4 | `agents/<id>/brand-text.js` | agent | `BRAND_T`: sentences that name the agent, per language (keys: aboutP, fsNote, pmText, ldSellP, copyIp, szPending, szProps, wechatScan) |
| 5 | `hai/i18n.js` | shared | `T`: interface text in th en ru zh ko ja; merges `BRAND_T` |
| 6 | `hai/regions/<region>.js` | shared per region | zone names, Safe Zone reports with sources, land zone overviews, `UTP_ZONE` (airport drive per zone), `SL_TX` (Safe Living link text) (`pattaya-eec.js` covers Pattaya, Bang Lamung, Sattahip) |
| 7 | `agents/<id>/listing-data.js` | agent | `HOME_STYLE` (house persona per listing), `LAND_FENG` (land feng shui per plot), `UTP` (airport drive per listing, optional), `FACING` (compass-confirmed facing, optional) |
| 8 | `hai/engine.js` | shared | the app: state, rendering, matching, feng shui, flyers, sharing, routing |

All files are classic scripts sharing one global scope, so the order matters: data before engine. Bump the `?v=` query on every changed file so phones fetch the new version.

## SITE (in `agents/<id>/config.js`)

```js
const SITE = {
  id: "asn",                 // share pages <id>/CODE.html, storage keys "<id>-…", search alias "<id>-CODE"
  name: "ASN Exclusive Property",
  short: "ASN", tag: "EXCLUSIVE PROPERTY",   // flyer brand block
  img: "asn-img/",           // photos <img><CODE>-<n>.jpg and logos (logo-widerooms.jpg, logo-emblem.png)
  share: "asn/",             // LINE/Facebook share pages with og:image per listing
  store: "asn-",
  styleJson: "asn-style.json", hlJson: "asn-hl.json",
  emblem: "asn-img/logo-emblem.png", matchHero: "asn-img/H14-4.jpg",
  safeLiving: "ASNSafeLiving.html",
  showAll: true,
  ref: "ASN",                // optional: public listing prefix "ASN-H96" (default: short)
  why: ["100+", "6", "1:1"], // About stats
  tags: { base: "#Pattaya …", condo: "#PattayaCondo", commercial: "…", house: "…", brand: "#ASNExclusiveProperty" } // social caption
};
const PROJECTS = [[/riviera/i, "The Riviera Jomtien"], [/prime habitat/i, "Prime Habitat"]]; // project name replaces the zone in a title
```

Everything optional degrades quietly: no `PROJECTS` → zone in titles; no `UTP`/`UTP_ZONE` → no airport line; no `tags` → no hashtags; no `FACING` → facing read from the Sheet/persona; no `theme.css` → network palette.

## Colours

- Theme tokens (`--bg`, `--brand`, `--accent`, …) change between light and dark.
- Key tokens (`--key-brand`, `--key-deep`, `--key-night`, `--key-accent`, `--key-hot`, `--key-gold`, `--key-gold-soft`, `--key-on-dark`, `--key-on-dark-2`) stay the same in both modes. They colour the hero, the matching panel, print flyers, the social image and map circles. The engine reads them in JS with `KEY(name, fallback)`.
- Never hard-code a brand colour in `hai/`; add a key token instead.

## Data: one Google Sheet pair per agent

- Private back-office sheet (agent + Thor only). Edit tab, one row per property. Tab `Listings` = FILTER of rows with column A = "Y" and at least one photo. Column X (photos) is an ARRAYFORMULA from column Y: never write column X.
- Public read-only sheet: `Listings!A1 = IMPORTRANGE(<private>, "Listings!A1:AF")`. Only this one is published; `SHEET_CSV` points here. Private columns (owner, phone, commission, lowest price, exact pin, facing notes) must stay outside the imported range.
- Active Y/N is how a listing goes on or off the site; the row stays as history.
- Photos: Google Drive, one folder per listing, three sub-folders (selected originals / retouched for web / original backup). Folder colour: green = 20 originals in, pink = live on web.

## Privacy rules (every agent, every page)

Never show: full address or house number, village/project name where agents "เจาะทรัพย์" (ASN's rule for resale houses), owner name or phone, commission, lowest negotiable price, exact map pin. Map shows zone centres only. Pins and compass facing live in the back office for the AI (feng shui, sun direction). No deed images. Destiny Match computes in the browser and stores no birth data.

## Photos and facing

- Up to 30 photos per listing; covers: houses whole-house or aerial in morning/evening light, condos the full living room.
- AI retouch keeps the real structure 100%; drop any result that adds or removes walls, windows, pools or neighbours. Label AI images.
- When visiting: stand in the middle of the house or plot, point a compass at the front road, note the degrees, and drop a Google Maps pin (back office only).

## Adding a new agent (checklist)

1. Pick `id` (short, lowercase) and collect: company names (TH/EN), contacts (phones, LINE, WhatsApp, WeChat QR, Telegram, email, Facebook), logo files, brand colours, languages, zones they cover.
2. Create the private + public Sheet pair (copy the ASN structure), share the public one "anyone with the link can view".
3. Create `agents/<id>/config.js`, `brand-text.js`, `listing-data.js` (can start with `const HOME_STYLE = {}; const LAND_FENG = {};`).
4. Create `<id>-img/` with logos and listing photos `<CODE>-<n>.jpg`, and `<id>/` share pages.
5. Copy the page shell, change `<head>` (title, description, og:image 1200×630, favicon) and the agent-specific body text, point the script tags at `agents/<id>/`.
6. If the agent is outside Pattaya/EEC, add `hai/regions/<region>.js` with zone names and sourced Safe Zone reports.
7. Brand links: every page and PDF links WIDEROOMS and Hybrid AI by ThB.Ho (footer credit).
8. Test: every route (#/, #/l/CODE, #/zone/…, #/matching, #/book, #/land, #/destiny, #/about) in all languages, desktop and phone, light and dark, no console errors.
9. When the agent gets its own domain, move it to its own repository and leave redirect pages here so old links keep working.

## Generalised on 3 Nov 2026 (core chat)

`PROJECT_OF`, `UTP`/`UTP_ZONE`, the "ASN-" code prefix, the Facebook page label, About stats, social hashtags and image text, Safe Living link text, matching-guide brand name, CSS brand colours and Destiny Match (file, text, facing, art) all moved out of the shared files. ASN regression: 13 routes × 6 languages (DOM + share text, title rules, airport lines, booking/land messages), computed styles and screenshots in light and dark, Destiny results in 6 languages: identical. A dummy second agent with no ASN extras renders every route with no errors.

## Still agent- or region-flavoured (fine for now, check before a non-Pattaya agent)

- Page shell body (logo text, hero, about box, WeChat file name) is agent-owned by design: copy `ASNProperty.html` and edit those spots.
- `MATCHING_GUIDE` (engine) has one Pattaya example sentence ("Pattaya has both, from Jomtien beachfront…"): move to the region file when the Bangkok region is added.
- `hai/regions/pattaya-eec.js` holds ASN's own on-site land checks ("plots ASN is selling" in the Sattahip Safe Zone note); a second Pattaya agent needs these split per agent.
- `TOP_PICKS` sets the order of the list; with `SITE.showAll: true` (ASN since 3 Nov 2026) every active listing is shown after the picks, Sattahip and land last, sub-plots folded under their parent. Without `showAll` only the picks are shown.
