/* Thailand Living Insight — property kit.
   Blocks a property page drops in to bring the guide's key points onto each listing:
     LIKit.home(el, o)   wellness tips for this home + a smart-home kit set by MBTI group (WIDEROOMS)
     LIKit.buy(el, o)    buyer-confidence cards (quota, money in, Thai fee cut, visa, letting)
     LIKit.strip(el, o)  four "why now" figures for a list or home page
     LIKit.types(el, o)  the four MBTI groups and their smart-home style, for a matching page
   Common options: lang (th en ru zh ko ja), from (guide key, e.g. "r2"), accent (CSS colour),
   wrLogo (path to the WIDEROOMS logo on the host), groupName(g) (host's own MBTI group names),
   wr: false (home: leave out the WIDEROOMS row when the host page already has one nearby).
   The host supplies the section wrapper and its own <h2> styling; the kit writes the inside.
   Facts match content.js (checked 27 Oct 2026); update both together. */
(function () {
"use strict";

const LANGS = ["th", "en", "ru", "zh", "ko", "ja"];
const WR_URL = "https://thbho.github.io/EngWiderooms.html";
const GUIDE = { hub: "LivingInsight.html", wellness: "LivingInsight-Wellness.html", smarthome: "LivingInsight-SmartHome.html",
  relocate: "LivingInsight-Relocate.html", eec: "LivingInsight-EEC.html", buying: "LivingInsight-Buying.html" };
const GROUP_COLOR = { an: "#88619A", di: "#33A474", se: "#4298B4", ex: "#D9A032" };
const GROUP_TYPES = { an: ["INTJ", "INTP", "ENTJ", "ENTP"], di: ["INFJ", "INFP", "ENFJ", "ENFP"],
  se: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"], ex: ["ISTP", "ISFP", "ESTP", "ESFP"] };
const groupOf = x => Object.keys(GROUP_TYPES).find(g => GROUP_TYPES[g].includes(x));
// price ranges (THB) match the budget builder in content.js
const SHOW_PRICES = false; // THOR 27 Oct 2026: hide smart-home device prices on property pages for now
const ITEMS = { lock: [6000, 18000], hub: [1500, 5000], ac: [600, 1800], plugs: [900, 2400], air: [1500, 5000],
  purifier: [4000, 15000], bulbs: [1600, 4800], curtain: [3500, 9000], leak: [2500, 7000], wifi: [2500, 8000], filter: [4000, 12000] };
const KIT = { an: ["hub", "ac", "plugs", "air", "bulbs"], di: ["hub", "bulbs", "curtain", "purifier", "filter"],
  se: ["lock", "hub", "ac", "leak", "plugs"], ex: ["lock", "hub", "bulbs", "curtain", "wifi"] };
const THAI_FEE_CAP = 7000000; // the 0.01% transfer-fee cut covers homes up to ฿7M, until 30 Jun 2027

const IC = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  wind: '<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h16a3 3 0 1 1-3 3"/><path d="M3 16h7"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  home: '<path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/>',
  doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M9 9.5c0-1 1.3-2 3-2s3 .8 3 2-1.5 1.7-3 2-3 .8-3 2 1.3 2 3 2 3-1 3-2M12 5v2M12 17v2"/>',
  plane: '<path d="M2 16l20-8-6 12-3-5-5 3z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
  leaf: '<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19l7-7"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>',
  wellness: '<path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"/><path d="M8.5 12h2l1-2 2 4 1-2h1"/>',
  smarthome: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><circle cx="12" cy="14" r="2"/><path d="M8.5 11.5a5 5 0 0 1 7 0"/>',
  eec: '<path d="M3 21h18"/><path d="M5 21V9l5-3v15"/><path d="M10 21V4l9 5v12"/><path d="M14 12h2M14 16h2"/>',
  buying: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>'
};
const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;

/* ------------------------------------------------------------- strings */
const S = {
th: {
  thisC: "ห้องนี้", thisH: "บ้านนี้",
  homeH: "อยู่แล้วสุขภาพดี: Wellness & Smart Home",
  homeP: "สรุปจากคู่มือ Thailand Living Insight ให้ตรงกับลักษณะของที่นี่และบุคลิกที่เข้ากัน ทุกข้อทำได้โดยไม่ต้องรีโนเวตใหญ่",
  lightW: ["แดดบ่ายและพระอาทิตย์ตก", "ฝั่งทะเลหันทิศตะวันตก ได้วิวพระอาทิตย์ตก แต่แดดบ่ายแรง ม่านสองชั้นหรือม่านไฟฟ้าที่ปิดเองตอนบ่าย ช่วยให้ห้องเย็นและลดค่าแอร์"],
  lightE: ["แสงเช้าช่วยตั้งนาฬิกาชีวิต", "ห้องหันทิศตะวันออก รับแดดเช้าซึ่งช่วยให้ตื่นตัวและหลับง่ายขึ้นตอนกลางคืน ถ้าชอบนอนสาย ใช้ม่านทึบแสงในห้องนอน"],
  lightX: ["แสงตามนาฬิกาชีวิต", "กลางวันใช้แสงขาว 4000–5000K กลางคืนใช้แสงวอร์ม 2700K หลอดอัจฉริยะปรับสีเองตามเวลาได้"],
  airSea: ["ลมทะเลกับความชื้น", "ลมทะเลช่วยให้อากาศถ่ายเท แต่ความชื้นริมทะเลทำให้เกิดเชื้อราได้ เครื่องวัดความชื้นและ PM2.5 แจ้งเตือนเข้ามือถือ และช่วง ม.ค.–เม.ย. ยังมีฝุ่นควัน"],
  airX: ["อากาศสะอาด", "ค่า PM2.5 เฉลี่ยของไทยปี 2025 สูงกว่าเกณฑ์ WHO 3.6 เท่า หนักสุดช่วง ม.ค.–เม.ย. เครื่องฟอกอากาศที่มีเซนเซอร์ช่วยได้มาก"],
  sleepHi: ["ชั้น {f}: สูงพ้นเสียงถนน", "ห้องนอนเงียบ ตั้งแอร์ 25–26°C ร่วมกับพัดลม หลับลึกกว่าและประหยัดไฟกว่าเปิดเย็นจัด"],
  sleepLo: ["ชั้น {f}: ฟังเสียงจริงก่อนตัดสินใจ", "ลองมาดูห้องตอนกลางคืนสักครั้ง ม่านหนาช่วยลดเสียงได้ ตั้งแอร์ 25–26°C ร่วมกับพัดลมเพื่อการนอนที่ลึกขึ้น"],
  sleepHouse: ["บ้านเย็น นอนสบาย", "บ้านรับแดดหลายด้าน ฉนวนหลังคา ม่านกันแดด และแอร์อินเวอร์เตอร์ตั้ง 25–26°C ช่วยทั้งการนอนและค่าไฟ"],
  bridge: "ฮวงจุ้ยกับวิทยาศาสตร์ Wellness พูดเรื่องเดียวกันหลายข้อ: แสงธรรมชาติ ลมที่ไหลเวียน และทางเดินที่โล่ง",
  kitH: "Smart Home ตามบุคลิก",
  kitFor: "จัดให้ตามบุคลิกที่เข้ากับที่นี่ ({type}) เลือกกลุ่มของคุณเพื่อเทียบได้",
  kitPick: "เลือกกลุ่มบุคลิกของคุณ",
  g: { an: "นักวิเคราะห์ (NT)", di: "นักการทูต (NF)", se: "ผู้พิทักษ์ (SJ)", ex: "นักสำรวจ (SP)" },
  k: {
    an: ["บ้านที่คิดแทนคุณ", "สาย NT ชอบระบบที่มีเหตุผลและวัดผลได้ ตั้ง Automation ครั้งเดียว แล้วดูค่าไฟและคุณภาพอากาศเป็นตัวเลข"],
    di: ["บ้านที่ช่วยให้ใจสงบ", "สาย NF ให้ความสำคัญกับความรู้สึก แสงที่เปลี่ยนตามเวลา อากาศและน้ำที่สะอาด และม่านที่ปิดเองตอนพักผ่อน"],
    se: ["บ้านที่ปลอดภัยและเป็นระเบียบ", "สาย SJ ชอบความแน่นอน กลอนดิจิทัล เซนเซอร์น้ำรั่ว และตารางเปิดปิดแอร์ที่ทำงานตรงเวลาทุกวัน"],
    ex: ["บ้านที่พร้อมเที่ยวและสังสรรค์", "สาย SP ใช้ชีวิตเต็มที่ กดปุ่มเดียวเปลี่ยนเป็นโหมดปาร์ตี้หรือโหมดดูหนัง ส่งรหัสประตูให้เพื่อน และดูแลบ้านจากมือถือตอนเดินทาง"]
  },
  it: {
    lock: ["กลอนประตูดิจิทัล", "รหัสชั่วคราวให้แขก แม่บ้าน หรือผู้เช่า"], hub: ["ฮับ Matter / Thread", "ศูนย์กลางที่ทำให้อุปกรณ์ทำงานร่วมกัน"],
    ac: ["ตัวควบคุมแอร์ Wi-Fi ×{n}", "ตั้งเวลา และเปิดก่อนถึงบ้าน"], plugs: ["ปลั๊กวัดไฟ ×3", "ดูว่าเครื่องไหนกินไฟ"],
    air: ["เครื่องวัด PM2.5 / CO₂ / ความชื้น", "แจ้งเตือนเข้ามือถือ"], purifier: ["เครื่องฟอกอากาศมีเซนเซอร์", "ขนาดตามพื้นที่ห้อง"],
    bulbs: ["หลอดไฟปรับสี ×4", "แสงตามนาฬิกาชีวิต"], curtain: ["มอเตอร์ม่าน 1 ราง", "ปิดเองตอนแดดแรง"],
    leak: ["เซนเซอร์น้ำรั่ว + วาล์วตัดน้ำ", "ห้องน้ำและใต้ซิงก์"], wifi: ["Mesh Wi-Fi", "แยกเครือข่ายแขกกับอุปกรณ์"],
    filter: ["เครื่องกรองน้ำใต้ซิงก์", "RO หรือ UF"]
  },
  addW: "เพิ่มเพราะรับแดดบ่าย", addSea: "เพิ่มเพราะความชื้นริมทะเล",
  total: "งบอุปกรณ์โดยประมาณ",
  kitNote: "ราคาประมาณจากร้านค้าในไทย ต.ค. 2026 ไม่รวมค่าติดตั้ง ไม่ใช่ใบเสนอราคา",
  honest: "การจับคู่ตามบุคลิกเป็นจุดเริ่มต้นของการคุยออกแบบ ไม่ใช่ผลการวิจัย",
  wrNone: "{this}ขายแบบไม่รวมเฟอร์นิเจอร์ WIDEROOMS ออกแบบตกแต่งตามคอนเซปต์ {concept} พร้อมติดตั้ง Smart Home ได้ในงานเดียว",
  wrNoneX: "{this}ขายแบบไม่รวมเฟอร์นิเจอร์ WIDEROOMS ออกแบบ ตกแต่ง และติดตั้ง Smart Home ให้ได้ในงานเดียว",
  wrHas: "{this}มีเฟอร์นิเจอร์แล้ว WIDEROOMS ติดตั้ง Smart Home เพิ่มได้โดยไม่ต้องรื้อ และปรับโทนให้เข้ากับบุคลิกของคุณ",
  wrRent: "เช่าอยู่ก็ทำได้: เลือกอุปกรณ์แบบไม่ต้องเจาะที่ย้ายไปบ้านใหม่ได้ (ขออนุญาตเจ้าของก่อนเปลี่ยนกลอนหรือเดินท่อ) WIDEROOMS ช่วยเลือกและติดตั้งให้",
  wrBtn: "ให้ WIDEROOMS ออกแบบและติดตั้ง",
  lkKit: "ปรับแพ็กเกจเอง", lkScore: "เช็กคะแนน Wellness ตอนดูห้อง",
  buyH: "ซื้ออย่างมั่นใจ",
  buyP: "กฎและภาษีล่าสุดที่เกี่ยวกับทรัพย์นี้ ตรวจสอบเมื่อ {date} แหล่งอ้างอิงอยู่ในคู่มือ",
  rentH: "ย้ายมาอยู่อย่างมั่นใจ",
  rentP: "เรื่องที่ควรรู้ก่อนเช่าอยู่ระยะยาว ตรวจสอบเมื่อ {date} แหล่งอ้างอิงอยู่ในคู่มือ",
  date: "27 ต.ค. 2026",
  fr: ["โควตาต่างชาติ: ชื่อคุณบนหนังสือกรรมสิทธิ์", "ห้องนี้อยู่ในโควตาต่างชาติ (49% ของอาคาร) ชาวต่างชาติถือกรรมสิทธิ์แบบ Freehold ได้ ขายต่อหรือตกทอดได้"],
  fet: ["โอนเงินจากต่างประเทศให้ถูกวิธี", "โอนเข้ามาเป็นเงินตราต่างประเทศ ธนาคารออกเอกสาร FET สำหรับยอดตั้งแต่ US$50,000 เก็บตัวจริงไว้ใช้วันโอนและตอนขายต่อ"],
  thb: ["ผู้ซื้อคนไทย: ค่าโอนเหลือ 0.01%", "มาตรการรัฐสำหรับที่อยู่อาศัยราคาไม่เกิน ฿7 ล้าน ลดค่าธรรมเนียมโอนจาก 2% เหลือ 0.01% ถึง 30 มิ.ย. 2027 ถามทีมขายว่าทรัพย์นี้ได้สิทธิ์อย่างไร"],
  thb7: ["ผู้ซื้อคนไทย", "มาตรการลดค่าโอนเหลือ 0.01% ใช้กับที่อยู่อาศัยราคาไม่เกิน ฿7 ล้าน ทรัพย์นี้ราคาเกินเกณฑ์ จึงใช้อัตราปกติ 2% แบ่งจ่ายตามที่ตกลง"],
  thq: ["ชาวต่างชาติ: ห้องนี้อยู่ในโควตาไทย", "ชาวต่างชาติถือแบบ Freehold ไม่ได้ ทางเลือกคือจดทะเบียนเช่าระยะยาว (สูงสุด 30 ปี) ให้คู่สมรสคนไทยถือ หรือเลือกห้องในโควตาต่างชาติ"],
  q: ["ชาวต่างชาติ: เช็กโควตาก่อนจอง", "ชาวต่างชาติซื้อได้เฉพาะห้องในโควตาต่างชาติ 49% ของอาคาร ทีมงานเช็กโควตาให้ก่อนวางเงินจอง"],
  land: ["ชาวต่างชาติกับบ้านและที่ดิน", "ชาวต่างชาติถือที่ดินไม่ได้ ทางที่ถูกกฎหมายคือเช่าที่ดินจดทะเบียน 30 ปีและเป็นเจ้าของตัวบ้าน การถือผ่านชื่อคนไทยหรือบริษัทนอมินีผิดกฎหมาย"],
  visa: ["ซื้อบ้านไม่ได้มาพร้อมวีซ่า", "ฟรีวีซ่าลดเหลือ 30 วันตั้งแต่ 15 ก.ย. 2026 ใครจะอยู่ยาวควรดู DTV, LTR, Thailand Privilege หรือวีซ่าเกษียณ ตัวช่วยเลือกวีซ่าใช้เวลาไม่ถึง 1 นาที"],
  visaR: ["วางแผนวีซ่าก่อนเซ็นสัญญา", "ฟรีวีซ่าลดเหลือ 30 วันตั้งแต่ 15 ก.ย. 2026 ใครจะอยู่ยาวควรดู DTV, LTR, Thailand Privilege หรือวีซ่าเกษียณ ตัวช่วยเลือกวีซ่าใช้เวลาไม่ถึง 1 นาที"],
  rent: ["ปล่อยเช่าให้ถูกกฎหมาย", "คอนโดปล่อยเช่าได้ขั้นต่ำ 30 วัน การเช่ารายวันต้องมีใบอนุญาตโรงแรม และคอนโดส่วนใหญ่ห้ามไว้ในข้อบังคับ"],
  life: ["ค่าครองชีพพัทยา–จอมเทียน", "คนเดียวไม่รวมค่าเช่า ราว ฿20,000–25,000 ต่อเดือน แบบสบาย ๆ ราว ฿38,000–51,000 ผู้เช่าระยะยาวต้องให้เจ้าของแจ้ง TM30"],
  lkBuy: "คู่มือซื้อ + คำนวณค่าใช้จ่ายวันโอน", lkVisa: "ตัวช่วยเลือกวีซ่า", lkLife: "ย้ายมาอยู่ไทย: วีซ่าและค่าครองชีพ",
  buyNote: "ข้อมูลทั่วไป ไม่ใช่คำแนะนำทางกฎหมายหรือภาษี ตรวจสอบกับทนายหรือสำนักงานที่ดินก่อนทำสัญญา",
  stripH: "ทำไมชายฝั่งตะวันออก ตอนนี้",
  stripP: "4 ตัวเลขจากคู่มือ Thailand Living Insight ทุกตัวมีแหล่งอ้างอิง ตรวจสอบเมื่อ {date}",
  s1: ["3 เม.ย. 2026", "สนามบินอู่ตะเภาเริ่มก่อสร้างตามสัมปทาน 50 ปี ห่างจอมเทียนราว 40 กม."],
  s2: ["4,164", "ห้องชุดที่ชาวต่างชาติซื้อในชลบุรีปี 2025 มากเป็นอันดับ 2 รองจากกรุงเทพฯ"],
  s3: ["$42.7B", "เศรษฐกิจ Wellness ของไทยปี 2024 คนซื้อบ้านเริ่มถามเรื่องอากาศ แสง และโรงพยาบาลใกล้บ้าน"],
  s4: ["84%", "ของผู้ซื้อคอนโดกรุงเทพฯ มองว่า Smart Home จำเป็น WIDEROOMS ออกแบบและติดตั้งให้ได้"],
  stripAll: "อ่านคู่มือทั้งหมด",
  typesH: "บุคลิกกับบ้านอัจฉริยะ",
  typesP: "แต่ละกลุ่มบุคลิกใช้บ้านต่างกัน WIDEROOMS จึงจัด Smart Home และ Wellness ให้ตรงกับวิธีใช้ชีวิตของคุณ ไม่ใช่แพ็กเกจเดียวสำหรับทุกคน",
  typesFrom: "เริ่มราว {p}",
  typesCta: "คุยกับ WIDEROOMS",
  srcLbl: "ที่มา: Thailand Living Insight"
},
en: {
  thisC: "This unit", thisH: "This home",
  homeH: "Live well here: wellness & smart home",
  homeP: "Drawn from the Thailand Living Insight guide and matched to this home and the personality it suits. None of it needs a major renovation.",
  lightW: ["Afternoon sun and sunsets", "The sea side faces west: sunset views, but strong afternoon sun. Double curtains or a motorised track that closes in the afternoon keep the room cool and cut the air-con bill."],
  lightE: ["Morning light sets your body clock", "Facing east, the room catches the morning sun, which helps you wake up and sleep better at night. Use blackout curtains in the bedroom if you like a lie-in."],
  lightX: ["Light that follows your body clock", "Use 4000–5000K white light by day and 2700K warm light at night. Smart bulbs can shift colour by the time of day."],
  airSea: ["Sea breeze and humidity", "The sea breeze keeps the air moving, but seaside humidity breeds mould. A humidity and PM2.5 monitor alerts your phone, and January to April still brings smoke haze."],
  airX: ["Clean air", "Thailand's 2025 average PM2.5 was 3.6 times the WHO guideline, worst from January to April. An air purifier with a sensor makes a real difference."],
  sleepHi: ["Floor {f}: above the street noise", "A quiet bedroom. Set the air conditioner to 25–26°C with a fan for deeper sleep and a lower bill than running it very cold."],
  sleepLo: ["Floor {f}: listen before you decide", "Visit once at night to hear the real noise. Heavy curtains help, and 25–26°C with a fan gives deeper sleep."],
  sleepHouse: ["A cool house sleeps better", "A house takes sun on several sides. Roof insulation, sun-blocking curtains and inverter air conditioning at 25–26°C help both sleep and the power bill."],
  bridge: "Feng shui and wellness science agree on a lot: daylight, moving air and clear paths through the home.",
  kitH: "A smart home for your personality",
  kitFor: "Set for the type this home suits ({type}). Pick your own group to compare.",
  kitPick: "Pick your personality group",
  g: { an: "Analysts (NT)", di: "Diplomats (NF)", se: "Sentinels (SJ)", ex: "Explorers (SP)" },
  k: {
    an: ["A home that runs itself", "NT types like systems that make sense and can be measured: set the automations once, then read power use and air quality as numbers."],
    di: ["A calm, restoring home", "NF types care how a place feels: light that changes with the day, clean air and water, and curtains that close when it's time to rest."],
    se: ["A safe, orderly home", "SJ types like certainty: a digital lock, leak sensors, and an air-con schedule that runs on time every day."],
    ex: ["A home ready for fun and travel", "SP types live in the moment: one tap for party or movie mode, door codes for friends, and the home in your pocket while you travel."]
  },
  it: {
    lock: ["Digital door lock", "Temporary codes for guests, cleaners or tenants"], hub: ["Matter / Thread hub", "Makes every device work together"],
    ac: ["Wi-Fi AC controller ×{n}", "Schedules, and cools before you arrive"], plugs: ["Energy-metering plugs ×3", "See which device uses the power"],
    air: ["PM2.5 / CO₂ / humidity monitor", "Alerts on your phone"], purifier: ["Air purifier with sensor", "Sized to the room"],
    bulbs: ["Tunable smart bulbs ×4", "Circadian lighting"], curtain: ["Curtain motor, 1 track", "Closes in strong sun"],
    leak: ["Leak sensors + shut-off valve", "Bathroom and under the sink"], wifi: ["Mesh Wi-Fi", "Separate guest and device networks"],
    filter: ["Under-sink water filter", "RO or UF"]
  },
  addW: "added for the afternoon sun", addSea: "added for seaside humidity",
  total: "Estimated device budget",
  kitNote: "Rough ranges from Thai retailers, Oct 2026. Installation not included; not a quote.",
  honest: "Matching by personality is a starting point for the design conversation, not a research finding.",
  wrNone: "{this} is sold unfurnished. WIDEROOMS can design and furnish it in the {concept} direction and install the smart home in one job.",
  wrNoneX: "{this} is sold unfurnished. WIDEROOMS can design, furnish and install the smart home in one job.",
  wrHas: "{this} is already furnished. WIDEROOMS can add the smart home without tearing anything out, and tune the look to your personality.",
  wrRent: "Renting? Choose no-drill devices you can take with you (ask the owner before changing the lock or plumbing). WIDEROOMS can choose and fit them.",
  wrBtn: "Ask WIDEROOMS to design & install",
  lkKit: "Build your own package", lkScore: "Score a unit's wellness at a viewing",
  buyH: "Buy with confidence",
  buyP: "The latest rules and taxes that apply to this property, checked {date}. Sources are in the guide.",
  rentH: "Move in with confidence",
  rentP: "What to know before a long-term rental, checked {date}. Sources are in the guide.",
  date: "27 Oct 2026",
  fr: ["Foreign quota: your name on the title", "This unit is in the foreign quota (49% of the building). A foreigner can own it freehold, and sell it or pass it on."],
  fet: ["Bring the money in the right way", "Wire it in foreign currency. The bank issues an FET form for US$50,000 or more; keep the original for transfer day and for selling later."],
  thb: ["Thai buyers: transfer fee cut to 0.01%", "For homes up to ฿7 million, a government measure cuts the transfer fee from 2% to 0.01% until 30 June 2027. Ask the team how it applies here."],
  thb7: ["Thai buyers", "The 0.01% transfer-fee cut covers homes up to ฿7 million. This property is above that, so the normal 2% applies, split as agreed."],
  thq: ["Foreign buyers: this unit is in the Thai quota", "Foreigners can't own it freehold. The options are a registered lease of up to 30 years, ownership by a Thai spouse, or a unit in the foreign quota."],
  q: ["Foreign buyers: check the quota before booking", "Foreigners can only buy units in the building's 49% foreign quota. The team checks the quota for you before you pay a deposit."],
  land: ["Foreigners, houses and land", "Foreigners can't own land. The legal route is a registered 30-year land lease while owning the house itself. Holding through a Thai nominee or a nominee company is illegal."],
  visa: ["A home doesn't come with a visa", "Visa-free stays dropped to 30 days on 15 Sep 2026. To stay longer, look at the DTV, LTR, Thailand Privilege or retirement visa; the visa finder takes under a minute."],
  visaR: ["Plan the visa before you sign", "Visa-free stays dropped to 30 days on 15 Sep 2026. To stay longer, look at the DTV, LTR, Thailand Privilege or retirement visa; the visa finder takes under a minute."],
  rent: ["Letting it legally", "A condo can be let for 30 days or more. Daily lets need a hotel licence, and most condo by-laws ban them."],
  life: ["Living costs in Pattaya–Jomtien", "A single person spends about ฿20,000–25,000 a month excluding rent, or ฿38,000–51,000 for a comfortable life. Long-stay tenants need the owner to file a TM30."],
  lkBuy: "Buying guide + transfer-day cost calculator", lkVisa: "Visa finder", lkLife: "Moving to Thailand: visas and living costs",
  buyNote: "General information, not legal or tax advice. Check with a lawyer or the Land Office before you sign.",
  stripH: "Why the Eastern Seaboard, now",
  stripP: "Four figures from the Thailand Living Insight guide, each with a source. Checked {date}.",
  s1: ["3 Apr 2026", "Work began on U-Tapao airport under a 50-year concession, about 40 km from Jomtien."],
  s2: ["4,164", "condos bought by foreigners in Chonburi in 2025, second only to Bangkok."],
  s3: ["$42.7B", "Thailand's wellness economy in 2024. Buyers now ask about air, light and the nearest hospital."],
  s4: ["84%", "of Bangkok condo buyers call smart features necessary. WIDEROOMS designs and installs them."],
  stripAll: "Read the full guide",
  typesH: "Personality and the smart home",
  typesP: "Each personality group uses a home differently, so WIDEROOMS fits the smart home and wellness set-up to how you live, not one package for everyone.",
  typesFrom: "from about {p}",
  typesCta: "Talk to WIDEROOMS",
  srcLbl: "Source: Thailand Living Insight"
},
ru: {
  thisC: "Эта квартира", thisH: "Этот дом",
  homeH: "Жить здесь здоровее: wellness и умный дом",
  homeP: "По материалам гида Thailand Living Insight, с учётом особенностей жилья и подходящего типа личности. Всё это не требует большого ремонта.",
  lightW: ["Вечернее солнце и закаты", "Сторона моря смотрит на запад: закаты, но сильное послеобеденное солнце. Двойные шторы или моторизованный карниз, закрывающийся днём, держат прохладу и снижают счёт за кондиционер."],
  lightE: ["Утренний свет настраивает биоритм", "Окна на восток ловят утреннее солнце — легче просыпаться и лучше спать ночью. Если любите поспать подольше, повесьте в спальне блэкаут-шторы."],
  lightX: ["Свет по биологическим часам", "Днём белый свет 4000–5000K, вечером тёплый 2700K. Умные лампы меняют цвет сами по времени суток."],
  airSea: ["Морской бриз и влажность", "Бриз освежает воздух, но морская влажность способствует плесени. Датчик влажности и PM2.5 присылает уведомления на телефон, а с января по апрель бывает дымка."],
  airX: ["Чистый воздух", "Средний уровень PM2.5 в Таиланде в 2025 году был в 3,6 раза выше нормы ВОЗ, хуже всего с января по апрель. Очиститель воздуха с датчиком заметно помогает."],
  sleepHi: ["{f} этаж: выше уличного шума", "Тихая спальня. Кондиционер на 25–26°C вместе с вентилятором — глубже сон и меньше счёт, чем при сильном охлаждении."],
  sleepLo: ["{f} этаж: послушайте до решения", "Приезжайте один раз вечером, чтобы услышать реальный шум. Плотные шторы помогают, а 25–26°C с вентилятором дают глубокий сон."],
  sleepHouse: ["В прохладном доме лучше спится", "Дом получает солнце с нескольких сторон. Утепление крыши, солнцезащитные шторы и инверторный кондиционер на 25–26°C помогают и сну, и счёту за электричество."],
  bridge: "Фэн-шуй и наука о wellness во многом согласны: дневной свет, движение воздуха и свободные проходы.",
  kitH: "Умный дом под ваш тип личности",
  kitFor: "Подобрано для типа, которому подходит это жильё ({type}). Выберите свою группу для сравнения.",
  kitPick: "Выберите свою группу",
  g: { an: "Аналитики (NT)", di: "Дипломаты (NF)", se: "Хранители (SJ)", ex: "Искатели (SP)" },
  k: {
    an: ["Дом, который работает сам", "Типы NT любят логичные и измеримые системы: настройте автоматизацию один раз и смотрите расход энергии и качество воздуха в цифрах."],
    di: ["Спокойный, восстанавливающий дом", "Для типов NF важно, как ощущается место: свет, меняющийся в течение дня, чистые воздух и вода и шторы, которые закрываются к отдыху."],
    se: ["Безопасный и упорядоченный дом", "Типы SJ ценят предсказуемость: электронный замок, датчики протечки и расписание кондиционера, которое срабатывает точно каждый день."],
    ex: ["Дом для отдыха и путешествий", "Типы SP живут моментом: одно касание — режим вечеринки или кино, коды двери для друзей и дом в телефоне во время поездок."]
  },
  it: {
    lock: ["Электронный дверной замок", "Временные коды для гостей, уборки или арендаторов"], hub: ["Хаб Matter / Thread", "Объединяет все устройства"],
    ac: ["Wi-Fi-контроллер кондиционера ×{n}", "Расписание и охлаждение до приезда"], plugs: ["Розетки с учётом энергии ×3", "Видно, что потребляет энергию"],
    air: ["Датчик PM2.5 / CO₂ / влажности", "Уведомления на телефон"], purifier: ["Очиститель воздуха с датчиком", "По площади комнаты"],
    bulbs: ["Умные лампы с регулировкой цвета ×4", "Циркадное освещение"], curtain: ["Мотор для штор, 1 карниз", "Закрывает при сильном солнце"],
    leak: ["Датчики протечки + запорный клапан", "Ванная и под мойкой"], wifi: ["Mesh Wi-Fi", "Отдельные сети для гостей и устройств"],
    filter: ["Фильтр для воды под мойкой", "RO или UF"]
  },
  addW: "добавлено из-за вечернего солнца", addSea: "добавлено из-за морской влажности",
  total: "Ориентировочный бюджет на устройства",
  kitNote: "Примерные цены тайских магазинов, октябрь 2026. Без установки; не коммерческое предложение.",
  honest: "Подбор по типу личности — отправная точка для обсуждения дизайна, а не научный вывод.",
  wrNone: "{this} продаётся без мебели. WIDEROOMS выполнит дизайн и меблировку в стиле {concept} и установит умный дом за один проект.",
  wrNoneX: "{this} продаётся без мебели. WIDEROOMS выполнит дизайн, меблировку и установку умного дома за один проект.",
  wrHas: "{this} уже с мебелью. WIDEROOMS добавит умный дом без демонтажа и подстроит интерьер под ваш тип личности.",
  wrRent: "Арендуете? Выбирайте устройства без сверления, которые можно забрать с собой (замену замка и сантехники согласуйте с владельцем). WIDEROOMS поможет подобрать и установить.",
  wrBtn: "Заказать дизайн и установку у WIDEROOMS",
  lkKit: "Собрать свой пакет", lkScore: "Оценить wellness квартиры на просмотре",
  buyH: "Покупка с уверенностью",
  buyP: "Актуальные правила и налоги для этого объекта, проверено {date}. Источники — в гиде.",
  rentH: "Переезд с уверенностью",
  rentP: "Что важно знать до долгосрочной аренды, проверено {date}. Источники — в гиде.",
  date: "27 окт. 2026",
  fr: ["Иностранная квота: собственность на ваше имя", "Квартира в иностранной квоте (49% здания). Иностранец может владеть ею на правах полной собственности, продать или передать по наследству."],
  fet: ["Ввозите деньги правильно", "Переводите в иностранной валюте. На сумму от 50 000 USD банк выдаёт форму FET; сохраните оригинал для дня регистрации и будущей продажи."],
  thb: ["Покупатели — граждане Таиланда: сбор 0,01%", "Для жилья до 7 млн бат госмера снижает регистрационный сбор с 2% до 0,01% до 30 июня 2027 г. Уточните у команды, как это применяется здесь."],
  thb7: ["Покупатели — граждане Таиланда", "Снижение сбора до 0,01% действует для жилья до 7 млн бат. Этот объект дороже, поэтому применяется обычная ставка 2%, распределяемая по договорённости."],
  thq: ["Иностранцам: квартира в тайской квоте", "Иностранец не может владеть ею в полной собственности. Варианты: зарегистрированная аренда до 30 лет, оформление на тайского супруга или квартира в иностранной квоте."],
  q: ["Иностранцам: проверьте квоту до бронирования", "Иностранцы могут покупать только квартиры в иностранной квоте здания (49%). Команда проверит квоту до внесения депозита."],
  land: ["Иностранцы, дома и земля", "Иностранцы не могут владеть землёй. Законный путь — зарегистрированная аренда земли на 30 лет и владение самим домом. Оформление на тайского номинала или номинальную компанию незаконно."],
  visa: ["Жильё не даёт визу", "С 15 сентября 2026 г. безвизовое пребывание сокращено до 30 дней. Для долгого проживания рассмотрите DTV, LTR, Thailand Privilege или пенсионную визу; подбор визы займёт меньше минуты."],
  visaR: ["Спланируйте визу до подписания", "С 15 сентября 2026 г. безвизовое пребывание сокращено до 30 дней. Для долгого проживания рассмотрите DTV, LTR, Thailand Privilege или пенсионную визу; подбор визы займёт меньше минуты."],
  rent: ["Сдача в аренду по закону", "Квартиру можно сдавать от 30 дней. Посуточная аренда требует гостиничной лицензии, и большинство кондоминиумов её запрещают."],
  life: ["Стоимость жизни в Паттайе и Джомтьене", "Одному человеку нужно около 20 000–25 000 бат в месяц без аренды или 38 000–51 000 для комфортной жизни. Для долгосрочных арендаторов владелец подаёт форму TM30."],
  lkBuy: "Гид покупателя + калькулятор расходов", lkVisa: "Подбор визы", lkLife: "Переезд в Таиланд: визы и расходы",
  buyNote: "Общая информация, не юридическая и не налоговая консультация. Перед подписанием проконсультируйтесь с юристом или земельным департаментом.",
  stripH: "Почему Восточное побережье — сейчас",
  stripP: "Четыре цифры из гида Thailand Living Insight, у каждой есть источник. Проверено {date}.",
  s1: ["3 апр. 2026", "Начато строительство аэропорта У-Тапао по 50-летней концессии, около 40 км от Джомтьена."],
  s2: ["4 164", "квартиры купили иностранцы в Чонбури в 2025 г. — второе место после Бангкока."],
  s3: ["$42.7B", "wellness-экономика Таиланда в 2024 г. Покупатели всё чаще спрашивают о воздухе, свете и ближайшей больнице."],
  s4: ["84%", "покупателей кондо в Бангкоке считают умный дом необходимым. WIDEROOMS проектирует и устанавливает такие системы."],
  stripAll: "Читать весь гид",
  typesH: "Тип личности и умный дом",
  typesP: "Каждая группа личности пользуется домом по-своему, поэтому WIDEROOMS подбирает умный дом и wellness под ваш образ жизни, а не один пакет для всех.",
  typesFrom: "от {p}",
  typesCta: "Связаться с WIDEROOMS",
  srcLbl: "Источник: Thailand Living Insight"
},
zh: {
  thisC: "本房", thisH: "本屋",
  homeH: "住得更健康：Wellness 与智能家居",
  homeP: "根据 Thailand Living Insight 指南整理，并结合本物业特点与适合的性格类型。全部无需大规模装修。",
  lightW: ["午后阳光与日落", "海景面朝西，可看日落，但午后日晒强。双层窗帘或午后自动关闭的电动窗帘让房间更凉爽，也省空调电费。"],
  lightE: ["晨光帮助调节生物钟", "朝东的房间迎来晨光，让人醒得更轻松、夜里睡得更好。想睡懒觉的话，卧室用遮光窗帘。"],
  lightX: ["跟随生物钟的灯光", "白天用 4000–5000K 白光，夜晚用 2700K 暖光。智能灯泡可按时间自动变色。"],
  airSea: ["海风与湿度", "海风让空气流通，但海边湿气容易发霉。湿度与 PM2.5 监测器会推送提醒，1–4 月仍有烟霾。"],
  airX: ["洁净空气", "2025 年泰国 PM2.5 年均值是世卫标准的 3.6 倍，1–4 月最严重。带传感器的空气净化器效果明显。"],
  sleepHi: ["{f} 楼：远离街道噪音", "卧室安静。空调设 25–26°C 配合风扇，睡得更深，也比开得很冷更省电。"],
  sleepLo: ["{f} 楼：先听听再决定", "晚上来看一次房，听听真实噪音。厚窗帘有帮助，25–26°C 配合风扇睡得更深。"],
  sleepHouse: ["凉爽的房子睡得更好", "独栋房多面受晒。屋顶隔热、遮阳窗帘和设在 25–26°C 的变频空调，对睡眠和电费都有帮助。"],
  bridge: "风水与 Wellness 科学在很多方面看法一致：自然光、流动的空气和通畅的动线。",
  kitH: "按性格配置的智能家居",
  kitFor: "已按适合这里的类型（{type}）配置，可选择您的组别对比。",
  kitPick: "选择您的性格组别",
  g: { an: "分析家 (NT)", di: "外交家 (NF)", se: "守护者 (SJ)", ex: "探险家 (SP)" },
  k: {
    an: ["自己会运转的家", "NT 类型喜欢合乎逻辑、可量化的系统：一次设定自动化，再用数字查看用电与空气质量。"],
    di: ["安静疗愈的家", "NF 类型重视空间的感受：随时间变化的灯光、干净的空气和水，以及休息时自动关闭的窗帘。"],
    se: ["安全有序的家", "SJ 类型喜欢确定性：智能门锁、漏水传感器，以及每天准时运行的空调排程。"],
    ex: ["随时出游、聚会的家", "SP 类型活在当下：一键切换派对或观影模式，给朋友发门锁密码，旅行时用手机照看家。"]
  },
  it: {
    lock: ["智能门锁", "给访客、保洁或租客临时密码"], hub: ["Matter / Thread 网关", "让所有设备协同工作"],
    ac: ["Wi-Fi 空调控制器 ×{n}", "定时并提前降温"], plugs: ["计量智能插座 ×3", "查看哪台电器耗电"],
    air: ["PM2.5 / CO₂ / 湿度监测器", "手机提醒"], purifier: ["带传感器的空气净化器", "按房间面积选择"],
    bulbs: ["可调色智能灯泡 ×4", "昼夜节律照明"], curtain: ["电动窗帘电机（1 条轨道）", "日晒强时自动关闭"],
    leak: ["漏水传感器 + 自动关水阀", "浴室与水槽下方"], wifi: ["Mesh Wi-Fi", "访客与设备网络分开"],
    filter: ["厨下净水器", "RO 或 UF"]
  },
  addW: "因午后日晒而添加", addSea: "因海边湿度而添加",
  total: "设备预算估算",
  kitNote: "价格为 2026 年 10 月泰国零售参考区间，不含安装，并非报价。",
  honest: "按性格配置是设计讨论的起点，并非研究结论。",
  wrNone: "{this}不含家具出售。WIDEROOMS 可按 {concept} 方向完成设计与家具布置，并一并安装智能家居。",
  wrNoneX: "{this}不含家具出售。WIDEROOMS 可一次完成设计、家具布置与智能家居安装。",
  wrHas: "{this}已配家具。WIDEROOMS 可在不拆改的情况下加装智能家居，并按您的性格调整风格。",
  wrRent: "租房也适用：选择免打孔、可带走的设备（更换门锁或改水管前请先征得业主同意）。WIDEROOMS 可帮您挑选并安装。",
  wrBtn: "请 WIDEROOMS 设计并安装",
  lkKit: "自己搭配套餐", lkScore: "看房时为 Wellness 打分",
  buyH: "安心购买",
  buyP: "与本物业相关的最新法规与税费，核实于 {date}。来源见指南。",
  rentH: "安心入住",
  rentP: "长租前需要了解的事项，核实于 {date}。来源见指南。",
  date: "2026 年 10 月 27 日",
  fr: ["外国人配额：产权登记在您名下", "本房属于外国人配额（大楼的 49%）。外国人可拥有永久产权，可转售或继承。"],
  fet: ["以正确方式汇入资金", "以外币汇入。5 万美元及以上由银行出具 FET 表格；请保存原件，过户当天和日后出售时都需要。"],
  thb: ["泰籍买家：过户费降至 0.01%", "700 万泰铢以内的住宅，政府措施将过户费从 2% 降至 0.01%，至 2027 年 6 月 30 日。请向团队确认本物业如何适用。"],
  thb7: ["泰籍买家", "过户费降至 0.01% 的措施适用于 700 万泰铢以内的住宅。本物业高于该标准，按常规 2% 计，由双方约定分摊。"],
  thq: ["外国买家：本房属于泰国配额", "外国人无法拥有永久产权。可选方案：登记长期租约（最长 30 年）、由泰籍配偶持有，或选择外国人配额的房源。"],
  q: ["外国买家：预订前先查配额", "外国人只能购买大楼 49% 外国人配额内的房源。团队会在您付订金前帮您核实配额。"],
  land: ["外国人与房屋、土地", "外国人不能拥有土地。合法途径是登记 30 年土地租约并拥有房屋本身。通过泰国代持人或代持公司持有属违法。"],
  visa: ["买房不附带签证", "自 2026 年 9 月 15 日起免签停留缩短为 30 天。想长住可考虑 DTV、LTR、Thailand Privilege 或退休签证；签证选择工具不到一分钟。"],
  visaR: ["签约前先规划签证", "自 2026 年 9 月 15 日起免签停留缩短为 30 天。想长住可考虑 DTV、LTR、Thailand Privilege 或退休签证；签证选择工具不到一分钟。"],
  rent: ["合法出租", "公寓出租须至少 30 天。按日出租需酒店执照，大多数公寓章程也禁止。"],
  life: ["芭提雅–中天生活成本", "单身人士不含房租每月约 20,000–25,000 泰铢，舒适生活约 38,000–51,000 泰铢。长租房客需由业主申报 TM30。"],
  lkBuy: "购房指南 + 过户费用计算器", lkVisa: "签证选择工具", lkLife: "移居泰国：签证与生活成本",
  buyNote: "仅为一般信息，不构成法律或税务建议。签约前请咨询律师或土地厅。",
  stripH: "为何是东部海岸，为何是现在",
  stripP: "来自 Thailand Living Insight 指南的四个数字，均附来源。核实于 {date}。",
  s1: ["2026.4.3", "乌塔堡机场按 50 年特许经营开工，距中天约 40 公里。"],
  s2: ["4,164", "套：2025 年外国人在春武里购买的公寓，仅次于曼谷。"],
  s3: ["$42.7B", "2024 年泰国 Wellness 经济规模。买家开始关注空气、光线和最近的医院。"],
  s4: ["84%", "的曼谷公寓买家认为智能家居是必需。WIDEROOMS 提供设计与安装。"],
  stripAll: "阅读完整指南",
  typesH: "性格与智能家居",
  typesP: "不同性格组别使用家的方式不同，所以 WIDEROOMS 按您的生活方式配置智能家居与 Wellness，而不是一套方案给所有人。",
  typesFrom: "约 {p} 起",
  typesCta: "联系 WIDEROOMS",
  srcLbl: "来源：Thailand Living Insight"
},
ko: {
  thisC: "이 호실", thisH: "이 집",
  homeH: "건강하게 사는 집: 웰니스 & 스마트홈",
  homeP: "Thailand Living Insight 가이드를 바탕으로 이 집의 특징과 어울리는 성격 유형에 맞췄습니다. 모두 큰 리모델링 없이 가능합니다.",
  lightW: ["오후 햇살과 노을", "바다 쪽이 서향이라 노을이 보이지만 오후 햇살이 강합니다. 이중 커튼이나 오후에 자동으로 닫히는 전동 커튼이 방을 시원하게 하고 에어컨 요금을 줄여 줍니다."],
  lightE: ["아침 햇살이 생체 시계를 맞춰 줍니다", "동향이라 아침 해가 들어와 개운하게 일어나고 밤에 잠도 잘 옵니다. 늦잠을 좋아한다면 침실에 암막 커튼을 다세요."],
  lightX: ["생체 리듬에 맞춘 조명", "낮에는 4000–5000K 백색광, 밤에는 2700K 따뜻한 빛. 스마트 전구는 시간에 따라 색을 자동으로 바꿉니다."],
  airSea: ["바닷바람과 습도", "바닷바람으로 공기는 잘 통하지만 해안 습기는 곰팡이를 부릅니다. 습도·PM2.5 측정기가 휴대폰으로 알려 주며, 1–4월에는 연무가 있습니다."],
  airX: ["깨끗한 공기", "2025년 태국 PM2.5 연평균은 WHO 기준의 3.6배였고 1–4월이 가장 심합니다. 센서가 있는 공기청정기가 큰 도움이 됩니다."],
  sleepHi: ["{f}층: 거리 소음보다 높게", "조용한 침실. 에어컨 25–26°C에 선풍기를 함께 쓰면 더 깊이 자고, 아주 차갑게 트는 것보다 전기료도 적게 듭니다."],
  sleepLo: ["{f}층: 결정 전에 직접 들어 보세요", "밤에 한 번 방문해 실제 소음을 들어 보세요. 두꺼운 커튼이 도움이 되고, 25–26°C와 선풍기로 깊은 잠을 잘 수 있습니다."],
  sleepHouse: ["시원한 집에서 더 잘 잡니다", "단독주택은 여러 면에서 햇볕을 받습니다. 지붕 단열, 차광 커튼, 25–26°C 인버터 에어컨이 수면과 전기료 모두에 좋습니다."],
  bridge: "풍수와 웰니스 과학은 많은 점에서 같은 말을 합니다: 자연광, 흐르는 공기, 막힘없는 동선.",
  kitH: "성격에 맞춘 스마트홈",
  kitFor: "이곳에 어울리는 유형({type})에 맞춰 구성했습니다. 내 그룹을 골라 비교해 보세요.",
  kitPick: "내 성격 그룹 선택",
  g: { an: "분석가형 (NT)", di: "외교관형 (NF)", se: "관리자형 (SJ)", ex: "탐험가형 (SP)" },
  k: {
    an: ["알아서 돌아가는 집", "NT 유형은 논리적이고 측정 가능한 시스템을 좋아합니다. 자동화를 한 번 설정하고 전력 사용과 공기질을 숫자로 확인하세요."],
    di: ["마음이 편안해지는 집", "NF 유형은 공간의 느낌을 중시합니다. 시간에 따라 바뀌는 조명, 깨끗한 공기와 물, 쉴 때 저절로 닫히는 커튼."],
    se: ["안전하고 정돈된 집", "SJ 유형은 확실함을 좋아합니다. 디지털 도어록, 누수 센서, 매일 정시에 작동하는 에어컨 스케줄."],
    ex: ["놀고 떠나기 좋은 집", "SP 유형은 지금을 즐깁니다. 한 번 터치로 파티·영화 모드, 친구에게 보내는 도어 코드, 여행 중에도 휴대폰으로 집 관리."]
  },
  it: {
    lock: ["디지털 도어록", "손님·청소·세입자용 임시 코드"], hub: ["Matter / Thread 허브", "모든 기기를 함께 작동"],
    ac: ["Wi-Fi 에어컨 컨트롤러 ×{n}", "예약 및 도착 전 냉방"], plugs: ["전력 측정 스마트 플러그 ×3", "어떤 기기가 전기를 쓰는지 확인"],
    air: ["PM2.5 / CO₂ / 습도 측정기", "휴대폰 알림"], purifier: ["센서 공기청정기", "방 크기에 맞게"],
    bulbs: ["색온도 조절 스마트 전구 ×4", "생체 리듬 조명"], curtain: ["전동 커튼 모터 (레일 1개)", "햇볕이 강하면 자동으로 닫힘"],
    leak: ["누수 센서 + 자동 차단 밸브", "욕실과 싱크대 아래"], wifi: ["메시 Wi-Fi", "손님용과 기기용 네트워크 분리"],
    filter: ["싱크대 하부 정수기", "RO 또는 UF"]
  },
  addW: "오후 햇살 때문에 추가", addSea: "해안 습도 때문에 추가",
  total: "예상 기기 예산",
  kitNote: "2026년 10월 태국 소매가 기준 대략적인 범위이며 설치비 제외, 견적이 아닙니다.",
  honest: "성격별 구성은 디자인 상담의 출발점이며 연구 결과가 아닙니다.",
  wrNone: "{this}은 가구 미포함으로 판매됩니다. WIDEROOMS가 {concept} 콘셉트로 디자인·가구 배치와 스마트홈 설치를 한 번에 진행할 수 있습니다.",
  wrNoneX: "{this}은 가구 미포함으로 판매됩니다. WIDEROOMS가 디자인, 가구 배치, 스마트홈 설치를 한 번에 진행할 수 있습니다.",
  wrHas: "{this}은 이미 가구가 있습니다. WIDEROOMS가 철거 없이 스마트홈을 더하고 성격에 맞게 분위기를 조정해 드립니다.",
  wrRent: "임차인도 가능합니다: 구멍을 뚫지 않고 옮길 수 있는 기기를 고르세요(도어록·배관 변경은 집주인과 먼저 상의). WIDEROOMS가 선택과 설치를 도와드립니다.",
  wrBtn: "WIDEROOMS에 디자인·설치 문의",
  lkKit: "직접 패키지 구성", lkScore: "방문 시 웰니스 점수 확인",
  buyH: "안심하고 구매하기",
  buyP: "이 매물에 적용되는 최신 규정과 세금, {date} 확인. 출처는 가이드에 있습니다.",
  rentH: "안심하고 입주하기",
  rentP: "장기 임대 전에 알아 둘 점, {date} 확인. 출처는 가이드에 있습니다.",
  date: "2026년 10월 27일",
  fr: ["외국인 쿼터: 내 이름으로 소유권 등기", "이 호실은 외국인 쿼터(건물의 49%)에 속합니다. 외국인도 완전 소유권으로 보유하고 매도하거나 상속할 수 있습니다."],
  fet: ["자금은 올바른 방법으로 송금", "외화로 송금하세요. 5만 달러 이상이면 은행이 FET 서류를 발급하며, 원본은 이전 등기일과 향후 매도 시 필요합니다."],
  thb: ["태국인 매수자: 이전 수수료 0.01%", "700만 바트 이하 주택은 정부 조치로 이전 수수료가 2%에서 0.01%로 인하됩니다(2027년 6월 30일까지). 이 매물에 어떻게 적용되는지 팀에 문의하세요."],
  thb7: ["태국인 매수자", "0.01% 인하는 700만 바트 이하 주택에 적용됩니다. 이 매물은 기준을 넘어 일반 2%가 적용되며 합의에 따라 분담합니다."],
  thq: ["외국인 매수자: 이 호실은 태국인 쿼터", "외국인은 완전 소유권으로 보유할 수 없습니다. 최장 30년 등기 임대, 태국인 배우자 명의, 또는 외국인 쿼터 호실을 선택할 수 있습니다."],
  q: ["외국인 매수자: 예약 전 쿼터 확인", "외국인은 건물의 49% 외국인 쿼터 호실만 살 수 있습니다. 예약금 전에 팀이 쿼터를 확인해 드립니다."],
  land: ["외국인과 주택·토지", "외국인은 토지를 소유할 수 없습니다. 합법적인 방법은 30년 토지 임대를 등기하고 건물만 소유하는 것입니다. 태국인 명의 대여나 명의 회사로 보유하는 것은 불법입니다."],
  visa: ["집을 사도 비자는 나오지 않습니다", "2026년 9월 15일부터 무비자 체류가 30일로 줄었습니다. 장기 체류라면 DTV, LTR, Thailand Privilege, 은퇴 비자를 검토하세요. 비자 찾기는 1분이면 됩니다."],
  visaR: ["계약 전에 비자를 계획하세요", "2026년 9월 15일부터 무비자 체류가 30일로 줄었습니다. 장기 체류라면 DTV, LTR, Thailand Privilege, 은퇴 비자를 검토하세요. 비자 찾기는 1분이면 됩니다."],
  rent: ["합법적으로 임대하기", "콘도는 30일 이상만 임대할 수 있습니다. 일 단위 임대는 호텔 허가가 필요하고 대부분의 콘도 규약이 금지합니다."],
  life: ["파타야–좀티엔 생활비", "1인 기준 월세 제외 약 20,000–25,000바트, 여유 있게는 38,000–51,000바트입니다. 장기 세입자는 집주인이 TM30을 신고해야 합니다."],
  lkBuy: "구매 가이드 + 이전 비용 계산기", lkVisa: "비자 찾기", lkLife: "태국 이주: 비자와 생활비",
  buyNote: "일반 정보이며 법률·세무 자문이 아닙니다. 계약 전 변호사나 토지청에 확인하세요.",
  stripH: "왜 지금 동부 해안인가",
  stripP: "Thailand Living Insight 가이드의 네 가지 수치, 모두 출처 포함. {date} 확인.",
  s1: ["2026.4.3", "우타파오 공항이 50년 양허 계약으로 착공, 좀티엔에서 약 40km."],
  s2: ["4,164", "2025년 외국인이 촌부리에서 산 콘도 수, 방콕 다음 2위."],
  s3: ["$42.7B", "2024년 태국 웰니스 경제 규모. 매수자들이 공기, 빛, 가까운 병원을 묻기 시작했습니다."],
  s4: ["84%", "방콕 콘도 매수자 중 스마트홈이 필수라고 답한 비율. WIDEROOMS가 설계·설치합니다."],
  stripAll: "가이드 전체 보기",
  typesH: "성격과 스마트홈",
  typesP: "성격 그룹마다 집을 쓰는 방식이 다르기에, WIDEROOMS는 모두에게 같은 패키지가 아니라 당신의 생활 방식에 맞춰 스마트홈과 웰니스를 구성합니다.",
  typesFrom: "약 {p}부터",
  typesCta: "WIDEROOMS와 상담",
  srcLbl: "출처: Thailand Living Insight"
},
ja: {
  thisC: "この部屋", thisH: "この家",
  homeH: "健やかに暮らす：ウェルネス＆スマートホーム",
  homeP: "Thailand Living Insight ガイドをもとに、この物件の特徴と相性のよい性格タイプに合わせて整理しました。どれも大がかりなリフォームは不要です。",
  lightW: ["西日と夕景", "海側は西向きで夕日が見えますが、午後の日差しが強めです。二重カーテンや午後に自動で閉まる電動カーテンで室内を涼しく保ち、エアコン代も抑えられます。"],
  lightE: ["朝日が体内時計を整える", "東向きで朝日が入り、目覚めがよく夜もよく眠れます。朝寝坊したい方は寝室に遮光カーテンを。"],
  lightX: ["体内時計に合わせた照明", "日中は 4000〜5000K の白色光、夜は 2700K の暖色光。スマート電球なら時間帯で自動的に色が変わります。"],
  airSea: ["海風と湿気", "海風で空気はよく通りますが、海辺の湿気はカビの原因に。湿度・PM2.5 センサーがスマホに通知し、1〜4月は煙霧もあります。"],
  airX: ["きれいな空気", "2025年のタイの PM2.5 年平均は WHO 指針の 3.6 倍で、1〜4月が最悪です。センサー付き空気清浄機の効果は大きいです。"],
  sleepHi: ["{f}階：通りの騒音より上", "静かな寝室。エアコン 25〜26°C と扇風機の併用で深く眠れ、強く冷やすより電気代も抑えられます。"],
  sleepLo: ["{f}階：決める前に音を確かめて", "一度夜に内見して実際の音を確認しましょう。厚手のカーテンが効果的で、25〜26°C と扇風機で深い眠りに。"],
  sleepHouse: ["涼しい家はよく眠れる", "戸建ては複数の面から日が当たります。屋根断熱、遮光カーテン、25〜26°C のインバーターエアコンが睡眠にも電気代にも効きます。"],
  bridge: "風水とウェルネス科学は多くの点で一致します：自然光、流れる空気、すっきりした動線。",
  kitH: "性格に合わせたスマートホーム",
  kitFor: "ここに合うタイプ（{type}）向けに構成しました。ご自身のグループを選んで比べられます。",
  kitPick: "あなたの性格グループを選ぶ",
  g: { an: "分析家 (NT)", di: "外交官 (NF)", se: "番人 (SJ)", ex: "探検家 (SP)" },
  k: {
    an: ["自動で回る家", "NT タイプは筋が通り、数値で測れる仕組みが好き。自動化を一度設定し、電力と空気の質を数字で確認。"],
    di: ["心が落ち着く家", "NF タイプは空間の心地よさを重視。時間で変わる光、きれいな空気と水、休むときに自然に閉まるカーテン。"],
    se: ["安全で整った家", "SJ タイプは確実さを好みます。デジタルロック、漏水センサー、毎日時間どおりに動くエアコンのスケジュール。"],
    ex: ["遊びにも旅にも身軽な家", "SP タイプは今を楽しむ人。ワンタップでパーティー・映画モード、友人にはドアの暗証番号、旅先からもスマホで管理。"]
  },
  it: {
    lock: ["デジタルドアロック", "来客・清掃・入居者向けの一時コード"], hub: ["Matter / Thread ハブ", "すべての機器を連携"],
    ac: ["Wi-Fi エアコンコントローラー ×{n}", "タイマーと帰宅前の冷房"], plugs: ["電力計測スマートプラグ ×3", "どの機器が電気を使うか確認"],
    air: ["PM2.5 / CO₂ / 湿度モニター", "スマホに通知"], purifier: ["センサー付き空気清浄機", "部屋の広さに合わせて"],
    bulbs: ["調色スマート電球 ×4", "サーカディアン照明"], curtain: ["電動カーテンモーター（1レール）", "日差しが強いと自動で閉じる"],
    leak: ["漏水センサー＋止水バルブ", "浴室とシンク下"], wifi: ["メッシュ Wi-Fi", "来客用と機器用のネットワークを分離"],
    filter: ["シンク下浄水器", "RO または UF"]
  },
  addW: "西日対策で追加", addSea: "海辺の湿気対策で追加",
  total: "機器の概算予算",
  kitNote: "2026年10月時点のタイの小売価格の目安。設置費別、見積もりではありません。",
  honest: "性格による構成はデザイン相談の出発点であり、研究結果ではありません。",
  wrNone: "{this}は家具なしでの販売です。WIDEROOMS が {concept} のコンセプトでデザイン・家具の手配とスマートホームの設置をまとめて行えます。",
  wrNoneX: "{this}は家具なしでの販売です。WIDEROOMS がデザイン・家具・スマートホームの設置をまとめて行えます。",
  wrHas: "{this}は家具付きです。WIDEROOMS が何も撤去せずにスマートホームを追加し、性格に合わせて雰囲気を整えます。",
  wrRent: "賃貸でも大丈夫：穴あけ不要で持ち運べる機器を選びましょう（鍵や配管の変更は事前に家主へ相談）。WIDEROOMS が選定と設置をお手伝いします。",
  wrBtn: "WIDEROOMS にデザイン・設置を相談",
  lkKit: "自分でパッケージを組む", lkScore: "内見時にウェルネス度をチェック",
  buyH: "安心して購入するために",
  buyP: "この物件に関わる最新のルールと税金（{date} 確認）。出典はガイドにあります。",
  rentH: "安心して住み始めるために",
  rentP: "長期賃貸の前に知っておきたいこと（{date} 確認）。出典はガイドにあります。",
  date: "2026年10月27日",
  fr: ["外国人枠：あなたの名義で登記", "この部屋は外国人枠（建物の49%）です。外国人も完全所有権で保有でき、売却や相続も可能です。"],
  fet: ["資金は正しい方法で送金", "外貨で送金してください。5万米ドル以上は銀行が FET 書類を発行します。原本は移転登記日と将来の売却時に必要です。"],
  thb: ["タイ国籍の買主：移転手数料 0.01%", "700万バーツ以下の住宅は、政府措置により移転手数料が2%から0.01%に（2027年6月30日まで）。この物件への適用はチームにご確認ください。"],
  thb7: ["タイ国籍の買主", "0.01%への引き下げは700万バーツ以下の住宅が対象です。この物件は上回るため通常の2%となり、合意に応じて分担します。"],
  thq: ["外国人の方へ：この部屋はタイ人枠です", "外国人は完全所有権で保有できません。最長30年の登記済み賃貸借、タイ人配偶者名義、または外国人枠の部屋を選ぶ方法があります。"],
  q: ["外国人の方へ：予約前に枠を確認", "外国人が購入できるのは建物の49%の外国人枠の部屋だけです。手付金の前にチームが枠を確認します。"],
  land: ["外国人と住宅・土地", "外国人は土地を所有できません。合法的な方法は30年の土地賃貸借を登記し、建物を所有することです。タイ人の名義貸しやノミニー会社での保有は違法です。"],
  visa: ["家を買ってもビザは付きません", "2026年9月15日からビザなし滞在は30日に短縮されました。長期滞在なら DTV、LTR、Thailand Privilege、リタイアメントビザを検討を。ビザ診断は1分もかかりません。"],
  visaR: ["契約前にビザを計画", "2026年9月15日からビザなし滞在は30日に短縮されました。長期滞在なら DTV、LTR、Thailand Privilege、リタイアメントビザを検討を。ビザ診断は1分もかかりません。"],
  rent: ["合法的に貸すには", "コンドミニアムの賃貸は30日以上が条件です。日貸しにはホテル営業許可が必要で、ほとんどのコンドミニアム規約で禁止されています。"],
  life: ["パタヤ・ジョムティエンの生活費", "単身で家賃を除き月約2万〜2万5千バーツ、ゆとりのある暮らしで3万8千〜5万1千バーツ。長期入居者は家主が TM30 を届け出ます。"],
  lkBuy: "購入ガイド＋移転費用計算", lkVisa: "ビザ診断", lkLife: "タイ移住：ビザと生活費",
  buyNote: "一般的な情報であり、法律・税務の助言ではありません。契約前に弁護士または土地局にご確認ください。",
  stripH: "なぜ今、東部臨海なのか",
  stripP: "Thailand Living Insight ガイドから4つの数字。すべて出典付き、{date} 確認。",
  s1: ["2026.4.3", "ウタパオ空港が50年のコンセッションで着工。ジョムティエンから約40km。"],
  s2: ["4,164", "2025年に外国人がチョンブリで購入したコンドミニアム数。バンコクに次ぐ2位。"],
  s3: ["$42.7B", "2024年のタイのウェルネス経済。買主は空気・光・近くの病院を気にし始めています。"],
  s4: ["84%", "のバンコクのコンド購入者がスマート機能を必要と回答。WIDEROOMS が設計・設置します。"],
  stripAll: "ガイドを全部読む",
  typesH: "性格とスマートホーム",
  typesP: "性格グループごとに家の使い方は違います。だから WIDEROOMS は全員に同じパッケージではなく、あなたの暮らし方に合わせてスマートホームとウェルネスを組み立てます。",
  typesFrom: "約{p}から",
  typesCta: "WIDEROOMS に相談",
  srcLbl: "出典：Thailand Living Insight"
}
};

/* ------------------------------------------------------------- helpers */
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nf = new Intl.NumberFormat("en-US");
const baht = n => "฿" + nf.format(Math.round(n));
const fill = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => v[k] != null ? v[k] : m);
const lng = o => LANGS.includes(o.lang) ? o.lang : "en";
const T = o => S[lng(o)];
const guide = (o, topic) => {
  const p = new URLSearchParams();
  if (o.from) p.set("from", o.from);
  if (lng(o) !== "th") p.set("lang", lng(o));
  const q = p.toString();
  return GUIDE[topic] + (q ? "?" + q : "");
};
const GL = { an: "NT", di: "NF", se: "SJ", ex: "SP" };
const gName = (o, g) => { const h = o.groupName && o.groupName(g); return h ? `${h} (${GL[g]})` : T(o).g[g]; };
const prep = (el, o, cls) => {
  css();
  el.classList.add("lk", cls);
  if (o.accent) el.style.setProperty("--lk-acc", o.accent);
  return T(o);
};
const card = (ic, [t, d], extra) => `<div class="lk-card">${svg(ic)}<div><b>${esc(t)}</b><p>${esc(d)}</p>${extra || ""}</div></div>`;
const wrRow = (o, text) => `<div class="lk-wr">${o.wrLogo ? `<img src="${esc(o.wrLogo)}" alt="WIDEROOMS" width="52" height="52" loading="lazy">` : ""}
  <div>${text ? `<p>${esc(text)}</p>` : ""}<a class="lk-btn" href="${WR_URL}" target="_blank" rel="noopener">${esc(T(o).wrBtn)} ↗</a></div></div>`;

/* the device list for one MBTI group, adjusted to the home */
function kitFor(o, g) {
  const isHouse = o.kind === "house" || o.kind === "villa";
  const acN = isHouse ? Math.min((o.beds || 1) + 1, 5) : (o.beds ? o.beds + 1 : 1);
  const list = KIT[g].map(id => ({ id }));
  if (o.facing === "W" && !list.some(x => x.id === "curtain")) list.push({ id: "curtain", why: "addW" });
  if (o.sea && !list.some(x => x.id === "air")) list.push({ id: "air", why: "addSea" });
  let lo = 0, hi = 0;
  list.forEach(x => { const n = x.id === "ac" ? acN : 1; x.n = n; x.lo = ITEMS[x.id][0] * n; x.hi = ITEMS[x.id][1] * n; lo += x.lo; hi += x.hi; });
  return { list, lo, hi };
}

function kitHTML(o, g) {
  const s = T(o), k = kitFor(o, g);
  return `<div class="lk-kit" style="--g:${GROUP_COLOR[g]}">
    <div class="lk-kit-hd"><b>${esc(s.k[g][0])}</b><p>${esc(s.k[g][1])}</p></div>
    <ul class="lk-items">${k.list.map(x => { const [n, d] = s.it[x.id];
      return `<li><span><b>${esc(fill(n, { n: x.n }))}</b><small>${esc(d)}${x.why ? ` · <em>${esc(s[x.why])}</em>` : ""}</small></span>${SHOW_PRICES ? `<span class="lk-num">${baht(x.lo)}–${nf.format(x.hi)}</span>` : ""}</li>`; }).join("")}</ul>
    ${SHOW_PRICES ? `<div class="lk-tot"><span>${esc(s.total)}</span><b>${baht(k.lo)}–${nf.format(k.hi)}</b></div>` : ""}
  </div>`;
}

/* ------------------------------------------------------------- blocks */
function home(el, o) {
  const s = prep(el, o, "lk-home");
  const isHouse = o.kind === "house" || o.kind === "villa";
  const lead = (o.mbti || []).find(groupOf);
  let g = o.group || (lead ? groupOf(lead) : "se");
  const light = o.facing === "W" ? s.lightW : o.facing === "E" ? s.lightE : s.lightX;
  const air = o.sea ? s.airSea : s.airX;
  const sleep = isHouse || !o.floor ? s.sleepHouse : (o.floor >= 15 ? s.sleepHi : s.sleepLo).map(x => fill(x, { f: o.floor }));
  const thisW = isHouse ? s.thisH : s.thisC;
  const wrText = o.rental ? s.wrRent : o.furnished === false ? (o.concept ? fill(s.wrNone, { this: thisW, concept: o.concept }) : fill(s.wrNoneX, { this: thisW }))
    : fill(s.wrHas, { this: thisW });
  el.innerHTML = `<div class="lk-kick">Wellness &amp; Smart Home · WIDEROOMS</div>
    <h2>${esc(s.homeH)}</h2>
    <p class="lk-lede">${esc(s.homeP)}</p>
    <div class="lk-cards three">${card("sun", light)}${card("wind", air)}${card("moon", sleep)}</div>
    ${o.fengshui === false ? "" : `<p class="lk-bridge">☯ ${esc(s.bridge)}</p>`}
    <h3 class="lk-h3">${esc(s.kitH)}</h3>
    <p class="lk-sub">${lead ? esc(fill(s.kitFor, { type: lead })) : esc(s.kitPick)}</p>
    <div class="lk-tabs" role="group" aria-label="${esc(s.kitPick)}">${Object.keys(KIT).map(x =>
      `<button type="button" class="lk-tab" data-lkg="${x}" style="--g:${GROUP_COLOR[x]}" aria-pressed="${x === g}"><i></i>${esc(gName(o, x))}</button>`).join("")}</div>
    <div class="lk-kitbox">${kitHTML(o, g)}</div>
    <p class="lk-note">${SHOW_PRICES ? esc(s.kitNote) + " " : ""}${esc(s.honest)}</p>
    ${o.wr === false ? "" : wrRow(o, wrText)}
    <div class="lk-links"><a href="${guide(o, "smarthome")}">${esc(s.lkKit)} →</a><a href="${guide(o, "wellness")}">${esc(s.lkScore)} →</a></div>`;
  el.onclick = e => {
    const b = e.target.closest("[data-lkg]"); if (!b) return;
    g = b.dataset.lkg;
    el.querySelectorAll("[data-lkg]").forEach(x => x.setAttribute("aria-pressed", x.dataset.lkg === g));
    el.querySelector(".lk-kitbox").innerHTML = kitHTML(o, g);
  };
}

function buy(el, o) {
  const s = prep(el, o, "lk-buy");
  const isHouse = o.kind === "house" || o.kind === "villa";
  let cards = [], links;
  if (o.rental) {
    cards = [card("plane", s.visaR), card("wallet", s.life)];
    links = [["relocate", s.lkVisa], ["relocate", s.lkLife]];
  } else {
    const thai = o.price && o.price > THAI_FEE_CAP ? s.thb7 : s.thb;
    if (isHouse) cards.push(card("leaf", s.land), card("coin", thai));
    else if (o.quota === "FR") cards.push(card("key", s.fr), card("coin", s.fet));
    else if (o.quota === "TH") cards.push(card("coin", thai), card("doc", s.thq));
    else cards.push(card("doc", s.q), card("coin", thai));
    cards.push(card("plane", s.visa));
    if (!isHouse && o.rentRule) cards.push(card("home", s.rent));
    else if (o.quota === "FR") cards.push(card("coin", thai));
    links = [["buying", s.lkBuy], ["relocate", s.lkVisa]];
  }
  el.innerHTML = `<div class="lk-kick">Thailand Living Insight</div>
    <h2>${esc(o.rental ? s.rentH : s.buyH)}</h2>
    <p class="lk-lede">${esc(fill(o.rental ? s.rentP : s.buyP, { date: s.date }))}</p>
    <div class="lk-cards">${cards.join("")}</div>
    <div class="lk-links">${links.map(([t, l]) => `<a href="${guide(o, t)}">${esc(l)} →</a>`).join("")}</div>
    <p class="lk-note">${esc(s.buyNote)}</p>`;
}

function strip(el, o) {
  const s = prep(el, o, "lk-strip");
  const it = [["eec", s.s1], ["buying", s.s2], ["wellness", s.s3], ["smarthome", s.s4]];
  el.innerHTML = `<div class="lk-strip-hd"><div><div class="lk-kick">Thailand Living Insight 2026</div><h2>${esc(s.stripH)}</h2>
      <p class="lk-lede">${esc(fill(s.stripP, { date: s.date }))}</p></div>
      <a class="lk-all" href="${guide(o, "hub")}">${esc(s.stripAll)} →</a></div>
    <div class="lk-figs">${it.map(([t, [k, d]]) => `<a class="lk-fig" href="${guide(o, t)}">${svg(t)}<b>${esc(k)}</b><p>${esc(d)}</p><span>→</span></a>`).join("")}</div>`;
}

function types(el, o) {
  const s = prep(el, o, "lk-types");
  const from = g => { const k = kitFor({ kind: "condo" }, g); return fill(s.typesFrom, { p: baht(k.lo) }); };
  el.innerHTML = `<div class="lk-kick">Wellness &amp; Smart Home · WIDEROOMS</div>
    <h2>${esc(s.typesH)}</h2>
    <p class="lk-lede">${esc(s.typesP)}</p>
    <div class="lk-tgrid">${Object.keys(KIT).map(g => `<div class="lk-tcard" style="--g:${GROUP_COLOR[g]}">
      <div class="lk-ttop"><b>${esc(gName(o, g))}</b><span>${GROUP_TYPES[g].join(" · ")}</span></div>
      <div class="lk-tbody"><h3>${esc(s.k[g][0])}</h3><p>${esc(s.k[g][1])}</p>
        <ul>${KIT[g].map(id => `<li>${esc(fill(s.it[id][0], { n: 1 }).replace(/ ×1$/, ""))}</li>`).join("")}</ul>
        ${SHOW_PRICES ? `<em>${esc(from(g))}</em>` : ""}</div></div>`).join("")}</div>
    <p class="lk-note">${SHOW_PRICES ? esc(s.kitNote) + " " : ""}${esc(s.honest)}</p>
    ${wrRow(o, "")}
    <div class="lk-links"><a href="${guide(o, "smarthome")}">${esc(s.lkKit)} →</a><a href="${guide(o, "wellness")}">${esc(s.lkScore)} →</a></div>`;
}

/* ------------------------------------------------------------- styles */
let cssDone = false;
function css() {
  if (cssDone) return; cssDone = true;
  const st = document.createElement("style");
  st.id = "lk-css";
  st.textContent = `
.lk{--lk-acc:#23463F;--lk-ink:var(--ink,#1A2321);--lk-ink2:var(--ink-2,#3A4553);--lk-mut:var(--muted,#5E6A66);--lk-line:var(--line,#DDD8CE);--lk-s1:var(--surface,#fff);--lk-s2:var(--surface-2,#F7F5F0);--lk-r:var(--radius,10px)}
.lk .lk-kick{font:600 11px/1.3 var(--f-mono,ui-monospace,monospace);letter-spacing:.12em;text-transform:uppercase;color:var(--lk-acc);margin:0 0 6px}
.lk .lk-lede{margin:0 0 16px;color:var(--lk-ink2);font-size:15px;line-height:1.6;max-width:68ch}
.lk .lk-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.lk .lk-cards.three{grid-template-columns:repeat(3,minmax(0,1fr))}
.lk .lk-card{display:flex;gap:12px;align-items:flex-start;padding:14px;border:1px solid var(--lk-line);border-radius:var(--lk-r);background:var(--lk-s2)}
.lk .lk-card>svg{flex:none;width:22px;height:22px;margin-top:2px}
.lk svg{fill:none;stroke:var(--lk-acc);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.lk .lk-card b{display:block;font-size:15px;line-height:1.35;color:var(--lk-ink);margin:0 0 4px}
.lk .lk-card p{margin:0;font-size:13.5px;line-height:1.6;color:var(--lk-ink2)}
.lk .lk-bridge{margin:12px 0 0;font-size:13.5px;color:var(--lk-mut)}
.lk .lk-h3{margin:26px 0 4px;font-size:18px;line-height:1.35;color:var(--lk-ink)}
.lk .lk-sub{margin:0 0 10px;font-size:13.5px;color:var(--lk-mut)}
.lk .lk-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}
.lk .lk-tab{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--lk-line);background:var(--lk-s1);color:var(--lk-ink2);border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;line-height:1.2;cursor:pointer}
.lk .lk-tab i{width:9px;height:9px;border-radius:50%;background:var(--g)}
.lk .lk-tab[aria-pressed="true"]{border-color:var(--g);background:color-mix(in srgb,var(--g) 16%,var(--lk-s1));color:var(--lk-ink);font-weight:600}
.lk .lk-tab:focus-visible{outline:2px solid var(--lk-acc);outline-offset:2px}
.lk .lk-kit{border:1px solid var(--lk-line);border-radius:var(--lk-r);overflow:hidden;background:var(--lk-s1)}
.lk .lk-kit-hd{padding:14px 16px;border-left:4px solid var(--g);background:color-mix(in srgb,var(--g) 9%,var(--lk-s1))}
.lk .lk-kit-hd b{display:block;font-size:16px;color:var(--lk-ink)}
.lk .lk-kit-hd p{margin:4px 0 0;font-size:13.5px;line-height:1.6;color:var(--lk-ink2)}
.lk .lk-items{list-style:none;margin:0;padding:0}
.lk .lk-items li{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:10px 16px;border-top:1px solid var(--lk-line)}
.lk .lk-items b{display:block;font-size:14px;font-weight:600;color:var(--lk-ink)}
.lk .lk-items small{display:block;font-size:12.5px;color:var(--lk-mut);margin-top:1px}
.lk .lk-items em{font-style:normal;color:var(--lk-acc)}
.lk .lk-num{font:500 13px var(--f-mono,ui-monospace,monospace);white-space:nowrap;color:var(--lk-ink2)}
.lk .lk-tot{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:12px 16px;border-top:1px solid var(--lk-line);background:var(--lk-s2);font-size:14px;font-weight:600;color:var(--lk-ink)}
.lk .lk-tot b{font:600 17px var(--f-mono,ui-monospace,monospace);white-space:nowrap}
.lk .lk-note{margin:10px 0 0;font-size:12.5px;line-height:1.55;color:var(--lk-mut)}
.lk .lk-wr{display:flex;gap:14px;align-items:center;margin:16px 0 0;padding:14px;border:1px solid var(--lk-line);border-radius:var(--lk-r);background:var(--lk-s2)}
.lk .lk-wr img{flex:none;width:52px;height:52px;border-radius:8px;object-fit:cover}
.lk .lk-wr p{margin:0 0 10px;font-size:14px;line-height:1.6;color:var(--lk-ink2)}
.lk .lk-btn{display:inline-block;background:var(--lk-acc);color:var(--lk-s1);border-radius:999px;padding:8px 16px;font-size:14px;font-weight:600;text-decoration:none}
.lk .lk-btn:hover{filter:brightness(1.08)}
.lk .lk-links{display:flex;flex-wrap:wrap;gap:8px 18px;margin:14px 0 0}
.lk .lk-links a,.lk .lk-all{color:var(--lk-acc);font-size:14px;font-weight:600;text-decoration:none}
.lk .lk-links a:hover,.lk .lk-all:hover{text-decoration:underline}
.lk-strip .lk-strip-hd{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:0 0 14px}
.lk-strip h2{font-family:var(--f-display,inherit);font-size:clamp(22px,3vw,30px);font-weight:600;line-height:1.2;margin:0 0 8px;color:var(--lk-ink)}
.lk-strip .lk-strip-hd .lk-lede{margin:0}
.lk-strip .lk-all{white-space:nowrap}
.lk .lk-figs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.lk .lk-fig{position:relative;display:block;padding:16px 16px 34px;border:1px solid var(--lk-line);border-radius:var(--lk-r);background:var(--lk-s1);color:inherit;text-decoration:none;transition:border-color .15s,transform .15s}
.lk .lk-fig:hover{border-color:var(--lk-acc);transform:translateY(-2px)}
.lk .lk-fig svg{width:22px;height:22px}
.lk .lk-fig b{display:block;margin:10px 0 4px;font:600 24px/1.15 var(--f-mono,ui-monospace,monospace);color:var(--lk-ink)}
.lk .lk-fig p{margin:0;font-size:13.5px;line-height:1.55;color:var(--lk-ink2)}
.lk .lk-fig span{position:absolute;right:14px;bottom:10px;color:var(--lk-acc);font-weight:600}
.lk .lk-tgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.lk .lk-tcard{border:1px solid var(--lk-line);border-radius:var(--lk-r);overflow:hidden;background:var(--lk-s1);display:flex;flex-direction:column}
.lk .lk-ttop{padding:10px 14px;background:var(--g);color:#fff}
.lk .lk-ttop b{display:block;font-size:14px}
.lk .lk-ttop span{font:500 11px var(--f-mono,ui-monospace,monospace);opacity:.9}
.lk .lk-tbody{padding:12px 14px 14px;display:flex;flex-direction:column;flex:1}
.lk .lk-tbody h3{margin:0 0 6px;font-size:15.5px;line-height:1.35;color:var(--lk-ink)}
.lk .lk-tbody p{margin:0 0 8px;font-size:13px;line-height:1.55;color:var(--lk-ink2)}
.lk .lk-tbody ul{margin:0 0 10px;padding-left:18px;font-size:13px;line-height:1.6;color:var(--lk-ink2)}
.lk .lk-tbody em{margin-top:auto;font:600 13px var(--f-mono,ui-monospace,monospace);font-style:normal;color:var(--lk-ink)}
@media (max-width:900px){.lk .lk-figs,.lk .lk-tgrid{grid-template-columns:repeat(2,minmax(0,1fr))}.lk .lk-cards.three{grid-template-columns:1fr}}
@media (max-width:620px){.lk .lk-cards{grid-template-columns:1fr}.lk .lk-items li{flex-direction:column;gap:2px}.lk .lk-num{align-self:flex-start}}
@media (max-width:440px){.lk .lk-figs,.lk .lk-tgrid{grid-template-columns:1fr}.lk .lk-wr{align-items:flex-start}}
@media print{.lk .lk-tabs,.lk .lk-links,.lk .lk-btn{display:none}}`;
  document.head.appendChild(st);
}

window.LIKit = { home, buy, strip, types, groupOf };
})();
