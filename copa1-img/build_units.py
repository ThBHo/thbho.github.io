#!/usr/bin/env python3
"""Build one share page per Copa1 unit: copa1/u/<CODE>.html (+ share card copa1-img/og/u-<CODE>.jpg).

The unit page itself is Copa1BeachJomtien.html#/u/<CODE> (rendered in the page). The files written here only carry the
link-preview tags (LINE / Facebook / X ignore #) and send visitors on to the page.

Run after every developer price-list change (UNITS in the page) and after build_rent.py:
    python3 copa1-img/build_units.py            # all units
    ONLY=C1709,D601 python3 copa1-img/build_units.py
Needs Playwright (Chromium) for the cards. Pages of units no longer listed are kept (they open the
"no longer in the list" view), so links already shared never break.
"""
import json, os, re, html, hashlib, asyncio

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(R, "Copa1BeachJomtien.html")
OUT_P, OUT_C = os.path.join(R, "copa1", "u"), os.path.join(R, "copa1-img", "og")
CARD = os.path.join(R, "copa1-img", "og-card", "card.html")
TYPE = {"1BR": "1 ห้องนอน", "1BRJ": "1 ห้องนอน + จากุซซี่", "2BRJ": "2 ห้องนอน + จากุซซี่", "1BRP": "1 ห้องนอน + สระส่วนตัว"}
TYPE_EN = {"1BR": "1 Bedroom", "1BRJ": "1 Bedroom + Jacuzzi", "2BRJ": "2 Bedrooms + Jacuzzi", "1BRP": "1 Bedroom + Private Pool"}
SIDE = {"front": "ด้านหน้าทะเล", "pattaya": "ฝั่งพัทยา", "jomtien": "ฝั่งจอมเทียน"}


def units():
    s = open(PAGE, encoding="utf-8").read()
    body = s[s.index("const UNITS = ["):]
    body = body[len("const UNITS = "):body.index("];") + 1]
    body = re.sub(r"(\{|,)\s*([a-zA-Z]+):", r'\1"\2":', body)
    U = json.loads(body)
    rent = json.load(open(os.path.join(R, "copa1-img", "rent-units.json"), encoding="utf-8")).get("units", [])
    by = {}
    for u in U + rent:
        by.setdefault(u["id"], []).append(u)
    return by


def photo(u):
    if os.path.exists(os.path.join(R, "copa1-img/units", u["id"], "01.jpg")): return "copa1-img/units/" + u["id"] + "/01.jpg"
    t, a = u.get("type"), u.get("sqm") or 0
    if t == "2BRJ": return "copa1-img/show/r72.jpg"
    if t == "1BRP": return "copa1-img/show/r80.jpg"
    if 44 <= a < 46: return "copa1-img/show/r45.jpg"
    return "copa1-img/show/s29-1.jpg" if a < 31 else "copa1-img/show/s35-1.jpg"


def mil(v):
    return f"{v/1e6:.2f}".rstrip("0").rstrip(".")


def info(code, rows):
    u = next((x for x in rows if x["grp"] != "rent"), rows[0])
    rent = next((x for x in rows if x["grp"] == "rent"), None)
    ty, ty_en = TYPE.get(u.get("type"), "ห้องชุด"), TYPE_EN.get(u.get("type"), "Condo")
    side = SIDE.get(u.get("side"), "")
    if u["grp"] != "rent" and u.get("price"):
        lab = f"ขาย ฿{mil(u['price'])} ล้าน" + (f" · {side}" if side else "")
        desc = f"{ty} · {u['sqm']:g} ตร.ม. · ชั้น {u['floor']} · ขาย {mil(u['price'])} ล้านบาท"
        desc_en = f"{ty_en} · {u['sqm']:g} sqm · floor {u['floor']} · sale ฿{mil(u['price'])}M"
    elif rent and rent.get("rentM"):
        lab = f"เช่า ฿{rent['rentM']:,}/เดือน"
        desc = f"{ty} · {u['sqm']:g} ตร.ม. · ชั้น {u['floor']} · เช่า {rent['rentM']:,} บาท/เดือน"
        desc_en = f"{ty_en} · {u['sqm']:g} sqm · floor {u['floor']} · rent ฿{rent['rentM']:,}/month"
    else:
        lab = "ทักไลน์สอบถาม"
        desc = f"{ty} · {u['sqm']:g} ตร.ม. · ชั้น {u['floor']}"
        desc_en = f"{ty_en} · {u['sqm']:g} sqm · floor {u['floor']}"
    title = f"{code} · {ty} {u['sqm']:g} ตร.ม. · Copacabana Beach Jomtien"
    sub = f"{u['sqm']:g} ตร.ม. · ชั้น {u['floor']}" + (f" · {side}" if side and "ขาย" not in lab else "") + "<br>Copacabana Beach Jomtien"
    return dict(u=u, lab=lab, tt=f"{code}<br>" + ty.replace(" + ", "<br><span style='font-size:40px'>+ ") + ("</span>" if " + " in ty else ""), sub=sub, title=title, desc=desc + " | " + desc_en, photo=photo(u))


def stub(code, I, v):
    e = html.escape
    url, img = f"https://thbho.com/copa1/u/{code}.html", f"https://thbho.com/copa1-img/og/u-{code}.jpg?v={v}"
    return f"""<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{e(I['title'])}</title>
<meta name="robots" content="noindex">
<meta name="description" content="{e(I['desc'])}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Copacabana Beach Jomtien">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{e(I['title'])}">
<meta property="og:description" content="{e(I['desc'])}">
<meta property="og:image" content="{img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(I['title'])}">
<meta name="twitter:description" content="{e(I['desc'])}">
<meta name="twitter:image" content="{img}">
<link rel="icon" type="image/png" href="https://thbho.com/copa1-img/logo-copa-group.png">
<script>location.replace("../../Copa1BeachJomtien.html" + location.search + "#/u/{code}");</script>
<style>body{{margin:0;font:16px/1.5 system-ui,sans-serif;background:#FFFCF7;color:#2B1D1A;display:grid;place-items:center;min-height:100vh}}a{{color:#0F6B66}}main{{max-width:520px;padding:16px;text-align:center}}img{{width:100%;border-radius:12px}}</style>
</head>
<body>
<main><img src="https://thbho.com/{I['photo']}" alt=""><h1>{e(I['title'])}</h1><p>{e(I['desc'])}</p><p><a href="../../Copa1BeachJomtien.html#/u/{code}">Copacabana Beach Jomtien → {code}</a></p></main>
</body>
</html>
"""


async def cards(jobs):
    from playwright.async_api import async_playwright
    from PIL import Image
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        pg = await b.new_page(viewport={"width": 1200, "height": 630})
        await pg.goto("file://" + CARD)
        for code, I in jobs:
            await pg.evaluate("([ph,lab,tt,s])=>{document.getElementById('ph').style.backgroundImage='url('+ph+')';"
                              "document.getElementById('lab').textContent=lab;document.getElementById('tt').innerHTML=tt;document.getElementById('s').innerHTML=s}",
                              ["file://" + os.path.join(R, I["photo"]), I["lab"], I["tt"], I["sub"]])
            await pg.evaluate("document.fonts.ready"); await pg.wait_for_timeout(80)
            tmp = os.path.join(OUT_C, f"u-{code}.png")
            await pg.screenshot(path=tmp)
            Image.open(tmp).convert("RGB").save(os.path.join(OUT_C, f"u-{code}.jpg"), quality=80, optimize=True, progressive=True)
            os.remove(tmp)
        await b.close()


def main():
    os.makedirs(OUT_P, exist_ok=True); os.makedirs(OUT_C, exist_ok=True)
    only = [x for x in os.environ.get("ONLY", "").split(",") if x]
    jobs = []
    for code, rows in sorted(units().items()):
        if only and code not in only: continue
        I = info(code, rows)
        v = hashlib.md5((I["lab"] + I["tt"] + I["sub"] + I["photo"]).encode()).hexdigest()[:6]
        p = os.path.join(OUT_P, f"{code}.html")
        old = open(p, encoding="utf-8").read() if os.path.exists(p) else ""
        if f"u-{code}.jpg?v={v}" not in old or not os.path.exists(os.path.join(OUT_C, f"u-{code}.jpg")):
            jobs.append((code, I))
        open(p, "w", encoding="utf-8").write(stub(code, I, v))
    asyncio.run(cards(jobs))
    print(f"pages: {len(units()) if not only else len(only)} · new/changed cards: {len(jobs)}")


if __name__ == "__main__":
    main()
