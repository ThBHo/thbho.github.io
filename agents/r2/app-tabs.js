/* R2 by Clare · installed phone app (PWA) · 21 Nov 2026
   Loaded only on the main, matching and destiny pages (build.py), never on unit pages (they are shared by every agent).
   hai/pwa.js (shared, Core chat) shows the bottom tab bar only when the page is opened from the home-screen icon.
   App screens split the long home page by tab; sections are only hidden, never removed. */
window.HAI_APP = { tabs: [
  { id: "home", href: "#/", icon: "home", match: "^#?/?$", label: { th: "หน้าแรก", en: "Home", ru: "Главная", zh: "首页", ko: "홈", ja: "ホーム" } },
  { id: "units", href: "#/units", icon: "search", match: "^#/units|^#unit-", label: { th: "ค้นหาห้อง", en: "Units", ru: "Квартиры", zh: "房源", ko: "매물", ja: "物件" } },
  { id: "saved", icon: "star", label: { th: "ที่บันทึก", en: "Saved", ru: "Избранное", zh: "收藏", ko: "저장", ja: "保存" },
    act() { if (window.R2App) R2App.showSaved(); } },
  { id: "contact", href: "#/contact", icon: "chat", match: "^#/contact", label: { th: "ติดต่อ", en: "Contact", ru: "Связь", zh: "联系", ko: "문의", ja: "連絡" } }
],
  container: "#homeView",
  screens: [
    { match: "^#?/?$", show: ["#phero", "#hl"], more: true },
    { match: "^#/units", show: [".hero", ".controls", "main"] },
    { match: "^#/about", show: [".intro", ".pvid", "#pfHome", "#netTools"] },
    { match: "^#/contact", show: [".info", "footer"] }
  ],
  more: { after: "#phero",
    title: { th: "เมนูอื่น", en: "More", ru: "Ещё", zh: "更多", ko: "더 보기", ja: "その他" },
    links: [
      { href: "#/units", icon: "🏢", label: { th: "ห้องทั้งหมด + ผังชั้น", en: "All units + floor plan", ru: "Все квартиры + план", zh: "全部房源 + 楼层图", ko: "전체 매물 + 층별 배치", ja: "全物件 + フロア図" } },
      { href: "#matching", icon: "🧭", label: { th: "จับคู่ห้อง MBTI", en: "MBTI unit match", ru: "Подбор по MBTI", zh: "MBTI 匹配", ko: "MBTI 매칭", ja: "MBTI マッチ" } },
      { href: "#destiny", icon: "✨", label: { th: "ดวงและฮวงจุ้ย", en: "Destiny & feng shui", ru: "Судьба и фэн-шуй", zh: "命理与风水", ko: "운세·풍수", ja: "運勢と風水" } },
      { href: "#/about", icon: "🎬", label: { th: "วิดีโอและโครงการ", en: "Video & project", ru: "Видео и проект", zh: "视频与项目", ko: "영상·프로젝트", ja: "動画とプロジェクト" } },
      { href: "#/contact", icon: "📞", label: { th: "ติดต่อทีมขาย", en: "Contact the team", ru: "Связаться", zh: "联系销售", ko: "영업팀 문의", ja: "営業に連絡" } }
    ] }
};
/* separate matching / destiny files: tabs lead back into the main page */
if (window.SUB_PAGE) {
  const fix = x => { if (x.href && x.href[0] === "#") x.href = "Riviera2Resale.html" + x.href; };
  HAI_APP.tabs.forEach(fix); HAI_APP.more.links.forEach(fix); delete HAI_APP.screens;
}
