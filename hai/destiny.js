/* Destiny Match (Hybrid AI Agent Network, shared by every agent site) — birth chart + feng shui → matching homes and timing.
   Runs fully in the browser: birth data is never sent anywhere or stored.
   Thai astrology (sidereal, Lahiri ayanamsa) + Western (tropical) + Chinese (BaZi day master, year animal, Kua / Eight Mansions).
   Uses the page globals at call time: lang, esc, card, SHOWN, byCode, HOME_STYLE, MG_EL, CONTACT, nm, SITE, FACING.
   "{brand}" in the text tables is replaced with SITE.short on first use. */
(function () {
"use strict";
/* ---------------- astronomy (Meeus, low precision; sun ~0.01°, moon ~0.1°) ---------------- */
/* site globals are top-level let/const (not window props): resolve by name at call time */
/* Host adapter. A site that is not on hai/engine.js (e.g. R2 by Clare, one condo project) sets
   window.HAI_HOST = { lang, esc, SHOWN, byCode, card, zn, ZONES, HOME_STYLE, MG_EL, FACING, CONTACT, SITE, links, mount }
   before calling ASND.render(). Any key it leaves out falls back to the hai engine globals of the same name.
   lang may be a value or a function; links = { home, listing(code), destiny(code) }; mount() returns the element to render into.
   See hai/README.md "Destiny Match on any site". */
const HOST = () => window.HAI_HOST || null;
const G0 = (n, d) => { try { const v = Function("return typeof " + n + " !== 'undefined' ? " + n + " : undefined")(); return v === undefined ? d : v; } catch (e) { return d; } };
const G = (n, d) => { const h = HOST(); if (h && h[n] !== undefined) { const v = h[n]; return n === "lang" && typeof v === "function" ? v() : v; } return G0(n, d); };
const LINK = { home: "#/", listing: c => "#/l/" + c, destiny: c => "#/destiny/" + encodeURIComponent(c) };
const link = (k, c) => { const h = HOST(), L2 = (h && h.links) || {}; const f = L2[k] !== undefined ? L2[k] : LINK[k]; return typeof f === "function" ? f(c) : f; };
const D2R = Math.PI / 180, R2D = 180 / Math.PI, norm = x => ((x % 360) + 360) % 360, md = (a, n) => ((a % n) + n) % n;
function jdUT(y, m, d, h) { if (m <= 2) { y--; m += 12; } const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4); return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 + h / 24; }
function sunLon(J) { const T = (J - 2451545) / 36525, L0 = 280.46646 + 36000.76983 * T, M = 357.52911 + 35999.05029 * T;
  const C = (1.914602 - 0.004817 * T) * Math.sin(M * D2R) + (0.019993 - 0.000101 * T) * Math.sin(2 * M * D2R) + 0.000289 * Math.sin(3 * M * D2R);
  return norm(L0 + C - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * T) * D2R)); }
const MT = [[6288774,0,0,1,0],[1274027,2,0,-1,0],[658314,2,0,0,0],[213618,0,0,2,0],[-185116,0,1,0,0],[-114332,0,0,0,2],[58793,2,0,-2,0],[57066,2,-1,-1,0],[53322,2,0,1,0],[45758,2,-1,0,0],[-40923,0,1,-1,0],[-34720,1,0,0,0],[-30383,0,1,1,0],[15327,2,0,0,-2],[-12528,0,0,1,2],[10980,0,0,1,-2],[10675,4,0,-1,0],[10034,0,0,3,0],[8548,4,0,-2,0],[-7888,2,1,-1,0],[-6766,2,1,0,0],[-5163,1,0,-1,0],[4987,1,1,0,0],[4036,2,-1,1,0],[3994,2,0,2,0],[3861,4,0,0,0],[3665,2,0,-3,0],[-2689,0,1,-2,0],[-2602,2,0,-1,2],[2390,2,-1,-2,0],[-2348,1,0,1,0],[2236,2,-2,0,0],[-2120,0,1,2,0],[-2069,0,2,0,0]];
function moonLon(J) { const T = (J - 2451545) / 36525, Lp = 218.3164477 + 481267.88123421 * T, D = 297.8501921 + 445267.1114034 * T, M = 357.5291092 + 35999.0502909 * T, Mp = 134.9633964 + 477198.8675055 * T, F = 93.2720950 + 483202.0175233 * T, E = 1 - 0.002516 * T;
  let S = 0; for (const [c, a, b, cc, dd] of MT) { let v = c * Math.sin((a * D + b * M + cc * Mp + dd * F) * D2R); if (Math.abs(b) === 1) v *= E; if (Math.abs(b) === 2) v *= E * E; S += v; }
  return norm(Lp + S / 1e6); }
function ascendant(J, lat, lon) { const T = (J - 2451545) / 36525, ramc = norm(280.46061837 + 360.98564736629 * (J - 2451545) + 0.000387933 * T * T + lon) * D2R, eps = (23.4392911 - 0.0130042 * T) * D2R;
  return norm(Math.atan2(Math.cos(ramc), -(Math.sin(eps) * Math.tan(lat * D2R) + Math.cos(eps) * Math.sin(ramc))) * R2D); }
const ayan = J => 23.853 + (J - 2451545) / 365.25 * 0.0139694;   // Lahiri
/* Jupiter and Saturn: JPL approximate Keplerian elements (valid 1800-2050, J2000 ecliptic),
   [a, e, I, L, varpi, Omega] and their rates per Julian century. Good to well under 1 degree,
   plenty for which sign a slow planet is in. */
const PL = {
  earth:  [[1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0], [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0]],
  jupiter:[[5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909], [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106]],
  saturn: [[9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448], [-0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794]]
};
function helio(k, T) { const [e0, r] = PL[k], [a, e, I, L, w, O] = e0.map((v, i) => v + r[i] * T);
  const M = norm(L - w) * D2R, om = (w - O) * D2R, Om = O * D2R, inc = I * D2R; let E = M + e * Math.sin(M);
  for (let i = 0; i < 8; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const x = a * (Math.cos(E) - e), y = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const co = Math.cos(om), so = Math.sin(om), cO = Math.cos(Om), sO = Math.sin(Om), ci = Math.cos(inc), si = Math.sin(inc);
  return [(co * cO - so * sO * ci) * x + (-so * cO - co * sO * ci) * y, (co * sO + so * cO * ci) * x + (-so * sO + co * cO * ci) * y]; }
// sidereal (Lahiri) geocentric longitude: J2000-ecliptic longitude minus the J2000 ayanamsa
function planetSid(k, J) { const T = (J - 2451545) / 36525, p = helio(k, T), g = helio("earth", T);
  return norm(Math.atan2(p[1] - g[1], p[0] - g[0]) * R2D - 23.853); }
const jdn = (y, m, d) => { const a = Math.floor((14 - m) / 12), Y = y + 4800 - a, M = m + 12 * a - 3; return d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045; };

/* ---------------- Chinese calendar helpers ---------------- */
const STEM_EL = ["wood","wood","fire","fire","earth","earth","metal","metal","water","water"];
const BR_EL = ["water","earth","wood","wood","earth","fire","fire","earth","metal","metal","earth","water"];
const MOTHER = { wood: "water", fire: "wood", earth: "fire", metal: "earth", water: "metal" };
const CONTROLLER = { wood: "metal", fire: "water", earth: "wood", metal: "fire", water: "earth" };   // the element that controls each one
const CLASH = (a, b) => md(a - b, 12) === 6;
const HARM6 = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]], HARMS = [[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];
const pairIn = (L, a, b) => L.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const TRIAD = (a, b) => a !== b && md(a - b, 4) === 0;
function branchRel(a, b) { if (CLASH(a, b)) return -2; if (pairIn(HARMS, a, b)) return -1; if (pairIn(HARM6, a, b) || TRIAD(a, b)) return 2; if (a === b) return 0.5; return 0; }
const cnYear = (y, m, J) => (m < 2 || (m === 2 && sunLon(J) < 315 && sunLon(J) > 270)) ? y - 1 : y;   // year starts at Lichun (sun 315°)
const monthBranch = J => md(Math.floor(norm(sunLon(J) - 315) / 30) + 2, 12);   // 寅 month starts at Lichun
const dayPillar = (y, m, d) => { const k = jdn(y, m, d) - 2451545; return [md(k + 4, 10), md(k + 6, 12)]; };   // 2000-01-01 = 戊午
const KUA_DIRS = { 1:["SE","E","S","N"], 2:["NE","W","NW","SW"], 3:["S","N","SE","E"], 4:["N","S","E","SE"], 6:["W","NE","SW","NW"], 7:["NW","SW","NE","W"], 8:["SW","NW","W","NE"], 9:["E","SE","N","S"] };
function kua(y, g) { let s = String(y % 100).padStart(2, "0").split("").reduce((a, b) => a + +b, 0); while (s > 9) s = String(s).split("").reduce((a, b) => a + +b, 0);
  let k = g === "m" ? (y < 2000 ? 10 - s : 9 - s) : (y < 2000 ? 5 + s : 6 + s); while (k > 9) k -= 9; if (k <= 0) k += 9;
  if (k === 5) k = g === "m" ? 2 : 8; return k; }
const DIR_EL = { N: "water", S: "fire", E: "wood", SE: "wood", W: "metal", NW: "metal", NE: "earth", SW: "earth" };
const THAI_EL = ["fire","earth","air","water"];   // by sign index % 4
const TH_TO_CN = { fire: "fire", earth: "earth", air: "metal", water: "water" };

const CITIES = [
  ["bkk","Bangkok",13.75,100.5,7],["pty","Pattaya",12.93,100.88,7],["cnx","Chiang Mai",18.79,98.98,7],["hkt","Phuket",7.88,98.39,7],
  ["pek","Beijing",39.9,116.4,8],["sha","Shanghai",31.23,121.47,8],["hkg","Hong Kong",22.32,114.17,8],["sin","Singapore",1.35,103.82,8],["tpe","Taipei",25.03,121.57,8],
  ["sel","Seoul",37.57,126.98,9],["tyo","Tokyo",35.68,139.69,9],["mow","Moscow",55.75,37.62,3],["dxb","Dubai",25.2,55.27,4],["bom","Mumbai",19.08,72.88,5.5],
  ["lon","London",51.51,-0.13,0],["ber","Berlin",52.52,13.4,1],["par","Paris",48.86,2.35,1],["nyc","New York",40.71,-74.01,-5],["lax","Los Angeles",34.05,-118.24,-8],["syd","Sydney",-33.87,151.21,10]
];

/* ---------------- text (6 languages) ---------------- */
const TX = {
th: {
  nav: "ดวง & ฮวงจุ้ย", eyebrow: "Destiny Match · ดวงชะตา × ฮวงจุ้ย", title: "หาบ้านที่เข้ากับดวงของคุณ",
  sub: "ใส่วันเดือนปีและเวลาเกิด ระบบจะผูกดวงแบบไทย สากล และจีน (ปาจื้อ · ทิศมงคลประจำตัว) แล้วจับคู่กับบ้านแต่ละหลังของ {brand} พร้อมแนะนำช่วงเวลาที่เหมาะจะซื้อหรือเข้าอยู่",
  privacy: "ข้อมูลวันเกิดคำนวณในเครื่องของคุณเท่านั้น ไม่ถูกส่งหรือบันทึกที่ใด",
  fName: "ชื่อ (ไม่บังคับ)", fDate: "วันเกิด", fTime: "เวลาเกิด", fTimeUnk: "ไม่ทราบเวลาเกิด", fGender: "เพศ (ใช้คำนวณทิศมงคล)", gM: "ชาย", gF: "หญิง", gN: "ไม่ระบุ",
  fPlace: "สถานที่เกิด", fPurpose: "ต้องการ", pBuy: "ซื้อ", pRent: "เช่า", fBuyDate: "วันที่วางแผนจะซื้อ/โอน", fRentFrom: "เช่าตั้งแต่", fRentTo: "ถึง", fType: "ประเภททรัพย์", tAny: "ทุกประเภท",
  tVilla: "พูลวิลล่า", tHouse: "บ้าน", tCondo: "คอนโด", tLand: "ที่ดิน", go: "วิเคราะห์ดวงและหาบ้าน", needDate: "กรุณาใส่วันเกิด",
  secChart: "ดวงของคุณ", sunTh: "ราศีเกิด (ไทย · นิรายนะ)", sunWest: "ราศีสากล (สายนะ)", moon: "ดวงจันทร์", lagna: "ลัคนา", cnYear: "ปีนักษัตร (จีน)", dayMaster: "ธาตุประจำวันเกิด (ปาจื้อ)",
  kua: "เลขกัว & ทิศมงคล", kuaNeedG: "เลือกเพศเพื่อคำนวณทิศมงคล", unknownTime: "ไม่ทราบเวลา: ไม่คำนวณลัคนา และดวงจันทร์อาจคลาดได้", cusp: "ใกล้รอยต่อราศี",
  thai: "ไทย", west: "สากล", group: { E: "กลุ่มตะวันออก", W: "กลุ่มตะวันตก" }, dirRole: ["โชคลาภ", "สุขภาพ", "ความสัมพันธ์", "ความมั่นคง"],
  secProfile: "บ้านแบบไหนเข้ากับดวงคุณ", pElem: "ธาตุหลัก", pStrong: "สิ่งที่เสริมดวง", pColor: "สีที่เข้า", pAccent: "สีเสริม", pDir: "ทิศที่เหมาะ", pAvoid: "ควรเลี่ยง", pTypes: "ตามประเภททรัพย์",
  bzLine: "ธาตุวันเกิด {dm} — ธาตุที่ช่วยหนุน: {sup}", kuaLine: "ประตูหลักหรือหน้าบ้านที่หันไปทาง {dirs} จะเข้ากับคุณ",
  secTiming: "จังหวะเวลาที่เหมาะ", tmBuy: "ช่วงเวลาซื้อ/โอน (12 เดือนนับจากวันที่เลือก)", tmRent: "ช่วงเวลาเช่า", tmBest: "ดีมาก", tmGood: "ดี", tmOk: "กลาง ๆ", tmBad: "ระวัง",
  bestDays: "วันมงคลแนะนำสำหรับ{act}", actBuy: "โอน/ทำสัญญา", actRent: "ย้ายเข้า", yearClash: "ปี {y} เป็นปีชง (ปะทะนักษัตร) กับคุณ — ถ้าต้องตัดสินใจในปีนี้ เลือกเดือนและวันที่ดีด้านล่าง",
  yearGood: "ปี {y} เป็นปีที่นักษัตรเข้ากับคุณ เหมาะกับการเริ่มต้นสิ่งใหม่", tmNote: "คำนวณจากความสัมพันธ์ของนักษัตรเดือน/วันกับปีเกิดและวันเกิด และราศีที่ดวงอาทิตย์โคจรเทียบกับราศีเกิด",
  secMatch: "บ้านที่เข้ากับดวงคุณ", matchNote: "คะแนนรวมจากธาตุของบ้าน (สระ ทะเล สวน สี ความเป็นส่วนตัว) ธาตุเสริมจากปาจื้อ และทิศหน้าบ้านเทียบกับทิศมงคลของคุณ",
  focus: "บ้านหลังนี้กับดวงของคุณ", fit: "เข้ากัน", none: "ยังไม่มีทรัพย์ที่ตรงเงื่อนไข ลองเปลี่ยนประเภทหรือเป้าหมาย",
  rPoolP: "มีสระว่ายน้ำส่วนตัว (ธาตุน้ำ)", rPoolS: "มีสระส่วนกลาง (ธาตุน้ำ)", rSea: "วิวทะเล/ใกล้ทะเล (ธาตุน้ำ)", rLake: "ทำเลริมทะเลสาบ/อ่างเก็บน้ำ (ธาตุน้ำ)", rWG: "มีสวนน้ำ/บ่อน้ำในบ้าน",
  rPriv: "บ้านเดี่ยว ความเป็นส่วนตัวสูง", rOpenW: "เปิดโล่งกระจกมาก — ควรมีม่าน/ฉากช่วย", rOpen: "เปิดโล่ง รับแสงและลมดี", rView: "วิวกว้าง อยู่สูง", rGarden: "สวนเขียว ต้นไม้ (ธาตุไม้)",
  rPal: "โทนสีบ้านเป็นธาตุ{el} ซึ่งเข้ากับคุณ", rPalX: "โทนสีบ้านเป็นธาตุ{el} ปรับด้วยของตกแต่งได้", rLand: "ที่ดินกว้าง มั่นคง (ธาตุดิน)", rMount: "วิวภูเขา หลังพิง (ธาตุดิน)", rModern: "โทนขาว/เทาโมเดิร์น (ธาตุทอง)",
  rFaceG: "หน้าบ้านหัน{d} — ตรงกับทิศมงคลของคุณ", rFaceB: "หน้าบ้านหัน{d} — ไม่ใช่ทิศมงคล ปรับด้วยประตูรอง/ของตกแต่งได้", rFaceU: "ทิศหน้าบ้านจริงรอยืนยันกับ {brand}",
  rBz: "เสริมธาตุ{el} ที่ช่วยหนุนธาตุวันเกิดของคุณ",
  disc: "ผลนี้เป็นแนวทางเบื้องต้นตามหลักโหราศาสตร์และฮวงจุ้ยทั่วไป เพื่อช่วยคัดบ้านและคุยกับซินแส/โหร ทิศ ประตู เลขที่ และผังจริงต้องตรวจหน้างาน ปรับภายในด้วยสี แสง และเฟอร์นิเจอร์ได้ภายหลังผ่าน WIDEROOMS",
  send: "ส่งผลนี้ให้ {brand} ทาง LINE", copy: "คัดลอกสรุป", copied: "คัดลอกแล้ว — วางในแชต LINE ได้เลย", back: "← กลับหน้าหลัก", detailCta: "เช็กดวงของคุณกับบ้านหลังนี้", detailCtaSub: "ใส่วันเกิด ดูว่าบ้านหลังนี้เข้ากับดวงคุณแค่ไหน และควรซื้อ/เข้าอยู่ช่วงไหน",
  homeCta: "หาบ้านตามดวงและฮวงจุ้ย →",
  signs: ["เมษ","พฤษภ","เมถุน","กรกฎ","สิงห์","กันย์","ตุลย์","พิจิก","ธนู","มังกร","กุมภ์","มีน"],
  animals: ["ชวด (หนู)","ฉลู (วัว)","ขาล (เสือ)","เถาะ (กระต่าย)","มะโรง (มังกร)","มะเส็ง (งู)","มะเมีย (ม้า)","มะแม (แพะ)","วอก (ลิง)","ระกา (ไก่)","จอ (สุนัข)","กุน (หมู)"],
  el: { wood: "ไม้", fire: "ไฟ", earth: "ดิน", metal: "ทอง", water: "น้ำ", air: "ลม" }, yin: "หยิน", yang: "หยาง",
  dir: { N: "ทิศเหนือ", S: "ทิศใต้", E: "ทิศตะวันออก", W: "ทิศตะวันตก", NE: "ทิศตะวันออกเฉียงเหนือ", NW: "ทิศตะวันตกเฉียงเหนือ", SE: "ทิศตะวันออกเฉียงใต้", SW: "ทิศตะวันตกเฉียงใต้" },
  prof: {
    water: { core: "น้ำ — ลึก หนักแน่น เป็นส่วนตัว", strong: ["สระว่ายน้ำส่วนตัว ทะเลสาบ แม่น้ำ น้ำพุ", "ความเป็นส่วนตัวสูง ไม่เปิดโล่งเกินไป", "บรรยากาศสงบ มีมิติ ไม่สว่างจ้าตลอดเวลา"], color: "ดำ น้ำเงินเข้ม เบอร์กันดี เทาเข้ม", accent: "ทอง/เหลืองอ่อน ส้มอ่อนเล็กน้อย", dir: "ทิศเหนือ หรือมีน้ำอยู่ด้านหน้า/ข้างบ้าน", avoid: ["บ้านกระจกรอบด้านที่ไม่มีม่าน/ฉาก", "บ้านที่ไม่มีองค์ประกอบน้ำเลย", "ประตูหลักรับแดดแรงทิศใต้/ตะวันตกโดยไม่มีตัวกัน", "ทำเลพลุกพล่าน เสียงดัง"], types: { house: "บ้าน/วิลล่า: เน้นสระส่วนตัว + ความเป็นส่วนตัวสูง", condo: "คอนโด: เลือกชั้นและทิศที่เห็นทะเลหรือน้ำ เลี่ยงชั้นล่างสุดที่เปิดโล่ง", land: "ที่ดิน: ใกล้แหล่งน้ำ ดินไม่แห้งแล้ง ทางเข้าไม่ชันหรือแคบ" } },
    fire: { core: "ไฟ — สว่าง อบอุ่น เปิดรับผู้คน", strong: ["แสงธรรมชาติเต็มที่ ห้องรับแขกกว้าง", "พื้นที่สังสรรค์ ระเบียง ดาดฟ้า", "วิวกว้าง เพดานสูง"], color: "แดง ส้ม ชมพู ม่วง", accent: "เขียว/ไม้ (ไม้เสริมไฟ)", dir: "ทิศใต้ หรือตะวันออก", avoid: ["บ้านมืดอับ ชื้น", "สีดำ/น้ำเงินเข้มมากเกินไป", "น้ำพุหรือสระตรงหน้าประตูหลัก (น้ำข่มไฟ)"], types: { house: "บ้าน/วิลล่า: เปิดโล่ง รับแสง มีพื้นที่สังสรรค์", condo: "คอนโด: ชั้นสูง ห้องมุม รับแสงเช้า", land: "ที่ดิน: โล่ง รับแดดดี ทางเข้ากว้าง" } },
    earth: { core: "ดิน — มั่นคง อบอุ่น ติดดิน", strong: ["บ้านบนที่ดินกว้าง มีสวน", "ผังบ้านสี่เหลี่ยม สมดุล", "วิวภูเขา มีหลังพิง"], color: "เบจ น้ำตาล ดินเผา เหลืองมัสตาร์ด", accent: "แดง/ส้มเล็กน้อย (ไฟเสริมดิน)", dir: "ทิศตะวันออกเฉียงเหนือ หรือตะวันตกเฉียงใต้", avoid: ["คอนโดชั้นสูงมากที่ลอยจากพื้น", "ทำเลลุ่มน้ำท่วม", "ผังบ้านแหว่งมุม"], types: { house: "บ้าน/วิลล่า: ที่ดินกว้าง สวนสวย ผังสมดุล", condo: "คอนโด: ชั้นกลางถึงต่ำ ใกล้สวน", land: "ที่ดิน: แปลงสี่เหลี่ยม ดินแน่น มีภูเขาด้านหลัง" } },
    air: { core: "ลม — โปร่ง คล่องตัว เปิดกว้าง", strong: ["วิวกว้าง ชั้นสูง ระเบียง ดาดฟ้า", "ลมผ่าน ผังเปิด", "ใกล้เมือง เดินทางสะดวก"], color: "ขาว เทาอ่อน ฟ้าอ่อน เงิน", accent: "เหลือง/ทองเล็กน้อย", dir: "ทิศตะวันตก หรือตะวันตกเฉียงเหนือ", avoid: ["ห้องทึบ อับลม", "ทำเลห่างไกล เดินทางลำบาก", "ของรกทางเข้า"], types: { house: "บ้าน/วิลล่า: ผังเปิด มีดาดฟ้า ลมผ่าน", condo: "คอนโด: ชั้นสูง วิวกว้าง ห้องมุม", land: "ที่ดิน: ที่สูง โล่ง ใกล้ถนนหลัก" } }
  }
},
en: {
  nav: "Destiny & feng shui", eyebrow: "Destiny Match · Birth chart × Feng shui", title: "Find the home that fits your birth chart",
  sub: "Enter your birth date and time. We draw your Thai, Western and Chinese (BaZi · Kua) chart, match it with every {brand} home and suggest the best time to buy or move in.",
  privacy: "Your birth data is calculated on your device only. It is never sent or stored.",
  fName: "Name (optional)", fDate: "Birth date", fTime: "Birth time", fTimeUnk: "I don't know my birth time", fGender: "Gender (for your lucky directions)", gM: "Male", gF: "Female", gN: "Prefer not to say",
  fPlace: "Place of birth", fPurpose: "I want to", pBuy: "Buy", pRent: "Rent", fBuyDate: "Planned purchase / transfer date", fRentFrom: "Rent from", fRentTo: "to", fType: "Property type", tAny: "Any type",
  tVilla: "Pool villa", tHouse: "House", tCondo: "Condo", tLand: "Land", go: "Read my chart & find homes", needDate: "Please enter your birth date",
  secChart: "Your chart", sunTh: "Sun sign (Thai · sidereal)", sunWest: "Sun sign (Western · tropical)", moon: "Moon", lagna: "Ascendant (Lagna)", cnYear: "Chinese zodiac year", dayMaster: "Day Master (BaZi)",
  kua: "Kua number & lucky directions", kuaNeedG: "Choose a gender to calculate lucky directions", unknownTime: "Birth time unknown: no ascendant, and the Moon may be off", cusp: "near a sign boundary",
  thai: "Thai", west: "Western", group: { E: "East group", W: "West group" }, dirRole: ["Wealth", "Health", "Relationships", "Stability"],
  secProfile: "Homes that suit your chart", pElem: "Main element", pStrong: "What supports you", pColor: "Your colours", pAccent: "Accent colours", pDir: "Best directions", pAvoid: "Avoid", pTypes: "By property type",
  bzLine: "Day Master {dm} — supporting elements: {sup}", kuaLine: "A main door or front facing {dirs} suits you",
  secTiming: "Best timing", tmBuy: "Buying / transfer (12 months from your date)", tmRent: "Your rental period", tmBest: "Excellent", tmGood: "Good", tmOk: "Neutral", tmBad: "Caution",
  bestDays: "Suggested auspicious days to {act}", actBuy: "sign or transfer", actRent: "move in", yearClash: "{y} clashes with your zodiac year — if you decide this year, pick the good months and days below",
  yearGood: "{y} is in harmony with your zodiac year — a good time to start something new", tmNote: "Based on how each month's and day's zodiac branch relates to your birth year and day, and on the Sun's transit against your Thai sun sign.",
  secMatch: "Homes that match your chart", matchNote: "Combined score from each home's elements (pool, sea, garden, colours, privacy), the elements that support your Day Master, and the front direction against your lucky directions.",
  focus: "This home and your chart", fit: "match", none: "No listing fits these filters yet. Try another type or goal.",
  rPoolP: "Private pool (Water)", rPoolS: "Shared pool (Water)", rSea: "Sea view / near the sea (Water)", rLake: "Lakeside / reservoir zone (Water)", rWG: "Water garden or pond",
  rPriv: "Detached home with high privacy", rOpenW: "Very open, lots of glass — add curtains or screens", rOpen: "Open, bright and breezy", rView: "Wide views, high up", rGarden: "Green garden and trees (Wood)",
  rPal: "Its colours are {el} element, which suits you", rPalX: "Its colours are {el} element — easy to balance with decor", rLand: "Wide, solid land (Earth)", rMount: "Mountain view, backed by hills (Earth)", rModern: "White and grey modern tones (Metal)",
  rFaceG: "Faces {d} — one of your lucky directions", rFaceB: "Faces {d} — not a lucky direction; balance with a side door or decor", rFaceU: "Exact front direction to be confirmed with {brand}",
  rBz: "Brings {el}, which supports your Day Master",
  disc: "A first guide based on general astrology and feng shui, to help shortlist homes and talk with a feng shui master or astrologer. Directions, doors, house numbers and layout must be checked on site; interiors can be tuned later with colour, light and furniture through WIDEROOMS.",
  send: "Send this to {brand} on LINE", copy: "Copy summary", copied: "Copied — paste it into the LINE chat", back: "← Back to home", detailCta: "Check this home against your birth chart", detailCtaSub: "Enter your birth date to see how well this home fits you, and when to buy or move in.",
  homeCta: "Find a home by birth chart & feng shui →",
  signs: ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"],
  animals: ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"],
  el: { wood: "Wood", fire: "Fire", earth: "Earth", metal: "Metal", water: "Water", air: "Air" }, yin: "Yin", yang: "Yang",
  dir: { N: "north", S: "south", E: "east", W: "west", NE: "north-east", NW: "north-west", SE: "south-east", SW: "south-west" },
  prof: {
    water: { core: "Water — deep, steady and private", strong: ["A private pool, lake, river or fountain", "High privacy, not too exposed", "A calm, layered mood rather than bright all day"], color: "Black, deep navy, burgundy, dark grey", accent: "Gold or soft yellow, a touch of warm orange", dir: "North, or water in front of or beside the house", avoid: ["All-glass houses with no curtains or screens", "No water element at all", "A main door in strong south/west sun with no shade", "Busy, noisy streets"], types: { house: "House/villa: private pool and high privacy", condo: "Condo: a floor and side that sees the sea or water; avoid exposed ground floors", land: "Land: near water, healthy soil, an access road that is neither steep nor narrow" } },
    fire: { core: "Fire — bright, warm and sociable", strong: ["Plenty of daylight, a generous living room", "Space to entertain: terraces, rooftops", "Wide views and high ceilings"], color: "Red, orange, pink, purple", accent: "Green and wood (Wood feeds Fire)", dir: "South or east", avoid: ["Dark, damp homes", "Too much black or deep navy", "A fountain or pool right at the main door (Water checks Fire)"], types: { house: "House/villa: open, bright, made for gatherings", condo: "Condo: high floor, corner unit, morning light", land: "Land: open and sunny with a wide access" } },
    earth: { core: "Earth — grounded, warm and steady", strong: ["A home on generous land with a garden", "A square, balanced floor plan", "Mountain views, solid backing"], color: "Beige, brown, terracotta, mustard", accent: "A little red or orange (Fire feeds Earth)", dir: "North-east or south-west", avoid: ["Very high-rise living", "Flood-prone low ground", "Floor plans with missing corners"], types: { house: "House/villa: large plot, lovely garden, balanced plan", condo: "Condo: low to middle floors near greenery", land: "Land: a square plot, firm soil, hills behind" } },
    air: { core: "Air — light, open and on the move", strong: ["Wide views, high floors, balconies and rooftops", "Cross breezes and open plans", "Close to town and easy to get around"], color: "White, light grey, pale blue, silver", accent: "A touch of yellow or gold", dir: "West or north-west", avoid: ["Closed, stuffy rooms", "Remote locations that are hard to reach", "Clutter at the entrance"], types: { house: "House/villa: open plan, rooftop, through-breezes", condo: "Condo: high floor, wide view, corner unit", land: "Land: high, open ground near a main road" } }
  }
}
};
/* other languages: merged over English (full translations added below) */
const LBL = {
  zh: { nav: "命盘与风水", eyebrow: "Destiny Match · 命盘 × 风水", title: "找到与您命盘相合的房子", sub: "输入出生日期和时间，系统将排出泰式、西洋与中式（八字 · 命卦）命盘，并与 {brand} 每套房源配对，同时建议买房或入住的吉时。", privacy: "出生资料仅在您的设备上计算，不会被发送或保存。", fName: "姓名（可选）", fDate: "出生日期", fTime: "出生时间", fTimeUnk: "不知道出生时间", fGender: "性别（用于计算吉方）", gM: "男", gF: "女", gN: "不透露", fPlace: "出生地", fPurpose: "目的", pBuy: "购买", pRent: "租住", fBuyDate: "计划购买/过户日期", fRentFrom: "租期自", fRentTo: "至", fType: "房产类型", tAny: "全部", tVilla: "泳池别墅", tHouse: "独栋", tCondo: "公寓", tLand: "土地", go: "分析命盘并找房", needDate: "请输入出生日期", secChart: "您的命盘", sunTh: "太阳星座（泰式 · 恒星黄道）", sunWest: "太阳星座（西洋 · 回归黄道）", moon: "月亮", lagna: "上升", cnYear: "生肖年", dayMaster: "日主（八字）", kua: "命卦与吉方", kuaNeedG: "请选择性别以计算吉方", secProfile: "适合您命盘的房子", secTiming: "吉时", tmBest: "大吉", tmGood: "吉", tmOk: "平", tmBad: "慎", secMatch: "与您命盘相合的房源", focus: "此房与您的命盘", fit: "契合", send: "通过 LINE 发送给 {brand}", copy: "复制摘要", copied: "已复制，可粘贴到 LINE", back: "← 返回首页", detailCta: "用您的命盘测这套房", detailCtaSub: "输入出生日期，看看这套房与您是否相合，以及何时购买或入住最好。", homeCta: "按命盘与风水找房 →", animals: ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"], el: { wood: "木", fire: "火", earth: "土", metal: "金", water: "水", air: "风" }, dir: { N: "北", S: "南", E: "东", W: "西", NE: "东北", NW: "西北", SE: "东南", SW: "西南" }, signs: ["白羊","金牛","双子","巨蟹","狮子","处女","天秤","天蝎","射手","摩羯","水瓶","双鱼"] },
  ko: { nav: "사주 & 풍수", eyebrow: "Destiny Match · 출생차트 × 풍수", title: "나의 사주와 맞는 집 찾기", sub: "생년월일과 출생 시간을 입력하면 태국식·서양식·중국식(사주 · 본명괘) 차트를 만들어 {brand}의 모든 집과 매칭하고, 구매나 입주에 좋은 시기를 알려드립니다.", privacy: "출생 정보는 사용자 기기에서만 계산되며 전송되거나 저장되지 않습니다.", fName: "이름(선택)", fDate: "생년월일", fTime: "출생 시간", fTimeUnk: "출생 시간을 모름", fGender: "성별(길한 방향 계산용)", gM: "남성", gF: "여성", gN: "밝히지 않음", fPlace: "출생지", fPurpose: "목적", pBuy: "구매", pRent: "임대", fBuyDate: "구매/등기 예정일", fRentFrom: "임대 시작", fRentTo: "종료", fType: "매물 유형", tAny: "전체", tVilla: "풀빌라", tHouse: "주택", tCondo: "콘도", tLand: "토지", go: "차트 분석 & 집 찾기", needDate: "생년월일을 입력하세요", secChart: "나의 차트", sunTh: "태양 별자리(태국 · 항성황도)", sunWest: "태양 별자리(서양 · 회귀황도)", moon: "달", lagna: "상승궁", cnYear: "띠", dayMaster: "일간(사주)", kua: "본명괘 & 길한 방향", kuaNeedG: "길한 방향을 보려면 성별을 선택하세요", secProfile: "나에게 맞는 집", secTiming: "좋은 시기", tmBest: "대길", tmGood: "길", tmOk: "보통", tmBad: "주의", secMatch: "나의 차트와 맞는 매물", focus: "이 집과 나의 차트", fit: "매칭", send: "LINE으로 {brand}에 보내기", copy: "요약 복사", copied: "복사됨 — LINE 채팅에 붙여넣으세요", back: "← 홈으로", detailCta: "이 집과 나의 사주 궁합 보기", detailCtaSub: "생년월일을 입력하면 이 집이 얼마나 맞는지, 언제 사거나 입주하면 좋은지 알려드립니다.", homeCta: "사주와 풍수로 집 찾기 →", animals: ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"], el: { wood: "목", fire: "화", earth: "토", metal: "금", water: "수", air: "풍" }, dir: { N: "북", S: "남", E: "동", W: "서", NE: "북동", NW: "북서", SE: "남동", SW: "남서" }, signs: ["양자리","황소자리","쌍둥이자리","게자리","사자자리","처녀자리","천칭자리","전갈자리","사수자리","염소자리","물병자리","물고기자리"] },
  ja: { nav: "運勢と風水", eyebrow: "Destiny Match · 出生図 × 風水", title: "あなたの運勢に合う家を探す", sub: "生年月日と出生時刻を入力すると、タイ式・西洋式・中国式（四柱推命 · 本命卦）のチャートを作成し、{brand} の各物件とマッチングして、購入や入居に良い時期をご提案します。", privacy: "生年月日はお使いの端末内だけで計算され、送信・保存されません。", fName: "お名前（任意）", fDate: "生年月日", fTime: "出生時刻", fTimeUnk: "出生時刻がわからない", fGender: "性別（吉方位の計算用）", gM: "男性", gF: "女性", gN: "回答しない", fPlace: "出生地", fPurpose: "目的", pBuy: "購入", pRent: "賃貸", fBuyDate: "購入・名義変更の予定日", fRentFrom: "賃貸開始", fRentTo: "終了", fType: "物件タイプ", tAny: "すべて", tVilla: "プールヴィラ", tHouse: "一戸建て", tCondo: "コンド", tLand: "土地", go: "運勢を読んで家を探す", needDate: "生年月日を入力してください", secChart: "あなたのチャート", sunTh: "太陽星座（タイ式 · サイデリアル）", sunWest: "太陽星座（西洋 · トロピカル）", moon: "月", lagna: "アセンダント", cnYear: "干支", dayMaster: "日主（四柱推命）", kua: "本命卦と吉方位", kuaNeedG: "吉方位を出すには性別を選んでください", secProfile: "あなたに合う家", secTiming: "良いタイミング", tmBest: "大吉", tmGood: "吉", tmOk: "普通", tmBad: "注意", secMatch: "あなたに合う物件", focus: "この家とあなたの運勢", fit: "相性", send: "LINE で {brand} に送る", copy: "要約をコピー", copied: "コピーしました — LINE に貼り付けてください", back: "← ホームへ", detailCta: "この家とあなたの運勢をチェック", detailCtaSub: "生年月日を入れると、この家との相性と、購入・入居に良い時期がわかります。", homeCta: "運勢と風水で家を探す →", animals: ["子（ねずみ）","丑（うし）","寅（とら）","卯（うさぎ）","辰（たつ）","巳（へび）","午（うま）","未（ひつじ）","申（さる）","酉（とり）","戌（いぬ）","亥（いのしし）"], el: { wood: "木", fire: "火", earth: "土", metal: "金", water: "水", air: "風" }, dir: { N: "北", S: "南", E: "東", W: "西", NE: "北東", NW: "北西", SE: "南東", SW: "南西" }, signs: ["牡羊座","牡牛座","双子座","蟹座","獅子座","乙女座","天秤座","蠍座","射手座","山羊座","水瓶座","魚座"] },
  ru: { nav: "Судьба и фэншуй", eyebrow: "Destiny Match · Натальная карта × Фэншуй", title: "Дом, который подходит вашей карте рождения", sub: "Введите дату и время рождения: мы построим тайскую, западную и китайскую (Ба Цзы · число Гуа) карту, сопоставим её с каждым домом {brand} и подскажем лучшее время для покупки или переезда.", privacy: "Данные рождения рассчитываются только на вашем устройстве и никуда не отправляются.", fName: "Имя (необязательно)", fDate: "Дата рождения", fTime: "Время рождения", fTimeUnk: "Не знаю время рождения", fGender: "Пол (для благоприятных направлений)", gM: "Мужской", gF: "Женский", gN: "Не указывать", fPlace: "Место рождения", fPurpose: "Цель", pBuy: "Купить", pRent: "Арендовать", fBuyDate: "Планируемая дата покупки", fRentFrom: "Аренда с", fRentTo: "по", fType: "Тип объекта", tAny: "Любой", tVilla: "Вилла с бассейном", tHouse: "Дом", tCondo: "Кондо", tLand: "Земля", go: "Рассчитать и подобрать дом", needDate: "Укажите дату рождения", secChart: "Ваша карта", sunTh: "Знак Солнца (тайский · сидерический)", sunWest: "Знак Солнца (западный · тропический)", moon: "Луна", lagna: "Асцендент", cnYear: "Китайский знак года", dayMaster: "Хозяин дня (Ба Цзы)", kua: "Число Гуа и направления", kuaNeedG: "Выберите пол, чтобы рассчитать направления", secProfile: "Какой дом вам подходит", secTiming: "Лучшее время", tmBest: "Отлично", tmGood: "Хорошо", tmOk: "Нейтрально", tmBad: "Осторожно", secMatch: "Дома, подходящие вашей карте", focus: "Этот дом и ваша карта", fit: "совпадение", send: "Отправить в {brand} через LINE", copy: "Скопировать итог", copied: "Скопировано — вставьте в чат LINE", back: "← На главную", detailCta: "Проверить дом по вашей карте рождения", detailCtaSub: "Введите дату рождения: узнаете, насколько дом вам подходит и когда лучше покупать или въезжать.", homeCta: "Подобрать дом по карте и фэншуй →", animals: ["Крыса","Бык","Тигр","Кролик","Дракон","Змея","Лошадь","Коза","Обезьяна","Петух","Собака","Свинья"], el: { wood: "Дерево", fire: "Огонь", earth: "Земля", metal: "Металл", water: "Вода", air: "Воздух" }, dir: { N: "север", S: "юг", E: "восток", W: "запад", NE: "северо-восток", NW: "северо-запад", SE: "юго-восток", SW: "юго-запад" }, signs: ["Овен","Телец","Близнецы","Рак","Лев","Дева","Весы","Скорпион","Стрелец","Козерог","Водолей","Рыбы"] }
};

/* budget + recommended areas */
Object.assign(TX.th, { fBudget: "งบประมาณ", bAny: "ไม่จำกัดงบ", bUpS: "ไม่เกิน {n} ล้านบาท", bOverS: "มากกว่า {n} ล้านบาท", bUpR: "ไม่เกิน {n} บาท/เดือน",
  secLoc: "ทำเลที่แนะนำสำหรับคุณ", locNote: "จัดอันดับจากลักษณะของทำเล (ทะเล ทะเลสาบ ภูเขา ความสงบ ความคึกคัก วิว) เทียบกับธาตุของคุณ ทิศของทำเลเมื่อมองจากตัวเมืองพัทยาเทียบกับทิศมงคล และทรัพย์ที่ตรงเงื่อนไขในทำเลนั้น",
  zSea: "ใกล้ทะเล — เสริมธาตุน้ำ ลมทะเลเย็นสบาย", zLake: "ใกล้ทะเลสาบ / อ่างเก็บน้ำ — น้ำนิ่ง สงบ", zHill: "เนินเขา / วิวภูเขา — พลังดินที่มั่นคง", zQuiet: "สงบ เป็นส่วนตัว ห่างความวุ่นวาย",
  zCity: "คึกคัก ใกล้ร้านอาหาร ห้าง และผู้คน — พลังไฟ", zView: "วิวเปิดกว้าง ลมโปร่ง", zGreen: "เขียวขจี ต้นไม้เยอะ — ธาตุไม้",
  zDirG: "อยู่{d}ของตัวเมืองพัทยา — ทิศมงคลของคุณ", zDirB: "อยู่{d}ของตัวเมือง — ไม่ใช่ทิศมงคล แต่ธาตุของทำเลยังเข้ากัน", zCount: "ทรัพย์ที่ตรงเงื่อนไข {n} รายการ", zNone: "ตอนนี้ยังไม่มีทรัพย์ตรงเงื่อนไขในทำเลนี้", zBest: "เข้ากันที่สุด:", zFit: "เข้ากัน" });
Object.assign(TX.en, { fBudget: "Budget", bAny: "Any budget", bUpS: "Up to ฿{n}M", bOverS: "Over ฿{n}M", bUpR: "Up to ฿{n}/month",
  secLoc: "Recommended areas for you", locNote: "Ranked by the character of each area (sea, lake, hills, quiet, lively, views) against your element, the area's direction from central Pattaya against your lucky directions, and the matching homes available there.",
  zSea: "Near the sea — boosts Water, cool sea breeze", zLake: "Near a lake or reservoir — calm, still water", zHill: "Hills and mountain views — steady Earth energy", zQuiet: "Quiet and private, away from the bustle",
  zCity: "Lively — close to restaurants, malls and people (Fire)", zView: "Open views and breezes", zGreen: "Green and leafy — Wood element",
  zDirG: "Lies {d} of central Pattaya — one of your lucky directions", zDirB: "Lies {d} of the centre — not a lucky direction, but the area's elements still suit you", zCount: "Matching homes: {n}", zNone: "No matching homes here right now", zBest: "Best fits:", zFit: "fit" });
Object.assign(LBL.zh, { locNote: "根据区域特质（海、湖、山、安静、热闹、视野）与您的元素、区域相对芭提雅市中心的方位与您的吉方，以及该区符合条件的房源综合排序。", zSea: "靠海 — 补水，海风清凉", zLake: "靠近湖泊/水库 — 静水安宁", zHill: "山丘与山景 — 稳定的土能量", zQuiet: "安静私密，远离喧嚣", zCity: "热闹 — 靠近餐厅、商场与人群（火）", zView: "视野开阔，通风良好", zGreen: "绿意盎然 — 木元素", zDirG: "位于市中心{d}方 — 您的吉方", zDirB: "位于市中心{d}方 — 非吉方，但区域元素仍相合", zNone: "该区目前暂无符合条件的房源", fBudget: "预算", bAny: "不限预算", bUpS: "≤ ฿{n}M", bOverS: "> ฿{n}M", bUpR: "≤ ฿{n}/月", secLoc: "为您推荐的区域", zCount: "{n} 套符合条件", zBest: "最相合：", zFit: "相合" });
Object.assign(LBL.ko, { locNote: "지역의 특성(바다, 호수, 언덕, 조용함, 활기, 전망)과 당신의 원소, 파타야 시내 기준 지역 방위와 길방, 그리고 해당 지역의 조건에 맞는 매물을 종합해 순위를 매겼습니다.", zSea: "바다 인근 — 수(水) 기운 보강, 시원한 바닷바람", zLake: "호수·저수지 인근 — 고요한 물", zHill: "언덕과 산 전망 — 안정적인 토(土) 기운", zQuiet: "조용하고 프라이빗함", zCity: "활기참 — 식당·쇼핑몰과 가까움(화)", zView: "탁 트인 전망과 바람", zGreen: "녹음이 풍부함 — 목(木) 원소", zDirG: "시내 기준 {d}쪽 — 당신의 길방", zDirB: "시내 기준 {d}쪽 — 길방은 아니지만 지역 원소가 잘 맞음", zNone: "현재 이 지역에 조건에 맞는 매물이 없습니다", fBudget: "예산", bAny: "예산 무관", bUpS: "≤ ฿{n}M", bOverS: "> ฿{n}M", bUpR: "≤ ฿{n}/월", secLoc: "추천 지역", zCount: "조건에 맞는 매물 {n}건", zBest: "가장 잘 맞는 곳:", zFit: "적합" });
Object.assign(LBL.ja, { locNote: "エリアの特徴（海・湖・丘・静けさ・にぎわい・眺望）とあなたのエレメント、パタヤ中心部から見たエリアの方位と吉方位、そのエリアの条件に合う物件を総合して順位付けしています。", zSea: "海の近く — 水の気を補い、涼しい海風", zLake: "湖・貯水池の近く — 穏やかな水", zHill: "丘と山の眺め — 安定した土の気", zQuiet: "静かでプライベート", zCity: "にぎやか — レストランやモールに近い（火）", zView: "開けた眺望と風通し", zGreen: "緑豊か — 木のエレメント", zDirG: "中心部から{d} — あなたの吉方位", zDirB: "中心部から{d} — 吉方位ではないがエリアの気は合う", zNone: "現在このエリアに条件に合う物件はありません", fBudget: "予算", bAny: "予算指定なし", bUpS: "≤ ฿{n}M", bOverS: "> ฿{n}M", bUpR: "≤ ฿{n}/月", secLoc: "おすすめのエリア", zCount: "条件に合う物件 {n}件", zBest: "相性の良い物件：", zFit: "相性" });
Object.assign(LBL.ru, { locNote: "Рейтинг учитывает характер района (море, озеро, холмы, тишина, оживлённость, виды) и вашу стихию, направление района от центра Паттайи относительно ваших благоприятных сторон, а также подходящие объекты в районе.", zSea: "У моря — усиливает Воду, морской бриз", zLake: "У озера или водохранилища — спокойная вода", zHill: "Холмы и виды на горы — устойчивая энергия Земли", zQuiet: "Тихо и уединённо", zCity: "Оживлённо — рядом рестораны, ТЦ и люди (Огонь)", zView: "Открытые виды и ветер", zGreen: "Много зелени — стихия Дерева", zDirG: "Район на направлении «{d}» от центра — ваше благоприятное", zDirB: "Район на направлении «{d}» от центра — не благоприятное, но стихии района подходят", zNone: "Сейчас здесь нет подходящих объектов", fBudget: "Бюджет", bAny: "Любой бюджет", bUpS: "до ฿{n} млн", bOverS: "более ฿{n} млн", bUpR: "до ฿{n}/мес", secLoc: "Рекомендуемые районы", zCount: "Подходящих объектов: {n}", zBest: "Лучше всего:", zFit: "совпадение" });
/* full translations for zh / ko / ja / ru (Thor 3 Nov: every part of the page in all 6 languages) */
Object.assign(LBL.zh, {
  unknownTime: "出生时间未知：不计算上升星座，月亮位置可能有偏差", cusp: "接近星座交界", thai: "泰式", west: "西洋", group: { E: "东四命", W: "西四命" }, dirRole: ["财运", "健康", "人际", "稳定"],
  pElem: "主元素", pStrong: "对您有利", pColor: "您的颜色", pAccent: "点缀色", pDir: "最佳方位", pAvoid: "宜避免", pTypes: "按房产类型",
  bzLine: "日主{dm} — 扶助元素：{sup}", kuaLine: "大门或房屋正面朝向{dirs}对您有利",
  tmBuy: "购买/过户时段（自所选日期起 12 个月）", tmRent: "您的租期", bestDays: "建议{act}的吉日", actBuy: "签约或过户", actRent: "入住",
  yearClash: "{y}年与您的生肖相冲 — 若需在今年决定，请选择下方的吉月吉日", yearGood: "{y}年与您的生肖相合 — 适合开始新的事情",
  tmNote: "依据每月、每日地支与您出生年、日的关系，以及太阳运行相对您泰式太阳星座的位置计算。",
  matchNote: "综合每套房的元素（泳池、海、花园、色彩、私密度）、扶助您日主的元素，以及房屋朝向与您吉方的关系。", none: "暂无符合条件的房源，请尝试其他类型或目的。",
  rPoolP: "私人泳池（水）", rPoolS: "公共泳池（水）", rSea: "海景/近海（水）", rLake: "湖畔/水库区域（水）", rWG: "水景花园或池塘",
  rPriv: "独栋，私密性高", rOpenW: "非常通透、玻璃多 — 宜加窗帘或屏风", rOpen: "开阔明亮、通风好", rView: "视野开阔、位置高", rGarden: "绿色花园与树木（木）",
  rPal: "房子的色调属{el}，与您相合", rPalX: "房子的色调属{el} — 可用软装调和", rLand: "土地宽阔稳固（土）", rMount: "山景，背有靠山（土）", rModern: "白灰现代色调（金）",
  rFaceG: "朝向{d} — 您的吉方之一", rFaceB: "朝向{d} — 非吉方，可用侧门或摆设调和", rFaceU: "实际朝向待与 {brand} 确认", rBz: "带来{el}，扶助您的日主",
  disc: "本结果是根据一般命理与风水原则的初步参考，帮助您筛选房源并与风水师或命理师沟通。朝向、门位、门牌号与实际格局需现场确认；室内可之后通过 WIDEROOMS 以色彩、灯光与家具调整。",
  yin: "阴", yang: "阳",
  prof: {
    water: { core: "水 — 深沉、稳重、注重私密", strong: ["私人泳池、湖泊、河流或喷泉", "私密性高，不过于暴露", "氛围宁静有层次，而非整天明亮刺眼"], color: "黑、深海军蓝、酒红、深灰", accent: "金色或浅黄，少许暖橙", dir: "北方，或房前/房侧有水", avoid: ["四面玻璃且无窗帘或屏风的房子", "完全没有水元素", "大门正对强烈的南/西晒且无遮挡", "热闹嘈杂的街道"], types: { house: "独栋/别墅：私人泳池与高私密性", condo: "公寓：选择能看到海或水景的楼层与朝向，避免暴露的底层", land: "土地：靠近水源、土壤良好，出入道路不陡不窄" } },
    fire: { core: "火 — 明亮、温暖、好交际", strong: ["充足的自然光，宽敞的客厅", "可招待亲友的空间：露台、屋顶", "开阔视野与挑高天花"], color: "红、橙、粉、紫", accent: "绿色与木质（木生火）", dir: "南方或东方", avoid: ["阴暗潮湿的房子", "过多的黑色或深海军蓝", "正对大门的喷泉或泳池（水克火）"], types: { house: "独栋/别墅：通透明亮，适合聚会", condo: "公寓：高楼层、转角单位、晨光充足", land: "土地：开阔向阳，出入口宽" } },
    earth: { core: "土 — 踏实、温暖、稳定", strong: ["宽敞土地上带花园的房子", "方正均衡的户型", "山景，背后有靠"], color: "米色、棕色、陶土色、芥末黄", accent: "少许红或橙（火生土）", dir: "东北或西南", avoid: ["过高的高层住宅", "易淹水的低洼地", "缺角的户型"], types: { house: "独栋/别墅：大地块、漂亮花园、户型均衡", condo: "公寓：中低楼层、靠近绿地", land: "土地：方正地块、土质坚实、背后有山" } },
    air: { core: "风 — 轻盈、开阔、灵动", strong: ["开阔视野、高楼层、阳台与屋顶", "穿堂风与开放式格局", "靠近市区、交通便利"], color: "白、浅灰、浅蓝、银", accent: "少许黄或金", dir: "西方或西北", avoid: ["封闭闷热的房间", "偏远难到达的地点", "入口杂乱"], types: { house: "独栋/别墅：开放格局、屋顶露台、通风", condo: "公寓：高楼层、视野开阔、转角单位", land: "土地：地势高、开阔、靠近主路" } }
  }
});
Object.assign(LBL.ko, {
  unknownTime: "출생 시간 모름: 상승궁은 계산하지 않으며 달 위치가 다소 어긋날 수 있습니다", cusp: "별자리 경계 부근", thai: "태국식", west: "서양식", group: { E: "동사명", W: "서사명" }, dirRole: ["재물", "건강", "인간관계", "안정"],
  pElem: "주 원소", pStrong: "나에게 힘이 되는 것", pColor: "나의 색", pAccent: "포인트 색", pDir: "좋은 방향", pAvoid: "피할 것", pTypes: "매물 유형별",
  bzLine: "일간 {dm} — 도와주는 원소: {sup}", kuaLine: "정문이나 집 앞면이 {dirs} 쪽을 향하면 잘 맞습니다",
  tmBuy: "구매/등기 시기 (선택한 날짜부터 12개월)", tmRent: "임대 기간", bestDays: "{act}에 좋은 날", actBuy: "계약 또는 등기", actRent: "입주",
  yearClash: "{y}년은 당신의 띠와 충(沖)이 되는 해입니다 — 올해 결정해야 한다면 아래의 좋은 달과 날을 고르세요", yearGood: "{y}년은 당신의 띠와 잘 맞는 해 — 새로운 시작에 좋습니다",
  tmNote: "매달·매일의 지지와 출생 연·일의 관계, 그리고 태국식 태양 별자리에 대한 태양의 운행을 바탕으로 계산합니다.",
  matchNote: "각 집의 원소(수영장, 바다, 정원, 색, 프라이버시), 일간을 돕는 원소, 집 방향과 길한 방향의 관계를 종합한 점수입니다.", none: "조건에 맞는 매물이 아직 없습니다. 다른 유형이나 목적을 선택해 보세요.",
  rPoolP: "개인 수영장 (수)", rPoolS: "공용 수영장 (수)", rSea: "바다 전망 / 바다 인근 (수)", rLake: "호숫가 / 저수지 지역 (수)", rWG: "수경 정원 또는 연못",
  rPriv: "단독 주택, 높은 프라이버시", rOpenW: "매우 개방적, 유리가 많음 — 커튼이나 가림막 권장", rOpen: "탁 트이고 밝으며 통풍이 좋음", rView: "넓은 전망, 높은 위치", rGarden: "푸른 정원과 나무 (목)",
  rPal: "집의 색감이 {el} 원소로 당신과 잘 맞음", rPalX: "집의 색감이 {el} 원소 — 인테리어로 쉽게 조화 가능", rLand: "넓고 단단한 땅 (토)", rMount: "산 전망, 뒤에 언덕 (토)", rModern: "화이트·그레이 모던 톤 (금)",
  rFaceG: "{d} 향 — 당신의 길한 방향", rFaceB: "{d} 향 — 길한 방향은 아님, 옆문이나 장식으로 보완 가능", rFaceU: "실제 집 방향은 {brand} 확인 예정", rBz: "{el} 원소를 더해 일간을 도와줌",
  disc: "이 결과는 일반적인 명리와 풍수 원칙에 따른 1차 참고용으로, 매물을 추리고 풍수사나 역술가와 상담할 때 도움이 됩니다. 방향, 문, 번지, 실제 구조는 현장에서 확인해야 하며, 실내는 나중에 WIDEROOMS를 통해 색, 조명, 가구로 조정할 수 있습니다.",
  yin: "음", yang: "양",
  prof: {
    water: { core: "수 — 깊고 차분하며 프라이빗함", strong: ["개인 수영장, 호수, 강 또는 분수", "높은 프라이버시, 지나치게 노출되지 않음", "하루 종일 밝기보다는 차분하고 깊이 있는 분위기"], color: "블랙, 딥 네이비, 버건디, 다크 그레이", accent: "골드 또는 연한 노랑, 약간의 따뜻한 오렌지", dir: "북쪽, 또는 집 앞이나 옆에 물", avoid: ["커튼이나 가림막 없는 전면 유리 주택", "물 요소가 전혀 없는 집", "그늘 없이 남/서향 강한 햇볕을 받는 정문", "붐비고 시끄러운 거리"], types: { house: "주택/빌라: 개인 수영장과 높은 프라이버시", condo: "콘도: 바다나 물이 보이는 층과 방향, 노출된 저층은 피하기", land: "토지: 물 가까이, 좋은 토양, 가파르거나 좁지 않은 진입로" } },
    fire: { core: "화 — 밝고 따뜻하며 사교적", strong: ["풍부한 자연광, 넓은 거실", "손님을 맞는 공간: 테라스, 루프탑", "넓은 전망과 높은 천장"], color: "레드, 오렌지, 핑크, 퍼플", accent: "그린과 우드 (목생화)", dir: "남쪽 또는 동쪽", avoid: ["어둡고 습한 집", "지나친 블랙이나 딥 네이비", "정문 바로 앞의 분수나 수영장 (수극화)"], types: { house: "주택/빌라: 개방적이고 밝으며 모임에 좋은 집", condo: "콘도: 고층, 코너 세대, 아침 햇살", land: "토지: 탁 트이고 햇볕이 좋으며 진입로가 넓은 곳" } },
    earth: { core: "토 — 안정적이고 따뜻하며 든든함", strong: ["넉넉한 땅 위의 정원 있는 집", "반듯하고 균형 잡힌 평면", "산 전망, 든든한 뒷배경"], color: "베이지, 브라운, 테라코타, 머스터드", accent: "약간의 레드나 오렌지 (화생토)", dir: "북동쪽 또는 남서쪽", avoid: ["아주 높은 고층 생활", "침수되기 쉬운 저지대", "모서리가 빠진 평면"], types: { house: "주택/빌라: 넓은 대지, 아름다운 정원, 균형 잡힌 평면", condo: "콘도: 녹지 가까운 저층~중층", land: "토지: 반듯한 필지, 단단한 땅, 뒤에 언덕" } },
    air: { core: "풍 — 가볍고 열려 있으며 활동적", strong: ["넓은 전망, 고층, 발코니와 루프탑", "맞통풍과 개방형 구조", "시내와 가깝고 이동이 편리"], color: "화이트, 라이트 그레이, 페일 블루, 실버", accent: "약간의 노랑이나 골드", dir: "서쪽 또는 북서쪽", avoid: ["막히고 답답한 방", "가기 어려운 외딴 위치", "어수선한 현관"], types: { house: "주택/빌라: 개방형 구조, 루프탑, 맞통풍", condo: "콘도: 고층, 넓은 전망, 코너 세대", land: "토지: 높고 탁 트인 땅, 큰길 가까이" } }
  }
});
Object.assign(LBL.ja, {
  unknownTime: "出生時刻が不明：アセンダントは計算せず、月の位置にずれが出ることがあります", cusp: "星座の境目付近", thai: "タイ式", west: "西洋式", group: { E: "東四命", W: "西四命" }, dirRole: ["金運", "健康", "人間関係", "安定"],
  pElem: "メインのエレメント", pStrong: "あなたを支えるもの", pColor: "あなたの色", pAccent: "アクセントカラー", pDir: "良い方位", pAvoid: "避けたいもの", pTypes: "物件タイプ別",
  bzLine: "日主 {dm} — 助けとなるエレメント：{sup}", kuaLine: "玄関や家の正面が{dirs}向きだと相性が良い",
  tmBuy: "購入・名義変更の時期（選んだ日から12か月）", tmRent: "賃貸期間", bestDays: "{act}におすすめの吉日", actBuy: "契約・名義変更", actRent: "入居",
  yearClash: "{y}年はあなたの干支と冲になる年です — 今年決める場合は、下の良い月と日を選んでください", yearGood: "{y}年はあなたの干支と相性の良い年 — 新しいことを始めるのに最適です",
  tmNote: "各月・各日の十二支と生まれ年・生まれ日の関係、そしてタイ式太陽星座に対する太陽の運行から計算しています。",
  matchNote: "各物件のエレメント（プール、海、庭、色、プライバシー）、日主を助けるエレメント、家の向きと吉方位の関係を合わせたスコアです。", none: "条件に合う物件がまだありません。別のタイプや目的をお試しください。",
  rPoolP: "プライベートプール（水）", rPoolS: "共用プール（水）", rSea: "海が見える／海の近く（水）", rLake: "湖畔・貯水池エリア（水）", rWG: "水のある庭や池",
  rPriv: "一戸建てでプライバシーが高い", rOpenW: "開放的でガラスが多い — カーテンやスクリーンを", rOpen: "開放的で明るく風通しが良い", rView: "眺望が広く、高い位置", rGarden: "緑の庭と木々（木）",
  rPal: "家の色調は{el}のエレメントで、あなたと相性が良い", rPalX: "家の色調は{el}のエレメント — インテリアで調整しやすい", rLand: "広くしっかりした土地（土）", rMount: "山の眺め、背後に丘（土）", rModern: "白とグレーのモダンな色調（金）",
  rFaceG: "{d}向き — あなたの吉方位", rFaceB: "{d}向き — 吉方位ではないが、勝手口やインテリアで調整可能", rFaceU: "実際の向きは {brand} に確認中", rBz: "{el}のエレメントが日主を助ける",
  disc: "この結果は一般的な占星術と風水に基づく最初の目安で、物件の絞り込みや風水師・占い師との相談に役立ちます。方位、ドア、番地、実際の間取りは現地で確認が必要です。室内は後から WIDEROOMS で色・照明・家具を調整できます。",
  yin: "陰", yang: "陽",
  prof: {
    water: { core: "水 — 深く、落ち着いていて、プライベート", strong: ["プライベートプール、湖、川、噴水", "プライバシーが高く、開けすぎない", "一日中明るいより、落ち着いた奥行きのある雰囲気"], color: "黒、ディープネイビー、バーガンディ、ダークグレー", accent: "ゴールドや淡い黄色、少しの暖かいオレンジ", dir: "北、または家の前や横に水", avoid: ["カーテンやスクリーンのない全面ガラスの家", "水のエレメントがまったくない", "日よけのない強い南・西日を受ける玄関", "にぎやかで騒がしい通り"], types: { house: "一戸建て／ヴィラ：プライベートプールと高いプライバシー", condo: "コンド：海や水が見える階と向き、開けた低層階は避ける", land: "土地：水に近く、良い土壌、急すぎず狭すぎない進入路" } },
    fire: { core: "火 — 明るく、温かく、社交的", strong: ["たっぷりの自然光、広いリビング", "おもてなしの空間：テラス、ルーフトップ", "広い眺望と高い天井"], color: "赤、オレンジ、ピンク、紫", accent: "緑と木（木生火）", dir: "南または東", avoid: ["暗く湿気の多い家", "黒やディープネイビーが多すぎる", "玄関正面の噴水やプール（水剋火）"], types: { house: "一戸建て／ヴィラ：開放的で明るく、集まりに向く", condo: "コンド：高層階、角部屋、朝日が入る", land: "土地：開けて日当たりが良く、進入路が広い" } },
    earth: { core: "土 — 地に足がつき、温かく、安定", strong: ["広い土地に庭のある家", "四角くバランスの良い間取り", "山の眺め、しっかりした後ろ盾"], color: "ベージュ、ブラウン、テラコッタ、マスタード", accent: "少しの赤やオレンジ（火生土）", dir: "北東または南西", avoid: ["非常に高い高層階の暮らし", "浸水しやすい低地", "欠けのある間取り"], types: { house: "一戸建て／ヴィラ：広い敷地、美しい庭、バランスの良い間取り", condo: "コンド：緑に近い低〜中層階", land: "土地：四角い区画、固い地盤、背後に丘" } },
    air: { core: "風 — 軽やかで、開放的で、活動的", strong: ["広い眺望、高層階、バルコニーやルーフトップ", "風が抜ける開放的な間取り", "街に近く移動が便利"], color: "白、ライトグレー、ペールブルー、シルバー", accent: "少しの黄色やゴールド", dir: "西または北西", avoid: ["閉め切った風通しの悪い部屋", "行きにくい辺鄙な場所", "散らかった玄関"], types: { house: "一戸建て／ヴィラ：開放的な間取り、ルーフトップ、風通し", condo: "コンド：高層階、広い眺望、角部屋", land: "土地：高台で開けた土地、幹線道路の近く" } }
  }
});
Object.assign(LBL.ru, {
  unknownTime: "Время рождения неизвестно: асцендент не рассчитывается, положение Луны может быть неточным", cusp: "рядом с границей знаков", thai: "Тайская", west: "Западная", group: { E: "Восточная группа", W: "Западная группа" }, dirRole: ["Богатство", "Здоровье", "Отношения", "Стабильность"],
  pElem: "Главная стихия", pStrong: "Что вас поддерживает", pColor: "Ваши цвета", pAccent: "Акцентные цвета", pDir: "Лучшие направления", pAvoid: "Чего избегать", pTypes: "По типу объекта",
  bzLine: "Хозяин дня — {dm}; поддерживающие стихии: {sup}", kuaLine: "Вам подходит главный вход или фасад, обращённый на {dirs}",
  tmBuy: "Покупка / переоформление (12 месяцев от выбранной даты)", tmRent: "Период аренды", bestDays: "Благоприятные дни, чтобы {act}", actBuy: "подписать договор или переоформить", actRent: "въехать",
  yearClash: "{y} год в конфликте с вашим знаком — если решать в этом году, выбирайте хорошие месяцы и дни ниже", yearGood: "{y} год в гармонии с вашим знаком — удачное время для нового начала",
  tmNote: "Расчёт по связи земных ветвей каждого месяца и дня с вашим годом и днём рождения, а также по транзиту Солнца относительно вашего тайского знака.",
  matchNote: "Общий балл по стихиям каждого дома (бассейн, море, сад, цвета, приватность), стихиям, поддерживающим вашего Хозяина дня, и направлению фасада относительно ваших благоприятных сторон.", none: "Пока нет объектов под эти фильтры. Попробуйте другой тип или цель.",
  rPoolP: "Частный бассейн (Вода)", rPoolS: "Общий бассейн (Вода)", rSea: "Вид на море / рядом с морем (Вода)", rLake: "У озера / водохранилища (Вода)", rWG: "Водный сад или пруд",
  rPriv: "Отдельный дом, высокая приватность", rOpenW: "Очень открытый, много стекла — нужны шторы или ширмы", rOpen: "Открытый, светлый, хорошо проветривается", rView: "Широкий вид, высоко", rGarden: "Зелёный сад и деревья (Дерево)",
  rPal: "Цвета дома — стихия «{el}», она вам подходит", rPalX: "Цвета дома — стихия «{el}», легко уравновесить декором", rLand: "Просторная, надёжная земля (Земля)", rMount: "Вид на горы, холмы за спиной (Земля)", rModern: "Белые и серые современные тона (Металл)",
  rFaceG: "Фасад на {d} — одно из ваших благоприятных направлений", rFaceB: "Фасад на {d} — не благоприятное направление; уравновесьте боковой дверью или декором", rFaceU: "Точное направление фасада уточняется в {brand}", rBz: "Даёт стихию «{el}», которая поддерживает вашего Хозяина дня",
  disc: "Это предварительный ориентир по общим принципам астрологии и фэншуй, чтобы сузить выбор и обсудить его с мастером фэншуй или астрологом. Направления, двери, номер дома и планировку нужно проверить на месте; интерьер можно настроить позже цветом, светом и мебелью через WIDEROOMS.",
  yin: "Инь", yang: "Ян",
  prof: {
    water: { core: "Вода — глубокая, спокойная, уединённая", strong: ["Частный бассейн, озеро, река или фонтан", "Высокая приватность, не слишком открыто", "Спокойная, многослойная атмосфера вместо яркого света весь день"], color: "Чёрный, тёмно-синий, бордовый, тёмно-серый", accent: "Золотой или мягкий жёлтый, немного тёплого оранжевого", dir: "Север, или вода перед домом или сбоку", avoid: ["Стеклянные дома без штор и ширм", "Полное отсутствие воды", "Главный вход под сильным южным/западным солнцем без тени", "Оживлённые, шумные улицы"], types: { house: "Дом/вилла: частный бассейн и высокая приватность", condo: "Кондо: этаж и сторона с видом на море или воду; избегайте открытых нижних этажей", land: "Земля: рядом с водой, хорошая почва, подъезд не крутой и не узкий" } },
    fire: { core: "Огонь — яркий, тёплый, общительный", strong: ["Много дневного света, просторная гостиная", "Место для гостей: террасы, крыши", "Широкие виды и высокие потолки"], color: "Красный, оранжевый, розовый, фиолетовый", accent: "Зелёный и дерево (Дерево питает Огонь)", dir: "Юг или восток", avoid: ["Тёмные, сырые дома", "Слишком много чёрного или тёмно-синего", "Фонтан или бассейн прямо у главного входа (Вода гасит Огонь)"], types: { house: "Дом/вилла: открытый, светлый, для встреч с друзьями", condo: "Кондо: высокий этаж, угловая квартира, утреннее солнце", land: "Земля: открытая, солнечная, с широким подъездом" } },
    earth: { core: "Земля — основательная, тёплая, устойчивая", strong: ["Дом на просторном участке с садом", "Квадратная, сбалансированная планировка", "Вид на горы, надёжный тыл"], color: "Бежевый, коричневый, терракотовый, горчичный", accent: "Немного красного или оранжевого (Огонь питает Землю)", dir: "Северо-восток или юго-запад", avoid: ["Жизнь на очень высоких этажах", "Низины, которые затапливает", "Планировки с недостающими углами"], types: { house: "Дом/вилла: большой участок, красивый сад, ровная планировка", condo: "Кондо: нижние и средние этажи рядом с зеленью", land: "Земля: квадратный участок, плотный грунт, холмы позади" } },
    air: { core: "Воздух — лёгкий, открытый, в движении", strong: ["Широкие виды, высокие этажи, балконы и крыши", "Сквозное проветривание и открытые планировки", "Рядом с городом, удобно добираться"], color: "Белый, светло-серый, бледно-голубой, серебристый", accent: "Немного жёлтого или золотого", dir: "Запад или северо-запад", avoid: ["Закрытые, душные комнаты", "Удалённые, труднодоступные места", "Захламлённый вход"], types: { house: "Дом/вилла: открытая планировка, терраса на крыше, сквозняк", condo: "Кондо: высокий этаж, широкий вид, угловая квартира", land: "Земля: высокое открытое место рядом с главной дорогой" } }
  }
});
/* birth-city names per language (codes stay the same) */
const CITY_N = {
  th: { bkk: "กรุงเทพฯ", pty: "พัทยา", cnx: "เชียงใหม่", hkt: "ภูเก็ต", pek: "ปักกิ่ง", sha: "เซี่ยงไฮ้", hkg: "ฮ่องกง", sin: "สิงคโปร์", tpe: "ไทเป", sel: "โซล", tyo: "โตเกียว", mow: "มอสโก", dxb: "ดูไบ", bom: "มุมไบ", lon: "ลอนดอน", ber: "เบอร์ลิน", par: "ปารีส", nyc: "นิวยอร์ก", lax: "ลอสแอนเจลิส", syd: "ซิดนีย์" },
  zh: { bkk: "曼谷", pty: "芭提雅", cnx: "清迈", hkt: "普吉", pek: "北京", sha: "上海", hkg: "香港", sin: "新加坡", tpe: "台北", sel: "首尔", tyo: "东京", mow: "莫斯科", dxb: "迪拜", bom: "孟买", lon: "伦敦", ber: "柏林", par: "巴黎", nyc: "纽约", lax: "洛杉矶", syd: "悉尼" },
  ko: { bkk: "방콕", pty: "파타야", cnx: "치앙마이", hkt: "푸껫", pek: "베이징", sha: "상하이", hkg: "홍콩", sin: "싱가포르", tpe: "타이베이", sel: "서울", tyo: "도쿄", mow: "모스크바", dxb: "두바이", bom: "뭄바이", lon: "런던", ber: "베를린", par: "파리", nyc: "뉴욕", lax: "로스앤젤레스", syd: "시드니" },
  ja: { bkk: "バンコク", pty: "パタヤ", cnx: "チェンマイ", hkt: "プーケット", pek: "北京", sha: "上海", hkg: "香港", sin: "シンガポール", tpe: "台北", sel: "ソウル", tyo: "東京", mow: "モスクワ", dxb: "ドバイ", bom: "ムンバイ", lon: "ロンドン", ber: "ベルリン", par: "パリ", nyc: "ニューヨーク", lax: "ロサンゼルス", syd: "シドニー" },
  ru: { bkk: "Бангкок", pty: "Паттайя", cnx: "Чиангмай", hkt: "Пхукет", pek: "Пекин", sha: "Шанхай", hkg: "Гонконг", sin: "Сингапур", tpe: "Тайбэй", sel: "Сеул", tyo: "Токио", mow: "Москва", dxb: "Дубай", bom: "Мумбаи", lon: "Лондон", ber: "Берлин", par: "Париж", nyc: "Нью-Йорк", lax: "Лос-Анджелес", syd: "Сидней" }
};
const BUY_B = [5, 10, 20, 30, 50, 100], RENT_B = [30000, 50000, 80000, 120000, 200000, 300000, 500000];
/* area character, 0..1 — water (sea/lake), lake, hill (earth), green (wood), quiet, city (lively, fire), view */
const ZT = {
  mapprachan:  { water: .8, lake: 1, hill: .6, green: .8, quiet: .9, city: .1, view: .6 },
  siamcc:      { water: .6, lake: .8, hill: .3, green: .8, quiet: .8, city: .2, view: .4 },
  khaotalo:    { water: .1, hill: .8, green: .5, quiet: .5, city: .3, view: .5 },
  eastpattaya: { water: .1, hill: .4, green: .6, quiet: .6, city: .4, view: .2 },
  pattanakarn: { water: .1, hill: .3, green: .3, quiet: .4, city: .6, view: .2 },
  thappraya:   { water: .6, sea: .6, hill: .3, green: .3, quiet: .4, city: .6, view: .6 },
  pratumnak:   { water: .8, sea: .8, hill: .6, green: .5, quiet: .6, city: .4, view: .9 },
  jomtien:     { water: 1, sea: 1, hill: .1, green: .2, quiet: .3, city: .6, view: .8 },
  sattahip:    { water: .9, sea: .9, hill: .6, green: .6, quiet: .8, city: .1, view: .7 },
  huaiyai:     { water: .2, hill: .8, green: .9, quiet: 1, city: 0, view: .4 },
  thungklom:   { water: .2, hill: .4, green: .6, quiet: .6, city: .3, view: .3 },
  chaiyapruk:  { water: .3, hill: .4, green: .5, quiet: .6, city: .4, view: .3 },
  nongprue:    { water: .1, hill: .3, green: .3, quiet: .3, city: .7, view: .2 },
  najomtien:   { water: 1, sea: 1, hill: .3, green: .4, quiet: .7, city: .2, view: .7 },
  southpattaya:{ water: .5, sea: .5, hill: .1, green: .1, quiet: .1, city: 1, view: .5 },
  northpattaya:{ water: .6, sea: .6, hill: .1, green: .2, quiet: .3, city: .8, view: .6 },
  nongplalai:  { water: .5, lake: .6, hill: .7, green: .9, quiet: .9, city: 0, view: .5 },
  khaonoi:     { water: .1, hill: .7, green: .4, quiet: .5, city: .5, view: .6 },
  pattaya:     { water: .5, sea: .5, hill: .1, green: .1, quiet: .1, city: 1, view: .4 }
};
const CENTRE = [12.9276, 100.8771];
const DIR8 = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
function bearing(a, b) { const r = Math.PI / 180, y = Math.sin((b[1] - a[1]) * r) * Math.cos(b[0] * r), x = Math.cos(a[0] * r) * Math.sin(b[0] * r) - Math.sin(a[0] * r) * Math.cos(b[0] * r) * Math.cos((b[1] - a[1]) * r);
  return (Math.atan2(y, x) / r + 360) % 360; }
const km = (a, b) => { const r = Math.PI / 180, dl = (b[0] - a[0]) * r, dn = (b[1] - a[1]) * r * Math.cos(a[0] * r); return 6371 * Math.hypot(dl, dn); };
const dir8 = deg => DIR8[Math.round(md(deg, 360) / 45) % 8];
/* facing written in the Sheet: N/NE/…, Thai words, or degrees from north */
function parseFacing(v) { if (v == null || v === "") return null; const s = String(v).trim().toUpperCase().replace(/[\s_-]/g, "");
  if (/^\d+(\.\d+)?°?$/.test(s)) return dir8(parseFloat(s));
  if (DIR_EL[s]) return s; const w = { NORTH: "N", SOUTH: "S", EAST: "E", WEST: "W", NORTHEAST: "NE", NORTHWEST: "NW", SOUTHEAST: "SE", SOUTHWEST: "SW" }[s]; if (w) return w;
  const t = String(v).replace(/\s|ทิศ/g, ""); const th = { "เหนือ": "N", "ใต้": "S", "ตะวันออก": "E", "ตะวันตก": "W", "ตะวันออกเฉียงเหนือ": "NE", "ตะวันตกเฉียงเหนือ": "NW", "ตะวันออกเฉียงใต้": "SE", "ตะวันตกเฉียงใต้": "SW", "อีสาน": "NE", "พายัพ": "NW", "อาคเนย์": "SE", "หรดี": "SW" }[t];
  return th || null; }
let BRANDED = 0;
const brandAll = () => { if (BRANDED) return; BRANDED = 1; const b = G("SITE", {}).short || "";
  const walk = o => { for (const k in o) { const v = o[k]; if (typeof v === "string") { if (v.includes("{brand}")) o[k] = v.split("{brand}").join(b); } else if (v && typeof v === "object") walk(v); } };
  walk(TX); walk(LBL); };
const L = () => { brandAll(); const l = G("lang","th"); if (TX[l]) return TX[l]; const base = TX.en; return Object.assign({}, base, LBL[l] || {}); };

/* timing: yearly planets and the updated method note */
Object.assign(TX.th, {"plJup": "ดาวพฤหัส", "plSat": "ดาวเสาร์", "plLine": "ราศี{sign} เรือน {h}", "plRef": "นับจาก{ref}", "plAll": "ทั้งช่วง", "refLagna": "ลัคนา", "refMoon": "ราศีจันทร์", "plGood": "หนุน", "plOk": "กลาง ๆ", "plBad": "ควรระวัง", "tmNote": "คำนวณจากนักษัตรและก้านฟ้าของเดือนและปี เทียบกับปีเกิด วันเกิด และธาตุที่หนุนดวง ราศีที่ดวงอาทิตย์โคจรเทียบกับราศีเกิด และตำแหน่งจริงของดาวพฤหัสและดาวเสาร์เทียบกับลัคนา (ใช้ราศีจันทร์แทนถ้าไม่ทราบเวลาเกิด) ผลจึงต่างกันในแต่ละปี"});
Object.assign(TX.en, {"plJup": "Jupiter", "plSat": "Saturn", "plLine": "{sign}, house {h}", "plRef": "counted from your {ref}", "plAll": "whole period", "refLagna": "ascendant", "refMoon": "Moon sign", "plGood": "supportive", "plOk": "neutral", "plBad": "take care", "tmNote": "Based on each month's and year's earthly branch and heavenly stem against your birth year, birth day and the elements that support your Day Master; the Sun's transit against your Thai sun sign; and the real positions of Jupiter and Saturn against your ascendant (or your Moon sign if the birth time is unknown). So every year reads differently."});
Object.assign(LBL.zh, {"plJup": "木星", "plSat": "土星", "plLine": "{sign}，第 {h} 宫", "plRef": "自您的{ref}起算", "plAll": "全程", "refLagna": "上升", "refMoon": "月亮星座", "plGood": "助力", "plOk": "平", "plBad": "宜谨慎", "tmNote": "依据每月、每年的地支与天干，对照您的出生年、出生日及日主的喜用五行；太阳行经星座与您泰式太阳星座的关系；以及木星、土星的实际位置相对于您的上升（不知出生时间则用月亮星座）。因此每年结果都不同。"});
Object.assign(LBL.ko, {"plJup": "목성", "plSat": "토성", "plLine": "{sign}, {h}번째 하우스", "plRef": "{ref} 기준", "plAll": "전체 기간", "refLagna": "상승궁", "refMoon": "달 별자리", "plGood": "도움", "plOk": "보통", "plBad": "주의", "tmNote": "매달·매년의 지지와 천간을 출생 연·일, 일간을 돕는 오행과 비교하고, 태양이 지나는 별자리를 태국식 태양 별자리와 비교하며, 목성과 토성의 실제 위치를 상승궁(출생 시간을 모르면 달 별자리) 기준으로 봅니다. 그래서 해마다 결과가 달라집니다."});
Object.assign(LBL.ja, {"plJup": "木星", "plSat": "土星", "plLine": "{sign}・第{h}ハウス", "plRef": "{ref}から数えて", "plAll": "期間中ずっと", "refLagna": "アセンダント", "refMoon": "月星座", "plGood": "追い風", "plOk": "普通", "plBad": "注意", "tmNote": "各月・各年の十二支と十干を、生まれ年・生まれ日・日主を助ける五行と照らし合わせ、太陽の運行をタイ式太陽星座と比較し、さらに木星と土星の実際の位置をアセンダント（出生時刻が不明なら月星座）から見ています。そのため年ごとに結果が変わります。"});
Object.assign(LBL.ru, {"plJup": "Юпитер", "plSat": "Сатурн", "plLine": "{sign}, {h}-й дом", "plRef": "считая от {ref}", "plAll": "весь период", "refLagna": "асцендента", "refMoon": "лунного знака", "plGood": "поддерживает", "plOk": "нейтрально", "plBad": "осторожно", "tmNote": "Расчёт по земным ветвям и небесным стволам каждого месяца и года относительно года и дня рождения и элементов, поддерживающих Хозяина дня; по транзиту Солнца относительно тайского знака Солнца; и по реальному положению Юпитера и Сатурна относительно асцендента (или лунного знака, если время рождения неизвестно). Поэтому каждый год выглядит по-разному."});

/* ---------------- chart ---------------- */
function chart(inp) {
  const [y, m, d] = inp.date.split("-").map(Number);
  const known = !!inp.time; const [hh, mm] = known ? inp.time.split(":").map(Number) : [12, 0];
  const city = CITIES.find(c => c[0] === inp.city) || CITIES[0], tz = city[4];
  const J = jdUT(y, m, d, hh + mm / 60 - tz), ay = ayan(J);
  const sunT = sunLon(J), moonT = moonLon(J), sunS = norm(sunT - ay), moonS = norm(moonT - ay);
  const asc = known ? norm(ascendant(J, city[2], city[3]) - ay) : null;
  const cy = cnYear(y, m, J), ys = md(cy - 4, 10), yb = md(cy - 4, 12);
  // Chinese day changes at 23:00 (子 hour)
  let dd = new Date(Date.UTC(y, m - 1, d)); if (known && hh >= 23) dd = new Date(dd.getTime() + 864e5);
  const [ds, db] = dayPillar(dd.getUTCFullYear(), dd.getUTCMonth() + 1, dd.getUTCDate());
  const k = inp.gender === "m" || inp.gender === "f" ? kua(cy, inp.gender) : null;
  const thEl = THAI_EL[Math.floor(sunS / 30) % 4];
  const dm = STEM_EL[ds], sup = [dm, MOTHER[dm]];
  const cusp = x => (x % 30) < 1.5 || (x % 30) > 28.5;
  return { y, m, d, known, sunT, moonT, sunS, moonS, asc, cy, ys, yb, ds, db, kua: k, dirs: k ? KUA_DIRS[k] : null, thEl, dm, sup, cusp, name: inp.name || "" };
}

/* ---------------- listing features ---------------- */
function hexEl(hex) { const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, dl = mx - mn, s = dl ? dl / (1 - Math.abs(2 * l - 1)) : 0;
  let h = 0; if (dl) h = mx === r ? 60 * md((g - b) / dl, 6) : mx === g ? 60 * ((b - r) / dl + 2) : 60 * ((r - g) / dl + 4);
  if (l < 0.22) return "water"; if (s < 0.14) return l > 0.6 ? "metal" : "water";
  if (h >= 190 && h < 260) return "water"; if (h >= 75 && h < 190) return "wood"; if (h < 22 || h >= 330) return s > 0.4 ? "fire" : "earth"; if (h < 60) return l > 0.75 ? "metal" : "earth"; if (h < 75) return "earth"; return "fire"; }
const SEA_Z = ["jomtien","pratumnak","thappraya","najomtien","southpattaya","northpattaya","sattahip"], LAKE_Z = ["mapprachan","siamcc"];
// compass-confirmed facing per listing lives with the agent: FACING in agents/<id>/listing-data.js
function facingOf(c, l) { const fs = l && parseFacing(l.facing); if (fs) return fs; const FC = G("FACING", {}); if (FC[c]) return FC[c]; const h = G("HOME_STYLE", {})[c]; const txt = h && h.en ? (h.en.feng || []).join(" ") + " " + (h.en.concept || "") : "";
  const m = txt.match(/\b(?:house|home|villa|front|door|it)\s+faces\s+(?:due\s+)?(north|south|east|west)(?:-(east|west))?\b/i); if (!m) return null;
  const k = (m[1][0] + (m[2] ? m[2][0] : "")).toUpperCase(); return DIR_EL[k] ? k : null; }
function feat(l) {
  const h = G("HOME_STYLE",{})[l.code], tx = h && h.en ? ((h.en.concept || "") + " " + (h.en.feng || []).join(" ")).toLowerCase() : "", tags = l.tags || [];
  const f = { water: 0, privacy: 0, open: 0, view: 0, garden: 0, earth: 0, metal: 0, fire: 0, pal: {}, facing: facingOf(l.code, l), flags: [] };
  if (l.pool === "private") { f.water += 2; f.flags.push("rPoolP"); } else if (l.pool === "shared") { f.water += 1; f.flags.push("rPoolS"); }
  if (tags.includes("seaView") || /\bsea\b|ocean|beach/.test(tx)) { f.water += 1.2; f.view += 0.6; f.flags.push("rSea"); } else if (SEA_Z.includes(l.zone)) f.water += 0.4;
  if (LAKE_Z.includes(l.zone) || /\blake|reservoir/.test(tx)) { f.water += 0.8; f.flags.push("rLake"); }
  if (tags.includes("waterGarden") || /koi|pond|fountain|waterfall/.test(tx)) { f.water += 0.6; f.flags.push("rWG"); }
  if (l.type === "villa" || l.type === "house") { f.privacy += 1; f.flags.push("rPriv"); } else if (l.type === "land") f.privacy += 0.6; else f.privacy += 0.3;
  if (/private|privacy|secluded|gated|walled/.test(tx)) f.privacy += 0.4;
  if (/floor-to-ceiling|double-height|open-plan|open plan|glass wall|wall of glass|panoramic|full-height glass/.test(tx)) f.open += 1;
  if (l.type === "condo") { const fl = parseInt(l.floor) || 0; if (fl >= 15) { f.view += 1; f.open += 0.4; } else if (fl) f.view += 0.4; }
  if (tags.some(x => ["rooftop","cityView","mountainView","seaView","storey3"].includes(x)) || /rooftop|view/.test(tx)) { f.view += 0.6; f.flags.push("rView"); }
  if (tags.includes("trees") || /garden|lawn|tree|tropical planting|greenery/.test(tx)) { f.garden += 1; f.flags.push("rGarden"); }
  if (/teak|timber|wood/.test(tx)) f.garden += 0.3;
  if (l.type === "land") { f.earth += 1.2; f.flags.push("rLand"); }
  if (tags.includes("mountainView") || /mountain|hill/.test(tx)) { f.earth += 0.6; f.flags.push("rMount"); }
  if (/modern|minimal|marble|steel|white/.test(tx)) f.metal += 0.6;
  if (/sunlit|sunny|sunlight|warm light|golden/.test(tx)) f.fire += 0.5;
  if (h && h.palette) for (const [hex] of h.palette) { const e = hexEl(hex); f.pal[e] = (f.pal[e] || 0) + 1; }
  const mg = G("MG_EL",{}); for (const e in mg) if ((mg[e].homes || []).includes(l.code)) f.pal[e] = (f.pal[e] || 0) + 2;
  f.palTop = Object.entries(f.pal).sort((a, b) => b[1] - a[1])[0]; f.palTop = f.palTop ? f.palTop[0] : null;
  return f;
}
const cap = (x, c) => Math.min(x, c) / c;
function elFeat(f, e) {   // how strongly a home expresses a Chinese element, 0..1
  const p = (f.pal[e] || 0) / 5;
  if (e === "water") return Math.min(1, cap(f.water, 3) * 0.75 + p * 0.25);
  if (e === "wood") return Math.min(1, cap(f.garden, 1.3) * 0.7 + p * 0.3);
  if (e === "fire") return Math.min(1, cap(f.fire + f.open * 0.5 + (f.facing === "S" ? 1 : 0), 1.5) * 0.6 + p * 0.4);
  if (e === "earth") return Math.min(1, cap(f.earth, 1.5) * 0.6 + p * 0.4);
  return Math.min(1, cap(f.metal, 0.6) * 0.5 + p * 0.5);   // metal
}
function score(l, C) {
  const f = feat(l), T = L(), why = [];
  // 1. Thai element (40)
  let th = 0;
  if (C.thEl === "water") th = cap(f.water, 3) * 0.55 + cap(f.privacy, 1.3) * 0.3 + ((f.pal.water || 0) / 5) * 0.15 - (f.open ? 0.12 : 0);
  if (C.thEl === "fire") th = cap(f.open + f.fire, 1.5) * 0.4 + cap(f.view, 1.2) * 0.3 + ((f.pal.fire || 0) / 5) * 0.3;
  if (C.thEl === "earth") th = cap(f.earth + f.garden * 0.6, 1.6) * 0.5 + cap(f.privacy, 1.3) * 0.25 + ((f.pal.earth || 0) / 5) * 0.25;
  if (C.thEl === "air") th = cap(f.view, 1.4) * 0.5 + cap(f.open, 1) * 0.3 + ((f.pal.metal || 0) / 5) * 0.2;
  th = Math.max(0, Math.min(1, th));
  // 2. BaZi supporting elements (30)
  const bz = Math.max(elFeat(f, C.sup[0]), elFeat(f, C.sup[1]));
  // 3. Kua direction (20)
  let kd = 0.5; if (f.facing && C.dirs) kd = C.dirs.includes(f.facing) ? 1 : 0.15;
  // 4. palette harmony with Thai element (10)
  const want = TH_TO_CN[C.thEl], palOk = f.palTop && (f.palTop === want || f.palTop === MOTHER[want]);
  const total = Math.round(40 * th + 30 * bz + 20 * kd + 10 * (palOk ? 1 : f.palTop ? 0.4 : 0.5));
  // reasons, most relevant first
  const order = { water: ["rPoolP","rSea","rLake","rWG","rPoolS","rPriv"], fire: ["rView","rSea","rGarden","rPoolP"], earth: ["rLand","rMount","rGarden","rPriv"], air: ["rView","rSea","rPoolS","rGarden"] }[C.thEl];
  for (const k of order) if (f.flags.includes(k)) why.push(["+", T[k]]);
  if (C.thEl === "water" && f.open) why.push(["!", T.rOpenW]); else if (C.thEl !== "water" && f.open) why.push(["+", T.rOpen]);
  if (f.palTop) why.push([palOk ? "+" : "~", (palOk ? T.rPal : T.rPalX).replace("{el}", T.el[f.palTop])]);
  const bzEl = elFeat(f, C.sup[0]) >= elFeat(f, C.sup[1]) ? C.sup[0] : C.sup[1]; if (bz >= 0.5) why.push(["+", T.rBz.replace("{el}", T.el[bzEl])]);
  if (f.facing && C.dirs) why.push([C.dirs.includes(f.facing) ? "+" : "!", (C.dirs.includes(f.facing) ? T.rFaceG : T.rFaceB).replace("{d}", T.dir[f.facing])]);
  else if (C.dirs) why.push(["~", T.rFaceU]);
  return { l, total: Math.max(5, Math.min(99, total)), why };
}

/* ---------------- timing ---------------- */
function dayScore(C, date) { const [, b] = dayPillar(date.getFullYear(), date.getMonth() + 1, date.getDate());
  if (CLASH(b, C.yb) || CLASH(b, C.db)) return -3; return branchRel(b, C.yb) * 1.2 + branchRel(b, C.db) * 0.8; }
// heavenly stem element of a year / month against the elements that support the Day Master
const stemFit = (C, stem, w) => { const el = STEM_EL[stem]; return C.sup.includes(el) ? w : el === CONTROLLER[C.dm] ? -w * 0.7 : 0; };
// gochara: house a slow planet transits, counted from the lagna (or the natal Moon sign without a birth time)
const refSign = C => Math.floor((C.asc != null ? C.asc : C.moonS) / 30);
const houseOf = (C, lon) => md(Math.floor(lon / 30) - refSign(C), 12) + 1;
const JUP_H = h => [2, 5, 7, 9, 11].includes(h) ? 0.8 : [8, 12].includes(h) ? -0.5 : 0;
const SAT_H = h => [3, 6, 11].includes(h) ? 0.6 : [4, 8, 12, 1, 2].includes(h) ? -0.5 : 0;
function monthScore(C, y, m) {
  const J = jdUT(y, m, 15, 5), mb = monthBranch(J), cy = cnYear(y, m, J), ybr = md(cy - 4, 12), ys = md(cy - 4, 10);
  let s = branchRel(mb, C.yb) * 1.2 + branchRel(mb, C.db) * 0.6 + (CLASH(ybr, C.yb) ? -1 : 0) + (branchRel(ybr, C.yb) > 1 ? 0.5 : 0);
  const rel = md(Math.floor(norm(sunLon(J) - ayan(J)) / 30) - Math.floor(C.sunS / 30), 12);   // sun transit house from natal sun
  if ([0, 4, 8].includes(rel)) s += 1; else if ([5, 7, 11].includes(rel)) s -= 0.7; else if (rel === 6) s -= 0.3;
  // month stem: the 寅 month of a year with stem ys starts at stem (ys % 5) * 2 + 2 (五虎遁)
  const ms = md((ys % 5) * 2 + 2 + md(mb - 2, 12), 10);
  s += stemFit(C, ms, 0.6) + stemFit(C, ys, 0.3);
  s += JUP_H(houseOf(C, planetSid("jupiter", J))) + SAT_H(houseOf(C, planetSid("saturn", J)));
  return s; }
const grade = s => s >= 2.5 ? 3 : s >= 1.2 ? 2 : s >= -0.2 ? 1 : 0;   // tuned so the four grades keep roughly the same shares as before the stem/planet factors
function timing(C, inp) {
  const months = [];
  let start, end;
  if (inp.purpose === "rent") { start = new Date(inp.from || Date.now()); end = new Date(inp.to || (start.getTime() + 365 * 864e5)); if (end < start) end = new Date(start.getTime() + 365 * 864e5); }
  else { start = new Date(inp.buy || Date.now()); end = new Date(start.getFullYear(), start.getMonth() + 11, 1); }
  for (let y = start.getFullYear(), m = start.getMonth() + 1, i = 0; i < 24; i++) {
    if (new Date(y, m - 1, 1) > end) break;
    months.push({ y, m, s: monthScore(C, y, m) }); m++; if (m > 12) { m = 1; y++; } }
  // best days: a good day inside a good month. Look in the "good"/"excellent" months first (nearest first),
  // then fall back to "neutral" months, so a suggested day never sits in a "caution" month.
  const mg = {}; months.forEach(x => { mg[x.y * 100 + x.m] = grade(x.s); });
  const winEnd = inp.purpose === "rent" ? new Date(Math.min(end.getTime(), start.getTime() + 75 * 864e5)) : new Date(start.getFullYear(), start.getMonth() + 12, 0);   // move-in: near the start of the lease
  const pick = minG => { const out = [];
    for (let t = new Date(start); t <= winEnd && out.length < 6; t = new Date(t.getTime() + 864e5)) {
      const g = mg[t.getFullYear() * 100 + t.getMonth() + 1]; if (g == null || g < minG) continue;
      const ds = dayScore(C, t); if (ds > 1.5) out.push({ t: new Date(t), s: ds + g }); }
    return out; };
  let days = pick(2); if (days.length < 3) days = days.concat(pick(1).filter(d => !days.some(x => +x.t === +d.t)));
  const yrs = [...new Set(months.map(x => x.y))].map(y => { const ybr = md(y - 4, 12); return { y, clash: CLASH(ybr, C.yb), good: branchRel(ybr, C.yb) > 1 }; });
  // Jupiter and Saturn across the window, grouped into runs of months in the same sign (retrogrades can move them back)
  const pl = ["jupiter", "saturn"].map(k => { const runs = [];
    months.forEach(x => { const lon = planetSid(k, jdUT(x.y, x.m, 15, 5)), sign = Math.floor(lon / 30), r = runs[runs.length - 1];
      if (r && r.sign === sign) r.to = x; else { const h = houseOf(C, lon); runs.push({ sign, h, v: (k === "jupiter" ? JUP_H : SAT_H)(h), from: x, to: x }); } });
    return { k, runs }; });
  return { months, days: days.slice(0, 6).sort((a, b) => a.t - b.t), yrs, pl };
}

/* ---------------- UI ---------------- */
const css = `
.ds{padding-bottom:60px}.ds-hero{display:grid;gap:10px;margin:18px 0 22px}.ds-hero h1{font-family:var(--f-display);font-size:clamp(28px,4vw,42px);line-height:1.15}
.ds-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:12px;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:18px}
.ds-form label{display:grid;gap:5px;font-size:13px;color:var(--ink-2)}.ds-form input,.ds-form select{font:inherit;padding:10px 12px;border:1px solid var(--line-2);border-radius:10px;background:var(--surface-2);color:var(--ink);min-width:0;color-scheme:light dark}
.ds-form .chk{display:flex;align-items:center;gap:8px;font-size:13px}.ds-form .chk input{width:auto}.ds-form .full{grid-column:1/-1}
@media(min-width:601px){.ds-wide{grid-column:span 2}}.ds-dp{display:grid;grid-template-columns:.8fr 1.6fr 1.1fr;gap:6px}.ds-dp select{padding:10px 8px}
.ds-priv{font-size:12.5px;color:var(--muted)}.ds-go{grid-column:1/-1;justify-self:start}
.ds-sec{margin-top:34px}.ds-sec h2{font-family:var(--f-display);font-size:clamp(22px,3vw,30px);margin-bottom:12px}
.ds-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:12px}
.ds-c{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px}.ds-c small{display:block;color:var(--muted);font-size:12px}.ds-c b{display:block;font-size:19px;margin-top:4px}.ds-c em{display:block;font-style:normal;color:var(--muted);font-size:13px;margin-top:3px}
.ds-el{display:inline-block;padding:2px 9px;border-radius:99px;color:#fff;font-size:12px;margin-top:6px}
.ds-sw{display:flex;gap:6px;margin:8px 0 2px}.ds-sw i{width:34px;height:22px;border-radius:6px;border:1px solid var(--line-2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}.ds-sw.sm i{width:26px;height:18px}
.ds-dirs{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.ds-dirs span{background:var(--surface-3);color:var(--ink);border-radius:8px;padding:4px 8px;font-size:12.5px}
.ds-prof .ds-c small{font-size:13.5px;margin-top:2px}.ds-prof .ds-c small[style]{margin-top:16px!important}.ds-prof .ds-c em{font-size:16px;line-height:1.6;color:var(--ink-2);margin-top:6px}.ds-prof .ds-c b{font-size:20px;line-height:1.35}.ds-prof li{font-size:16px;line-height:1.6}.ds-prof .ds-sw{margin:10px 0 4px}
.ds-prof{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:12px}.ds-prof ul{margin:6px 0 0;padding-left:20px}.ds-prof li{margin:3px 0}
.ds-months{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px}.ds-m{border-radius:12px;padding:10px;text-align:center;font-size:13px}.ds-m b{display:block;font-size:12px;opacity:.85}
.g3{background:#1F3A5F;color:#fff}.g2{background:var(--brand-soft);color:var(--ink)}.g1{background:var(--surface-3);color:var(--ink-2)}.g0{background:#f3d9cf;color:#8a3b22}:root[data-theme="dark"] .g3{background:#E2A957;color:#0E131A}:root[data-theme="dark"] .g2{background:#2f5d8f;color:#fff}:root[data-theme="dark"] .g0{background:#4a2a20;color:#f3c9b8}@media(prefers-color-scheme:dark){:root:not([data-theme="light"]) .g3{background:#E2A957;color:#0E131A}:root:not([data-theme="light"]) .g2{background:#2f5d8f;color:#fff}:root:not([data-theme="light"]) .g0{background:#4a2a20;color:#f3c9b8}}
.ds-leg{display:flex;flex-wrap:wrap;gap:10px;font-size:12.5px;margin:10px 0}.ds-leg i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:4px}
.ds-pl{margin:0 0 6px}.ds-pl .pvg{color:#2F7A4F}.ds-pl .pvb{color:#A3553C}.ds-pl .pvn{color:inherit;font-weight:500}.ds-days{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.ds-days span{background:#8E5714;color:#fff;border-radius:10px;padding:6px 10px;font-size:13px}
.ds-ok{background:var(--brand-soft)!important}.ds-c b,.ds-c,.ds-prof li,.ds-why li,.ds-score{color:var(--ink)}.ds-form .chk{color:var(--ink-2)}.ds-note{font-size:12.5px;color:var(--muted);margin-top:8px}.ds-warn{background:var(--accent-soft);color:var(--ink);border:1px solid var(--line-2);border-radius:12px;padding:10px 12px;margin:8px 0;font-size:13.5px}
.ds-zones{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:12px}.ds-z .ds-score{margin:8px 0 6px;font-size:13.5px}.ds-z a{color:var(--brand);font-weight:600}
.ds-match{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:16px}.ds-mi{display:grid;gap:8px}.ds-score{display:flex;align-items:center;gap:10px;font-weight:600}
.ds-bar{flex:1;height:8px;border-radius:99px;background:var(--surface-3);overflow:hidden}.ds-bar i{display:block;height:100%;background:linear-gradient(90deg,#B57A27,#1F3A5F)}
.ds-why{list-style:none;margin:0;padding:0;font-size:13px;display:grid;gap:3px}.ds-why li::before{content:attr(data-k);display:inline-block;width:16px;font-weight:700}.ds-why li[data-k="+"]::before{color:#2e7d4f}.ds-why li[data-k="!"]::before{color:#b45309}.ds-why li[data-k="~"]::before{color:#888}
.ds-focus{display:grid;grid-template-columns:minmax(0,320px) 1fr;gap:18px;align-items:start;background:var(--surface-2);border-radius:16px;padding:16px}@media(max-width:720px){.ds-focus{grid-template-columns:1fr}}
.ds-banner{margin:0 0 20px;position:relative;border-radius:18px;overflow:hidden;background:#0d1a2b}.ds-banner>img{display:block;width:100%;height:auto;aspect-ratio:1376/560;object-fit:cover;object-position:center 30%}
.ds-banner figcaption{position:absolute;left:0;right:0;bottom:0;display:flex;gap:10px;justify-content:center;padding:14px;background:linear-gradient(0deg,rgba(10,20,36,.75),rgba(10,20,36,0))}
.ds-banner figcaption span{display:grid;justify-items:center;gap:4px}.ds-banner figcaption img{width:clamp(48px,9vw,84px);height:clamp(48px,9vw,84px);object-fit:cover;border-radius:50%;border:2px solid #d9b77a;box-shadow:0 4px 14px rgba(0,0,0,.35)}
.ds-banner figcaption b{font-size:13px;color:#fff;background:var(--c);border-radius:99px;padding:1px 9px}
@media(max-width:600px){.ds-banner>img{aspect-ratio:4/3;object-position:30% 40%}.ds-banner figcaption{gap:6px;padding:8px}.ds-banner figcaption img{width:44px;height:44px}}
.ds-elc img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:10px;margin-bottom:10px}
.dsd-box{background-image:linear-gradient(135deg,color-mix(in srgb,var(--key-brand,#1F3A5F) 92%,transparent),color-mix(in srgb,var(--key-brand,#1F3A5F) 78%,transparent)),url(hai/img/destiny-hero.jpg)!important;background-size:cover!important;background-position:center 30%!important}
.ds-cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
/* type scale for the whole page (Thor 3 Nov): body 16 · secondary 15 · labels 13.5–14.5 · nothing under 13 */
.ds .lead{font-size:16.5px;line-height:1.65}.ds .ds-form label{font-size:14.5px;gap:6px}.ds .ds-form input,.ds .ds-form select{font-size:16px}.ds .ds-form .chk{font-size:14.5px}
.ds .ds-priv{font-size:14px}.ds .ds-go{font-size:15.5px}.ds .ds-c small{font-size:13.5px}.ds .ds-c em{font-size:15.5px;line-height:1.55}.ds .ds-c b{font-size:20px;line-height:1.35}
.ds .ds-el{font-size:13px;padding:3px 10px}.ds .ds-dirs span{font-size:14px;padding:5px 9px}.ds .ds-note{font-size:14.5px;line-height:1.6}.ds .ds-leg{font-size:14px}
.ds .ds-m{font-size:14.5px;padding:11px 8px}.ds .ds-m b{font-size:13.5px}.ds .ds-days span{font-size:14.5px;padding:7px 12px}.ds .ds-why{font-size:15px;gap:5px}.ds .ds-why li{line-height:1.5}
.ds .ds-score{font-size:15px}.ds .ds-warn{font-size:15px;padding:12px 14px}.ds .ds-sec>p>b{font-size:16px}.ds .ds-cta .btn{font-size:15px}
.ds .ds-prof li{font-size:16px}.ds .ds-z .ds-note{font-size:14px}
.dsd-box p{font-size:14.5px!important}.dsd-box b{font-size:16px}
.dsd-box{margin-top:14px;padding:14px 16px;border-radius:14px;background:linear-gradient(135deg,#1F3A5F,#2b4f7d);color:#fff;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between}.dsd-box p{margin:0;font-size:13.5px;opacity:.9}.dsd-box a{background:#8E5714;color:#fff;border-radius:99px;padding:9px 16px;text-decoration:none;font-weight:600;white-space:nowrap}
`;
let styled = false; const addCss = () => { if (styled) return; styled = true; const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s); };
let last = null;   // last input (memory only, never stored)
/* colour swatches for the element profile (main colours, accent colours), same order as the text */
const SWATCH = {
  water: [["#111418","#1B2A4A","#6B1E2E","#3D4247"], ["#C9A24D","#F1E3A6","#F2B179"]],
  fire:  [["#C0392B","#E67E22","#E58FA8","#7D3C98"], ["#4E8A5B","#8B5A2B"]],
  earth: [["#D8C3A5","#7B5536","#C0643A","#D4A017"], ["#B5442F","#E08A3C"]],
  air:   [["#F7F7F5","#C9CED3","#A9CCE3","#B8BCC2"], ["#F2D16B","#C9A24D"]]
};
const sw = (list, small) => `<div class="ds-sw${small ? " sm" : ""}">${list.map(h => `<i style="background:${h}" title="${h}"></i>`).join("")}</div>`;
const ELC = { water: "#2F6A9A", fire: "#B5442F", earth: "#7E5F2C", metal: "#5E6670", wood: "#3E7049", air: "#2F6F95" };
const sg = (T, x) => `${T.signs[Math.floor(x / 30)]} ${Math.floor(x % 30)}°`;

function form(T, focus) {
  const v = last || {}; const today = new Date().toISOString().slice(0, 10);
  const plus = n => { const d = new Date(); d.setMonth(d.getMonth() + n); return d.toISOString().slice(0, 10); };
  return `<form class="ds-form" id="dsForm" autocomplete="off">
    <label>${T.fName}<input name="name" maxlength="40" value="${G("esc")(v.name || "")}"></label>
    <label class="ds-wide">${T.fDate}${dp("date", v.date || "", 1920, new Date().getFullYear(), true)}</label>
    <label>${T.fTime}<input name="time" type="time" value="${v.time || ""}"></label>
    <label class="chk"><input type="checkbox" name="unk" ${v.unk ? "checked" : ""}>${T.fTimeUnk}</label>
    <label>${T.fGender}<select name="gender"><option value="m" ${v.gender === "m" ? "selected" : ""}>${T.gM}</option><option value="f" ${v.gender === "f" ? "selected" : ""}>${T.gF}</option><option value="n" ${v.gender === "n" ? "selected" : ""}>${T.gN}</option></select></label>
    <label>${T.fPlace}<select name="city">${CITIES.map(c => `<option value="${c[0]}" ${(v.city || "bkk") === c[0] ? "selected" : ""}>${(CITY_N[G("lang","th")] || {})[c[0]] || c[1]} (UTC${c[4] >= 0 ? "+" : ""}${c[4]})</option>`).join("")}</select></label>
    <label>${T.fPurpose}<select name="purpose"><option value="buy" ${v.purpose !== "rent" ? "selected" : ""}>${T.pBuy}</option><option value="rent" ${v.purpose === "rent" ? "selected" : ""}>${T.pRent}</option></select></label>
    <label class="ds-wide" data-p="buy">${T.fBuyDate}${dp("buy", v.buy || plus(1), Y0, Y0 + 4)}</label>
    <label class="ds-wide" data-p="rent">${T.fRentFrom}${dp("from", v.from || plus(1), Y0, Y0 + 4)}</label>
    <label class="ds-wide" data-p="rent">${T.fRentTo}${dp("to", v.to || plus(13), Y0, Y0 + 6)}</label>
    <label data-p="buy">${T.fBudget}<select name="bBuy">${[0, ...BUY_B, -100].map(n => `<option value="${n}" ${String(v.bBuy || 0) === String(n) ? "selected" : ""}>${!n ? T.bAny : n < 0 ? T.bOverS.replace("{n}", -n) : T.bUpS.replace("{n}", n)}</option>`).join("")}</select></label>
    <label data-p="rent">${T.fBudget}<select name="bRent">${[0, ...RENT_B].map(n => `<option value="${n}" ${String(v.bRent || 0) === String(n) ? "selected" : ""}>${!n ? T.bAny : T.bUpR.replace("{n}", n.toLocaleString("en-US"))}</option>`).join("")}</select></label>
    <label>${T.fType}<select name="type">${[["", T.tAny], ["villa", T.tVilla], ["house", T.tHouse], ["condo", T.tCondo], ["land", T.tLand]].map(([k, n]) => `<option value="${k}" ${(v.type || "") === k ? "selected" : ""}>${n}</option>`).join("")}</select></label>
    <p class="ds-priv full">🔒 ${T.privacy}</p>
    <button class="btn ds-go" type="submit">${T.go}</button>
  </form>`;
}
/* date picker: day / month / year selects; Thai shows Buddhist Era years (CE + 543), other languages CE. Value stays ISO (CE). */
const yLabel = y => (G("lang", "th") === "th" ? y + 543 : y);
const LOCS = { th: "th-TH", en: "en-GB", zh: "zh-CN", ko: "ko-KR", ja: "ja-JP", ru: "ru-RU" };
const PH = { th: ["วัน", "เดือน", "ปี พ.ศ."], en: ["Day", "Month", "Year"], zh: ["日", "月", "年"], ko: ["일", "월", "년"], ja: ["日", "月", "年"], ru: ["День", "Месяц", "Год"] };
const Y0 = new Date().getFullYear();
function dp(name, iso, y0, y1, req) {
  const lg = G("lang", "th"), ph = PH[lg] || PH.en, [y, m, d] = (iso || "").split("-").map(Number);
  const mn = i => new Intl.DateTimeFormat(LOCS[lg] || "en-GB", { month: lg === "th" || lg === "en" || lg === "ru" ? "long" : "short" }).format(new Date(2000, i, 1));
  const opt = (v, t, sel) => `<option value="${v}" ${sel ? "selected" : ""}>${t}</option>`;
  const years = []; for (let k = y1; k >= y0; k--) years.push(k); if (req) years.sort((a, b) => b - a);
  return `<span class="ds-dp" data-dp="${name}"><select data-k="d" aria-label="${ph[0]}" ${req ? "required" : ""}>${opt("", ph[0], !d)}${Array.from({ length: 31 }, (_, i) => opt(i + 1, i + 1, d === i + 1)).join("")}</select>`
    + `<select data-k="m" aria-label="${ph[1]}" ${req ? "required" : ""}>${opt("", ph[1], !m)}${Array.from({ length: 12 }, (_, i) => opt(i + 1, mn(i), m === i + 1)).join("")}</select>`
    + `<select data-k="y" aria-label="${ph[2]}" ${req ? "required" : ""}>${opt("", ph[2], !y)}${years.map(k => opt(k, yLabel(k), y === k)).join("")}</select>`
    + `<input type="hidden" name="${name}" value="${iso || ""}"></span>`;
}
function readDp(fm) { fm.querySelectorAll(".ds-dp").forEach(w => { const g = k => +w.querySelector(`[data-k="${k}"]`).value; let d = g("d"), m = g("m"), y = g("y");
  const h = w.querySelector("input[type=hidden]"); if (!d || !m || !y) { h.value = ""; return; }
  const last = new Date(y, m, 0).getDate(); if (d > last) { d = last; w.querySelector('[data-k="d"]').value = d; }
  h.value = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }); }
function sync(fm) { readDp(fm); const p = fm.purpose.value; fm.querySelectorAll("[data-p]").forEach(el => el.hidden = el.dataset.p !== p); fm.time.disabled = fm.unk.checked; }


/* recommended areas: area character vs the client's element, the area's bearing from central Pattaya vs Kua lucky
   directions, and how well the matching homes there score. Uses zone centres (and, when the Sheet gives one, a listing's
   rounded area pin) — never an exact address. */
function zones(ranked, C) {
  const Z = G("ZONES", {}), T = L(), out = [];
  const want = { water: t => t.water * .55 + t.quiet * .35 + (1 - t.city) * .1, fire: t => t.city * .4 + t.view * .4 + t.green * .2,
    earth: t => t.hill * .45 + t.green * .3 + t.quiet * .25, air: t => t.view * .5 + t.city * .3 + (t.sea || 0) * .2 }[C.thEl];
  const elZ = { water: t => t.water, wood: t => t.green, fire: t => t.city * .6 + t.view * .4, earth: t => t.hill, metal: t => t.city * .5 + t.view * .3 + .1 };
  for (const z in Z) { const t0 = ZT[z]; if (!t0 || z === "pattaya" || !Z[z].ll) continue; const t = Object.assign({ water: 0, sea: 0, lake: 0, hill: 0, green: 0, quiet: 0, city: 0, view: 0 }, t0);
    const here = ranked.filter(r => r.l.zone === z), n = here.length;
    const pins = here.map(r => r.l.area).filter(a => a && a.length === 2);
    const pt = pins.length ? [pins.reduce((s, a) => s + a[0], 0) / pins.length, pins.reduce((s, a) => s + a[1], 0) / pins.length] : Z[z].ll;
    const far = km(CENTRE, pt) > 1.2, d = far ? dir8(bearing(CENTRE, pt)) : null;
    const th = Math.max(0, Math.min(1, want(t))), bz = Math.max(elZ[C.sup[0]](t), elZ[C.sup[1]](t));
    const kd = !C.dirs || !d ? .5 : C.dirs.includes(d) ? 1 : .2;
    const top = here.slice(0, 3), ls = top.length ? top.reduce((s, r) => s + r.total, 0) / top.length / 100 : 0;
    const total = Math.round(40 * th + 20 * bz + 15 * kd + 25 * ls);
    const why = [], tr = [["sea", "zSea"], ["lake", "zLake"], ["hill", "zHill"], ["quiet", "zQuiet"], ["green", "zGreen"], ["view", "zView"], ["city", "zCity"]];
    const pref = { water: ["lake", "sea", "quiet", "green"], fire: ["city", "view", "sea", "green"], earth: ["hill", "green", "quiet", "lake"], air: ["view", "sea", "city", "hill"] }[C.thEl];
    for (const k of pref) if (t[k] >= .6) why.push(["+", T[tr.find(x => x[0] === k)[1]] || TX.en[tr.find(x => x[0] === k)[1]]]);
    if (C.thEl === "water" && t.city >= .7) why.push(["!", T.zCity || TX.en.zCity]);
    if (C.thEl === "fire" && t.quiet >= .9) why.push(["~", T.zQuiet || TX.en.zQuiet]);
    if (d && C.dirs) why.push([kd === 1 ? "+" : "~", ((kd === 1 ? T.zDirG : T.zDirB) || (kd === 1 ? TX.en.zDirG : TX.en.zDirB)).replace("{d}", T.dir[d])]);
    out.push({ z, n, top, total: Math.max(5, Math.min(99, total)), why: why.slice(0, 4) }); }
  out.sort((a, b) => (b.n > 0) - (a.n > 0) || b.total - a.total);
  return out.slice(0, 3);
}
function results(inp, focus) {
  const T = L(), C = chart(inp), lg = G("lang","th"), loc = { th: "th-TH", en: "en-GB", zh: "zh-CN", ko: "ko-KR", ja: "ja-JP", ru: "ru-RU" }[lg] || "en-GB";
  const elBadge = e => `<span class="ds-el" style="background:${ELC[e]}">${T.el[e]}</span>`;
  const yinyang = i => (i % 2 ? T.yin || "Yin" : T.yang || "Yang");
  const cards = [
    [T.sunTh, sg(T, C.sunS) + (C.cusp(C.sunS) ? " · " + (T.cusp || "") : ""), elBadge(C.thEl)],
    [T.sunWest, sg(T, C.sunT), ""],
    [T.moon, `${T.thai}: ${sg(T, C.moonS)}<br>${T.west}: ${sg(T, C.moonT)}`, C.known ? "" : `<em>${T.unknownTime || TX.en.unknownTime}</em>`],
    C.known ? [T.lagna, `${T.thai}: ${sg(T, C.asc)}`, elBadge(THAI_EL[Math.floor(C.asc / 30) % 4])] : null,
    [T.cnYear, `${T.animals[C.yb]} · ${T.el[STEM_EL[C.ys]]}`, `<em>${lg === "th" ? "พ.ศ. " + (C.cy + 543) : C.cy}</em>`],
    [T.dayMaster, `${T.el[C.dm]} (${yinyang(C.ds)})`, `<em>${(T.bzLine || TX.en.bzLine).replace("{dm}", T.el[C.dm]).replace("{sup}", C.sup.map(e => T.el[e]).join(" · "))}</em>`],
    [T.kua, C.kua ? `${C.kua} · ${(T.group || TX.en.group)[[1, 3, 4, 9].includes(C.kua) ? "E" : "W"]}` : "—",
      C.kua ? `<div class="ds-dirs">${C.dirs.map((d, i) => `<span>${(T.dirRole || TX.en.dirRole)[i]}: ${T.dir[d]}</span>`).join("")}</div>` : `<em>${T.kuaNeedG}</em>`]
  ].filter(Boolean);
  const P = (T.prof || TX.en.prof)[C.thEl];
  const PT = T;
  // matches
  let pool = (G("SHOWN") ? G("SHOWN")() : []).filter(l => l && l.code);
  if (inp.purpose === "rent") pool = pool.filter(l => l.rent && l.type !== "land"); else pool = pool.filter(l => l.sale);
  if (inp.type) pool = pool.filter(l => l.type === inp.type);
  const bB = +inp.bBuy || 0, bR = +inp.bRent || 0;
  if (inp.purpose === "rent" && bR) pool = pool.filter(l => l.rent <= bR);
  if (inp.purpose !== "rent" && bB) pool = pool.filter(l => bB < 0 ? l.sale > -bB * 1e6 : l.sale <= bB * 1e6);
  const ranked = pool.map(l => score(l, C)).sort((a, b) => b.total - a.total);
  const zr = zones(ranked, C);
  const fo = focus && G("byCode") ? G("byCode")(focus) : null, foS = fo ? score(fo, C) : null;
  const tm = timing(C, inp);
  const mName = (y, m) => new Intl.DateTimeFormat(loc, { month: "short", year: "2-digit" }).format(new Date(y, m - 1, 1));
  const dName = t => new Intl.DateTimeFormat(loc, { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(t);
  const g = ["tmBad", "tmOk", "tmGood", "tmBest"];
  const why = s => `<ul class="ds-why">${s.why.slice(0, 6).map(([k, x]) => `<li data-k="${k}">${G("esc")(x)}</li>`).join("")}</ul>`;
  const bar = s => `<div class="ds-score"><span>${s.total}% ${T.fit}</span><div class="ds-bar"><i style="width:${s.total}%"></i></div></div>`;
  const summary = [
    `${G("SITE", {}).short || ""} Destiny Match${C.name ? " — " + C.name : ""}`,
    `${TX.en.sunTh}: ${TX.en.signs[Math.floor(C.sunS / 30)]} (${TX.en.el[C.thEl]}) · Western: ${TX.en.signs[Math.floor(C.sunT / 30)]}`,
    `Chinese: ${TX.en.animals[C.yb]} ${C.cy} · Day Master ${TX.en.el[C.dm]}${C.kua ? ` · Kua ${C.kua} (${C.dirs.join(", ")})` : ""}`,
    `${inp.purpose === "rent" ? `Rent ${inp.from} → ${inp.to}${bR ? ` · ≤ ฿${bR.toLocaleString("en-US")}/mo` : ""}` : `Buy ~${inp.buy}${bB ? ` · ${bB < 0 ? ">" : "≤"} ฿${Math.abs(bB)}M` : ""}`}`,
    zr.length ? `Areas: ${zr.map(z => z.z).join(", ")}` : "",
    `Top matches: ${(foS ? [foS] : []).concat(ranked.filter(r => !fo || r.l.code !== fo.code).slice(0, 5)).map(r => `${r.l.code} ${r.total}%`).join(", ")}`,
    tm.days.length ? `Good days: ${tm.days.slice(0, 4).map(d => d.t.toISOString().slice(0, 10)).join(", ")}` : ""
  ].filter(Boolean).join("\n");
  return { html: `
  ${fo && foS ? `<section class="ds-sec"><h2>${T.focus}: ${fo.code}</h2><div class="ds-focus"><div>${G("card")(fo)}</div><div class="ds-mi">${bar(foS)}${why(foS)}</div></div></section>` : ""}
  <section class="ds-sec"><h2>${T.secChart}${C.name ? " · " + G("esc")(C.name) : ""}</h2>
    <div class="ds-cards">${cards.map(([a, b, c]) => `<div class="ds-c"><small>${a}</small><b>${b}</b>${c || ""}</div>`).join("")}</div></section>
  <section class="ds-sec"><h2>${T.secProfile}</h2>
    <div class="ds-prof">
      <div class="ds-c ds-elc"><img src="hai/img/destiny-${C.thEl}.jpg" alt="" loading="lazy"><small>${PT.pElem}</small><b>${P.core}</b>${elBadge(C.thEl)}<ul>${P.strong.map(x => `<li>${x}</li>`).join("")}</ul></div>
      <div class="ds-c"><small>${PT.pColor}</small><b>${P.color}</b>${sw(SWATCH[C.thEl][0])}<small style="margin-top:8px">${PT.pAccent}</small><em>${P.accent}</em>${sw(SWATCH[C.thEl][1], 1)}
        <small style="margin-top:8px">${PT.pDir}</small><em>${P.dir}${C.kua ? "<br>" + (T.kuaLine || TX.en.kuaLine).replace("{dirs}", C.dirs.map(d => T.dir[d]).join(", ")) : ""}</em></div>
      <div class="ds-c"><small>${PT.pAvoid}</small><ul>${P.avoid.map(x => `<li>${x}</li>`).join("")}</ul><small style="margin-top:8px">${PT.pTypes}</small><ul>${Object.values(P.types).map(x => `<li>${x}</li>`).join("")}</ul></div>
    </div></section>
  <section class="ds-sec"><h2>${T.secTiming}</h2>
    <p class="ds-note" style="margin-top:0">${inp.purpose === "rent" ? (T.tmRent || TX.en.tmRent) : (T.tmBuy || TX.en.tmBuy)}</p>
    ${tm.yrs.map(y => y.clash ? `<div class="ds-warn">⚠️ ${(T.yearClash || TX.en.yearClash).replace("{y}", lg === "th" ? y.y + 543 : y.y)}</div>` : y.good ? `<div class="ds-warn ds-ok">✨ ${(T.yearGood || TX.en.yearGood).replace("{y}", lg === "th" ? y.y + 543 : y.y)}</div>` : "").join("")}
    ${tm.pl.map(p => `<p class="ds-note ds-pl">${p.k === "jupiter" ? "♃" : "♄"} <b>${T[p.k === "jupiter" ? "plJup" : "plSat"] || TX.en[p.k === "jupiter" ? "plJup" : "plSat"]}</b> (${(T.plRef || TX.en.plRef).replace("{ref}", C.asc != null ? (T.refLagna || TX.en.refLagna) : (T.refMoon || TX.en.refMoon))}): ${p.runs.map(r => `${(T.plLine || TX.en.plLine).replace("{sign}", T.signs[r.sign]).replace("{h}", r.h)} (${p.runs.length > 1 ? (r.from === r.to ? mName(r.from.y, r.from.m) : mName(r.from.y, r.from.m) + "–" + mName(r.to.y, r.to.m)) : (T.plAll || TX.en.plAll)}) <b class="pv${r.v > 0 ? "g" : r.v < 0 ? "b" : "n"}">${r.v > 0 ? (T.plGood || TX.en.plGood) : r.v < 0 ? (T.plBad || TX.en.plBad) : (T.plOk || TX.en.plOk)}</b>`).join(" → ")}</p>`).join("")}
    <div class="ds-months">${tm.months.map(x => { const k = grade(x.s); return `<div class="ds-m g${k}"><b>${mName(x.y, x.m)}</b>${T[g[k]]}</div>`; }).join("")}</div>
    <div class="ds-leg">${[3, 2, 1, 0].map(k => `<span><i class="g${k}"></i>${T[g[k]]}</span>`).join("")}</div>
    ${tm.days.length ? `<p><b>${(T.bestDays || TX.en.bestDays).replace("{act}", inp.purpose === "rent" ? (T.actRent || TX.en.actRent) : (T.actBuy || TX.en.actBuy))}</b></p><div class="ds-days">${tm.days.map(d => `<span>${dName(d.t)}</span>`).join("")}</div>` : ""}
    <p class="ds-note">${T.tmNote || TX.en.tmNote}</p></section>
  ${zr.length ? `<section class="ds-sec"><h2>📍 ${T.secLoc}</h2><p class="ds-note" style="margin:-4px 0 14px">${T.locNote || TX.en.locNote}</p><div class="ds-zones">${zr.map((z, i) => `<div class="ds-c ds-z"><small>#${i + 1}</small><b>${G("esc")(G("zn", x => x)(z.z))}</b>${bar(z)}<ul class="ds-why">${z.why.map(([k, x]) => `<li data-k="${k}">${G("esc")(x)}</li>`).join("")}</ul>
      <p class="ds-note">${z.n ? (T.zCount || TX.en.zCount).replace("{n}", z.n) + (z.top.length ? ` · ${T.zBest || TX.en.zBest} ${z.top.map(r => `<a href="${link("listing", r.l.code)}">${r.l.code} (${r.total}%)</a>`).join(", ")}` : "") : (T.zNone || TX.en.zNone)}</p></div>`).join("")}</div></section>` : ""}
  <section class="ds-sec"><h2>${T.secMatch}</h2><p class="ds-note" style="margin:-4px 0 14px">${T.matchNote || TX.en.matchNote}</p>
    ${ranked.length ? `<div class="ds-match">${ranked.filter(r => !fo || r.l.code !== fo.code).slice(0, 9).map(r => `<div class="ds-mi">${G("card")(r.l)}${bar(r)}${why(r)}</div>`).join("")}</div>` : `<p>${T.none || TX.en.none}</p>`}
  </section>
  <section class="ds-sec"><p class="ds-note">${T.disc || TX.en.disc}</p>
    <div class="ds-cta"><a class="btn" id="dsLine" href="https://line.me/ti/p/~${encodeURIComponent(G("CONTACT",{}).line || "")}" target="_blank" rel="noopener">💬 ${T.send}</a><button class="btn sm" type="button" id="dsCopy">${T.copy}</button><span id="dsCopied" class="ds-note" hidden>${T.copied}</span></div></section>`, summary };
}

function render(focus) {
  addCss(); const T = L(), h = HOST(), dv = h && h.mount ? h.mount() : document.getElementById("detailView");
  dv.dataset.code = ""; dv.dataset.zone = ""; dv.dataset.page = "destiny"; dv.dataset.focus = focus || "";
  const fo = focus && G("byCode") ? G("byCode")(focus) : null;
  document.title = T.title + " · " + (G("SITE", {}).name || "");
  dv.innerHTML = `<div class="wrap ds"><nav class="crumb"><a href="${link("home")}">${T.back}</a>${fo ? ` · <a href="${link("listing", fo.code)}">${fo.code}</a>` : ""}</nav>
    <header class="ds-hero"><p class="eyebrow">${T.eyebrow}</p><h1>${T.title}</h1><p class="lead">${T.sub}</p></header>
    <figure class="ds-banner"><img src="hai/img/destiny-hero.jpg" alt="" width="1376" height="768" fetchpriority="high">
      <figcaption>${["water","fire","earth","air"].map(e => `<span><img src="hai/img/destiny-${e}.jpg" alt="" loading="lazy" width="120" height="120"><b style="--c:${ELC[e]}">${T.el[e]}</b></span>`).join("")}</figcaption></figure>
    ${form(T, focus)}<div id="dsOut" aria-live="polite"></div></div>`;
  const fm = document.getElementById("dsForm"); sync(fm);
  fm.addEventListener("change", () => sync(fm));
  let summary = "";
  const run = () => {
    readDp(fm); const v = Object.fromEntries(new FormData(fm).entries()); v.unk = fm.unk.checked; if (v.unk) v.time = "";
    if (!v.date) { const s = fm.querySelector('.ds-dp[data-dp="date"] select:invalid') || fm.querySelector('.ds-dp[data-dp="date"] select'); s.reportValidity ? s.reportValidity() : s.focus(); return; }
    last = v; const r = results(v, focus); summary = r.summary;
    const out = document.getElementById("dsOut"); out.innerHTML = r.html;
    out.querySelector("#dsCopy").onclick = () => { const done = () => { out.querySelector("#dsCopied").hidden = false; };
      (navigator.clipboard ? navigator.clipboard.writeText(summary) : Promise.reject()).then(done, () => { const ta = document.createElement("textarea"); ta.value = summary; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); done(); }); };
    out.querySelector(".ds-sec").scrollIntoView({ behavior: "smooth", block: "start" });
  };
  fm.addEventListener("submit", e => { e.preventDefault(); run(); });
  if (last && last.date) { const r = results(last, focus); summary = r.summary; const out = document.getElementById("dsOut"); out.innerHTML = r.html;
    out.querySelector("#dsCopy").onclick = () => { (navigator.clipboard ? navigator.clipboard.writeText(summary) : Promise.reject()).then(() => { out.querySelector("#dsCopied").hidden = false; }, () => {}); }; }
}
/* call-to-action block for a listing page */
function detailCta(code) { addCss(); const T = L(); return `<div class="dsd-box"><div><b>🔮 ${T.detailCta}</b><p>${T.detailCtaSub}</p></div><a href="${link("destiny", code)}">${T.go} →</a></div>`; }
/* nav + i18n keys merged into the site's T table */
const navT = {}; for (const k of ["th","en","zh","ko","ja","ru"]) navT[k] = { navDestiny: (TX[k] || LBL[k]).nav, dsHomeCta: (TX[k] || LBL[k]).homeCta };
window.ASND = { render, detailCta, T: navT, _test: { chart, score, timing, feat, kua, zones, parseFacing } };
})();
