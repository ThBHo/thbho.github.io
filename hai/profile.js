/* =====================================================================
   Hybrid AI Agent Network · Personalized Matching (shared client profile)
   ---------------------------------------------------------------------
   One client profile per browser, shared by every page on thbho.com
   (localStorage "hai-profile"). The client answers once; every site that
   loads this file shows its own Top 3 (up to 6) from the same answers, and
   the results sharpen as more is added:
     1 basics     budget, timing, purpose, style, bedrooms (+ site extras)
     2 lifestyle  four everyday questions -> MBTI letters
     3 MBTI       the client's own type
     4 birth      birth date (+ time) -> hai/destiny.js chart & feng shui
   Nothing leaves the browser.

   A site calls  HAIP.mount(el, host)  with:
     host.lang()                       current language (th en ru zh ko ja)
     host.products()                   items in the shape below
     host.card(item, res, rank)        the site's own card HTML (res = {score, why[]})
     host.fields                       basics to ask, e.g. ["budget","when","purpose","style","beds","view"]
                                       (all: intent budget zone kind when purpose beds style view floor furn quota)
     host.opts = { budget:[3e6,...] or {buy:[...], rent:[...]}, zone:[["jomtien",{th,en..}],...], style:[keys], beds:[0,1,2], kind:[keys] }
     host.TEXT = { th:{title,sub,...}, en:{...} }   (optional wording per language)
     host.copy(items) -> text          (optional "copy list for the client")
     host.dsHome(item)                 (optional) engine-shaped home for destiny scoring
   Item shape: { code, price, beds, zone, view:"sea"|"city"|"green"|"other", floor, furn, quota:"FR"|"TH",
                 styles:[keys], purpose:{live,holiday,invest,rent:0..1}, mbti:[types], ready,
                 kind:"condo"|"house"|"villa", intents:["buy","rent"], prices:{buy, rent} }
   Budget: one number in the profile. Under 1,000,000 it is a monthly rent budget, otherwise a
   purchase budget, so a client who set a rent budget on one site and opens a sale-only site
   simply sees that site's results without the budget (and the other way round).
   ===================================================================== */
(function () {
  "use strict";
  const KEY = "hai-profile", LANGS = ["th", "en", "ru", "zh", "ko", "ja"];
  const MBTI16 = ["INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP","ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"];
  const blank = () => ({ v: 1, intent: "", budget: 0, zone: "", kind: "", when: "", purpose: "", style: "", beds: -1,
    view: "", floor: "", furn: "", quota: "", life: ["", "", "", ""], mbti: "", birth: { date: "", time: "", unk: false, gender: "" } });
  const load = () => { try { const p = JSON.parse(localStorage.getItem(KEY) || "null"); return p && p.v === 1 ? Object.assign(blank(), p, { birth: Object.assign(blank().birth, p.birth || {}) }) : blank(); } catch (e) { return blank(); } };
  const save = p => { try { p.t = Date.now(); localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} };

  /* ---------------- text (order th en ru zh ko ja) ---------------- */
  const X = (th, en, ru, zh, ko, ja) => ({ th, en, ru, zh, ko, ja });
  const TX = {
    kicker: X("Personalized Matching", "Personalized Matching", "Personalized Matching", "Personalized Matching", "Personalized Matching", "Personalized Matching"),
    title: X("หาที่ที่ใช่ เริ่มจากข้อมูลเท่าที่คุณมี", "Find the right home with whatever you know now", "Подберите жильё по тому, что вы знаете сейчас", "用你现在知道的信息，找到合适的家", "지금 아는 만큼만 알려 주세요, 맞는 집을 찾아 드립니다", "今わかることだけで、合う住まいを"),
    sub: X("ตอบเท่าที่สะดวก ผลขึ้นทันที แล้วค่อยเพิ่มข้อมูลทีหลัง ระบบจะปรับผลให้แม่นขึ้นเอง", "Answer what you like and the results appear at once. Add more later and they sharpen on their own.", "Ответьте на что хотите — результат сразу. Добавите больше позже — подбор станет точнее.", "回答方便的问题即可立即看到结果，之后补充信息，结果会自动更精准。", "편한 것만 답하면 결과가 바로 나옵니다. 나중에 더 알려 주시면 결과가 더 정확해집니다.", "答えられる範囲でOK。すぐに結果が出て、あとから情報を足すほど精度が上がります。"),
    lv: [X("พื้นฐาน", "Basics", "Основное", "基本", "기본", "基本"), X("ไลฟ์สไตล์", "Lifestyle", "Образ жизни", "生活方式", "라이프스타일", "ライフスタイル"), X("MBTI", "MBTI", "MBTI", "MBTI", "MBTI", "MBTI"), X("วันเกิด", "Birth date", "Дата рождения", "生日", "생일", "生年月日")],
    using: X("ใช้ข้อมูล", "Using", "Учтено", "已用信息", "반영한 정보", "使った情報"),
    any: X("ไม่ระบุ", "Any", "Неважно", "不限", "상관없음", "指定なし"),
    intent: X("ต้องการ", "Looking to", "Цель", "需求", "목적", "目的"), buy: X("ซื้อ", "Buy", "Купить", "购买", "매매", "購入"), rent: X("เช่า", "Rent", "Аренда", "租赁", "임대", "賃貸"),
    budget: X("งบสูงสุด", "Budget up to", "Бюджет до", "预算上限", "최대 예산", "予算の上限"),
    zone: X("ทำเล", "Area", "Район", "区域", "지역", "エリア"),
    kind: X("ประเภท", "Property type", "Тип жилья", "房产类型", "유형", "物件タイプ"),
    kindO: { condo: X("คอนโด", "Condo", "Кондо", "公寓", "콘도", "コンドミニアム"), house: X("บ้าน", "House", "Дом", "独栋住宅", "단독주택", "一戸建て"), villa: X("พูลวิลล่า", "Pool villa", "Вилла с бассейном", "泳池别墅", "풀빌라", "プールヴィラ") },
    mo: X("เดือน", "mo", "мес.", "月", "월", "月"), budRent: X("ค่าเช่าต่อเดือน", "Monthly rent", "Аренда в месяц", "月租", "월 임대료", "月額家賃"), budBuy: X("ราคาซื้อ", "Purchase price", "Цена покупки", "购买价格", "매매가", "購入価格"),
    whenR: X("ช่วงเวลาที่จะเข้าอยู่", "When you plan to move in", "Когда планируете въехать", "计划入住时间", "입주 예정 시기", "入居の予定時期"),
    purposeR: X("เช่าเพื่อ", "Renting for", "Аренда для", "租房用途", "임대 용도", "借りる目的"),
    when: X("ช่วงเวลาที่วางแผนจะซื้อ/โอน", "When you plan to buy / transfer", "Когда планируете покупку", "计划购买/过户时间", "구매·이전 예정 시기", "購入・名義変更の予定時期"),
    whenO: { now: X("ภายใน 1 เดือน", "Within a month", "В течение месяца", "1个月内", "1개월 이내", "1か月以内"), q: X("1–3 เดือน", "1–3 months", "1–3 месяца", "1–3个月", "1–3개월", "1〜3か月"), h: X("3–6 เดือน", "3–6 months", "3–6 месяцев", "3–6个月", "3–6개월", "3〜6か月"), y: X("6–12 เดือน", "6–12 months", "6–12 месяцев", "6–12个月", "6–12개월", "6〜12か月"), later: X("ยังไม่รีบ", "No rush", "Не спешу", "不着急", "급하지 않음", "急いでいない") },
    purpose: X("ซื้อไปเพื่อ", "Buying to", "Для чего", "用途", "용도", "目的"),
    purposeO: { live: X("อยู่เอง", "Live in", "Жить", "自住", "직접 거주", "自分で住む"), holiday: X("บ้านพักตากอากาศ", "Holiday home", "Для отдыха", "度假屋", "세컨드 홈", "別荘"), invest: X("ลงทุน", "Invest", "Инвестиция", "投资", "투자", "投資"), rent: X("ปล่อยเช่า", "Rent out", "Сдавать", "出租", "임대 수익", "賃貸に出す") },
    style: X("สไตล์ที่ชอบ", "Style you like", "Любимый стиль", "喜欢的风格", "선호 스타일", "好きなスタイル"),
    styleO: { modern: X("โมเดิร์น เออร์เบิน", "Modern, urban", "Современный", "现代都市", "모던·어반", "モダン"), coastal: X("ทะเล รีสอร์ต", "Coastal, resort", "Морской, курортный", "海岸度假", "코스탈·리조트", "海辺・リゾート"), calm: X("มินิมอล เรียบสงบ", "Minimal, calm", "Минимализм, спокойствие", "极简宁静", "미니멀·차분함", "ミニマル・静か"), warm: X("อบอุ่น คลาสสิก", "Warm, classic", "Тёплый, классика", "温馨经典", "따뜻함·클래식", "温かみ・クラシック"), nature: X("ธรรมชาติ ต้นไม้", "Nature, greenery", "Природа, зелень", "自然绿意", "자연·식물", "自然・グリーン"), creative: X("สดใส สร้างสรรค์", "Bright, creative", "Яркий, творческий", "明亮创意", "밝고 개성 있게", "明るく個性的") },
    beds: X("ห้องนอน", "Bedrooms", "Спальни", "卧室", "침실", "寝室"),
    bedsO: [X("สตูดิโอ", "Studio", "Студия", "开间", "스튜디오", "スタジオ"), X("1 ห้องนอน", "1 bed", "1 спальня", "1卧", "침실 1", "1寝室"), X("2 ห้องนอน", "2 beds", "2 спальни", "2卧", "침실 2", "2寝室"), X("3 ห้องนอน", "3 beds", "3 спальни", "3卧", "침실 3", "3寝室"), X("4+ ห้องนอน", "4+ beds", "4+ спальни", "4卧以上", "침실 4+", "4寝室以上")],
    view: X("วิว", "View", "Вид", "景观", "전망", "眺望"), viewO: { sea: X("วิวทะเล", "Sea view", "Вид на море", "海景", "바다 전망", "海の眺め"), city: X("วิวเมือง", "City view", "Вид на город", "城市景观", "시티 뷰", "街の眺め"), green: X("วิวภูเขา สีเขียว", "Hills, greenery", "Горы, зелень", "山景绿意", "산·녹지 전망", "山・緑の眺め") },
    floor: X("ความสูงชั้น", "Floor", "Этаж", "楼层", "층", "階数"), floorO: { low: X("ชั้นต่ำ", "Low", "Низкий", "低层", "저층", "低層"), mid: X("ชั้นกลาง", "Middle", "Средний", "中层", "중층", "中層"), high: X("ชั้นสูง", "High", "Высокий", "高层", "고층", "高層") },
    furn: X("เฟอร์นิเจอร์", "Furniture", "Мебель", "家具", "가구", "家具"), furnO: { yes: X("พร้อมเข้าอยู่", "Move-in ready", "Готово к заселению", "拎包入住", "바로 입주", "すぐ入居可"), no: X("ไม่จำเป็น", "Not needed", "Не обязательно", "不需要", "필요 없음", "不要") },
    quota: X("ชื่อผู้ซื้อ", "Buyer's quota", "Квота покупателя", "购房配额", "구매자 쿼터", "購入者の枠"), quotaO: { FR: X("โควตาต่างชาติ", "Foreign quota", "Иностранная квота", "外籍配额", "외국인 쿼터", "外国人枠"), TH: X("ชื่อคนไทย", "Thai name", "Тайское имя", "泰籍名下", "태국인 명의", "タイ人名義") },
    top: X("ที่เข้ากับคุณที่สุด", "Your best matches", "Лучше всего подходят вам", "最适合你的", "가장 잘 맞는 곳", "あなたに最も合う物件"),
    match: X("เข้ากัน", "match", "совпадение", "匹配", "일치", "マッチ"),
    more: X("ดูเพิ่มอีก 3", "Show 3 more", "Ещё 3", "再看3个", "3개 더 보기", "あと3件"), less: X("แสดง 3 อันดับแรก", "Show top 3", "Только топ-3", "只看前3", "상위 3개만", "上位3件だけ"),
    none: X("ยังไม่มีรายการที่ตรง ลองเพิ่มงบหรือลดเงื่อนไข", "Nothing fits yet: try a higher budget or fewer conditions", "Пока ничего не подходит: увеличьте бюджет или уберите условия", "暂无符合的结果：试试提高预算或减少条件", "아직 맞는 곳이 없습니다. 예산을 늘리거나 조건을 줄여 보세요", "まだ該当がありません。予算を上げるか条件を減らしてください"),
    sharpen: X("อยากให้แม่นขึ้น เพิ่มข้อมูลได้ทีหลัง", "Want sharper results? Add more any time", "Хотите точнее? Добавьте данные в любой момент", "想更精准？随时补充信息", "더 정확하게? 언제든 정보를 더하세요", "もっと精度を上げたいときは、いつでも追加"),
    lifeH: X("4 คำถามไลฟ์สไตล์", "4 lifestyle questions", "4 вопроса об образе жизни", "4个生活方式问题", "라이프스타일 질문 4개", "ライフスタイルの4つの質問"),
    est: X("บุคลิกโดยประมาณ", "Likely personality", "Вероятный тип", "推测性格", "추정 성격", "推定タイプ"),
    mbtiH: X("รู้ MBTI ของตัวเองไหม", "Know your MBTI type?", "Знаете свой тип MBTI?", "知道自己的MBTI吗？", "MBTI를 아시나요?", "MBTIを知っていますか？"),
    mbtiNo: X("ไม่ทราบ", "Not sure", "Не знаю", "不确定", "잘 모름", "わからない"),
    birthH: X("วันเกิด (ดวงและฮวงจุ้ย)", "Birth date (chart and feng shui)", "Дата рождения (гороскоп и фэншуй)", "生日（命盘与风水）", "생일 (사주·풍수)", "生年月日（命式と風水）"),
    bdate: X("วันเกิด", "Birth date", "Дата рождения", "出生日期", "생년월일", "生年月日"), btime: X("เวลาเกิด", "Birth time", "Время рождения", "出生时间", "태어난 시간", "出生時刻"), bunk: X("ไม่ทราบเวลาเกิด", "Time unknown", "Время неизвестно", "不知道时间", "시간 모름", "時刻不明"),
    gender: X("เพศ (ใช้คำนวณทิศมงคล)", "Gender (for lucky directions)", "Пол (для благоприятных направлений)", "性别（用于吉方位）", "성별 (길한 방위 계산)", "性別（吉方位の計算用）"), genderO: { m: X("ชาย", "Male", "Мужской", "男", "남성", "男性"), f: X("หญิง", "Female", "Женский", "女", "여성", "女性"), n: X("ไม่ระบุ", "Not stated", "Не указан", "不填写", "밝히지 않음", "回答しない") },
    privacy: X("ข้อมูลทั้งหมดเก็บในเครื่องของคุณเท่านั้น ไม่ถูกส่งไปที่ใด และใช้ร่วมกันได้ทุกหน้าในเครือข่าย", "Everything stays on your device, is never sent anywhere, and works on every page in the network.", "Всё хранится только на вашем устройстве, никуда не отправляется и работает на всех страницах сети.", "所有信息只保存在你的设备上，不会发送到任何地方，网络内所有页面通用。", "모든 정보는 내 기기에만 저장되고 어디로도 전송되지 않으며, 네트워크의 모든 페이지에서 쓰입니다.", "情報はすべて端末内だけに保存され、外部に送られず、ネットワーク内のどのページでも使えます。"),
    moreOpt: X("ตัวเลือกเพิ่มเติม", "More options", "Дополнительно", "更多选项", "추가 옵션", "その他の条件"),
    clear: X("ล้างข้อมูล", "Clear my answers", "Сбросить", "清除信息", "초기화", "リセット"),
    copy: X("คัดลอกรายการให้ลูกค้า", "Copy list for the client", "Копировать список для клиента", "复制清单给客户", "고객용 목록 복사", "お客様向けリストをコピー"), copied: X("คัดลอกแล้ว", "Copied", "Скопировано", "已复制", "복사됨", "コピーしました"),
    detail: X("ดูวิเคราะห์ดวงและฮวงจุ้ยละเอียด", "See the full chart and feng shui", "Полный разбор гороскопа и фэншуй", "查看完整命盘与风水分析", "사주·풍수 자세히 보기", "命式と風水を詳しく見る"),
    r: {
      inBudget: X("อยู่ในงบ", "Within budget", "В бюджете", "预算内", "예산 내", "予算内"), near: X("เกินงบเล็กน้อย", "Just over budget", "Чуть выше бюджета", "略超预算", "예산 약간 초과", "予算を少し超える"),
      beds: X("ห้องนอนตรง", "Right bedrooms", "Нужное число спален", "卧室数符合", "침실 수 일치", "寝室数が合う"), sea: X("วิวทะเล", "Sea view", "Вид на море", "海景", "바다 전망", "海の眺め"), city: X("วิวเมือง", "City view", "Вид на город", "城市景观", "시티 뷰", "街の眺め"), green: X("วิวภูเขา สีเขียว", "Hills, greenery", "Горы, зелень", "山景绿意", "산·녹지 전망", "山・緑の眺め"),
      kind: X("ประเภทตรง", "Right type", "Нужный тип", "类型符合", "원하는 유형", "希望のタイプ"), readyIn: X("เข้าอยู่ได้ทันที", "Ready to move in", "Можно въезжать", "可立即入住", "즉시 입주 가능", "すぐ入居可"),
      floor: X("ชั้นตามที่ชอบ", "Preferred floor", "Нужный этаж", "理想楼层", "원하는 층", "希望の階"), furn: X("พร้อมเข้าอยู่", "Move-in ready", "Готово к заселению", "拎包入住", "바로 입주", "すぐ入居可"), quota: X("ตรงโควตา", "Quota fits", "Квота подходит", "配额符合", "쿼터 적합", "枠が合う"),
      zone: X("ทำเลตรง", "Right area", "Нужный район", "区域符合", "원하는 지역", "希望エリア"), ready: X("พร้อมโอนทันที", "Ready to transfer", "Готово к переоформлению", "可立即过户", "즉시 이전 가능", "すぐ名義変更可"),
      purpose: X("เหมาะกับ", "Good for:", "Подходит:", "适合", "용도:", "向き:"), style: X("สไตล์", "Style:", "Стиль:", "风格", "스타일:", "スタイル:"),
      exact: X("ออกแบบมาสำหรับ", "Designed for", "Создано для", "专为", "맞춤 설계", "向けに設計"), group: X("เข้ากับกลุ่ม", "Suits", "Подходит группе", "适合", "어울림", "相性"),
      ds: X("เข้ากับดวงและฮวงจุ้ย", "Fits your chart and feng shui", "Подходит по гороскопу и фэншуй", "合你的命盘与风水", "사주·풍수와 맞음", "命式と風水に合う")
    },
    group: { an: X("นักวิเคราะห์", "Analysts", "Аналитики", "分析家", "분석가", "分析家"), di: X("นักการทูต", "Diplomats", "Дипломаты", "外交家", "외교관", "外交官"), se: X("ผู้พิทักษ์", "Sentinels", "Стражи", "守护者", "관리자", "番人"), ex: X("นักสำรวจ", "Explorers", "Искатели", "探险家", "탐험가", "探検家") }
  };
  // the four everyday questions (same wording as the ASN home matcher), letters E/I, S/N, T/F, J/P
  const LIFE = [
    ["E", "I", X("วันหยุดในแบบของคุณ", "Your ideal day off", "Идеальный выходной", "理想的假日", "이상적인 휴일", "理想の休日"), X("ปาร์ตี้ริมสระกับเพื่อน", "Pool party with friends", "Вечеринка у бассейна", "和朋友泳池派对", "친구들과 풀파티", "友人とプールパーティー"), X("พักผ่อนเงียบ ๆ ในสวน", "Quiet time in the garden", "Тишина в саду", "在花园里安静放松", "정원에서 조용히 휴식", "庭で静かにくつろぐ")],
    ["S", "N", X("เลือกบ้านจากอะไรก่อน", "What do you look at first?", "На что смотрите сначала?", "选房先看什么？", "집을 볼 때 먼저 보는 것", "物件選びでまず見るのは"), X("ฟังก์ชัน ทำเล ใช้งานจริง", "Function, location, practicality", "Функциональность и локация", "功能、地段、实用", "기능, 위치, 실용성", "機能・立地・実用性"), X("ดีไซน์และบรรยากาศ", "Design and atmosphere", "Дизайн и атмосфера", "设计与氛围", "디자인과 분위기", "デザインと雰囲気")],
    ["T", "F", X("อะไรสำคัญที่สุด", "What matters most?", "Что важнее всего?", "什么最重要？", "가장 중요한 것", "いちばん大切なこと"), X("ความคุ้มค่าต่อพื้นที่", "Value for the space", "Цена за площадь", "面积性价比", "면적 대비 가성비", "広さに対するコスパ"), X("ความอบอุ่นสำหรับครอบครัว", "A warm home for family", "Уют для семьи", "适合家人的温馨", "가족을 위한 따뜻함", "家族のための温かさ")],
    ["J", "P", X("แผนการอยู่", "Your plans", "Ваши планы", "居住计划", "거주 계획", "住まいの予定"), X("อยู่ยาว วางแผนชัด", "Staying long, clear plan", "Надолго, всё по плану", "长住，计划明确", "오래 살 계획", "長く住む・計画的"), X("ยืดหยุ่น ไม่ผูกมัด", "Flexible, no strings", "Гибко, без обязательств", "灵活，不受约束", "유연하게, 부담 없이", "柔軟に・縛られない")]
  ];
  const groupOf = l => { const [, ns, tf, jp] = l; if (ns === "N" && tf === "T") return "an"; if (ns === "N" && tf === "F") return "di"; if (ns === "S" && jp === "J") return "se"; if (ns === "S" && jp === "P") return "ex"; return ""; };
  const floorBand = f => { f = +f || 0; return !f ? "" : f <= 10 ? "low" : f <= 22 ? "mid" : "high"; };

  /* ---------------- scoring ---------------- */
  function rank(items, p, host) {
    const letters = p.mbti ? p.mbti.split("") : p.life, known = letters.filter(Boolean).length;
    const grp = groupOf(letters), hasB = !!(p.birth.date && window.ASND && ASND._test && host.dsHome);
    let C = null; if (hasB) { try { C = ASND._test.chart({ date: p.birth.date, time: p.birth.unk ? "" : p.birth.time, city: "bkk", gender: p.birth.gender || "n" }); } catch (e) { C = null; } }
    const L = host.lang(), tx = o => (o && (o[L] || o.en)) || "", R = TX.r;
    const out = [];
    // budget: under 1M = monthly rent, otherwise purchase. An item's price for that kind comes from it.prices,
    // or it.price for a buy budget. A site with no price of that kind ignores the budget instead of dropping everything.
    const bk = p.budget ? (p.budget < 1e6 ? "rent" : "buy") : "", rentMode = p.intent === "rent" || bk === "rent";
    const priceOf = it => it.prices ? (it.prices[bk] != null ? it.prices[bk] : null) : (bk === "buy" ? it.price : null);
    const useBudget = bk && items.some(it => priceOf(it) != null);
    for (const it of items) {
      let w = 0, s = 0; const why = []; let drop = false;
      const f = (wt, v, label) => { w += wt; s += wt * v; if (label && v >= .8 && why.length < 4) why.push(label); };
      if (useBudget) { const pr = priceOf(it); if (pr == null) drop = true; else { const r = pr / p.budget; if (r <= 1) f(3, 1, tx(R.inBudget)); else if (r <= 1.1) f(3, .6, tx(R.near)); else if (r <= 1.25) f(3, .25); else drop = true; } }
      if (p.intent && it.intents && !it.intents.includes(p.intent)) drop = true;
      if (p.beds >= 0 && it.beds != null) f(2, it.beds === p.beds ? 1 : (p.beds === 4 && it.beds >= 4) ? 1 : it.beds > p.beds ? .6 : .15, tx(R.beds));
      if (p.zone && it.zone) f(2, it.zone === p.zone ? 1 : .3, tx(R.zone));
      if (p.kind && it.kind) f(2, it.kind === p.kind ? 1 : (p.kind !== "condo" && it.kind !== "condo") ? .6 : .15, tx(R.kind));
      if (p.view && it.view) f(2, it.view === p.view ? 1 : .25, tx(R[it.view]));
      if (p.floor && it.floor) { const b = floorBand(it.floor); f(1, b === p.floor ? 1 : (b === "mid" || p.floor === "mid") ? .55 : .2, tx(R.floor)); }
      if (p.furn === "yes" && it.furn != null) f(1.2, it.furn ? 1 : .2, tx(R.furn));
      if (p.quota && it.quota) { if (p.quota === "FR" && it.quota !== "FR") drop = true; else f(1.5, 1, tx(R.quota)); }
      if (p.purpose && it.purpose && !(rentMode && (p.purpose === "invest" || p.purpose === "rent"))) f(2, it.purpose[p.purpose] != null ? it.purpose[p.purpose] : .5, tx(R.purpose) + " " + tx(TX.purposeO[p.purpose]));
      if (p.style && it.styles) f(1.5, it.styles.includes(p.style) ? 1 : .3, tx(R.style) + " " + tx(TX.styleO[p.style]));
      if (p.when && it.ready != null) f(.6, (p.when === "now" || p.when === "q") ? (it.ready ? 1 : .4) : .8, (p.when === "now" || p.when === "q") && it.ready ? tx(rentMode ? R.readyIn : R.ready) : "");
      const base = w ? s / w : .6;
      // personality
      let m = null, mw = "";
      if (known && it.mbti && it.mbti.length) {
        const full = letters.every(Boolean) ? letters.join("") : "";
        const i = full ? it.mbti.indexOf(full) : -1;
        if (i > -1) { m = [1, .9, .82][i] || .78; mw = tx(R.exact) + " " + full; }
        else if (grp && it.mbti.some(x => groupOf(x.split("")) === grp)) { m = .68; mw = tx(R.group) + " " + tx(TX.group[grp]); }
        else { let best = 0; for (const x of it.mbti) { let k = 0; for (let j = 0; j < 4; j++) if (letters[j] && letters[j] === x[j]) k++; best = Math.max(best, k / Math.max(1, known)); } m = .25 + best * .4; }
        if (!p.mbti) m = .5 + (m - .5) * Math.min(1, known / 4) * .85;   // lifestyle answers count a little less than a known type
      }
      // birth chart
      let d = null; if (C) { try { const r = ASND._test.score(host.dsHome(it), C); d = Math.max(0, Math.min(100, r.total)) / 100; } catch (e) { d = null; } }
      if (drop) continue;
      const parts = [[base, .5], [m, .27], [d, .23]].filter(x => x[0] != null), tw = parts.reduce((a, x) => a + x[1], 0);
      const layers = 1 + (known ? 1 : 0) + (p.mbti ? 1 : 0) + (d != null ? 1 : 0), cap = [80, 86, 92, 97][layers - 1];
      // scaled inside the cap (not clipped), so good matches still differ and a perfect fit on basics alone reads 80%
      const score = Math.round(Math.max(1, Math.min(cap, parts.reduce((a, x) => a + x[0] * x[1], 0) / tw * cap)));
      if (mw && m >= .65) why.unshift(mw);
      if (d != null && d >= .62) why.splice(1, 0, tx(R.ds));
      out.push({ it, score, why: [...new Set(why)].slice(0, 4) });
    }
    return out.sort((a, b) => b.score - a.score || (a.it.price || 0) - (b.it.price || 0));
  }
  const levels = p => [true, p.life.some(Boolean), !!p.mbti, !!p.birth.date];

  /* ---------------- UI ---------------- */
  const css = `.pf{--pf-acc:var(--pf-accent,#0B6C7C);--pf-line:var(--pf-border,rgba(0,0,0,.12));--pf-bg:var(--pf-surface,#fff);--pf-soft:var(--pf-soft-bg,rgba(11,108,124,.07));--pf-ink2:var(--pf-muted,#5b6670);border:1px solid var(--pf-line);background:var(--pf-bg);border-radius:20px;padding:22px clamp(16px,3vw,28px);margin:18px 0}
.pf *{box-sizing:border-box}.pf-k{font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;color:var(--pf-acc)}
.pf h2{margin:4px 0 6px;font-size:clamp(22px,3vw,30px);line-height:1.25}.pf-sub{margin:0;color:var(--pf-ink2);max-width:760px}
.pf-lv{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0 4px;font-size:13px;color:var(--pf-ink2);align-items:center}
.pf-lv span{border:1px solid var(--pf-line);border-radius:999px;padding:2px 10px}.pf-lv span.on{background:var(--pf-acc);border-color:var(--pf-acc);color:var(--pf-on,#fff)}
.pf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:12px 16px;margin-top:14px}
.pf-f>b{display:block;font-size:13.5px;font-weight:600;margin-bottom:6px}
.pf-chips{display:flex;flex-wrap:wrap;gap:6px}.pf-chips button,.pf-pair button{font:inherit;font-size:14px;min-height:36px;padding:4px 12px;border-radius:999px;border:1px solid var(--pf-line);background:transparent;color:inherit;cursor:pointer}
.pf-chips button[aria-pressed="true"],.pf-pair button[aria-pressed="true"]{background:var(--pf-acc);border-color:var(--pf-acc);color:var(--pf-on,#fff)}
.pf select,.pf input[type=date],.pf input[type=time]{font:inherit;font-size:15px;min-height:40px;width:100%;border-radius:10px;border:1px solid var(--pf-line);background:var(--pf-bg);color:inherit;padding:0 10px}
.pf-res{margin-top:20px}.pf-res>h3{font-size:17px;margin:0 0 4px}.pf-use{font-size:13px;color:var(--pf-ink2);margin:0 0 10px}
.pf-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr));gap:14px}
.pf-card{position:relative}.pf-rank{position:absolute;top:-9px;left:-7px;box-shadow:0 0 0 3px var(--pf-bg);z-index:2;width:28px;height:28px;border-radius:50%;background:var(--pf-acc);color:var(--pf-on,#fff);display:grid;place-items:center;font-weight:700;font-size:14px}
.pf-meter{display:flex;align-items:center;gap:8px;font-size:13px;margin:4px 0}.pf-meter i{flex:1;height:6px;border-radius:3px;background:var(--pf-line);overflow:hidden}.pf-meter i b{display:block;height:100%;background:var(--pf-acc)}
.pf-why{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0}.pf-why span{font-size:12px;background:var(--pf-soft);border-radius:999px;padding:2px 8px}
.pf-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.pf-btn{font:inherit;font-size:14px;font-weight:600;min-height:40px;padding:0 16px;border-radius:999px;border:1.5px solid var(--pf-acc);background:transparent;color:var(--pf-acc);cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}
.pf-more{margin-top:22px;border-top:1px dashed var(--pf-line);padding-top:14px}.pf-more>b{display:block;margin-bottom:8px}
.pf details{border:1px solid var(--pf-line);border-radius:14px;padding:10px 14px;margin-bottom:8px}.pf summary{cursor:pointer;font-weight:600;min-height:28px}
.pf summary small{font-weight:400;color:var(--pf-ink2);margin-left:6px}
.pf-q{margin:10px 0}.pf-q>b{display:block;font-size:14px;margin-bottom:6px}.pf-pair{display:grid;grid-template-columns:1fr 1fr;gap:6px}.pf-pair button{border-radius:12px;min-height:42px}
.pf-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:10px;align-items:end}
.pf-note{font-size:12.5px;color:var(--pf-ink2);margin:10px 0 0;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center}.pf-note button{font:inherit;font-size:12.5px;background:none;border:0;color:inherit;text-decoration:underline;cursor:pointer;padding:0}
.pf-x{margin-top:12px}.pf-x .pf-grid{margin-top:8px}
.pf-none{padding:16px;border:1px dashed var(--pf-line);border-radius:14px;color:var(--pf-ink2)}`;
  let cssDone = false;

  function mount(el, host) {
    if (!el) return;
    if (!cssDone) { const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s); cssDone = true; }
    const st = { shown: 3, open: {} };
    const L = () => host.lang(), tx = o => (o && (o[L()] || o.en)) || "";
    const H = k => { const o = host.TEXT && (host.TEXT[L()] || host.TEXT.en); return (o && o[k]) || tx(TX[k]); };
    const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    const chips = (key, pairs, cur) => `<div class="pf-chips">${pairs.map(([v, l]) => `<button type="button" data-pf="${key}" data-v="${esc(v)}" aria-pressed="${String(cur) === String(v)}">${esc(l)}</button>`).join("")}</div>`;
    const money = v => host.money ? host.money(v) : "฿" + (v >= 1e6 ? (v / 1e6).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "M" : v.toLocaleString("en-US"));
    function field(k, p) {
      const O = host.opts || {}, lab = esc(H(k));
      if (k === "budget") {
        // one list, or {buy, rent}: the client's intent picks the list; with no intent both show in groups.
        // A budget set on another site that is not in this list is added, so the select never hides it.
        const B = O.budget || [], kindOf = v => v < 1e6 ? "rent" : "buy", cur = +p.budget || 0;
        const lists = Array.isArray(B) ? [["", B]] : (p.intent === "rent" ? [["", B.rent || []]] : p.intent === "buy" ? [["", B.buy || []]] : [["rent", B.rent || []], ["buy", B.buy || []]]);
        const optsOf = (vs, kk) => { vs = vs.slice(); if (cur && !vs.includes(cur) && vs.length && kindOf(vs[0]) === kindOf(cur) && (!kk || kk === kindOf(cur))) { vs.push(cur); vs.sort((a, b) => a - b); }
          return vs.map(v => `<option value="${v}"${cur === v ? " selected" : ""}>≤ ${esc(money(v))}${kindOf(v) === "rent" ? " / " + esc(tx(TX.mo)) : ""}</option>`).join(""); };
        return `<label class="pf-f"><b>${lab}</b><select data-pfsel="budget"><option value="0">${tx(TX.any)}</option>${lists.map(([g, vs]) => g ? `<optgroup label="${esc(tx(g === "rent" ? TX.budRent : TX.budBuy))}">${optsOf(vs, g)}</optgroup>` : optsOf(vs, "")).join("")}</select></label>`;
      }
      if (k === "intent") return `<div class="pf-f"><b>${lab}</b>${chips("intent", [["buy", tx(TX.buy)], ["rent", tx(TX.rent)]], p.intent)}</div>`;
      if (k === "zone") return `<label class="pf-f"><b>${lab}</b><select data-pfsel="zone"><option value="">${tx(TX.any)}</option>${(O.zone || []).map(([v, n]) => `<option value="${esc(v)}"${p.zone === v ? " selected" : ""}>${esc(tx(n))}</option>`).join("")}</select></label>`;
      if (k === "kind") return `<div class="pf-f"><b>${lab}</b>${chips("kind", (O.kind || Object.keys(TX.kindO)).map(v => [v, tx(TX.kindO[v])]), p.kind)}</div>`;
      if (k === "beds") return `<div class="pf-f"><b>${lab}</b>${chips("beds", (O.beds || [0, 1, 2, 3, 4]).map(n => [n, tx(TX.bedsO[n])]), p.beds)}</div>`;
      if (k === "style") return `<div class="pf-f"><b>${lab}</b>${chips("style", (O.style || Object.keys(TX.styleO)).map(s => [s, tx(TX.styleO[s])]), p.style)}</div>`;
      const map = { when: TX.whenO, purpose: TX.purposeO, view: TX.viewO, floor: TX.floorO, furn: TX.furnO, quota: TX.quotaO }[k];
      if (!map) return "";
      let keys = (O[k] || Object.keys(map)), lb = lab;
      if (p.intent === "rent" && k === "purpose") { keys = keys.filter(v => v === "live" || v === "holiday"); lb = esc(tx(TX.purposeR)); }
      if (p.intent === "rent" && k === "when") lb = esc(tx(TX.whenR));
      return `<div class="pf-f"><b>${lb}</b>${chips(k, keys.map(v => [v, tx(map[v])]), p[k])}</div>`;
    }
    function render() {
      const p = load(), lv = levels(p), items = host.products(), res = rank(items, p, host), list = res.slice(0, st.shown);
      const letters = p.life, g = groupOf(letters), est = letters.every(Boolean) ? letters.join("") : "";
      const ds = window.ASND && ASND._test && host.dsHome;
      el.innerHTML = `<section class="pf" aria-labelledby="pfH">
        <div class="pf-k">${esc(H("kicker"))}</div><h2 id="pfH">${esc(H("title"))}</h2><p class="pf-sub">${esc(H("sub"))}</p>
        <div class="pf-lv">${TX.lv.map((x, i) => `<span class="${lv[i] ? "on" : ""}">${i + 1} · ${esc(tx(x))}</span>`).join("")}</div>
        <div class="pf-grid">${(host.fields || ["budget", "when", "purpose", "style", "beds"]).map(k => field(k, p)).join("")}</div>
        ${host.extra && host.extra.length ? `<details class="pf-x" data-pfopen="extra"${st.open.extra || host.extra.some(k => p[k] !== "" && p[k] != null && p[k] !== -1) ? " open" : ""}><summary>${esc(tx(TX.moreOpt))}</summary><div class="pf-grid">${host.extra.map(k => field(k, p)).join("")}</div></details>` : ""}
        <div class="pf-res" aria-live="polite"><h3>${esc(H("top"))}</h3>
          <p class="pf-use">${esc(tx(TX.using))}: ${TX.lv.filter((x, i) => lv[i]).map(x => esc(tx(x))).join(" · ")}</p>
          ${list.length ? `<div class="pf-cards">${list.map((r, i) => `<div class="pf-card"><span class="pf-rank">${i + 1}</span>${host.card(r.it, r, i)}</div>`).join("")}</div>` : `<div class="pf-none">${esc(tx(TX.none))}</div>`}
          <div class="pf-acts">${res.length > 3 ? `<button type="button" class="pf-btn" data-pfmore="1">${esc(tx(st.shown > 3 ? TX.less : TX.more))}</button>` : ""}
            ${host.copy && list.length ? `<button type="button" class="pf-btn" data-pfcopy="1">${esc(tx(TX.copy))}</button>` : ""}
            ${host.destinyHref && p.birth.date ? `<a class="pf-btn" href="${esc(host.destinyHref())}" data-pfds="1">${esc(tx(TX.detail))} →</a>` : ""}</div>
        </div>
        <div class="pf-more"><b>${esc(tx(TX.sharpen))}</b>
          <details data-pfopen="life"${st.open.life ? " open" : ""}><summary>${esc(tx(TX.lifeH))}${est || g ? `<small>${esc(tx(TX.est))}: ${est || esc(tx(TX.group[g]))}</small>` : ""}</summary>
            ${LIFE.map(([a, b, q, qa, qb], i) => `<div class="pf-q"><b>${esc(tx(q))}</b><div class="pf-pair">
              <button type="button" data-pfl="${i}" data-v="${a}" aria-pressed="${letters[i] === a}">${esc(tx(qa))}</button>
              <button type="button" data-pfl="${i}" data-v="${b}" aria-pressed="${letters[i] === b}">${esc(tx(qb))}</button></div></div>`).join("")}</details>
          <details data-pfopen="mbti"${st.open.mbti ? " open" : ""}><summary>${esc(tx(TX.mbtiH))}${p.mbti ? `<small>${p.mbti}</small>` : ""}</summary>
            <div class="pf-row" style="margin-top:8px"><select data-pfsel="mbti"><option value="">${esc(tx(TX.mbtiNo))}</option>${MBTI16.map(m => `<option${p.mbti === m ? " selected" : ""}>${m}</option>`).join("")}</select></div></details>
          ${ds ? `<details data-pfopen="birth"${st.open.birth ? " open" : ""}><summary>${esc(tx(TX.birthH))}${p.birth.date ? `<small>✓</small>` : ""}</summary>
            <div class="pf-row" style="margin-top:8px">
              <label class="pf-f"><b>${esc(tx(TX.bdate))}</b><input type="date" data-pfb="date" value="${esc(p.birth.date)}" min="1920-01-01" max="2015-12-31"></label>
              <label class="pf-f"><b>${esc(tx(TX.btime))}</b><input type="time" data-pfb="time" value="${esc(p.birth.time)}"${p.birth.unk ? " disabled" : ""}></label>
              <label class="pf-f" style="display:flex;gap:6px;align-items:center;min-height:40px"><input type="checkbox" data-pfb="unk"${p.birth.unk ? " checked" : ""}> ${esc(tx(TX.bunk))}</label>
            </div>
            <div class="pf-f" style="margin-top:10px"><b>${esc(tx(TX.gender))}</b>${chips("gender", [["m", tx(TX.genderO.m)], ["f", tx(TX.genderO.f)], ["n", tx(TX.genderO.n)]], p.birth.gender)}</div></details>` : ""}
          <p class="pf-note">🔒 ${esc(tx(TX.privacy))} <button type="button" data-pfclear="1">${esc(tx(TX.clear))}</button></p>
        </div></section>`;
    }
    const upd = fn => { const p = load(); fn(p); save(p); render(); };
    el.addEventListener("click", e => {
      const c = e.target.closest("[data-pf]");
      if (c) { const k = c.dataset.pf, raw = c.dataset.v, v = k === "beds" ? +raw : raw;
        return upd(p => { if (k === "gender") p.birth.gender = p.birth.gender === v ? "" : v; else p[k] = String(p[k]) === String(v) ? (k === "beds" ? -1 : "") : v;
          if (k === "intent" && p.intent && p.budget && (p.budget < 1e6 ? "rent" : "buy") !== p.intent) p.budget = 0;
          if (k === "intent" && p.intent === "rent" && (p.purpose === "invest" || p.purpose === "rent")) p.purpose = "";
          st.shown = 3; }); }
      const l = e.target.closest("[data-pfl]");
      if (l) { st.open.life = true; return upd(p => { const i = +l.dataset.pfl; p.life[i] = p.life[i] === l.dataset.v ? "" : l.dataset.v; }); }
      if (e.target.closest("[data-pfmore]")) { st.shown = st.shown > 3 ? 3 : 6; return render(); }
      if (e.target.closest("[data-pfclear]")) { try { localStorage.removeItem(KEY); } catch (err) {} st.shown = 3; return render(); }
      if (e.target.closest("[data-pfds]")) { const p = load(); try { localStorage.setItem("hai-prefill", JSON.stringify({ t: Date.now(), date: p.birth.date, time: p.birth.unk ? "" : p.birth.time, unk: p.birth.unk || !p.birth.time, gender: p.birth.gender || "n" })); } catch (err) {} return; }
      const cp = e.target.closest("[data-pfcopy]");
      if (cp) { const p = load(), txt = host.copy(rank(host.products(), p, host).slice(0, st.shown).map(r => r.it)); const done = () => { cp.textContent = tx(TX.copied); setTimeout(() => cp.textContent = tx(TX.copy), 1600); };
        try { navigator.clipboard.writeText(txt).then(done, done); } catch (err) { done(); } }
    });
    el.addEventListener("change", e => {
      const s = e.target.closest("[data-pfsel]");
      if (s) { const k = s.dataset.pfsel; if (k === "mbti") st.open.mbti = true; return upd(p => { p[k] = k === "budget" ? +s.value : s.value; st.shown = 3; }); }
      const b = e.target.closest("[data-pfb]");
      if (b) { st.open.birth = true; return upd(p => { const k = b.dataset.pfb; p.birth[k] = k === "unk" ? b.checked : b.value; }); }
    });
    el.addEventListener("toggle", e => { const d = e.target; if (d.dataset && d.dataset.pfopen) st.open[d.dataset.pfopen] = d.open; }, true);
    render();
    return { render };
  }

  window.HAIP = { load, save, rank, mount, levels, groupOf, TX, LIFE, KEY };
})();
