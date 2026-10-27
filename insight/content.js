/* Thailand Living Insight — content (TH + EN). Facts checked 27 Oct 2026.
   [[n]] in a string links to that topic's sources[n-1]. Strings may hold simple HTML. */
window.LI = {
checked: { th:"27 ต.ค. 2026", en:"27 Oct 2026" },

/* ======================================================================= HUB */
hub: {
  kicker: { th:"Thailand Living Insight 2026", en:"Thailand Living Insight 2026" },
  title: { th:"ข้อมูลที่ควรรู้ ก่อนซื้อบ้านหรือคอนโดในไทย", en:"What to know before you buy a home in Thailand" },
  docTitle: { th:"ข้อมูลก่อนซื้ออสังหาฯ ในไทย 2026", en:"Before you buy in Thailand, 2026" },
  lead: { th:"สรุปเรื่องสุขภาพ บ้านอัจฉริยะ วีซ่าและภาษี เศรษฐกิจภาคตะวันออก (EEC) และกฎการซื้อของชาวต่างชาติ สำหรับคนที่กำลังมองทรัพย์แถวพัทยา จอมเทียน และชายฝั่งตะวันออก ทุกตัวเลขมีแหล่งอ้างอิง",
          en:"Health, smart homes, visas and tax, the Eastern Economic Corridor (EEC), and the rules for foreign buyers, for anyone looking at property around Pattaya, Jomtien and the Eastern Seaboard. Every figure links to its source." },
  stats: [
    { v:"5", l:{ th:"หัวข้อ อ่านจบในหัวข้อละ 5–8 นาที", en:"topics, 5–8 minutes each" } },
    { v:"49%", l:{ th:"โควตาต่างชาติในคอนโด ยังไม่เปลี่ยนในปี 2026", en:"foreign condo quota, unchanged in 2026" } },
    { v:"30", l:{ th:"วัน คือฟรีวีซ่าใหม่ตั้งแต่ 15 ก.ย. 2026", en:"days: the new visa-free stay from 15 Sep 2026" } },
    { v:"$42.7B", l:{ th:"เศรษฐกิจ Wellness ของไทย ปี 2024", en:"Thailand's wellness economy, 2024" } }
  ],
  facts: [
    { k:"15 SEP", topic:"relocate", t:{ th:"ฟรีวีซ่าลดจาก 60 เหลือ 30 วัน สำหรับ 60 ประเทศ ใครจะอยู่ยาวต้องวางแผนวีซ่าก่อนซื้อ", en:"Visa-free stays dropped from 60 to 30 days for 60 countries. Anyone staying longer needs a visa plan before buying." } },
    { k:"31 AUG", topic:"relocate", t:{ th:"DTV (วีซ่า 5 ปี) เข้มขึ้น ต้องยื่นในประเทศที่ถือสัญชาติหรือพำนัก และแนบใบรับรองความประพฤติ", en:"The 5-year DTV got stricter: apply where you hold citizenship or residence, with a police record." } },
    { k:"49%", topic:"buying", t:{ th:"โควตาต่างชาติในคอนโดยังเท่าเดิม ข้อเสนอเพิ่มเป็น 75% และเช่า 99 ปียังไม่เป็นกฎหมาย", en:"The foreign condo quota is unchanged. The 75% quota and 99-year lease proposals are not law." } },
    { k:"3 APR", topic:"eec", t:{ th:"สนามบินอู่ตะเภาเริ่มก่อสร้างตามสัมปทาน 50 ปี แต่รถไฟความเร็วสูงเชื่อม 3 สนามบินยังไม่เริ่ม", en:"U-Tapao airport works began under a 50-year concession, but the three-airport high-speed rail has not started." } },
    { k:"฿728B", topic:"eec", t:{ th:"คำขอลงทุน Data Center ปี 2025 ส่วนใหญ่อยู่ระยองและชลบุรี ดึงคนทำงานรายได้สูงเข้ามาในภาค", en:"Data-centre investment applications in 2025, mostly in Rayong and Chonburi, bringing well-paid staff to the region." } },
    { k:"22.9%", topic:"wellness", t:{ th:"อัตราเติบโตต่อปีของ Wellness Real Estate ในไทย คนซื้อเริ่มถามเรื่องอากาศ แสง และโรงพยาบาลใกล้บ้าน", en:"Yearly growth of wellness real estate in Thailand. Buyers now ask about air, light and the nearest hospital." } }
  ],
  reports: [
    { t:"Wellness Intelligence 2026", d:{ th:"บ้านที่ดูแลสุขภาพ: แสง อากาศ น้ำ และ AI Mirror", en:"Homes that care for health: light, air, water, AI mirrors" }, u:"https://thbho.github.io/WellnessIntelligence.html" },
    { t:"Global Shift 2026", d:{ th:"อาเซียนในฐานะ Safe Haven และการย้ายฐานทุน", en:"ASEAN as a safe haven and the capital shift" }, u:"https://thbho.github.io/GlobalShift2026.html" },
    { t:"Pivot to EEC", d:{ th:"วิกฤตตะวันออกกลาง กับโอกาสของ EEC (มี.ค. 2026)", en:"The Middle East crisis and the EEC opportunity (Mar 2026)" }, u:"https://thbho.github.io/PivotToEEC.html" },
    { t:"EEC Safe Haven", d:{ th:"EEC ในฐานะพื้นที่ปลอดภัยของทุน", en:"The EEC as a safe haven for capital" }, u:"https://thbho.github.io/EECSafeHaven.html" },
    { t:"U-Tapao Airport City", d:{ th:"เมืองการบินอู่ตะเภา", en:"The U-Tapao aviation city" }, u:"https://thbho.github.io/UTPCity.html" }
  ],
  sources: []
},

topics: {
/* ================================================================== WELLNESS */
wellness: {
  slug:"Wellness", color:"#3F7D5C",
  short:{ th:"Wellness Living", en:"Wellness Living" },
  kicker:{ th:"Wellness Living", en:"Wellness Living" },
  cardTitle:{ th:"บ้านที่ช่วยให้สุขภาพดีขึ้น", en:"A home that keeps you well" },
  cardText:{ th:"แสง อากาศ น้ำ เสียง และโรงพยาบาลใกล้บ้าน อะไรวัดได้จริง และควรดูอะไรตอนเลือกห้อง", en:"Light, air, water, noise and the nearest hospital: what can be measured and what to check in a unit." },
  title:{ th:"บ้านที่ช่วยให้สุขภาพดีขึ้น", en:"A home that keeps you well" },
  lead:{ th:"คนเราใช้เวลาราว 90% อยู่ในอาคาร[[5]] คุณภาพอากาศ แสง เสียง และระยะทางถึงโรงพยาบาลจึงสำคัญพอ ๆ กับวิวและราคา หน้านี้สรุปว่าอะไรวัดได้จริง อะไรยังเป็นแค่เทรนด์ และควรเช็กอะไรตอนไปดูห้อง",
         en:"People spend about 90% of their time indoors[[5]], so the air, light, noise and distance to a hospital matter as much as the view and the price. This page sorts what you can measure from what is still a trend, and lists what to check at a viewing." },
  stats:[
    { v:"$42.7B", l:{ th:"เศรษฐกิจ Wellness ของไทย ปี 2024 (จาก $38.8B ปี 2023)", en:"Thailand's wellness economy in 2024 (from $38.8B in 2023)" }, src:1 },
    { v:"#24", l:{ th:"อันดับโลก และอันดับ 9 ในเอเชียแปซิฟิก", en:"in the world, 9th in Asia-Pacific" }, src:1 },
    { v:"+10.1%", l:{ th:"โตเร็วเป็นอันดับ 7 จาก 25 ตลาดใหญ่ที่สุด", en:"growth, 7th fastest of the 25 largest markets" }, src:2 },
    { v:"22.9%", l:{ th:"อัตราเติบโตต่อปีของ Wellness Real Estate ไทย", en:"yearly growth of Thai wellness real estate" }, src:1 }
  ],
  blocks:[
    { type:"cards", h:{ th:"4 เรื่องที่ห้องควรทำได้ดี", en:"Four things a home should get right" },
      intro:{ th:"แนวคิด Healthspan คือบ้านช่วยให้ร่างกายทำงานตามจังหวะธรรมชาติ ไม่ต้องรอป่วยแล้วค่อยรักษา ทั้ง 4 เรื่องนี้ทำได้ในคอนโดเดิม โดยไม่ต้องรีโนเวตใหญ่",
               en:"The healthspan idea is a home that keeps your body on its natural rhythm, rather than waiting to treat illness. All four can be done in an existing condo without a major renovation." },
      items:[
        { ic:"sun", t:{ th:"แสงตามนาฬิกาชีวิต", en:"Light that follows your body clock" },
          d:{ th:"แสงธรรมชาติตอนเช้าช่วยตั้งนาฬิกาชีวิต ส่วนแสงขาวจ้าตอนกลางคืนรบกวนการนอน", en:"Morning daylight sets the body clock. Bright white light at night disturbs sleep." },
          list:[ { th:"กลางวันใช้แสงขาว 4000–5000K กลางคืนใช้แสงวอร์ม 2700K หรือต่ำกว่า", en:"Daytime: 4000–5000K white. Evening: 2700K warm or lower" },
                 { th:"หลอดอัจฉริยะปรับอุณหภูมิสีเองตามเวลา", en:"Smart bulbs can shift the colour by time of day" },
                 { th:"ม่านทึบแสงในห้องนอน", en:"Blackout curtains in the bedroom" } ] },
        { ic:"wind", t:{ th:"อากาศสะอาด", en:"Clean air" },
          d:{ th:"ค่า PM2.5 เฉลี่ยทั้งปีของไทยปี 2025 สูงกว่าเกณฑ์ WHO 3.6 เท่า[[3]] ลมทะเลช่วยได้ แต่ช่วงม.ค.–เม.ย. ยังมีฝุ่นจากการเผา", en:"Thailand's 2025 average PM2.5 was 3.6 times the WHO guideline[[3]]. A sea breeze helps, but January to April still brings smoke from burning." },
          list:[ { th:"เครื่องฟอกอากาศที่มีเซนเซอร์ PM2.5", en:"An air purifier with a PM2.5 sensor" },
                 { th:"เปิดหน้าต่างระบายอากาศให้ CO₂ ต่ำกว่า 1,000 ppm", en:"Ventilate to keep CO₂ under 1,000 ppm" },
                 { th:"ล้างแอร์ทุก 6 เดือน", en:"Clean the air conditioner every 6 months" } ] },
        { ic:"drop", t:{ th:"น้ำที่ไว้ใจได้", en:"Water you can trust" },
          d:{ th:"น้ำในคอนโดผ่านถังพักของอาคาร คุณภาพจึงขึ้นกับการดูแลถัง", en:"Condo water passes through the building's tanks, so quality depends on how they are kept." },
          list:[ { th:"เครื่องกรองใต้ซิงก์ (RO หรือ UF) ติดตั้งได้ในวันเดียว", en:"An under-sink RO or UF filter fits in a day" },
                 { th:"ถามนิติบุคคลว่าล้างถังน้ำล่าสุดเมื่อไร", en:"Ask the building office when the tanks were last cleaned" } ] },
        { ic:"moon", t:{ th:"อุณหภูมิและการนอน", en:"Temperature and sleep" },
          d:{ th:"ห้องที่เย็นและเงียบพอดีช่วยให้หลับลึก และประหยัดไฟกว่าการเปิดแอร์เย็นจัด", en:"A cool, quiet room helps deep sleep and uses less power than running the air conditioner very cold." },
          list:[ { th:"ตั้งแอร์ 25–26°C ร่วมกับพัดลม", en:"Set the air conditioner to 25–26°C with a fan" },
                 { th:"แอร์ระบบอินเวอร์เตอร์", en:"An inverter air conditioner" },
                 { th:"ห้องที่อยู่สูงกว่าเสียงถนน", en:"A floor above the street noise" } ] }
      ] },
    { type:"cards", h:{ th:"พัทยา–จอมเทียน: Wellness ใกล้บ้าน", en:"Pattaya–Jomtien: wellness close to home" },
      intro:{ th:"ข้อดีของการอยู่ชายฝั่งตะวันออกคือมีโรงพยาบาลเอกชนหลายแห่ง ชายหาดสำหรับเดินหรือวิ่ง และมีโครงการด้านสุขภาพใหม่ ๆ เข้ามา",
               en:"The Eastern Seaboard offers several private hospitals, beaches for walking and running, and a growing list of new wellness projects." },
      items:[
        { ic:"hospital", t:{ th:"โรงพยาบาลหลักของชาวต่างชาติ", en:"The main hospitals for foreigners" },
          list:[ { th:"<b>โรงพยาบาลกรุงเทพพัทยา</b> ได้รับรอง JCI มีล่ามหลายภาษา และมีคลินิก BDMS Wellness[[6]][[8]]", en:"<b>Bangkok Hospital Pattaya</b>: JCI-accredited, multilingual staff, BDMS Wellness Clinic[[6]][[8]]" },
                 { th:"<b>โรงพยาบาลพัทยาอินเตอร์เนชั่นแนล</b> ห้องฉุกเฉิน 24 ชั่วโมง[[6]]", en:"<b>Pattaya International Hospital</b>: 24-hour emergency room[[6]]" },
                 { th:"<b>โรงพยาบาลจอมเทียน</b> ฝั่งใต้ของเมือง ราว 200 เตียง[[6]]", en:"<b>Jomtien Hospital</b>: south side of town, about 200 beds[[6]]" } ],
          tag:{ th:"ลองจับเวลาขับรถจากห้องไปโรงพยาบาล", en:"Time the drive from the unit" } },
        { ic:"wave", t:{ th:"ทะเลและพื้นที่กลางแจ้ง", en:"Sea and outdoor space" },
          d:{ th:"ทางเดินริมหาดจอมเทียนยาวหลายกิโลเมตร เหมาะกับการเดิน วิ่ง และปั่นจักรยานตอนเช้าหรือเย็น อากาศริมทะเลถ่ายเทดีกว่าในเมืองชั้นใน", en:"Jomtien's beach promenade runs for kilometres, good for walking, running and cycling in the morning or evening. Seaside air moves better than in an inner city." } },
        { ic:"leaf", t:{ th:"การลงทุนด้านสุขภาพใหม่ในพัทยา", en:"New wellness investment in Pattaya" },
          d:{ th:"Siam Wellness Group ประกาศโครงการ ZeaForest Wellness Sanctuary by Let's Relax มูลค่า 520 ล้านบาท ที่หาดตะวันรอน พัทยา มีส่วน Longevity ด้วย และตั้งเป้าเปิดไตรมาส 1 ปี 2027[[4]]",
             en:"Siam Wellness Group announced the ฿520M ZeaForest Wellness Sanctuary by Let's Relax at Tawan Ron Beach, Pattaya, including longevity facilities and targeting a Q1 2027 opening[[4]]." },
          tag:{ th:"ประกาศในงาน TTM+ มิ.ย. 2026", en:"Announced at TTM+, June 2026" } },
        { ic:"spark", t:{ th:"EECmd เมืองการแพทย์ (ยังเป็นแผน)", en:"EECmd medical hub (still a plan)" },
          d:{ th:"แผนเขตส่งเสริมการแพทย์ครบวงจร 566 ไร่ในอำเภอบางละมุง[[7]] ยังไม่พบความคืบหน้าล่าสุดในปี 2026 จึงควรมองเป็นโอกาสระยะยาว ไม่ใช่เหตุผลให้รีบซื้อ",
             en:"A planned 566-rai medical zone in Bang Lamung district[[7]]. We found no 2026 progress update, so treat it as a long-term upside, not a reason to buy now." } }
      ] },
    { type:"table", h:{ th:"เทคโนโลยีสุขภาพในบ้าน: อะไรใช้ได้จริงในไทย", en:"Health tech at home: what works in Thailand today" },
      cols:[ { th:"เทคโนโลยี", en:"Technology" }, { th:"ช่วยเรื่อง", en:"What it does" }, { th:"สถานะในไทย ปี 2026", en:"Status in Thailand, 2026" } ],
      rows:[
        [ { th:"ไฟปรับสีตามเวลา (Circadian)", en:"Circadian lighting" }, { th:"การนอนและสมาธิ", en:"Sleep and focus" }, { th:"ซื้อได้ทั่วไป หลอดละหลักร้อยถึงพันกว่าบาท", en:"Widely sold, a few hundred to ~1,500 baht a bulb" } ],
        [ { th:"เครื่องฟอกอากาศ + เซนเซอร์ PM2.5/CO₂", en:"Air purifier + PM2.5/CO₂ sensor" }, { th:"ภูมิแพ้ ระบบหายใจ", en:"Allergies, breathing" }, { th:"ซื้อได้ทั่วไป", en:"Widely sold" } ],
        [ { th:"ระบบ Wellness ทั้งบ้าน (เช่น Delos DARWIN เริ่มราว $3,500)", en:"Whole-home wellness systems (e.g. Delos DARWIN, from ~$3,500)" }, { th:"รวมแสง อากาศ น้ำ ในระบบเดียว", en:"Light, air and water in one system" }, { th:"ยังไม่มีขายเป็นแพ็กเกจในไทย ใช้อุปกรณ์แยกชิ้นเชื่อมกันแทน", en:"Not sold as a package in Thailand; combine separate devices instead" } ],
        [ { th:"กระจก AI สแกนใบหน้าวัดสัญญาณชีพ (rPPG)", en:"AI mirror face-scan vital signs (rPPG)" }, { th:"ชีพจร ความดัน ความเครียด", en:"Heart rate, blood pressure, stress" }, { th:"นำร่องในโรงพยาบาล ยังไม่มีรุ่นสำหรับบ้าน", en:"Hospital pilots only; no home version yet" } ],
        [ { th:"อุปกรณ์ติดตามการนอน (แหวน นาฬิกา แผ่นรองนอน)", en:"Sleep trackers (ring, watch, mattress pad)" }, { th:"วัดคุณภาพการนอน", en:"Measure sleep quality" }, { th:"ซื้อได้ ควรดูเรื่องความเป็นส่วนตัวของข้อมูล", en:"Available; check how the data is stored" } ]
      ],
      note:{ th:"ดูวิธีเลือกอุปกรณ์และงบประมาณได้ที่หัวข้อ Smart Home", en:"See the Smart Home topic for devices and budgets." } },
    { type:"widget", w:"score", h:{ th:"เช็กห้องที่กำลังดู: คะแนน Wellness", en:"Check the unit you're viewing: a wellness score" },
      wt:{ th:"ตอบ 8 ข้อระหว่างดูห้อง", en:"Answer 8 questions during the viewing" },
      wp:{ th:"ข้อที่ตอบว่าไม่ใช่ จะมีคำแนะนำว่าแก้ได้อย่างไร", en:"For every “no”, you get a tip on how to fix it." },
      items:[
        { w:2, t:{ th:"ห้องได้แสงธรรมชาติตอนกลางวัน ไม่มีตึกบัง", en:"The room gets daylight and no building blocks it" }, fix:{ th:"ชดเชยด้วยไฟปรับสีตามเวลา และเลือกโทนห้องสว่าง", en:"Make up for it with circadian lighting and a light colour scheme." } },
        { w:2, t:{ th:"เปิดหน้าต่างหรือประตูระเบียงรับลมได้", en:"Windows or a balcony door open for fresh air" }, fix:{ th:"ใช้เครื่องฟอกอากาศที่มีเซนเซอร์ และพัดลมดูดอากาศในห้องน้ำ", en:"Use a sensor purifier and a bathroom extractor fan." } },
        { w:1, t:{ th:"อยู่สูงพ้นเสียงถนน หรือกระจกกันเสียงดี", en:"High enough to escape street noise, or good glazing" }, fix:{ th:"ม่านหนาและแผ่นซับเสียงช่วยได้บ้าง ลองมาดูห้องตอนกลางคืนด้วย", en:"Heavy curtains and acoustic panels help. Visit at night too." } },
        { w:2, t:{ th:"ขับรถถึงโรงพยาบาลเอกชนไม่เกิน 15 นาที", en:"A private hospital within 15 minutes' drive" }, fix:{ th:"ทำประกันสุขภาพที่มีบริการรถพยาบาล และบันทึกเบอร์ฉุกเฉินไว้", en:"Get health cover with ambulance service and save the emergency numbers." } },
        { w:1, t:{ th:"เดินไปชายหาดหรือสวนได้", en:"Walking distance to a beach or park" }, fix:{ th:"เลือกอาคารที่มีฟิตเนสหรือสระว่ายน้ำแทน", en:"Choose a building with a gym or pool instead." } },
        { w:1, t:{ th:"อาคารมีฟิตเนสหรือสระว่ายน้ำ", en:"The building has a gym or pool" }, fix:{ th:"ดูฟิตเนสหรือสระสาธารณะใกล้ ๆ", en:"Look for a gym or public pool nearby." } },
        { w:1, t:{ th:"ติดเครื่องกรองน้ำแล้ว หรือมีที่ให้ติด", en:"A water filter is fitted, or there is room for one" }, fix:{ th:"เครื่องกรองแบบตั้งโต๊ะใช้แทนได้ ไม่ต้องเจาะ", en:"A countertop filter works without drilling." } },
        { w:2, t:{ th:"ไม่มีกลิ่นอับ คราบเชื้อรา หรือรอยน้ำซึม", en:"No musty smell, mould or water stains" }, fix:{ th:"ขอให้ผู้ขายแก้ก่อนโอน และตรวจระบบกันซึมของห้อง", en:"Ask the seller to fix it before transfer and check the waterproofing." } }
      ],
      tiers:[ { min:80, t:{ th:"ดีมาก ห้องนี้เอื้อต่อสุขภาพในระยะยาว", en:"Very good: this home supports long-term health." } },
              { min:55, t:{ th:"ดี มีบางจุดที่ปรับได้ด้วยงบไม่มาก", en:"Good: a few points can be fixed on a small budget." } },
              { min:0, t:{ th:"ตอบให้ครบ แล้วดูว่าต้องแก้อะไรบ้าง", en:"Answer all the questions to see what needs fixing." } } ] },
    { type:"check", h:{ th:"คำถามที่ควรถามตอนดูห้อง", en:"Questions to ask at a viewing" },
      items:[
        { th:"ถังน้ำของอาคารล้างล่าสุดเมื่อไร และล้างทุกกี่เดือน", en:"When were the water tanks last cleaned, and how often?" },
        { th:"หน้าต่างหันทิศไหน และตอนบ่ายห้องร้อนแค่ไหน", en:"Which way do the windows face, and how hot does it get in the afternoon?" },
        { th:"แอร์อายุกี่ปี ล้างครั้งล่าสุดเมื่อไร", en:"How old is the air conditioner, and when was it last cleaned?" },
        { th:"กลางคืนมีเสียงจากผับ ถนน หรืองานก่อสร้างไหม", en:"Is there noise at night from bars, roads or building sites?" },
        { th:"ฟิตเนสและสระเปิดกี่โมง และใช้ได้จริงไหม", en:"What hours are the gym and pool open, and are they kept up?" },
        { th:"มีประวัติน้ำซึมหรือเชื้อราในห้องหรือในชั้นนี้ไหม", en:"Any history of leaks or mould in the unit or on the floor?" }
      ] },
    { type:"callout", t:{ th:"ข้อควรรู้", en:"Good to know" }, p:{ th:"Wellness คือการดูแลสุขภาพเชิงป้องกัน ไม่ใช่การรักษาโรค ข้อมูลในหน้านี้ไม่ใช่คำแนะนำทางการแพทย์", en:"Wellness means prevention, not treatment. Nothing on this page is medical advice." } }
  ],
  sources:[
    { t:"Global Wellness Institute: Thailand's $42.7 billion wellness market (PR Newswire)", u:"https://www.prnewswire.com/news-releases/global-wellness-institute-releases-new-data-on-thailands-fast-growing-42-7-billion-wellness-market-302698003.html", d:"Feb 2026" },
    { t:"TTR Weekly: Thailand's wellness economy hits USD 42.7 billion", u:"https://www.ttrweekly.com/site/2026/03/thailands-wellness-economy-hits-usd42-7-billion/", d:"Mar 2026" },
    { t:"IQAir: Air quality in Thailand", u:"https://www.iqair.com/thailand", d:"2025 data" },
    { t:"Thailand.go.th: TAT concludes TTM+ 2026 in Pattaya (wellness partnerships)", u:"https://thailand.go.th/issue-focus-detail/tat-concluded-milestone-ttm-2026-in-pattaya-securing-high-value-luxury-and-wellness-partnerships", d:"Jun 2026" },
    { t:"US EPA: Indoor air quality", u:"https://www.epa.gov/report-environment/indoor-air-quality", d:"" },
    { t:"Pacific Prime / Cornerstone: hospitals for expats in Pattaya", u:"https://cornerstone.co.th/healthcare-in-pattaya-retirement-living-guide-2026", d:"2026" },
    { t:"HKTDC Belt and Road: Thailand EECmd Medical Hub", u:"https://beltandroad-prd.hktdc.com/en/project-database/thailand-eecmd-medical-hub", d:"undated" },
    { t:"Bangkok Hospital Pattaya: BDMS Wellness Clinic", u:"https://www.bangkokhospital.com/en/pattaya/center-clinic/default/bdms-wellness-clinic-bph/overview", d:"" },
    { t:"Th.Ho: Wellness Intelligence 2026 (original report)", u:"https://thbho.github.io/WellnessIntelligence.html", d:"2026" }
  ]
},

/* ================================================================ SMART HOME */
smarthome: {
  slug:"SmartHome", color:"#3D55B4",
  short:{ th:"Smart Home", en:"Smart Home" },
  kicker:{ th:"Smart Home", en:"Smart Home" },
  cardTitle:{ th:"Smart Home ที่คุ้มจริงในคอนโด", en:"Smart upgrades that pay off" },
  cardText:{ th:"ไม่ต้องรื้อห้อง เลือกอุปกรณ์ที่ช่วยประหยัดไฟ ปลอดภัยขึ้น หรือปล่อยเช่าง่ายขึ้น พร้อมตัวคำนวณงบ", en:"No renovation needed. Pick devices that save power, add security or make letting easier, with a budget builder." },
  title:{ th:"Smart Home ที่คุ้มจริงสำหรับคอนโด", en:"Smart home upgrades that pay off in a condo" },
  lead:{ th:"อุปกรณ์ส่วนใหญ่ติดตั้งเองได้ในวันเดียว ไม่ต้องเจาะผนังใหญ่ สิ่งที่ต้องคิดมีสามเรื่อง คือใช้มาตรฐานเดียวกัน (Matter) เก็บข้อมูลไว้ในบ้าน และเลือกเฉพาะสิ่งที่ช่วยเรื่องค่าไฟ ความปลอดภัย หรือการปล่อยเช่า",
         en:"Most devices install in a day with no major drilling. Three things matter: use one standard (Matter), keep your data at home, and only buy what helps with power bills, security or letting." },
  stats:[
    { v:"84%", l:{ th:"ของผู้ซื้อคอนโดกรุงเทพฯ มองว่า Smart Home จำเป็น (ผลสำรวจของผู้พัฒนา)", en:"of Bangkok condo buyers call smart features necessary (developer survey)" }, src:2 },
    { v:"~15%", l:{ th:"สัดส่วนบ้านไทยที่ใช้ Smart Home (รายงานตลาด)", en:"of Thai homes use smart devices (market report)" }, src:3 },
    { v:"1", l:{ th:"มาตรฐาน Matter ใช้ได้กับ Apple, Google, Amazon และ Samsung", en:"standard, Matter, works with Apple, Google, Amazon and Samsung" }, src:1 },
    { v:{ th:"30 วัน", en:"30 days" }, l:{ th:"ขั้นต่ำของการปล่อยเช่าคอนโดโดยไม่มีใบอนุญาตโรงแรม", en:"minimum condo let without a hotel licence" }, src:5 }
  ],
  blocks:[
    { type:"cards", h:{ th:"เริ่มจาก 6 อย่างนี้", en:"Start with these six" },
      intro:{ th:"เรียงตามความคุ้มค่าสำหรับคอนโดริมทะเล ทั้งคนอยู่เองและเจ้าของที่อยู่ต่างประเทศ", en:"Ranked by value for a seaside condo, whether you live in it or own it from abroad." },
      items:[
        { ic:"lock", t:{ th:"กลอนประตูดิจิทัล", en:"Digital door lock" }, d:{ th:"ส่งรหัสชั่วคราวให้ผู้เช่า แม่บ้าน หรือช่างได้ ไม่ต้องฝากกุญแจ เก็บกุญแจกลไว้สำรองเสมอ", en:"Send temporary codes to tenants, cleaners or technicians, with no keys to hand over. Always keep a mechanical backup key." }, tag:{ th:"ขออนุญาตนิติก่อนเปลี่ยน", en:"Check building rules first" } },
        { ic:"snow", t:{ th:"ควบคุมแอร์ผ่านแอป", en:"App control for the air conditioner" }, d:{ th:"แอร์มักเป็นค่าไฟก้อนใหญ่ที่สุดของคอนโด ตั้งเวลาเปิดปิด เปิดก่อนถึงห้อง และปิดเมื่อไม่มีคนอยู่", en:"Air conditioning is usually a condo's biggest power cost. Schedule it, cool the room before you arrive, and switch it off when nobody is in." }, tag:{ th:"คืนทุนเร็วที่สุด", en:"Fastest payback" } },
        { ic:"drop", t:{ th:"เซนเซอร์น้ำรั่ว + วาล์วตัดน้ำ", en:"Leak sensor + shut-off valve" }, d:{ th:"สำคัญมากถ้าห้องว่างนาน ๆ แจ้งเตือนเข้ามือถือและตัดน้ำเองก่อนน้ำท่วมห้องข้างล่าง", en:"Essential if the unit sits empty. It alerts your phone and shuts off the water before the flat below floods." }, tag:{ th:"สำหรับเจ้าของที่อยู่ไกล", en:"For owners abroad" } },
        { ic:"wind", t:{ th:"เซนเซอร์อากาศและปลั๊กวัดไฟ", en:"Air sensor and energy plugs" }, d:{ th:"วัด PM2.5 CO₂ ความชื้น และดูว่าเครื่องไหนกินไฟ ความชื้นสูงริมทะเลทำให้เกิดเชื้อราได้", en:"Track PM2.5, CO₂ and humidity, and see which device uses the power. Seaside humidity breeds mould." } },
        { ic:"bulb", t:{ th:"ไฟและม่านอัตโนมัติ", en:"Smart lights and curtains" }, d:{ th:"ไฟปรับสีตามเวลาช่วยการนอน ม่านที่ปิดเองตอนบ่ายช่วยลดความร้อนจากแดด", en:"Lights that shift colour help sleep. Curtains that close in the afternoon keep out the sun's heat." } },
        { ic:"shield", t:{ th:"กล้องในห้อง (ใช้อย่างระวัง)", en:"Indoor camera (use with care)" }, d:{ th:"ติดเฉพาะในห้องตัวเอง ห้ามหันไปทางทางเดินส่วนกลาง และต้องถอดหรือปิดเมื่อปล่อยเช่า เพื่อเคารพความเป็นส่วนตัวของผู้เช่าตาม PDPA[[4]]", en:"Inside your own unit only, never pointed at the corridor, and removed or switched off while tenants live there, to respect their privacy under the PDPA[[4]]." } }
      ] },
    { type:"widget", w:"builder", h:{ th:"จัดแพ็กเกจ Smart Home ของคุณ", en:"Build your smart home package" },
      wt:{ th:"เลือกแบบที่ตรงกับคุณ แล้วปรับรายการได้", en:"Pick the profile that fits, then adjust" },
      wp:{ th:"ราคาเป็นช่วงโดยประมาณ ไม่รวมค่าช่าง", en:"Prices are rough ranges, labour not included" },
      profiles:[
        { t:{ th:"อยู่เอง", en:"Living in" }, pick:["hub","ac","plugs","air","bulbs","curtain","filter"] },
        { t:{ th:"ปล่อยเช่ารายเดือน", en:"Letting monthly" }, pick:["lock","hub","ac","plugs","leak","wifi"] },
        { t:{ th:"เจ้าของอยู่ต่างประเทศ", en:"Owner abroad" }, pick:["lock","hub","ac","leak","air","cam","wifi"] }
      ],
      items:[
        { id:"lock", t:{ th:"กลอนประตูดิจิทัล", en:"Digital door lock" }, d:{ th:"รหัส คีย์การ์ด แอป", en:"Code, card, app" }, lo:6000, hi:18000 },
        { id:"hub", t:{ th:"ฮับ Matter / Thread", en:"Matter / Thread hub" }, d:{ th:"หรือใช้ลำโพงอัจฉริยะที่มีอยู่", en:"Or a smart speaker you already own" }, lo:1500, hi:5000 },
        { id:"ac", t:{ th:"ตัวควบคุมแอร์ Wi-Fi (ต่อเครื่อง)", en:"Wi-Fi AC controller (per unit)" }, d:{ th:"ใช้กับแอร์เดิมได้", en:"Works with existing units" }, lo:600, hi:1800 },
        { id:"plugs", t:{ th:"ปลั๊กอัจฉริยะวัดไฟ ×3", en:"Energy-metering plugs ×3" }, d:{ th:"ตู้เย็น เครื่องทำน้ำอุ่น ทีวี", en:"Fridge, water heater, TV" }, lo:900, hi:2400 },
        { id:"air", t:{ th:"เครื่องวัด PM2.5 / CO₂ / ความชื้น", en:"PM2.5 / CO₂ / humidity monitor" }, d:{ th:"แจ้งเตือนเข้ามือถือ", en:"Phone alerts" }, lo:1500, hi:5000 },
        { id:"purifier", t:{ th:"เครื่องฟอกอากาศมีเซนเซอร์", en:"Air purifier with sensor" }, d:{ th:"ขนาดตามพื้นที่ห้อง", en:"Sized to the room" }, lo:4000, hi:15000 },
        { id:"bulbs", t:{ th:"หลอดไฟปรับสี ×4", en:"Tunable smart bulbs ×4" }, d:{ th:"แสงตามนาฬิกาชีวิต", en:"Circadian lighting" }, lo:1600, hi:4800 },
        { id:"curtain", t:{ th:"มอเตอร์ม่าน (1 ราง)", en:"Curtain motor (1 track)" }, d:{ th:"ปิดเองตอนแดดแรง", en:"Closes in strong sun" }, lo:3500, hi:9000 },
        { id:"leak", t:{ th:"เซนเซอร์น้ำรั่ว ×2 + วาล์วตัดน้ำ", en:"Leak sensors ×2 + shut-off valve" }, d:{ th:"ห้องน้ำและใต้ซิงก์", en:"Bathroom and under the sink" }, lo:2500, hi:7000 },
        { id:"cam", t:{ th:"กล้องในห้อง ×1", en:"Indoor camera ×1" }, d:{ th:"ปิดเมื่อมีผู้เช่า", en:"Off while tenanted" }, lo:1000, hi:3500 },
        { id:"wifi", t:{ th:"Mesh Wi-Fi", en:"Mesh Wi-Fi" }, d:{ th:"แยกเครือข่ายผู้เช่า", en:"Separate tenant network" }, lo:2500, hi:8000 },
        { id:"filter", t:{ th:"เครื่องกรองน้ำใต้ซิงก์", en:"Under-sink water filter" }, d:{ th:"RO หรือ UF", en:"RO or UF" }, lo:4000, hi:12000 }
      ],
      note:{ th:"ราคาประมาณจากร้านค้าออนไลน์และห้างไอทีในไทย ต.ค. 2026 ไม่ใช่ใบเสนอราคา ตรวจราคาจริงและความเข้ากันได้ก่อนซื้อ", en:"Rough ranges from Thai online and IT retailers, Oct 2026. Not a quote; check real prices and compatibility before buying." } },
    { type:"cards", h:{ th:"ความเป็นส่วนตัวต้องออกแบบตั้งแต่แรก", en:"Design for privacy from day one" },
      intro:{ th:"ยิ่งบ้านฉลาด ข้อมูลยิ่งมาก เทรนด์ปี 2026 จึงเน้นให้ประมวลผลในบ้าน (Edge) แทนการส่งทุกอย่างขึ้นคลาวด์", en:"The smarter the home, the more data it holds. The 2026 trend is to process it at home (on the edge) rather than send everything to the cloud." },
      items:[
        { ic:"chip", t:{ th:"เลือกอุปกรณ์ที่รองรับ Matter", en:"Choose Matter devices" }, d:{ th:"ทำงานผ่านเครือข่ายในบ้านได้แม้อินเทอร์เน็ตล่ม และเปลี่ยนแบรนด์ได้โดยไม่ต้องรื้อทั้งระบบ[[1]]", en:"They keep working on the home network when the internet drops, and you can switch brands without starting over[[1]]." } },
        { ic:"key", t:{ th:"เปลี่ยนรหัสทุกครั้งที่เปลี่ยนมือ", en:"Reset at every handover" }, d:{ th:"ตอนรับโอนห้อง ให้รีเซ็ตกลอน กล้อง และบัญชีแอปทั้งหมด และทำซ้ำทุกครั้งที่เปลี่ยนผู้เช่า", en:"Reset the lock, cameras and app accounts when you take over the unit, and again with every new tenant." } },
        { ic:"globe", t:{ th:"แยก Wi-Fi ผู้เช่าออกจาก Wi-Fi อุปกรณ์", en:"Separate tenant and device Wi-Fi" }, d:{ th:"ผู้เช่าจะไม่เห็นหรือแก้ไขอุปกรณ์ของคุณ", en:"Tenants can't see or change your devices." } },
        { ic:"shield", t:{ th:"ปิดการบันทึกขึ้นคลาวด์ที่ไม่จำเป็น", en:"Turn off cloud recording you don't need" }, d:{ th:"เลือกแบรนด์ที่บอกชัดว่าเก็บข้อมูลที่ไหน และลบได้จริง", en:"Pick brands that say clearly where data is kept and let you delete it." } }
      ] },
    { type:"callout", tone:"warn", t:{ th:"Smart lock ไม่ได้ทำให้เช่ารายวันถูกกฎหมาย", en:"A smart lock doesn't make daily rentals legal" },
      p:{ th:"การปล่อยเช่าต่ำกว่า 30 วันถือเป็นธุรกิจโรงแรม ต้องมีใบอนุญาต และคอนโดส่วนใหญ่ห้ามไว้ในข้อบังคับ ใช้ Smart Home เพื่อบริหารการเช่ารายเดือนหรือรายปีแทน[[5]]", en:"Letting for under 30 days counts as running a hotel, needs a licence, and most condo by-laws ban it. Use smart devices to run monthly or yearly lets instead[[5]]." } },
    { type:"check", h:{ th:"เช็กตอนดูห้อง", en:"Check at the viewing" },
      items:[
        { th:"ประตูหนาพอและนิติอนุญาตให้เปลี่ยนเป็นกลอนดิจิทัลไหม", en:"Is the door thick enough, and will the building allow a digital lock?" },
        { th:"อาคารมีไฟเบอร์ของผู้ให้บริการกี่เจ้า", en:"Which fibre providers serve the building?" },
        { th:"แอร์เป็นอินเวอร์เตอร์ไหม อายุกี่ปี", en:"Are the air conditioners inverter models, and how old?" },
        { th:"มีปลั๊กไฟใกล้ประตูและรางม่านไหม", en:"Are there sockets near the door and the curtain track?" },
        { th:"ระบบคีย์การ์ดและอินเตอร์คอมของอาคารใช้ผ่านแอปได้ไหม", en:"Do the key cards and intercom work with an app?" },
        { th:"สัญญาณ Wi-Fi ถึงระเบียงและห้องน้ำไหม", en:"Does Wi-Fi reach the balcony and bathroom?" }
      ] }
  ],
  sources:[
    { t:"Connectivity Standards Alliance: Matter", u:"https://csa-iot.org/all-solutions/matter/", d:"" },
    { t:"Ananda Development: Bangkok condo for sale trends 2026", u:"https://www.ananda.co.th/blog/thegenc/bangkok-condo-for-sale-trends-2026/", d:"2026" },
    { t:"Mobility Foresights: Thailand smart home devices market", u:"https://mobilityforesights.com/product/thailand-smart-home-devices-market", d:"" },
    { t:"Personal Data Protection Committee (PDPC) Thailand", u:"https://www.pdpc.or.th/", d:"PDPA in force since June 2022" },
    { t:"Thailand Hotel Act B.E. 2547 (daily lets need a hotel licence; condo by-laws usually ban them)", u:"", d:"" },
    { t:"Th.Ho: Wellness Intelligence 2026 (privacy-by-design section)", u:"https://thbho.github.io/WellnessIntelligence.html", d:"2026" }
  ]
},

/* ================================================================== RELOCATE */
relocate: {
  slug:"Relocate", color:"#B4632D",
  short:{ th:"ย้ายมาอยู่ไทย", en:"Moving to Thailand" },
  kicker:{ th:"Relocation", en:"Relocation" },
  cardTitle:{ th:"วีซ่า ภาษี และชีวิตจริง", en:"Visas, tax and daily life" },
  cardText:{ th:"กฎวีซ่าที่เปลี่ยนในปี 2026 ตัวช่วยเลือกวีซ่า ภาษีเงินได้จากต่างประเทศ และค่าครองชีพพัทยา", en:"The 2026 visa changes, a visa finder, tax on foreign income, and Pattaya living costs." },
  title:{ th:"ย้ายมาอยู่ไทย: วีซ่า ภาษี และชีวิตจริง", en:"Moving to Thailand: visas, tax and daily life" },
  lead:{ th:"การซื้อคอนโดไม่ได้มาพร้อมวีซ่า ยกเว้นบางเส้นทางที่นับเงินซื้อห้องเป็นการลงทุนได้ ควรเลือกวีซ่าให้ตรงกับอายุ รายได้ และรูปแบบงานก่อนตัดสินใจซื้อ เพราะกฎหลายข้อเปลี่ยนในปี 2026",
         en:"Buying a condo does not come with a visa, except on a few routes that count the purchase as an investment. Pick the visa that fits your age, income and work before you buy, because several rules changed in 2026." },
  stats:[
    { v:{ th:"30 วัน", en:"30 days" }, l:{ th:"ฟรีวีซ่าใหม่ สำหรับ 60 ประเทศ ตั้งแต่ 15 ก.ย. 2026 (เดิม 60 วัน)", en:"new visa-free stay for 60 countries from 15 Sep 2026 (was 60)" }, src:1 },
    { v:{ th:"5 ปี", en:"5 years" }, l:{ th:"DTV เข้าได้ครั้งละ 180 วัน ใช้เงินในบัญชี ฿500,000", en:"DTV, 180 days per entry, ฿500,000 in funds" }, src:3 },
    { v:{ th:"10 ปี", en:"10 years" }, l:{ th:"LTR ค่าธรรมเนียม ฿50,000 รายงานตัวปีละครั้ง", en:"LTR, ฿50,000 fee, report once a year" }, src:4 },
    { v:{ th:"180 วัน", en:"180 days" }, l:{ th:"อยู่ไทยครบในปีภาษี = ผู้มีถิ่นที่อยู่ทางภาษี", en:"in Thailand in a tax year makes you tax resident" }, src:7 }
  ],
  blocks:[
    { type:"callout", tone:"warn", t:{ th:"เปลี่ยนแล้วในปี 2026", en:"Changed in 2026" },
      p:{ th:"<b>15 ก.ย.</b> ฟรีวีซ่าลดจาก 60 เหลือ 30 วัน ขอขยายได้อีก 30 วันตามดุลยพินิจ และเข้าทางบกได้ไม่เกิน 2 ครั้งต่อปี[[1]][[2]] · <b>31 ส.ค.</b> DTV ต้องยื่นที่สถานทูตในประเทศที่ถือสัญชาติหรือพำนัก และแนบใบรับรองความประพฤติ[[3]]",
         en:"<b>15 Sep:</b> visa-free stays fell from 60 to 30 days, with one 30-day extension at the officer's discretion and at most two land entries a year[[1]][[2]]. <b>31 Aug:</b> DTV applications must go through the mission for your nationality or residence, with a police record[[3]]." } },
    { type:"widget", w:"visa", h:{ th:"วีซ่าแบบไหนเหมาะกับคุณ", en:"Which visa fits you?" },
      wt:{ th:"ตอบ 5 ข้อ ดูทางเลือกที่น่าจะเหมาะ", en:"Answer 5 questions to see likely options" },
      wp:{ th:"ใช้เป็นแนวทางก่อนคุยกับทนายหรือบริษัทวีซ่า", en:"A starting point before you talk to a lawyer or visa agent" },
      visas:{
        exempt:{ t:{ th:"ฟรีวีซ่า 30 วัน", en:"30-day visa exemption" }, d:{ th:"สำหรับมาเที่ยวหรือดูห้อง ขยายได้อีก 30 วัน ไม่เหมาะกับการอยู่ยาว", en:"For holidays and viewings, extendable by 30 days. Not for long stays." } },
        dtv:{ t:{ th:"DTV (Destination Thailand Visa)", en:"DTV (Destination Thailand Visa)" }, d:{ th:"5 ปี เข้าได้ครั้งละ 180 วัน ขยายได้อีก 180 วัน เหมาะกับ remote worker ฟรีแลนซ์ หรือผู้มาเรียนมวยไทย ทำอาหาร รักษาตัว ต้องมีเงิน ฿500,000 และห้ามทำงานให้นายจ้างไทย", en:"5 years, 180 days per entry plus 180 days extension. For remote workers, freelancers, or people here for Muay Thai, cooking courses or treatment. Needs ฿500,000; no work for Thai employers." } },
        retire:{ t:{ th:"วีซ่าเกษียณ (Non-O / O-A)", en:"Retirement visa (Non-O / O-A)" }, d:{ th:"อายุ 50+ เงินฝากในไทย ฿800,000 หรือรายได้ ฿65,000/เดือน (หรือรวมกัน) ต่ออายุทุกปี และรายงานตัวทุก 90 วัน แบบ O-A ต้องมีประกันสุขภาพ", en:"Age 50+, ฿800,000 in a Thai bank or ฿65,000 a month income (or a mix). Renew yearly and report every 90 days. The O-A route needs health insurance." } },
        ltrWft:{ t:{ th:"LTR: Work-from-Thailand Professional", en:"LTR: Work-from-Thailand Professional" }, d:{ th:"รายได้เฉลี่ย US$80,000/ปี ใน 2 ปีล่าสุด (หรือ $40k–80k + ปริญญาโท) นายจ้างต่างประเทศเป็นบริษัทจดทะเบียน หรือมีรายได้รวม US$50M ใน 3 ปี", en:"Average income US$80,000 a year over 2 years (or $40k–80k with a master's). Overseas employer is listed, or has US$50M revenue over 3 years." } },
        ltrPen:{ t:{ th:"LTR: Wealthy Pensioner", en:"LTR: Wealthy Pensioner" }, d:{ th:"อายุ 50+ รายได้จากบำนาญหรือการลงทุน US$80,000/ปี หรือ $40k–80k + ลงทุนในไทย US$250,000", en:"Age 50+, passive income of US$80,000 a year, or $40k–80k plus a US$250,000 investment in Thailand." } },
        ltrWgc:{ t:{ th:"LTR: Wealthy Global Citizen", en:"LTR: Wealthy Global Citizen" }, d:{ th:"ทรัพย์สิน US$1M และลงทุนในไทย US$500,000 ซึ่ง<b>นับเงินซื้ออสังหาฯ ได้</b> หรือพันธบัตรรัฐบาล หรือหุ้นบริษัทไทย", en:"US$1M in assets and US$500,000 invested in Thailand, which <b>can be property</b>, government bonds or a Thai company." } },
        privilege:{ t:{ th:"Thailand Privilege (บัตรสมาชิก)", en:"Thailand Privilege (membership)" }, d:{ th:"จ่ายค่าสมาชิกครั้งเดียว ไม่ต้องพิสูจน์รายได้ Gold ฿900,000 (5 ปี) ถึง Reserve ฿5M (20 ปี) ระดับ Bronze ยังไม่แน่นอน ให้เช็กเว็บทางการ", en:"One-off membership, no income test. Gold ฿900,000 (5 years) to Reserve ฿5M (20 years). Bronze availability is unclear; check the official site." } },
        work:{ t:{ th:"Non-B + ใบอนุญาตทำงาน", en:"Non-B + work permit" }, d:{ th:"นายจ้างไทยเป็นผู้สนับสนุน ต่ออายุตามสัญญาจ้าง", en:"Sponsored by your Thai employer, renewed with your contract." } }
      } },
    { type:"table", h:{ th:"เทียบวีซ่าอยู่ยาว", en:"Long-stay visas compared" },
      cols:[ { th:"วีซ่า", en:"Visa" }, { th:"เหมาะกับ", en:"For" }, { th:"เงื่อนไขหลัก", en:"Main requirement" }, { th:"ระยะเวลา", en:"Length" } ],
      rows:[
        [ "DTV", { th:"Remote worker, ฟรีแลนซ์, กิจกรรม Soft Power", en:"Remote workers, freelancers, soft-power activities" }, { th:"เงิน ฿500,000 ค่าธรรมเนียมราว ฿10,000[[3]]", en:"฿500,000 funds, fee about ฿10,000[[3]]" }, { th:"5 ปี ครั้งละ 180 วัน", en:"5 years, 180 days per entry" } ],
        [ { th:"เกษียณ Non-O / O-A", en:"Retirement Non-O / O-A" }, { th:"อายุ 50+", en:"Age 50+" }, { th:"฿800,000 หรือ ฿65,000/เดือน[[6]]", en:"฿800,000 or ฿65,000/month[[6]]" }, { th:"1 ปี ต่อทุกปี", en:"1 year, renewable" } ],
        [ "LTR", { th:"ผู้มีรายได้หรือทรัพย์สินสูง ผู้เชี่ยวชาญ", en:"High earners, wealthy people, experts" }, { th:"ตาม 4 ประเภท ประกันสุขภาพ US$50,000 หรือเงินฝาก US$100,000[[4]]", en:"By category; US$50,000 health cover or US$100,000 deposit[[4]]" }, { th:"10 ปี (5+5)", en:"10 years (5+5)" } ],
        [ "Thailand Privilege", { th:"ผู้ต้องการความสะดวก ไม่อยากพิสูจน์รายได้", en:"People who want ease, no income proof" }, { th:"฿650,000–5M ตามระดับ[[8]]", en:"฿650,000–5M by tier[[8]]" }, { th:"5–20 ปี", en:"5–20 years" } ]
      ],
      note:{ th:"ผู้ถือ LTR ประเภท Highly-skilled เสียภาษีเงินได้อัตราเดียว 17% และได้ยกเว้นภาษีเงินได้จากต่างประเทศตามเงื่อนไข[[4]]", en:"LTR highly-skilled holders pay a flat 17% income tax and get an exemption on foreign income, subject to conditions[[4]]." } },
    { type:"cards", h:{ th:"ภาษี: เรื่องที่คนซื้อห้องมักลืม", en:"Tax: what buyers often miss" },
      intro:{ th:"ถ้าอยู่ไทยรวมกันครบ 180 วันในปีภาษี คุณเป็นผู้มีถิ่นที่อยู่ทางภาษี ไม่ว่าถือวีซ่าประเภทไหน[[7]]", en:"Spend 180 days in Thailand in a tax year, in total, and you are tax resident, whatever visa you hold[[7]]." },
      items:[
        { ic:"coin", t:{ th:"เงินได้จากต่างประเทศ เสียภาษีเมื่อนำเข้าไทย", en:"Foreign income is taxed when brought in" }, d:{ th:"เงินได้ที่เกิดตั้งแต่ 1 ม.ค. 2024 เมื่อนำเข้าไทยในปีที่เป็นผู้มีถิ่นที่อยู่ ต้องนำมาคำนวณภาษี (คำสั่ง ป.161/2566 และ ป.162/2566) อัตรา 0–35%", en:"Income earned from 1 Jan 2024 is assessable when you bring it into Thailand in a year you are resident (orders Por. 161/2566 and 162/2566), at 0–35%." } },
        { ic:"bank", t:{ th:"เงินซื้อห้องควรวางแผนก่อนโอน", en:"Plan the money for the purchase" }, d:{ th:"เงินเก็บที่ได้ก่อนปี 2024 หรือโอนเข้ามาก่อนเป็นผู้มีถิ่นที่อยู่ มักไม่ถูกนับเป็นเงินได้ เก็บหลักฐานที่มาของเงินไว้ และปรึกษานักภาษีก่อนโอนก้อนใหญ่", en:"Savings from before 2024, or money brought in before you become resident, usually isn't counted as income. Keep proof of where it came from, and see a tax adviser before a large transfer." } },
        { ic:"info", t:{ th:"ข้อยกเว้นที่รอกันอยู่ ยังไม่เป็นกฎหมาย", en:"The awaited exemption is not law yet" }, d:{ th:"มีข้อเสนอยกเว้นภาษีเงินที่นำเข้าภายในปีเดียวกัน แต่จนถึงกลางปี 2026 ยังไม่ประกาศใช้[[7]] สนธิสัญญาภาษีซ้อน (DTA) อาจช่วยเครดิตภาษีที่จ่ายไปแล้วได้", en:"A proposal to exempt money remitted in the same year had not been enacted by mid-2026[[7]]. A double tax agreement may credit tax already paid abroad." } }
      ] },
    { type:"cards", h:{ th:"ชีวิตจริงในพัทยา–จอมเทียน", en:"Daily life in Pattaya–Jomtien" },
      items:[
        { ic:"wallet", t:{ th:"ค่าครองชีพ", en:"Living costs" }, list:[
            { th:"คนเดียว ไม่รวมค่าเช่า ราว ฿20,000–25,000/เดือน[[9]][[10]]", en:"Single, excluding rent: about ฿20,000–25,000 a month[[9]][[10]]" },
            { th:"คนเดียวแบบสบาย ๆ ราว ฿38,000–51,000/เดือน[[9]][[10]]", en:"Single, comfortable: about ฿38,000–51,000 a month[[9]][[10]]" },
            { th:"เช่า 1 ห้องนอน ราว ฿11,900 (นอกเมือง) ถึง ฿17,900 (ในเมือง)[[9]][[10]]", en:"1-bed rent: about ฿11,900 (outside centre) to ฿17,900 (centre)[[9]][[10]]" } ] },
        { ic:"hospital", t:{ th:"สุขภาพและประกัน", en:"Health and insurance" }, d:{ th:"มีโรงพยาบาลเอกชนระดับสากลหลายแห่ง ประกันสุขภาพเอกชนสำหรับชาวต่างชาติราว US$1,000–2,500/ปี ขึ้นกับอายุ[[6]]", en:"Several international-standard private hospitals. Private cover for foreigners runs about US$1,000–2,500 a year, depending on age[[6]]." } },
        { ic:"school", t:{ th:"โรงเรียนนานาชาติ", en:"International schools" }, d:{ th:"Regents International School Pattaya (IB และ A-Level นักเรียนราว 1,100 คน จาก 50+ สัญชาติ)[[11]] และมีอีกหลายแห่งในชลบุรี ศรีราชา และระยอง", en:"Regents International School Pattaya (IB and A-Level, about 1,100 pupils from 50+ nationalities)[[11]], with more in Chonburi, Si Racha and Rayong." } },
        { ic:"doc", t:{ th:"เอกสารที่ต้องรู้", en:"Paperwork to know" }, list:[
            { th:"TDAC บัตรขาเข้าออนไลน์ ก่อนเดินทางทุกครั้ง[[12]]", en:"TDAC online arrival card before every trip[[12]]" },
            { th:"TM30 แจ้งที่พัก (เจ้าของห้องหรือผู้ให้เช่าแจ้ง)", en:"TM30 address report (filed by the owner or landlord)" },
            { th:"รายงานตัว 90 วัน (LTR รายงานปีละครั้ง)", en:"90-day report (LTR: once a year)" },
            { th:"ทะเบียนบ้านเล่มเหลืองสำหรับชาวต่างชาติ ช่วยเรื่องธนาคารและใบขับขี่", en:"A yellow house book for foreigners helps with banks and driving licences" } ] },
        { ic:"plane", t:{ th:"การเดินทาง (โดยประมาณ)", en:"Getting around (approx.)" }, list:[
            { th:"สนามบินอู่ตะเภา ราว 40 นาที", en:"U-Tapao airport: about 40 minutes" },
            { th:"สุวรรณภูมิ ราว 1 ชม. 30 นาที", en:"Suvarnabhumi: about 1.5 hours" },
            { th:"กรุงเทพฯ ราว 2 ชั่วโมง", en:"Bangkok: about 2 hours" } ] }
      ] },
    { type:"steps", h:{ th:"ลำดับที่แนะนำ", en:"A sensible order" },
      items:[
        { t:{ th:"เลือกวีซ่าก่อน", en:"Pick the visa first" }, d:{ th:"รู้ว่าจะอยู่ปีละกี่วัน และใช้เส้นทางไหน", en:"Know how many days a year you'll stay, and on which route." } },
        { t:{ th:"วางแผนภาษีและการโอนเงิน", en:"Plan tax and the transfer" }, d:{ th:"ดูว่าเงินก้อนไหนจะโอนเข้ามา และควรโอนเมื่อไร", en:"Decide which money comes in, and when." } },
        { t:{ th:"เปิดบัญชีธนาคารไทย", en:"Open a Thai bank account" }, d:{ th:"บางธนาคารต้องใช้วีซ่าอยู่ยาว หรือหนังสือรับรองที่อยู่", en:"Some banks ask for a long-stay visa or proof of address." } },
        { t:{ th:"ทำประกันสุขภาพ", en:"Get health cover" }, d:{ th:"บางวีซ่าบังคับ และเบี้ยจะแพงขึ้นตามอายุ", en:"Some visas require it, and premiums rise with age." } },
        { t:{ th:"ซื้อห้อง แล้วแจ้ง TM30", en:"Buy, then file TM30" }, d:{ th:"แจ้งที่อยู่ใหม่กับ ตม. หลังย้ายเข้า", en:"Report your new address to immigration after moving in." } }
      ] }
  ],
  sources:[
    { t:"Bangkok Post: 30-day visa-free stays to take effect on Sept 15", u:"https://www.bangkokpost.com/thailand/general/3311970/30day-visafree-stays-to-take-effect-on-sept-15", d:"Sep 2026" },
    { t:"Vialto Partners: Thailand changes to visa exemption scheme, effective 15 Sep 2026", u:"https://vialtopartners.com/regional-alerts/thailand-immigration-changes-to-visa-exemption-scheme-effective-15-september-2026", d:"Sep 2026" },
    { t:"Lex Bangkok: Destination Thailand Visa, new rules from 31 August 2026", u:"https://lexbangkok.com/destination-thailand-visa-dtv/", d:"2026" },
    { t:"Thailand BOI: Long-Term Resident (LTR) visa", u:"https://ltr.boi.go.th/", d:"official" },
    { t:"Tilleke & Gibbins: Thailand eases requirements for LTR visas", u:"https://www.tilleke.com/insights/thailand-eases-requirements-for-long-term-resident-visas/", d:"Feb 2025" },
    { t:"Issa Compass: Retirement visa Thailand 2026", u:"https://www.issacompass.com/insights/retirement-visa-thailand", d:"2026" },
    { t:"Brer Rabbit Legal: remittance tax exemption still not law (2026)", u:"https://brerrabbitlegal.co.th/insights/thailand-remittance-tax-exemption-2026-status/", d:"2026" },
    { t:"The Thaiger: Thailand Privilege visa tiers and cost", u:"https://thethaiger.com/visas/thailand-privilege/", d:"2026" },
    { t:"Thailand Starter Kit: Living in Pattaya, costs (2026)", u:"https://www.thailandstarterkit.com/moving/living-in-pattaya-with-50000-thai-baht-per-month/", d:"2026" },
    { t:"Pattaya Mail: Pattaya expat life in 2026", u:"https://www.pattayamail.com/latestnews/news/pattaya-expat-life-in-2026-paradise-or-challenge-560234", d:"2026" },
    { t:"Pearl Property: Pattaya neighbourhoods, schools and healthcare", u:"https://pearlpropertythailand.com/blog/pattaya-expat-neighborhoods-schools-healthcare-lifestyle-guide", d:"2026" },
    { t:"Thailand Digital Arrival Card (TDAC), Immigration Bureau", u:"https://tdac.immigration.go.th/", d:"official" }
  ]
},

/* ======================================================================= EEC */
eec: {
  slug:"EEC", color:"#1F5E86",
  short:{ th:"EEC & Global Shift", en:"EEC & Global Shift" },
  kicker:{ th:"EEC · Global Shift", en:"EEC · Global Shift" },
  cardTitle:{ th:"EEC: อะไรเกิดขึ้นจริงแล้ว", en:"EEC: what is really happening" },
  cardText:{ th:"สนามบิน ท่าเรือ Data Center และกระแสย้ายฐานปี 2026 แยกให้เห็นว่าอะไรเริ่มจริง อะไรยังเป็นแผน", en:"Airport, port, data centres and the 2026 shift, sorted into what has started and what is still a plan." },
  title:{ th:"EEC และกระแสย้ายฐาน 2026: อะไรเกิดขึ้นจริงแล้ว", en:"EEC and the 2026 shift: what is actually happening" },
  lead:{ th:"ภาคตะวันออกมีโครงการใหญ่หลายตัว บางตัวเริ่มก่อสร้างแล้ว บางตัวยังติดปัญหา หน้านี้แยกสถานะให้เห็นชัด และสรุปว่ามีผลอย่างไรกับคนที่อยู่หรือซื้อทรัพย์แถวพัทยา–จอมเทียน",
         en:"The Eastern Seaboard has several megaprojects: some are being built, others are stuck. This page shows the real status of each and what it means for anyone living or buying around Pattaya–Jomtien." },
  stats:[
    { v:"฿728B", l:{ th:"คำขอลงทุน Data Center ปี 2025 (36 โครงการ ระยอง 33% ชลบุรี 32%)", en:"data-centre applications in 2025 (36 projects; Rayong 33%, Chonburi 32%)" }, src:5 },
    { v:{ th:"50 ปี", en:"50 years" }, l:{ th:"สัมปทานอู่ตะเภา เริ่มงาน 3 เม.ย. 2026", en:"U-Tapao concession, works began 3 Apr 2026" }, src:1 },
    { v:"4,164", l:{ th:"ห้องที่ชาวต่างชาติซื้อในชลบุรีปี 2025 มากเป็นอันดับ 2 รองจากกรุงเทพฯ", en:"condos bought by foreigners in Chonburi in 2025, 2nd after Bangkok" }, src:9 },
    { v:"30–34M", l:{ th:"เป้านักท่องเที่ยวต่างชาติปี 2026 ที่ ททท. ปรับลด", en:"foreign arrivals, TAT's revised 2026 forecast" }, src:11 }
  ],
  blocks:[
    { type:"widget", w:"map", h:{ th:"แผนที่โครงการรอบจอมเทียน", en:"Projects around Jomtien" },
      wt:{ th:"แตะหมายเลขเพื่อดูรายละเอียด", en:"Tap a number for details" },
      wp:{ th:"สีของป้ายบอกสถานะล่าสุด ณ ต.ค. 2026", en:"Labels show the status as of Oct 2026" },
      points:[
        { lon:101.0, lat:12.69, c:"#1F5E86", st:"building", t:{ th:"สนามบินอู่ตะเภาและเมืองการบิน", en:"U-Tapao airport & aviation city" }, d:{ th:"ราว 40 กม. จากจอมเทียน เฟสแรกรองรับ 3–4 ล้านคน/ปี ใช้เวลาสร้างราว 3–4 ปี[[1]][[2]]", en:"About 40 km from Jomtien. Phase 1 handles 3–4M passengers a year and takes about 3–4 years to build[[1]][[2]]." } },
        { lon:100.89, lat:13.08, c:"#2D7D9A", st:"building", t:{ th:"ท่าเรือแหลมฉบัง เฟส 3", en:"Laem Chabang Port Phase 3" }, d:{ th:"ราว 40 กม. ถมทะเลเกิน 80% (ต.ค. 2025) ท่า F1 ตั้งเป้าเปิดปี 2027[[4]]", en:"About 40 km. Land reclamation passed 80% (Oct 2025); terminal F1 targets 2027[[4]]." } },
        { lon:101.05, lat:13.25, c:"#6640A8", st:"investing", t:{ th:"กลุ่ม Data Center ชลบุรี", en:"Chonburi data-centre cluster" }, d:{ th:"Google (Quartz Computing) ฿32.8B และ Bridge Data Centres ฿24.6B ในชลบุรี[[5]][[6]]", en:"Google (Quartz Computing) ฿32.8B and Bridge Data Centres ฿24.6B in Chonburi[[5]][[6]]." } },
        { lon:101.15, lat:13.31, c:"#8A5BC4", st:"approved", t:{ th:"E-Tech Smart Park บ้านบึง", en:"E-Tech Smart Park, Ban Bueng" }, d:{ th:"หนึ่งใน 4 เขตส่งเสริมใหม่ที่ กพอ. อนุมัติ 26 ต.ค. 2026 มูลค่า ฿19.75B (รวม 4 เขต ฿25.66B)[[7]]", en:"One of four new zones the EEC board approved on 26 Oct 2026, worth ฿19.75B (all four: ฿25.66B)[[7]]." } },
        { lon:101.2, lat:12.95, c:"#2F7A4F", st:"operating", t:{ th:"คลัสเตอร์รถยนต์ไฟฟ้า ระยอง", en:"Rayong EV cluster" }, d:{ th:"โรงงานรถ EV จีนหลายแบรนด์ เช่น BYD ที่เปิดผลิตตั้งแต่ปี 2024", en:"Several Chinese EV plants, including BYD, producing since 2024." } },
        { lon:101.07, lat:13.69, c:"#A8461F", st:"delayed", t:{ th:"รถไฟความเร็วสูงเชื่อม 3 สนามบิน", en:"Three-airport high-speed rail" }, d:{ th:"ยังไม่เริ่มก่อสร้าง ติดเรื่องสัญญาและเงินกู้ (ก.ค. 2026) รัฐบาลยังไม่ตัดสินใจขั้นสุดท้าย[[3]]", en:"Not started. Stuck on contract terms and loans (July 2026); no final government decision[[3]]." } }
      ] },
    { type:"timeline", h:{ th:"สถานะโครงการหลัก", en:"Status of the main projects" },
      intro:{ th:"เรียงจากสิ่งที่เกิดขึ้นแล้ว ไปจนถึงสิ่งที่ยังเป็นแผน", en:"From what is already happening to what is still a plan." },
      items:[
        { st:"operating", when:{ th:"ตั้งแต่ 2024", en:"Since 2024" }, t:{ th:"โรงงาน EV และอุตสาหกรรมใหม่ในระยอง ชลบุรี", en:"EV plants and new industry in Rayong and Chonburi" }, d:{ th:"สร้างงานวิศวกร ผู้จัดการ และช่างเทคนิค ที่ต้องการที่พักรายเดือนหรือรายปี", en:"Jobs for engineers, managers and technicians who need monthly or yearly rentals." } },
        { st:"investing", when:{ th:"2024 – 2026", en:"2024 – 2026" }, t:{ th:"Data Center ระดับ Hyperscale", en:"Hyperscale data centres" }, d:{ th:"ปี 2025 มีคำขอ 36 โครงการ ฿728B ม.ค. 2026 อนุมัติอีก 7 โครงการ ฿96B[[5]][[6]]", en:"36 applications worth ฿728B in 2025; seven more worth ฿96B approved in Jan 2026[[5]][[6]]." } },
        { st:"building", when:{ th:"เริ่ม 3 เม.ย. 2026", en:"From 3 Apr 2026" }, t:{ th:"สนามบินอู่ตะเภา เฟส 1", en:"U-Tapao airport, phase 1" }, d:{ th:"อาคารผู้โดยสารหลัก 3–4 ล้านคน/ปี ลงทุนช่วงแรกราว ฿10B คาดเสร็จราวปี 2029–2030[[1]][[2]]", en:"Main terminal for 3–4M passengers a year, first-stage cost about ฿10B, expected around 2029–2030[[1]][[2]]." } },
        { st:"building", when:{ th:"F1 เป้า 2027 · F2 เป้า 2031", en:"F1 target 2027 · F2 2031" }, t:{ th:"ท่าเรือแหลมฉบัง เฟส 3", en:"Laem Chabang Port Phase 3" }, d:{ th:"ล่าช้าเล็กน้อยจากการส่งมอบพื้นที่[[4]]", en:"Slightly behind schedule over a land handover issue[[4]]." } },
        { st:"approved", when:{ th:"26 ต.ค. 2026", en:"26 Oct 2026" }, t:{ th:"เขตส่งเสริมใหม่ 4 แห่ง ฿25.66B", en:"Four new promotion zones, ฿25.66B" }, d:{ th:"ใหญ่สุดคือ E-Tech Smart Park บ้านบึง ชลบุรี ฿19.75B[[7]]", en:"The largest is E-Tech Smart Park in Ban Bueng, Chonburi, ฿19.75B[[7]]." } },
        { st:"delayed", when:{ th:"ยังไม่เริ่ม", en:"Not started" }, t:{ th:"รถไฟความเร็วสูง ดอนเมือง–สุวรรณภูมิ–อู่ตะเภา", en:"Don Mueang–Suvarnabhumi–U-Tapao high-speed rail" }, d:{ th:"สนามบินแยกเดินหน้าได้แล้วตั้งแต่ ม.ค. 2026 ส่วนรถไฟยังเจรจาสัญญา[[3]]", en:"The airport was decoupled in Jan 2026 so it could proceed; the rail contract is still under negotiation[[3]]." } },
        { st:"planned", when:{ th:"ไม่มีกำหนดชัด", en:"No firm date" }, t:{ th:"EECmd เมืองการแพทย์ และส่วนต่อขยายมอเตอร์เวย์", en:"EECmd medical hub and motorway extensions" }, d:{ th:"ยังเป็นแผน ไม่พบความคืบหน้าล่าสุด", en:"Still plans, with no recent progress found." } }
      ] },
    { type:"proscons", h:{ th:"กระแสย้ายฐานปี 2026: มองให้ครบสองด้าน", en:"The 2026 shift: both sides of the story" },
      intro:{ th:"ความขัดแย้งในตะวันออกกลางที่ปะทุตั้งแต่ 28 ก.พ. 2026 ทำให้ทุนและคนบางส่วนมองหาที่ปลอดภัย แต่ข้อมูลยังชี้ไปได้ทั้งสองทาง", en:"The Middle East conflict that began on 28 Feb 2026 has sent some capital and people looking for safety, but the data points both ways." },
      pro:{ t:{ th:"สัญญาณบวก", en:"Signals for" }, items:[
        { th:"Colliers คาดว่าความต้องการคอนโดและบ้านเช่าในกรุงเทพฯ ภูเก็ต พัทยา สมุย และเชียงใหม่ จะได้ประโยชน์จากคนย้ายออกจากพื้นที่ขัดแย้ง[[10]]", en:"Colliers expects condo and rental demand in Bangkok, Phuket, Pattaya, Samui and Chiang Mai to benefit from people leaving conflict zones[[10]]." },
        { th:"ฐานการผลิต China+1 และ AI Data Center เลือก EEC เพราะพลังงาน ที่ดิน และสิทธิประโยชน์ BOI", en:"China+1 manufacturing and AI data centres are choosing the EEC for its power, land and BOI incentives." },
        { th:"ชลบุรีเป็นตลาดคอนโดต่างชาติอันดับ 2 (4,164 ห้องในปี 2025) ผู้ซื้อรัสเซียเพิ่ม 8.6% ด้านจำนวน และ 30% ด้านมูลค่า[[9]]", en:"Chonburi is the No. 2 foreign condo market (4,164 units in 2025); Russian buyers rose 8.6% by units and 30% by value[[9]]." } ] },
      con:{ t:{ th:"ข้อควรระวัง", en:"Reasons for care" }, items:[
        { th:"Cushman & Wakefield มองว่าไทยยังเป็นที่พักพิงระยะสั้น มากกว่าบ้านหลักของกลุ่มมหาเศรษฐี[[12]]", en:"Cushman & Wakefield sees Thailand as a short-term haven more than a main home for the ultra-wealthy[[12]]." },
        { th:"ไตรมาส 1/2026 การโอนคอนโดของต่างชาติทั้งประเทศลดลง 17.3% เหลือ 3,241 ห้อง[[8]]", en:"Foreign condo transfers nationwide fell 17.3% to 3,241 units in Q1 2026[[8]]." },
        { th:"ททท. ลดเป้านักท่องเที่ยวเหลือ 30–34 ล้านคน นักท่องเที่ยวจากตะวันออกกลางลดลง 24.9%[[11]]", en:"TAT cut its arrivals forecast to 30–34M; visitors from the Middle East fell 24.9%[[11]]." },
        { th:"รถไฟความเร็วสูงยังไม่เริ่ม และบางทำเลในพัทยามีอุปทานคอนโดเกิน", en:"The high-speed rail hasn't started, and some Pattaya areas have a condo oversupply." } ] } },
    { type:"cards", h:{ th:"มีผลอย่างไรกับคนซื้อในจอมเทียน", en:"What it means for a Jomtien buyer" },
      items:[
        { ic:"people", t:{ th:"ผู้เช่ากลุ่มใหม่", en:"A new kind of tenant" }, d:{ th:"คนทำงานจาก Data Center ท่าเรือ และสนามบิน มักเช่ารายเดือนหรือรายปี ห้องที่ใกล้ถนนสุขุมวิทและมอเตอร์เวย์จึงได้เปรียบ", en:"Staff from the data centres, port and airport tend to rent by the month or year, which favours units close to Sukhumvit Road and the motorway." } },
        { ic:"plane", t:{ th:"สนามบินคือโอกาสระยะยาว", en:"The airport is a long-term upside" }, d:{ th:"เฟสแรกคาดเสร็จราวปี 2029–2030 ตัดสินใจจากราคาและสภาพห้องวันนี้ แล้วนับสนามบินเป็นโบนัส ส่วนรถไฟความเร็วสูงยังไม่ควรนับ", en:"Phase 1 is due around 2029–2030. Decide on today's price and condition, count the airport as a bonus, and don't count the rail yet." } },
        { ic:"home", t:{ th:"ห้องมือสองในตึกที่เปิดใช้แล้ว", en:"Resale in a finished building" }, d:{ th:"เห็นสภาพอาคาร นิติบุคคล และค่าส่วนกลางจริง ลดความเสี่ยงจากโครงการที่ยังไม่สร้าง ในตลาดที่บางทำเลอุปทานเกิน", en:"You see the real building, management and fees, which cuts the risk of off-plan projects in a market where some areas are oversupplied." } },
        { ic:"globe", t:{ th:"กระจายความเสี่ยงสินทรัพย์", en:"Spread your risk" }, d:{ th:"สำหรับคนที่ถือทรัพย์สินในภูมิภาคที่มีความขัดแย้ง ห้องในไทยเป็นสินทรัพย์ในสกุลบาทที่ใช้อยู่เองได้ ระหว่างที่สถานการณ์ยังไม่แน่นอน", en:"For people with assets in conflict regions, a Thai home is a baht asset you can live in while things settle." } }
      ] },
    { type:"callout", t:{ th:"อ่านฉบับเต็ม", en:"Read the full reports" }, p:{ th:"บทวิเคราะห์ <a href=\"https://thbho.github.io/GlobalShift2026.html\" target=\"_blank\" rel=\"noopener\">Global Shift 2026</a> และ <a href=\"https://thbho.github.io/PivotToEEC.html\" target=\"_blank\" rel=\"noopener\">Pivot to EEC</a> มีรายละเอียดเชิงลึก (ข้อมูล มี.ค. 2026) ส่วนหน้านี้อัปเดตสถานะล่าสุดแล้ว", en:"<a href=\"https://thbho.github.io/GlobalShift2026.html\" target=\"_blank\" rel=\"noopener\">Global Shift 2026</a> and <a href=\"https://thbho.github.io/PivotToEEC.html\" target=\"_blank\" rel=\"noopener\">Pivot to EEC</a> go deeper (data from March 2026). This page has the latest status." } }
  ],
  sources:[
    { t:"Nation Thailand: U-Tapao megaproject enters delivery phase", u:"https://www.nationthailand.com/news/policy/40065619", d:"Apr 2026" },
    { t:"Bangkok Post: EEC counts on U-Tapao, Aerotropolis progress", u:"https://www.bangkokpost.com/business/investment/3223024/eastern-economic-corridor-counts-on-utapao-aerotropolis-progress", d:"2026" },
    { t:"Nation Thailand: U-Tapao and high-speed rail, EEC's make-or-break bet", u:"https://www.nationthailand.com/business/economy/40070765", d:"Jul 2026" },
    { t:"Logistics Manager: Laem Chabang Port advances Phase 3", u:"https://logistics-manager.com/laem-chabang-port-advances-phase-3-expansion-to-strengthen-thai-logistics-2/", d:"Mar 2026" },
    { t:"Asia Times: Thailand's bid to become ASEAN's data centre capital", u:"https://asiatimes.com/2026/06/thailands-big-money-bid-to-become-aseans-data-center-capital/", d:"Jun 2026" },
    { t:"Nation Thailand: BOI approves THB 96bn data centre investments", u:"https://www.nationthailand.com/business/tech/40061267", d:"Jan 2026" },
    { t:"Nation Thailand: EEC board approves 4 new investment zones worth 25.66 billion baht", u:"https://www.nationthailand.com/business/investment/40072768", d:"26 Oct 2026" },
    { t:"Leto: foreign condo purchases in Thailand (REIC data)", u:"https://leto.condos/en/articles/inostrannye-pokupki-kondo-tailand", d:"2026" },
    { t:"Khaosod English: China still tops Thai condo market, Myanmar jumps to No.2", u:"https://www.khaosodenglish.com/featured/2026/03/04/china-still-tops-thai-condo-market-myanmar-jumps-to-no-2/", d:"Mar 2026" },
    { t:"Bangkok Post: War set to boost condo demand in major markets", u:"https://www.bangkokpost.com/property/3240800/war-set-to-boost-condo-demand-in-major-markets", d:"2026" },
    { t:"Nation Thailand: TAT forecasts 33 million foreign tourists as oil costs weigh", u:"https://www.nationthailand.com/news/tourism/40067283", d:"Jun 2026" },
    { t:"Bangkok Post: Mideast expats eye Thai luxury homes", u:"https://www.bangkokpost.com/property/3228470/mideast-expats-eye-thai-luxury-homes", d:"2026" }
  ]
},

/* ==================================================================== BUYING */
buying: {
  slug:"Buying", color:"#8A6A1C",
  short:{ th:"คู่มือซื้อสำหรับต่างชาติ", en:"Foreign buyer guide" },
  kicker:{ th:"Foreign Buyer Guide", en:"Foreign Buyer Guide" },
  cardTitle:{ th:"กฎ ค่าใช้จ่าย และขั้นตอน", en:"Rules, costs and steps" },
  cardText:{ th:"โควตา 49% การโอนเงินจากต่างประเทศ ตัวคำนวณค่าใช้จ่ายวันโอน และขั้นตอนตั้งแต่จองถึงรับกุญแจ", en:"The 49% quota, bringing money in, a transfer-day cost calculator, and the steps from booking to keys." },
  title:{ th:"ซื้อคอนโดในไทยสำหรับชาวต่างชาติ", en:"Buying a condo in Thailand as a foreigner" },
  lead:{ th:"ชาวต่างชาติถือกรรมสิทธิ์ห้องชุดได้เต็มรูปแบบ (Freehold) ภายในโควตา 49% ของอาคาร ถ้าโอนเงินจากต่างประเทศถูกวิธี หน้านี้สรุปกฎ ค่าใช้จ่าย และขั้นตอนตั้งแต่จองจนรับโอน",
         en:"Foreigners can own a condo outright (freehold) within the building's 49% foreign quota, as long as the money comes from abroad the right way. Here are the rules, costs and steps from booking to transfer." },
  stats:[
    { v:"49%", l:{ th:"โควตาต่างชาติต่ออาคารชุด ข้อเสนอ 75% ยังไม่ผ่าน", en:"foreign quota per condo; the 75% proposal hasn't passed" }, src:1 },
    { v:"2%", l:{ th:"ค่าธรรมเนียมโอนสำหรับต่างชาติ (ส่วนลด 0.01% เฉพาะคนไทย)", en:"transfer fee for foreigners (the 0.01% cut is Thai-only)" }, src:3 },
    { v:"14,899", l:{ th:"ห้องที่ชาวต่างชาติซื้อปี 2025 (+2.2%) มูลค่า ฿60.92B", en:"units bought by foreigners in 2025 (+2.2%), ฿60.92B" }, src:5 },
    { v:{ th:"30 ปี", en:"30 years" }, l:{ th:"สัญญาเช่าที่ดินสูงสุด ข้อเสนอ 99 ปียังไม่เป็นกฎหมาย", en:"maximum land lease; the 99-year idea isn't law" }, src:2 }
  ],
  blocks:[
    { type:"cards", h:{ th:"ชาวต่างชาติถือครองอะไรได้บ้าง", en:"What foreigners can own" },
      items:[
        { ic:"home", t:{ th:"คอนโดในโควตาต่างชาติ (Freehold)", en:"Condo in the foreign quota (freehold)" }, d:{ th:"ชื่อคุณอยู่บนหนังสือกรรมสิทธิ์ห้องชุด (อ.ช.2) ขายต่อหรือตกทอดได้ โควตา 49% นับต่อนิติบุคคลอาคารชุด ถ้าใกล้เต็ม สำนักงานที่ดินอาจใช้เวลาตรวจเพิ่ม 1–3 สัปดาห์[[1]]", en:"Your name goes on the unit title (Or.Chor.2), which you can sell or pass on. The 49% is counted per condo juristic person; near the cap, the Land Office may take 1–3 extra weeks to check[[1]]." }, tag:{ th:"ดูช่องโควตา FR ในหน้ารายการ", en:"Look for “FR” quota on listings" } },
        { ic:"doc", t:{ th:"ห้องในโควตาไทย", en:"Unit in the Thai quota" }, d:{ th:"ชาวต่างชาติถือแบบ Freehold ไม่ได้ ทางเลือกคือจดทะเบียนเช่าระยะยาว (สูงสุด 30 ปี) หรือให้คู่สมรสคนไทยถือ", en:"Not available freehold to foreigners. Options are a registered lease (up to 30 years) or ownership by a Thai spouse." } },
        { ic:"leaf", t:{ th:"บ้านและที่ดิน", en:"Houses and land" }, d:{ th:"ชาวต่างชาติถือที่ดินไม่ได้ ทางที่ใช้ได้คือเช่าที่ดินจดทะเบียน 30 ปี (สัญญาว่าจะต่ออายุเกิน 30 ปีไม่มีกฎหมายรับรองแน่นอน) และเป็นเจ้าของตัวบ้านบนที่ดินเช่า การถือผ่านบริษัทที่มีผู้ถือหุ้นไทยแบบนอมินีผิดกฎหมาย[[2]]", en:"Foreigners can't own land. Workable routes are a registered 30-year land lease (promises to renew beyond 30 years are not guaranteed by law) and owning the house on leased land. Nominee company structures are illegal[[2]]." } }
      ] },
    { type:"cards", h:{ th:"โอนเงินจากต่างประเทศให้ถูกวิธี", en:"Bring the money in the right way" },
      intro:{ th:"ถ้าพลาดขั้นตอนนี้ สำนักงานที่ดินจะไม่จดกรรมสิทธิ์ให้ในโควตาต่างชาติ", en:"Get this wrong and the Land Office won't register the unit in the foreign quota." },
      items:[
        { ic:"globe", t:{ th:"โอนเป็นเงินตราต่างประเทศ", en:"Send foreign currency" }, d:{ th:"โอนจากต่างประเทศเข้าบัญชีธนาคารไทยในชื่อผู้ซื้อหรือบัญชีผู้ขายหรือผู้พัฒนา ระบุวัตถุประสงค์ว่าเพื่อซื้อห้องชุดเลขที่เท่าไร", en:"Wire from abroad to a Thai account in the buyer's name, or the seller's or developer's account, stating the purpose: purchase of condo unit no. X." } },
        { ic:"doc", t:{ th:"ขอเอกสาร FET", en:"Get the FET form" }, d:{ th:"ธนาคารออกแบบ ธ.ต.3 (FET) สำหรับยอดตั้งแต่ US$50,000 หรือหนังสือรับรองการรับเงิน (Credit Advice) สำหรับยอดต่ำกว่า เก็บตัวจริงไว้ใช้วันโอน และตอนขายเพื่อโอนเงินกลับ[[1]]", en:"The bank issues an FET form for US$50,000 or more, or a credit advice for less. Keep the originals for transfer day and for sending money home when you sell[[1]]." } },
        { ic:"bank", t:{ th:"อย่ารวมหลายคนในยอดเดียว", en:"Don't pool payers" }, d:{ th:"ชื่อผู้โอนควรตรงกับชื่อผู้ซื้อในสัญญา ถ้าซื้อร่วมกัน ให้แต่ละคนโอนในชื่อตัวเอง", en:"The sender should match the buyer on the contract. If you buy jointly, each person wires in their own name." } }
      ] },
    { type:"widget", w:"cost", h:{ th:"คำนวณค่าใช้จ่ายวันโอน", en:"Transfer-day cost calculator" },
      wt:{ th:"ใส่ราคาและขนาดห้อง", en:"Enter the price and size" },
      wp:{ th:"ดูส่วนของผู้ซื้อ และส่วนของผู้ขายเพื่อใช้ต่อรอง", en:"See the buyer's share, and the seller's to help negotiate" } },
    { type:"steps", h:{ th:"ขั้นตอนตั้งแต่จองถึงรับกุญแจ", en:"From booking to keys" },
      items:[
        { t:{ th:"จองและเช็กโควตา", en:"Reserve and check the quota" }, d:{ th:"วางเงินจองตามที่ตกลง และขอหนังสือยืนยันโควตาต่างชาติจากนิติบุคคล", en:"Pay the agreed deposit and get a foreign-quota letter from the building office." } },
        { t:{ th:"ตรวจสอบเอกสาร", en:"Due diligence" }, d:{ th:"โฉนดห้องชุด ภาระจำนอง หนังสือปลอดหนี้ค่าส่วนกลาง และข้อบังคับอาคาร ควรใช้ทนายอิสระ", en:"Title, mortgages, a debt-free letter for common fees, and the building rules. Use an independent lawyer." } },
        { t:{ th:"ทำสัญญาจะซื้อจะขาย", en:"Sign the sale agreement" }, d:{ th:"ระบุราคา วันโอน ใครจ่ายค่าธรรมเนียมและภาษี และเฟอร์นิเจอร์ที่รวม", en:"State the price, transfer date, who pays which fees and taxes, and what furniture is included." } },
        { t:{ th:"โอนเงินและรับ FET", en:"Wire the money, get the FET" }, d:{ th:"โอนจากต่างประเทศก่อนวันนัดโอน เผื่อเวลาให้ธนาคารออกเอกสาร", en:"Wire from abroad before transfer day and allow time for the bank's paperwork." } },
        { t:{ th:"โอนที่สำนักงานที่ดิน", en:"Transfer at the Land Office" }, d:{ th:"ชำระค่าธรรมเนียมและภาษี ชื่อคุณจะถูกจดบนหนังสือกรรมสิทธิ์ในวันเดียว", en:"Pay the fees and taxes; your name goes on the title the same day." } },
        { t:{ th:"รับห้อง", en:"Handover" }, d:{ th:"รับกุญแจ เปลี่ยนชื่อมิเตอร์ไฟน้ำ ลงทะเบียนกับนิติบุคคล และแจ้ง TM30", en:"Collect the keys, move the utility meters into your name, register with the building office and file TM30." } }
      ] },
    { type:"cards", h:{ th:"ปล่อยเช่าและผลตอบแทน", en:"Letting and returns" },
      items:[
        { ic:"warn", t:{ th:"เช่ารายวันต้องมีใบอนุญาตโรงแรม", en:"Daily lets need a hotel licence" }, d:{ th:"การปล่อยเช่าต่ำกว่า 30 วันผิดกฎหมายถ้าไม่มีใบอนุญาต และคอนโดส่วนใหญ่ห้าม วางแผนให้เช่ารายเดือนหรือรายปี", en:"Lets under 30 days are illegal without a licence, and most condos ban them. Plan for monthly or yearly tenants." } },
        { ic:"chart", t:{ th:"ผลตอบแทนที่เอเจนซีประเมิน", en:"Agency yield estimates" }, d:{ th:"จอมเทียนผลตอบแทนก่อนหักค่าใช้จ่ายราว 6–7% และสุทธิราว 4.5–7% ตามการประเมินของเอเจนซี ตัวเลขจริงต่างกันมากตามอาคาร ทิศ และเฟอร์นิเจอร์ ขอดูค่าเช่าจริงของห้องในตึกเดียวกันก่อน[[6]]", en:"Agencies put Jomtien gross yields at about 6–7% and net at 4.5–7%. Real figures vary a lot by building, view and furniture, so ask for actual rents in the same building[[6]]." } },
        { ic:"coin", t:{ th:"ราคาต่อตารางเมตร", en:"Price per square metre" }, d:{ th:"คอนโดใหม่ในพัทยาเฉลี่ยราว ฿114,000/ตร.ม. ในไตรมาส 1/2026[[7]] ห้องมือสองในตึกที่เปิดใช้แล้วมักต่ำกว่าราคาเปิดตัวของโครงการใหม่ เทียบราคาต่อตารางเมตรในหน้ารายการ", en:"New condos in Pattaya averaged about ฿114,000/sqm in Q1 2026[[7]]. Resale units in finished buildings often sell below new launch prices, so compare per-sqm prices on the listings." } }
      ] },
    { type:"table", h:{ th:"ตลาดผู้ซื้อต่างชาติ ปี 2025", en:"The foreign buyer market, 2025" },
      cols:[ { th:"ตัวชี้วัด", en:"Measure" }, { th:"ตัวเลข", en:"Figure" }, { th:"หมายเหตุ", en:"Note" } ],
      rows:[
        [ { th:"ห้องที่ต่างชาติซื้อทั้งประเทศ", en:"Units bought nationwide" }, "14,899 (+2.2%)", { th:"มูลค่า ฿60.92B (−10.7%)[[5]]", en:"Value ฿60.92B (−10.7%)[[5]]" } ],
        [ { th:"ชลบุรี", en:"Chonburi" }, "4,164", { th:"อันดับ 2 รองจากกรุงเทพฯ (7,029)[[5]]", en:"2nd after Bangkok (7,029)[[5]]" } ],
        [ { th:"ผู้ซื้อจีน", en:"Chinese buyers" }, "4,940", { th:"ราว 1 ใน 3 ของทั้งหมด (−12.9%)[[5]]", en:"About a third of the total (−12.9%)[[5]]" } ],
        [ { th:"ผู้ซื้อรัสเซีย", en:"Russian buyers" }, "1,172", { th:"+8.6% มูลค่า +30.3%[[5]]", en:"+8.6%, value +30.3%[[5]]" } ],
        [ { th:"ไตรมาส 1/2026 ทั้งประเทศ", en:"Q1 2026 nationwide" }, "3,241", { th:"−17.3% จากปีก่อน ชลบุรี 1,167 ห้อง[[8]]", en:"−17.3% year on year; Chonburi 1,167[[8]]" } ]
      ],
      note:{ th:"ข้อมูลจากศูนย์ข้อมูลอสังหาริมทรัพย์ (REIC) ที่สื่ออ้างอิง ผู้ซื้อเมียนมาขึ้นเป็นอันดับ 2 ในปี 2025", en:"REIC data as reported in the press. Myanmar buyers moved up to second place in 2025." } },
    { type:"check", h:{ th:"เช็กลิสต์ก่อนวางเงิน", en:"Checklist before you pay" },
      items:[
        { th:"ห้องนี้อยู่ในโควตาต่างชาติ และโควตายังเหลือจริง", en:"The unit is in the foreign quota, and quota is really available" },
        { th:"มีหนังสือปลอดหนี้ค่าส่วนกลางจากนิติบุคคล", en:"A debt-free letter from the building office" },
        { th:"ค่าส่วนกลางต่อ ตร.ม. และเงินกองทุนของอาคารยังมั่นคง", en:"Common fees per sqm, and the building's sinking fund is healthy" },
        { th:"ข้อบังคับเรื่องการปล่อยเช่า สัตว์เลี้ยง และการรีโนเวต", en:"Rules on letting, pets and renovation" },
        { th:"มีการเรียกเก็บเงินพิเศษหรือซ่อมใหญ่ที่รออยู่หรือไม่", en:"Any special levies or major repairs coming" },
        { th:"ชื่อในสัญญาสะกดตรงกับหนังสือเดินทาง", en:"Your name on the contract matches your passport" },
        { th:"เก็บตัวจริงของ FET หรือ Credit Advice ทุกใบ", en:"Keep every original FET form or credit advice" }
      ] },
    { type:"callout", tone:"warn", t:{ th:"ใช้ทนายอิสระ", en:"Use an independent lawyer" }, p:{ th:"หน้านี้ไม่ใช่คำแนะนำทางกฎหมาย ควรให้ทนายที่ไม่ได้ทำงานให้ผู้ขายหรือผู้พัฒนาตรวจเอกสารก่อนวางเงิน", en:"This page is not legal advice. Have a lawyer who doesn't act for the seller or developer check the papers before you pay." } }
  ],
  sources:[
    { t:"Varsovia Estate: 49% foreign quota, Thailand condominium guide 2026", u:"https://varsoviaestate.com/en/blog/foreign-quota-49-percent-thailand-condominium-investor-guide-2026-c2a31e", d:"2026" },
    { t:"Janus Hermes: Thailand property for foreigners in 2026", u:"https://janushermes.com/blog/thailand-property-foreigners-2026", d:"2026" },
    { t:"Bangkok Post: Property stimulus extended a year", u:"https://www.bangkokpost.com/property/3279217/property-stimulus-extended-a-year", d:"Jul 2026" },
    { t:"Lex Bangkok: Property transfer fees Thailand, 2026", u:"https://lexbangkok.com/property-transfer-fees-thailand/", d:"2026" },
    { t:"Khaosod English: China still tops Thai condo market, Myanmar jumps to No.2", u:"https://www.khaosodenglish.com/featured/2026/03/04/china-still-tops-thai-condo-market-myanmar-jumps-to-no-2/", d:"Mar 2026" },
    { t:"Varsovia Estate: Pattaya apartment yield, real numbers 2026", u:"https://varsoviaestate.com/en/blog/pattaya-apartment-yield-real-numbers-2026-f330fb", d:"2026" },
    { t:"The Thaiger: Is buying a condo in Pattaya still worth it in 2026?", u:"https://thethaiger.com/thai-life/property/pattaya-condo-for-sale-worth-it", d:"2026" },
    { t:"Leto: foreign condo purchases in Thailand (REIC, Q1 2026)", u:"https://leto.condos/en/articles/inostrannye-pokupki-kondo-tailand", d:"2026" }
  ]
}
}
};
