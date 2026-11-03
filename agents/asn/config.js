/* =====================================================================
   HOW TO UPDATE LISTINGS
   ---------------------------------------------------------------------
   The Google Sheet is the single source of every listing (both the first
   lot H01–H14/C01–C05/B01/L01–L02 and the Facebook lot H15+), since
   28 Oct 2026. Edit tab "ตรวจสอบจาก Facebook" (one row per property);
   tab Listings (FILTER formula) publishes the rows with column A = "Y"
   and at least one photo. Column A = "N" takes a listing off the page
   (e.g. rented out) while its row stays as back-office data.
   Column X (photos) is an ARRAYFORMULA built from column Y (photo count).
   LISTINGS below is only a snapshot: it paints the page for the moment
   before the Sheet arrives (or if the Sheet cannot be reached) and keeps
   the few extras the Sheet has no column for (translated land names,
   land deed/road/coordinates, saleAsk). A listing missing from the Sheet
   is not shown, even if it is in LISTINGS.
   Never put the full address, owner name/phone, commission or the
   lowest negotiable price here — this page is public.
   ===================================================================== */
const SHEET_CSV = "https://docs.google.com/spreadsheets/d/1c2GnMuGXetQS6-zf46TywNQgPg1PdwJ70rswXMoGwso/gviz/tq?tqx=out:csv&sheet=Listings"; // live listings: public read-only copy (IMPORTRANGE of the private ASN Sheet, tab Listings)
const UPDATED = "2026-10-17";
const PHOTO_DATE = "2026-10-17";   // default photo upload date; override per listing with photoDate

const CONTACT = {
  company: "ASN Exclusive Property Co., Ltd.",
  companyTh: "บริษัท เอเอสเอ็น เอ็กซ์คลูซีฟ พร็อพเพอร์ตี้ จำกัด",
  address: "38/20 หมู่ที่ 1 ต.หนองปรือ อ.บางละมุง จ.ชลบุรี 20150",
  person: "Moshi",
  phones: ["0805636244", "0817996959"],
  line: "Moshikungzz",
  whatsapp: "66805636244",
  telegram: "+66805636244",
  wechatQr: "asn-img/wechat-qr.jpg",
  email: "asn.exclusive.property@gmail.com",
  facebook: "https://www.facebook.com/share/1E3951oUMg/?mibextid=wwXIfr",        // page: ASN Sale Rent Property
  facebookName: "ASN Sale Rent Property",                                         // label shown on the contact card
  facebookAgent: "https://www.facebook.com/share/1UgoQ4tJRB/?mibextid=wwXIfr"    // Moshi
};

// approximate zone centres — never exact property positions
const ZONES = {
  mapprachan:  { ll: [12.9205, 100.9545] },
  siamcc:      { ll: [12.9105, 100.9310] },
  khaotalo:    { ll: [12.9020, 100.9120] },
  eastpattaya: { ll: [12.9330, 100.9230] },
  pattanakarn: { ll: [12.9225, 100.9010] },
  thappraya:   { ll: [12.9120, 100.8800] },
  pratumnak:   { ll: [12.9230, 100.8695] },
  jomtien:     { ll: [12.8960, 100.8710] },
  sattahip:    { ll: [12.72, 100.925], land: true },
  huaiyai:     { ll: [12.835, 100.96], land: true },
  thungklom:   { ll: [12.9075, 100.9195] },
  chaiyapruk:  { ll: [12.8885, 100.8940] },
  nongprue:    { ll: [12.9335, 100.9030] },
  najomtien:   { ll: [12.8010, 100.9140] },
  southpattaya:{ ll: [12.9180, 100.8820] },
  northpattaya:{ ll: [12.9530, 100.8890] },
  nongplalai:  { ll: [12.9300, 100.9720] },
  khaonoi:     { ll: [12.9205, 100.8960] },
  pattaya:     { ll: [12.9276, 100.8771] }
};

// land and usable area in sqm; null = not yet confirmed (shows "ask")
const LISTINGS = [
  { code:"H02", name:"Siam Royal View Luxury Pool Villa", type:"villa", zone:"khaotalo", rent:500000, sale:110000000, beds:7, baths:8, land:2146, usable:null, pool:"private", style:"modern", tags:["maid3","basketball","theater"], photos:20, photoDate:"2026-10-21", hot:true },
  { code:"H01", name:"Modern Pool Villa · Lake Mapprachan", type:"villa", zone:"mapprachan", rent:145000, sale:24950000, beds:5, baths:5, land:480, usable:570, pool:"private", style:"modern", tags:["storey3"], photos:20, photoDate:"2026-10-21", hot:true },
  { code:"H04", name:"Luxury Pool Villa · Lake Mapprachan", type:"villa", zone:"mapprachan", rent:null, sale:68900000, beds:5, baths:10, land:1632, usable:1200, usablePlus:true, pool:"private", style:"modern", tags:[], photos:20, youtube:"hBqn9Jm-dL4", video:"asn-img/H04.mp4", poster:"asn-img/H04-video.jpg" },
  { code:"C01", name:"The Riviera Jomtien · Corner Unit, 32F", type:"condo", zone:"jomtien", rent:null, sale:7200000, beds:null, baths:null, size:81.3, floor:"32", building:"D", pool:"shared", style:"modern", tags:["corner","thaiQuota","seaView"], urgent:true, photos:20, photoDate:"2026-10-21", hot:true },
  { code:"H12", name:"Pool Villa · Lake Mapprachan", type:"villa", zone:"mapprachan", rent:90000, rentWas:100000, sale:null, beds:5, baths:5, land:null, usable:null, pool:"private", style:"classic", tags:[], photos:20, photoDate:"2026-10-21" },
  { code:"H06", name:"Siam Royal Village", type:"villa", zone:"eastpattaya", rent:90000, rentWas:110000, sale:null, beds:3, baths:3, land:520, usable:null, pool:"private", style:"modern", tags:[], photos:20, photoDate:"2026-10-21", hot:true },
  { code:"H03", name:"Royal Park Village", type:"villa", zone:"thappraya", rent:120000, sale:28000000, beds:6, baths:6, land:380, usable:800, pool:"private", style:"modern", tags:["rooftop"], photos:10, photoDate:"2026-10-21" },
  { code:"H14", name:"Santa Maria · Lake Mapprachan", type:"house", zone:"mapprachan", rent:120000, sale:22500000, beds:4, baths:5, land:1200, usable:450, pool:"private", style:"classic", tags:[], photos:20, hot:true, photoDate:"2026-10-21" },
  { code:"H05", name:"Paradise Villa", type:"villa", zone:"eastpattaya", rent:120000, sale:22000000, beds:4, baths:4, land:1500, usable:500, pool:"private", style:"classic", tags:["basketball"], photos:10, photoDate:"2026-10-21" },
  { code:"H10", name:"Siam Royal View · 2 Bedrooms", type:"villa", zone:"khaotalo", rent:80000, sale:18500000, beds:2, baths:2, land:540, usable:null, pool:"private", style:"tropical", tags:[], photos:10, photoDate:"2026-10-21" },
  { code:"H09", name:"Silk Road Place", type:"villa", zone:"eastpattaya", rent:64000, sale:14800000, beds:3, baths:2, land:452, usable:null, pool:"private", style:"classic", tags:["waterGarden"], photos:10, photoDate:"2026-10-21" },
  { code:"H11", name:"Siam Royal View Village", type:"villa", zone:"khaotalo", rent:110000, sale:null, beds:4, baths:6, land:1040, usable:null, pool:"private", style:"tropical", tags:["outdoorKitchen"], photos:10, photoDate:"2026-10-21" },
  { code:"H07", name:"Pool Villa · Pattanakarn Rd", type:"villa", zone:"pattanakarn", rent:65000, sale:8250000, beds:3, baths:2, land:null, usable:null, pool:"private", style:"modern", tags:["nearSchool"], photos:10, photoDate:"2026-10-21" },
  { code:"H13", name:"Green Field 4 Villa", type:"villa", zone:"siamcc", rent:85000, sale:null, beds:5, baths:4, land:900, usable:256, pool:"yes", style:"modern", tags:[], photos:10, photoDate:"2026-10-21" },
  { code:"H08", name:"SP Village 5", type:"house", zone:"siamcc", rent:85000, sale:null, beds:3, baths:5, land:440, usable:270, pool:"private", style:"modern", tags:[], photos:10, photoDate:"2026-10-21" },
  { code:"C02", name:"Duplex · Pratumnak Soi 4", type:"condo", zone:"pratumnak", rent:66000, sale:null, beds:3, baths:2, size:200, floor:"6–7", pool:"shared", style:"modern", tags:["duplex","seaView"], photos:10, photoDate:"2026-10-21" },
  { code:"C03", hidden:true, name:"The Riviera Jomtien · 8A05 The Host Suite", type:"condo", zone:"jomtien", rent:null, sale:4019000, saleWas:6193440, beds:1, baths:null, size:46.92, floor:"8", building:"A", pool:"shared", style:"modern", tags:["seaView","thaiQuota"], furn:"full", isNew:true, photos:8, video:"asn-img/C03.mp4", poster:"asn-img/C03-1.jpg", photoDate:"2026-09-22" },
  { code:"C04", name:"The Riviera Jomtien · 9A02 The Quiet Retreat", type:"condo", zone:"jomtien", rent:null, sale:2867522, saleWas:4341120, beds:1, baths:null, size:32.64, floor:"9", building:"A", pool:"shared", style:"modern", tags:["seaView","thaiQuota"], furn:"full", isNew:true, photos:6, photoDate:"2026-09-22" },
  { code:"C05", name:"The Riviera Jomtien · 19E02", type:"condo", zone:"jomtien", rent:null, sale:3296660, saleWas:4107880, beds:1, baths:null, size:34.52, floor:"19", building:"E", pool:"shared", style:"modern", tags:["cityView","thaiQuota"], furn:"full", isNew:true, photos:8, photoDate:"2026-09-21" },
  { code:"B01", name:"The Riviera Jomtien · Commercial Unit G Floor", type:"commercial", zone:"jomtien", rent:null, sale:14542361, beds:null, baths:null, size:182.75, floor:"G", pool:null, style:"modern", tags:["roadFront","thaiQuota"], furn:"none", isNew:true, photos:11, photoDate:"2026-10-20" },
  { code:"L01", name:"Sattahip (Sukhumvit–Sattahip Soi 105)", names:{"th": "สัตหีบ (สุขุมวิท-สัตหีบ ซอย 105)", "en": "Sattahip (Sukhumvit–Sattahip Soi 105)", "ru": "Саттахип (Сукхумвит–Саттахип, Сой 105)", "zh": "梭桃邑（素坤逸–梭桃邑路105巷）", "ko": "사타힙 (수쿰윗–사타힙 105번 골목)", "ja": "サッタヒープ（スクンビット–サッタヒープ ソイ105）"}, type:"land", zone:"sattahip", rent:null, sale:3105000, beds:null, baths:null, land:828, deed:"chanote", road:"concrete", elec:true, near:"sukhumvit105", ll:[12.669636, 100.934927], szHide:["szCoast"], style:"land", tags:["cleared","residential","twoDeeds"], photos:11, photoDate:"2026-10-25" },
  { code:"L03", name:"Mountain-View Land · Phlu Ta Luang, Sattahip", names:{"th": "ที่ดินวิวเขา พลูตาหลวง · สัตหีบ", "en": "Mountain-View Land · Phlu Ta Luang, Sattahip", "ru": "Участок с видом на горы · Пхлу Та Луанг, Саттахип", "zh": "山景土地 · 梭桃邑 Phlu Ta Luang", "ko": "산 전망 토지 · 사타힙 플루타루앙", "ja": "山の見える土地 · サッタヒープ（プルータールアン）"}, type:"land", zone:"sattahip", rent:null, sale:7545000, beds:null, baths:null, land:2012, deed:"chanote", plots:6, road:"asphalt", elec:true, near:"phluTaLuang", ll:[12.716389, 100.966389], szHide:["szCoast"], style:"land", tags:["cleared","mountainView","roadFront","sixDeeds","plotSplit"], photos:17, photoDate:"2026-11-01" },
  { code:"L03A", name:"Land Plot 1/6 · Phlu Ta Luang, Sattahip", parent:"L03", plotNo:1, type:"land", zone:"sattahip", rent:null, sale:1740000, beds:null, baths:null, land:464, deed:"chanote", road:"asphalt", elec:true, near:"phluTaLuang", ll:[12.71591129, 100.9664149], szHide:["szCoast"], style:"land", tags:["cleared", "mountainView", "roadFront", "plotSplit"], photos:7, photoDate:"2026-11-01" },
  { code:"L03B", name:"Land Plot 2/6 · Phlu Ta Luang, Sattahip", parent:"L03", plotNo:2, type:"land", zone:"sattahip", rent:null, sale:825000, beds:null, baths:null, land:220, deed:"chanote", road:"asphalt", elec:true, near:"phluTaLuang", ll:[12.7160446, 100.96636442], szHide:["szCoast"], style:"land", tags:["cleared", "mountainView", "roadFront", "plotSplit"], photos:7, photoDate:"2026-11-01" },
  { code:"L03C", name:"Land Plot 3/6 · Phlu Ta Luang, Sattahip", parent:"L03", plotNo:3, type:"land", zone:"sattahip", rent:null, sale:825000, beds:null, baths:null, land:220, deed:"chanote", road:"asphalt", elec:true, near:"phluTaLuang", ll:[12.7161308, 100.96634278], szHide:["szCoast"], style:"land", tags:["cleared", "mountainView", "roadFront", "plotSplit"], photos:7, photoDate:"2026-11-01" },
  { code:"L03D", name:"Land Plot 4/6 · Phlu Ta Luang, Sattahip", parent:"L03", plotNo:4, type:"land", zone:"sattahip", rent:null, sale:825000, beds:null, baths:null, land:220, deed:"chanote", road:"asphalt", elec:true, near:"phluTaLuang", ll:[12.71622044, 100.96631958], szHide:["szCoast"], style:"land", tags:["cleared", "mountainView", "roadFront", "plotSplit"], photos:7, photoDate:"2026-11-01" },
  { code:"L03E", name:"Land Plot 5/6 · Phlu Ta Luang, Sattahip", parent:"L03", plotNo:5, type:"land", zone:"sattahip", rent:null, sale:825000, beds:null, baths:null, land:220, deed:"chanote", road:"asphalt", elec:true, near:"phluTaLuang", ll:[12.7163116, 100.96629644], szHide:["szCoast"], style:"land", tags:["cleared", "mountainView", "roadFront", "plotSplit"], photos:7, photoDate:"2026-11-01" },
  { code:"L03F", name:"Land Plot 6/6 · Phlu Ta Luang, Sattahip", parent:"L03", plotNo:6, type:"land", zone:"sattahip", rent:null, sale:2505000, beds:null, baths:null, land:668, deed:"chanote", road:"asphalt", elec:true, near:"phluTaLuang", ll:[12.71649532, 100.96626422], szHide:["szCoast"], style:"land", tags:["cleared", "mountainView", "roadFront", "plotSplit"], photos:7, photoDate:"2026-11-01" },
  { code:"L04", name:"Corner Land Plot · Phlu Ta Luang, Sattahip", names:{"th": "ที่ดินหัวมุม พลูตาหลวง · สัตหีบ", "en": "Corner Land Plot · Phlu Ta Luang, Sattahip", "ru": "Угловой участок · Пхлу Та Луанг, Саттахип", "zh": "转角土地 · 梭桃邑 Phlu Ta Luang", "ko": "코너 토지 · 사타힙 플루타루앙", "ja": "角地 · サッタヒープ（プルータールアン）"}, type:"land", zone:"sattahip", rent:null, sale:null, saleAsk:true, beds:null, baths:null, land:null, road:"asphalt", elec:true, near:"phluTaLuang1077", ll:[12.71578, 100.96741], llSrc:"gps", szHide:["szCoast"], style:"land", tags:["cleared","cornerPlot","roadFront","mountainView"], photos:13, photoDate:"2026-11-01" },
  { code:"H96", name:"New 2-Storey House near U-Tapao Airport · Sattahip", type:"house", zone:"sattahip", rent:null, sale:4300000, beds:null, baths:null, furn:"none", style:"modern", tags:[], photos:17, photoDate:"2026-11-01" },
  { code:"L02", name:"Treed Land Plot · Sattahip", names:{"th": "ที่ดินมีต้นไม้ใหญ่ · สัตหีบ", "en": "Treed Land Plot · Sattahip", "ru": "Участок с деревьями · Саттахип", "zh": "带大树的土地 · 梭桃邑", "ko": "큰 나무가 있는 토지 · 사타힙", "ja": "大きな木のある土地 · サッタヒープ"}, type:"land", zone:"sattahip", rent:null, sale:null, saleAsk:true, beds:null, baths:null, land:null, deed:"chanote", road:"dirt", szHide:["szCoast"], style:"land", tags:["trees"], photos:8, photoDate:"2026-10-25" }
].filter(l => !l.hidden); // snapshot only (see HOW TO UPDATE LISTINGS); the Sheet column A decides what is shown
// Optional per-listing fields (shown as "ask" until filled):
//   photoDate:"2026-10-17"   // date this listing's photos were uploaded
//   deposit:"2 months", minContract:"1 year", pets:true|false, furn:"full"|"part"|"none",
//   parking:2, internet:true, available:"2026-11-01", shortTerm:4500 (per night),
//   booked:[["2026-11-10","2026-12-20"]]   // calendar — rented / reserved ranges

// real customer reviews only; the section stays hidden while this is empty
const REVIEWS = [
  // { name:"Anna, Germany", stars:5, text:"…", date:"2026-10" }
];

const SLIDES = [["H100",1],["H99",1],["H98",1],["H97",1],["H95",1],["H94",1],["H93",1],["H92",1],["H91",1],["H90",1],["H04",1],["H02",1],["H12",1],["H14",4],["H06",3],["C01",5]];  // one photo per listing (Thor 29 Oct); newest listings go first
const FEATURED = ["H04","H01","H02","C01","H06","H14"];
// Sattahip listings and land go at the end of TOP_PICKS and never in SLIDES (Thor 1 Nov 2026)
// TOP_PICKS: the 54 standout listings (not counting FEATURED; 60 shown in all; the grid shows 12 at a time with a "+ more" button), in the order they lead the list.
// Listings whose photos are fully AI-retouched go first; ones still on original photos go last.
// Only TOP_PICKS + FEATURED are shown in the list, map, stats and matching; every other listing is hidden
// but still opens by its own link (#/l/CODE, asn/CODE.html). Set TOP_PICKS = [] to show everything again.
const TOP_PICKS = ["H100","H99","H98","H97","H95","H94","H93","H92","H91","H90","H81","H19","H87","C04","H80","H43","H86","H60","H76","C02","H82","H70","H16","B02","H63","H23","C06","H85","H83","H20","H15","H05","H28","H55","B01","H68","H65","H33","H49","H72","H37","H12","H10","H40","H36","H09","H27","H61","H18","H07","H34","H73","H75","H77","H78","H44","H35","H96","L01","L03","L04"];


/* Paths and names the engine uses for this agent */
const SITE = {
  id: "asn",                              // short id: share pages live in <id>/CODE.html, storage keys start with <id>-
  name: "ASN Exclusive Property",
  short: "ASN", tag: "EXCLUSIVE PROPERTY", // flyer / print brand block
  img: "asn-img/",                        // listing photos <img><CODE>-<n>.jpg, logos
  share: "asn/",                          // LINE/Facebook share pages
  store: "asn-",                          // localStorage prefix
  styleJson: "asn-style.json",            // house persona per listing (Sheet listings)
  hlJson: "asn-hl.json",                  // highlights per listing
  emblem: "asn-img/logo-emblem.png",
  matchHero: "asn-img/H14-4.jpg",         // hero photo on the matching page
  safeLiving: "ASNSafeLiving.html",
  showAll: true,                          // list every active listing (TOP_PICKS sets the order only), Thor 3 Nov 2026
  why: ["100+", "6", "1:1"],              // About stats (labels: T.why1..why3)
  tags: { base: "#Pattaya #PattayaRealEstate #PoolVilla", condo: "#PattayaCondo", commercial: "#PattayaCommercial", house: "#PattayaHouse", brand: "#ASNExclusiveProperty" } // social caption hashtags
};

/* Project names that replace the zone in a listing title (Thor 1 Nov 2026) */
const PROJECTS = [[/riviera/i, "The Riviera Jomtien"], [/prime habitat/i, "Prime Habitat"]];
