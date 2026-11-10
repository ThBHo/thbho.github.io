/* Hybrid AI Agent Network · member registry
   One entry per member agent. Shared pages (SafeLiving.html, later Living Insight and the network page) read
   their branding from here when opened with ?from=<id>. Add a member here when its site goes live.
   Owner: THOR · WIDEROOMS https://thbho.com/EngWiderooms.html · Hybrid AI by ThB.Ho https://thbho.com/AIGymmateXFactory.html
   Fields: name, short, home (page shell), listing(code) → URL, all (all listings), contact, favicon,
           hero { src, alt, cap{lang} }, show [ {code, img} ] (3 homes for Safe Living), region (hai/regions file). */
const HAI_AGENTS = {
  asn: {
    name: "ASN Exclusive Property", short: "ASN", region: "pattaya-eec",
    home: "ASNProperty.html", listing: c => `ASNProperty.html#/l/${c}`, all: "ASNProperty.html#/listings", contact: "ASNProperty.html#/contact",
    favicon: "asn-img/favicon.png",
    hero: { src: "asn-img/H22-1.jpg", alt: "บ้านพูลวิลล่าในพัทยา มุมสูง",
      cap: { th: "ทรัพย์ ASN ในพัทยา — เมืองที่ลาดเอียงลงทะเลและอยู่นอกเขตควบคุมแผ่นดินไหว", en: "An ASN home in Pattaya — a city sloping to the sea, outside the seismic-design zones", ru: "Дом ASN в Паттайе — город с уклоном к морю, вне зон сейсмического проектирования", zh: "ASN 在芭提雅的房源——城市地势向海倾斜，且不在抗震设计区内", ko: "파타야의 ASN 매물 — 바다 쪽으로 경사진 도시, 내진설계 의무 지역 밖", ja: "パタヤのASN物件 — 海に向かって傾斜した街、耐震設計の対象地域外" } },
    show: [{ code: "H01", img: "asn-img/H01-1.jpg" }, { code: "C02", img: "asn-img/C02-1.jpg" }, { code: "H19", img: "asn-img/H19-1.jpg" }]
  },
  r2: {
    name: "R2 by Clare · Clare Pattaya Property", short: "R2 by Clare", region: "pattaya-eec",
    home: "Riviera2Resale.html", listing: c => `Riviera2Resale-${c}.html`, all: "Riviera2Resale.html", contact: "Riviera2Resale.html#contact",
    favicon: "riviera-img/logo-mark.png",
    hero: { src: "riviera-img/hero-3.jpg", alt: "The Riviera Jomtien",
      cap: { th: "The Riviera Jomtien ริมหาดจอมเทียน พัทยา — เมืองที่ลาดเอียงลงทะเลและอยู่นอกเขตควบคุมแผ่นดินไหว", en: "The Riviera Jomtien on Jomtien Beach, Pattaya — a city sloping to the sea, outside the seismic-design zones", ru: "The Riviera Jomtien на пляже Джомтьен, Паттайя — город с уклоном к морю, вне зон сейсмического проектирования", zh: "芭提雅宗滴恩海滩的 The Riviera Jomtien——城市地势向海倾斜，且不在抗震设计区内", ko: "파타야 좀티엔 해변의 The Riviera Jomtien — 바다 쪽으로 경사진 도시, 내진설계 의무 지역 밖", ja: "パタヤ・ジョムティエンビーチの The Riviera Jomtien — 海に向かって傾斜した街、耐震設計の対象地域外" } },
    show: [{ code: "36E09", img: "riviera-img/36E09-1.jpg" }, { code: "19E02", img: "riviera-img/19E02-1.jpg" }, { code: "18E10", img: "riviera-img/18E10-1.jpg" }]
  }
};
/* Pages opened without ?from show the network itself. */
const HAI_NETWORK = { name: "Hybrid AI Agent Network", favicon: "insight/logo-thho.jpg", short: "Hybrid AI Agent Network", home: "HybridAIAgentNetwork.html", all: "HybridAIAgentNetwork.html", contact: "HybridAIAgentNetwork.html#join" };
/* ?from=<id> (or the last one remembered in this browser) → member entry, else null */
function haiAgent() {
  let id = "";
  try { id = (new URLSearchParams(location.search).get("from") || "").toLowerCase(); } catch (e) {}
  if (!HAI_AGENTS[id]) { try { id = sessionStorage.getItem("hai-from") || ""; } catch (e) { id = ""; } }
  if (!HAI_AGENTS[id]) return null;
  try { sessionStorage.setItem("hai-from", id); } catch (e) {}
  return Object.assign({ id }, HAI_AGENTS[id]);
}
