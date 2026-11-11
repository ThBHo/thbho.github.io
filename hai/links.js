/* Related pages strip, shared by Thor's pages and the Hybrid AI Agent Network member sites.
   Put <div data-thor-links></div> where the strip should sit (usually the footer) and load this file.
   Without a placeholder the strip is added at the end of <body>. It follows <html lang> and updates
   when a page switches language. The current page is left out; agency sites leave each other out. */
(function () {
  var L = ["th", "en", "zh", "ru", "es", "ko", "ja"];
  var HEAD = { th: "หน้าที่เกี่ยวข้อง", en: "Related pages", zh: "相关页面", ru: "Связанные страницы", es: "Páginas relacionadas", ko: "관련 페이지", ja: "関連ページ" };
  var PAGES = [
    { f: "ThorRealProfile", n: "Thor Ayanundana", d: { th: "โปรไฟล์และผลงาน", en: "Profile & work", zh: "个人简介与作品", ru: "Профиль и работы", es: "Perfil y trabajos", ko: "프로필 및 작업", ja: "プロフィールと実績" } },
    { f: "HybridAIAgentNetwork", n: "Hybrid AI Agent Network", d: { th: "เครือข่ายเอเจนต์อสังหาฯ", en: "Real estate agent network", zh: "房产经纪人网络", ru: "Сеть агентов недвижимости", es: "Red de agentes inmobiliarios", ko: "부동산 에이전트 네트워크", ja: "不動産エージェントネットワーク" } },
    { f: "ASNProperty", n: "ASN Exclusive Property", agency: 1, d: { th: "บ้าน คอนโด ที่ดิน พัทยา", en: "Pattaya homes, condos & land", zh: "芭提雅房屋、公寓与土地", ru: "Дома, кондо и земля в Паттайе", es: "Casas, condos y terrenos en Pattaya", ko: "파타야 주택·콘도·토지", ja: "パタヤの住宅・コンド・土地" } },
    { f: "Riviera2Resale", n: "R2 by Clare", agency: 1, d: { th: "The Riviera Jomtien รีเซล", en: "The Riviera Jomtien resale", zh: "The Riviera Jomtien 二手房", ru: "Вторичка The Riviera Jomtien", es: "Reventa The Riviera Jomtien", ko: "The Riviera Jomtien 재판매", ja: "The Riviera Jomtien リセール" } },
    { f: "LivingInsight", n: "Thailand Living Insight", d: { th: "คู่มือก่อนซื้อบ้านในไทย", en: "Buyer's guide to Thailand", zh: "泰国购房指南", ru: "Гид покупателя по Таиланду", es: "Guía del comprador en Tailandia", ko: "태국 주택 구매 가이드", ja: "タイの住宅購入ガイド" } },
    { f: "SafeLiving", n: "Safe Living", d: { th: "ข้อมูลภัยธรรมชาติรายพื้นที่", en: "Natural-hazard data by area", zh: "各地区自然灾害数据", ru: "Природные риски по районам", es: "Riesgos naturales por zona", ko: "지역별 자연재해 데이터", ja: "地域別の自然災害データ" } },
    { f: "EngWiderooms", n: "WIDEROOMS", d: { th: "ตกแต่งภายใน · smart home · คอนเทนต์ทรัพย์", en: "Interiors · smart home · property content", zh: "室内设计 · 智能家居 · 房产内容", ru: "Интерьер · умный дом · контент", es: "Interiores · smart home · contenido", ko: "인테리어 · 스마트홈 · 부동산 콘텐츠", ja: "インテリア · スマートホーム · 物件コンテンツ" } },
    { f: "AIGymmateXFactory", n: "Hybrid AI by ThB.Ho", d: { th: "สตูดิโอ Hybrid AI Persona และคอนเทนต์", en: "Hybrid AI persona & content studio", zh: "Hybrid AI 人设与内容工作室", ru: "Студия Hybrid AI персон и контента", es: "Estudio de personas y contenido Hybrid AI", ko: "Hybrid AI 페르소나·콘텐츠 스튜디오", ja: "Hybrid AI ペルソナ & コンテンツスタジオ" } }
  ];
  var here = (location.pathname.split("/").pop() || "").replace(/\.html$/, "");
  var hereBase = here.replace(/-.*$/, "");                 // Riviera2Resale-8A03 → Riviera2Resale, LivingInsight-EEC → LivingInsight
  var hereP = PAGES.filter(function (p) { return p.f === hereBase; })[0];
  var from = (new URLSearchParams(location.search).get("from") || "").toLowerCase();   // shared guides opened from a member site
  var skip = from === "r2" ? "ASNProperty" : from === "asn" ? "Riviera2Resale" : "";
  var list = PAGES.filter(function (p) {
    if (p.f === here || p.f === skip) return false;       // the page itself (sub-pages keep a link to their hub)
    if (hereP && hereP.agency && p.agency) return false;  // agency sites leave each other out
    return true;
  });

  var css = ".trl{max-width:1180px;margin:0 auto;padding:20px 16px;box-sizing:border-box;color:inherit;font-family:inherit;text-align:left}" +
    ".trl-h{display:block;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;opacity:.7;margin:0 0 10px}" +
    ".trl-l{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}" +
    ".trl-l a{display:block;padding:8px 13px;border-radius:12px;border:1px solid color-mix(in srgb,currentColor 24%,transparent);color:inherit;text-decoration:none;line-height:1.3;transition:border-color .2s,background .2s}" +
    ".trl-l a:hover,.trl-l a:focus-visible{border-color:currentColor;background:color-mix(in srgb,currentColor 7%,transparent)}" +
    ".trl-l b{display:block;font-size:14px;font-weight:600}.trl-l small{display:block;font-size:12px;opacity:.72;margin-top:2px}" +
    "@media (max-width:560px){.trl-l{display:grid;grid-template-columns:1fr 1fr}.trl-l a{height:100%;box-sizing:border-box;padding:8px 10px}.trl-l b{font-size:13px}.trl-l small{font-size:11.5px}}";

  function lang() {
    var l = (document.documentElement.lang || "en").toLowerCase().slice(0, 2);
    return L.indexOf(l) > -1 ? l : "en";
  }
  function render(box) {
    var l = lang();
    box.innerHTML = '<nav class="trl" aria-label="' + HEAD[l] + '"><span class="trl-h">' + HEAD[l] + '</span><ul class="trl-l">' +
      list.map(function (p) {
        return '<li><a href="https://thbho.com/' + p.f + '.html"><b>' + p.n + "</b><small>" + (p.d[l] || p.d.en) + "</small></a></li>";
      }).join("") + "</ul></nav>";
    box.setAttribute("data-l", l);
  }
  function init() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    if (!document.querySelector("[data-thor-links]")) { var d = document.createElement("div"); d.setAttribute("data-thor-links", ""); document.body.appendChild(d); }
    var sync = function () {                              // also catches placeholders that a page re-renders (Living Insight)
      [].forEach.call(document.querySelectorAll("[data-thor-links]"), function (b) { if (b.getAttribute("data-l") !== lang()) render(b); });
    };
    sync();
    new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"], childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
