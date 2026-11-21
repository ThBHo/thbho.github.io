/* Zone list beside the map: busiest zones first, show 6, the rest behind "+ N more" (21 Nov 2026).
   Works on #zlist rendered by engine.js; re-applies whenever the engine re-renders it. Nothing is removed. */
(function () {
  const SHOW = 6, TX = {
    th: ["ดูอีก {n} โซน", "ย่อรายการโซน"], en: ["{n} more areas", "Show fewer"], zh: ["另外 {n} 个区域", "收起"],
    ko: ["{n}개 지역 더 보기", "접기"], ja: ["ほか {n} エリア", "閉じる"], ru: ["Ещё {n} районов", "Свернуть"] };
  let open = false, mo = null;
  const css = `.zlist .zf-hide{display:none!important}
    .zlist button.zf-more{justify-content:center;gap:6px;border-style:dashed;color:var(--brand);font-weight:600;background:transparent}
    .zlist button.zf-more:hover{background:var(--brand-soft)}
    .zlist.zf-open{max-height:440px;overflow:auto;padding-right:4px;overscroll-behavior:contain}
    @media (max-width:820px){.zlist.zf-open{max-height:none}}`;
  function apply(zl) {
    if (mo) mo.disconnect();
    const L = TX[(document.documentElement.lang || "th").slice(0, 2)] || TX.en;
    zl.querySelectorAll(".zf-more").forEach(b => b.remove());
    const all = [...zl.querySelectorAll("button[data-zone]")];
    const first = all.find(b => b.dataset.zone === ""), rest = all.filter(b => b !== first);
    const n = b => +((b.querySelector("b") || {}).textContent || 0);
    // busiest areas first; land/Sattahip-type zones (ZONES[z].land) always last (Thor's rule, 1 Nov 2026)
    const late = b => { try { return ZONES[b.dataset.zone] && ZONES[b.dataset.zone].land ? 1 : 0; } catch (e) { return 0; } };
    rest.sort((a, b) => late(a) - late(b) || n(b) - n(a)).forEach(b => zl.appendChild(b));
    const extra = rest.slice(SHOW);
    rest.forEach((b, i) => b.classList.toggle("zf-hide", !open && i >= SHOW && b.getAttribute("aria-pressed") !== "true"));
    if (extra.length) {
      const m = document.createElement("button"); m.type = "button"; m.className = "zf-more";
      m.textContent = (open ? "− " + L[1] : "+ " + L[0].replace("{n}", extra.length));
      m.onclick = e => { e.stopPropagation(); open = !open; apply(zl); if (!open) zl.scrollTop = 0; };
      zl.appendChild(m);
    }
    zl.classList.toggle("zf-open", open);
    if (mo) mo.observe(zl, { childList: true });
  }
  function start() {
    const zl = document.getElementById("zlist"); if (!zl) return;
    document.head.appendChild(Object.assign(document.createElement("style"), { textContent: css }));
    mo = new MutationObserver(() => apply(zl));
    apply(zl);
    new MutationObserver(() => apply(zl)).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", start); else start();
})();
