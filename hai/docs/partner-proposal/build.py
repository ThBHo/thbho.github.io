#!/usr/bin/env python3
"""Hybrid AI Agent Network · one-page A4 partner proposal (first contact: selling points and main functions, no prices).
Text: text.py (en th zh ko). Run from the repo root:
    python3 hai/docs/partner-proposal/build.py            # writes <lang>.html next to this file
    python3 hai/docs/partner-proposal/build.py --pdf DIR  # also prints Hybrid_AI_Agent_Network_Partner_Proposal_<LANG>.pdf into DIR
PDF printing needs a local server on the repo root at http://127.0.0.1:8765 and Playwright + Chrome."""
import os, re, sys, io, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from text import T, L, SOURCES
import qrcode, qrcode.image.svg

HERE = os.path.dirname(os.path.abspath(__file__))
R = "../../../"   # repo root from this folder
e = html.escape

def a(label, key, cls="g"):
    return f'<a class="{cls}" href="{L[key]}">{e(label)}</a>' if key else f'<span class="g0">{e(label)}</span>'

def fill(text, keys):
    it = iter(keys)
    return re.sub(r"<a>(.*?)</a>", lambda m: f'<a class="g" href="{L[next(it)]}">{m.group(1)}</a>', text)

def qr(url):
    q = qrcode.QRCode(border=1, box_size=10, image_factory=qrcode.image.svg.SvgPathImage); q.add_data(url); q.make(fit=True)
    b = io.BytesIO(); q.make_image().save(b); s = b.getvalue().decode()
    return s[s.index("<svg"):]

CSS = """
@font-face{font-family:Plex;src:url(fonts/ibm-plex-sans-thai-latin-400-normal.woff2) format('woff2');font-weight:400}
@font-face{font-family:Plex;src:url(fonts/ibm-plex-sans-thai-thai-400-normal.woff2) format('woff2');font-weight:400;unicode-range:U+0E00-0E7F}
@font-face{font-family:Plex;src:url(fonts/ibm-plex-sans-thai-latin-600-normal.woff2) format('woff2');font-weight:600}
@font-face{font-family:Plex;src:url(fonts/ibm-plex-sans-thai-thai-600-normal.woff2) format('woff2');font-weight:600;unicode-range:U+0E00-0E7F}
@font-face{font-family:Plex;src:url(fonts/ibm-plex-sans-thai-latin-700-normal.woff2) format('woff2');font-weight:700}
@font-face{font-family:Plex;src:url(fonts/ibm-plex-sans-thai-thai-700-normal.woff2) format('woff2');font-weight:700;unicode-range:U+0E00-0E7F}
@font-face{font-family:Bodoni;src:url(fonts/bodoni-moda-latin-600-normal.woff2) format('woff2');font-weight:600}
@font-face{font-family:Bodoni;src:url(fonts/bodoni-moda-latin-700-normal.woff2) format('woff2');font-weight:700}
@page{size:A4;margin:0}
:root{--navy:#13263F;--navy2:#2B4A72;--gold:#B07A26;--ink:#17202B;--mut:#5B6573;--line:#D4DBE4;--tile:#F3F6F9;--gsoft:#FBF4E6}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{width:210mm;height:297mm;overflow:hidden;font-family:Plex,"Noto Sans CJK SC","Noto Sans CJK KR",sans-serif;color:var(--ink);font-size:6.5pt;line-height:1.26;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body.zh{font-family:Plex,"Noto Sans CJK SC",sans-serif} body.ko{font-family:Plex,"Noto Sans CJK KR",sans-serif}
a{color:inherit;text-decoration:none} a.g{color:var(--gold);font-weight:600} .g0{color:var(--mut)}
.top{background:var(--navy);color:#fff;padding:2.6mm 8mm 2.4mm;display:flex;justify-content:space-between;align-items:center}
.top h1{font-family:Bodoni,Georgia,serif;font-weight:700;font-size:15pt;line-height:1}
.top small{display:block;letter-spacing:.32em;font-size:5.6pt;opacity:.85;margin-top:1.4mm}
.top .r{text-align:right} .top .r b{display:block;font-size:8.4pt;letter-spacing:.06em} .top .r span{font-size:6.6pt;opacity:.85}
.pg{padding:2mm 8mm 0}
.intro{display:grid;grid-template-columns:1fr 77mm;gap:5mm;align-items:start}
.intro h2{font-size:13.5pt;line-height:1.12;color:var(--navy)} .intro h2 em{font-style:normal;color:var(--gold);display:block}
.intro p{font-size:7pt;margin-top:1.4mm;color:#333}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:1.6mm}
.st{border:1px solid var(--line);border-radius:2mm;padding:.9mm 2mm;background:var(--tile)}
.st b{display:block;font-size:9.4pt;color:var(--navy);line-height:1.15} .st span{color:var(--mut);font-size:6pt;display:block}
.sec{margin-top:1.9mm} .hd{display:flex;align-items:center;gap:2mm;margin-bottom:1mm}
.hd i{flex:none;width:4.6mm;height:4.6mm;border-radius:50%;background:var(--gold);color:#fff;font-style:normal;font-weight:700;display:grid;place-items:center;font-size:6.8pt}
.hd h3{font-size:8.6pt;color:var(--navy);flex:1} .hd .o{font-size:6.8pt}
.two{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.how{display:grid;grid-template-columns:30mm 1fr;gap:2mm;align-items:center}
.hubd{position:relative;height:20mm}
.hubd .c{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:12mm;height:12mm;border-radius:50%;background:var(--navy);color:#fff;display:grid;place-items:center;text-align:center;font-weight:700;font-size:6.2pt;line-height:1.05}
.hubd .c small{display:block;font-weight:400;font-size:4.8pt;opacity:.8}
.hubd .n{position:absolute;border:1px solid var(--navy);border-radius:1.2mm;background:#fff;padding:.5mm 1.4mm;font-weight:600;font-size:5.6pt;white-space:nowrap}
.hubd svg{position:absolute;inset:0}
.mode{display:grid;grid-template-columns:20mm 1fr;border:1px solid var(--line);border-radius:2mm;overflow:hidden;margin-bottom:1.4mm}
.mode b{background:var(--navy);color:#fff;padding:1.2mm 1.8mm;font-size:7pt;line-height:1.15} .mode.r b{background:var(--navy2)}
.mode b small{display:block;font-weight:400;font-size:5.6pt;opacity:.8} .mode p{padding:1.2mm 2mm}
.gets{display:grid;grid-template-columns:1fr 1fr;gap:1.4mm}
.gets div{border:1px solid var(--line);border-radius:2mm;padding:1.2mm 2mm} .gets div:before{content:"✓ ";color:#2E7D5B;font-weight:700}
.gets b{font-weight:700}
.path{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2mm;margin-top:1.4mm}
.path div{background:var(--tile);border-top:2px solid var(--navy);padding:1mm 1.6mm} .path b{display:block}
.lbl{font-weight:700;font-size:6.8pt;margin-top:1.1mm;color:var(--navy)}
.case{display:grid;grid-template-columns:34mm 1fr;gap:2.4mm;margin-bottom:1.2mm}
.case .ph{position:relative;border-radius:2mm;overflow:hidden;background:#ccc}
.case .ph img{width:100%;height:100%;object-fit:cover;display:block}
.case .ph span{position:absolute;left:0;right:0;bottom:0;padding:1mm 1.6mm;color:#fff;font-size:5.6pt;background:linear-gradient(transparent,rgba(10,20,34,.85))}
.ch{display:flex;justify-content:space-between;align-items:baseline;font-weight:700;color:var(--navy);font-size:7.1pt;margin-bottom:1.1mm}
.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:1.3mm}
.tl{border:1px solid var(--line);border-radius:1.8mm;padding:1.1mm 1.7mm;background:#fff}
.tl b{display:block;font-size:6.9pt} .tl span{display:block;color:var(--mut);font-size:6.1pt}
.tl a,.tl .g0{font-size:6.1pt}
.case.r2 .tl{background:var(--gsoft);border-color:#E6D3AE}
.mk{display:grid;grid-template-columns:1fr 1fr 1.6fr;gap:1.6mm}
.box{border:1px solid var(--line);border-radius:2mm;padding:1.3mm 2mm} .box.n{background:#EEF3FA}
.box b{display:block;font-size:7pt;margin-bottom:.6mm} .box li{margin-left:3.4mm}
.lay div{display:grid;grid-template-columns:17mm 1fr;border:1px solid var(--line);border-radius:1.6mm;overflow:hidden;margin-bottom:1mm}
.lay div b{background:var(--navy);color:#fff;padding:.7mm 1.6mm;font-size:6.6pt;line-height:1.1} .lay div:nth-child(2) b{background:var(--navy2)} .lay div:nth-child(3) b{background:#5874A0}
.lay b small{display:block;font-weight:400;font-size:5.2pt;opacity:.85} .lay p{padding:.8mm 1.8mm;align-self:center}
.homes{display:grid;grid-template-columns:repeat(4,1fr);gap:1.6mm;margin-top:1mm}
.homes img{width:100%;height:12.5mm;object-fit:cover;border-radius:1.6mm;display:block}
.homes b{display:block;margin-top:.6mm;font-size:6.8pt} .homes span{color:var(--mut);display:block;font-size:6pt}
.mb{display:flex;gap:.8mm;margin-top:.5mm} .mb i{font-style:normal;font-size:5.2pt;font-weight:700;color:#fff;background:#3E7A5C;border-radius:.8mm;padding:.1mm 1mm}
.homes div:nth-child(2) .mb i{background:#C98B2B} .homes div:nth-child(4) .mb i{background:#5B5FA8}
.phs{display:grid;grid-template-columns:repeat(5,1fr);gap:1.3mm}
.phs div{border:1px solid var(--line);border-radius:1.8mm;padding:1.1mm 1.7mm} .phs b{display:block;font-size:6.9pt;margin:.5mm 0 .3mm}
.chip{display:inline-block;font-size:5.4pt;font-weight:700;border-radius:.8mm;padding:.1mm 1.2mm;background:#FFF1D6;color:#8A5A14} .chip.live{background:#DDF1E5;color:#1F6B44}
.exp{display:grid;grid-template-columns:repeat(3,1fr);border-top:2px solid var(--navy)}
.exp div{padding:1.2mm 2mm;border-right:1px solid var(--line)} .exp div:last-child{border:0}
.exp b{font-size:7.6pt;color:var(--navy)} .exp small{font-weight:600;color:var(--mut);margin-left:1mm} .exp em{display:block;font-style:normal;color:var(--gold);font-weight:600;margin-top:.4mm}
.crit{display:flex;flex-wrap:wrap;gap:1.1mm}
.crit span{border:1px solid var(--line);border-radius:1.4mm;padding:.5mm 1.6mm} .crit b{color:var(--gold);margin-right:.8mm}
.join{display:grid;grid-template-columns:repeat(3,1fr);gap:1.1mm}
.join div{background:var(--tile);border-top:2px solid var(--gold);padding:1mm 1.6mm} .join b{display:block}
.end{display:grid;grid-template-columns:1fr 72mm;gap:4mm;margin-top:1.5mm;align-items:start}
.legal{background:var(--gsoft);border:1px solid #E6D3AE;border-radius:2mm;padding:1.4mm 2.2mm} .legal p+p{margin-top:.8mm}
.ct{display:grid;grid-template-columns:1fr 16mm 16mm;gap:2mm;align-items:center}
.ct b{display:block;font-size:7.6pt;color:var(--navy)} .ct .q{text-align:center;font-size:5.4pt;color:var(--mut)} .ct svg{width:14mm;height:14mm;display:block;margin:0 auto .4mm}
.foot{position:absolute;left:8mm;right:8mm;bottom:2.6mm;display:flex;justify-content:space-between;align-items:flex-end;gap:4mm;border-top:1px solid var(--line);padding-top:1.2mm;font-size:5.4pt;color:var(--mut)}
.foot a{text-decoration:underline} .foot .lg{display:flex;gap:1.6mm;flex:none} .foot .lg img{height:7mm;border-radius:1mm;display:block}
"""

def page(lg):
    t = T[lg]
    m = lambda k: e(t[k])
    hubsvg = '<svg viewBox="0 0 100 80"><g stroke="#B07A26" stroke-dasharray="2 2" stroke-width=".8"><line x1="50" y1="40" x2="16" y2="12"/><line x1="50" y1="40" x2="84" y2="12"/><line x1="50" y1="40" x2="16" y2="68"/><line x1="50" y1="40" x2="84" y2="68"/></g></svg>'
    pos = [("left:0;top:1mm"), ("right:0;top:1mm"), ("left:0;bottom:1mm"), ("right:0;bottom:1mm")]
    hub = f'<div class="hubd">{hubsvg}' + "".join(f'<span class="n" style="{p}">{e(c)}</span>' for c, p in zip(t["cities"], pos)) + f'<div class="c">{m("hub")}<small>{m("hubs")}</small></div></div>'
    tiles = lambda lst: "".join(f'<div class="tl"><b>{e(x)}</b><span>{e(y)}</span>{a(z, k) if z else ""}</div>' for x, y, z, k in lst)
    homes = "".join(f'<div><a href="{L[c.lower()]}"><img src="{R}asn-img/{c}-1.jpg" alt=""></a><b>{e(n)} <a class="g" href="{L[c.lower()]}">{c} →</a></b><span>{e(d)}</span><div class="mb">{"".join(f"<i>{x}</i>" for x in mb)}</div></div>'
                    for (n, c, d), mb in zip(t["homes"], [["ISFJ", "INFP", "INFJ"], ["ESFP", "ENFP", "ESTP"], ["ENFJ", "ESFJ", "ENTJ"], ["INFJ", "INTJ", "ISTJ"]]))
    pk = [["match", "destiny", "safe"], ["persona"], [], ["wr"], []]
    st = [("live", t["live"]), ("", t["nxt"]), ("", t["nxt"]), ("", t["fut"]), ("", t["fut"])]
    phs = "".join(f'<div><span class="chip {c}">{e(s)}</span><b>{e(h)}</b>{fill(e(d).replace("&lt;a&gt;", "<a>").replace("&lt;/a&gt;", "</a>"), k)}</div>' for (h, d), (c, s), k in zip(t["ph"], st, pk))
    lay = "".join(f'<div><b>{e(x)}<small>{e(y)}</small></b><p>{e(z)} {a(w, k)}</p></div>' for x, y, z, w, k in t["lay"])
    src = " · ".join(f'<a href="{u}">{e(n)}</a>' for n, u in SOURCES)
    copy = fill(e(t["copy"]).replace("&lt;a&gt;", "<a>").replace("&lt;/a&gt;", "</a>"), ["wr", "hai"])
    netu = f"https://thbho.github.io/HybridAIAgentNetwork.html?lang={lg}"
    return f"""<!doctype html><html lang="{lg}"><head><meta charset="utf-8"><title>Hybrid AI Agent Network · Partner Proposal ({lg.upper()})</title><style>{CSS}</style></head>
<body class="{lg}"><header class="top"><div><h1>Hybrid AI Agent Network</h1><small>WIDEROOMS × HYBRID AI BY THB.HO</small></div><div class="r"><b>{m("tag")}</b><span>{m("forline")}</span></div></header>
<main class="pg">
<section class="intro"><div><h2>{m("h1a")}<em>{m("h1b")}</em></h2><p>{m("lede")} · <span class="g" style="color:var(--gold);font-weight:600">{m("gold")}</span></p></div>
<div class="stats"><div class="st"><b>+41%</b><span>{m("s1")}</span>{a(t["s1l"], "henley")}</div><div class="st"><b>14,899</b><span>{m("s2")}</span>{a(t["s2l"], "pmail")}</div>
<div class="st"><b>{m("s3v")}</b><span>{m("s3")}</span></div><div class="st"><b>{m("s4v")}</b><span>{m("s4")}</span>{a(t["s4l"], "r2")}</div></div></section>
<div class="two sec"><section><div class="hd"><i>1</i><h3>{m("n1")}</h3></div><div class="how">{hub}<div>
<div class="mode"><b>{m("share")}<small>{m("shares")}</small></b><p>{m("shared")}</p></div><div class="mode r"><b>{m("refer")}<small>{m("refers")}</small></b><p>{m("referd")}</p></div></div></div></section>
<section><div class="hd"><i>2</i><h3>{m("n2")}</h3></div><div class="gets">{"".join(f"<div><b>{e(x)}</b> {e(y)}</div>" for x, y in t["gets"])}</div>
<p class="lbl">{m("path")}</p><div class="path">{"".join(f"<div><b>{e(x)}</b>{e(y)}</div>" for x, y in t["steps"])}</div></section></div>
<section class="sec"><div class="hd"><i>3</i><h3>{m("n3")}</h3></div>
<div class="case"><a class="ph" href="{L["h90"]}"><img src="{R}asn-img/H90-1.jpg" alt=""><span>{m("h90")}</span></a><div><div class="ch"><span>{m("asn_h")}</span>{a(t["open"], "asn", "g o")}</div><div class="tiles">{tiles(t["asn"])}</div></div></div>
<div class="case r2"><a class="ph" href="{L["r2"]}"><img src="{R}riviera-img/hero-3.jpg" alt=""><span>{m("r2cap")}</span></a><div><div class="ch"><span>{m("r2_h")}</span>{a(t["open"], "r2", "g o")}</div><div class="tiles">{tiles(t["r2"])}</div></div></div></section>
<section class="sec"><div class="hd"><i>4</i><h3>{m("n4")}</h3></div><div class="mk"><div class="box"><b>{m("old")}</b><ul>{"".join(f"<li>{e(x)}</li>" for x in t["oldb"])}</ul></div>
<div class="box n"><b>{m("new")}</b><ul>{"".join(f"<li>{e(x)}</li>" for x in t["newb"])}</ul></div><div class="lay">{lay}</div></div><div class="homes">{homes}</div></section>
<section class="sec"><div class="hd"><i>5</i><h3>{m("n5")}</h3></div><div class="phs">{phs}</div></section>
<section class="sec"><div class="hd"><i>6</i><h3>{m("n6")}</h3></div><div class="exp">{"".join(f"<div><b>{e(a1)}</b><small>{e(b1)}</small><br>{e(c1)}<em>◆ {e(d1)}</em></div>" for a1, b1, c1, d1 in t["exp"])}</div></section>
<div class="two sec"><section><div class="hd"><i>7</i><h3>{m("n7")}</h3></div><div class="crit">{"".join(f"<span><b>{i}</b>{e(x)}</span>" for i, x in enumerate(t["crit"], 1))}</div></section>
<section><div class="hd"><i>8</i><h3>{m("n8")}</h3></div><div class="join">{"".join(f"<div><b>{e(x)}</b>{e(y)}</div>" for x, y in t["join"])}</div></section></div>
<div class="end"><div class="legal"><p><b>{m("colist")}</b> {m("colistd")}</p><p><b>{m("legal")}</b> {m("legald")}</p></div>
<div class="ct"><div><b><a href="{L["profile"]}">{m("contact")}</a></b><a class="g" href="{L["x"]}">X @widerooms</a> · <a class="g" href="{L["ig"]}">IG th_b_ho</a></div>
<a class="q" href="{netu}">{qr(netu)}{m("qr1")}</a><a class="q" href="{L["profile"]}">{qr(L["profile"])}{m("qr2")}</a></div></div>
</main>
<footer class="foot"><div>{m("src")}: {src} {m("srcd")}<br>{copy}</div><div class="lg"><a href="{L["wr"]}"><img src="{R}asn-img/logo-widerooms.jpg" alt="WIDEROOMS"></a><a href="{L["hai"]}"><img src="{R}asn-img/logo-thho.jpg" alt="Hybrid AI by ThB.Ho"></a></div></footer>
</body></html>"""

LANGS = ["en", "th", "zh", "ko"]
for lg in LANGS:
    open(os.path.join(HERE, f"{lg}.html"), "w", encoding="utf-8").write(page(lg))
print("html:", ", ".join(LANGS))

if "--pdf" in sys.argv:
    out = sys.argv[sys.argv.index("--pdf") + 1]; os.makedirs(out, exist_ok=True)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        pg = b.new_page()
        pg.route("**/*", lambda r: r.continue_() if r.request.url.startswith("http://127.0.0.1") else r.abort())
        for lg in LANGS:
            pg.goto(f"http://127.0.0.1:8765/hai/docs/partner-proposal/{lg}.html", wait_until="networkidle")
            pg.evaluate("document.fonts.ready")
            over = pg.evaluate("() => { const m = document.querySelector('main').lastElementChild.getBoundingClientRect(), f = document.querySelector('.foot').getBoundingClientRect(); return Math.round(m.bottom - f.top) }")
            path = os.path.join(out, f"Hybrid_AI_Agent_Network_Partner_Proposal_{lg.upper()}.pdf")
            pg.pdf(path=path, format="A4", print_background=True, margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
            print("pdf:", path, "| overlap px:", over)
        b.close()
