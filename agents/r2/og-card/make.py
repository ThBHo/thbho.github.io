import asyncio,json,re,shutil,os
from playwright.async_api import async_playwright
R='/home/claude/thbho.github.io'; U=json.load(open('/home/claude/r2units.json'))
cfg=json.load(open(R+'/agents/r2/pages.json'))
shutil.copy(R+'/riviera-img/logo-stack-ink.png','logo.png')
VIEW={'Front of Road':'ติดถนน','Sea View':'วิวทะเล','City View':'วิวเมือง','Pool View':'วิวสระ'}
TYPE={'1 BED':'1 ห้องนอน','Studio':'สตูดิโอ','2 BED':'2 ห้องนอน'}
jobs=[]
for p in cfg['pages']:
  if p.get('frozen'): continue
  m=re.search(r'UNIT_PAGE = "([^"]+)"',p['vars']); title=re.search(r'og:title" content="([^"]+)"',"\n".join(p['meta'])).group(1)
  if m:
    code=m.group(1); u=U[code]; sell=u['promo'] or u['price']
    nick=title.split('—',1)[1].strip() if '—' in title else ''
    lab=f"ขาย ฿{sell/1e6:.2f} ล้าน · {VIEW.get(u['view'],u['view'])}"
    tt=f"{code} · {nick}" if nick else code
    s=f"{TYPE.get(u['type'],u['type'])} · {u['sqm']:g} ตร.ม. · ชั้น {u['floor']}<br>The Riviera Jomtien · Clare Pattaya Property"
    jobs.append((code,f'file:///home/claude/thbho.github.io/riviera-img/{code}-1.jpg',lab,tt,s))
jobs.append(('main','file:///home/claude/thbho.github.io/riviera-img/hero-3.jpg','ห้อง resale · พร้อมโอน','The Riviera Jomtien','สตูดิโอและ 1 ห้องนอน ราคาโปรโมชัน<br>จอมเทียน พัทยา'))
jobs.append(('matching','file:///home/claude/thbho.github.io/riviera-img/hero-3.jpg','Personalized Matching','เลือกห้องที่ใช่<br>จาก MBTI ของคุณ','The Riviera Jomtien · ห้อง resale ของ Clare Pattaya Property'))
jobs.append(('destiny','file:///home/claude/thbho.github.io/hai/img/destiny-hero.jpg','Destiny Match','เลือกห้องจาก<br>ดวงและฮวงจุ้ย','ดวงไทย ตะวันตก ปาจื้อ เลขกัว · The Riviera Jomtien'))
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); pg=await b.new_page(viewport={'width':1200,'height':630})
    await pg.goto('file://'+os.path.abspath('card.html')); os.makedirs('out',exist_ok=True)
    for code,ph,lab,tt,s in [j for j in jobs if (not os.environ.get('ONLY')) or j[0] in os.environ['ONLY'].split(',')]:
      await pg.evaluate("([ph,lab,tt,s])=>{document.getElementById('ph').style.backgroundImage='url('+ph+')';document.getElementById('logo').src='logo.png';lab_=document.getElementById('lab');lab_.textContent=lab;document.getElementById('tt').innerHTML=tt;document.getElementById('s').innerHTML=s}",[ph,lab,tt,s])
      await pg.wait_for_timeout(150); await pg.evaluate("document.fonts.ready")
      h=await pg.evaluate("document.getElementById('t').offsetHeight")
      if h>300: print('TALL',code,h)
      await pg.screenshot(path=f'out/og-{code}.png'); 
    await b.close()
  print(len(jobs))
asyncio.run(main())
