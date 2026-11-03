/* ASN Destiny Match — birth chart + feng shui → matching homes and timing.
   Runs fully in the browser: birth data is never sent anywhere or stored.
   Thai astrology (sidereal, Lahiri ayanamsa) + Western (tropical) + Chinese (BaZi day master, year animal, Kua / Eight Mansions).
   Uses globals from ASNProperty.html at call time: lang, esc, card, SHOWN, byCode, HOME_STYLE, MG_EL, CONTACT, nm. */
(function () {
"use strict";
/* ---------------- astronomy (Meeus, low precision; sun ~0.01°, moon ~0.1°) ---------------- */
/* site globals are top-level let/const (not window props): resolve by name at call time */
const G = (n, d) => { try { const v = Function("return typeof " + n + " !== 'undefined' ? " + n + " : undefined")(); return v === undefined ? d : v; } catch (e) { return d; } };
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
const jdn = (y, m, d) => { const a = Math.floor((14 - m) / 12), Y = y + 4800 - a, M = m + 12 * a - 3; return d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045; };

/* ---------------- Chinese calendar helpers ---------------- */
const STEM_EL = ["wood","wood","fire","fire","earth","earth","metal","metal","water","water"];
const BR_EL = ["water","earth","wood","wood","earth","fire","fire","earth","metal","metal","earth","water"];
const MOTHER = { wood: "water", fire: "wood", earth: "fire", metal: "earth", water: "metal" };
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
  sub: "ใส่วันเดือนปีและเวลาเกิด ระบบจะผูกดวงแบบไทย สากล และจีน (ปาจื้อ · ทิศมงคลประจำตัว) แล้วจับคู่กับบ้านแต่ละหลังของ ASN พร้อมแนะนำช่วงเวลาที่เหมาะจะซื้อหรือเข้าอยู่",
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
  rFaceG: "หน้าบ้านหัน{d} — ตรงกับทิศมงคลของคุณ", rFaceB: "หน้าบ้านหัน{d} — ไม่ใช่ทิศมงคล ปรับด้วยประตูรอง/ของตกแต่งได้", rFaceU: "ทิศหน้าบ้านจริงรอยืนยันกับ ASN",
  rBz: "เสริมธาตุ{el} ที่ช่วยหนุนธาตุวันเกิดของคุณ",
  disc: "ผลนี้เป็นแนวทางเบื้องต้นตามหลักโหราศาสตร์และฮวงจุ้ยทั่วไป เพื่อช่วยคัดบ้านและคุยกับซินแส/โหร ทิศ ประตู เลขที่ และผังจริงต้องตรวจหน้างาน ปรับภายในด้วยสี แสง และเฟอร์นิเจอร์ได้ภายหลังผ่าน WIDEROOMS",
  send: "ส่งผลนี้ให้ ASN ทาง LINE", copy: "คัดลอกสรุป", copied: "คัดลอกแล้ว — วางในแชต LINE ได้เลย", back: "← กลับหน้าหลัก", detailCta: "เช็กดวงของคุณกับบ้านหลังนี้", detailCtaSub: "ใส่วันเกิด ดูว่าบ้านหลังนี้เข้ากับดวงคุณแค่ไหน และควรซื้อ/เข้าอยู่ช่วงไหน",
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
  sub: "Enter your birth date and time. We draw your Thai, Western and Chinese (BaZi · Kua) chart, match it with every ASN home and suggest the best time to buy or move in.",
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
  rFaceG: "Faces {d} — one of your lucky directions", rFaceB: "Faces {d} — not a lucky direction; balance with a side door or decor", rFaceU: "Exact front direction to be confirmed with ASN",
  rBz: "Brings {el}, which supports your Day Master",
  disc: "A first guide based on general astrology and feng shui, to help shortlist homes and talk with a feng shui master or astrologer. Directions, doors, house numbers and layout must be checked on site; interiors can be tuned later with colour, light and furniture through WIDEROOMS.",
  send: "Send this to ASN on LINE", copy: "Copy summary", copied: "Copied — paste it into the LINE chat", back: "← Back to home", detailCta: "Check this home against your birth chart", detailCtaSub: "Enter your birth date to see how well this home fits you, and when to buy or move in.",
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
/* other languages: UI labels translated, long guidance falls back to English */
const LBL = {
  zh: { nav: "命盘与风水", eyebrow: "Destiny Match · 命盘 × 风水", title: "找到与您命盘相合的房子", sub: "输入出生日期和时间，系统将排出泰式、西洋与中式（八字 · 命卦）命盘，并与 ASN 每套房源配对，同时建议买房或入住的吉时。", privacy: "出生资料仅在您的设备上计算，不会被发送或保存。", fName: "姓名（可选）", fDate: "出生日期", fTime: "出生时间", fTimeUnk: "不知道出生时间", fGender: "性别（用于计算吉方）", gM: "男", gF: "女", gN: "不透露", fPlace: "出生地", fPurpose: "目的", pBuy: "购买", pRent: "租住", fBuyDate: "计划购买/过户日期", fRentFrom: "租期自", fRentTo: "至", fType: "房产类型", tAny: "全部", tVilla: "泳池别墅", tHouse: "独栋", tCondo: "公寓", tLand: "土地", go: "分析命盘并找房", needDate: "请输入出生日期", secChart: "您的命盘", sunTh: "太阳星座（泰式 · 恒星黄道）", sunWest: "太阳星座（西洋 · 回归黄道）", moon: "月亮", lagna: "上升", cnYear: "生肖年", dayMaster: "日主（八字）", kua: "命卦与吉方", kuaNeedG: "请选择性别以计算吉方", secProfile: "适合您命盘的房子", secTiming: "吉时", tmBest: "大吉", tmGood: "吉", tmOk: "平", tmBad: "慎", secMatch: "与您命盘相合的房源", focus: "此房与您的命盘", fit: "契合", send: "通过 LINE 发送给 ASN", copy: "复制摘要", copied: "已复制，可粘贴到 LINE", back: "← 返回首页", detailCta: "用您的命盘测这套房", detailCtaSub: "输入出生日期，看看这套房与您是否相合，以及何时购买或入住最好。", homeCta: "按命盘与风水找房 →", animals: ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"], el: { wood: "木", fire: "火", earth: "土", metal: "金", water: "水", air: "风" }, dir: { N: "北", S: "南", E: "东", W: "西", NE: "东北", NW: "西北", SE: "东南", SW: "西南" }, signs: ["白羊","金牛","双子","巨蟹","狮子","处女","天秤","天蝎","射手","摩羯","水瓶","双鱼"] },
  ko: { nav: "사주 & 풍수", eyebrow: "Destiny Match · 출생차트 × 풍수", title: "나의 사주와 맞는 집 찾기", sub: "생년월일과 출생 시간을 입력하면 태국식·서양식·중국식(사주 · 본명괘) 차트를 만들어 ASN의 모든 집과 매칭하고, 구매나 입주에 좋은 시기를 알려드립니다.", privacy: "출생 정보는 사용자 기기에서만 계산되며 전송되거나 저장되지 않습니다.", fName: "이름(선택)", fDate: "생년월일", fTime: "출생 시간", fTimeUnk: "출생 시간을 모름", fGender: "성별(길한 방향 계산용)", gM: "남성", gF: "여성", gN: "밝히지 않음", fPlace: "출생지", fPurpose: "목적", pBuy: "구매", pRent: "임대", fBuyDate: "구매/등기 예정일", fRentFrom: "임대 시작", fRentTo: "종료", fType: "매물 유형", tAny: "전체", tVilla: "풀빌라", tHouse: "주택", tCondo: "콘도", tLand: "토지", go: "차트 분석 & 집 찾기", needDate: "생년월일을 입력하세요", secChart: "나의 차트", sunTh: "태양 별자리(태국 · 항성황도)", sunWest: "태양 별자리(서양 · 회귀황도)", moon: "달", lagna: "상승궁", cnYear: "띠", dayMaster: "일간(사주)", kua: "본명괘 & 길한 방향", kuaNeedG: "길한 방향을 보려면 성별을 선택하세요", secProfile: "나에게 맞는 집", secTiming: "좋은 시기", tmBest: "대길", tmGood: "길", tmOk: "보통", tmBad: "주의", secMatch: "나의 차트와 맞는 매물", focus: "이 집과 나의 차트", fit: "매칭", send: "LINE으로 ASN에 보내기", copy: "요약 복사", copied: "복사됨 — LINE 채팅에 붙여넣으세요", back: "← 홈으로", detailCta: "이 집과 나의 사주 궁합 보기", detailCtaSub: "생년월일을 입력하면 이 집이 얼마나 맞는지, 언제 사거나 입주하면 좋은지 알려드립니다.", homeCta: "사주와 풍수로 집 찾기 →", animals: ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"], el: { wood: "목", fire: "화", earth: "토", metal: "금", water: "수", air: "풍" }, dir: { N: "북", S: "남", E: "동", W: "서", NE: "북동", NW: "북서", SE: "남동", SW: "남서" }, signs: ["양자리","황소자리","쌍둥이자리","게자리","사자자리","처녀자리","천칭자리","전갈자리","사수자리","염소자리","물병자리","물고기자리"] },
  ja: { nav: "運勢と風水", eyebrow: "Destiny Match · 出生図 × 風水", title: "あなたの運勢に合う家を探す", sub: "生年月日と出生時刻を入力すると、タイ式・西洋式・中国式（四柱推命 · 本命卦）のチャートを作成し、ASN の各物件とマッチングして、購入や入居に良い時期をご提案します。", privacy: "生年月日はお使いの端末内だけで計算され、送信・保存されません。", fName: "お名前（任意）", fDate: "生年月日", fTime: "出生時刻", fTimeUnk: "出生時刻がわからない", fGender: "性別（吉方位の計算用）", gM: "男性", gF: "女性", gN: "回答しない", fPlace: "出生地", fPurpose: "目的", pBuy: "購入", pRent: "賃貸", fBuyDate: "購入・名義変更の予定日", fRentFrom: "賃貸開始", fRentTo: "終了", fType: "物件タイプ", tAny: "すべて", tVilla: "プールヴィラ", tHouse: "一戸建て", tCondo: "コンド", tLand: "土地", go: "運勢を読んで家を探す", needDate: "生年月日を入力してください", secChart: "あなたのチャート", sunTh: "太陽星座（タイ式 · サイデリアル）", sunWest: "太陽星座（西洋 · トロピカル）", moon: "月", lagna: "アセンダント", cnYear: "干支", dayMaster: "日主（四柱推命）", kua: "本命卦と吉方位", kuaNeedG: "吉方位を出すには性別を選んでください", secProfile: "あなたに合う家", secTiming: "良いタイミング", tmBest: "大吉", tmGood: "吉", tmOk: "普通", tmBad: "注意", secMatch: "あなたに合う物件", focus: "この家とあなたの運勢", fit: "相性", send: "LINE で ASN に送る", copy: "要約をコピー", copied: "コピーしました — LINE に貼り付けてください", back: "← ホームへ", detailCta: "この家とあなたの運勢をチェック", detailCtaSub: "生年月日を入れると、この家との相性と、購入・入居に良い時期がわかります。", homeCta: "運勢と風水で家を探す →", animals: ["子（ねずみ）","丑（うし）","寅（とら）","卯（うさぎ）","辰（たつ）","巳（へび）","午（うま）","未（ひつじ）","申（さる）","酉（とり）","戌（いぬ）","亥（いのしし）"], el: { wood: "木", fire: "火", earth: "土", metal: "金", water: "水", air: "風" }, dir: { N: "北", S: "南", E: "東", W: "西", NE: "北東", NW: "北西", SE: "南東", SW: "南西" }, signs: ["牡羊座","牡牛座","双子座","蟹座","獅子座","乙女座","天秤座","蠍座","射手座","山羊座","水瓶座","魚座"] },
  ru: { nav: "Судьба и фэншуй", eyebrow: "Destiny Match · Натальная карта × Фэншуй", title: "Дом, который подходит вашей карте рождения", sub: "Введите дату и время рождения: мы построим тайскую, западную и китайскую (Ба Цзы · число Гуа) карту, сопоставим её с каждым домом ASN и подскажем лучшее время для покупки или переезда.", privacy: "Данные рождения рассчитываются только на вашем устройстве и никуда не отправляются.", fName: "Имя (необязательно)", fDate: "Дата рождения", fTime: "Время рождения", fTimeUnk: "Не знаю время рождения", fGender: "Пол (для благоприятных направлений)", gM: "Мужской", gF: "Женский", gN: "Не указывать", fPlace: "Место рождения", fPurpose: "Цель", pBuy: "Купить", pRent: "Арендовать", fBuyDate: "Планируемая дата покупки", fRentFrom: "Аренда с", fRentTo: "по", fType: "Тип объекта", tAny: "Любой", tVilla: "Вилла с бассейном", tHouse: "Дом", tCondo: "Кондо", tLand: "Земля", go: "Рассчитать и подобрать дом", needDate: "Укажите дату рождения", secChart: "Ваша карта", sunTh: "Знак Солнца (тайский · сидерический)", sunWest: "Знак Солнца (западный · тропический)", moon: "Луна", lagna: "Асцендент", cnYear: "Китайский знак года", dayMaster: "Хозяин дня (Ба Цзы)", kua: "Число Гуа и направления", kuaNeedG: "Выберите пол, чтобы рассчитать направления", secProfile: "Какой дом вам подходит", secTiming: "Лучшее время", tmBest: "Отлично", tmGood: "Хорошо", tmOk: "Нейтрально", tmBad: "Осторожно", secMatch: "Дома, подходящие вашей карте", focus: "Этот дом и ваша карта", fit: "совпадение", send: "Отправить в ASN через LINE", copy: "Скопировать итог", copied: "Скопировано — вставьте в чат LINE", back: "← На главную", detailCta: "Проверить дом по вашей карте рождения", detailCtaSub: "Введите дату рождения: узнаете, насколько дом вам подходит и когда лучше покупать или въезжать.", homeCta: "Подобрать дом по карте и фэншуй →", animals: ["Крыса","Бык","Тигр","Кролик","Дракон","Змея","Лошадь","Коза","Обезьяна","Петух","Собака","Свинья"], el: { wood: "Дерево", fire: "Огонь", earth: "Земля", metal: "Металл", water: "Вода", air: "Воздух" }, dir: { N: "север", S: "юг", E: "восток", W: "запад", NE: "северо-восток", NW: "северо-запад", SE: "юго-восток", SW: "юго-запад" }, signs: ["Овен","Телец","Близнецы","Рак","Лев","Дева","Весы","Скорпион","Стрелец","Козерог","Водолей","Рыбы"] }
};
const L = () => { const l = G("lang","th"); if (TX[l]) return TX[l]; const base = TX.en; return Object.assign({}, base, LBL[l] || {}); };

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
const FACING = { H96: "E", L04: "E" };   // confirmed on site (compass); add more as ASN verifies them
function facingOf(c) { if (FACING[c]) return FACING[c]; const h = G("HOME_STYLE", {})[c]; const txt = h && h.en ? (h.en.feng || []).join(" ") + " " + (h.en.concept || "") : "";
  const m = txt.match(/\b(?:house|home|villa|front|door|it)\s+faces\s+(?:due\s+)?(north|south|east|west)(?:-(east|west))?\b/i); if (!m) return null;
  const k = (m[1][0] + (m[2] ? m[2][0] : "")).toUpperCase(); return DIR_EL[k] ? k : null; }
function feat(l) {
  const h = G("HOME_STYLE",{})[l.code], tx = h && h.en ? ((h.en.concept || "") + " " + (h.en.feng || []).join(" ")).toLowerCase() : "", tags = l.tags || [];
  const f = { water: 0, privacy: 0, open: 0, view: 0, garden: 0, earth: 0, metal: 0, fire: 0, pal: {}, facing: facingOf(l.code), flags: [] };
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
function monthScore(C, y, m) {
  const J = jdUT(y, m, 15, 5), mb = monthBranch(J), cy = cnYear(y, m, J), ybr = md(cy - 4, 12);
  let s = branchRel(mb, C.yb) * 1.2 + branchRel(mb, C.db) * 0.6 + (CLASH(ybr, C.yb) ? -1 : 0) + (branchRel(ybr, C.yb) > 1 ? 0.5 : 0);
  const rel = md(Math.floor(norm(sunLon(J) - ayan(J)) / 30) - Math.floor(C.sunS / 30), 12);   // sun transit house from natal sun
  if ([0, 4, 8].includes(rel)) s += 1; else if ([5, 7, 11].includes(rel)) s -= 0.7; else if (rel === 6) s -= 0.3;
  return s; }
const grade = s => s >= 2 ? 3 : s >= 0.8 ? 2 : s >= -0.5 ? 1 : 0;
function timing(C, inp) {
  const months = [];
  let start, end;
  if (inp.purpose === "rent") { start = new Date(inp.from || Date.now()); end = new Date(inp.to || (start.getTime() + 365 * 864e5)); if (end < start) end = new Date(start.getTime() + 365 * 864e5); }
  else { start = new Date(inp.buy || Date.now()); end = new Date(start.getFullYear(), start.getMonth() + 11, 1); }
  for (let y = start.getFullYear(), m = start.getMonth() + 1, i = 0; i < 24; i++) {
    if (new Date(y, m - 1, 1) > end) break;
    months.push({ y, m, s: monthScore(C, y, m) }); m++; if (m > 12) { m = 1; y++; } }
  // best days: inside the first 2 months of the window, good month + good day
  const days = []; const from = new Date(start); const until = new Date(Math.min(end.getTime(), from.getTime() + 75 * 864e5));
  for (let t = new Date(from); t <= until; t = new Date(t.getTime() + 864e5)) {
    const ds = dayScore(C, t); if (ds > 1.5) days.push({ t: new Date(t), s: ds + monthScore(C, t.getFullYear(), t.getMonth() + 1) * 0.5 }); }
  days.sort((a, b) => b.s - a.s);
  const yrs = [...new Set(months.map(x => x.y))].map(y => { const ybr = md(y - 4, 12); return { y, clash: CLASH(ybr, C.yb), good: branchRel(ybr, C.yb) > 1 }; });
  return { months, days: days.slice(0, 6).sort((a, b) => a.t - b.t), yrs };
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
.ds-prof{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:12px}.ds-prof ul{margin:6px 0 0 18px}.ds-prof li{margin:3px 0}
.ds-months{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px}.ds-m{border-radius:12px;padding:10px;text-align:center;font-size:13px}.ds-m b{display:block;font-size:12px;opacity:.85}
.g3{background:#1F3A5F;color:#fff}.g2{background:var(--brand-soft);color:var(--ink)}.g1{background:var(--surface-3);color:var(--ink-2)}.g0{background:#f3d9cf;color:#8a3b22}:root[data-theme="dark"] .g3{background:#E2A957;color:#0E131A}:root[data-theme="dark"] .g2{background:#2f5d8f;color:#fff}:root[data-theme="dark"] .g0{background:#4a2a20;color:#f3c9b8}@media(prefers-color-scheme:dark){:root:not([data-theme="light"]) .g3{background:#E2A957;color:#0E131A}:root:not([data-theme="light"]) .g2{background:#2f5d8f;color:#fff}:root:not([data-theme="light"]) .g0{background:#4a2a20;color:#f3c9b8}}
.ds-leg{display:flex;flex-wrap:wrap;gap:10px;font-size:12.5px;margin:10px 0}.ds-leg i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:4px}
.ds-days{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.ds-days span{background:#8E5714;color:#fff;border-radius:10px;padding:6px 10px;font-size:13px}
.ds-ok{background:var(--brand-soft)!important}.ds-c b,.ds-c,.ds-prof li,.ds-why li,.ds-score{color:var(--ink)}.ds-form .chk{color:var(--ink-2)}.ds-note{font-size:12.5px;color:var(--muted);margin-top:8px}.ds-warn{background:var(--accent-soft);color:var(--ink);border:1px solid var(--line-2);border-radius:12px;padding:10px 12px;margin:8px 0;font-size:13.5px}
.ds-match{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:16px}.ds-mi{display:grid;gap:8px}.ds-score{display:flex;align-items:center;gap:10px;font-weight:600}
.ds-bar{flex:1;height:8px;border-radius:99px;background:var(--surface-3);overflow:hidden}.ds-bar i{display:block;height:100%;background:linear-gradient(90deg,#B57A27,#1F3A5F)}
.ds-why{list-style:none;margin:0;padding:0;font-size:13px;display:grid;gap:3px}.ds-why li::before{content:attr(data-k);display:inline-block;width:16px;font-weight:700}.ds-why li[data-k="+"]::before{color:#2e7d4f}.ds-why li[data-k="!"]::before{color:#b45309}.ds-why li[data-k="~"]::before{color:#888}
.ds-focus{display:grid;grid-template-columns:minmax(0,320px) 1fr;gap:18px;align-items:start;background:var(--surface-2);border-radius:16px;padding:16px}@media(max-width:720px){.ds-focus{grid-template-columns:1fr}}
.ds-banner{margin:0 0 20px;position:relative;border-radius:18px;overflow:hidden;background:#0d1a2b}.ds-banner>img{display:block;width:100%;height:auto;aspect-ratio:1376/560;object-fit:cover;object-position:center 30%}
.ds-banner figcaption{position:absolute;left:0;right:0;bottom:0;display:flex;gap:10px;justify-content:center;padding:14px;background:linear-gradient(0deg,rgba(10,20,36,.75),rgba(10,20,36,0))}
.ds-banner figcaption span{display:grid;justify-items:center;gap:4px}.ds-banner figcaption img{width:clamp(48px,9vw,84px);height:clamp(48px,9vw,84px);object-fit:cover;border-radius:50%;border:2px solid #d9b77a;box-shadow:0 4px 14px rgba(0,0,0,.35)}
.ds-banner figcaption b{font-size:12px;color:#fff;background:var(--c);border-radius:99px;padding:1px 9px}
@media(max-width:600px){.ds-banner>img{aspect-ratio:4/3;object-position:30% 40%}.ds-banner figcaption{gap:6px;padding:8px}.ds-banner figcaption img{width:44px;height:44px}}
.ds-elc img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:10px;margin-bottom:10px}
.dsd-box{background-image:linear-gradient(135deg,rgba(31,58,95,.92),rgba(31,58,95,.78)),url(asn-img/destiny-hero.jpg)!important;background-size:cover!important;background-position:center 30%!important}
.ds-cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
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
    <label>${T.fPlace}<select name="city">${CITIES.map(c => `<option value="${c[0]}" ${(v.city || "bkk") === c[0] ? "selected" : ""}>${c[1]} (UTC${c[4] >= 0 ? "+" : ""}${c[4]})</option>`).join("")}</select></label>
    <label>${T.fPurpose}<select name="purpose"><option value="buy" ${v.purpose !== "rent" ? "selected" : ""}>${T.pBuy}</option><option value="rent" ${v.purpose === "rent" ? "selected" : ""}>${T.pRent}</option></select></label>
    <label class="ds-wide" data-p="buy">${T.fBuyDate}${dp("buy", v.buy || plus(1), Y0, Y0 + 4)}</label>
    <label class="ds-wide" data-p="rent">${T.fRentFrom}${dp("from", v.from || plus(1), Y0, Y0 + 4)}</label>
    <label class="ds-wide" data-p="rent">${T.fRentTo}${dp("to", v.to || plus(13), Y0, Y0 + 6)}</label>
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
  const P = (TX[lg] || TX.en).prof ? (TX[lg] || TX.en).prof[C.thEl] : TX.en.prof[C.thEl];
  const PT = TX[lg] && TX[lg].prof ? TX[lg] : TX.en;
  // matches
  let pool = (G("SHOWN") ? G("SHOWN")() : []).filter(l => l && l.code);
  if (inp.purpose === "rent") pool = pool.filter(l => l.rent && l.type !== "land"); else pool = pool.filter(l => l.sale);
  if (inp.type) pool = pool.filter(l => l.type === inp.type);
  const ranked = pool.map(l => score(l, C)).sort((a, b) => b.total - a.total);
  const fo = focus && G("byCode") ? G("byCode")(focus) : null, foS = fo ? score(fo, C) : null;
  const tm = timing(C, inp);
  const mName = (y, m) => new Intl.DateTimeFormat(loc, { month: "short", year: "2-digit" }).format(new Date(y, m - 1, 1));
  const dName = t => new Intl.DateTimeFormat(loc, { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(t);
  const g = ["tmBad", "tmOk", "tmGood", "tmBest"];
  const why = s => `<ul class="ds-why">${s.why.slice(0, 6).map(([k, x]) => `<li data-k="${k}">${G("esc")(x)}</li>`).join("")}</ul>`;
  const bar = s => `<div class="ds-score"><span>${s.total}% ${T.fit}</span><div class="ds-bar"><i style="width:${s.total}%"></i></div></div>`;
  const summary = [
    `ASN Destiny Match${C.name ? " — " + C.name : ""}`,
    `${TX.en.sunTh}: ${TX.en.signs[Math.floor(C.sunS / 30)]} (${TX.en.el[C.thEl]}) · Western: ${TX.en.signs[Math.floor(C.sunT / 30)]}`,
    `Chinese: ${TX.en.animals[C.yb]} ${C.cy} · Day Master ${TX.en.el[C.dm]}${C.kua ? ` · Kua ${C.kua} (${C.dirs.join(", ")})` : ""}`,
    `${inp.purpose === "rent" ? `Rent ${inp.from} → ${inp.to}` : `Buy ~${inp.buy}`}`,
    `Top matches: ${(foS ? [foS] : []).concat(ranked.filter(r => !fo || r.l.code !== fo.code).slice(0, 5)).map(r => `${r.l.code} ${r.total}%`).join(", ")}`,
    tm.days.length ? `Good days: ${tm.days.slice(0, 4).map(d => d.t.toISOString().slice(0, 10)).join(", ")}` : ""
  ].filter(Boolean).join("\n");
  return { html: `
  ${fo && foS ? `<section class="ds-sec"><h2>${T.focus}: ${fo.code}</h2><div class="ds-focus"><div>${G("card")(fo)}</div><div class="ds-mi">${bar(foS)}${why(foS)}</div></div></section>` : ""}
  <section class="ds-sec"><h2>${T.secChart}${C.name ? " · " + G("esc")(C.name) : ""}</h2>
    <div class="ds-cards">${cards.map(([a, b, c]) => `<div class="ds-c"><small>${a}</small><b>${b}</b>${c || ""}</div>`).join("")}</div></section>
  <section class="ds-sec"><h2>${T.secProfile}</h2>
    <div class="ds-prof">
      <div class="ds-c ds-elc"><img src="asn-img/destiny-${C.thEl}.jpg" alt="" loading="lazy"><small>${PT.pElem}</small><b>${P.core}</b>${elBadge(C.thEl)}<ul>${P.strong.map(x => `<li>${x}</li>`).join("")}</ul></div>
      <div class="ds-c"><small>${PT.pColor}</small><b style="font-size:16px">${P.color}</b>${sw(SWATCH[C.thEl][0])}<small style="margin-top:8px">${PT.pAccent}</small><em>${P.accent}</em>${sw(SWATCH[C.thEl][1], 1)}
        <small style="margin-top:8px">${PT.pDir}</small><em>${P.dir}${C.kua ? "<br>" + (T.kuaLine || TX.en.kuaLine).replace("{dirs}", C.dirs.map(d => T.dir[d]).join(", ")) : ""}</em></div>
      <div class="ds-c"><small>${PT.pAvoid}</small><ul>${P.avoid.map(x => `<li>${x}</li>`).join("")}</ul><small style="margin-top:8px">${PT.pTypes}</small><ul>${Object.values(P.types).map(x => `<li>${x}</li>`).join("")}</ul></div>
    </div></section>
  <section class="ds-sec"><h2>${T.secTiming}</h2>
    <p class="ds-note" style="margin-top:0">${inp.purpose === "rent" ? (T.tmRent || TX.en.tmRent) : (T.tmBuy || TX.en.tmBuy)}</p>
    ${tm.yrs.map(y => y.clash ? `<div class="ds-warn">⚠️ ${(T.yearClash || TX.en.yearClash).replace("{y}", lg === "th" ? y.y + 543 : y.y)}</div>` : y.good ? `<div class="ds-warn ds-ok">✨ ${(T.yearGood || TX.en.yearGood).replace("{y}", lg === "th" ? y.y + 543 : y.y)}</div>` : "").join("")}
    <div class="ds-months">${tm.months.map(x => { const k = grade(x.s); return `<div class="ds-m g${k}"><b>${mName(x.y, x.m)}</b>${T[g[k]]}</div>`; }).join("")}</div>
    <div class="ds-leg">${[3, 2, 1, 0].map(k => `<span><i class="g${k}"></i>${T[g[k]]}</span>`).join("")}</div>
    ${tm.days.length ? `<p><b>${(T.bestDays || TX.en.bestDays).replace("{act}", inp.purpose === "rent" ? (T.actRent || TX.en.actRent) : (T.actBuy || TX.en.actBuy))}</b></p><div class="ds-days">${tm.days.map(d => `<span>${dName(d.t)}</span>`).join("")}</div>` : ""}
    <p class="ds-note">${T.tmNote || TX.en.tmNote}</p></section>
  <section class="ds-sec"><h2>${T.secMatch}</h2><p class="ds-note" style="margin:-4px 0 14px">${T.matchNote || TX.en.matchNote}</p>
    ${ranked.length ? `<div class="ds-match">${ranked.filter(r => !fo || r.l.code !== fo.code).slice(0, 9).map(r => `<div class="ds-mi">${G("card")(r.l)}${bar(r)}${why(r)}</div>`).join("")}</div>` : `<p>${T.none || TX.en.none}</p>`}
  </section>
  <section class="ds-sec"><p class="ds-note">${T.disc || TX.en.disc}</p>
    <div class="ds-cta"><a class="btn" id="dsLine" href="https://line.me/ti/p/~${encodeURIComponent(G("CONTACT",{}).line || "")}" target="_blank" rel="noopener">💬 ${T.send}</a><button class="btn sm" type="button" id="dsCopy">${T.copy}</button><span id="dsCopied" class="ds-note" hidden>${T.copied}</span></div></section>`, summary };
}

function render(focus) {
  addCss(); const T = L(), dv = document.getElementById("detailView");
  dv.dataset.code = ""; dv.dataset.zone = ""; dv.dataset.page = "destiny"; dv.dataset.focus = focus || "";
  const fo = focus && G("byCode") ? G("byCode")(focus) : null;
  document.title = T.title + " · ASN Exclusive Property";
  dv.innerHTML = `<div class="wrap ds"><nav class="crumb"><a href="#/">${T.back}</a>${fo ? ` · <a href="#/l/${fo.code}">${fo.code}</a>` : ""}</nav>
    <header class="ds-hero"><p class="eyebrow">${T.eyebrow}</p><h1>${T.title}</h1><p class="lead">${T.sub}</p></header>
    <figure class="ds-banner"><img src="asn-img/destiny-hero.jpg" alt="" width="1376" height="768" fetchpriority="high">
      <figcaption>${["water","fire","earth","air"].map(e => `<span><img src="asn-img/destiny-${e}.jpg" alt="" loading="lazy" width="120" height="120"><b style="--c:${ELC[e]}">${T.el[e]}</b></span>`).join("")}</figcaption></figure>
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
function detailCta(code) { addCss(); const T = L(); return `<div class="dsd-box"><div><b>🔮 ${T.detailCta}</b><p>${T.detailCtaSub}</p></div><a href="#/destiny/${encodeURIComponent(code)}">${T.go} →</a></div>`; }
/* nav + i18n keys merged into the site's T table */
const navT = {}; for (const k of ["th","en","zh","ko","ja","ru"]) navT[k] = { navDestiny: (TX[k] || LBL[k]).nav, dsHomeCta: (TX[k] || LBL[k]).homeCta };
window.ASND = { render, detailCta, T: navT, _test: { chart, score, timing, feat, kua } };
})();
