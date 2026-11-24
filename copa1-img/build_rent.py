#!/usr/bin/env python3
"""Build the public rental feed for Copa1BeachJomtien.html.

Input : the rental team's "Daily Updated Units & Rentout.xlsx" (Drive file id 1R7noilOQjL_2oKfxMnoee2JeqSYKMx04).
Output: copa1-img/rent-units.json with PUBLIC fields only.

Privacy: the workbook holds owner names, phones, emails, bank details, deposits, owner rates and booking remarks.
None of that may leave this script. Only unit code, side, floor, size, type, asking rents, status and
available date are written, plus aggregate achieved rents (median per size, no unit codes).

Usage: python3 copa1-img/build_rent.py <path to xlsx> [YYYY-MM-DD today]
"""
import json, re, sys, datetime, statistics, os
import openpyxl

SRC, OUT = sys.argv[1], os.path.join(os.path.dirname(os.path.abspath(__file__)), "rent-units.json")
TODAY = datetime.date.fromisoformat(sys.argv[2]) if len(sys.argv) > 2 else datetime.date.today()
SIDE = {"A": "front", "B": "pattaya", "C": "pattaya", "D": "jomtien", "E": "jomtien"}
MON = {m: i for i, m in enumerate(["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], 1)}
CODE = re.compile(r"^([A-E])(\d{1,2}A?)(\d{2})$")


def sqm_of(v):
    m = re.search(r"(\d+(?:\.\d+)?)", str(v or ""))
    return float(m.group(1)) if m else None


def type_of(sqm):
    if sqm is None: return ""
    if sqm >= 79: return "1BRP"
    if sqm >= 60: return "2BRJ"
    if 38.5 <= sqm < 40 or 46 <= sqm < 47: return "1BRJ"
    return "1BR"


def day_month(s):
    m = re.match(r"^\s*(\d{1,2})\s+([A-Za-z]{3})", str(s or ""))
    if not m or m.group(2).lower() not in MON: return None
    d, mo = int(m.group(1)), MON[m.group(2).lower()]
    for y in (TODAY.year, TODAY.year + 1):
        try:
            dt = datetime.date(y, mo, d)
        except ValueError:
            return None
        if dt >= TODAY - datetime.timedelta(days=90):  # a date up to 90 days back = already free
            return dt
    return None


def num(v):
    try:
        return int(round(float(str(v).replace(",", ""))))
    except (TypeError, ValueError):
        return None


wb = openpyxl.load_workbook(SRC, data_only=True, read_only=True)

# 1) asking rents: tab "Price list"
units, hdr = [], None
for r in wb["Price list"].iter_rows(values_only=True):
    cells = [str(c).strip() if c is not None else "" for c in r]
    if "Units" in cells and "Status" in cells:
        hdr = {k: i for i, k in enumerate(cells) if k}
        continue
    if not hdr: continue
    code = cells[hdr["Units"]].upper().replace(" ", "")
    m = CODE.match(code)
    status = cells[hdr["Status"]].lower()
    if not m or status not in ("available", "future available"): continue
    when = cells[hdr["Available Date"]]
    if when.lower().startswith("lock"): continue
    monthly, yearly = num(r[hdr["Monthly Rates"]]), num(r[hdr["Yearly Rates"]])
    if not monthly: continue
    sqm = sqm_of(cells[hdr["Size"]])
    u = {"id": code, "grp": "rent", "side": SIDE[m.group(1)], "floor": m.group(2), "sqm": sqm, "type": type_of(sqm),
         "rentM": monthly, "status": "avail"}
    if yearly: u["rentYM"] = yearly  # per month on a 1-year contract
    if status == "future available" and when.lower() != "now":
        u["status"] = "soon"
        dt = day_month(when)
        if dt and dt <= TODAY: u["status"] = "avail"
        elif dt: u["from"] = dt.isoformat()
    units.append(u)
units.sort(key=lambda u: u["rentM"])

# 2) achieved rents, last 12 months: tab "Rent Out Units " (aggregates only)
ws = next(w for w in wb.worksheets if w.title.strip() == "Rent Out Units")
hdr, by = None, {}
for r in ws.iter_rows(values_only=True):
    cells = [str(c).strip() if c is not None else "" for c in r]
    if "Units" in cells and "Status" in cells and hdr is None:
        hdr = {k: i for i, k in enumerate(cells) if k}
        continue
    if not hdr or not cells[hdr["Units"]]: continue
    if "cancel" in cells[hdr["Status"]].lower(): continue
    mi = next((v for k, v in hdr.items() if k.startswith("Move in")), None)
    raw = r[mi]
    if isinstance(raw, datetime.datetime): d = raw.date()
    elif isinstance(raw, datetime.date): d = raw
    else:
        s = re.sub(r"\s+", " ", cells[mi]).replace(" ,", ",").strip()
        d = None
        for f in ("%d %b, %Y", "%d %b %Y", "%d %B, %Y", "%d %B %Y"):
            try:
                d = datetime.datetime.strptime(s, f).date(); break
            except ValueError:
                pass
        if d is None: continue
    if not (TODAY - datetime.timedelta(days=365) <= d <= TODAY): continue
    rate, sqm = num(r[hdr["Rate/month"]]), sqm_of(cells[hdr["Size"]])
    if not rate or not sqm or rate < 5000: continue
    by.setdefault(round(sqm), []).append(rate)
stats = [{"sqm": k, "median": int(statistics.median(v)), "n": len(v)} for k, v in sorted(by.items()) if len(v) >= 3]

json.dump({"updated": TODAY.isoformat(), "units": units, "achieved": stats}, open(OUT, "w"), ensure_ascii=False, separators=(",", ":"))
print(f"{len(units)} rent units ({sum(u['status']=='soon' for u in units)} soon) · achieved groups {len(stats)} → {OUT}")
