#!/usr/bin/env python3
"""Build the R2 by Clare page shell and unit pages from agents/r2/shell.html + pages.json.
Run from the repo root:  python3 agents/r2/build.py
- Every page is the same shell; only line 4 (page vars) and the description/og/title lines differ.
- Edit styles in agents/r2/r2.css, data in data.js, text in text.js, the app in app.js; bump "version" in
  pages.json so phones fetch the new files, then run this script.
- New unit page: add {"file": "Riviera2Resale-<CODE>.html", "vars": ..., "meta": [...]} to pages.json.
- "frozen": true pages (the hidden unit 8A05) are left untouched."""
import json, os
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
