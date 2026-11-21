/* Hybrid AI · install the page as a phone app (PWA) · shared by agent pages · 21 Nov 2026
   Needs in the page <head>: <link rel="manifest" href="..."> (the agent's own manifest).
   - registers /hai-sw.js
   - on phones, shows one small "install app" card (not in the installed app, not again for 14 days after closing)
     Android/Chrome: real install button · iPhone Safari: Share → Add to Home Screen steps
     LINE / Facebook / Instagram in-app browsers: ask to open in Safari or Chrome first */
(function () {
  if (window.HAIPwa) return; window.HAIPwa = true;
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("/hai-sw.js").catch(() => {}));

  const ua = navigator.userAgent || "";
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const phone = /Android|iPhone|iPad|iPod/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
  const ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
  const inApp = /\bLine\/|FBAN|FBAV|Instagram|MicroMessenger/i.test(ua);
  const KEY = "hai-pwa-later", DAYS = 14;
  let later = 0; try { later = +localStorage.getItem(KEY) || 0; } catch (e) {}
  if (standalone || !phone || Date.now() - later < DAYS * 864e5) return;

  const TX = {
    th: { t: "ติดตั้งเป็นแอปบนมือถือ", s: "เปิดได้จากหน้าจอโฮมเหมือนแอป ไม่ต้องโหลดจาก App Store", b: "ติดตั้ง", l: "ไว้ทีหลัง",
      ios: "กดปุ่มแชร์ [SH] ด้านล่างของ Safari แล้วเลือก <b>“เพิ่มไปยังหน้าจอโฮม”</b>", app: "เปิดหน้านี้ใน Safari หรือ Chrome ก่อน (กด ⋯ แล้วเลือกเปิดในเบราว์เซอร์) จึงจะติดตั้งได้" },
    en: { t: "Install as a phone app", s: "Open it from your home screen like an app, no App Store needed", b: "Install", l: "Later",
      ios: "Tap the Share button [SH] in Safari, then <b>“Add to Home Screen”</b>", app: "Open this page in Safari or Chrome first (tap ⋯ → open in browser) to install it" },
    zh: { t: "安装为手机应用", s: "像应用一样从主屏幕打开，无需 App Store", b: "安装", l: "以后再说",
      ios: "点 Safari 的分享按钮 [SH]，再选 <b>“添加到主屏幕”</b>", app: "请先在 Safari 或 Chrome 中打开此页（点 ⋯ → 在浏览器中打开）再安装" },
    ko: { t: "휴대폰 앱으로 설치", s: "앱처럼 홈 화면에서 열기, App Store 필요 없음", b: "설치", l: "나중에",
      ios: "Safari의 공유 버튼 [SH]을 누른 뒤 <b>“홈 화면에 추가”</b>를 선택하세요", app: "먼저 Safari 또는 Chrome에서 이 페이지를 여세요 (⋯ → 브라우저에서 열기)" },
    ja: { t: "スマホのアプリとして追加", s: "ホーム画面からアプリのように開けます。App Store 不要", b: "追加", l: "あとで",
      ios: "Safari の共有ボタン [SH] から <b>「ホーム画面に追加」</b> を選んでください", app: "まず Safari または Chrome でこのページを開いてください（⋯ → ブラウザで開く）" },
    ru: { t: "Установить как приложение", s: "Открывайте с главного экрана, без App Store", b: "Установить", l: "Позже",
      ios: "Нажмите «Поделиться» [SH] в Safari и выберите <b>«На экран Домой»</b>", app: "Сначала откройте страницу в Safari или Chrome (⋯ → открыть в браузере)" }
  };
  const SH = '<svg class="sh" viewBox="0 0 24 24" aria-label="Share"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M6 11H5v10h14V11h-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const STEPS = {
    th: ["แตะปุ่มแชร์ [SH] ที่แถบล่างของ Safari (ลูกศรชี้อยู่)", "เลื่อนรายการลง แล้วแตะ <b>“เพิ่มไปยังหน้าจอโฮม”</b> (ถ้าไม่เห็น แตะ “ดูเพิ่มเติม”)", "แตะ <b>“เพิ่ม”</b> มุมขวาบน ไอคอน ASN จะอยู่บนหน้าจอโฮม"],
    en: ["Tap the Share button [SH] in Safari's bottom bar (the arrow points to it)", "Scroll down and tap <b>“Add to Home Screen”</b> (if missing, tap “View More”)", "Tap <b>“Add”</b> at the top right — the ASN icon appears on your home screen"],
    zh: ["点 Safari 底部的分享按钮 [SH]（箭头所指）", "向下滑动，点 <b>“添加到主屏幕”</b>（没有就点“查看更多”）", "点右上角 <b>“添加”</b>"],
    ko: ["Safari 아래쪽 공유 버튼 [SH]을 누르세요 (화살표 위치)", "아래로 스크롤해 <b>“홈 화면에 추가”</b>를 누르세요 (없으면 “더 보기”)", "오른쪽 위 <b>“추가”</b>를 누르세요"],
    ja: ["Safari 下部の共有ボタン [SH] をタップ（矢印の場所）", "下にスクロールして <b>「ホーム画面に追加」</b>（見つからなければ「さらに表示」）", "右上の <b>「追加」</b> をタップ"],
    ru: ["Нажмите «Поделиться» [SH] внизу Safari (куда указывает стрелка)", "Прокрутите вниз и нажмите <b>«На экран Домой»</b> (если нет — «Ещё»)", "Нажмите <b>«Добавить»</b> вверху справа"]
  };
  const T = () => TX[(document.documentElement.lang || "th").slice(0, 2)] || TX.en;

  let deferred = null, shown = false;
  addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; if (shown) render(); });
  addEventListener("appinstalled", () => { close(true); });

  const css = `.hai-pwa{position:fixed;left:12px;right:12px;bottom:calc(40px + env(safe-area-inset-bottom));z-index:70;max-width:440px;margin:0 auto;
    background:#17202B;color:#F3ECE3;border:1px solid #C9A04A;border-radius:16px;padding:12px 14px;display:flex;gap:12px;align-items:center;
    box-shadow:0 10px 30px rgba(0,0,0,.28);font:14px/1.4 "IBM Plex Sans Thai",system-ui,sans-serif;animation:haiUp .3s ease}
    .hai-pwa img{width:44px;height:44px;border-radius:11px;flex:none}
    .hai-pwa .tx{flex:1;min-width:0}.hai-pwa b.h{display:block;font-size:15px;color:#fff}.hai-pwa .s{color:#C9BCAE;font-size:12.5px}
    .hai-pwa .bt{display:flex;flex-direction:column;gap:6px;flex:none}
    .hai-pwa button{border:0;border-radius:999px;padding:7px 14px;font:600 13px/1 inherit;cursor:pointer}
    .hai-pwa .go{background:#C9A04A;color:#16110C}.hai-pwa .no{background:transparent;color:#C9BCAE;padding:4px 8px}
    .hai-pwa.up{bottom:calc(76px + env(safe-area-inset-bottom))}
    .hai-pwa svg.sh{width:16px;height:16px;vertical-align:-2px;color:#C9A04A}
    .hai-pwa ol.st{margin:4px 0 0;padding-left:18px;color:#E6DCCD;font-size:12.5px;line-height:1.45}.hai-pwa ol.st li{margin:2px 0}.hai-pwa ol.st b{color:#fff}
    .hai-pwa-ar{position:fixed;left:50%;bottom:calc(4px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:71;color:#C9A04A;font-size:30px;line-height:1;
      text-shadow:0 2px 8px rgba(0,0,0,.5);animation:haiBob 1s ease-in-out infinite;pointer-events:none}
    @keyframes haiBob{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,8px)}}
    @keyframes haiUp{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}`;
  let box;
  function close(forever) {
    if (box) box.remove(); box = null;
    const ar = document.getElementById("hai-pwa-arrow"); if (ar) ar.remove();
    try { localStorage.setItem(KEY, String(forever ? Date.now() + 3650 * 864e5 : Date.now())); } catch (e) {}
  }
  function render() {
    const t = T(), icon = (document.querySelector('link[rel="apple-touch-icon"]') || {}).href || "";
    const L = (document.documentElement.lang || "th").slice(0, 2), steps = (STEPS[L] || STEPS.en).map(x => x.replace("[SH]", SH));
    const iosSafari = ios && !inApp && !deferred;
    const how = (deferred ? "" : inApp ? t.app : ios ? t.ios : t.s).replace("[SH]", SH);
    if (!deferred && !ios && !inApp) return;           // browser can't install: say nothing
    if (!box) {
      if (!document.getElementById("hai-pwa-css")) document.head.appendChild(Object.assign(document.createElement("style"), { id: "hai-pwa-css", textContent: css }));
      box = document.createElement("div"); box.className = "hai-pwa"; box.setAttribute("role", "dialog");
      document.body.appendChild(box);
    }
    const bar = document.querySelector(".slbar"); box.classList.toggle("up", !!(bar && bar.offsetParent));
    box.innerHTML = `${icon ? `<img src="${icon}" alt="">` : ""}<div class="tx"><b class="h">${t.t}</b>${iosSafari
        ? `<ol class="st">${steps.map(x => `<li>${x}</li>`).join("")}</ol>` : `<span class="s">${deferred ? t.s : how}</span>`}</div>
      <div class="bt">${deferred ? `<button class="go">${t.b}</button>` : ""}<button class="no">${t.l}</button></div>`;
    let ar = document.getElementById("hai-pwa-arrow");
    if (iosSafari && !ar) { ar = document.createElement("div"); ar.id = "hai-pwa-arrow"; ar.className = "hai-pwa-ar"; ar.innerHTML = "⬇"; document.body.appendChild(ar); }
    const go = box.querySelector(".go");
    if (go) go.onclick = async () => { deferred.prompt(); const r = await deferred.userChoice.catch(() => ({})); deferred = null; close(r && r.outcome === "accepted"); };
    box.querySelector(".no").onclick = () => close(false);
  }
  // wait a little so it never covers the first look at the page
  setTimeout(function wait() {                      // never on top of the cookie bar: wait until it is answered
    if (document.querySelector(".thbho-consent")) return setTimeout(wait, 2000);
    shown = true; render();
  }, 12000);
})();
