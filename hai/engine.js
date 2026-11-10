/* Hybrid AI Agent Network · engine: listings, search, map, matching, feng shui, flyers, sharing
   Part of the shared site engine (see hai/README.md). © 2026 THOR · WIDEROOMS · Hybrid AI by ThB.Ho */

const LANGS = ["th","en","ru","zh","ko","ja"];

/* ====================================================================
   STATE & HELPERS
   ==================================================================== */
let L = LISTINGS;
let lang = "th";
const st = { deal:"any", type:"", zone:"", budget:"", beds:0, pool:false, sort:"rec", q:"", view:"grid" };
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
if (window.ASND) for (const k in ASND.T) Object.assign(T[k] || (T[k] = {}), ASND.T[k]);   // Destiny Match (hai/destiny.js) nav strings
const t = (k, v) => { let s = (T[lang] && T[lang][k]) ?? T.en[k] ?? T.th[k] ?? k; if (v) for (const n in v) s = s.replace("{" + n + "}", v[n]); return s; };
const zn = z => (ZONE_NAMES[z] && (ZONE_NAMES[z][lang] || ZONE_NAMES[z].en)) || z;
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
                set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
const byCode = c => L.find(l => l.code === c);
// listings shown on the page (TOP_PICKS first, then FEATURED); hidden ones stay reachable through byCode
let DATA_READY = false; // true once the Google Sheet listings and asn-style.json have loaded (or failed)
const SHOWN = () => { if (!TOP_PICKS.length) return L.filter(l => !l.parent); const order = [...TOP_PICKS, ...FEATURED.filter(c => !TOP_PICKS.includes(c))]; const picked = order.map(byCode).filter(Boolean);
  if (!(typeof SITE !== "undefined" && SITE.showAll)) return picked;
  // showAll: curated order first, then every other active listing; Sattahip and land always last; sub-plots stay folded under their parent
  const late = l => l.zone === "sattahip" || l.type === "land", rest = L.filter(l => !l.parent && !picked.includes(l));
  return [...picked.filter(l => !late(l)), ...rest.filter(l => !late(l)), ...picked.filter(late), ...rest.filter(late)]; };
// listing name in the current language when a listing has `names` (land plots); otherwise its single name
// Standard listing title (Thor 1 Nov 2026): built from the listing's own data in every language, not the Facebook post title.
// villa/house: "<type> <beds> bedrooms · <zone>", condo: "<condo> <beds> <size> · <project|zone>", land: "<land> <size> · <zone>"
// project names that replace the zone in a title come from the agent: PROJECTS = [[/regex/i, "Project name"], …] in agents/<id>/config.js
// public listing reference, e.g. "ASN-H96": prefix = SITE.ref, else SITE.short
const ref = c => `${SITE.ref || SITE.short}-${c}`;
// key colours (fixed in light and dark; print, flyer, social image, map): --key-<name> in hai/engine.css / agents/<id>/theme.css
const KEY = (k, d) => getComputedStyle(document.documentElement).getPropertyValue("--key-" + k).trim() || d;
const PROJECT_OF = l => { const P = typeof PROJECTS !== "undefined" ? PROJECTS : []; for (const [re, n] of P) if (re.test(l.name || "")) return n; return ""; };
function stdName(l) {
  const z = zn(l.zone), pj = PROJECT_OF(l), b = l.beds, n = x => nf(Math.round(x * 100) / 100);
  const area = l.size || l.usable, wah = l.land ? Math.round(l.land / 4) : null;
  const ruBeds = k => k + " " + (k % 10 === 1 && k % 100 !== 11 ? "спальня" : [2, 3, 4].includes(k % 10) && ![12, 13, 14].includes(k % 100) ? "спальни" : "спален");
  const where = pj || z;
  const L = {
    th: { home: () => `${t(l.type)}${b ? ` ${b} ห้องนอน` : ""}`, condo: () => `คอนโด${b ? ` ${b} ห้องนอน` : ""}${area ? ` ${n(area)} ตร.ม.` : ""}`, land: () => `ที่ดิน${wah ? ` ${nf(wah)} ตร.ว.` : ""}`, com: () => `${t("commercial")}${area ? ` ${n(area)} ตร.ม.` : ""}` },
    en: { home: () => `${b ? b + "-Bedroom " : ""}${l.type === "villa" ? "Pool Villa" : "House"}`, condo: () => `${b ? b + "-Bedroom " : ""}Condo${area ? ` ${n(area)} sqm` : ""}`, land: () => `Land Plot${l.land ? ` ${nf(l.land)} sqm` : ""}`, com: () => `Commercial Space${area ? ` ${n(area)} sqm` : ""}` },
    ru: { home: () => `${l.type === "villa" ? "Вилла с бассейном" : "Дом"}${b ? ", " + ruBeds(b) : ""}`, condo: () => `Кондо${b ? ", " + ruBeds(b) : ""}${area ? `, ${n(area)} м²` : ""}`, land: () => `Участок${l.land ? ` ${nf(l.land)} м²` : ""}`, com: () => `Коммерческое помещение${area ? ` ${n(area)} м²` : ""}` },
    zh: { home: () => `${b ? b + "卧" : ""}${t(l.type)}`, condo: () => `${b ? b + "卧" : ""}公寓${area ? ` ${n(area)}㎡` : ""}`, land: () => `土地${l.land ? ` ${nf(l.land)}㎡` : ""}`, com: () => `商铺${area ? ` ${n(area)}㎡` : ""}` },
    ko: { home: () => `${b ? `침실 ${b}개 ` : ""}${t(l.type)}`, condo: () => `${b ? `침실 ${b}개 ` : ""}콘도${area ? ` ${n(area)}㎡` : ""}`, land: () => `토지${l.land ? ` ${nf(l.land)}㎡` : ""}`, com: () => `상업 공간${area ? ` ${n(area)}㎡` : ""}` },
    ja: { home: () => `${b ? b + "ベッドルームの" : ""}${t(l.type)}`, condo: () => `${b ? b + "ベッドルームの" : ""}コンドミニアム${area ? ` ${n(area)}㎡` : ""}`, land: () => `土地${l.land ? ` ${nf(l.land)}㎡` : ""}`, com: () => `商業スペース${area ? ` ${n(area)}㎡` : ""}` }
  }[lang] || null;
  if (!L) return l.name;
  if (l.type === "commercial" && /โกดัง|warehouse/i.test(l.name || "")) return `${{ th: "บ้านพร้อมโกดัง", en: "House with Warehouse", ru: "Дом со складом", zh: "住宅带仓库", ko: "창고 딸린 주택", ja: "倉庫付き住宅" }[lang]}${area ? ` ${n(area)} ${lang === "th" ? "ตร.ม." : lang === "en" ? "sqm" : lang === "ru" ? "м²" : "㎡"}` : ""} · ${where}`;
  if (l.type === "land" && !l.land && l.names) return l.names[lang] || l.names.en;
  if (l.type === "land" && l.plotNo) { const z0 = zn(l.zone), wah0 = l.land ? Math.round(l.land / 4) : null; return t("plotName", { n: l.plotNo, w: nf(wah0), m: nf(l.land), z: z0 }); }
  const k = l.type === "condo" ? "condo" : l.type === "land" ? "land" : l.type === "commercial" ? "com" : "home";
  return `${L[k]()} · ${where}`;
}
const nm = l => l.type ? stdName(l) : ((l.names && (l.names[lang] || l.names.en)) || l.name);
const photo = (l, n) => { const p = (l.photoList || [])[n - 1]; return p || `${SITE.img}${l.code}-${n}.jpg`; };
const MAX_PHOTOS = 30;   // per listing (Thor 28 Oct 2026: up to 30): gallery, card arrows, download-all
const photos = l => (l.photoList && l.photoList.length ? l.photoList : Array.from({ length: l.photos || 1 }, (_, i) => `${SITE.img}${l.code}-${i + 1}.jpg`)).slice(0, MAX_PHOTOS);
const area = l => l.usable || l.size || null;
const nf = n => Number(n).toLocaleString("en-US");
function money(n) {
  if (n == null) return null;
  if (n >= 1e6) { const m = +(n / 1e6).toFixed(n % 1000 ? 2 : 3); return lang === "th" ? `฿${m} ${t("million")}` : lang === "ru" ? `฿${String(m).replace(".", ",")} ${t("million")}` : `฿${m}M`; }
  return "฿" + nf(n);
}
const landTxt = l => l.land ? `${nf(Math.round(l.land / 4))} ${t("sqw")} · ${nf(l.land)} ${t("sqm")}` : null;
// asn/<CODE>.html carries the listing's own og: preview for LINE/Facebook (share-build/build.py)
const listingUrl = l => new URL(SITE.share + l.code + ".html", document.baseURI).href;
const priceOf = l => st.deal === "sale" ? l.sale : st.deal === "rent" ? l.rent : (l.rent ?? l.sale);
function toast(msg) { const el = $("#toast"); el.textContent = msg; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 1600); }
async function copy(text) {
  try { await navigator.clipboard.writeText(text); }
  catch (e) { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (_) {} ta.remove(); }
  toast(t("copied"));
}
function opts(sel, list, val) { sel.innerHTML = list.map(([v, txt]) => `<option value="${esc(v)}"${String(v) === String(val) ? " selected" : ""}>${esc(txt)}</option>`).join(""); }

const RENT_B = [[0,70000],[70000,100000],[100000,150000],[150000,1e12]];
const SALE_B = [[0,10e6],[10e6,25e6],[25e6,50e6],[50e6,1e15]];
const bLabel = ([a, b]) => b >= 1e11 ? `${money(a)}+` : a === 0 ? `< ${money(b)}` : `${money(a)} – ${money(b)}`;

/* ====================================================================
   CARDS
   ==================================================================== */
function badges(l) {
  const b = [];
  if (l.latest) b.push(`<span class="badge latest">✨ ${t("latestBadge")}</span>`);
  if (l.urgent) b.push(`<span class="badge hot">${t("urgent")}</span>`);
  else if (l.hot) b.push(`<span class="badge hot">${t("hot")}</span>`);
  if (l.isNew) b.push(`<span class="badge new">${t("newBadge")}</span>`);
  if (l.rentWas || l.saleWas) b.push(`<span class="badge disc">${t("discount")}</span>`);
  b.push(`<span class="badge">${t(l.type)}</span>`);
  return b.join("");
}
// distance to U-Tapao airport / Eastern Airport City (Google Maps driving, 1 Nov 2026). Exact for plots with
// coordinates; zone listings (houses without a public location) get an approximate figure from the zone centre.
// Data lives outside the engine: UTP (per listing code) in agents/<id>/listing-data.js, UTP_ZONE (per zone) in hai/regions/<region>.js.
// A site without either simply shows no airport line.
function utp(l) {
  const U = typeof UTP !== "undefined" ? UTP : {}, UZ = typeof UTP_ZONE !== "undefined" ? UTP_ZONE : {};
  const e = U[l.code] || (l.parent && U[l.parent]);
  if (e) return { km: e[0], min: e[1], ok: 1 };
  const z = UZ[l.zone]; return z ? { km: z[0], min: z[1], ok: 0 } : null;
}
const utpTxt = l => { const u = utp(l); return u ? t(u.ok ? "utpExact" : "utpApprox", { km: nf(u.km), min: u.min, z: zn(l.zone) }) : null; };
const utpChip = l => { const u = utp(l); return u ? `<span>✈️ ${u.ok ? "" : "~"}${nf(u.km)} ${t("km")} ${t("utpShort")}</span>` : ""; };
function specLine(l) {
  if (l.type === "land") return [`<span>🌳 ${l.land ? raiTxt(l.land) : t("ask")}</span>`, l.road && `<span>🛣️ ${t("rd_" + l.road)}</span>`, perWa(l) && `<span>${perWa(l)} / ${t("sqw")}</span>`, utpChip(l)].filter(Boolean).join("");
  const s = [];
  if (l.beds) s.push(`<span>🛏 ${l.beds} ${t("beds")}</span>`);
  if (l.baths) s.push(`<span>🛁 ${l.baths} ${t("baths")}</span>`);
  if (area(l)) s.push(`<span>📐 ${nf(area(l))}${l.usablePlus ? "+" : ""} ${t("sqm")}</span>`);
  else if (l.land) s.push(`<span>🌳 ${nf(Math.round(l.land / 4))} ${t("sqw")}</span>`);
  if (l.pool) s.push(`<span>🏊 ${t(l.pool === "private" ? "poolPrivate" : l.pool === "shared" ? "poolShared" : "poolYes")}</span>`);
  if (utp(l)) s.push(utpChip(l));
  return s.join("");
}
function priceRows(l) {
  let h = "";
  if (l.rent) h += `<div class="price r"><span>${t("forRent")} ${t("from")}</span><span>${l.rentWas ? `<s>${money(l.rentWas)}</s>` : ""}<b>${money(l.rent)}</b> <small>${t("perMonth")}</small></span></div>`;
  if (l.sale) h += `<div class="price"><span>${t("forSale")} ${t("from")}</span><span>${l.saleWas ? `<s>${money(l.saleWas)}</s>` : ""}<b>${money(l.sale)}</b></span></div>`;
  else if (l.saleAsk) h += `<div class="price"><span>${t("forSale")}</span><span><b>${t("ask")}</b></span></div>`;
  return h;
}
const saved = () => store.get(SITE.store + "saved", []);
// sub-plots stay off the lists; the parent card folds them out with +/- (Thor 1 Nov 2026)
function kidsFold(l) {
  const kids = L.filter(x => x.parent === l.code).sort((a, b) => a.plotNo - b.plotNo);
  if (!kids.length) return "";
  return `<details class="ckids"><summary><span class="mg-op">${t("plotsFold", { n: kids.length })}</span><span class="mg-cl">${t("plotsFoldHide")}</span></summary><div class="ckids-l">${kids.map(k => `<a href="#/l/${k.code}"><b>${t("plotN", { n: k.plotNo })}</b> ${nf(Math.round(k.land / 4))} ${t("sqw")}</a>`).join("")}</div></details>`;
}
function card(l, browse) {
  const on = saved().includes(l.code), n = photos(l).length;
  const nav = browse && n > 1 ? `<button type="button" class="cnav p" data-cnav="-1" aria-label="Previous photo">‹</button><button type="button" class="cnav n" data-cnav="1" aria-label="Next photo">›</button>` : "";
  return `<article class="card"${browse ? ` data-card="${l.code}" data-ix="0"` : ""}>
    <div class="card-media${l.latest ? " is-latest" : ""}"><img src="${esc(photo(l, 1))}" alt="${esc(nm(l))}" loading="lazy"${l.type === "land" ? ' style="object-position:top"' : ""}>${nav}${l.latest ? `<div class="latest-strip">✨ ${t("latestBadge")}</div>` : ""}
      <div class="card-badges">${badges(l)}</div>
      ${l.video || l.youtube ? `<span class="card-vid">▶ ${t("video")}</span>` : ""}
      <span class="card-count">📷 <span class="cix">${browse ? `1 / ` : ""}</span>${n}</span></div>
    <button type="button" class="star" data-star="${l.code}" aria-pressed="${on}" aria-label="Save">${on ? "★" : "☆"}</button>
    <div class="card-body">
      <span class="code">${ref(l.code)}</span>
      <h3><a href="#/l/${l.code}">${esc(nm(l))}</a></h3>
      <p class="where">📍 ${esc(zn(l.zone))}</p>
      <div class="specs">${specLine(l)}</div>
      <div class="prices">${priceRows(l)}</div>${kidsFold(l)}
    </div></article>`;
}

/* ====================================================================
   HOME
   ==================================================================== */
let slideIx = 0, slideTimer;
function renderHero() {
  const sl = SLIDES.map(([c, n]) => byCode(c) && [byCode(c), n]).filter(Boolean);
  $("#slides").innerHTML = sl.map(([l, n], i) => `<div class="slide${i === 0 ? " on" : ""}"><img src="${esc(photo(l, n))}" alt="" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></div>`).join("");
  $("#sdots").innerHTML = sl.map((_, i) => `<button type="button" data-s="${i}" aria-label="${i + 1}" aria-current="${i === 0}"></button>`).join("");
  const show = i => {
    slideIx = (i + sl.length) % sl.length;
    document.querySelectorAll(".slide").forEach((s, j) => s.classList.toggle("on", j === slideIx));
    document.querySelectorAll("#sdots button").forEach((b, j) => b.setAttribute("aria-current", j === slideIx));
    const [l] = sl[slideIx]; const cap = $("#scap"); cap.href = "#/l/" + l.code; cap.textContent = `${nm(l)} · ${zn(l.zone)} →`;
  };
  show(slideIx);
  $("#sdots").onclick = e => { const b = e.target.closest("button"); if (b) { show(+b.dataset.s); restart(); } };
  const restart = () => { clearInterval(slideTimer); if (!matchMedia("(prefers-reduced-motion: reduce)").matches) slideTimer = setInterval(() => show(slideIx + 1), 6000); };
  restart();
}
function renderStats() {
  const V = SHOWN(), rents = V.filter(l => l.rent).map(l => l.rent), sales = V.filter(l => l.sale).map(l => l.sale);
  const zones = new Set(V.map(l => l.zone));
  $("#stats").innerHTML = [
    [V.length, t("statListings")], [zones.size, t("statZones")],
    [rents.length ? money(Math.min(...rents)) : "—", t("statRent")], [sales.length ? money(Math.min(...sales)) : "—", t("statSale")], ["6", t("statLangs")]
  ].map(([b, s]) => `<div class="stat"><b>${b}</b><span>${s}</span></div>`).join("");
}
function renderServices() {
  const ic = ["🗝️", "🌴", "🤝", "🏙️", "🛠️", "🛋️"];
  $("#svc").innerHTML = [1, 2, 3, 4, 5].map((n, i) => `<div><i>${ic[i]}</i><h3>${t("svc" + n)}</h3><p>${t("svc" + n + "p")}</p></div>`).join("")
    + `<a class="svc-wr" href="${WR_URL}" target="_blank" rel="noopener"><i>${ic[5]}</i><h3>${t("svc6")}</h3><p>${t("svc6p")}</p><img src="${SITE.img}logo-widerooms.jpg" alt="WIDEROOMS"></a>`;
}
function renderHot() { $("#hotGrid").innerHTML = FEATURED.map(byCode).filter(Boolean).map(l => card(l, true)).join(""); }
function cardPhoto(cardEl, step) {
  const l = byCode(cardEl.dataset.card), ph = photos(l);
  const ix = (+cardEl.dataset.ix + step + ph.length) % ph.length;
  cardEl.dataset.ix = ix;
  cardEl.querySelector(".card-media img").src = ph[ix];
  cardEl.querySelector(".cix").textContent = `${ix + 1} / `;
  new Image().src = ph[(ix + step + ph.length) % ph.length];   // warm the next one
}

function fillFilters() {
  const types = [...new Set([...SHOWN().map(l => l.type), "land"])];
  const zones = Object.keys(ZONES).filter(z => SHOWN().some(l => l.zone === z) || ZONES[z].land);
  opts($("#fType"), [["", t("allTypes")], ...types.map(x => [x, t(x)])], st.type);
  opts($("#qsType"), [["", t("allTypes")], ...types.map(x => [x, t(x)])], "");
  opts($("#fZone"), [["", t("allZones")], ...zones.map(z => [z, zn(z)])], st.zone);
  opts($("#qsZone"), [["", t("allZones")], ...zones.map(z => [z, zn(z)])], "");
  const sel = $("#fBudget");
  let h = `<option value="">${esc(t("anyBudget"))}</option>`;
  if (st.deal !== "sale") h += `<optgroup label="${esc(t("budgetRent"))}">` + RENT_B.map((b, i) => `<option value="r${i}">${esc(bLabel(b))}</option>`).join("") + "</optgroup>";
  if (st.deal !== "rent") h += `<optgroup label="${esc(t("budgetSale"))}">` + SALE_B.map((b, i) => `<option value="s${i}">${esc(bLabel(b))}</option>`).join("") + "</optgroup>";
  sel.innerHTML = h; sel.value = st.budget; if (sel.value !== st.budget) st.budget = "";
  opts($("#fBeds"), [[0, t("anyBeds")], ...[2, 3, 4, 5].map(n => [n, t("bedsMin", { n })])], st.beds);
  opts($("#fSort"), [["rec", t("sortRec")], ["low", t("sortLow")], ["high", t("sortHigh")], ["beds", t("sortBeds")], ["size", t("sortSize")]], st.sort);
  document.querySelectorAll("#fDeal button").forEach(b => b.setAttribute("aria-pressed", b.dataset.deal === st.deal));
  $("#fPool").setAttribute("aria-pressed", st.pool);
  $("#q").value = st.q;
}
function filtered() {
  const q = st.q.trim().toLowerCase();
  let r = SHOWN().filter(l => {
    if (st.deal === "rent" && !l.rent) return false;
    if (st.deal === "sale" && !l.sale && !l.saleAsk) return false;
    if (st.type && l.type !== st.type) return false;
    if (st.zone && l.zone !== st.zone) return false;
    if (st.beds && !(l.beds >= st.beds)) return false;
    if (st.pool && !l.pool) return false;
    if (st.budget) {
      const [a, b] = (st.budget[0] === "r" ? RENT_B : SALE_B)[+st.budget.slice(1)];
      const p = st.budget[0] === "r" ? l.rent : l.sale;
      if (p == null || p < a || p >= b) return false;
    }
    if (q) {
      const hay = [l.code, SITE.id + "-" + l.code, l.name, ...Object.values(l.names || {}), t(l.type), ...LANGS.map(g => ZONE_NAMES[l.zone]?.[g])].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const P = l => priceOf(l) ?? Infinity;
  if (st.sort === "low") r.sort((a, b) => P(a) - P(b));
  if (st.sort === "high") r.sort((a, b) => (priceOf(b) ?? -1) - (priceOf(a) ?? -1));
  if (st.sort === "beds") r.sort((a, b) => (b.beds || 0) - (a.beds || 0));
  if (st.sort === "size") r.sort((a, b) => (area(b) || b.land || 0) - (area(a) || a.land || 0));
  return r;
}
const PAGE_N = 12; let listShow = PAGE_N, listSig = "";
const MORE_TXT = { th:"ดูทรัพย์เพิ่มเติม", en:"Show more listings", ru:"Показать ещё", zh:"查看更多房源", ko:"매물 더 보기", ja:"物件をもっと見る" };
document.addEventListener("click", e => { if (e.target.closest("#moreList, .more-btn")) { listShow += PAGE_N; renderList(); } });
function renderList() {
  const r = filtered();
  $("#count").textContent = r.length;
  $("#grid").hidden = st.view !== "grid"; $("#tblwrap").hidden = st.view !== "table";
  $("#vGrid").setAttribute("aria-pressed", st.view === "grid"); $("#vTable").setAttribute("aria-pressed", st.view === "table");
  if (!r.length) { $("#grid").hidden = false; $("#tblwrap").hidden = true; $("#grid").innerHTML = `<div class="empty" style="grid-column:1/-1">${st.type === "land" || ZONES[st.zone]?.land ? `${t("ldSoon")} · <a href="#/land">${t("navLand")} →</a>` : t("noResults")}</div>`; return; }
  const sig = JSON.stringify([st.deal, st.type, st.zone, st.budget, st.beds, st.pool, st.sort, st.q]);
  if (sig !== listSig) { listSig = sig; listShow = PAGE_N; }
  const vis = r.slice(0, listShow), left = r.length - vis.length;
  $("#grid").innerHTML = vis.map(l => card(l, true)).join("") // explicit flag: map() would pass the index, leaving the first card without photo arrows
    + (left > 0 ? `<div class="more-wrap"><button type="button" class="btn more-btn" id="moreList">+ ${esc(MORE_TXT[lang] || MORE_TXT.en)} <small>(${left})</small></button></div>` : "");
  $("#thead").innerHTML = `<tr><th>${t("code")}</th><th>${t("type")}</th><th>${t("zone")}</th><th class="n">${t("beds")}</th><th class="n">${t("baths")}</th><th class="n">${t("usable")}</th><th class="n">${t("land")}</th><th class="n">${t("forRent")}</th><th class="n">${t("forSale")}</th></tr>`;
  $("#tbody").innerHTML = vis.map(l => `<tr data-go="${l.code}"><td><b>${ref(l.code)}</b><br><small>${esc(nm(l))}</small></td><td>${t(l.type)}</td><td>${esc(zn(l.zone))}</td>
    <td class="n">${l.beds ?? "—"}</td><td class="n">${l.baths ?? "—"}</td><td class="n">${area(l) ? nf(area(l)) : "—"}</td><td class="n">${l.land ? nf(Math.round(l.land / 4)) + " " + t("sqw") : "—"}</td>
    <td class="n">${l.rent ? money(l.rent) : "—"}</td><td class="n">${l.sale ? money(l.sale) : "—"}</td></tr>`).join("")
    + (left > 0 ? `<tr class="more-tr"><td colspan="9"><button type="button" class="btn more-btn" data-more="1">+ ${esc(MORE_TXT[lang] || MORE_TXT.en)} <small>(${left})</small></button></td></tr>` : "");
  renderZoneList();
}

/* ---------- map ---------- */
let map, zoneLayer;
function renderZoneList() {
  const V = SHOWN(), zones = Object.keys(ZONES).filter(z => V.some(l => l.zone === z));
  $("#zlist").innerHTML = `<button type="button" data-zone="" aria-pressed="${!st.zone}"><span>${t("allZones")}</span><b>${V.length}</b></button>` +
    zones.map(z => `<button type="button" data-zone="${z}" aria-pressed="${st.zone === z}"><span>📍 ${esc(zn(z))}</span><b>${V.filter(l => l.zone === z).length}</b></button>`).join("");
  $("#areasList").textContent = zones.map(zn).join(" · ");
}
function initMap() {
  if (!window.L || !window.L.map || map) return;
  map = window.L.map("map", { scrollWheelZoom: false, attributionControl: true }).fitBounds(Object.values(ZONES).map(o => o.ll), { padding: [24, 24] });
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 17, attribution: "© OpenStreetMap" }).addTo(map);
  zoneLayer = window.L.layerGroup().addTo(map);
  drawZones();
}
function drawZones() {
  if (!map) return;
  zoneLayer.clearLayers();
  const col = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#1F3A5F";
  for (const z of Object.keys(ZONES)) {
    const n = SHOWN().filter(l => l.zone === z).length, land = ZONES[z].land; if (!n && !land) continue;
    const c = window.L.circle(ZONES[z].ll, { radius: land ? 2200 : 900, color: land ? KEY("accent", "#B57A27") : col, weight: 1.5, dashArray: land ? "6 5" : null, fillOpacity: st.zone === z ? .35 : .12 }).addTo(zoneLayer);
    const m = window.L.marker(ZONES[z].ll, { icon: window.L.divIcon({ className: "", html: `<div class="zpin" style="width:30px;height:30px${land ? ";background:#B57A27" : ""}">${n}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(zoneLayer);
    const go = () => { if (land) { location.hash = "#/zone/" + z; return; } st.zone = z; fillFilters(); renderList(); drawZones(); document.getElementById("listings").scrollIntoView(); };
    c.on("click", go); m.on("click", go); m.bindTooltip(zn(z));
  }
}

/* ---------- MBTI match ---------- */
const mq = store.get(SITE.store + "mq", { q1: "E", q2: "S", q3: "F", q4: "J", deal: "any", budget: "", beds: 0 });
function renderMatchForm() {
  const Q = [["q1", "E", "I"], ["q2", "S", "N"], ["q3", "T", "F"], ["q4", "J", "P"]];
  $("#mq").innerHTML = Q.map(([k, a, b]) => `<div class="mq"><p>${t(k)}</p><div class="opts">
    <button type="button" data-mq="${k}" data-v="${a}" aria-pressed="${mq[k] === a}">${t(k + "a")}</button>
    <button type="button" data-mq="${k}" data-v="${b}" aria-pressed="${mq[k] === b}">${t(k + "b")}</button></div></div>`).join("");
  opts($("#mDeal"), [["any", t("any")], ["rent", t("rent")], ["sale", t("sale")]], mq.deal);
  const bud = mq.deal === "sale" ? [5e6, 10e6, 20e6, 30e6, 70e6] : [70000, 90000, 120000, 150000, 500000];
  opts($("#mBudget"), [["", t("anyBudget")], ...bud.map(v => [v, "≤ " + money(v)])], mq.budget);
  if ($("#mBudget").value !== String(mq.budget)) mq.budget = "";
  opts($("#mBeds"), [[0, t("anyBeds")], ...[2, 3, 4, 5].map(n => [n, n + "+"])], mq.beds);
  renderMatch();
}
function matchScore() {
  const ppsqm = l => { const a = area(l) || (l.land ? l.land * .6 : null); return a ? { r: l.rent ? l.rent / a : null, s: l.sale ? l.sale / a : null } : { r: null, s: null }; };
  const med = arr => { const s = arr.filter(x => x != null).sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : Infinity; };
  const V = SHOWN(), mr = med(V.map(l => ppsqm(l).r)), ms = med(V.map(l => ppsqm(l).s));
  const type = mq.q1 + mq.q2 + mq.q3 + mq.q4;
  const rows = V.map(l => {
    if (l.type === "land" || l.type === "commercial") return null; // lifestyle match is for homes only
    if (mq.deal === "rent" && !l.rent) return null;
    if (mq.deal === "sale" && !l.sale) return null;
    if (mq.beds && !(l.beds >= mq.beds)) return null;
    if (mq.budget) { const p = mq.deal === "sale" ? l.sale : (l.rent ?? (mq.deal === "any" ? null : l.sale)); if (p == null || p > +mq.budget) return null; }
    const pp = ppsqm(l);
    const f = {
      social: (l.beds || 0) >= 5 || (area(l) || 0) >= 500 || l.tags.includes("basketball") || l.tags.includes("rooftop") || l.tags.includes("theater"),
      quiet: l.type !== "condo" && (l.beds || 0) <= 4 && (l.land || 0) >= 450,
      design: l.style === "modern",
      value: (pp.r != null && pp.r <= mr) || (pp.s != null && pp.s <= ms),
      family: (l.beds || 0) >= 3 && ((l.land || 0) >= 400 || l.tags.includes("nearSchool")),
      long: l.type !== "condo" || !!l.sale,
      flex: l.type === "condo" || (l.rent && l.rent <= 90000),
      view: l.tags.includes("seaView")
    };
    let s = 0; const why = [];
    const add = (cond, pts, r) => { if (cond) { s += pts; why.push(r); } };
    add(mq.q1 === "E" && f.social, 3, "rSocial"); add(mq.q1 === "I" && f.quiet, 3, "rQuiet");
    add(mq.q2 === "N" && f.design, 2, "rDesign"); add(mq.q2 === "S" && f.value, 2, "rValue");
    add(mq.q3 === "F" && f.family, 2, "rFamily"); add(mq.q3 === "T" && f.value && mq.q2 !== "S", 2, "rValue");
    add(mq.q4 === "J" && f.long, 1, "rLong"); add(mq.q4 === "P" && f.flex, 2, "rFlex");
    add(f.view && (mq.q2 === "N" || mq.q4 === "P"), 1, "rView");
    // the house's own personality (HOME_STYLE / asn-style.json): exact type > same temperament group > shared letters
    const hm = (HOME_STYLE[l.code] && HOME_STYLE[l.code].mbti) || [];
    const letters = hm.length ? Math.max(...hm.map(x => [...x].filter((c, i) => c === type[i]).length)) : 0;
    const exact = hm.includes(type), grp = !exact && hm.some(x => mbtiGroup(x) === mbtiGroup(type));
    if (exact) { s += 5; why.unshift("rMbti"); } else if (grp) { s += 2.5; why.unshift("rMbtiG"); }
    s += letters * .5;
    if (l.hot) s += .25;
    return { l, s, why: [...new Set(why)].slice(0, 3) };
  }).filter(Boolean).sort((a, b) => b.s - a.s);
  return { type, rows };
}
const MB_WHY = {
  rMbti: { th:"บุคลิกบ้านตรงกับ {t}", en:"House personality matches {t}", ru:"Характер дома совпадает с {t}", zh:"房屋性格与 {t} 相符", ko:"집의 성격이 {t}와 일치", ja:"家の性格が {t} と一致" },
  rMbtiG: { th:"บุคลิกบ้านอยู่กลุ่มเดียวกับ {t}", en:"House personality in the same group as {t}", ru:"Характер дома из той же группы, что {t}", zh:"房屋性格与 {t} 同组", ko:"집의 성격이 {t}와 같은 그룹", ja:"家の性格が {t} と同じグループ" } };
function renderMatch() {
  const { type, rows } = matchScore();
  const desc = type.split("").map(c => t("d" + c)).join(" · ");
  $("#mres").innerHTML = `<div class="mtype"><b>${type}</b><span>${esc(desc)}</span></div>
    <p style="margin-top:14px;font-weight:600">${t("matchRes")}</p>` +
    (rows.length ? rows.slice(0, 3).map(({ l, why }) => `<a class="mpick" href="#/l/${l.code}"><img src="${esc(photo(l, 1))}" alt="" loading="lazy">
      <div><h4>${esc(nm(l))}</h4><small>📍 ${esc(zn(l.zone))} · ${(mq.deal === "sale" || !l.rent) && l.sale ? money(l.sale) : l.rent ? money(l.rent) + " " + t("perMonth") : "—"}</small>
      <em>${why.map(w => "✓ " + (MB_WHY[w] ? (MB_WHY[w][lang] || MB_WHY[w].en).replace("{t}", type) : t(w))).join("  ")}</em></div></a>`).join("") : `<p style="margin-top:10px;color:#C9D3E0">${t("matchNone")}</p>`);
}

/* ---------- booking ---------- */
function renderBookForm(pre) {
  const cur = pre || $("#bListing").value || "";
  opts($("#bListing"), [["", t("anyListing")], ...L.map(l => [l.code, `${ref(l.code)} · ${nm(l)}`])], cur);
  const keep = id => $(id).value;
  const d = keep("#bDur"), p = keep("#bPets"), pu = keep("#bPurpose"), v = keep("#bView"), c = keep("#bCh");
  opts($("#bDur"), [1, 2, 3, 4, 5].map(n => ["dur" + n, t("dur" + n)]), d || "dur3");
  opts($("#bPets"), [0, 1, 2, 3].map(n => ["pet" + n, t("pet" + n)]), p || "pet0");
  opts($("#bPurpose"), [1, 2, 3].map(n => ["pur" + n, t("pur" + n)]), pu || "pur1");
  opts($("#bView"), [1, 2].map(n => ["view" + n, t("view" + n)]), v || "view1");
  opts($("#bCh"), ["LINE", "WhatsApp", "WeChat", "Telegram", "Phone", "Email"].map(x => [x, x === "Phone" ? t("call") : x === "Email" ? t("email") : x]), c || "LINE");
}
function bookMessage() {
  const l = byCode($("#bListing").value);
  const lab = k => t(k) + ": ";
  const val = id => $(id).value.trim();
  const lines = [t("msgHi") + (l ? ` — ${ref(l.code)} ${nm(l)}` : ""), ""];
  if (l) lines.push(listingUrl(l));
  const add = (k, v) => { if (v) lines.push(lab(k) + v); };
  add("fName", val("#bName")); add("fNation", val("#bNation"));
  add("fBudget", val("#bBudget") ? "฿" + val("#bBudget") : ""); add("fMoveIn", val("#bMove"));
  add("fDuration", t(val("#bDur"))); add("fOcc", val("#bOcc")); add("fPets", t(val("#bPets")));
  add("fPurpose", t(val("#bPurpose"))); add("fViewing", t(val("#bView"))); add("fDate", val("#bDate"));
  add("fChannel", `${val("#bCh")} — ${val("#bHandle")}`); add("fNote", val("#bNote"));
  return lines.join("\n");
}

/* ---------- reviews / about / contact ---------- */
function renderReviews() {
  $("#reviews-sec").hidden = !REVIEWS.length;
  $("#reviews").innerHTML = REVIEWS.map(r => `<div class="review"><div class="stars">${"★".repeat(r.stars || 5)}</div><p>${esc(r.text)}</p><small>${esc(r.name)} · ${esc(r.date || "")}</small></div>`).join("");
}
function renderAbout() {
  $("#why").innerHTML = (SITE.why || ["100+", "6", "1:1"]).map((b, i) => [b, t("why" + (i + 1))]).map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join("");
}
const fmtPhone = p => p.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
function renderContact() {
  $("#contactPerson").textContent = `${t("contactBy")}: ${CONTACT.person}`;
  const C = CONTACT;
  const ch = [
    ["LINE", "#06C755", "L", "https://line.me/ti/p/~" + encodeURIComponent(C.line), C.line],
    ["WhatsApp", "#25D366", "W", "https://wa.me/" + C.whatsapp, "+" + C.whatsapp],
    [t("call"), KEY("brand", "#1F3A5F"), "☎", "tel:" + C.phones[0], C.phones.map(fmtPhone).join(" · ")],
    ["Telegram", "#229ED9", "T", "https://t.me/" + C.telegram, C.telegram],
    ["WeChat", "#07C160", "微", "#", t("wechatAdd"), "wechat"],
    [t("email"), KEY("accent", "#B57A27"), "@", "mailto:" + C.email, C.email],
    ["Facebook Page", "#1877F2", "f", C.facebook, C.facebookName || SITE.name],
    ["Facebook", "#1877F2", "f", C.facebookAgent, C.person]
  ];
  $("#channels").innerHTML = ch.map(([n, col, ic, href, v, cp]) => `<a href="${esc(href)}" ${cp === "wechat" ? "data-wechat" : href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>
    <i style="background:${col}">${ic}</i><div style="min-width:0"><span>${esc(n)}</span><b>${esc(v)}</b></div></a>`).join("");
}

/* ====================================================================
   DETAIL PAGE
   ==================================================================== */
let dmap;
function lineText(l) {
  const s = [`🏡 ${nm(l)} (${ref(l.code)})`, `📍 ${zn(l.zone)} · ${t(l.type)}`];
  if (l.ll) s.push(`🗺️ https://www.google.com/maps?q=${l.ll.join(",")}`);
  const sp = [];
  if (l.beds) sp.push(`🛏 ${l.beds} ${t("beds")}`); if (l.baths) sp.push(`🛁 ${l.baths} ${t("baths")}`);
  if (sp.length) s.push(sp.join(" · "));
  if (area(l)) s.push(`📐 ${t(l.size ? "size" : "usable")} ${nf(area(l))}${l.usablePlus ? "+" : ""} ${t("sqm")}`);
  if (l.land) s.push(`🌳 ${t("land")} ${landTxt(l)}`);
  if (l.pool) s.push(`🏊 ${t(l.pool === "private" ? "poolPrivate" : l.pool === "shared" ? "poolShared" : "poolYes")}`);
  if (l.tags.length) s.push("✨ " + l.tags.map(x => t("tag_" + x)).join(" · "));
  if (l.rent) s.push(`💰 ${t("forRent")} ${money(l.rent)} ${t("perMonth")}${l.rentWas ? ` (${t("wasPrice")} ${money(l.rentWas)})` : ""}`);
  if (l.sale) s.push(`💰 ${t("forSale")} ${money(l.sale)}${l.saleWas ? ` (${t("wasPrice")} ${money(l.saleWas)})` : ""}${l.urgent ? " 🔥 " + t("urgent") : ""}`);
  s.push("", "🔗 " + listingUrl(l), `📞 ${CONTACT.person} ${fmtPhone(CONTACT.phones[0])} · LINE ${CONTACT.line}`);
  return s.join("\n");
}
function kvItem(label, v) { return `<div><span>${esc(label)}</span>${v == null || v === "" ? `<b class="ask">${t("ask")}</b>` : `<b>${esc(v)}</b>`}</div>`; }
function calendar(l) {
  const booked = (l.booked || []).map(([a, b]) => [new Date(a + "T00:00"), new Date(b + "T00:00")]);
  const avail = l.available ? new Date(l.available + "T00:00") : null;
  const known = booked.length || avail;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const loc = { th: "th-TH", en: "en-GB", ru: "ru-RU", zh: "zh-CN", ko: "ko-KR", ja: "ja-JP" }[lang];
  const dow = [...Array(7)].map((_, i) => new Date(2026, 1, i + 2).toLocaleDateString(loc, { weekday: "narrow" }));
  let h = '<div class="cal">';
  for (let m = 0; m < 2; m++) {
    const first = new Date(today.getFullYear(), today.getMonth() + m, 1);
    const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const pad = (first.getDay() + 6) % 7;
    h += `<div class="cal-m"><h3>${first.toLocaleDateString(loc, { month: "long", year: "numeric" })}</h3><div class="cal-g">${dow.map(d => `<span class="dow">${d}</span>`).join("")}${"<span></span>".repeat(pad)}`;
    for (let d = 1; d <= days; d++) {
      const dt = new Date(first.getFullYear(), first.getMonth(), d);
      let c = "d";
      if (dt < today) c += " past";
      else if (booked.some(([a, b]) => dt >= a && dt <= b) || (avail && dt < avail)) c += " bk";
      else if (known) c += " free";
      h += `<span class="${c}">${d}</span>`;
    }
    h += "</div></div>";
  }
  h += "</div>";
  h += known ? `<div class="cal-leg"><span><i style="background:var(--rent-soft);border:1px solid var(--rent)"></i>${t("calFree")}</span><span><i style="background:var(--hot-soft);border:1px solid var(--hot)"></i>${t("calBooked")}</span></div>`
             : `<p class="note" style="margin-top:10px">${t("calUnknown")}</p>`;
  return h + `<p class="note">${t("calNote")}</p>`;
}
// photo note: listings whose photos are not AI-retouched yet (aiEdited:false, the default for Google Sheet rows) drop the "(… AI …)" part
const phNote = l => l.type === "land" ? t(l.aiEdited ? "phNoteLandAI" : "phNoteLand") : l.furn === "none" && (l.type === "house" || l.type === "villa") ? (l.aiEdited === false ? t("phNoteEmpty").replace(/\s*[(（][^()（）]*[)）]\s*$/, "") : t("phNoteEmpty")) : l.aiEdited === false ? t("phNote").replace(/\s*[(（][^()（）]*[)）]\s*$/, "") : t("phNote");
function renderDetail(code) {
  const l = byCode(code);
  if (!l && !DATA_READY) { // Sheet listings arrive a moment after first paint: hold the link until they do
    const dv = $("#detailView"); dv.dataset.code = code; dv.dataset.zone = ""; dv.dataset.page = "";
    dv.innerHTML = `<div class="empty" style="padding:80px 16px;text-align:center">${ref(esc(code))} …</div>`; return;
  }
  if (!l) { location.hash = "#/"; return; }
  const ph = photos(l);
  const on = saved().includes(l.code);
  const yn = v => v == null ? null : v ? t("yes") : t("no");
  const kv = l.type === "land" ? landKv(l) : [
    kvItem(t("code"), ref(l.code)), kvItem(t("type"), t(l.type)), kvItem(t("zone"), zn(l.zone)),
    ...(l.type === "commercial" ? [] : [kvItem(t("beds"), l.beds), kvItem(t("baths"), l.baths)]),
    l.size ? kvItem(t("size"), `${l.size} ${t("sqm")}`) : kvItem(t("usable"), l.usable ? `${nf(l.usable)}${l.usablePlus ? "+" : ""} ${t("sqm")}` : null),
    l.type === "condo" || l.type === "commercial" ? kvItem(t("floor"), l.floor ? l.floor + (l.building ? ` · ${t("building")} ${l.building}` : "") : null) : kvItem(t("land"), landTxt(l)),
    ...(l.type === "commercial" ? [] : [kvItem(t("pool"), l.pool ? t(l.pool === "private" ? "poolPrivate" : l.pool === "shared" ? "poolShared" : "poolYes") : null)]),
    kvItem(t("furn"), l.furn === "full" ? t("furnFull") : l.furn === "none" ? t("furnNone") : l.furn ? l.furn : t("furnPic")), ...(l.type === "commercial" ? [] : [kvItem(t("pets"), yn(l.pets))]), kvItem(t("parking"), l.parking),
    kvItem(t("internet"), l.internet == null ? null : t(l.internet ? "netY" : "netN")), kvItem(t("available"), l.available), ...(utp(l) ? [kvItem(t("utpK"), utpTxt(l))] : []),
    ...(l.rent ? [kvItem(t("deposit"), l.deposit), kvItem(t("minContract"), l.minContract)] : []),
    ...(l.type === "commercial" ? [] : [kvItem(t("shortTerm"), l.shortTerm ? money(l.shortTerm) + " " + t("perNight") : null)])
  ].join("");
  const lkOn = LK_DETAIL && window.LIKit && l.type !== "land" && l.type !== "commercial";
  const similar = SHOWN().filter(x => x.code !== l.code).map(x => ({ x, s: (x.zone === l.zone ? 2 : 0) + (x.type === l.type ? 1 : 0) + (Math.abs((x.beds || 0) - (l.beds || 0)) <= 1 ? 1 : 0) }))
    .sort((a, b) => b.s - a.s).slice(0, 3).map(o => o.x);
  // decor, feng shui, MBTI, safety, styling and the Living Insight kit fold into one closed "More information" box
  const extras = homeStyleSecs(l) + landFengSec(l) + safeStrip(l) + styleSec(l) + (lkOn ? `<div class="d-sec" id="lkHome"></div><div class="d-sec" id="lkBuy"></div>` : "");
  $("#detailView").innerHTML = `
  <div class="wrap">
    <nav class="crumb"><a href="#/listings">${t("back")}</a></nav>
    <div class="d-head"><div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${badges(l)}<span class="code" style="align-self:center">${ref(l.code)}</span></div>
      <h1>${esc(nm(l))}</h1><p class="where">📍 ${esc(zn(l.zone))}</p>${priceRows(l) ? `<div class="m-price">${priceRows(l)}<a class="btn solid sm" href="#/book/${l.code}">📅 ${t("bookThis")}</a></div>` : ""}</div>
      <button type="button" class="btn" data-dstar="${l.code}">${on ? t("saved") : t("save")}</button></div>
    <div class="gal">${ph.slice(0, 5).map((p, i) => `<button type="button" data-lb="${i}"><img src="${esc(p)}" alt="${esc(nm(l))} ${i + 1}" ${i ? 'loading="lazy"' : ""}>${i === 4 && ph.length > 5 ? `<span class="more">+${ph.length - 5} ${t("photos")}</span>` : ""}</button>`).join("")}</div>
    <div class="phmeta"><span>📷 ${ph.length} ${t("photos")} · ${t("phDate")} <b>${fmtDate(l.photoDate || PHOTO_DATE)}</b></span>
      <button type="button" class="btn sm" data-act="dlall">⬇️ ${t("dlAll")}</button>${l.fb ? ` <a class="btn sm" href="${esc(l.fb)}" target="_blank" rel="noopener">Facebook ↗</a>` : ""}</div>
    <p class="phnote">${phNote(l)}</p>
    ${l.youtube ? `<section class="vsec"><h2>🎬 ${t("videoTitle")}</h2><button type="button" class="yt" data-yt="${esc(l.youtube)}" aria-label="Play video"><img src="${esc(l.poster || `https://i.ytimg.com/vi/${l.youtube}/hqdefault.jpg`)}" alt="" loading="lazy"><span class="yt-play"></span></button></section>`
      : l.video ? `<section class="vsec"><h2>🎬 ${t("videoTitle")}</h2><video src="${esc(l.video)}" ${l.poster ? `poster="${esc(l.poster)}"` : ""} controls playsinline preload="none"></video></section>` : ""}
    <div class="d-grid">
      <div>
        ${hlSec(l)}
        ${plotsSec(l)}
        <div class="d-sec"><h2>${t("details")}</h2><div class="kv">${kv}</div></div>
        ${extras ? `<details class="d-more"><summary><b>${t("moreInfo")}</b><small></small></summary>${extras}</details>` : ""}
        <div class="d-sec" style="border:0"><h2>${t("locTitle")}</h2><div id="dmap"></div><p class="mapnote">${l.ll ? `<a class="btn sm" href="https://www.google.com/maps?q=${l.ll.join(",")}" target="_blank" rel="noopener">📍 ${t("gmOpen")} ↗</a> ${t(l.llSrc === "gps" ? "mapGps" : "mapExact")}` : t("mapNote")}</p></div>
        <div class="d-sec" style="border:0">${guideCard(l)}${slCard()}</div>
      </div>
      <aside class="d-side">
        <div class="pbox">
          ${priceRows(l)}
          <div class="acts">
            <a class="btn solid" href="#/book/${l.code}" style="flex-basis:100%">📅 ${t("bookThis")}</a>
            <button type="button" class="btn" data-act="line">💬 ${t("copyLine")}</button>
            <button type="button" class="btn" data-act="share">🔗 ${t("share")}</button>
            <button type="button" class="btn" data-act="social">📣 ${t("social")}</button>
            <button type="button" class="btn" data-act="print">🖨️ ${t("print")}</button>
            <button type="button" class="btn" data-act="dlall" style="flex-basis:100%">⬇️ ${t("dlAll")} (${ph.length})</button>
          </div>
        </div>
        <div class="ch" style="grid-template-columns:repeat(2,minmax(0,1fr))">
          <a href="https://line.me/ti/p/~${encodeURIComponent(CONTACT.line)}" target="_blank" rel="noopener"><i style="background:#06C755">L</i><div><span>LINE</span><b>${esc(CONTACT.line)}</b></div></a>
          <a href="https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(lineText(l))}" target="_blank" rel="noopener"><i style="background:#25D366">W</i><div><span>WhatsApp</span><b>+${CONTACT.whatsapp}</b></div></a>
          ${CONTACT.phones.map(p => `<a href="tel:${p}"><i style="background:${KEY("brand", "#1F3A5F")}">☎</i><div><span>${t("call")}</span><b>${fmtPhone(p)}</b></div></a>`).join("")}
          <a href="#" data-wechat style="grid-column:1/-1"><i style="background:#07C160">微</i><div><span>WeChat</span><b>${t("wechatAdd")}</b></div></a>
        </div>
      </aside>
    </div>
    <section class="sec" style="padding-top:30px"><div class="sec-hd"><h2 style="font-size:24px">${t("similar")}</h2></div><div class="grid">${similar.map(card).join("")}</div></section>
    <p class="d-copy">${t("copyIp")}</p>
  </div>
  <div class="flyer">
    <div class="fl-hd"><div class="fl-brand"><img src="${SITE.emblem}" alt=""><div><b>${SITE.short}</b><small>${SITE.tag}</small><em>${esc(CONTACT.company)}</em></div></div><div style="text-align:right;font-size:8.5pt">${ref(l.code)}<br>${esc(zn(l.zone))}</div></div>
    <img class="fl-hero" src="${esc(ph[0])}" alt="">
    <div class="fl-row">${ph.slice(1, 4).map(p => `<img src="${esc(p)}" alt="">`).join("")}</div>
    <h1 class="fl-t">${esc(nm(l))}</h1>
    <p class="fl-where">📍 ${esc(zn(l.zone))} · ${t(l.type)}</p>
    <div class="fl-p">${l.rent ? `<span>${t("forRent")} ${money(l.rent)} ${t("perMonth")}</span>` : ""}${l.sale ? `<span>${t("forSale")} ${money(l.sale)}</span>` : ""}</div>
    <div class="fl-kv">${[[t("beds"), l.beds], [t("baths"), l.baths], [t(l.size ? "size" : "usable"), area(l) ? nf(area(l)) + (l.usablePlus ? "+" : "") + " " + t("sqm") : null], [t("land"), l.land ? `${nf(Math.round(l.land / 4))} ${t("sqw")}` : null], [t("pool"), l.pool ? t(l.pool === "private" ? "poolPrivate" : l.pool === "shared" ? "poolShared" : "poolYes") : null], [t("floor"), l.type === "condo" || l.type === "commercial" ? l.floor : null]]
      .filter(([, v]) => v != null).map(([k, v]) => `<div><span>${esc(k)}</span>${esc(v)}</div>`).join("")}</div>
    ${l.tags.length ? `<p class="fl-tags">✨ ${l.tags.map(x => esc(t("tag_" + x))).join(" · ")}</p>` : ""}
    <p class="fl-note">📷 ${t("phDate")} ${fmtDate(l.photoDate || PHOTO_DATE)} · ${phNote(l)}</p>
    <div class="fl-ft"><p><b>${esc(CONTACT.person)} · ${esc(CONTACT.company)}</b><br>☎ ${CONTACT.phones.map(fmtPhone).join(" · ")}<br>LINE ${esc(CONTACT.line)} · WhatsApp +${CONTACT.whatsapp}<br>${esc(CONTACT.email)}<br><small style="color:#666">${esc(CONTACT.companyTh)} · ${esc(CONTACT.address)}</small></p>
      <div class="fl-qr"><img id="flQr" alt="QR"><p>${t("scan")}</p></div></div>
  </div>`;
  if (lkOn) {                          // Thailand Living Insight kit (insight/kit.js)
    const tags = l.tags || [], hs = HOME_STYLE[l.code], condo = l.type === "condo";
    const lk = { ...lkBase(), wr: false, kind: condo ? "condo" : "house", sea: tags.includes("seaView"), floor: condo ? parseInt(l.floor, 10) || null : null,
      beds: l.beds || 0, furnished: l.furn !== "none", mbti: hs ? hs.mbti : [], concept: hs ? hs.title : "",
      quota: condo && tags.includes("thaiQuota") ? "TH" : null, price: l.sale, rental: !l.sale };
    LIKit.home($("#lkHome"), lk); LIKit.buy($("#lkBuy"), lk);
  }
  const more = $(".d-more small");
  if (more) more.textContent = [...document.querySelectorAll(".d-more .d-sec > h2")].map(h => h.textContent.replace(/^[^\p{L}\p{N}]+/u, "").split(" · ")[0].trim()).filter(Boolean).join(" · ");
  $("#detailView").dataset.code = l.code; $("#detailView").dataset.zone = "";
  try { const q = qrcode(0, "M"); q.addData(listingUrl(l)); q.make(); $("#flQr").src = q.createDataURL(6, 2); } catch (e) {}
  if (window.L && window.L.map) {
    if (dmap) { dmap.remove(); dmap = null; }
    const z = ZONES[l.zone];
    dmap = window.L.map("dmap", { scrollWheelZoom: false }).setView(l.ll || z.ll, l.ll ? 16 : 13);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 17, attribution: "© OpenStreetMap" }).addTo(dmap);
    // listings with exact coordinates (land plots) get a pin; others show the approximate zone circle
    if (l.ll) window.L.marker(l.ll).addTo(dmap).bindTooltip(`${ref(l.code)}`, { permanent: true, direction: "top" });
    else window.L.circle(z.ll, { radius: 900, color: getComputedStyle(document.documentElement).getPropertyValue("--brand").trim(), weight: 1.5, fillOpacity: .2 }).addTo(dmap).bindTooltip(zn(l.zone), { permanent: true, direction: "center" });
  }
  document.title = `${nm(l)} · ${SITE.name}`;
}

/* ---------- Decor concept, feng shui and MBTI fit (from each home's real photos) ---------- */
// "highlights" section: 3-5 short sentences per listing (asn-hl.json, written from the Sheet + real photos), like the Riviera 2 unit pages; tag chips stay underneath
const HL = {};
// land sold as a whole or plot by plot: children carry parent:"L03" + plotNo (Thor 1 Nov 2026)
function plotsSec(l) {
  if (l.type !== "land") return "";
  const kids = L.filter(x => x.parent === l.code).sort((a, b) => a.plotNo - b.plotNo);
  const par = l.parent && byCode(l.parent);
  if (kids.length) return `<div class="d-sec"><h2>${t("plotsH", { n: kids.length })}</h2><p class="mapnote" style="margin:0 0 10px">${t("plotsP")}</p><div class="plots">${kids.map(k => `<a class="plot" href="#/l/${k.code}"><img src="${esc(photos(k)[0])}" alt="" loading="lazy"><div><b>${t("plotN", { n: k.plotNo })}</b><span>${nf(Math.round(k.land / 4))} ${t("sqw")} · ${nf(k.land)} ${t("sqm")}</span><span class="pp">${k.sale ? money(k.sale) : t("ask")}</span><small>${ref(k.code)}</small></div></a>`).join("")}</div></div>`;
  if (par) return `<div class="d-sec plot-of"><p>${t("plotOf", { n: l.plotNo, all: par.plots || 6 })} <a class="btn sm" href="#/l/${par.code}">${t("plotWhole")} · ${nf(Math.round(par.land / 4))} ${t("sqw")} →</a></p></div>`;
  return "";
}
function hlSec(l) {
  const h = HL[l.code], list = (h && (h[lang] || h.en || h.th)) || [];
  const tags = (l.tags || []).filter(x => t("tag_" + x) !== "tag_" + x).map(x => `<span class="tag">${t("tag_" + x)}</span>`).join("");
  if (!list.length && !tags) return "";
  return `<div class="d-sec hl-sec"><h2>${t(list.length ? "hlTitle" : "highlights")}</h2>${list.length ? `<ul class="hl-list">${list.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${tags ? `<div class="tags"${list.length ? ' style="margin-top:14px"' : ""}>${tags}</div>` : ""}</div>`;
}
const MBTI_GROUPS = { an: { color: "#88619A", types: ["INTJ", "INTP", "ENTJ", "ENTP"] }, di: { color: "#33A474", types: ["INFJ", "INFP", "ENFJ", "ENFP"] },
  se: { color: "#4298B4", types: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"] }, ex: { color: "#D9A032", types: ["ISTP", "ISFP", "ESTP", "ESFP"] } };
const MBTI_ROLE = { INTJ: "Architect", INTP: "Logician", ENTJ: "Commander", ENTP: "Debater", INFJ: "Advocate", INFP: "Mediator",
  ENFJ: "Protagonist", ENFP: "Campaigner", ISTJ: "Logistician", ISFJ: "Defender", ESTJ: "Executive", ESFJ: "Consul",
  ISTP: "Virtuoso", ISFP: "Adventurer", ESTP: "Entrepreneur", ESFP: "Entertainer" };
const mbtiGroup = x => Object.keys(MBTI_GROUPS).find(g => MBTI_GROUPS[g].types.includes(x));
const MBTI_ROLE_L = {"zh": {"INTJ": "建筑师", "INTP": "逻辑学家", "ENTJ": "指挥官", "ENTP": "辩论家", "INFJ": "提倡者", "INFP": "调停者", "ENFJ": "主人公", "ENFP": "竞选者", "ISTJ": "物流师", "ISFJ": "守卫者", "ESTJ": "总经理", "ESFJ": "执政官", "ISTP": "鉴赏家", "ISFP": "探险家", "ESTP": "企业家", "ESFP": "表演者"}, "ko": {"INTJ": "전략가", "INTP": "논리술사", "ENTJ": "통솔자", "ENTP": "변론가", "INFJ": "옹호자", "INFP": "중재자", "ENFJ": "선도자", "ENFP": "활동가", "ISTJ": "현실주의자", "ISFJ": "수호자", "ESTJ": "경영자", "ESFJ": "집정관", "ISTP": "장인", "ISFP": "모험가", "ESTP": "사업가", "ESFP": "연예인"}, "ja": {"INTJ": "建築家", "INTP": "論理学者", "ENTJ": "指揮官", "ENTP": "討論者", "INFJ": "提唱者", "INFP": "仲介者", "ENFJ": "主人公", "ENFP": "運動家", "ISTJ": "管理者", "ISFJ": "擁護者", "ESTJ": "幹部", "ESFJ": "領事", "ISTP": "巨匠", "ISFP": "冒険家", "ESTP": "起業家", "ESFP": "エンターテイナー"}, "ru": {"INTJ": "Стратег", "INTP": "Учёный", "ENTJ": "Командир", "ENTP": "Полемист", "INFJ": "Активист", "INFP": "Посредник", "ENFJ": "Тренер", "ENFP": "Борец", "ISTJ": "Администратор", "ISFJ": "Защитник", "ESTJ": "Менеджер", "ESFJ": "Консул", "ISTP": "Виртуоз", "ISFP": "Артист", "ESTP": "Делец", "ESFP": "Развлекатель"}};
const hsTx = (o, k) => (o[lang] || (lang === "th" ? o.th : o.en))[k];
function homeStyleSecs(l) {
  const h = HOME_STYLE[l.code]; if (!h) return "";
  const legend = `<div class="mbleg"><b>MBTI</b>${Object.keys(MBTI_GROUPS).map(g => `<span><i style="background:${MBTI_GROUPS[g].color}"></i>${t("g_" + g)}</span>`).join("")}</div>`;
  return `<div class="d-sec" id="decor"><h2>${t("stTitle")}</h2>
      <p class="hs-kick">${t("stKicker")}</p><h3 class="hs-title">${esc(h.title)}</h3>
      <p class="hs-text">${esc(hsTx(h, "concept"))}</p>
      <div class="hs-sw">${h.palette.map(([hex, th, en], i) => `<div><i style="background:${hex}"></i><span>${esc((h[lang] && h[lang].pal && h[lang].pal[i]) || (lang === "th" ? th : en))}<code>${hex}</code></span></div>`).join("")}</div>
      <p class="mapnote">${t("stNote")}</p>
      ${wrLink(l.type === "condo" ? "psCtaRoom" : "psCta")}</div>
    <div class="d-sec" id="fengshui"><h2>${t("fsTitle")}</h2>
      <ul class="hs-feng">${hsTx(h, "feng").map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <p class="mapnote">${t("fsNote")}</p>${window.ASND ? ASND.detailCta(l.code) : ""}</div>
    <div class="d-sec" id="mbti"><h2>${t("mbTitle")}</h2>
      <div class="hs-mb">${h.mbti.map(x => { const g = mbtiGroup(x); return `<div style="background:${MBTI_GROUPS[g].color}"><b>${x}</b><small>${(MBTI_ROLE_L[lang] || MBTI_ROLE)[x]}</small><em>${t("g_" + g)}</em></div>`; }).join("")}</div>
      ${legend}
      <p class="hs-text">${esc(hsTx(h, "mbti"))}</p>
      <p class="mapnote">${t("mbNote")} <a href="https://www.16personalities.com/" target="_blank" rel="noopener">16personalities.com ↗</a></p>
      <div class="pm-box"><p class="hs-kick">Personalized Matching</p><h3>${t("pmTitle")}</h3><p>${t("pmText")}</p>
        <b>${t("pmTalk")}</b>
        <div class="pm-btns"><a class="btn sm" href="https://line.me/ti/p/~${encodeURIComponent(CONTACT.line)}" target="_blank" rel="noopener">💬 LINE</a><a class="btn sm" href="tel:${CONTACT.phones[0]}">☎ ${t("call")}</a><a class="btn sm" href="https://www.16personalities.com/" target="_blank" rel="noopener">MBTI test ↗</a></div>
        <a class="pm-quiz" href="#/match">${t("pmQuiz")}</a><br><a class="pm-quiz" href="#/matching">${t("mgLink")}</a></div></div>`;
}

/* ---------- Thailand Living Insight kit (insight/kit.js) ---------- */
const LK_DETAIL = false; // THOR 27 Oct 2026: kit blocks (smart home for your personality, Living Insight buying cards) hidden on listing pages, too busy; true brings them back
const lkBase = () => ({ lang, from: SITE.id, accent: "var(--brand)", wrLogo: SITE.img + "logo-widerooms.jpg", groupName: g => t("g_" + g) });

/* ---------- Persona Styling (WIDEROOMS) ---------- */
const WR_URL = "https://thbho.com/EngWiderooms.html";
const wrLink = key => `<a class="u-wr" href="${WR_URL}" target="_blank" rel="noopener"><img src="${SITE.img}logo-widerooms.jpg" alt="WIDEROOMS"><span>${t(key)}</span></a>`;
function styleSec(l) {
  if (l.type === "commercial" || l.type === "land") return "";
  return `<div class="d-sec" id="styling"><h2>🛋️ ${t("psTitle")}</h2>
    <p class="pslede">${t("psLede")}</p>
    <div class="pslv">${[1, 2, 3].map(n => `<div><b><i>${n}</i>${t("ps" + n)}</b><p>${t("ps" + n + "p")}</p><span>${t("ps" + n + "t")}</span></div>`).join("")}</div>
    <p class="psnote">${t("psNote")}</p>
    ${wrLink(l.type === "condo" ? "psCtaRoom" : "psCta")}</div>`;
}

/* ---------- Safe Zone ---------- */
const szTx = o => o ? (o[lang] || (lang === "th" ? o.th : o.en)) : "";
const szBadge = (label, lvl) => `<span class="szb szb-${lvl}">${esc(label)} · ${t("lvl_" + lvl)}</span>`;
function szRows(z) {
  const S = SAFE_ZONES[z]; if (!S) return [];
  // Sattahip cites its own ThinkHazard report in the shared quake row
  const quake = S.district === "sattahip" ? { ...SZ_COMMON.quake, src: SZ_COMMON.quake.src.map(x => x === "thinkhazard" ? "thSattahip" : x) } : SZ_COMMON.quake;
  return [["szFlood", S.flood], ["szQuake", quake], ["szWind", S.wind || SZ_COMMON.wind], ...(S.coast ? [["szCoast", S.coast]] : []), ...(S.slope ? [["szSlope", S.slope]] : [])];
}
const szLabel = (k, h) => t(k) + (h.scope ? ` (${szTx(h.scope)})` : "");
function safeStrip(l) {
  if (!SAFE_ZONES[l.zone]) return "";
  const s = l.safe || {};
  const qa = ["floor", "elec", "backup", "drain"].map((k, i) => `<li><span>${t("szQ" + (i + 1))}</span><b class="${s[k] ? "" : "szpend"}">${esc(s[k] || t("szPending"))}</b></li>`).join("");
  return `<div class="d-sec" id="safe"><h2>🛡️ ${t("szTitle")} · ${esc(zn(l.zone))}</h2>
    <div class="szbs">${szRows(l.zone).filter(([k]) => !(l.szHide || []).includes(k)).map(([k, h]) => szBadge(szLabel(k, h), h.lvl)).join("")}</div>
    ${l.type === "land" ? "" : `<h3 class="szh3">${t("szHouse")}</h3><ul class="szqa">${qa}</ul>`}
    <p class="szbtns"><a class="btn sm" href="#/zone/${l.zone}">${t("szRead")} →</a> ${slBtn()}</p></div>`;
}
function renderZone(z) {
  const S = SAFE_ZONES[z];
  if (!S) { location.hash = "#/"; return; }
  const ls = SHOWN().filter(l => l.zone === z);
  const srcIds = [...new Set([...szRows(z).flatMap(([, h]) => h.src), ...S.events.map(e => e[3]), S.district === "sattahip" ? "thSattahip" : "thinkhazard",
    ...(LAND_ZONES[z] ? [...LAND_ZONES[z].en[1].map(p => p[1]).filter(Boolean), "landRules"] : [])])];
  const src = id => { const i = srcIds.indexOf(id); return i < 0 ? "" : `<sup><a href="#" data-szs="${id}" title="${esc(SZ_SRC[id].n)}">[${i + 1}]</a></sup>`; };
  $("#detailView").innerHTML = `
  <div class="wrap szpage">
    <nav class="crumb"><a href="${LAND_ZONES[z] ? "#/land" : "#/map"}">${t("back")}</a></nav>
    <p class="eyebrow">🛡️ ${t("szTitle")}</p>
    <h1>${esc(zn(z))}</h1>
    <p class="where">${t("szSub")} · ${t("szUpdated")} <b>${fmtDate(S.updated || SZ_UPDATED)}</b></p>
    ${t("szLangNote") ? `<p class="phnote">${t("szLangNote")}</p>` : ""}
    ${landOverview(z, src)}
    <div class="szcards">${szRows(z).map(([k, h]) => `<div class="szc szc-${h.lvl}"><div class="szc-hd"><h2>${esc(szLabel(k, h))}</h2><span class="szb szb-${h.lvl}">${t("lvl_" + h.lvl)}</span></div><p>${esc(szTx(h))} ${h.src.map(src).join("")}</p></div>`).join("")}</div>
    ${S.events.length ? `<div class="d-sec"><h2>${t("szEvents")}</h2><ul class="szev">${S.events.map(e => `<li><time>${esc(e[0].length === 10 ? fmtDate(e[0]) : e[0])}</time><span>${esc(lang === "th" ? e[1] : (e[4] && e[4][lang]) || e[2])} ${src(e[3])}</span></li>`).join("")}</ul></div>` : ""}
    <div class="d-sec"><h2>${t(S.district === "sattahip" ? "szProvSat" : "szProv")}</h2><div class="szbs">${(SZ_DISTRICT[S.district] || SZ_PROVINCE).map(([k, v]) => szBadge(t("hz_" + k), v)).join("")}</div></div>
    <p class="szbtns" style="margin-top:14px">${S.deep ? `<a class="btn sm" href="${esc(S.deep.u)}" target="_blank" rel="noopener">📄 ${t("szDeep")}: ${esc(szTx(S.deep))} ↗</a> ` : ""}${slBtn()}</p>
    <p class="phnote" style="margin-top:18px">${t("szRule")}</p>
    ${ls.length ? `<section class="sec" style="padding-top:26px"><div class="sec-hd"><h2 style="font-size:22px">${t(LAND_ZONES[z] ? "ldPlots" : "szProps")} (${ls.length})</h2></div><div class="grid">${ls.map(l => card(l)).join("")}</div></section>` : LAND_ZONES[z] ? `<p class="phnote" style="margin-top:18px">${t("ldSoon")}</p>` : ""}
    <div class="d-sec" style="border:0"><h2>${t("szSources")}</h2><ol class="szsrc">${srcIds.map(id => { const s = SZ_SRC[id]; return `<li id="szs-${id}"><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.n)}</a> · ${fmtDate(s.d)}</li>`; }).join("")}</ol></div>
    <p class="d-copy">${t("copyIp")}</p>
  </div>`;
  $("#detailView").dataset.code = ""; $("#detailView").dataset.zone = z;
  document.title = `${t("szTitle")} · ${zn(z)} · ${SITE.name}`;
}
function renderSzLinks() {
  const el = $("#szLinks"); if (!el) return;
  el.innerHTML = `<b>🛡️ ${t("szAllZones")}:</b> ` + Object.keys(SAFE_ZONES).map(z => `<a href="#/zone/${z}">${esc(zn(z))}</a>`).join(" · ") +
    `<br><b>🗺️</b> <a href="${slUrl()}">${slTx("link")} →</a>`;
}

/* ---------- MBTI & feng shui guide (#/matching) ----------
   Research claims are tied to MG_REFS; example homes are listing codes. */
const MG_REFS = [
  { id: "gosling", cite: "Gosling, S. D., Ko, S. J., Mannarelli, T., & Morris, M. E. (2002). A room with a cue: Personality judgments based on offices and bedrooms. Journal of Personality and Social Psychology, 82(3), 379–398.", url: "https://pubmed.ncbi.nlm.nih.gov/11902623/" },
  { id: "jokela", cite: "Jokela, M., Bleidorn, W., Lamb, M. E., Gosling, S. D., & Rentfrow, P. J. (2015). Geographically varying associations between personality and life satisfaction in the London metropolitan area. PNAS, 112(3), 725–730.", url: "https://www.pnas.org/doi/10.1073/pnas.1415800112" },
  { id: "oishi", cite: "Oishi, S., Talhelm, T., & Lee, M. (2015). Personality and geography: Introverts prefer mountains. Journal of Research in Personality, 58, 55–68.", url: "https://www.sciencedirect.com/science/article/abs/pii/S0092656615300027" },
  { id: "graham", cite: "Graham, L. T., Gosling, S. D., & Travis, C. K. (2015). The psychology of home environments: A call for research on residential space. Perspectives on Psychological Science, 10(3), 346–356.", url: "https://journals.sagepub.com/doi/abs/10.1177/1745691615576761" },
  { id: "mccrae", cite: "McCrae, R. R., & Costa, P. T. (1989). Reinterpreting the Myers-Briggs Type Indicator from the perspective of the five-factor model of personality. Journal of Personality, 57(1), 17–40.", url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-6494.1989.tb00759.x" },
  { id: "dosen", cite: "Dosen, A. S., & Ostwald, M. J. (2016). Evidence for prospect-refuge theory: a meta-analysis of the findings of environmental preference research. City, Territory and Architecture, 3, 4.", url: "https://link.springer.com/article/10.1186/s40410-016-0033-1" },
  { id: "ulrich", cite: "Ulrich, R. S. (1984). View through a window may influence recovery from surgery. Science, 224(4647), 420–421.", url: "https://pubmed.ncbi.nlm.nih.gov/6143402/" },
  { id: "fortin", cite: "Fortin, N. M., Hill, A. J., & Huang, J. (2014). Superstition in the housing market. Economic Inquiry, 52(3), 974–993.", url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/ecin.12066" },
  { id: "bourassa", cite: "Bourassa, S. C., & Peng, V. S. (1999). Hedonic prices and house numbers: The influence of feng shui. International Real Estate Review, 2(1), 79–93.", url: "https://ideas.repec.org/a/ire/issued/v02n011999p79-93.html" },
  { id: "pittenger", cite: "Pittenger, D. J. (2005). Cautionary comments regarding the Myers-Briggs Type Indicator. Consulting Psychology Journal: Practice and Research, 57(3), 210–221.", url: "https://www.researchgate.net/publication/232494957_Cautionary_comments_regarding_the_Myers-Briggs_Type_Indicator" }
];
const MG_EL = {
  wood:  { color: "#4E8A5B", icon: "🌿", homes: ["H11", "H06", "C04", "C05", "H13"] },
  fire:  { color: "#C8553D", icon: "🔥", homes: ["H10", "H12", "H07"] },
  earth: { color: "#B08A4E", icon: "⛰️", homes: ["H09", "H05", "H04", "H14"] },
  metal: { color: "#8A919B", icon: "◇", homes: ["H01", "H07", "C03"] },
  water: { color: "#2F6A9A", icon: "💧", homes: ["H02", "C01", "H03", "H08"] }
};
const MG_RULE_HOMES = { front: ["H05", "H13", "H01"], command: ["C04", "H04"], water: ["H10", "H09", "H02"], line: ["C04", "C03"], beam: ["H14", "H12"], zone: ["H02", "H03", "H11"] };
const MG_RULE_ICON = { front: "🌳", command: "🛏️", water: "⛲", line: "🚪", beam: "📐", zone: "🧭" };

function renderGuide() {
  const a = MATCHING_GUIDE[lang] || MATCHING_GUIDE.en;
  const refNo = id => MG_REFS.findIndex(r => r.id === id) + 1;
  const sup = id => id ? `<sup><a href="#" class="mg-sup" data-mgref="${id}">[${refNo(id)}]</a></sup>` : "";
  const chip = c => { const l = byCode(c), h = HOME_STYLE[c]; if (!l) return "";
    return `<a class="mg-home" href="#/l/${c}"><img src="${photos(l)[0]}" alt="" loading="lazy"><span><b>${c}</b>${esc(h ? h.title : nm(l))}</span></a>`; };
  // showcase photos: the strongest homes of each list first (TOP_PICKS order), Sattahip/land left out
  const showPick = (list, n) => list.filter(c => { const l = byCode(c); return l && l.zone !== "sattahip" && l.type !== "land"; })
    .map(c => [c, TOP_PICKS.indexOf(c)]).sort((a, b) => (a[1] < 0 ? 999 : a[1]) - (b[1] < 0 ? 999 : b[1])).slice(0, n).map(x => x[0]);
  const shot = c => { const l = byCode(c), h = HOME_STYLE[c]; return `<a class="mg-shot" href="#/l/${c}"><img src="${photos(l)[0]}" alt="${esc(h ? h.title : nm(l))}" loading="lazy"><span><b>${c}</b>${esc(h ? h.title : nm(l))}</span></a>`; };
  const shots = (list, n) => { const p = showPick(list, n); return p.length ? `<div class="mg-shots n${p.length}">${p.map(shot).join("")}</div>` : ""; };
  // each home is listed under the group of its first MBTI type; other fits are shown as plain links
  const inGroup = g => Object.keys(HOME_STYLE).filter(c => byCode(c) && mbtiGroup(HOME_STYLE[c].mbti[0]) === g);
  const alsoIn = g => Object.keys(HOME_STYLE).filter(c => byCode(c) && mbtiGroup(HOME_STYLE[c].mbti[0]) !== g && HOME_STYLE[c].mbti.some(x => mbtiGroup(x) === g));
  const elTag = k => `<span class="mg-el" style="--el:${MG_EL[k].color}">${MG_EL[k].icon} ${esc(a.elements[k].n)}</span>`;
  const ids = ["mg-why", "mg-dims", "mg-groups", "mg-five", "mg-rules", "mg-start"];
  $("#detailView").innerHTML = `
  <div class="wrap mg">
    <nav class="crumb"><a href="#/">${t("back")}</a></nav>
    <header class="mg-hero">
      <div class="mg-hero-txt">
        <p class="eyebrow">${esc(a.eyebrow)}</p>
        <h1>${esc(a.title)}</h1>
        <p class="mg-lede">${esc(a.lede)}</p>
        <div class="mg-swatch">${Object.keys(MBTI_GROUPS).map(g => `<i style="background:${MBTI_GROUPS[g].color}"></i>`).join("")}<span></span>${Object.keys(MG_EL).map(k => `<i style="background:${MG_EL[k].color}"></i>`).join("")}</div>
      </div>
      <img class="mg-hero-img" src="${SITE.matchHero}" alt="">
    </header>
    <nav class="mg-toc">${a.toc.map((x, i) => `<a href="#" data-mgjump="${ids[i]}">${esc(x)}</a>`).join("")}</nav>

    <section class="mg-sec" id="mg-why"><h2>${esc(a.whyH)}</h2>
      <div class="mg-why">${a.why.map(w => `<article><h3>${esc(w.h)}</h3><p>${esc(w.p)} ${sup(w.ref)}</p></article>`).join("")}</div></section>

    <section class="mg-sec" id="mg-dims"><h2>${esc(a.dimsH)}</h2>
      <div class="mg-dims">${a.dims.map(d => `<div class="mg-dim"><div class="mg-k">${d.k}<small>${esc(d.h)}</small></div>
        <div class="mg-ab"><div><b>${esc(d.a[0])}</b><p>${esc(d.a[1])}</p></div><div><b>${esc(d.b[0])}</b><p>${esc(d.b[1])}</p></div></div></div>`).join("")}</div>
      <p class="mapnote">${esc(a.dimsNote)} ${sup("mccrae")}</p></section>

    <section class="mg-sec" id="mg-groups"><h2>${esc(a.groupsH)}</h2>
      <div class="mg-groups">${Object.keys(MBTI_GROUPS).map(g => { const G = a.groups[g], list = inGroup(g);
        return `<div class="mg-group"><div class="mg-gtop" style="background:${MBTI_GROUPS[g].color}"><b>${t("g_" + g)}</b><span>${MBTI_GROUPS[g].types.join(" · ")}</span></div>${shots(list, 3)}
          <div class="mg-gbody"><h3>${esc(G.h)}</h3><p>${esc(G.p)}</p>
            <dl class="mg-bal"><div><dt>${esc(a.elFit)}</dt><dd>${elTag(G.el)}</dd></div><div><dt>${esc(a.elAdd)}</dt><dd>${elTag(G.add)}</dd></div></dl>
            <p class="mg-addp">${esc(G.addP)}</p>
            <details class="mg-fold"><summary><span class="mg-op">${t("mgShow", { n: list.length })}</span><span class="mg-cl">${t("mgHide")}</span></summary><div class="mg-homes">${list.map(chip).join("")}
              ${alsoIn(g).length ? `<p class="mg-also"><small>${esc(a.alsoFits)}:</small> ${alsoIn(g).map(c => `<a href="#/l/${c}">${c}</a>`).join(" · ")}</p>` : ""}</div></details></div></div>`; }).join("")}</div>
      <p class="mapnote">${esc(a.groupsNote)}</p></section>

    <section class="mg-sec" id="mg-five"><h2>${esc(a.fsH)}</h2><p class="mg-p">${esc(a.fsLede)}</p>
      <div class="mg-five">${Object.keys(MG_EL).map(k => { const E = a.elements[k];
        return `<div class="mg-elc" style="--el:${MG_EL[k].color}"><div class="mg-elhd"><span>${MG_EL[k].icon}</span><b>${esc(E.n)}</b></div>
          ${shots(MG_EL[k].homes, 1)}<p class="mg-elc-c">${esc(E.c)}</p><p><b>${esc(E.f)}</b></p><p>${esc(E.who)}</p>
          <details class="mg-fold"><summary><span class="mg-op">${esc(a.elSeen)} (${MG_EL[k].homes.length})</span><span class="mg-cl">${t("mgHide")}</span></summary><div class="mg-homes sm">${MG_EL[k].homes.map(chip).join("")}</div></details></div>`; }).join("")}</div></section>

    <section class="mg-sec" id="mg-rules"><h2>${esc(a.rulesH)}</h2><p class="mg-p">${esc(a.rulesLede)}</p>
      <div class="mg-rules">${a.rules.map(r => `<div class="mg-rule"><div class="mg-rhd"><span>${MG_RULE_ICON[r.k]}</span><h3>${esc(r.h)}</h3></div>
        <p>${esc(r.p)} ${sup(r.ref)}</p><em>${esc(r.tag)}</em>
        <div class="mg-rex"><small>${esc(a.rulesSeen)}:</small> ${MG_RULE_HOMES[r.k].filter(byCode).map(c => `<a href="#/l/${c}">${c}</a>`).join(" · ")}</div></div>`).join("")}</div></section>

    ${window.LIKit ? `<section class="mg-sec" id="lkTypes"></section>` : ""}

    <section class="mg-sec"><h2>${esc(a.pillarsH)}</h2>
      <div class="mg-pillars">${a.pillars.map(p => `<div><h3>${esc(p.h)}</h3><p>${esc(p.p)} ${sup(p.ref)}${sup(p.ref2)}</p></div>`).join("")}</div></section>

    <section class="mg-sec" id="mg-start"><h2>${esc(a.stepsH)}</h2>
      <ol class="mg-steps">${a.steps.map(s => `<li><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p></li>`).join("")}</ol>
      <div class="pm-box"><p class="hs-kick">Personalized Matching</p><h3>${esc(a.ctaH)}</h3><p>${esc(a.ctaP)}</p>
        <div class="pm-btns"><a class="btn sm" href="https://line.me/ti/p/~${encodeURIComponent(CONTACT.line)}" target="_blank" rel="noopener">💬 LINE</a><a class="btn sm" href="tel:${CONTACT.phones[0]}">☎ ${t("call")}</a><a class="btn sm" href="https://www.16personalities.com/" target="_blank" rel="noopener">${esc(a.testBtn)} ↗</a><a class="btn sm" href="#/match">${esc(a.quizBtn)}</a></div></div>
      <a class="u-wr" href="${WR_URL}" target="_blank" rel="noopener"><img src="${SITE.img}logo-widerooms.jpg" alt="WIDEROOMS"><span>${esc(a.wr)} →</span></a></section>

    <section class="mg-sec mg-honest"><h2>${esc(a.honestH)}</h2>
      <ul>${a.honest.map(h => `<li>${esc(h.p)} ${sup(h.ref)}</li>`).join("")}</ul></section>

    <section class="mg-sec"><h2>${esc(a.refsH)}</h2>
      <ol class="mg-refs">${MG_REFS.map(r => `<li id="mgref-${r.id}">${esc(r.cite)} <a href="${r.url}" target="_blank" rel="noopener">${esc(a.readMore)} ↗</a></li>`).join("")}</ol></section>
    <p class="d-copy">${t("copyIp")}</p>
  </div>`;
  if (window.LIKit) LIKit.types($("#lkTypes"), lkBase());
  $("#detailView").dataset.code = ""; $("#detailView").dataset.zone = ""; $("#detailView").dataset.page = "matching";
  document.title = `${a.crumb} · Personalized Matching · ${SITE.name}`;
}
const MATCHING_GUIDE = {
  th: {
    crumb: "MBTI และฮวงจุ้ย",
    eyebrow: "Personalized Matching · " + SITE.name,
    title: "บ้านที่ใช่ เริ่มจากการรู้จักตัวเอง",
    lede: "คู่มือสั้นๆ ว่าบุคลิกภาพ (MBTI) และหลักฮวงจุ้ยช่วยเลือกบ้านได้อย่างไร งานวิจัยบอกอะไร ส่วนไหนเป็นความเชื่อ และบ้านแต่ละหลังของ " + SITE.short + " เข้ากับใคร",
    toc: ["งานวิจัย", "MBTI 4 มิติ", "4 กลุ่มบุคลิก", "ฮวงจุ้ย 5 ธาตุ", "หลักฮวงจุ้ยในบ้าน", "เริ่มจับคู่"],
    whyH: "งานวิจัยบอกอะไรเรื่องบุคลิกภาพกับบ้าน",
    why: [
      { ref: "gosling", h: "บ้านสะท้อนตัวตนของเรา", p: "นักจิตวิทยาให้คนแปลกหน้าดูแค่ห้องนอนหรือห้องทำงานของผู้อื่น ผู้สังเกตหลายคนประเมินบุคลิกเจ้าของห้องได้ตรงกัน และแม่นยำในระดับหนึ่ง พื้นที่ที่เราอยู่จึงเก็บร่องรอยตัวตนของเราไว้จริง" },
      { ref: "jokela", h: "ที่อยู่ที่เข้ากับเรา ส่งผลต่อความพึงพอใจในชีวิต", p: "การศึกษาผู้อยู่อาศัยในลอนดอน 56,019 คน จาก 216 เขตไปรษณีย์ พบว่าบุคลิกเดียวกันสัมพันธ์กับความพึงพอใจในชีวิตต่างกันไปตามย่าน นักวิจัยเรียกว่า person–environment fit" },
      { ref: "oishi", h: "แม้แต่ทำเลก็เลือกตามบุคลิก", p: "คนที่ชอบเข้าสังคมมักชอบทะเล คนที่ชอบความสงบมักชอบภูเขา เพราะชายหาดเปิดโล่งและมีผู้คน ส่วนภูเขาให้ความเป็นส่วนตัว พัทยามีทั้งสองแบบ ตั้งแต่ริมหาดจอมเทียนถึงเนินเขารอบทะเลสาบมาบประชัน" },
      { ref: "graham", h: "บ้านสำคัญ แต่มักเลือกด้วยตัวเลขอย่างเดียว", p: "คนทุ่มเวลาและเงินจำนวนมากกับการเลือกและแต่งบ้าน แต่แทบไม่มีใครถามว่าบ้านหลังนั้นเข้ากับตัวเราหรือเปล่า นี่คือช่องว่างที่ Personalized Matching เข้ามาเติม" }
    ],
    dimsH: "MBTI 4 มิติ กับสิ่งที่ควรมองหาในบ้าน",
    dimsNote: "สี่มิติของ MBTI สัมพันธ์กับ 4 ใน 5 มิติของ Big Five ซึ่งเป็นกรอบที่นักจิตวิทยาใช้กันแพร่หลาย",
    dims: [
      { k: "E · I", h: "พลังงานมาจากไหน", a: ["E · ชอบพบปะผู้คน", "ห้องนั่งเล่นโล่ง โต๊ะอาหารยาว ศาลาริมสระ ห้องคาราโอเกะหรือพื้นที่ปาร์ตี้"], b: ["I · ชาร์จพลังด้วยความสงบ", "ห้องนอนแยกจากโซนรับแขก มุมอ่านหนังสือ สวนร่มรื่น ทำเลบนเนินหรือริมทะเลสาบ"] },
      { k: "S · N", h: "รับรู้โลกแบบไหน", a: ["S · เชื่อสิ่งที่จับต้องได้", "ผังใช้งานง่าย ที่เก็บของพอ ครัวครบ บ้านที่เห็นแล้วรู้ว่าอยู่ได้ทันที"], b: ["N · มองเห็นความเป็นไปได้", "บ้านมีคาแรกเตอร์ เช่น สไตล์เมดิเตอร์เรเนียนหรือทัสคานี หรือพื้นที่ที่ปรับเป็นของตัวเองได้"] },
      { k: "T · F", h: "ตัดสินใจด้วยอะไร", a: ["T · ใช้เหตุผลและตัวเลข", "ราคาต่อ ตร.ม. ค่าดูแลสระและสวน ผลตอบแทนการปล่อยเช่า เทียบกับหลังอื่น"], b: ["F · ใช้ความรู้สึก", "แสง บรรยากาศ ความอบอุ่น และความรู้สึกว่า ‘ที่นี่คือบ้าน’"] },
      { k: "J · P", h: "ใช้ชีวิตแบบไหน", a: ["J · ชอบความเป็นระเบียบ", "แบ่งโซนชัด เฟอร์นิเจอร์ครบ ทุกอย่างมีที่ทาง"], b: ["P · ชอบความยืดหยุ่น", "พื้นที่โล่งปรับง่าย ดูแลน้อย ล็อกบ้านแล้วออกเดินทางได้"] }
    ],
    groupsH: "4 กลุ่มบุคลิก กับบ้านของ " + SITE.short + "",
    groupsNote: "รายชื่อมาจากส่วน ‘MBTI ที่เหมาะ’ ในหน้าทรัพย์แต่ละหลัง",
    groups: {
      an: { h: "บ้านที่คิดมาแล้ว", p: "ผังมีประสิทธิภาพ ดูเนี้ยบทุกมุม มีมุมโฟกัสและทำงาน", el: "metal", add: "wood", addP: "เติมไม้และต้นไม้ ให้บ้านไม่แข็งเกินไปและช่วยจุดประกายความคิด" },
      di: { h: "บ้านที่มีหัวใจ", p: "อบอุ่น แสงดี มีเรื่องราว มีมุมของตัวเองและพื้นที่ให้คนสำคัญ", el: "wood", add: "earth", addP: "เติมโทนดิน ครีม และดินเผา ช่วยให้รู้สึกมั่นคงและติดดิน" },
      se: { h: "บ้านที่มั่นคง", p: "พร้อมอยู่ ดูแลง่าย ห้องนอนพอสำหรับทุกคน ไว้ใจได้ในระยะยาว", el: "earth", add: "fire", addP: "เติมแสงอุ่นและสีส้มหรือพีชเล็กน้อย ให้บ้านมีชีวิตชีวา" },
      ex: { h: "บ้านที่พร้อมให้ใช้ชีวิต", p: "สระ ศาลา ปาร์ตี้ กีฬา และกิจกรรมกลางแจ้ง", el: "fire", add: "water", addP: "เติมน้ำและโทนฟ้า ให้มีมุมพักใจหลังวันที่สนุกเต็มที่" }
    },
    elFit: "ธาตุที่มักเข้ากัน",
    alsoFits: "เข้ากันได้ด้วย",
    elAdd: "ธาตุที่ช่วยถ่วงดุล",
    fsH: "ฮวงจุ้ยกับบุคลิก: 5 ธาตุในบ้าน",
    fsLede: "ฮวงจุ้ยมองบ้านผ่าน 5 ธาตุ คือ ไม้ ไฟ ดิน ทอง และน้ำ แต่ละธาตุมีสี วัสดุ และรูปทรงของตัวเอง บ้านที่ธาตุสมดุลจะรู้สึกสบาย ส่วนธาตุที่ ‘เข้ากับบุคลิก’ ด้านล่างเป็นการตีความของเราเพื่อใช้คุยเรื่องการแต่งบ้าน ไม่ใช่ตำราดั้งเดิม",
    elements: {
      wood:  { n: "ไม้", c: "เขียว ไม้ธรรมชาติ ต้นไม้", f: "การเติบโต ความสดชื่น ความใส่ใจ", who: "คนที่ชอบเรียนรู้ ดูแลผู้อื่น และอยากให้บ้านมีชีวิต" },
      fire:  { n: "ไฟ", c: "แดง ส้ม พีช แสงอุ่น", f: "พลัง ความสนุก การเข้าสังคม", who: "คนที่ชอบสังสรรค์ ชอบกิจกรรม และอยากให้บ้านคึกคัก" },
      earth: { n: "ดิน", c: "ครีม ทราย ดินเผา หินทราเวอร์ทีน", f: "ความมั่นคง ความอบอุ่น ความไว้ใจ", who: "คนที่ให้ความสำคัญกับครอบครัว ความเป็นระเบียบ และการอยู่ระยะยาว" },
      metal: { n: "ทอง (โลหะ)", c: "ขาว เทา ทอง หินอ่อน", f: "ความชัดเจน ความเนี้ยบ ความเป็นระเบียบ", who: "คนที่ชอบความเรียบหรู ตัดสินใจด้วยเหตุผล และชอบบ้านที่ดูดีทุกมุม" },
      water: { n: "น้ำ", c: "น้ำเงิน ดำ สระน้ำ วิวทะเล", f: "ความสงบ การไหลเวียน ความคิดลึก", who: "คนที่ชอบความสงบ คิดลึก และต้องการพื้นที่พักใจ" }
    },
    elSeen: "เห็นได้ในบ้าน",
    rulesH: "หลักฮวงจุ้ยในบ้าน ที่เราใช้ในหน้าทรัพย์",
    rulesLede: "หลายข้อตรงกับสิ่งที่งานออกแบบและจิตวิทยาสภาพแวดล้อมพบ บางข้อเป็นความเชื่อล้วนๆ เราบอกไว้ตรงๆ ในแต่ละข้อ",
    rules: [
      { k: "front", h: "พื้นที่โล่งหน้าบ้าน (หมิงถัง)", p: "สนามหญ้าหรือลานหน้าบ้านที่เปิดโล่ง ถือว่ารับพลังดีเข้าบ้าน ในทางปฏิบัติคือแสง ลม และวิวที่ดี", tag: "ความเชื่อ + การออกแบบ" },
      { k: "command", ref: "dosen", h: "ตำแหน่งบัญชาการ", p: "วางเตียงหรือโต๊ะทำงานให้มองเห็นประตู โดยมีผนังทึบอยู่ข้างหลัง ตรงกับทฤษฎี prospect–refuge ที่ว่าคนชอบจุดที่มองเห็นรอบตัวและมีที่กำบัง งานทบทวนพบหลักฐานเรื่อง ‘มองเห็น’ ชัดกว่าเรื่อง ‘ที่กำบัง’", tag: "มีงานวิจัยรองรับบางส่วน" },
      { k: "water", ref: "ulrich", h: "น้ำต้องใสและไหลเวียน", p: "สระ น้ำพุ และบ่อปลาถือเป็นธาตุน้ำที่เรียกทรัพย์ ต้องสะอาดและไม่นิ่ง งานวิจัยพบว่าวิวธรรมชาติช่วยให้คนฟื้นตัวเร็วขึ้น สวนและน้ำจึงดีต่อใจด้วย", tag: "ความเชื่อ + มีงานวิจัยรองรับ" },
      { k: "line", h: "ประตูไม่ควรตรงกับหน้าต่างหรือระเบียง", p: "ถ้าเดินจากประตูทะลุถึงระเบียงเป็นเส้นตรง เชื่อว่าพลังจะไหลออกเร็ว แก้ได้ด้วยฉาก ชั้นหนังสือ หรือต้นไม้", tag: "ความเชื่อ" },
      { k: "beam", h: "เลี่ยงคานเหนือหัวและมุมแหลม", p: "ไม่นอนหรือนั่งทำงานใต้คานตรงๆ เลือกเส้นโค้งมากกว่ามุมแหลม ผ้าม่าน ไฟ หรือฝ้าช่วยลดความแข็งได้", tag: "ความเชื่อ + ความรู้สึกสบาย" },
      { k: "zone", h: "แยกโซนพักผ่อนกับโซนสังสรรค์", p: "ห้องนอนควรอยู่ห่างจากประตูหน้า ครัว และโซนปาร์ตี้ ห้องน้ำใกล้ทางเข้าให้ปิดประตูไว้เสมอ", tag: "การออกแบบ" }
    ],
    rulesSeen: "ตัวอย่าง",
    pillarsH: "ความสุข ความสบาย และโชคลาภ",
    pillars: [
      { h: "ความสุข", p: "บ้านที่เข้ากับบุคลิกช่วยให้ชีวิตประจำวันลื่นไหล ตามแนวคิด person–environment fit ที่งานวิจัยพบว่าสัมพันธ์กับความพึงพอใจในชีวิต" },
      { h: "ความสบาย", p: "ผัง แสง เสียง และการแบ่งโซนที่ตรงกับวิธีใช้ชีวิตจริง ไม่ใช่แค่ขนาดหรือราคา" },
      { h: "โชคลาภ", ref: "fortin", ref2: "bourassa", p: "งานวิจัยตลาดบ้านแวนคูเวอร์ราว 117,000 รายการพบว่าบ้านเลขท้าย 8 ขายได้แพงกว่า 2.5% และเลขท้าย 4 ถูกกว่า 2.2% งานที่โอ๊คแลนด์ก็พบว่าเลขมงคลสะท้อนในราคาบ้าน ไม่ว่าจะเชื่อหรือไม่ ความเชื่อนี้มีผลต่อมูลค่าจริง" }
    ],
    stepsH: "Personalized Matching ทำงานอย่างไร",
    steps: [
      { h: "รู้จักบุคลิกของคุณ", p: "ทำแบบทดสอบที่ 16personalities.com แล้วส่งผล 4 ตัวอักษรให้เรา หรือตอบคำถามสั้นๆ ในหน้าหาบ้านที่ใช่" },
      { h: "เล่าชีวิตที่คุณต้องการ", p: "บอกเราเรื่องไลฟ์สไตล์ คนที่จะอยู่ด้วย งบประมาณ ซื้อหรือเช่า และสิ่งที่ขาดไม่ได้" },
      { h: "เราคัดบ้านที่เข้ากับคุณ", p: "จับคู่บุคลิก ผังบ้าน ทำเล ความปลอดภัยของโซน ฮวงจุ้ย และงบ แล้วเสนอหลังที่ใกล้ที่สุด" },
      { h: "ชมบ้านจริงแล้วตัดสินใจ", p: "นัดชมพร้อมข้อมูลครบ และถ้าอยากแต่งให้เข้ากับตัวเอง ทีม WIDEROOMS ช่วยต่อได้" }
    ],
    ctaH: "ให้เราช่วยหาบ้านที่ใช่สำหรับคุณ",
    ctaP: "คุยกับทีม " + SITE.short + " ได้โดยตรง มีผล MBTI แล้วหรือยังไม่มีก็ได้ เราช่วยเริ่มให้",
    testBtn: "ทำแบบทดสอบ MBTI",
    quizBtn: "ตอบคำถามหาบ้านที่ใช่",
    honestH: "สิ่งที่ควรรู้",
    honest: [
      { ref: "pittenger", p: "MBTI เป็นเครื่องมือช่วยให้คุยเรื่องความชอบได้ง่ายขึ้น ไม่ใช่แบบประเมินทางการแพทย์ นักจิตวิทยาหลายคนเตือนว่าไม่ควรใช้ผล 4 ตัวอักษรเป็นคำตัดสินตายตัว" },
      { ref: "mccrae", p: "บุคลิกของคนไม่ได้แบ่งเป็นสองขั้วชัดเจน แต่เป็นระดับต่อเนื่อง เราจึงใช้ MBTI ประกอบกับการพูดคุยจริงเสมอ" },
      { p: "ฮวงจุ้ยเป็นความเชื่อทางวัฒนธรรม การจับคู่ธาตุกับบุคลิกในหน้านี้เป็นการตีความของเราเพื่อช่วยแต่งบ้าน ทิศของบ้านแต่ละหลังยังรอ " + SITE.short + " ยืนยัน" }
    ],
    refsH: "แหล่งอ้างอิง",
    readMore: "อ่านงานวิจัย",
    wr: "แต่งบ้านให้เข้ากับบุคลิก โดย WIDEROOMS"
  },
  en: {
    crumb: "MBTI & feng shui",
    eyebrow: "Personalized Matching · " + SITE.name,
    title: "The right home starts with knowing yourself",
    lede: "A short guide to how personality (MBTI) and feng shui can help you choose a home: what research says, what is belief, and which " + SITE.short + " homes suit whom.",
    toc: ["Research", "4 MBTI scales", "4 groups", "5 elements", "Feng shui at home", "Get matched"],
    whyH: "What research says about personality and home",
    why: [
      { ref: "gosling", h: "Our homes carry our personality", p: "Psychologists showed strangers nothing but a person's bedroom or office. Observers agreed with each other about the occupant's personality and were partly accurate: our spaces really do hold traces of who we are." },
      { ref: "jokela", h: "A place that fits you shapes how satisfied you are", p: "A study of 56,019 Londoners across 216 postal districts found the same traits related to life satisfaction differently depending on the neighbourhood. Researchers call it person–environment fit." },
      { ref: "oishi", h: "Even location follows personality", p: "Outgoing people tend to prefer the beach and quieter people the mountains: beaches are open and social, mountains offer seclusion. Pattaya has both, from Jomtien beachfront to the hills around Lake Mapprachan." },
      { ref: "graham", h: "Homes matter, yet we choose them by numbers alone", p: "People pour time and money into choosing and furnishing homes, yet rarely ask whether a home fits them. That gap is what Personalized Matching fills." }
    ],
    dimsH: "The four MBTI scales, and what to look for in a home",
    dimsNote: "The four MBTI scales relate to four of the Big Five personality dimensions, the framework psychologists use most widely.",
    dims: [
      { k: "E · I", h: "Where your energy comes from", a: ["E · energised by people", "An open living room, a long dining table, a poolside sala, a karaoke or party space"], b: ["I · recharged by quiet", "Bedrooms away from the guest zone, a reading corner, a shady garden, a hillside or lakeside location"] },
      { k: "S · N", h: "How you take in the world", a: ["S · trusts the tangible", "A practical layout, enough storage, a full kitchen: a home that obviously works from day one"], b: ["N · sees possibilities", "A home with character, such as Mediterranean or Tuscan, or space to make your own"] },
      { k: "T · F", h: "How you decide", a: ["T · by logic and numbers", "Price per sqm, pool and garden upkeep, rental yield, value against other homes"], b: ["F · by feeling", "Light, atmosphere, warmth and the sense that ‘this is home’"] },
      { k: "J · P", h: "How you like to live", a: ["J · likes order", "Clear zones, fully furnished, a place for everything"], b: ["P · likes flexibility", "Open space that's easy to change, low upkeep, lock up and travel"] }
    ],
    groupsH: "Four personality groups, and " + SITE.short + " homes for each",
    groupsNote: "Lists come from the ‘MBTI fit’ section on each listing page",
    groups: {
      an: { h: "The well-thought-out home", p: "An efficient layout, crisp from every angle, a corner to focus and work", el: "metal", add: "wood", addP: "Add wood and plants so the home is not too hard and ideas keep flowing" },
      di: { h: "The home with heart", p: "Warm, well lit, with a story, a corner of your own and room for the people who matter", el: "wood", add: "earth", addP: "Add earth tones, cream and terracotta to feel grounded" },
      se: { h: "The dependable home", p: "Ready to live in, easy to keep, bedrooms for everyone, reliable for years", el: "earth", add: "fire", addP: "Add warm light and touches of orange or peach to keep it lively" },
      ex: { h: "The home that lets you live", p: "Pool, sala, parties, sport and life outdoors", el: "fire", add: "water", addP: "Add water and blue tones for a calm corner after a full day" }
    },
    elFit: "Element that tends to fit",
    alsoFits: "Also suits",
    elAdd: "Element that balances",
    fsH: "Feng shui and personality: the five elements at home",
    fsLede: "Feng shui reads a home through five elements: Wood, Fire, Earth, Metal and Water, each with its own colours, materials and shapes. A home with the elements in balance feels comfortable. The ‘fits this personality’ notes below are our own reading to help talk about styling, not classical doctrine.",
    elements: {
      wood:  { n: "Wood", c: "Green, natural wood, plants", f: "Growth, freshness, care", who: "People who like learning, caring for others and a home that feels alive" },
      fire:  { n: "Fire", c: "Red, orange, peach, warm light", f: "Energy, fun, socialising", who: "People who love gatherings, activity and a lively home" },
      earth: { n: "Earth", c: "Cream, sand, terracotta, travertine", f: "Stability, warmth, trust", who: "People who put family, order and the long term first" },
      metal: { n: "Metal", c: "White, grey, gold, marble", f: "Clarity, precision, order", who: "People who like understated luxury, decide by logic and want a home that looks good from every angle" },
      water: { n: "Water", c: "Blue, black, pools, sea views", f: "Calm, flow, depth", who: "People who like quiet, think deeply and need room to recharge" }
    },
    elSeen: "Seen in",
    rulesH: "Feng shui principles we use on the listing pages",
    rulesLede: "Several match what design and environmental psychology have found; some are belief alone. Each one says which.",
    rules: [
      { k: "front", h: "Open space in front (ming tang)", p: "An open lawn or forecourt is said to welcome good energy. In practice it means light, air and a good view.", tag: "Belief + design" },
      { k: "command", ref: "dosen", h: "The command position", p: "Place the bed or desk so you can see the door with a solid wall behind you. This matches prospect–refuge theory: people prefer spots with a view and some shelter. A review found stronger evidence for the view than for the shelter.", tag: "Partly supported by research" },
      { k: "water", ref: "ulrich", h: "Water should be clear and moving", p: "Pools, fountains and fish ponds are the Water element, said to draw wealth; keep them clean, never stagnant. Research also found that a view of nature helps people recover faster, so gardens and water are good for the mind too.", tag: "Belief + research" },
      { k: "line", h: "Door not in line with a window or balcony", p: "If you can walk straight from the door to the balcony, energy is said to rush out. A screen, bookcase or plant fixes it.", tag: "Belief" },
      { k: "beam", h: "Avoid beams overhead and sharp corners", p: "Don't sleep or work right under a beam, and prefer curves to sharp corners. Fabric, lighting or a ceiling can soften them.", tag: "Belief + comfort" },
      { k: "zone", h: "Keep rest apart from social space", p: "Bedrooms sit best away from the front door, kitchen and party zone. A bathroom near the entrance should keep its door closed.", tag: "Design" }
    ],
    rulesSeen: "Examples",
    pillarsH: "Happiness, comfort and good fortune",
    pillars: [
      { h: "Happiness", p: "A home that suits your personality makes daily life flow: the person–environment fit that research links to life satisfaction." },
      { h: "Comfort", p: "Layout, light, sound and zoning that match how you actually live, not just size or price." },
      { h: "Good fortune", ref: "fortin", ref2: "bourassa", p: "About 117,000 Vancouver home sales showed addresses ending in 8 sold for 2.5% more and those ending in 4 for 2.2% less, and a study in Auckland found lucky numbers reflected in prices too. Believe it or not, the belief moves real values." }
    ],
    stepsH: "How Personalized Matching works",
    steps: [
      { h: "Know your type", p: "Take the test at 16personalities.com and send us your four letters, or answer the short questions on our Find your home page." },
      { h: "Tell us the life you want", p: "Share your lifestyle, who will live there, your budget, buy or rent, and your must-haves." },
      { h: "We shortlist homes that fit", p: "We match personality, layout, location, zone safety, feng shui and budget, and put forward the closest fits." },
      { h: "View and decide", p: "View with full details in hand, and if you want it styled to suit you, the WIDEROOMS team can take it from there." }
    ],
    ctaH: "Let us find the right home for you",
    ctaP: "Talk to the " + SITE.short + " team directly, with your MBTI result or without one: we'll help you start.",
    testBtn: "Take the MBTI test",
    quizBtn: "Answer the home-finder questions",
    honestH: "Good to know",
    honest: [
      { ref: "pittenger", p: "MBTI helps us talk about preferences more easily; it is not a clinical assessment. Many psychologists warn against treating the four letters as a fixed verdict." },
      { ref: "mccrae", p: "Personality is not split into clean opposites but runs on a continuum, so we always pair MBTI with a real conversation." },
      { p: "Feng shui is a cultural belief. Matching elements to personality on this page is our own reading to help with styling. The facing direction of each home is still to be confirmed by " + SITE.short + "." }
    ],
    refsH: "References",
    readMore: "Read the study",
    wr: "Style your home to suit you, with WIDEROOMS"
  },
  zh: {
    crumb: "MBTI与风水",
    eyebrow: "Personalized Matching · " + SITE.name,
    title: "合适的家，从了解自己开始",
    lede: "一份简短指南：性格（MBTI）与风水如何帮助你选房，研究怎么说、哪些属于信仰，以及" + SITE.short + "的每栋房子适合谁。",
    toc: ["研究", "MBTI四个维度", "四类性格", "风水五行", "居家风水原则", "开始匹配"],
    whyH: "关于性格与住宅，研究怎么说",
    why: [
      { ref: "gosling", h: "家反映我们是谁", p: "心理学家只让陌生人看某人的卧室或办公室。多位观察者对房主性格的判断彼此一致，而且有一定准确度——我们所住的空间确实留下了自我的痕迹。" },
      { ref: "jokela", h: "适合自己的地方，影响生活满意度", p: "一项针对伦敦216个邮区、56,019名居民的研究发现，同样的性格特质与生活满意度的关系会随街区而不同。研究者称之为“人与环境的契合”。" },
      { ref: "oishi", h: "连地段也随性格而选", p: "外向的人往往偏爱海边，安静的人偏爱山区：海滩开阔热闹，山区更有隐私。芭提雅两者兼备，从宗甸海滨到玛普拉占湖周边的山丘。" },
      { ref: "graham", h: "家很重要，却常只凭数字选择", p: "人们在挑选和布置住宅上投入大量时间和金钱，却很少问这栋房子是否适合自己。这正是Personalized Matching要填补的空白。" }
    ],
    dimsH: "MBTI四个维度，以及选房时该看什么",
    dimsNote: "MBTI的四个维度与心理学界最常用的“大五人格”中的四个维度相关。",
    dims: [
      { k: "E · I", h: "能量从哪里来", a: ["E · 从人群中获得能量", "开阔的客厅、长餐桌、池畔凉亭、卡拉OK或派对空间"], b: ["I · 在安静中充电", "远离会客区的卧室、阅读角、绿荫花园、山坡或湖畔地段"] },
      { k: "S · N", h: "如何认识世界", a: ["S · 相信看得见摸得着的", "实用的格局、足够的收纳、齐全的厨房：一眼就知道能马上入住"], b: ["N · 看到可能性", "有个性的房子，如地中海或托斯卡纳风，或可以打造成自己风格的空间"] },
      { k: "T · F", h: "如何做决定", a: ["T · 靠逻辑和数字", "每平方米价格、泳池和花园维护费、出租回报，与其他房源比较"], b: ["F · 靠感受", "光线、氛围、温暖，以及“这里就是家”的感觉"] },
      { k: "J · P", h: "喜欢怎样生活", a: ["J · 喜欢秩序", "分区清晰、家具齐全、一切各就其位"], b: ["P · 喜欢灵活", "易于改变的开放空间、维护少、锁门就能出发"] }
    ],
    groupsH: "四类性格，与" + SITE.short + "的房源",
    groupsNote: "名单来自每个房源页面的“适合的MBTI性格”部分",
    groups: {
      an: { h: "深思熟虑的家", p: "格局高效、每个角度都利落、有专注工作的角落", el: "metal", add: "wood", addP: "加入木材和绿植，让家不过于冷硬，也激发灵感" },
      di: { h: "有温度的家", p: "温暖、采光好、有故事，有自己的角落，也有留给重要之人的空间", el: "wood", add: "earth", addP: "加入大地色、奶油色和赤陶色，让人感到踏实" },
      se: { h: "安稳可靠的家", p: "拎包入住、好打理、卧室够每个人用、长期可靠", el: "earth", add: "fire", addP: "加入暖光和少许橙色或蜜桃色，让家更有活力" },
      ex: { h: "尽情生活的家", p: "泳池、凉亭、派对、运动与户外生活", el: "fire", add: "water", addP: "加入水景和蓝色调，在尽兴的一天后有个静心角落" }
    },
    elFit: "常契合的元素",
    alsoFits: "也适合",
    elAdd: "可平衡的元素",
    fsH: "风水与性格：家中的五行",
    fsLede: "风水通过木、火、土、金、水五行来看一个家，每种元素都有各自的颜色、材质和形状。五行平衡的家住起来舒适。下面“适合的性格”是我们为了讨论布置而作的解读，并非传统典籍。",
    elements: {
      wood:  { n: "木", c: "绿色、原木、植物", f: "成长、清新、关怀", who: "喜欢学习、照顾他人、希望家充满生机的人" },
      fire:  { n: "火", c: "红、橙、蜜桃色、暖光", f: "活力、欢乐、社交", who: "爱聚会、爱活动、喜欢热闹之家的人" },
      earth: { n: "土", c: "奶油、沙色、赤陶、洞石", f: "稳定、温暖、可信", who: "把家庭、秩序和长远放在首位的人" },
      metal: { n: "金", c: "白、灰、金色、大理石", f: "清晰、精准、秩序", who: "喜欢低调奢华、凭逻辑决定、希望家每个角度都好看的人" },
      water: { n: "水", c: "蓝、黑、泳池、海景", f: "平静、流动、深度", who: "喜欢安静、思考深入、需要空间充电的人" }
    },
    elSeen: "可见于",
    rulesH: "我们在房源页面使用的风水原则",
    rulesLede: "其中几条与设计学和环境心理学的发现相符，有些则纯属信仰。每条都会注明。",
    rules: [
      { k: "front", h: "屋前开阔（明堂）", p: "屋前开阔的草坪或前院被认为能迎来好气场，实际上就是好的采光、通风和视野。", tag: "信仰 + 设计" },
      { k: "command", ref: "dosen", h: "掌控位", p: "床或书桌的位置要能看到房门，背后有实墙。这与“瞭望–庇护”理论相符：人们偏爱视野开阔又有遮蔽的位置。综述研究发现，“视野”的证据比“遮蔽”更充分。", tag: "部分有研究支持" },
      { k: "water", ref: "ulrich", h: "水要清澈流动", p: "泳池、喷泉和鱼池属水，被认为能招财；要保持清洁，切忌死水。研究也发现自然景观能帮助人更快康复，所以花园与水景对心情同样有益。", tag: "信仰 + 研究" },
      { k: "line", h: "门不对窗或阳台", p: "如果从大门直走就到阳台，传说气会快速流失。可用屏风、书架或绿植化解。", tag: "信仰" },
      { k: "beam", h: "避免横梁压顶与尖角", p: "不要在横梁正下方睡觉或工作，弧线优于尖角。织物、灯光或吊顶都能柔化。", tag: "信仰 + 舒适" },
      { k: "zone", h: "休息区与社交区分开", p: "卧室最好远离大门、厨房和派对区。靠近入口的浴室要常关门。", tag: "设计" }
    ],
    rulesSeen: "示例",
    pillarsH: "幸福、舒适与好运",
    pillars: [
      { h: "幸福", p: "适合性格的家让日常生活更顺畅，即研究发现与生活满意度相关的“人与环境契合”。" },
      { h: "舒适", p: "格局、光线、声音和分区都贴合你真实的生活方式，而不只是面积或价格。" },
      { h: "好运", ref: "fortin", ref2: "bourassa", p: "温哥华约11.7万笔房屋交易显示，门牌尾数为8的房子售价高2.5%，尾数为4的低2.2%；奥克兰的研究也发现吉祥号码反映在房价上。信与不信，这种信念确实影响房价。" }
    ],
    stepsH: "Personalized Matching如何运作",
    steps: [
      { h: "了解你的类型", p: "在16personalities.com做测试，把四个字母发给我们，或在“寻找理想住宅”页面回答几个简短问题。" },
      { h: "告诉我们你想要的生活", p: "分享你的生活方式、同住的人、预算、买或租，以及必不可少的条件。" },
      { h: "我们筛选适合你的房子", p: "综合性格、格局、地段、区域安全、风水和预算，推荐最接近的选择。" },
      { h: "实地看房再决定", p: "带着完整资料看房；如果想布置得更像自己，WIDEROOMS团队可以接手。" }
    ],
    ctaH: "让我们帮你找到合适的家",
    ctaP: "直接联系" + SITE.short + "团队，有没有MBTI结果都可以，我们帮你开始。",
    testBtn: "做MBTI测试",
    quizBtn: "回答找房问题",
    honestH: "须知",
    honest: [
      { ref: "pittenger", p: "MBTI帮助我们更轻松地谈论偏好，并非临床评估。许多心理学家提醒，不应把四个字母当作定论。" },
      { ref: "mccrae", p: "性格并非截然两极，而是连续的程度，因此我们总是把MBTI与真实交谈结合使用。" },
      { p: "风水是一种文化信仰。本页把五行与性格配对，是我们为布置所作的解读。每栋房子的朝向仍待" + SITE.short + "确认。" }
    ],
    refsH: "参考文献",
    readMore: "阅读研究",
    wr: "由WIDEROOMS按你的性格布置住宅"
  },
  ko: {
    crumb: "MBTI와 풍수",
    eyebrow: "Personalized Matching · " + SITE.name,
    title: "나에게 맞는 집은 나를 아는 것에서 시작됩니다",
    lede: "성격(MBTI)과 풍수가 집 선택에 어떻게 도움이 되는지, 연구는 무엇을 말하고 무엇이 믿음인지, 그리고 " + SITE.short + "의 각 집이 누구에게 맞는지 정리한 짧은 가이드입니다.",
    toc: ["연구", "MBTI 4가지 축", "4가지 성격 그룹", "풍수 오행", "집 안의 풍수 원칙", "매칭 시작"],
    whyH: "성격과 집에 대해 연구가 말하는 것",
    why: [
      { ref: "gosling", h: "집은 나를 담고 있습니다", p: "심리학자들이 낯선 사람에게 누군가의 침실이나 사무실만 보여 주었더니, 여러 관찰자가 주인의 성격을 비슷하게 평가했고 어느 정도 정확했습니다. 우리가 사는 공간에는 정말 우리의 흔적이 남습니다." },
      { ref: "jokela", h: "나와 맞는 곳이 삶의 만족도를 좌우합니다", p: "런던 216개 우편구역 주민 56,019명을 조사한 연구에서, 같은 성격 특성도 동네에 따라 삶의 만족도와 다르게 연결되었습니다. 연구자들은 이를 ‘사람–환경 적합성’이라고 부릅니다." },
      { ref: "oishi", h: "위치도 성격을 따릅니다", p: "외향적인 사람은 바다를, 조용한 사람은 산을 선호하는 경향이 있습니다. 해변은 탁 트이고 사교적이며 산은 한적하기 때문입니다. 파타야에는 좀티엔 해변부터 맙프라찬 호수 주변 언덕까지 둘 다 있습니다." },
      { ref: "graham", h: "집은 중요한데, 숫자로만 고릅니다", p: "사람들은 집을 고르고 꾸미는 데 많은 시간과 돈을 쓰지만, 그 집이 나와 맞는지는 거의 묻지 않습니다. 그 빈틈을 Personalized Matching이 채웁니다." }
    ],
    dimsH: "MBTI 4가지 축과 집에서 살펴볼 점",
    dimsNote: "MBTI의 네 가지 축은 심리학에서 가장 널리 쓰이는 빅파이브(Big Five) 중 네 가지 차원과 관련이 있습니다.",
    dims: [
      { k: "E · I", h: "에너지는 어디서 오나요", a: ["E · 사람에게서 에너지를 얻음", "탁 트인 거실, 긴 식탁, 풀사이드 정자, 노래방이나 파티 공간"], b: ["I · 조용함 속에서 충전", "손님 공간과 떨어진 침실, 독서 공간, 그늘진 정원, 언덕이나 호숫가 입지"] },
      { k: "S · N", h: "세상을 어떻게 받아들이나요", a: ["S · 눈에 보이는 것을 믿음", "실용적인 구조, 넉넉한 수납, 완비된 주방: 첫날부터 바로 살 수 있는 집"], b: ["N · 가능성을 봄", "지중해풍이나 토스카나풍처럼 개성 있는 집, 또는 내 스타일로 바꿀 수 있는 공간"] },
      { k: "T · F", h: "어떻게 결정하나요", a: ["T · 논리와 숫자로", "㎡당 가격, 수영장·정원 관리비, 임대 수익률, 다른 집과의 비교"], b: ["F · 느낌으로", "빛, 분위기, 따뜻함, 그리고 ‘여기가 집이다’라는 느낌"] },
      { k: "J · P", h: "어떻게 살고 싶나요", a: ["J · 질서를 좋아함", "명확한 공간 구분, 가구 완비, 모든 것에 제자리"], b: ["P · 유연함을 좋아함", "바꾸기 쉬운 열린 공간, 적은 관리, 문 잠그고 바로 여행"] }
    ],
    groupsH: "4가지 성격 그룹과 " + SITE.short + "의 집",
    groupsNote: "목록은 각 매물 페이지의 ‘어울리는 MBTI’ 섹션에서 가져왔습니다",
    groups: {
      an: { h: "잘 설계된 집", p: "효율적인 구조, 어느 각도에서나 깔끔함, 집중해서 일할 공간", el: "metal", add: "wood", addP: "원목과 식물을 더해 집이 딱딱하지 않게, 아이디어가 흐르게" },
      di: { h: "마음이 있는 집", p: "따뜻하고 밝으며 이야기가 있고, 나만의 공간과 소중한 사람을 위한 자리", el: "wood", add: "earth", addP: "흙빛, 크림, 테라코타를 더해 안정감을" },
      se: { h: "믿음직한 집", p: "바로 입주 가능, 관리가 쉽고, 모두를 위한 침실, 오래 믿을 수 있는 집", el: "earth", add: "fire", addP: "따뜻한 조명과 오렌지·피치 포인트로 생기를" },
      ex: { h: "마음껏 사는 집", p: "수영장, 정자, 파티, 스포츠, 야외 생활", el: "fire", add: "water", addP: "물과 블루 톤을 더해 신나는 하루 뒤 쉴 곳을" }
    },
    elFit: "잘 맞는 기운",
    alsoFits: "이 그룹에도 맞음",
    elAdd: "균형을 잡는 기운",
    fsH: "풍수와 성격: 집 안의 오행",
    fsLede: "풍수는 목(木)·화(火)·토(土)·금(金)·수(水) 오행으로 집을 봅니다. 각 기운에는 고유한 색, 소재, 형태가 있습니다. 오행이 균형 잡힌 집은 편안하게 느껴집니다. 아래의 ‘어울리는 성격’은 인테리어 이야기를 돕기 위한 우리의 해석이며 전통 이론은 아닙니다.",
    elements: {
      wood:  { n: "목(木)", c: "초록, 원목, 식물", f: "성장, 상쾌함, 배려", who: "배우기를 좋아하고 남을 돌보며 살아 있는 집을 원하는 사람" },
      fire:  { n: "화(火)", c: "빨강, 오렌지, 피치, 따뜻한 빛", f: "에너지, 즐거움, 사교", who: "모임과 활동을 좋아하고 활기찬 집을 원하는 사람" },
      earth: { n: "토(土)", c: "크림, 샌드, 테라코타, 트래버틴", f: "안정, 따뜻함, 신뢰", who: "가족, 질서, 장기적인 삶을 우선하는 사람" },
      metal: { n: "금(金)", c: "화이트, 그레이, 골드, 대리석", f: "명료함, 정밀함, 질서", who: "절제된 럭셔리를 좋아하고 논리로 결정하며 어느 각도에서나 멋진 집을 원하는 사람" },
      water: { n: "수(水)", c: "블루, 블랙, 수영장, 바다 전망", f: "고요함, 흐름, 깊이", who: "조용함을 좋아하고 깊이 생각하며 충전할 공간이 필요한 사람" }
    },
    elSeen: "볼 수 있는 집",
    rulesH: "매물 페이지에서 쓰는 풍수 원칙",
    rulesLede: "몇 가지는 디자인과 환경심리학의 발견과 일치하고, 몇 가지는 순수한 믿음입니다. 항목마다 표시했습니다.",
    rules: [
      { k: "front", h: "집 앞의 열린 공간(명당)", p: "탁 트인 앞마당 잔디는 좋은 기운을 맞이한다고 합니다. 실제로는 좋은 채광, 통풍, 전망을 뜻합니다.", tag: "믿음 + 디자인" },
      { k: "command", ref: "dosen", h: "지휘 자리", p: "침대나 책상은 문이 보이고 뒤에 단단한 벽이 있도록 둡니다. 이는 사람들이 전망과 보호를 함께 주는 자리를 선호한다는 ‘조망–피난’ 이론과 맞습니다. 리뷰 연구에서는 ‘조망’의 근거가 ‘피난’보다 강했습니다.", tag: "일부 연구로 뒷받침" },
      { k: "water", ref: "ulrich", h: "물은 맑고 흐르게", p: "수영장, 분수, 연못은 수(水)의 기운으로 재물을 부른다고 합니다. 깨끗하게, 고이지 않게 유지하세요. 연구에서도 자연 풍경이 회복을 빠르게 한다는 결과가 있어 정원과 물은 마음에도 좋습니다.", tag: "믿음 + 연구" },
      { k: "line", h: "문과 창·발코니가 일직선이 되지 않게", p: "문에서 발코니까지 곧장 걸어갈 수 있으면 기운이 빠르게 빠져나간다고 합니다. 가림막, 책장, 식물로 해결할 수 있습니다.", tag: "믿음" },
      { k: "beam", h: "머리 위 보와 날카로운 모서리 피하기", p: "보 바로 아래에서 자거나 일하지 말고, 날카로운 모서리보다 곡선을 고르세요. 패브릭, 조명, 천장 마감으로 부드럽게 할 수 있습니다.", tag: "믿음 + 편안함" },
      { k: "zone", h: "휴식 공간과 사교 공간 분리", p: "침실은 현관, 주방, 파티 공간에서 떨어진 곳이 좋습니다. 현관 근처 욕실은 문을 닫아 두세요.", tag: "디자인" }
    ],
    rulesSeen: "예시",
    pillarsH: "행복, 편안함, 그리고 행운",
    pillars: [
      { h: "행복", p: "성격에 맞는 집은 일상을 매끄럽게 합니다. 연구가 삶의 만족도와 연결한 ‘사람–환경 적합성’입니다." },
      { h: "편안함", p: "크기나 가격만이 아니라 실제 생활 방식에 맞는 구조, 빛, 소리, 공간 구분." },
      { h: "행운", ref: "fortin", ref2: "bourassa", p: "밴쿠버 주택 거래 약 11만 7천 건에서 끝자리 8 번지는 2.5% 비싸게, 끝자리 4는 2.2% 싸게 팔렸고, 오클랜드 연구에서도 길한 번호가 가격에 반영되었습니다. 믿든 안 믿든 이 믿음은 실제 가치를 움직입니다." }
    ],
    stepsH: "Personalized Matching은 이렇게 진행됩니다",
    steps: [
      { h: "내 유형 알기", p: "16personalities.com에서 테스트하고 네 글자를 보내 주세요. 또는 ‘나에게 맞는 집 찾기’ 페이지의 짧은 질문에 답해 주세요." },
      { h: "원하는 삶 이야기하기", p: "라이프스타일, 함께 살 사람, 예산, 매매 또는 임대, 꼭 필요한 조건을 알려 주세요." },
      { h: "맞는 집을 추려 드립니다", p: "성격, 구조, 위치, 지역 안전, 풍수, 예산을 맞춰 가장 가까운 집을 제안합니다." },
      { h: "직접 보고 결정", p: "모든 정보를 갖고 집을 보세요. 나에게 맞게 꾸미고 싶다면 WIDEROOMS 팀이 이어서 도와드립니다." }
    ],
    ctaH: "나에게 맞는 집, 함께 찾아 드립니다",
    ctaP: "" + SITE.short + " 팀과 바로 이야기하세요. MBTI 결과가 있든 없든 시작을 도와드립니다.",
    testBtn: "MBTI 테스트 하기",
    quizBtn: "집 찾기 질문에 답하기",
    honestH: "알아 두세요",
    honest: [
      { ref: "pittenger", p: "MBTI는 선호를 쉽게 이야기하도록 돕는 도구이며 임상 평가가 아닙니다. 많은 심리학자가 네 글자를 고정된 판정으로 쓰지 말라고 경고합니다." },
      { ref: "mccrae", p: "성격은 뚜렷한 양극으로 나뉘지 않고 연속적인 정도로 나타납니다. 그래서 우리는 MBTI를 항상 실제 대화와 함께 씁니다." },
      { p: "풍수는 문화적 믿음입니다. 이 페이지에서 오행과 성격을 연결한 것은 인테리어를 돕기 위한 우리의 해석입니다. 각 집의 방향은 아직 " + SITE.short + "의 확인을 기다리고 있습니다." }
    ],
    refsH: "참고 문헌",
    readMore: "연구 읽기",
    wr: "WIDEROOMS와 함께 나에게 맞게 꾸미기"
  },
  ja: {
    crumb: "MBTIと風水",
    eyebrow: "Personalized Matching · " + SITE.name,
    title: "ぴったりの家は、自分を知ることから",
    lede: "性格（MBTI）と風水が家選びにどう役立つか、研究は何を示し、どこからが信仰なのか、そして" + SITE.short + "の各物件がどんな人に合うのかをまとめた短いガイドです。",
    toc: ["研究", "MBTIの4指標", "4つのグループ", "風水の五行", "住まいの風水", "マッチング"],
    whyH: "性格と住まいについて、研究が示すこと",
    why: [
      { ref: "gosling", h: "家にはその人らしさが表れる", p: "心理学者が他人の寝室やオフィスだけを見せたところ、複数の観察者が住人の性格を同じように評価し、ある程度正確でした。私たちの空間には、確かに自分の痕跡が残ります。" },
      { ref: "jokela", h: "自分に合う場所が、生活満足度を左右する", p: "ロンドンの216の郵便区に住む56,019人を調べた研究では、同じ性格特性でも地域によって生活満足度との関係が異なりました。研究者はこれを「人と環境の適合」と呼びます。" },
      { ref: "oishi", h: "立地も性格に従う", p: "外向的な人は海を、静かな人は山を好む傾向があります。ビーチは開放的で社交的、山はプライバシーがあるからです。パタヤにはジョムティエンビーチの海沿いからマプラチャン湖周辺の丘まで、その両方があります。" },
      { ref: "graham", h: "家は大切なのに、数字だけで選ばれがち", p: "人は家選びやインテリアに多くの時間とお金をかけますが、その家が自分に合うかはほとんど問いません。その隙間を埋めるのがPersonalized Matchingです。" }
    ],
    dimsH: "MBTIの4指標と、家で見るべきポイント",
    dimsNote: "MBTIの4指標は、心理学で最も広く使われるビッグファイブのうち4つの次元と関連しています。",
    dims: [
      { k: "E · I", h: "エネルギーの源", a: ["E · 人と会って元気になる", "開放的なリビング、長いダイニングテーブル、プールサイドのサラ、カラオケやパーティースペース"], b: ["I · 静けさで充電する", "来客スペースから離れた寝室、読書コーナー、木陰の庭、丘や湖畔の立地"] },
      { k: "S · N", h: "世界の捉え方", a: ["S · 目に見えるものを信じる", "使いやすい間取り、十分な収納、充実したキッチン：初日から暮らせる家"], b: ["N · 可能性を見る", "地中海風やトスカーナ風など個性のある家、または自分らしく変えられる空間"] },
      { k: "T · F", h: "決め方", a: ["T · 論理と数字で", "㎡単価、プールと庭の維持費、賃貸利回り、他物件との比較"], b: ["F · 気持ちで", "光、雰囲気、温かさ、そして「ここが我が家」という感覚"] },
      { k: "J · P", h: "暮らし方", a: ["J · 秩序が好き", "はっきりしたゾーン分け、家具付き、すべてに定位置"], b: ["P · 柔軟さが好き", "変えやすいオープンな空間、手入れが少ない、鍵をかけてすぐ旅へ"] }
    ],
    groupsH: "4つの性格グループと、" + SITE.short + "の物件",
    groupsNote: "リストは各物件ページの「相性の良いMBTI」から作成しています",
    groups: {
      an: { h: "よく考えられた家", p: "効率的な間取り、どこから見ても整っていて、集中して働ける一角がある", el: "metal", add: "wood", addP: "木や植物を加えて硬くなりすぎないように、発想も広がります" },
      di: { h: "心のある家", p: "温かく明るく、物語があり、自分の居場所と大切な人のための空間がある", el: "wood", add: "earth", addP: "アースカラー、クリーム、テラコッタで地に足のついた安心感を" },
      se: { h: "頼れる家", p: "すぐ住めて手入れが楽、全員分の寝室があり、長く安心できる", el: "earth", add: "fire", addP: "暖かい照明とオレンジやピーチの差し色で活気を" },
      ex: { h: "思い切り楽しめる家", p: "プール、サラ、パーティー、スポーツ、屋外の暮らし", el: "fire", add: "water", addP: "水とブルーの色調で、遊んだ後にほっとできる場所を" }
    },
    elFit: "相性の良い気",
    alsoFits: "こちらにも合う",
    elAdd: "バランスを取る気",
    fsH: "風水と性格：住まいの五行",
    fsLede: "風水では木・火・土・金・水の五行で家を読み解きます。それぞれに固有の色、素材、形があり、五行のバランスが取れた家は心地よく感じられます。下の「合う性格」はインテリアの話をしやすくするための私たちの解釈で、古典の教えではありません。",
    elements: {
      wood:  { n: "木", c: "緑、天然木、植物", f: "成長、爽やかさ、思いやり", who: "学ぶことや人の世話が好きで、生き生きとした家を望む人" },
      fire:  { n: "火", c: "赤、オレンジ、ピーチ、暖かい光", f: "エネルギー、楽しさ、社交", who: "集まりや活動が好きで、にぎやかな家を望む人" },
      earth: { n: "土", c: "クリーム、サンド、テラコッタ、トラバーチン", f: "安定、温かさ、信頼", who: "家族、秩序、長い暮らしを大切にする人" },
      metal: { n: "金", c: "白、グレー、ゴールド、大理石", f: "明快さ、精度、秩序", who: "控えめなラグジュアリーを好み、論理で決め、どこから見ても美しい家を望む人" },
      water: { n: "水", c: "青、黒、プール、海の眺め", f: "静けさ、流れ、深さ", who: "静けさを好み、深く考え、充電できる場所が必要な人" }
    },
    elSeen: "見られる物件",
    rulesH: "物件ページで使っている風水の原則",
    rulesLede: "いくつかはデザインや環境心理学の知見と一致し、いくつかは純粋な信仰です。それぞれに明記しています。",
    rules: [
      { k: "front", h: "家の前の開けた空間（明堂）", p: "開けた前庭や芝生は良い気を迎えるとされます。実際には採光、風通し、眺望の良さを意味します。", tag: "信仰 + デザイン" },
      { k: "command", ref: "dosen", h: "指揮の位置", p: "ベッドやデスクはドアが見え、背後に堅い壁がある位置に。これは人が眺望と守りのある場所を好むという「眺望–隠れ家」理論と一致します。レビュー研究では「眺望」の根拠のほうが「隠れ家」より強いとされています。", tag: "一部研究の裏付けあり" },
      { k: "water", ref: "ulrich", h: "水は澄んで流れるように", p: "プール、噴水、池は「水」の気で財を呼ぶとされます。清潔に保ち、よどませないこと。自然の眺めが回復を早めるという研究もあり、庭と水は心にも良いのです。", tag: "信仰 + 研究" },
      { k: "line", h: "ドアと窓・バルコニーを一直線にしない", p: "ドアからバルコニーまでまっすぐ歩けると、気がすぐ抜けるとされます。衝立、本棚、植物で解決できます。", tag: "信仰" },
      { k: "beam", h: "頭上の梁と鋭い角を避ける", p: "梁の真下で寝たり仕事をしたりせず、鋭い角より曲線を選びましょう。布、照明、天井で和らげられます。", tag: "信仰 + 快適さ" },
      { k: "zone", h: "休む場所と集まる場所を分ける", p: "寝室は玄関、キッチン、パーティースペースから離すのが理想。玄関近くの浴室はドアを閉めておきましょう。", tag: "デザイン" }
    ],
    rulesSeen: "例",
    pillarsH: "幸せ、快適さ、そして幸運",
    pillars: [
      { h: "幸せ", p: "性格に合う家は毎日をスムーズにします。研究が生活満足度と結びつける「人と環境の適合」です。" },
      { h: "快適さ", p: "広さや価格だけでなく、実際の暮らし方に合う間取り、光、音、ゾーン分け。" },
      { h: "幸運", ref: "fortin", ref2: "bourassa", p: "バンクーバーの約11万7千件の住宅取引では、末尾8の番地は2.5%高く、末尾4は2.2%安く売れました。オークランドの研究でも縁起の良い番号が価格に表れました。信じるかどうかにかかわらず、この信仰は実際の価値を動かします。" }
    ],
    stepsH: "Personalized Matchingの流れ",
    steps: [
      { h: "自分のタイプを知る", p: "16personalities.comでテストを受けて4文字を送ってください。または「理想の家を探す」ページの短い質問に答えてください。" },
      { h: "望む暮らしを教える", p: "ライフスタイル、一緒に住む人、予算、購入か賃貸か、譲れない条件を教えてください。" },
      { h: "合う家を絞り込む", p: "性格、間取り、立地、エリアの安全性、風水、予算を照らし合わせ、最も近い物件をご提案します。" },
      { h: "実際に見て決める", p: "すべての情報を手に内覧を。自分らしく整えたいなら、WIDEROOMSチームが引き継ぎます。" }
    ],
    ctaH: "あなたにぴったりの家を一緒に探します",
    ctaP: "" + SITE.short + "チームに直接ご相談ください。MBTIの結果がなくても大丈夫、始め方からお手伝いします。",
    testBtn: "MBTIテストを受ける",
    quizBtn: "家探しの質問に答える",
    honestH: "知っておきたいこと",
    honest: [
      { ref: "pittenger", p: "MBTIは好みを話しやすくするための道具であり、臨床的な評価ではありません。多くの心理学者が、4文字を固定した判定として使わないよう注意しています。" },
      { ref: "mccrae", p: "性格ははっきりした両極に分かれるのではなく、連続的な程度で表れます。だから私たちはMBTIを必ず実際の会話と組み合わせます。" },
      { p: "風水は文化的な信仰です。このページで五行と性格を結びつけているのは、インテリアのための私たちの解釈です。各物件の向きは" + SITE.short + "の確認待ちです。" }
    ],
    refsH: "参考文献",
    readMore: "研究を読む",
    wr: "WIDEROOMSで自分らしい住まいに"
  },
  ru: {
    crumb: "MBTI и фэншуй",
    eyebrow: "Personalized Matching · " + SITE.name,
    title: "Подходящий дом начинается с понимания себя",
    lede: "Короткий гид о том, как тип личности (MBTI) и фэншуй помогают выбрать дом: что говорят исследования, что относится к вере и кому подходит каждый дом " + SITE.short + ".",
    toc: ["Исследования", "4 шкалы MBTI", "4 группы", "5 стихий", "Фэншуй дома", "Подбор"],
    whyH: "Что исследования говорят о личности и доме",
    why: [
      { ref: "gosling", h: "Дом отражает нас", p: "Психологи показывали незнакомцам только чью-то спальню или кабинет. Наблюдатели сходились в оценке характера хозяина и отчасти угадывали верно: наши пространства действительно хранят следы того, кто мы." },
      { ref: "jokela", h: "Подходящее место влияет на удовлетворённость жизнью", p: "Исследование 56 019 жителей Лондона из 216 почтовых районов показало, что одни и те же черты по-разному связаны с удовлетворённостью жизнью в зависимости от района. Учёные называют это соответствием человека и среды." },
      { ref: "oishi", h: "Даже место выбирают по характеру", p: "Общительные люди чаще предпочитают море, а спокойные — горы: пляж открыт и полон людей, горы дают уединение. В Паттайе есть и то и другое — от набережной Джомтьена до холмов у озера Мапрачан." },
      { ref: "graham", h: "Дом важен, но его выбирают только по цифрам", p: "Люди тратят много времени и денег на выбор и обустройство дома, но редко спрашивают, подходит ли он им. Этот пробел и закрывает Personalized Matching." }
    ],
    dimsH: "Четыре шкалы MBTI и на что смотреть в доме",
    dimsNote: "Четыре шкалы MBTI связаны с четырьмя из пяти измерений «Большой пятёрки» — модели, которой психологи пользуются чаще всего.",
    dims: [
      { k: "E · I", h: "Откуда берётся энергия", a: ["E · заряжается от людей", "Открытая гостиная, длинный обеденный стол, сала у бассейна, караоке или место для вечеринок"], b: ["I · восстанавливается в тишине", "Спальни вдали от гостевой зоны, уголок для чтения, тенистый сад, участок на холме или у озера"] },
      { k: "S · N", h: "Как вы воспринимаете мир", a: ["S · доверяет осязаемому", "Практичная планировка, достаточно мест для хранения, полная кухня: дом, где можно жить с первого дня"], b: ["N · видит возможности", "Дом с характером, например средиземноморский или тосканский, или пространство, которое можно сделать своим"] },
      { k: "T · F", h: "Как вы решаете", a: ["T · логикой и цифрами", "Цена за м², уход за бассейном и садом, доходность аренды, сравнение с другими домами"], b: ["F · чувством", "Свет, атмосфера, тепло и ощущение «это мой дом»"] },
      { k: "J · P", h: "Как вы любите жить", a: ["J · любит порядок", "Чёткие зоны, полная меблировка, у всего своё место"], b: ["P · любит гибкость", "Открытое пространство, которое легко менять, минимум ухода, закрыл дверь и в путь"] }
    ],
    groupsH: "Четыре группы личности и дома " + SITE.short + " для каждой",
    groupsNote: "Списки взяты из раздела «Подходящие типы MBTI» на странице каждого объекта",
    groups: {
      an: { h: "Продуманный дом", p: "Эффективная планировка, безупречный вид с любой точки, место для сосредоточенной работы", el: "metal", add: "wood", addP: "Добавьте дерево и растения, чтобы дом не был жёстким и идеи шли легче" },
      di: { h: "Дом с душой", p: "Тёплый, светлый, с историей, со своим уголком и местом для близких", el: "wood", add: "earth", addP: "Добавьте земляные, кремовые и терракотовые тона для ощущения опоры" },
      se: { h: "Надёжный дом", p: "Готов к жизни, прост в уходе, спальни для всех, надёжен на годы", el: "earth", add: "fire", addP: "Добавьте тёплый свет и немного оранжевого или персикового для живости" },
      ex: { h: "Дом, где можно жить на полную", p: "Бассейн, сала, вечеринки, спорт и жизнь на свежем воздухе", el: "fire", add: "water", addP: "Добавьте воду и синие тона — уголок покоя после насыщенного дня" }
    },
    elFit: "Стихия, которая обычно подходит",
    alsoFits: "Также подходят",
    elAdd: "Стихия для баланса",
    fsH: "Фэншуй и характер: пять стихий в доме",
    fsLede: "Фэншуй рассматривает дом через пять стихий: Дерево, Огонь, Землю, Металл и Воду, у каждой свои цвета, материалы и формы. Дом со сбалансированными стихиями ощущается комфортным. Пометки «кому подходит» ниже — наша интерпретация для разговора об интерьере, а не классическое учение.",
    elements: {
      wood:  { n: "Дерево", c: "Зелёный, натуральное дерево, растения", f: "Рост, свежесть, забота", who: "Те, кто любит учиться, заботиться о других и хочет живой дом" },
      fire:  { n: "Огонь", c: "Красный, оранжевый, персиковый, тёплый свет", f: "Энергия, веселье, общение", who: "Те, кто любит встречи, активность и оживлённый дом" },
      earth: { n: "Земля", c: "Кремовый, песочный, терракота, травертин", f: "Стабильность, тепло, доверие", who: "Те, для кого на первом месте семья, порядок и долгий срок" },
      metal: { n: "Металл", c: "Белый, серый, золото, мрамор", f: "Ясность, точность, порядок", who: "Те, кто любит сдержанную роскошь, решает логикой и хочет дом, красивый с любой точки" },
      water: { n: "Вода", c: "Синий, чёрный, бассейны, вид на море", f: "Покой, течение, глубина", who: "Те, кто любит тишину, глубоко размышляет и нуждается в месте для восстановления" }
    },
    elSeen: "Где встречается",
    rulesH: "Принципы фэншуй, которые мы используем на страницах объектов",
    rulesLede: "Некоторые совпадают с выводами дизайна и психологии среды, другие — чистая вера. Для каждого это указано.",
    rules: [
      { k: "front", h: "Открытое пространство перед домом (мин тан)", p: "Открытый газон или двор перед домом, как считается, приглашает хорошую энергию. На практике это свет, воздух и хороший вид.", tag: "Вера + дизайн" },
      { k: "command", ref: "dosen", h: "Командная позиция", p: "Ставьте кровать или стол так, чтобы видеть дверь, а за спиной была глухая стена. Это совпадает с теорией «обзор–укрытие»: люди предпочитают места с видом и защитой. Обзор исследований показал, что доказательства для «обзора» сильнее, чем для «укрытия».", tag: "Частично подтверждено исследованиями" },
      { k: "water", ref: "ulrich", h: "Вода должна быть чистой и проточной", p: "Бассейны, фонтаны и пруды — стихия Воды, которая, как считается, притягивает богатство; держите их чистыми, без застоя. Исследования также показали, что вид на природу помогает быстрее восстанавливаться, так что сад и вода полезны и для души.", tag: "Вера + исследования" },
      { k: "line", h: "Дверь не на одной линии с окном или балконом", p: "Если от двери можно пройти прямо к балкону, энергия, как считается, быстро уходит. Помогут ширма, стеллаж или растение.", tag: "Вера" },
      { k: "beam", h: "Избегайте балок над головой и острых углов", p: "Не спите и не работайте прямо под балкой, выбирайте плавные линии вместо острых углов. Ткань, свет или подвесной потолок смягчат их.", tag: "Вера + комфорт" },
      { k: "zone", h: "Отделяйте отдых от общения", p: "Спальням лучше быть подальше от входной двери, кухни и зоны вечеринок. Дверь ванной у входа держите закрытой.", tag: "Дизайн" }
    ],
    rulesSeen: "Примеры",
    pillarsH: "Счастье, комфорт и удача",
    pillars: [
      { h: "Счастье", p: "Дом, подходящий характеру, делает каждый день легче — это соответствие человека и среды, которое исследования связывают с удовлетворённостью жизнью." },
      { h: "Комфорт", p: "Планировка, свет, звук и зонирование под ваш реальный образ жизни, а не только площадь или цена." },
      { h: "Удача", ref: "fortin", ref2: "bourassa", p: "Около 117 000 сделок с жильём в Ванкувере показали: дома с номером на 8 продавались на 2,5% дороже, на 4 — на 2,2% дешевле; исследование в Окленде тоже нашло счастливые номера в ценах. Верите или нет, эта вера влияет на реальную стоимость." }
    ],
    stepsH: "Как работает Personalized Matching",
    steps: [
      { h: "Узнайте свой тип", p: "Пройдите тест на 16personalities.com и пришлите нам четыре буквы или ответьте на короткие вопросы на странице «Найти свой дом»." },
      { h: "Расскажите, какой жизни хотите", p: "Образ жизни, кто будет жить, бюджет, покупка или аренда и обязательные условия." },
      { h: "Мы отберём подходящие дома", p: "Сопоставим характер, планировку, расположение, безопасность района, фэншуй и бюджет и предложим самые близкие варианты." },
      { h: "Посмотрите и решите", p: "Смотрите дом со всей информацией на руках, а если захотите обустроить его под себя, команда WIDEROOMS продолжит." }
    ],
    ctaH: "Давайте найдём подходящий вам дом",
    ctaP: "Свяжитесь с командой " + SITE.short + " напрямую — с результатом MBTI или без него, мы поможем начать.",
    testBtn: "Пройти тест MBTI",
    quizBtn: "Ответить на вопросы подбора",
    honestH: "Важно знать",
    honest: [
      { ref: "pittenger", p: "MBTI помогает проще говорить о предпочтениях; это не клиническая оценка. Многие психологи предупреждают: четыре буквы не стоит считать окончательным вердиктом." },
      { ref: "mccrae", p: "Личность не делится на чёткие противоположности, а лежит на шкале, поэтому мы всегда сочетаем MBTI с живым разговором." },
      { p: "Фэншуй — культурное верование. Сопоставление стихий и характера на этой странице — наша интерпретация для помощи с интерьером. Ориентация каждого дома ещё ждёт подтверждения от " + SITE.short + "." }
    ],
    refsH: "Источники",
    readMore: "Читать исследование",
    wr: "Обустройте дом под себя с WIDEROOMS"
  }
};

/* ---------- Land: plots and land zones ----------
   A land listing is type:"land" with `land` in sqm, `sale` (or saleAsk:true while the price is pending) and:
   deed "chanote" | "ns3k" | "other" · zoning "yellow" | "orange" | "red" | "purple" | "pink" | "green" | "brown"
   frontage (m) · road (text) · water / elec (true | false). Unknown fields show "Ask". */
const LAND_ZONE_IDS = ["sattahip", "huaiyai"];
const ZC = { yellow: "#E2B93B", orange: "#E0883A", red: "#C9453A", purple: "#7B4FA0", pink: "#E58FB1", green: "#5C9B4F", brown: "#8A5A3B" };
const lzTx = z => { const o = LAND_ZONES[z]; if (!o) return null; const [intro, points, fits] = o[lang] || o.en; return { intro, points, fits }; };
const raiTxt = sqm => {
  const wa = Math.round(sqm / 4), r = Math.floor(wa / 400), n = Math.floor(wa % 400 / 100), w = wa % 100;
  return [r && `${nf(r)} ${t("rai")}`, n && `${n} ${t("ngan")}`, w && `${w} ${t("sqw")}`].filter(Boolean).join(" ") || `0 ${t("sqw")}`;
};
const perWa = l => l.sale && l.land ? money(Math.round(l.sale / (l.land / 4))) : null;
function landKv(l) {
  const util = [l.water != null && `${t("water")} ${l.water ? "✓" : "✗"}`, l.elec != null && `${t("elec")} ${l.elec ? "✓" : "✗"}`].filter(Boolean).join(" · ");
  return [kvItem(t("code"), ref(l.code)), kvItem(t("type"), t(l.type)), kvItem(t("zone"), zn(l.zone)),
    kvItem(t("ldArea"), l.land ? `${raiTxt(l.land)} · ${nf(Math.round(l.land / 4))} ${t("sqw")}` : null),
    kvItem(t("ldTotal"), l.sale ? money(l.sale) : null), kvItem(t("ldPerWa"), perWa(l)),
    ...(l.near ? [kvItem(t("ldNear"), t("near_" + l.near))] : []), ...(utp(l) ? [kvItem(t("utpK"), utpTxt(l))] : []), kvItem(t("ldDeed"), l.deed ? t("deed_" + l.deed) : null),
    kvItem(t("ldZoning"), l.zoning ? t("zc_" + l.zoning) : null), kvItem(t("ldFront"), l.frontage ? `${l.frontage} ${t("mUnit")}` : null),
    kvItem(t("ldRoad"), l.road ? t("rd_" + l.road) : null), kvItem(t("ldUtil"), util || null)].join("");
}
const landCta = z => ["sell", "find"].map(m => `<button type="button" class="ld-big ld-${m}" data-land="${m}"${z ? ` data-lzone="${z}"` : ""}><b>${m === "sell" ? "🏷️" : "🔎"} ${t(m === "sell" ? "ldSell" : "ldFind")}</b><span>${t(m === "sell" ? "ldSellP" : "ldFindP")}</span></button>`).join("");
function renderLand() {
  const plots = L.filter(l => l.type === "land" && !l.parent);
  $("#ldZones").innerHTML = LAND_ZONE_IDS.map(z => {
    const LZ = lzTx(z), mine = plots.filter(l => l.zone === z), cover = mine[0] && photos(mine[0])[0];
    return `<article class="ld-zone">${cover ? `<a class="ld-cover" href="#/zone/${z}"><img src="${esc(cover)}" alt="" loading="lazy"></a>` : ""}
      <div class="ld-zbody"><div class="ld-zhd"><h3>${esc(zn(z))}</h3><span class="ld-n">${mine.length ? `${mine.length} ${t("ldPlots")}` : t("ldSoon")}</span></div>
      <p>${esc(LZ.intro)}</p>
      <div class="szbs">${szRows(z).filter(([k]) => !(SAFE_ZONES[z].cardHide || []).includes(k)).map(([k, h]) => szBadge(szLabel(k, h), h.lvl)).join("")}</div>
      <p class="ld-fits"><b>${t("ldFits")}:</b> ${LZ.fits.map(esc).join(" · ")}</p>
      <a class="btn sm" href="#/zone/${z}">🛡️ ${t("ldZoneBtn")} →</a></div></article>`;
  }).join("");
  $("#ldGrid").innerHTML = plots.map(l => card(l)).join(""); $("#ldGrid").hidden = !plots.length;
  $("#ldCta").innerHTML = landCta();
}
function landOverview(z, src) {
  const LZ = lzTx(z); if (!LZ) return "";
  return `<section class="ld-ov"><h2>${t("ldOverview")}</h2><p>${esc(LZ.intro)}</p>
    <ul>${LZ.points.map(([p, s]) => `<li>${esc(p)} ${s ? src(s) : ""}</li>`).join("")}</ul>
    <p class="ld-fits"><b>${t("ldFits")}:</b> ${LZ.fits.map(esc).join(" · ")}</p>
    <div class="ld-rules"><b>${t("ldRulesH")}</b><p>${t("ldRulesP")} ${src("landRules")}</p></div>
    <div class="ld-cta">${landCta(z)}</div></section>`;
}

/* land feng shui: six fixed checks per plot (shape, facing, road, terrain, back, surroundings), each rated good / ok / check,
   plus layout tips. Plots without an entry show nothing until their facing and shape are known. */
const LF_IC = { shape: "📐", facing: "🧭", road: "🛣️", terrain: "🌱", back: "🧱", around: "🏘️" };
function landFengSec(l) {
  const F = LAND_FENG[l.code]; if (!F) return "";
  const cnt = r => F.items.filter(i => i[1] === r).length;
  return `<div class="d-sec" id="landfeng"><h2>${t("lfsTitle")}</h2><p class="hs-kick">${t("lfsKick")}</p>
    <div class="lfs-sum">${["good", "ok", "check", "wait"].filter(cnt).map(r => `<span class="lr lr-${r}">${t("lr_" + r)} ${cnt(r)}</span>`).join("")}</div>
    <ul class="lfs-list">${F.items.map(([k, r, tx]) => `<li><span class="lfs-ic">${LF_IC[k]}</span><div><div class="lfs-hd"><b>${t("lfc_" + k)}</b><span class="lr lr-${r}">${t("lr_" + r)}</span></div><p>${esc(tx[lang] || tx.en)}</p></div></li>`).join("")}</ul>
    <div class="lfs-tips"><h3>${t("lfsTips")}</h3><ul class="hs-feng">${(F.tips[lang] || F.tips.en).map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <p class="mapnote">${t(F.pre === "gps" ? "lfsPreGps" : F.pre ? "lfsPre" : "lfsNote")} · <a href="#/matching">${t("lfsMore")} →</a></p></div>`;
}

/* land enquiry dialog: one form, two modes (sell / find), message sent like a viewing request */
function openLand(mode, zone) {
  const dlg = $("#landDlg"); dlg.dataset.mode = mode;
  $("#lTitle").textContent = t(mode === "sell" ? "lfSellT" : "lfFindT");
  opts($("#lZone"), [...LAND_ZONE_IDS.map(z => [z, zn(z)]), ["other", t("lfZoneOther")]], zone || $("#lZone").value || LAND_ZONE_IDS[0]);
  opts($("#lDeed"), ["chanote", "ns3k", "other"].map(k => [k, t("deed_" + k)]), $("#lDeed").value || "chanote");
  opts($("#lPurpose"), ["home", "invest", "biz"].map(k => [k, t("lp_" + k)]), $("#lPurpose").value || "home");
  opts($("#lCh"), ["LINE", "WhatsApp", "WeChat", "Telegram", "Phone", "Email"].map(x => [x, x === "Phone" ? t("call") : x === "Email" ? t("email") : x]), $("#lCh").value || "LINE");
  $("#lOut").hidden = true; dlg.showModal();
}
function landMessage() {
  const sell = $("#landDlg").dataset.mode === "sell", val = id => $(id).value.trim();
  const lines = [t(sell ? "msgSell" : "msgFind"), ""];
  const add = (k, v) => { if (v) lines.push(t(k) + ": " + v); };
  add("fName", val("#lName")); add("lfZone", $("#lZone").selectedOptions[0]?.textContent);
  if (sell) { add("lfLoc", val("#lLoc")); add("lfSize", val("#lSize")); add("lfPrice", val("#lPrice")); add("lfDeed", t("deed_" + val("#lDeed"))); }
  else { add("lfSize", val("#lSize")); add("fBudget", val("#lBudget")); add("lfPurpose", t("lp_" + val("#lPurpose"))); }
  add("fChannel", `${val("#lCh")} — ${val("#lHandle")}`); add("fNote", val("#lNote"));
  return lines.join("\n");
}

/* ---------- photo date & download all ---------- */
const LOCALES = { th: "th-TH", en: "en-GB", ru: "ru-RU", zh: "zh-CN", ko: "ko-KR", ja: "ja-JP" };
function fmtDate(iso) { try { return new Date(iso + "T00:00").toLocaleDateString(LOCALES[lang], { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return iso; } }
function saveBlob(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
async function downloadAll(l) {
  const ph = photos(l), btns = [...document.querySelectorAll('[data-act="dlall"]')], labels = btns.map(b => b.innerHTML);
  btns.forEach(b => { b.disabled = true; b.textContent = "⏳ " + t("dlPrep"); });
  const name = i => `${ref(l.code)}-${String(i + 1).padStart(2, "0")}.jpg`;
  try {
    const blobs = await Promise.all(ph.map(p => fetch(p).then(r => { if (!r.ok) throw new Error(p); return r.blob(); })));
    if (window.JSZip) {
      const zip = new JSZip();
      blobs.forEach((b, i) => zip.file(name(i), b));
      saveBlob(await zip.generateAsync({ type: "blob" }), `${ref(l.code)}-photos.zip`);
    } else {
      for (const [i, b] of blobs.entries()) { saveBlob(b, name(i)); await new Promise(r => setTimeout(r, 300)); }
    }
  } catch (e) {
    for (const p of ph) window.open(p, "_blank", "noopener");   // photos on another host (e.g. Drive): open them instead
  } finally {
    btns.forEach((b, i) => { b.disabled = false; b.innerHTML = labels[i]; });
  }
}

/* ---------- lightbox ---------- */
let lbList = [], lbIx = 0;
function lb(i) { lbIx = (i + lbList.length) % lbList.length; $("#lbImg").src = lbList[lbIx]; $("#lbTitle").textContent = `${lbIx + 1} / ${lbList.length}`; }

/* ---------- shortlist & compare ---------- */
function renderSl() {
  const s = saved().filter(byCode);
  $("#slbar").hidden = !s.length; $("#slCount").textContent = s.length;
}
function toggleSave(code) {
  let s = saved(); s = s.includes(code) ? s.filter(c => c !== code) : [...s, code];
  store.set(SITE.store + "saved", s); renderSl();
  document.querySelectorAll(`[data-star="${code}"]`).forEach(b => { const on = s.includes(code); b.setAttribute("aria-pressed", on); b.textContent = on ? "★" : "☆"; });
  const d = document.querySelector(`[data-dstar="${code}"]`); if (d) d.textContent = s.includes(code) ? t("saved") : t("save");
}
function renderCompare() {
  const ls = saved().map(byCode).filter(Boolean);
  const row = (label, f) => `<tr><th>${esc(label)}</th>${ls.map(l => `<td>${f(l) ?? "—"}</td>`).join("")}</tr>`;
  $("#cmpBody").innerHTML = `<table><tbody>
    <tr><th></th>${ls.map(l => `<td><a href="#/l/${l.code}" data-close><img src="${esc(photo(l, 1))}" alt=""></a><b style="display:block;margin-top:6px">${esc(nm(l))}</b><span class="code">${ref(l.code)}</span></td>`).join("")}</tr>
    ${row(t("type"), l => t(l.type))}${row(t("zone"), l => esc(zn(l.zone)))}
    ${row(t("forRent"), l => l.rent ? money(l.rent) + " " + t("perMonth") : null)}${row(t("forSale"), l => money(l.sale))}
    ${row(t("beds"), l => l.beds)}${row(t("baths"), l => l.baths)}
    ${row(t("usable"), l => area(l) ? nf(area(l)) + " " + t("sqm") : null)}${row(t("land"), l => landTxt(l))}
    ${row(t("pool"), l => l.pool ? t(l.pool === "private" ? "poolPrivate" : l.pool === "shared" ? "poolShared" : "poolYes") : null)}
    ${row(t("highlights"), l => l.tags.map(x => esc(t("tag_" + x))).join("<br>") || null)}
    <tr><th></th>${ls.map(l => `<td><button type="button" class="btn sm" data-unsave="${l.code}">✕</button></td>`).join("")}</tr>
  </tbody></table>`;
}

/* ---------- social post ---------- */
let socFmt = "post", socCode = null;
const SOC = { post: [1080, 1350], square: [1080, 1080], story: [1080, 1920] };
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
async function drawSocial() {
  const l = byCode(socCode); if (!l) return;
  const [W, H] = SOC[socFmt]; const cv = $("#socCanvas"); cv.width = W; cv.height = H; const g = cv.getContext("2d");
  try { await document.fonts.ready; } catch (e) {}
  g.fillStyle = KEY("deep", "#13263F"); g.fillRect(0, 0, W, H);
  try {
    const im = await loadImg(photo(l, 1));
    const s = Math.max(W / im.width, H / im.height), w = im.width * s, h = im.height * s;
    g.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
  } catch (e) {}
  const gr = g.createLinearGradient(0, H * .35, 0, H); gr.addColorStop(0, "rgba(10,20,34,0)"); gr.addColorStop(1, "rgba(10,20,34,.92)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const tg = g.createLinearGradient(0, 0, 0, 200); tg.addColorStop(0, "rgba(10,20,34,.6)"); tg.addColorStop(1, "rgba(10,20,34,0)"); g.fillStyle = tg; g.fillRect(0, 0, W, 200);
  const F = "'IBM Plex Sans Thai','PingFang SC','Hiragino Sans','Apple SD Gothic Neo',sans-serif";
  let lx = 60;
  try { const em = await loadImg(SITE.emblem); const eh = 104, ew = em.width * eh / em.height; g.drawImage(em, 52, 40, ew, eh); lx = 52 + ew + 18; } catch (e) {}
  g.fillStyle = "#fff"; g.font = `700 44px Fraunces, Georgia, serif`; g.fillText(SITE.short, lx, 96);
  g.fillStyle = KEY("gold", "#E9C27F"); g.font = `700 20px ${F}`; g.fillText(SITE.tag, lx, 126);
  let badge = l.urgent ? t("urgent") : l.rentWas ? t("discount") : l.hot ? t("hot") : t(l.type);
  g.font = `700 28px ${F}`; const bw = g.measureText(badge).width + 40;
  g.fillStyle = l.urgent || l.hot ? KEY("hot", "#8E5714") : KEY("accent", "#B57A27"); roundRect(g, W - 60 - bw, 62, bw, 54, 12); g.fill();
  g.fillStyle = "#fff"; g.fillText(badge, W - 60 - bw + 20, 99);
  let y = H - 90;
  g.fillStyle = "rgba(255,255,255,.85)"; g.font = `500 28px ${F}`;
  g.fillText(`LINE ${CONTACT.line}  ·  ☎ ${fmtPhone(CONTACT.phones[0])}`, 60, y);
  y -= 70;
  const pr = [];
  if (l.rent) pr.push(`${t("forRent")} ${money(l.rent)}${t("perMonth")}`);
  if (l.sale) pr.push(`${t("forSale")} ${money(l.sale)}`);
  g.fillStyle = KEY("gold", "#E9C27F"); g.font = `700 ${pr.length > 1 ? 44 : 54}px ${F}`;
  for (const p of pr.reverse()) { g.fillText(p, 60, y); y -= pr.length > 1 ? 58 : 66; }
  const sp = []; if (l.beds) sp.push(`${l.beds} ${t("beds")}`); if (l.baths) sp.push(`${l.baths} ${t("baths")}`); if (area(l)) sp.push(`${nf(area(l))} ${t("sqm")}`); else if (l.land) sp.push(`${nf(Math.round(l.land / 4))} ${t("sqw")}`);
  g.fillStyle = "#fff"; g.font = `500 32px ${F}`; g.fillText(sp.join("  ·  "), 60, y); y -= 56;
  g.font = `500 30px ${F}`; g.fillStyle = "rgba(255,255,255,.85)"; g.fillText("📍 " + zn(l.zone), 60, y); y -= 24;
  g.fillStyle = "#fff"; g.font = `700 64px ${F}`;
  const lines = wrap(g, nm(l), W - 120).slice(0, 2).reverse();
  for (const ln of lines) { y -= 76; g.fillText(ln, 60, y + 52); }
  const tg2 = SITE.tags || {};   // hashtags: agents/<id>/config.js SITE.tags { base, condo, commercial, house, brand }
  $("#socCap").value = lineText(l) + "\n\n" + [tg2.base, l.type === "condo" ? tg2.condo : l.type === "commercial" ? tg2.commercial : tg2.house, tg2.brand].filter(Boolean).join(" ");
}
function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function wrap(g, text, max) { const words = text.split(" "), out = []; let cur = ""; for (const w of words) { const n = cur ? cur + " " + w : w; if (g.measureText(n).width > max && cur) { out.push(cur); cur = w; } else cur = n; } if (cur) out.push(cur); return out; }

/* ---------- CSV (export + Google Sheet import) ---------- */
const CSV_COLS = ["code","name","type","zone","rent","rentWas","sale","saleWas","beds","baths","land","usable","usablePlus","size","floor","building","pool","style","tags","urgent","hot","isNew","photos","deposit","minContract","pets","furn","parking","internet","available","shortTerm","booked","photoDate","video","youtube","poster"];
function exportCSV() {
  const cell = v => { const s = Array.isArray(v) ? v.join("|") : v == null ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const rows = L.map(l => CSV_COLS.map(c => c === "photos" ? cell(photos(l)) : c === "booked" ? cell((l.booked || []).map(r => r.join(">"))) : cell(l[c])).join(","));
  const blob = new Blob(["﻿" + [CSV_COLS.join(","), ...rows].join("\n")], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = SITE.id + "-listings.csv"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function parseCSV(txt) {
  const rows = []; let row = [], cur = "", q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) { if (c === '"' && txt[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ",") { row.push(cur); cur = ""; } else if (c === "\n" || c === "\r") { if (c === "\r" && txt[i + 1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; } else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim()));
}
// Co-selling (Hybrid AI Agent Network rule, Thor 4 Nov 2026): a unit owned by another member is listed here through
// CO_LISTINGS in agents/<id>/config.js, { CODE: { from: "<owner id>", unit: "<owner's unit code>" } }. The owner's feed
// (agents/<owner>/feed.json, written by its build) is the master: price follows it, and a unit that is booked, sold or
// held there is taken off this site at once. If the feed can't be read, the listing stays as the Sheet has it.
async function loadCo() {
  const CO = typeof CO_LISTINGS !== "undefined" ? CO_LISTINGS : null; if (!CO) return false;
  const feeds = {};
  await Promise.all([...new Set(Object.values(CO).map(c => c.from))].map(id => fetch(`agents/${id}/feed.json`, { cache: "no-cache" })
    .then(r => r.ok ? r.json() : null).then(j => { if (j && j.units) feeds[id] = j.units; }).catch(() => {})));
  let changed = false;
  for (const code in CO) {
    const c = CO[code], F = feeds[c.from]; if (!F) continue;
    const u = F[c.unit], l = byCode(code); if (!l) continue;
    if (!u || !u.live) { L = L.filter(x => x.code !== code); changed = true; continue; }
    const was = u.price > u.sell ? u.price : null;
    if (l.sale !== u.sell) { l.sale = u.sell; changed = true; }
    if ((l.saleWas || null) !== was) { l.saleWas = was; changed = true; }
    l.co = { from: c.from, unit: c.unit };
  }
  return changed;
}
async function loadSheet() {
  if (!SHEET_CSV) return false;
  try {
    const res = await fetch(SHEET_CSV, { cache: "no-store" }); if (!res.ok) return false;
    const [hd, ...rows] = parseCSV((await res.text()).replace(/^﻿/, ""));
    const num = v => v === "" ? null : +String(v).replace(/[^\d.]/g, "");
    const bool = v => v === "" ? null : /^(1|true|yes|y|ใช่|ได้)$/i.test(v);
    const out = rows.map(r => { const o = {}; hd.forEach((h, i) => o[h.trim()] = (r[i] ?? "").trim()); return o; }).filter(o => o.code).map(o => ({
      code: o.code, name: o.name, type: o.type || "house", zone: ZONES[o.zone] ? o.zone : "eastpattaya",
      rent: num(o.rent), rentWas: num(o.rentWas), sale: num(o.sale), saleWas: num(o.saleWas), isNew: bool(o.isNew), beds: num(o.beds), baths: num(o.baths), land: num(o.land), usable: num(o.usable), usablePlus: bool(o.usablePlus),
      size: num(o.size), floor: o.floor || null, building: o.building || null, pool: o.pool || null, style: o.style || "modern", tags: o.tags ? o.tags.split("|") : [],
      urgent: bool(o.urgent), hot: bool(o.hot), latest: bool(o.latest), gallery: (o.gallery || "").split(/[|,\s]+/).map(Number).filter(n => n > 0), deposit: o.deposit || null, minContract: o.minContract || null, pets: bool(o.pets), furn: o.furn || null,
      parking: o.parking || null, internet: bool(o.internet), available: o.available || null, shortTerm: num(o.shortTerm), photoDate: o.photoDate || null, video: o.video || null, youtube: (o.youtube || "").replace(/^.*(?:v=|youtu\.be\/|embed\/)([\w-]{11}).*$/, "$1") || null, poster: o.poster || null, fb: o.fb || null, aiEdited: bool(o.aiEdited) === true, facing: o.facing || null, area: (m => m ? [+m[1], +m[2]] : null)(String(o.area || "").match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/)),
      booked: o.booked ? o.booked.split("|").map(r => r.split(">")) : [],
      photoList: (o.photos || "").split("|").map(s => s.trim()).filter(Boolean).map(s => /[\/.]/.test(s) ? s : `https://drive.google.com/thumbnail?id=${encodeURIComponent(s)}&sz=w1600`)
    }));
    if (out.length) {
      // the Sheet decides which listings exist and every field it has a column for; the LISTINGS snapshot only adds
      // fields the Sheet has no column for (land details, translated names). Listings not in the Sheet are not shown.
      const has = new Set(hd.map(h => h.trim())), src = { photoList: "photos" }, snap = Object.fromEntries(LISTINGS.map(l => [l.code, l]));
      L = out.map(o => { const b = snap[o.code]; if (!b) return o; const m = { ...b }; for (const k in o) if (has.has(src[k] || k) || m[k] === undefined) m[k] = o[k]; return m; });
      // column "gallery" (e.g. 1|9|12|15|20): the photos that lead the page — big front shot, then pool/view, living,
      // dining/kitchen, bedroom (Thor 28 Oct 2026). They move to the front of the photo list; the rest keep their order.
      L.forEach(l => { const pl = l.photoList; if (!l.gallery || !l.gallery.length || !pl || !pl.length) return;
        const pick = [...new Set(l.gallery)].filter(n => n <= pl.length).map(n => pl[n - 1]); l.photoList = [...pick, ...pl.filter(p => !pick.includes(p))]; });
      return true;
    }
  } catch (e) {}
  return false;
}

/* ====================================================================
   I18N, ROUTER, EVENTS
   ==================================================================== */
function applyI18n() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $("#lang").value = lang;
  $("#footNote").textContent = t("footNote", { d: UPDATED });
  $("#footCo").textContent = CONTACT.company; $("#footCoTh").textContent = CONTACT.companyTh; $("#footAddr").textContent = CONTACT.address;
}
// Thailand Living Insight buyer guide (LivingInsight*.html). ?from=asn makes the guide link back to this page.
const GUIDE_TX = {
  th:{hub:"คู่มือผู้ซื้อ · Thailand Living Insight",sub:"ข้อมูลที่ควรรู้ก่อนซื้อหรือเช่าบ้านในไทย พร้อมแหล่งอ้างอิง",Buying:"ซื้ออสังหาฯ สำหรับชาวต่างชาติ",Relocate:"วีซ่า ภาษี และการย้ายมาอยู่",Wellness:"บ้านที่ดีต่อสุขภาพ",SmartHome:"Smart Home",EEC:"EEC และอนาคตภาคตะวันออก"},
  en:{hub:"Buyer guide · Thailand Living Insight",sub:"What to know before you buy or rent in Thailand, with sources",Buying:"Buying as a foreigner",Relocate:"Visas, tax and moving here",Wellness:"A home that keeps you well",SmartHome:"Smart home",EEC:"EEC and the Eastern Seaboard"},
  ru:{hub:"Гид покупателя · Thailand Living Insight",sub:"Что важно знать перед покупкой или арендой в Таиланде",Buying:"Покупка для иностранцев",Relocate:"Визы, налоги и переезд",Wellness:"Дом для здоровья",SmartHome:"Умный дом",EEC:"EEC и Восточное побережье"},
  zh:{hub:"购房指南 · Thailand Living Insight",sub:"在泰国购房或租房前需要了解的信息",Buying:"外国人购房",Relocate:"签证、税务与移居",Wellness:"有益健康的住宅",SmartHome:"智能家居",EEC:"EEC 与东部经济走廊"},
  ko:{hub:"구매 가이드 · Thailand Living Insight",sub:"태국에서 집을 사거나 임대하기 전에 알아야 할 정보",Buying:"외국인 부동산 구매",Relocate:"비자, 세금, 이주",Wellness:"건강에 좋은 집",SmartHome:"스마트 홈",EEC:"EEC와 동부 경제회랑"},
  ja:{hub:"購入ガイド · Thailand Living Insight",sub:"タイで購入・賃貸する前に知っておきたい情報",Buying:"外国人の不動産購入",Relocate:"ビザ・税金・移住",Wellness:"健康に良い住まい",SmartHome:"スマートホーム",EEC:"EECと東部経済回廊"}
};
const guideUrl = (pg = "") => `LivingInsight${pg ? "-" + pg : ""}.html?from=${SITE.id}&lang=${lang}`;
const guideTx = k => (GUIDE_TX[lang] || GUIDE_TX.en)[k];
// Safe Living link text is per region: SL_TX in hai/regions/<region>.js (natural-hazard page named by SITE.safeLiving)
const slTx = k => { const X = typeof SL_TX !== "undefined" ? SL_TX : { en: {} }; return (X[lang] || X.en)[k] || ""; };
const slUrl = () => `${SITE.safeLiving}?from=${SITE.id}&lang=${lang}`;
const SL_SUB = {th:"น้ำท่วม แผ่นดินไหว สึนามิ พายุ ฝุ่น — ข้อมูลจริงพร้อมแหล่งอ้างอิง",en:"Floods, earthquakes, tsunami, storms, haze — real records with sources",ru:"Наводнения, землетрясения, цунами, штормы, смог — реальные данные с источниками",zh:"洪水、地震、海啸、风暴、雾霾——附来源的真实记录",ko:"홍수, 지진, 쓰나미, 폭풍, 미세먼지 — 출처가 있는 실제 기록",ja:"洪水・地震・津波・嵐・煙霧 — 出典付きの実記録"};
const slCard = () => `<div class="gd-card"><a href="${slUrl()}">🗺️ ${slTx("link")} →</a><small>${SL_SUB[lang] || SL_SUB.en}</small></div>`;
const slBtn = () => `<a class="btn sm" href="${slUrl()}">🗺️ ${slTx("link")} →</a>`;
function guideCard(l) {
  // rentals lead with the move/visa page, sales and land with the buying page
  const order = l.type === "land" ? ["Buying", "EEC", "Relocate"]
    : l.rent && !l.sale ? ["Relocate", "Wellness", "SmartHome", "Buying"]
    : ["Buying", "Relocate", "Wellness", "SmartHome", "EEC"];
  return `<div class="gd-card"><a href="${guideUrl()}">📘 ${guideTx("hub")} →</a><small>${guideTx("sub")}</small>
    <div class="gd-chips">${order.map(k => `<a href="${guideUrl(k)}">${guideTx(k)}</a>`).join("")}</div></div>`;
}
function renderFootGuide() {
  $("#footGuide").innerHTML = `<b>📘 <a href="${guideUrl()}">${guideTx("hub")}</a></b>` +
    ["Buying", "Relocate", "Wellness", "SmartHome", "EEC"].map(k => `<a href="${guideUrl(k)}">${guideTx(k)}</a>`).join("") +
    `<a href="${slUrl()}">🗺️ ${slTx("link")}</a>`;
}
function renderAll() {
  applyI18n();
  $("#navGuide").href = guideUrl(); $("#navSafe").href = slUrl(); $("#navSafe").textContent = slTx("nav"); renderFootGuide();
  renderHero(); renderStats(); renderServices(); renderHot(); fillFilters(); renderList();
  renderMatchForm(); renderBookForm(); renderReviews(); renderAbout(); renderContact(); renderSl(); drawZones(); renderLand();
  renderSzLinks();
  if (window.LIKit) { $("#lkStripSec").hidden = false; LIKit.strip($("#lkStrip"), lkBase()); }
  if (!$("#detailView").hidden && $("#detailView").dataset.code) renderDetail($("#detailView").dataset.code);
  else if (!$("#detailView").hidden && $("#detailView").dataset.zone) renderZone($("#detailView").dataset.zone);
  else if (!$("#detailView").hidden && $("#detailView").dataset.page === "matching") renderGuide();
  else if (!$("#detailView").hidden && $("#detailView").dataset.page === "destiny" && window.ASND) ASND.render($("#detailView").dataset.focus || "");
}
const SECTIONS = { listings: "listings", map: "map-sec", land: "land", match: "match", book: "book", about: "about", contact: "contact" };
function route() {
  const h = location.hash.replace(/^#\/?/, "");
  const [a, b] = h.split("/");
  $("#nav").classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded", "false");
  if (a === "l" && b) {
    $("#homeView").hidden = true; $("#detailView").hidden = false;
    renderDetail(b); window.scrollTo(0, 0); return;
  }
  if (a === "zone" && b) {
    $("#homeView").hidden = true; $("#detailView").hidden = false;
    renderZone(b); window.scrollTo(0, 0); return;
  }
  if (a === "destiny" && window.ASND) {
    $("#homeView").hidden = true; $("#detailView").hidden = false;
    ASND.render(b || ""); window.scrollTo(0, 0); return;
  }
  if (a === "matching") {
    $("#homeView").hidden = true; $("#detailView").hidden = false;
    renderGuide(); window.scrollTo(0, 0); return;
  }
  document.title = SITE.name;
  const wasDetail = !$("#detailView").hidden;
  $("#detailView").hidden = true; $("#homeView").hidden = false;
  if (wasDetail) initMap(), map && map.invalidateSize();
  if (a === "book" && b) { renderBookForm(b); }
  const id = SECTIONS[a];
  requestAnimationFrame(() => { if (id) document.getElementById(id).scrollIntoView(); else if (!a || a === "") window.scrollTo(0, wasDetail ? 0 : window.scrollY); });
}

document.addEventListener("click", e => {
  const yt = e.target.closest("[data-yt]");
  if (yt) { const f = document.createElement("iframe"); f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt.dataset.yt)}?autoplay=1&rel=0&playsinline=1`; f.title = "YouTube video"; f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true; yt.replaceWith(f); return; }
  if (e.target.closest("[data-wechat]")) { e.preventDefault(); $("#wcDlg").showModal(); return; }
  const szs = e.target.closest("[data-szs]");
  if (szs) {   // citation → scroll to its source without touching the hash router
    e.preventDefault();
    const li = document.getElementById("szs-" + szs.dataset.szs);
    if (li) { li.scrollIntoView({ behavior: "smooth", block: "center" }); li.classList.remove("szhit"); void li.offsetWidth; li.classList.add("szhit"); }
    return;
  }
  const ld = e.target.closest("[data-land]");
  if (ld) { e.preventDefault(); openLand(ld.dataset.land, ld.dataset.lzone || ""); return; }
  const mg = e.target.closest("[data-mgref],[data-mgjump]");
  if (mg) {   // guide citations and contents: scroll without touching the hash router
    e.preventDefault();
    const el = document.getElementById(mg.dataset.mgjump || "mgref-" + mg.dataset.mgref);
    if (el) {   // jump, then re-aim once lazy photos above have loaded and shifted the page
      const go = () => el.scrollIntoView({ behavior: "instant", block: mg.dataset.mgjump ? "start" : "center" });
      go(); setTimeout(go, 350);
      if (!mg.dataset.mgjump) { el.classList.remove("szhit"); void el.offsetWidth; el.classList.add("szhit"); }
    }
    return;
  }
  const cn = e.target.closest("[data-cnav]");
  if (cn) { e.preventDefault(); cardPhoto(cn.closest("[data-card]"), +cn.dataset.cnav); return; }
  const el = e.target.closest("[data-star],[data-dstar],[data-go],[data-zone],[data-mq],[data-lb],[data-act],[data-close],[data-unsave],[data-copy],[data-deal],[data-qdeal],[data-fmt]");
  if (!el) return;
  const d = el.dataset;
  if (d.star || d.dstar) { e.preventDefault(); toggleSave(d.star || d.dstar); }
  else if (d.go) location.hash = "#/l/" + d.go;
  else if (d.zone !== undefined) { st.zone = d.zone; fillFilters(); renderList(); drawZones(); if (map && d.zone) map.setView(ZONES[d.zone].ll, 13); }
  else if (d.mq) { mq[d.mq] = d.v; store.set(SITE.store + "mq", mq); renderMatchForm(); }
  else if (d.lb) { lbList = photos(byCode($("#detailView").dataset.code)); lb(+d.lb); $("#lbDlg").showModal(); }
  else if (d.act) {
    const l = byCode($("#detailView").dataset.code);
    if (d.act === "line") copy(lineText(l));
    if (d.act === "share") { if (navigator.share) navigator.share({ title: nm(l), text: `${nm(l)} · ${SITE.name}`, url: listingUrl(l) }).catch(() => {}); else copy(listingUrl(l)); }
    if (d.act === "social") { socCode = l.code; $("#socDlg").showModal(); drawSocial(); }
    if (d.act === "print") window.print();
    if (d.act === "dlall") downloadAll(l);
  }
  else if (d.close !== undefined) el.closest("dialog").close();
  else if (d.unsave) { toggleSave(d.unsave); if (!saved().length) $("#cmpDlg").close(); else renderCompare(); }
  else if (d.copy) { e.preventDefault(); copy(d.copy); }
  else if (d.deal) { st.deal = d.deal; st.budget = ""; fillFilters(); renderList(); }
  else if (d.qdeal) { document.querySelectorAll("[data-qdeal]").forEach(b => b.setAttribute("aria-pressed", b === el)); }
  else if (d.fmt) { socFmt = d.fmt; document.querySelectorAll("[data-fmt]").forEach(b => b.setAttribute("aria-pressed", b === el)); drawSocial(); }
});
$("#qs").addEventListener("submit", e => {
  e.preventDefault();
  st.deal = document.querySelector("[data-qdeal][aria-pressed='true']").dataset.qdeal;
  st.type = $("#qsType").value; st.zone = $("#qsZone").value; st.budget = "";
  fillFilters(); renderList(); drawZones(); document.getElementById("listings").scrollIntoView();
});
$("#q").addEventListener("input", e => { st.q = e.target.value; renderList(); });
for (const [id, k] of [["#fType", "type"], ["#fZone", "zone"], ["#fBudget", "budget"], ["#fSort", "sort"]]) $(id).addEventListener("change", e => { st[k] = e.target.value; renderList(); if (k === "zone") drawZones(); });
$("#fBeds").addEventListener("change", e => { st.beds = +e.target.value; renderList(); });
$("#fPool").addEventListener("click", () => { st.pool = !st.pool; $("#fPool").setAttribute("aria-pressed", st.pool); renderList(); });
$("#vGrid").addEventListener("click", () => { st.view = "grid"; renderList(); });
$("#vTable").addEventListener("click", () => { st.view = "table"; renderList(); });
$("#reset").addEventListener("click", () => { Object.assign(st, { deal: "any", type: "", zone: "", budget: "", beds: 0, pool: false, sort: "rec", q: "" }); fillFilters(); renderList(); drawZones(); });
$("#mDeal").addEventListener("change", e => { mq.deal = e.target.value; mq.budget = ""; store.set(SITE.store + "mq", mq); renderMatchForm(); });
$("#mBudget").addEventListener("change", e => { mq.budget = e.target.value; store.set(SITE.store + "mq", mq); renderMatch(); });
$("#mBeds").addEventListener("change", e => { mq.beds = +e.target.value; store.set(SITE.store + "mq", mq); renderMatch(); });
$("#bookForm").addEventListener("submit", e => {
  e.preventDefault();
  const msg = bookMessage();
  $("#bMsg").textContent = msg; $("#bOut").hidden = false;
  $("#bWa").href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
  $("#bMail").href = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Viewing request — " + SITE.name)}&body=${encodeURIComponent(msg)}`;
});
$("#bCopy").addEventListener("click", () => copy($("#bMsg").textContent));
$("#landForm").addEventListener("submit", e => {
  e.preventDefault();
  const msg = landMessage();
  $("#lMsg").textContent = msg; $("#lOut").hidden = false;
  $("#lWa").href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
  $("#lMail").href = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Land — " + SITE.name)}&body=${encodeURIComponent(msg)}`;
});
$("#lCopy").addEventListener("click", () => copy($("#lMsg").textContent));
$("#lLine").addEventListener("click", () => { copy($("#lMsg").textContent); window.open("https://line.me/ti/p/~" + encodeURIComponent(CONTACT.line), "_blank", "noopener"); });
$("#bLine").addEventListener("click", () => { copy($("#bMsg").textContent); window.open("https://line.me/ti/p/~" + encodeURIComponent(CONTACT.line), "_blank", "noopener"); });
$("#slCompare").addEventListener("click", () => { renderCompare(); $("#cmpDlg").showModal(); });
$("#slCopy").addEventListener("click", () => copy(saved().map(byCode).filter(Boolean).map(lineText).join("\n\n———\n\n")));
$("#slClear").addEventListener("click", () => { store.set(SITE.store + "saved", []); renderSl(); document.querySelectorAll("[data-star]").forEach(b => { b.setAttribute("aria-pressed", false); b.textContent = "☆"; }); });
$("#lbPrev").addEventListener("click", () => lb(lbIx - 1));
$("#lbNext").addEventListener("click", () => lb(lbIx + 1));
$("#lbDlg").addEventListener("keydown", e => { if (e.key === "ArrowLeft") lb(lbIx - 1); if (e.key === "ArrowRight") lb(lbIx + 1); });
$("#socDl").addEventListener("click", () => { const a = document.createElement("a"); a.download = `${ref(socCode)}-${socFmt}.png`; a.href = $("#socCanvas").toDataURL("image/png"); a.click(); });
$("#socCopy").addEventListener("click", () => copy($("#socCap").value));
$("#csvBtn").addEventListener("click", exportCSV);
$("#menuBtn").addEventListener("click", () => { const o = $("#nav").classList.toggle("open"); $("#menuBtn").setAttribute("aria-expanded", o); });
$("#lang").addEventListener("change", e => { lang = e.target.value; store.set(SITE.store + "lang", lang); renderAll(); });
document.querySelectorAll("dialog").forEach(dl => dl.addEventListener("click", e => { if (e.target === dl) dl.close(); }));
// Address bar: a listing shows as asn/CODE.html#/l/CODE so a link copied from the bar opens that listing's share page
// (LINE/Facebook read its own og:image); everything else shows the page shell (e.g. ASNProperty.html#/...) (Thor 2 Nov 2026).
const APP_URL = document.baseURI;
function syncPath() {
  const [a, b] = location.hash.replace(/^#\/?/, "").split("/");
  const path = a === "l" && b && byCode(b) ? new URL(SITE.share + b + ".html", APP_URL).pathname : a === "destiny" ? new URL(SITE.share + "destiny.html", APP_URL).pathname : new URL(APP_URL).pathname;
  if (location.pathname !== path) history.replaceState(history.state, "", path + location.search + location.hash);
}
let lastRouted = null;
const onNav = () => { if (location.hash !== lastRouted) { lastRouted = location.hash; route(); } syncPath(); };
// in-page links (#/...) change only the hash of whatever path is showing, so they never reload the page
document.addEventListener("click", e => {
  const a = e.target.closest && e.target.closest('a[href^="#/"]'); if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
  e.preventDefault(); const h = a.getAttribute("href"); if (location.hash !== h) location.hash = h; else onNav();
});
window.addEventListener("hashchange", onNav);
window.addEventListener("popstate", onNav);

(async function init() {
  const qp = new URLSearchParams(location.search).get("lang");
  const nav = (navigator.language || "th").slice(0, 2);
  lang = LANGS.includes(qp) ? qp : store.get(SITE.store + "lang", null) || (LANGS.includes(nav) ? nav : "th");
  if (!LANGS.includes(lang)) lang = "th";
  // legacy share links: ?l=H01
  const ql = new URLSearchParams(location.search).get("l");
  if (ql && !location.hash) location.hash = "#/l/" + ql;
  renderAll(); initMap(); lastRouted = location.hash; route(); syncPath();
  // decor / feng shui / MBTI for listings not in HOME_STYLE (the Facebook/Sheet listings) live in asn-style.json
  const styles = fetch(SITE.styleJson, { cache: "no-cache" }).then(r => r.ok ? r.json() : {}).then(o => { for (const k in o) if (!HOME_STYLE[k]) HOME_STYLE[k] = o[k]; return true; }).catch(() => false);
  const hls = fetch(SITE.hlJson, { cache: "no-cache" }).then(r => r.ok ? r.json() : {}).then(o => { Object.assign(HL, o); return true; }).catch(() => false);
  const [sheetOk, styleOk, hlOk] = await Promise.all([loadSheet(), styles, hls]);
  const coOk = await loadCo();   // after the Sheet: co-sold units follow their owner's feed
  DATA_READY = true;
  if (sheetOk || styleOk || hlOk || coOk || !$("#detailView").hidden) renderAll();
  if (coOk && /^#\/l\//.test(location.hash)) route();   // a co-sold unit that just went off must not stay open
})();
