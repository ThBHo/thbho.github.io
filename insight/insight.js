/* Thailand Living Insight — renderer shared by the hub and the topic pages.
   Content lives in content.js (window.LI). This file holds the UI strings, the
   property-page registry, the block renderers and the interactive widgets. */
(function(){
"use strict";
const C = window.LI;
const TOPIC = document.body.dataset.topic || "hub";

/* ---------------------------------------------------------------- languages */
// Languages with full content. Others fall back to English with a note.
const CONTENT_LANGS = ["th", "en"];
const ALL_LANGS = [["th","ไทย"],["en","EN"]];
const qs = new URLSearchParams(location.search);
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v === null ? d : v; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem(k, v); } catch(e){} },
  sget(k){ try { return sessionStorage.getItem(k); } catch(e){ return null; } },
  sset(k, v){ try { sessionStorage.setItem(k, v); } catch(e){} }
};
// wantLang is what the visitor asked for (passed back to the property page);
// lang is what this guide can show.
let wantLang = (qs.get("lang") || store.get("li-lang", "") || (navigator.language || "th").slice(0,2)).toLowerCase();
let lang = CONTENT_LANGS.includes(wantLang) ? wantLang : (wantLang === "th" ? "th" : "en");

/* ----------------------------------------------------- property pages (from) */
/* Pages that link into this guide pass ?from=<key>. Add a new property site here
   (developer projects, other agents) and link to LivingInsight.html?from=<key>. */
const PROPERTY_PAGES = {
  r2: {
    name: "The Riviera Jomtien",
    sub: { th:"ห้องขายต่อ · จอมเทียน พัทยา", en:"Resale units · Jomtien, Pattaya" },
    home: "Riviera2Resale.html",
    langParam: true,
    links: [
      { t:{ th:"ดูห้องทั้งหมด", en:"Browse all units" }, s:{ th:"ราคา ผัง และรูปจริงทุกห้อง", en:"Prices, plans and real photos" }, u:"Riviera2Resale.html" },
      { t:{ th:"หาห้องที่ใช่", en:"Find your match" }, s:{ th:"จับคู่ห้องตามไลฟ์สไตล์", en:"Match a unit to your lifestyle" }, u:"Riviera2Resale-matching.html" }
    ]
  },
  asn: {
    name: "ASN Exclusive Property",
    sub: { th:"บ้าน คอนโด ที่ดิน · พัทยา", en:"Homes, condos & land · Pattaya" },
    home: "ASNProperty.html",
    langParam: true,
    links: [
      { t:{ th:"ดูทรัพย์ทั้งหมด", en:"Browse all listings" }, s:{ th:"บ้าน คอนโด และที่ดิน", en:"Houses, condos and land" }, u:"ASNProperty.html#/listings" },
      { t:{ th:"หาบ้านที่ใช่", en:"Find your match" }, s:{ th:"ตอบไม่กี่ข้อ แล้วเราคัดให้", en:"Answer a few questions" }, u:"ASNProperty.html#/match" }
    ]
  }
};
// When someone lands without ?from (a shared link), list these pages in the CTA.
const DIRECT_LIST = ["r2", "asn"];

let fromKey = (qs.get("from") || store.sget("li-from") || "").toLowerCase();
if (!PROPERTY_PAGES[fromKey]) fromKey = "";
if (fromKey) store.sset("li-from", fromKey);

const withLang = (u, p) => {
  if (!p.langParam) return u;
  const [base, hash] = u.split("#");
  return base + (base.includes("?") ? "&" : "?") + "lang=" + encodeURIComponent(wantLang) + (hash ? "#" + hash : "");
};
const pageUrl = id => {
  const file = id === "hub" ? "LivingInsight.html" : "LivingInsight-" + C.topics[id].slug + ".html";
  const p = new URLSearchParams();
  if (fromKey) p.set("from", fromKey);
  if (wantLang !== "th") p.set("lang", wantLang);
  const s = p.toString();
  return file + (s ? "?" + s : "");
};

/* --------------------------------------------------------------- UI strings */
const UI = {
  th: {
    brandSub:"Thailand 2026", back:"กลับไปที่", hub:"ภาพรวม", checked:"ตรวจข้อมูลล่าสุด", read:"อ่านราว {n} นาที",
    sources:"แหล่งข้อมูล", srcNote:"ตัวเลขทั้งหมดมาจากแหล่งด้านล่าง ณ วันที่ระบุ บางแหล่งเป็นบทความของบริษัทที่ปรึกษาหรือเอเจนซี ควรตรวจกับหน่วยงานทางการก่อนตัดสินใจ",
    disc:"ข้อมูลนี้ใช้ประกอบการตัดสินใจเท่านั้น ไม่ใช่คำแนะนำทางกฎหมาย ภาษี การลงทุน หรือการแพทย์ กฎและตัวเลขเปลี่ยนได้ โปรดตรวจกับหน่วยงานที่เกี่ยวข้องหรือที่ปรึกษาอิสระก่อนดำเนินการ",
    copy:"คัดลอกลิงก์", copied:"คัดลอกลิงก์แล้ว", line:"แชร์ทาง LINE", print:"พิมพ์ / PDF",
    ctaH:"พร้อมดูทรัพย์จริงแล้ว?", ctaP:"ใช้ข้อมูลในหน้านี้เทียบกับห้องหรือบ้านที่สนใจ แล้วนัดดูของจริง",
    ctaDirect:"เว็บไซต์อสังหาฯ ที่ใช้คู่มือนี้", more:"หัวข้ออื่น", open:"อ่านต่อ →",
    fallback:"เนื้อหาภาษานี้กำลังแปล ตอนนี้แสดงเป็นภาษาอังกฤษ",
    st:{ building:"กำลังก่อสร้าง", delayed:"ล่าช้า / ติดปัญหา", operating:"เปิดใช้แล้ว", approved:"อนุมัติแล้ว", planned:"ยังเป็นแผน", investing:"มีเงินลงทุนเข้าแล้ว" },
    reportsH:"รายงานเชิงลึกต้นฉบับ", reportsP:"บทวิเคราะห์ฉบับเต็มที่หน้านี้ใช้อ้างอิง บางฉบับเป็นข้อมูลเดือนมีนาคม 2026",
    topicsH:"เลือกหัวข้อ", factsH:"6 เรื่องที่ควรรู้ในปี 2026"
  },
  en: {
    brandSub:"Thailand 2026", back:"Back to", hub:"Overview", checked:"Last checked", read:"About {n} min read",
    sources:"Sources", srcNote:"Every figure comes from the sources below, as of the dates shown. Some are consultancy or agency articles, so check with the official body before you decide.",
    disc:"This guide is for background only. It is not legal, tax, investment or medical advice. Rules and numbers change, so check with the relevant authority or an independent adviser before you act.",
    copy:"Copy link", copied:"Link copied", line:"Share on LINE", print:"Print / PDF",
    ctaH:"Ready to see real homes?", ctaP:"Hold the listings you like up against this guide, then book a viewing.",
    ctaDirect:"Property sites that use this guide", more:"More topics", open:"Read →",
    fallback:"This language is being translated. The guide is shown in English for now.",
    st:{ building:"Under construction", delayed:"Delayed / stuck", operating:"Operating", approved:"Approved", planned:"Still a plan", investing:"Money committed" },
    reportsH:"Original deep-dive reports", reportsP:"The full analyses this guide draws on. Some date from March 2026.",
    topicsH:"Pick a topic", factsH:"Six things to know in 2026"
  }
};
const u = k => (UI[lang] && UI[lang][k]) || UI.en[k];
const L = o => o == null ? "" : (typeof o === "string" ? o : (o[lang] ?? o.en ?? o.th ?? ""));
const nf = new Intl.NumberFormat("en-US");
const baht = n => "฿" + nf.format(Math.round(n));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[c]);
// content strings are authored HTML; [[n]] becomes a link to source n
const rich = s => L(s).replace(/\[\[(\d+)\]\]/g, (m, n) => `<a class="ref" href="#src-${n}">[${n}]</a>`);
const $ = s => document.querySelector(s);

/* -------------------------------------------------------------------- icons */
const IC = {
  logo:'<path d="M4 20V10l8-6 8 6v10"/><path d="M9 20v-6h6v6"/>',
  wellness:'<path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"/><path d="M8.5 12h2l1-2 2 4 1-2h1"/>',
  smarthome:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><circle cx="12" cy="14" r="2"/><path d="M8.5 11.5a5 5 0 0 1 7 0"/>',
  relocate:'<path d="M2 16l20-8-6 12-3-5-5 3z"/><path d="M13 15l3-3"/>',
  eec:'<path d="M3 21h18"/><path d="M5 21V9l5-3v15"/><path d="M10 21V4l9 5v12"/><path d="M14 12h2M14 16h2"/>',
  buying:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>',
  hub:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  wind:'<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h16a3 3 0 1 1-3 3"/><path d="M3 16h7"/>',
  drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  hospital:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 7v6M9 10h6M9 21v-4h6v4"/>',
  wave:'<path d="M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M2 17c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>',
  leaf:'<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19l7-7"/>',
  spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  snow:'<path d="M12 2v20M4 6l16 12M20 6L4 18"/>',
  bulb:'<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  plane:'<path d="M2 16l20-8-6 12-3-5-5 3z"/>',
  coin:'<circle cx="12" cy="12" r="9"/><path d="M9 9.5c0-1 1.3-2 3-2s3 .8 3 2-1.5 1.7-3 2-3 .8-3 2 1.3 2 3 2 3-1 3-2M12 5v2M12 17v2"/>',
  school:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/>',
  doc:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  chip:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  ship:'<path d="M3 17l2 4h14l2-4z"/><path d="M5 17V9h14v8M9 9V5h6v4"/>',
  car:'<path d="M5 16l1.5-5h11L19 16"/><rect x="3" y="16" width="18" height="4" rx="1"/><circle cx="7" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M13 8l-2 3h3l-2 3"/>',
  home:'<path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  warn:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  print:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
  chat:'<path d="M21 12a8 8 0 0 1-12 7l-5 1 1.5-4A8 8 0 1 1 21 12z"/>',
  arrowL:'<path d="M15 18l-6-6 6-6"/>',
  people:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a5 5 0 0 1 6 5"/>',
  wallet:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>',
  bank:'<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>'
};
const ic = (k, cls) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${IC[k] || IC.info}</svg>`;

/* --------------------------------------------------------------- page parts */
const ORDER = ["wellness", "smarthome", "relocate", "eec", "buying"];

function topbar(){
  const p = PROPERTY_PAGES[fromKey];
  const back = p ? `<a class="back on" id="backLink" href="${esc(withLang(p.home, p))}">${ic("arrowL")}<span class="lbl">${u("back")}</span>&nbsp;${esc(p.name)}</a>` : "";
  return `<header class="topbar"><div class="wrap topbar-in">
    <a class="logo" href="${pageUrl("hub")}"><span class="logo-mark">${ic("logo")}</span><span><b>Living Insight</b><small>${u("brandSub")}</small></span></a>
    ${back}
    <div class="langs" role="group" aria-label="Language">${ALL_LANGS.map(([k, n]) => `<button type="button" data-lang="${k}" aria-pressed="${k === lang}">${n}</button>`).join("")}</div>
  </div></header>`;
}

function tabs(){
  const items = [["hub", u("hub")], ...ORDER.map(id => [id, L(C.topics[id].short)])];
  return `<nav class="tabs" aria-label="Topics"><div class="wrap tabs-in">${items.map(([id, n]) =>
    `<a class="tab" href="${pageUrl(id)}"${id === TOPIC ? ' aria-current="page"' : ""}>${ic(id)}${esc(n)}</a>`).join("")}</div></nav>`;
}

function readMinutes(t){
  const txt = JSON.stringify(t.blocks.map(b => b)).replace(/"(th|en)":"/g, "");
  const chars = (txt.match(lang === "th" ? /[฀-๿]/g : /[A-Za-z]/g) || []).length;
  return Math.max(3, Math.round(chars / (lang === "th" ? 1100 : 1300)));
}

function hero(t){
  const stats = (t.stats || []).map(s => `<div class="stat"><b>${esc(L(s.v))}</b><span>${rich(s.l)}${s.src ? `<a class="ref" href="#src-${s.src}">[${s.src}]</a>` : ""}</span></div>`).join("");
  return `<section class="hero"><div class="wrap hero-in">
    <div>
      <span class="kicker">${ic(TOPIC)}${esc(L(t.kicker))}</span>
      <h1>${rich(t.title)}</h1>
      <p class="lead">${rich(t.lead)}</p>
      <div class="meta"><span><i></i>${u("checked")} ${esc(L(C.checked))}</span>${t.blocks ? `<span>${u("read").replace("{n}", readMinutes(t))}</span>` : ""}</div>
      <p class="fallback-note${lang !== wantLang && wantLang !== "th" && wantLang !== "en" ? " on" : ""}">${u("fallback")}</p>
    </div>
    ${stats ? `<div class="stats">${stats}</div>` : ""}
  </div></section>`;
}

/* ------------------------------------------------------------------- blocks */
let secNo = 0;
const head = b => {
  if (!b.h) return "";
  secNo++;
  return `<div class="sec-hd"><span class="sec-no">${String(secNo).padStart(2, "0")}</span><h2>${rich(b.h)}</h2></div>${b.intro ? `<p class="sec-intro">${rich(b.intro)}</p>` : ""}`;
};
const R = {
  text: b => `${head(b)}<div class="prose">${[].concat(b.p).map(p => `<p>${rich(p)}</p>`).join("")}</div>`,
  cards: b => `${head(b)}<div class="cards">${b.items.map(c => `<article class="card">
      ${c.ic ? `<div class="card-ic">${ic(c.ic)}</div>` : ""}<h3>${rich(c.t)}</h3>
      ${c.d ? `<p>${rich(c.d)}</p>` : ""}${c.list ? `<ul>${c.list.map(x => `<li>${rich(x)}</li>`).join("")}</ul>` : ""}
      ${c.tag ? `<span class="tag">${esc(L(c.tag))}</span>` : ""}</article>`).join("")}</div>`,
  callout: b => `<div class="callout${b.tone === "warn" ? " warn" : ""}">${ic(b.tone === "warn" ? "warn" : "info")}<div>${b.t ? `<b class="ct">${rich(b.t)}</b>` : ""}<p>${rich(b.p)}</p></div></div>`,
  table: b => `${head(b)}<div class="tbl-wrap"><table><thead><tr>${b.cols.map(c => `<th>${esc(L(c))}</th>`).join("")}</tr></thead><tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${rich(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${b.note ? `<p class="tbl-note">${rich(b.note)}</p>` : ""}`,
  timeline: b => `${head(b)}<ol class="tl">${b.items.map(i => `<li><div class="when"><span class="chip st-${i.st}">${u("st")[i.st]}</span><small>${rich(i.when)}</small></div><div><h3>${rich(i.t)}</h3><p>${rich(i.d)}</p></div></li>`).join("")}</ol>`,
  proscons: b => `${head(b)}<div class="pc"><div class="pro"><h3>${rich(b.pro.t)}</h3><ul>${b.pro.items.map(x => `<li>${rich(x)}</li>`).join("")}</ul></div><div class="con"><h3>${rich(b.con.t)}</h3><ul>${b.con.items.map(x => `<li>${rich(x)}</li>`).join("")}</ul></div></div>`,
  check: b => `${head(b)}<ul class="check">${b.items.map(x => `<li>${rich(x)}</li>`).join("")}</ul>`,
  steps: b => `${head(b)}<ol class="steps">${b.items.map(s => `<li><h3>${rich(s.t)}</h3><p>${rich(s.d)}</p></li>`).join("")}</ol>`,
  widget: (b, i) => `${head(b)}<div class="widget" id="w${i}" data-w="${b.w}"></div>`
};

function cta(){
  const p = PROPERTY_PAGES[fromKey];
  if (p){
    return `<section class="cta"><div><h2>${u("ctaH")}</h2><p>${u("ctaP")}</p></div><div class="cta-links">${p.links.map((l, i) =>
      `<a class="btn${i ? " ghost" : ""}" href="${esc(withLang(l.u, p))}"><span>${esc(L(l.t))}<small>${esc(p.name)} · ${esc(L(l.s))}</small></span>→</a>`).join("")}</div></section>`;
  }
  const list = DIRECT_LIST.map(k => [k, PROPERTY_PAGES[k]]).filter(x => x[1]);
  if (!list.length) return "";
  return `<section class="cta"><div><h2>${u("ctaH")}</h2><p>${u("ctaDirect")}</p></div><div class="cta-links">${list.map(([k, p], i) =>
    `<a class="btn${i ? " ghost" : ""}" href="${esc(withLang(p.home, p))}"><span>${esc(p.name)}<small>${esc(L(p.sub))}</small></span>→</a>`).join("")}</div></section>`;
}

function nextTopics(){
  return `<div class="sec"><div class="sec-hd"><h2>${u("more")}</h2></div><div class="next">${ORDER.filter(id => id !== TOPIC).map(id =>
    `<a href="${pageUrl(id)}" style="--c:${C.topics[id].color}">${ic(id)}${esc(L(C.topics[id].short))}</a>`).join("")}</div></div>`;
}

function sources(list){
  if (!list || !list.length) return "";
  return `<section class="sec" id="sources"><div class="sec-hd"><h2>${u("sources")}</h2></div><p class="sec-intro">${u("srcNote")}</p>
    <ol class="srcs">${list.map((s, i) => `<li id="src-${i + 1}">${s.u ? `<a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(L(s.t))}</a>` : esc(L(s.t))}${s.d ? ` · ${esc(L(s.d))}` : ""}</li>`).join("")}</ol></section>`;
}

function tools(){
  return `<div class="tools">
    <button type="button" class="tbtn" id="copyBtn">${ic("link")}${u("copy")}</button>
    <a class="tbtn" id="lineBtn" target="_blank" rel="noopener">${ic("chat")}${u("line")}</a>
    <button type="button" class="tbtn" id="printBtn">${ic("print")}${u("print")}</button>
  </div><p class="disc">${u("disc")}</p>`;
}

function foot(){
  return `<footer class="foot"><div class="wrap">
    <p>© 2026 Thailand Living Insight</p>
    <div class="credit"><span>${lang === "th" ? "พัฒนาเว็บไซต์และแนวคิดโดย" : "Concept & website by"}</span>
      <a href="https://thbho.github.io/EngWiderooms.html" target="_blank" rel="noopener"><img src="insight/logo-widerooms.jpg" alt="WIDEROOMS"></a>
      <a href="https://thbho.github.io/AIGymmateXFactory.html" target="_blank" rel="noopener"><img src="insight/logo-thho.jpg" alt="Th.Ho · AI GymMateX Factory"></a></div>
  </div></footer>`;
}

/* ---------------------------------------------------------------- hub page */
function hubBody(){
  const h = C.hub;
  const cards = ORDER.map(id => {
    const t = C.topics[id];
    return `<a class="tcard" href="${pageUrl(id)}" style="--c:${t.color}"><div class="card-ic">${ic(id)}</div><small>${esc(L(t.kicker))}</small><h3>${esc(L(t.cardTitle || t.short))}</h3><p>${rich(t.cardText)}</p><span class="go">${u("open")}</span></a>`;
  }).join("");
  const facts = h.facts.map(f => `<li><b>${esc(L(f.k))}</b><span>${rich(f.t)} <a href="${pageUrl(f.topic)}">${esc(L(C.topics[f.topic].short))} →</a></span></li>`).join("");
  const reports = h.reports.map(r => `<a class="report" href="${esc(r.u)}" target="_blank" rel="noopener"><b>${esc(L(r.t))}</b><small>${esc(L(r.d))}</small></a>`).join("");
  return `<section class="sec"><div class="sec-hd"><h2>${u("topicsH")}</h2></div><div class="topics">${cards}</div></section>
    <section class="sec"><div class="sec-hd"><h2>${u("factsH")}</h2></div><ul class="facts">${facts}</ul></section>
    <section class="sec"><div class="sec-hd"><h2>${u("reportsH")}</h2></div><p class="sec-intro">${u("reportsP")}</p><div class="reports">${reports}</div></section>`;
}

/* ------------------------------------------------------------------ render */
function render(){
  document.documentElement.lang = lang;
  secNo = 0;
  const isHub = TOPIC === "hub";
  const t = isHub ? C.hub : C.topics[TOPIC];
  const body = isHub ? hubBody() : t.blocks.map((b, i) => b.type === "callout" ? `<div class="wrap-c">${R.callout(b)}</div>` : `<section class="sec">${R[b.type](b, i)}</section>`).join("");
  document.title = L(t.docTitle || t.title).replace(/<[^>]+>/g, "") + " · Thailand Living Insight";
  $("#app").innerHTML = topbar() + tabs() + hero(t) + `<main class="wrap">${body}${cta()}${isHub ? "" : nextTopics()}${sources(t.sources)}${tools()}</main>` + foot();
  if (!isHub) t.blocks.forEach((b, i) => { if (b.type === "widget") WIDGETS[b.w]($("#w" + i), b); });
  bind();
}

function bind(){
  document.querySelectorAll(".langs button").forEach(b => b.addEventListener("click", () => {
    lang = wantLang = b.dataset.lang; store.set("li-lang", lang);
    const p = new URLSearchParams(location.search); p.set("lang", lang);
    history.replaceState(null, "", location.pathname + "?" + p.toString() + location.hash);
    render();
  }));
  const back = $("#backLink");
  if (back) back.addEventListener("click", e => {
    // return to the exact spot on the property page when we came straight from it
    const p = PROPERTY_PAGES[fromKey];
    if (document.referrer && document.referrer.split("?")[0].split("#")[0].endsWith(p.home) && history.length > 1){ e.preventDefault(); history.back(); }
  });
  const share = location.origin + location.pathname + (fromKey || wantLang !== "th" ? "?" + new URLSearchParams(Object.assign(fromKey ? { from: fromKey } : {}, wantLang !== "th" ? { lang: wantLang } : {})).toString() : "");
  $("#copyBtn").addEventListener("click", () => {
    const done = () => toast(u("copied"));
    if (navigator.clipboard) navigator.clipboard.writeText(share).then(done, () => prompt("", share)); else prompt("", share);
  });
  $("#lineBtn").href = "https://line.me/R/share?text=" + encodeURIComponent(document.title + "\n" + share);
  $("#printBtn").addEventListener("click", () => print());
}

function toast(msg){
  let el = $(".toast");
  if (!el){ el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
  el.textContent = msg; el.classList.add("on");
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 1800);
}

/* ================================================================= widgets */
const W = {
  th: {
    score:"คะแนน", yes:"ใช่", no:"ไม่ใช่ / ไม่แน่ใจ", total:"รวม", perMonth:"/เดือน", perYear:"/ปี",
    sel:"รายการที่เลือก", range:"งบประมาณโดยประมาณ", items:"{n} รายการ",
    vfAge:"อายุของคุณ", vfAge1:"ต่ำกว่า 50", vfAge2:"50 ขึ้นไป",
    vfWork:"รายได้หลักมาจาก", vfW1:"เงินเดือนจากบริษัทต่างประเทศ", vfW2:"ฟรีแลนซ์ / ธุรกิจตัวเอง", vfW3:"บำนาญ / รายได้จากการลงทุน", vfW4:"ทำงานกับบริษัทในไทย",
    vfInc:"รายได้ต่อปี", vfI1:"ต่ำกว่า US$40k", vfI2:"US$40k–80k", vfI3:"US$80k ขึ้นไป",
    vfInv:"เงินที่พร้อมลงในไทย (รวมค่าซื้อห้อง)", vfV1:"ต่ำกว่า ฿800k", vfV2:"฿800k – US$500k", vfV3:"US$500k ขึ้นไป",
    vfStay:"แผนการอยู่", vfS1:"มาเที่ยว ครั้งละไม่เกินเดือน", vfS2:"อยู่ราว 6 เดือนต่อปี", vfS3:"อยู่ประจำทั้งปี",
    vfRes:"วีซ่าที่น่าจะเหมาะ", vfBest:"เหมาะที่สุด", vfAlso:"ทางเลือก", vfNone:"ตอบคำถามด้านซ้ายเพื่อดูผล",
    vfNote:"ผลนี้เป็นแนวทางเบื้องต้น เงื่อนไขจริงขึ้นกับสัญชาติและดุลยพินิจของเจ้าหน้าที่",
    ccPrice:"ราคาซื้อขาย (บาท)", ccSize:"ขนาดห้อง (ตร.ม.)", ccAppr:"ราคาประเมินราชการ (ถ้าทราบ)", ccApprPh:"ไม่ทราบ = ใช้ราคาซื้อขาย",
    ccSplit:"ค่าธรรมเนียมโอน 2% ใครจ่าย", ccS1:"ผู้ซื้อจ่ายทั้งหมด", ccS2:"แบ่งคนละครึ่ง (ที่นิยม)", ccS3:"ผู้ขายจ่ายทั้งหมด",
    ccNew:"ซื้อจาก", ccN1:"มือสอง (Resale)", ccN2:"โครงการใหม่จากผู้พัฒนา",
    ccHeld:"ผู้ขายถือครองมาแล้ว", ccH1:"ไม่ถึง 5 ปี", ccH2:"5 ปีขึ้นไป",
    ccFee:"ค่าส่วนกลาง (บาท/ตร.ม./เดือน)", ccSink:"กองทุนส่วนกลาง (บาท/ตร.ม. จ่ายครั้งเดียว)",
    ccBuyer:"ผู้ซื้อจ่าย ณ วันโอน", ccTransfer:"ค่าธรรมเนียมการโอน (ส่วนของผู้ซื้อ)", ccSinkL:"กองทุนส่วนกลาง (เฉพาะโครงการใหม่)", ccFeeL:"ค่าส่วนกลางล่วงหน้า 12 เดือน (โครงการใหม่)", ccRun:"ค่าใช้จ่ายประจำ: ค่าส่วนกลาง",
    ccBuyerTot:"รวมผู้ซื้อ", ccSeller:"ผู้ขายจ่าย (เพื่อเทียบราคา)", ccSbt:"ภาษีธุรกิจเฉพาะ 3.3%", ccStamp:"อากรแสตมป์ 0.5%", ccTransferS:"ค่าธรรมเนียมการโอน (ส่วนของผู้ขาย)",
    ccWht:"ภาษีเงินได้หัก ณ ที่จ่าย", ccWhtV:"สำนักงานที่ดินคำนวณ", ccOfPrice:"ของราคา",
    ccNote:"ประมาณการจากอัตราปี 2026: ค่าโอน 2% ของราคาประเมิน ภาษีธุรกิจเฉพาะหรืออากรคิดจากราคาที่สูงกว่าระหว่างราคาซื้อขายกับราคาประเมิน ผู้ซื้อชาวไทยได้ลดค่าโอนเหลือ 0.01% (ห้องไม่เกิน ฿7 ล้าน ถึง 30 มิ.ย. 2027) แต่ชาวต่างชาติไม่ได้ ใครจ่ายส่วนไหนตกลงกันได้ในสัญญา",
    mapNote:"แผนที่ย่อ ไม่ตามมาตราส่วนจริง ระยะทางและเวลาเดินทางโดยประมาณจากจอมเทียน",
    mapRoad:"มอเตอร์เวย์ / ถนนหลัก", mapRail:"รถไฟความเร็วสูง (ยังไม่เริ่มสร้าง)", mapYou:"จอมเทียน"
  },
  en: {
    score:"Score", yes:"Yes", no:"No / not sure", total:"Total", perMonth:"/month", perYear:"/year",
    sel:"Selected", range:"Estimated budget", items:"{n} items",
    vfAge:"Your age", vfAge1:"Under 50", vfAge2:"50 or over",
    vfWork:"Your main income", vfW1:"Salary from an overseas company", vfW2:"Freelance / own business", vfW3:"Pension / investment income", vfW4:"Job with a Thai company",
    vfInc:"Yearly income", vfI1:"Under US$40k", vfI2:"US$40k–80k", vfI3:"US$80k or more",
    vfInv:"Money you can put into Thailand (incl. the home)", vfV1:"Under ฿800k", vfV2:"฿800k – US$500k", vfV3:"US$500k or more",
    vfStay:"How you plan to stay", vfS1:"Holidays, under a month each", vfS2:"About 6 months a year", vfS3:"Full time",
    vfRes:"Visas that may fit", vfBest:"Best fit", vfAlso:"Also consider", vfNone:"Answer the questions to see results",
    vfNote:"A first pointer only. The real rules depend on your nationality and the officer's decision.",
    ccPrice:"Sale price (THB)", ccSize:"Unit size (sqm)", ccAppr:"Official appraised value (if known)", ccApprPh:"Unknown = use sale price",
    ccSplit:"Who pays the 2% transfer fee", ccS1:"Buyer pays all", ccS2:"Split 50/50 (common)", ccS3:"Seller pays all",
    ccNew:"Buying", ccN1:"Resale", ccN2:"New from the developer",
    ccHeld:"Seller has owned it for", ccH1:"Under 5 years", ccH2:"5 years or more",
    ccFee:"Common fee (THB/sqm/month)", ccSink:"Sinking fund (THB/sqm, one-off)",
    ccBuyer:"Buyer pays on transfer day", ccTransfer:"Transfer fee (buyer's share)", ccSinkL:"Sinking fund (new projects only)", ccFeeL:"Common fee, 12 months ahead (new projects)", ccRun:"Running cost: common fee",
    ccBuyerTot:"Buyer total", ccSeller:"Seller pays (for comparison)", ccSbt:"Specific business tax 3.3%", ccStamp:"Stamp duty 0.5%", ccTransferS:"Transfer fee (seller's share)",
    ccWht:"Withholding tax", ccWhtV:"Set by the Land Office", ccOfPrice:"of price",
    ccNote:"Estimate using 2026 rates: the transfer fee is 2% of the appraised value, and business tax or stamp duty is charged on the higher of sale price and appraised value. Thai buyers get a 0.01% transfer fee (units up to ฿7M, until 30 June 2027) but foreigners do not. Who pays what can be agreed in the contract.",
    mapNote:"Schematic, not to scale. Distances and drive times from Jomtien are approximate.",
    mapRoad:"Motorway / main road", mapRail:"High-speed rail (not yet started)", mapYou:"Jomtien"
  }
};
const w = k => (W[lang] && W[lang][k]) || W.en[k];

const WIDGETS = {
  /* yes/no scorecard ------------------------------------------------ */
  score(el, b){
    const ans = b.items.map(() => null);
    const max = b.items.reduce((s, i) => s + (i.w || 1), 0);
    el.innerHTML = `<div class="w-hd"><h3>${rich(b.wt)}</h3><p>${rich(b.wp)}</p></div><div class="w-bd split">
      <div class="res">${b.items.map((it, i) => `<div class="q"><span>${rich(it.t)}</span>${it.d ? `<small class="w-note">${rich(it.d)}</small>` : ""}<div class="opts"><button type="button" class="opt" data-i="${i}" data-v="1" aria-pressed="false">${w("yes")}</button><button type="button" class="opt" data-i="${i}" data-v="0" aria-pressed="false">${w("no")}</button></div></div>`).join("")}</div>
      <div class="res" style="position:sticky;top:76px"><div class="res-card best"><p>${w("score")}</p><div class="big" data-o="pts">0</div><div class="meter" style="margin:10px 0"><i data-o="bar" style="width:0"></i></div><p data-o="msg">${rich(b.tiers[b.tiers.length - 1].t)}</p></div><div data-o="tips" class="res"></div></div></div>`;
    const upd = () => {
      const got = b.items.reduce((s, it, i) => s + (ans[i] ? (it.w || 1) : 0), 0);
      const pct = Math.round(got / max * 100);
      el.querySelector('[data-o="pts"]').textContent = pct + "/100";
      el.querySelector('[data-o="bar"]').style.width = pct + "%";
      el.querySelector('[data-o="msg"]').innerHTML = rich(b.tiers.find(t => pct >= t.min).t);
      const miss = b.items.filter((it, i) => ans[i] === 0 && it.fix);
      el.querySelector('[data-o="tips"]').innerHTML = miss.map(it => `<div class="res-card"><h4>${rich(it.t)}</h4><p>${rich(it.fix)}</p></div>`).join("");
    };
    el.addEventListener("click", e => {
      const o = e.target.closest(".opt"); if (!o) return;
      ans[+o.dataset.i] = +o.dataset.v;
      o.parentElement.querySelectorAll(".opt").forEach(x => x.setAttribute("aria-pressed", x === o));
      upd();
    });
  },

  /* smart home package builder -------------------------------------- */
  builder(el, b){
    const prof = b.profiles;
    el.innerHTML = `<div class="w-hd"><h3>${rich(b.wt)}</h3><p>${rich(b.wp)}</p></div><div class="w-bd split sum-first">
      <div class="res"><div class="opts">${prof.map((p, i) => `<button type="button" class="opt" data-p="${i}" aria-pressed="${i === 0}">${esc(L(p.t))}</button>`).join("")}</div>
      <div class="picks">${b.items.map((it, i) => `<label class="pick"><input type="checkbox" data-i="${i}"><span><b>${esc(L(it.t))}</b><small>${esc(L(it.d))}</small></span><span class="num">${baht(it.lo)}–${nf.format(it.hi)}</span></label>`).join("")}</div><p class="w-note">${rich(b.note)}</p></div>
      <div class="res sum-box"><div class="res-card best"><p>${w("range")}</p><div class="big" data-o="tot">฿0</div><p data-o="n"></p></div></div></div>`;
    const boxes = [...el.querySelectorAll(".pick input")];
    const upd = () => {
      let lo = 0, hi = 0, n = 0;
      boxes.forEach(x => { if (x.checked){ const it = b.items[+x.dataset.i]; lo += it.lo; hi += it.hi; n++; } });
      el.querySelector('[data-o="tot"]').textContent = n ? `${baht(lo)}–${nf.format(hi)}` : "฿0";
      el.querySelector('[data-o="n"]').textContent = w("items").replace("{n}", n);
    };
    const setProf = i => { boxes.forEach(x => { x.checked = prof[i].pick.includes(b.items[+x.dataset.i].id); }); el.querySelectorAll("[data-p]").forEach(x => x.setAttribute("aria-pressed", +x.dataset.p === i)); upd(); };
    el.addEventListener("click", e => { const o = e.target.closest("[data-p]"); if (o) setProf(+o.dataset.p); });
    el.addEventListener("change", upd);
    setProf(0);
  },

  /* visa finder ------------------------------------------------------ */
  visa(el, b){
    const Q = [
      ["age", w("vfAge"), [w("vfAge1"), w("vfAge2")]],
      ["work", w("vfWork"), [w("vfW1"), w("vfW2"), w("vfW3"), w("vfW4")]],
      ["inc", w("vfInc"), [w("vfI1"), w("vfI2"), w("vfI3")]],
      ["inv", w("vfInv"), [w("vfV1"), w("vfV2"), w("vfV3")]],
      ["stay", w("vfStay"), [w("vfS1"), w("vfS2"), w("vfS3")]]
    ];
    const a = {};
    el.innerHTML = `<div class="w-hd"><h3>${rich(b.wt)}</h3><p>${rich(b.wp)}</p></div><div class="w-bd split">
      <div class="res">${Q.map(([k, t, os]) => `<div class="q"><span>${t}</span><div class="opts">${os.map((o, i) => `<button type="button" class="opt" data-k="${k}" data-v="${i}" aria-pressed="false">${o}</button>`).join("")}</div></div>`).join("")}</div>
      <div class="res"><p style="margin:0;font-weight:600">${w("vfRes")}</p><div data-o="out" class="res"><p class="w-note">${w("vfNone")}</p></div><p class="w-note">${w("vfNote")}</p></div></div>`;
    const V = b.visas; // id -> {t, d}
    const calc = () => {
      if (Object.keys(a).length < Q.length) return null;
      const out = [];
      const add = (id, score) => out.push({ id, score });
      const age50 = a.age === 1, inc = a.inc, inv = a.inv, stay = a.stay;
      if (stay === 0) add("exempt", 3);
      if (a.work === 0 && inc === 2) add("ltrWft", 5);
      if (a.work === 0 && inc === 1) add("ltrWft", 2);
      if (a.work === 2 && age50 && inc === 2) add("ltrPen", 5);
      if (a.work === 2 && age50 && inc === 1 && inv === 2) add("ltrPen", 4);
      if (inv === 2) add("ltrWgc", 4);
      if (age50 && (inv >= 1 || inc >= 1)) add("retire", stay === 2 ? 4 : 3);
      if ((a.work === 0 || a.work === 1) && stay >= 1) add("dtv", stay === 1 ? 5 : 3);
      if (a.work === 3) add("work", 5);
      if (inv >= 1 && stay >= 1) add("privilege", 2);
      if (!out.length) add("dtv", 1);
      const seen = new Set();
      return out.sort((x, y) => y.score - x.score).filter(x => !seen.has(x.id) && seen.add(x.id));
    };
    el.addEventListener("click", e => {
      const o = e.target.closest(".opt"); if (!o) return;
      a[o.dataset.k] = +o.dataset.v;
      o.parentElement.querySelectorAll(".opt").forEach(x => x.setAttribute("aria-pressed", x === o));
      const r = calc();
      if (!r) return;
      el.querySelector('[data-o="out"]').innerHTML = r.slice(0, 4).map((x, i) => `<div class="res-card${i === 0 ? " best" : ""}"><h4>${esc(L(V[x.id].t))}<span class="fit">${i === 0 ? w("vfBest") : w("vfAlso")}</span></h4><p>${rich(V[x.id].d)}</p></div>`).join("");
    });
  },

  /* purchase cost calculator ---------------------------------------- */
  cost(el, b){
    el.innerHTML = `<div class="w-hd"><h3>${rich(b.wt)}</h3><p>${rich(b.wp)}</p></div><div class="w-bd split">
      <div class="res">
        <div class="fields">
          <label class="field"><span>${w("ccPrice")}</span><input type="number" inputmode="numeric" min="0" step="10000" data-f="price" value="3500000"></label>
          <label class="field"><span>${w("ccSize")}</span><input type="number" inputmode="decimal" min="0" step="0.5" data-f="sqm" value="35"></label>
          <label class="field"><span>${w("ccAppr")}</span><input type="number" inputmode="numeric" min="0" step="10000" data-f="appr" placeholder="${w("ccApprPh")}"></label>
          <label class="field"><span>${w("ccFee")}</span><input type="number" inputmode="decimal" min="0" step="1" data-f="fee" value="45"></label>
        </div>
        <div class="q"><span>${w("ccNew")}</span><div class="opts" data-g="nw"><button type="button" class="opt" data-v="0" aria-pressed="true">${w("ccN1")}</button><button type="button" class="opt" data-v="1" aria-pressed="false">${w("ccN2")}</button></div></div>
        <div class="q"><span>${w("ccSplit")}</span><div class="opts" data-g="split"><button type="button" class="opt" data-v="1" aria-pressed="false">${w("ccS1")}</button><button type="button" class="opt" data-v="0.5" aria-pressed="true">${w("ccS2")}</button><button type="button" class="opt" data-v="0" aria-pressed="false">${w("ccS3")}</button></div></div>
        <div class="q" data-show="resale"><span>${w("ccHeld")}</span><div class="opts" data-g="held"><button type="button" class="opt" data-v="0" aria-pressed="false">${w("ccH1")}</button><button type="button" class="opt" data-v="1" aria-pressed="true">${w("ccH2")}</button></div></div>
        <label class="field" data-show="new" hidden><span>${w("ccSink")}</span><input type="number" inputmode="numeric" min="0" step="50" data-f="sink" value="600"></label>
      </div>
      <div class="res"><div class="sum" data-o="sum"></div><p class="w-note">${w("ccNote")}</p></div></div>`;
    const g = { nw:0, split:0.5, held:1 };
    const f = k => parseFloat(el.querySelector(`[data-f="${k}"]`).value) || 0;
    const row = (l, v, cls) => `<div${cls ? ` class="${cls}"` : ""}><span>${l}</span><span class="num">${v}</span></div>`;
    const upd = () => {
      const price = f("price"), sqm = f("sqm"), appr = f("appr") || price, base = Math.max(price, appr);
      const fee = appr * 0.02, bShare = fee * g.split, sShare = fee - bShare;
      const sink = g.nw ? f("sink") * sqm : 0, cf = f("fee") * sqm * 12;
      // new projects usually collect the sinking fund and 12 months of common fees at transfer
      const bt = bShare + (g.nw ? sink + cf : 0);
      let h = row(w("ccBuyer"), "", "h") + row(w("ccTransfer"), baht(bShare)) + (g.nw ? row(w("ccSinkL"), baht(sink)) + row(w("ccFeeL"), baht(cf)) : "") +
              row(w("ccBuyerTot"), `${baht(bt)} · ${price ? (bt / price * 100).toFixed(1) : 0}% ${w("ccOfPrice")}`, "tot") +
              row(w("ccRun"), baht(cf) + w("perYear"));
      if (!g.nw){
        const tax = g.held ? base * 0.005 : base * 0.033;
        h += row(w("ccSeller"), "", "h") + row(w("ccTransferS"), baht(sShare)) + row(g.held ? w("ccStamp") : w("ccSbt"), baht(tax)) + row(w("ccWht"), w("ccWhtV"));
      }
      el.querySelector('[data-o="sum"]').innerHTML = h;
      el.querySelector('[data-show="resale"]').hidden = !!g.nw;
      el.querySelector('[data-show="new"]').hidden = !g.nw;
    };
    el.addEventListener("click", e => {
      const o = e.target.closest(".opt"); if (!o) return;
      const grp = o.parentElement.dataset.g; g[grp] = parseFloat(o.dataset.v);
      o.parentElement.querySelectorAll(".opt").forEach(x => x.setAttribute("aria-pressed", x === o));
      upd();
    });
    el.addEventListener("input", upd);
    upd();
  },

  /* EEC schematic map ----------------------------------------------- */
  map(el, b){
    const P = (lon, lat) => [Math.round((lon - 100.35) * 520), Math.round((13.86 - lat) * 520)];
    const sea = [[100.35,13.52],[100.6,13.52],[100.97,13.47],[100.97,13.36],[100.91,13.28],[100.92,13.17],[100.88,13.08],[100.87,12.93],[100.87,12.88],[100.9,12.79],[100.9,12.66],[101.0,12.68],[101.15,12.66],[101.28,12.66],[101.45,12.68],[101.45,12.52],[100.35,12.52]].map(p => P(...p).join(",")).join(" ");
    const line = pts => pts.map(p => P(...p).join(",")).join(" ");
    const places = [["Bangkok",100.52,13.75,"l"],["Suvarnabhumi ✈",100.75,13.69,"r"],["Chachoengsao",101.07,13.69,"r"],["Chonburi",101.0,13.37,"r"],["Si Racha",100.93,13.17,"r"],["Pattaya",100.89,12.94,"r"],["Rayong",101.28,12.69,"t"]];
    const vb = P(101.45, 12.52);
    el.innerHTML = `<div class="w-hd"><h3>${rich(b.wt)}</h3><p>${rich(b.wp)}</p></div><div class="w-bd split map">
      <svg viewBox="0 0 ${vb[0]} ${vb[1]}" role="img" aria-label="EEC map">
        <polygon class="coast" points="${sea}"/>
        <polyline class="road" points="${line([[100.52,13.75],[100.75,13.69],[100.98,13.42],[100.98,13.2],[100.93,12.96],[100.95,12.8],[101.0,12.7]])}"/>
        <polyline class="rail" points="${line([[100.6,13.91],[100.52,13.75],[100.75,13.69],[101.07,13.69],[101.0,13.37],[100.93,13.17],[100.9,12.94],[101.0,12.69]])}"/>
        ${places.map(([n, lo, la, pos]) => { const [x, y] = P(lo, la); const tx = pos === "l" ? x - 11 : x + 12, an = pos === "l" ? "end" : "start", ty = pos === "t" ? y - 14 : y + 6;
          return `<circle class="pt" cx="${x}" cy="${y}" r="6"/><text class="lbl" x="${pos === "t" ? x : tx}" y="${ty}" text-anchor="${pos === "t" ? "middle" : an}">${n}</text>`; }).join("")}
        ${(() => { const [x, y] = P(100.875, 12.88); return `<circle class="pt home" cx="${x}" cy="${y}" r="9"/><text class="lbl" x="${x - 14}" y="${y + 6}" text-anchor="end" style="font-weight:700">★ ${w("mapYou")}</text>`; })()}
        ${b.points.map((p, i) => { const [x, y] = P(p.lon, p.lat); return `<g class="proj" data-i="${i}"><circle cx="${x}" cy="${y}" r="15" fill="${p.c}" stroke="var(--surface)" stroke-width="3"/><text x="${x}" y="${y + 5.5}" text-anchor="middle" style="font:700 15px var(--mono);fill:#fff">${i + 1}</text></g>`; }).join("")}
      </svg>
      <div class="res">
        <div class="map-legend"><span><i></i>${w("mapRoad")}</span><span><i class="r"></i>${w("mapRail")}</span></div>
        ${b.points.map((p, i) => `<div class="res-card" data-i="${i}" tabindex="0"><h4><span class="chip" style="background:${p.c};color:#fff">${i + 1}</span>${esc(L(p.t))}<span class="chip st-${p.st}">${u("st")[p.st]}</span></h4><p>${rich(p.d)}</p></div>`).join("")}
        <p class="w-note">${w("mapNote")}</p>
      </div></div>`;
    const hl = i => { el.querySelectorAll("[data-i]").forEach(x => x.classList.toggle(x.tagName === "g" ? "on" : "best", +x.dataset.i === i)); };
    el.addEventListener("mouseover", e => { const o = e.target.closest("[data-i]"); if (o) hl(+o.dataset.i); });
    el.addEventListener("click", e => { const o = e.target.closest("[data-i]"); if (o) hl(+o.dataset.i); });
  }
};

render();
})();
