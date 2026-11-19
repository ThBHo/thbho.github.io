/* hai/forms.js: friendlier date and number fields on every agent page (Thor, 19 Nov 2026).
   Loaded by hai/profile.js and insight/insight.js, or by a <script> tag on pages that use neither.
   1. Birth dates (input[type=date] with data-birth or data-pfb="date") become day / month / year dropdowns:
      no typing, no 0012-style half years, and Thai shows the Buddhist year beside the Western one.
      The original input stays as a hidden field holding YYYY-MM-DD, so the page's own code keeps working.
   2. Other date fields: when the field loses focus, a 2-digit year (26 → 2026) or a Buddhist year (2569 → 2026) is corrected.
   3. Number fields become text fields with a number keypad: commas and spaces are accepted and stripped,
      and no "step" rule or mouse-wheel can block or change the value. */
(function () {
  if (window.HAIForms) return;
  const NOW = new Date().getFullYear();
  const lang = () => (document.documentElement.lang || "en").slice(0, 2);
  const PH = { th: ["วัน", "เดือน", "ปี"], en: ["Day", "Month", "Year"], ru: ["День", "Месяц", "Год"], zh: ["日", "月", "年"], ko: ["일", "월", "년"], ja: ["日", "月", "年"] };
  const LOC = { th: "th-TH-u-ca-gregory", en: "en-GB", ru: "ru-RU", zh: "zh-CN", ko: "ko-KR", ja: "ja-JP" };
  const fire = el => { el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); };
  const pad = n => String(n).padStart(2, "0");

  function fixYear(y, birth) {
    if (y > 2400) return y - 543;                                    // Buddhist year typed
    if (y > 0 && y < 100) { let f = 2000 + y; if (birth ? f > NOW : f > NOW + 30) f -= 100; return f; } // 2-digit year
    return y;
  }

  /* 1. birth date → three dropdowns */
  function birthPicker(inp) {
    if (inp.dataset.hfDone) return; inp.dataset.hfDone = "1";
    const lg = lang(), ph = PH[lg] || PH.en, min = +(inp.min || "1920").slice(0, 4) || 1920, max = Math.min(+(inp.max || NOW).toString().slice(0, 4) || NOW, NOW);
    const [y0, m0, d0] = (inp.value || "").split("-").map(Number);
    const mn = i => { try { return new Intl.DateTimeFormat(LOC[lg] || "en-GB", { month: "long" }).format(new Date(2000, i, 1)); } catch (e) { return String(i + 1); } };
    const opt = (v, t, s) => `<option value="${v}"${s ? " selected" : ""}>${t}</option>`;
    const years = []; for (let k = max; k >= min; k--) years.push(opt(k, lg === "th" ? `${k + 543} (${k})` : k, y0 === k));
    const w = document.createElement("span"); w.className = "hf-dp";
    const cls = inp.className ? ` class="${inp.className}"` : "";
    w.innerHTML = `<select${cls} data-hf="d" aria-label="${ph[0]}">${opt("", ph[0], !d0)}${Array.from({ length: 31 }, (_, i) => opt(i + 1, i + 1, d0 === i + 1)).join("")}</select>`
      + `<select${cls} data-hf="m" aria-label="${ph[1]}">${opt("", ph[1], !m0)}${Array.from({ length: 12 }, (_, i) => opt(i + 1, mn(i), m0 === i + 1)).join("")}</select>`
      + `<select${cls} data-hf="y" aria-label="${ph[2]}">${opt("", lg === "th" ? "ปี พ.ศ." : ph[2], !y0)}${years.join("")}</select>`;
    inp.type = "hidden"; inp.parentNode.insertBefore(w, inp); w.appendChild(inp);
    w.addEventListener("change", e => {
      if (!e.target.dataset.hf) return; e.stopPropagation();          // only the hidden field's change reaches the page
      const g = k => +w.querySelector(`[data-hf="${k}"]`).value; let d = g("d"); const m = g("m"), y = g("y");
      if (!d || !m || !y) return;                                      // wait until all three are chosen
      const last = new Date(y, m, 0).getDate(); if (d > last) { d = last; w.querySelector('[data-hf="d"]').value = d; }
      const v = `${y}-${pad(m)}-${pad(d)}`; if (inp.value !== v) { inp.value = v; fire(inp); }
    });
  }

  /* 3. number → text with a number keypad */
  function numField(inp) {
    if (inp.dataset.hfDone || inp.dataset.keepNumber != null) return; inp.dataset.hfDone = "1";
    const dec = /\./.test(inp.step || "") || inp.step === "any" || inp.inputMode === "decimal";
    inp.type = "text"; inp.inputMode = dec ? "decimal" : "numeric"; inp.autocomplete = "off"; inp.removeAttribute("step");
    inp.addEventListener("input", () => {
      let v = inp.value.replace(/[,\s฿]/g, "").replace(dec ? /[^\d.]/g : /[^\d]/g, "");
      if (dec) { const i = v.indexOf("."); if (i >= 0) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, ""); }
      if (v !== inp.value) inp.value = v;
    });
  }

  function scan(root) {
    if (!root.querySelectorAll) return;
    root.querySelectorAll('input[type=date][data-birth], input[type=date][data-pfb="date"]').forEach(birthPicker);
    root.querySelectorAll("input[type=number]").forEach(numField);
  }

  /* 2. any other date field: correct the year when the field is left */
  document.addEventListener("focusout", e => {
    const el = e.target; if (!el || el.type !== "date" || !el.value) return;
    const [y, m, d] = el.value.split("-").map(Number), f = fixYear(y, false);
    if (f !== y) { el.value = `${String(f).padStart(4, "0")}-${pad(m)}-${pad(d)}`; fire(el); }
  }, true);

  const style = document.createElement("style");
  style.textContent = ".hf-dp{display:flex;gap:6px;width:100%;min-width:0}.hf-dp select{flex:1 1 0;min-width:0;width:auto}.hf-dp select[data-hf=m]{flex:1.6 1 0}.hf-dp select[data-hf=y]{flex:1.4 1 0}";
  document.head.appendChild(style);
  const go = () => { scan(document); new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && (n.matches && n.matches("input") ? scan(n.parentNode || document) : scan(n))))).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) go(); else document.addEventListener("DOMContentLoaded", go);
  window.HAIForms = { scan, fixYear };
})();
