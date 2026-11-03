#!/usr/bin/env python3
"""Build the R2 by Clare page shell and unit pages from agents/r2/shell.html + pages.json.
Run from the repo root:  python3 agents/r2/build.py
- Every page is the same shell; only line 4 (page vars) and the description/og/title lines differ.
- Edit styles in agents/r2/r2.css, data in data.js, text in text.js, the app in app.js; bump "version" in
  pages.json so phones fetch the new files, then run this script.
- New unit page: add {"file": "Riviera2Resale-<CODE>.html", "vars": ..., "meta": [...]} to pages.json.
- "frozen": true pages (the hidden unit 8A05) are left untouched.
- Also writes agents/r2/feed.json (price, promotion price and live/off status per unit) for network members that
  co-sell R2 units (ASN: CO_LISTINGS in agents/asn/config.js). R2 is the master: a unit that is booked, sold or in
  HIDDEN_UNITS goes off every member site as soon as this feed is pushed. Needs node."""
import json, os, subprocess
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
here = os.path.join(root, "agents", "r2")
cfg = json.load(open(os.path.join(here, "pages.json"), encoding="utf-8"))
tpl = open(os.path.join(here, "shell.html"), encoding="utf-8").read()
n = 0
for p in cfg["pages"]:
    if p.get("frozen"): continue
    html = tpl.replace("{{VARS}}", p["vars"]).replace("{{META}}", "\n".join(p["meta"])).replace("{{V}}", cfg["version"])
    open(os.path.join(root, p["file"]), "w", encoding="utf-8").write(html); n += 1
print(f"built {n} pages (version {cfg['version']})")

# feed for co-selling members (read in the browser by hai/engine.js loadCo)
js = r"""
const fs = require("fs"), vm = require("vm"); const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.argv[1], "utf8") + "\n;this.__U = UNITS; this.__H = typeof HIDDEN_UNITS !== 'undefined' ? HIDDEN_UNITS : [];", ctx);
const units = {}; for (const u of ctx.__U) { const sell = u.promoPrice || u.price;
  units[u.unit] = { price: u.price, promo: u.promoPrice || null, sell, status: u.status, live: u.status === "AVAILABLE" && !ctx.__H.includes(u.unit) }; }
for (const h of ctx.__H) units[h] = { status: "HIDDEN", live: false };   // booked/held: data.js takes them out of UNITS
process.stdout.write(JSON.stringify(units));
"""
try:
    out = subprocess.run(["node", "-e", js, os.path.join(here, "data.js")], capture_output=True, text=True, check=True).stdout
    units = json.loads(out)
    feed = {"site": "r2", "owner": "Clare Pattaya Property", "version": cfg["version"], "units": units}
    with open(os.path.join(here, "feed.json"), "w", encoding="utf-8") as fh:
        json.dump(feed, fh, ensure_ascii=False, separators=(",", ":"))
    print(f"feed.json: {len(units)} units, {sum(u['live'] for u in units.values())} live")
except Exception as e:
    print("feed.json NOT updated (node missing or data.js error):", e)
