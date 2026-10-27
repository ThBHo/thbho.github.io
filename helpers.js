window.__sleep = ms => new Promise(r=>setTimeout(r,ms));
window.__P = window.__P || {};
window.__getP = async code => { if (!__P[code]) __P[code] = await (await fetch(`https://raw.githubusercontent.com/ThBHo/thbho.github.io/asn-work/prompts/${code}.json?x=${Date.now()}`)).json(); return __P[code]; };
window.__drop = async (code, n) => { const b = await (await fetch(`https://thbho.github.io/asn-img/${code}-${n}.jpg`)).blob(); const f = new File([b], `${code}-${n}.jpg`, {type:'image/jpeg'}); const dt = new DataTransfer(); dt.items.add(f); const a = document.elementFromPoint(innerWidth/2, innerHeight*0.35); a.dispatchEvent(new DragEvent('dragenter',{bubbles:true,cancelable:true,dataTransfer:dt})); await __sleep(300); const t = document.elementFromPoint(innerWidth/2+60, innerHeight*0.45); t.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt})); t.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt})); };
window.__variant = (o, k) => {
  const main = o.prompt; if (k === 0) return main;
  const body = main.replace(/^Listing photo \d+\.\s*/, '');
  const isInt = /room|kitchen|bath|bed|living|dining|interior|corridor|hall|lounge|office|stair|foyer|condo|wardrobe|study|gym|cinema|theat|toilet|shower|closet|bar|sala daybed|warehouse interior|shop/i.test(o.scene||'');
  const lights = isInt
    ? [['daylight','Bright soft natural daylight filling the room, balanced exposure with the window views clearly visible'], ['evening','Warm evening ambience: ceiling, cove and lamp lights on, a soft blue dusk visible through the windows'], ['morning','Soft early-morning light with gentle warm sunbeams across the floor']]
    : [['golden','Warm golden hour light with soft long shadows and a glowing sky'], ['midday','Bright clear midday light with a deep blue sky and a few soft white clouds'], ['blue hour','Blue hour at dusk: deep blue sky, warm architectural and interior lights glowing'], ['morning','Soft early-morning sun with a light haze and fresh colours']];
  const cur = main.toLowerCase();
  let la = lights.filter(([key])=>!cur.includes(key)); if (!la.length) la = lights; const r = o.n % la.length; la = la.slice(r).concat(la.slice(0,r));
  const alts = o.angle ? [o.angle] : [];
  la.forEach(([,L]) => alts.push(`Listing photo ${o.n} alt ${alts.length+1}. Use this light instead of any light described below: ${L}. ${body}`));
  return alts[(k-1) % alts.length];
};
window.__att = () => { const ed = document.querySelector('.ProseMirror[contenteditable=true]'); let p = ed; for (let i=0;i<6;i++) p = p.parentElement; return p.querySelectorAll('img').length; };
window.__log = window.__log || [];
window.__ins = async (code, n, k) => { const ed = document.querySelector('.ProseMirror[contenteditable=true]'); const att = __att(); if (att !== 1) { ed.focus(); document.execCommand('selectAll'); document.execCommand('delete'); return 'SKIP att='+att+' '+code+'-'+n+'/'+k; } const a = await __getP(code); const o = a.find(x=>x.n===n); if (!o) { ed.focus(); document.execCommand('selectAll'); document.execCommand('delete'); return 'NOPROMPT '+code+'-'+n; } const p = __variant(o, k); ed.focus(); document.execCommand('selectAll'); document.execCommand('insertText', false, p); __log.push(code+'-'+n+'/'+k); return 'OK '+code+'-'+n+'/'+k; };
window.__uploadAll = async (code) => { const a = await __getP(code); for (const o of a){ await __drop(code,o.n); await __sleep(2200); } return 'uploaded '+a.length; };
window.__plan = async (code) => { const a = await __getP(code); const n = a.length; const per = Math.ceil(20 / n); const out = []; for (let k=0;k<per;k++) for (const o of a) out.push([o.n,k]); return out.slice(0,20); };
window.__clearAtt = () => { const ed = document.querySelector('.ProseMirror[contenteditable=true]'); let p = ed; for (let i=0;i<6;i++) p = p.parentElement; const x=[...p.querySelectorAll('button')].find(b=>/close|clear|remove/i.test((b.getAttribute('aria-label')||'')+b.innerText)); if (x) { x.click(); return 'cleared'; } return 'no-x'; };
'helpers ok';
