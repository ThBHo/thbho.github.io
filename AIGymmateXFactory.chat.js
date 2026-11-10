/* Hybrid AI by ThB.Ho · persona chat replies (AIGymmateXFactory.html only)
 *
 * The chat runs without any API key in the page:
 *  1. Scripted (default): replies come from REPLIES below, in th / en / ru / zh.
 *  2. Real AI (optional): set CHAT_API to a server endpoint (e.g. a Cloudflare Worker)
 *     that keeps the key on the server. If it fails, the scripted reply is used,
 *     so visitors never see an error.
 * The page renders replies with textContent only.
 */
(function () {
  'use strict';

  var CHAT_API = ''; // e.g. 'https://thbho-chat.<name>.workers.dev'

  var LINKS = {
    course:   { href: 'https://thbho.com/ThInfoCourse.html',
      t: { th: 'ดูเนื้อหาคอร์ส Hybrid AI Persona ↗', en: 'See the Hybrid AI Persona course ↗', ru: 'Курс Hybrid AI Persona ↗', zh: '查看 Hybrid AI Persona 课程 ↗' } },
    creators: { href: 'https://creators.thbho.com/ThBHoCreators.html',
      t: { th: 'ดูวิธี collab กับ ThB.Ho ↗', en: 'See how to collab with ThB.Ho ↗', ru: 'Как сотрудничать с ThB.Ho ↗', zh: '了解与 ThB.Ho 合作 ↗' } },
    fitness:  { href: 'https://creators.thbho.com/FitFantasy.html',
      t: { th: 'ไปที่ GymMateX Fitness & Fantasy ↗', en: 'Open GymMateX Fitness & Fantasy ↗', ru: 'GymMateX Fitness & Fantasy ↗', zh: '前往 GymMateX Fitness & Fantasy ↗' } },
    property: { href: 'https://thbho.com/HybridAIAgentNetwork.html',
      t: { th: 'ดู Hybrid AI Agent Network ↗', en: 'See the Hybrid AI Agent Network ↗', ru: 'Сеть Hybrid AI Agent Network ↗', zh: '查看 Hybrid AI Agent Network ↗' } },
    widerooms:{ href: 'https://thbho.com/EngWiderooms.html',
      t: { th: 'ดูแบรนด์ WIDEROOMS ↗', en: 'See WIDEROOMS ↗', ru: 'Бренд WIDEROOMS ↗', zh: '查看 WIDEROOMS ↗' } },
    video:    { href: 'https://creators.thbho.com/ThBHoPortfolio.html',
      t: { th: 'ดูผลงาน MV & Films ↗', en: 'Watch MV & Films ↗', ru: 'Смотреть MV и фильмы ↗', zh: '观看 MV 与影片 ↗' } },
    team:     { href: 'https://thbho.com/ThInstructors.html',
      t: { th: 'อ่านเรื่องราวของพวกเราทั้งสามคน ↗', en: 'Read about all three of us ↗', ru: 'О нас троих ↗', zh: '了解我们三位 ↗' } },
    contact:  { href: '#register',
      t: { th: 'ไปที่ฟอร์มทักทาย ↓', en: 'Go to the contact form ↓', ru: 'К форме связи ↓', zh: '前往联系表单 ↓' } }
  };

  // Suggested questions shown under the chat. Each one is sent as a message.
  var CHIPS = [
    { th: 'แนะนำตัวหน่อย', en: 'Who are you?', ru: 'Кто ты?', zh: '你是谁？' },
    { th: 'Hybrid AI Persona คืออะไร', en: 'What is a Hybrid AI Persona?', ru: 'Что такое Hybrid AI Persona?', zh: '什么是混合AI角色？' },
    { th: 'อยากเรียนคอร์ส', en: 'Tell me about the course', ru: 'Хочу на курс', zh: '我想参加课程' },
    { th: 'อยาก collab', en: 'I want to collab', ru: 'Хочу сотрудничать', zh: '我想合作' },
    { th: 'AI กับอสังหา', en: 'AI for real estate', ru: 'ИИ и недвижимость', zh: 'AI 与房地产' }
  ];

  // Latin words match word starts; Thai, Chinese and Russian match substrings. First match wins.
  var INTENTS = [
    { id: 'thanks',   link: null,       re: /\bthank|\bthx\b|ขอบคุณ|ขอบใจ|спасиб|谢谢|感谢|多谢/ },
    { id: 'bye',      link: null,       re: /\bbye\b|\bsee you|\bgood ?night|ลาก่อน|บาย|ไปก่อน|пока|до свидан|再见|拜拜/ },
    { id: 'creators', link: 'creators', re: /\bcollab|\bcreator|\binfluencer|\bmodel\b|\bsponsor|\bpartner|คอลแลป|คอลแล็บ|collab|ร่วมงาน|ครีเอเตอร์|อินฟลู|นายแบบ|сотруд|коллаб|блогер|инфлюенс|партн|合作|创作者|网红|模特/ },
    { id: 'fitness',  link: 'fitness',  re: /\bfitness|\bgym|\bwork ?out|\bmuscle|\bfantasy|\bgymmatex|ฟิตเนส|ยิม|ออกกำลัง|กล้าม|แฟนตาซี|фитнес|трениров|мышц|фэнтез|健身|锻炼|肌肉|奇幻/ },
    { id: 'property', link: 'property', re: /\breal ?estate|\bproperty|\bcondo|\bhouse|\bhome\b|\bagent|\bmbti|\bfeng ?shui|\bwiderooms|อสังหา|คอนโด|บ้าน|เอเจน|ฮวงจุ้ย|ดวง|недвиж|квартир|дом|агент|фэншуй|房地产|房产|公寓|房子|中介|风水/ },
    { id: 'course',   link: 'course',   re: /\bcourse|\bclass|\blearn|\bworkshop|\bsession|\bstudy|\blecture|\bteach|คอร์ส|เรียน|อบรม|สอน|เวิร์กช็อป|курс|обучен|урок|лекци|课程|学习|培训|讲座/ },
    { id: 'video',    link: 'video',    re: /\bvideo|\bmv\b|\bfilm|\bmovie|\bmusic|\bsong|\bportfolio|คลิป|วิดีโอ|วีดีโอ|หนัง|ภาพยนตร์|เพลง|ผลงาน|видео|фильм|музык|клип|песн|视频|电影|音乐|作品/ },
    { id: 'persona',  link: 'course',   re: /\bpersona|\bhybrid|\bdigital twin|\btwin|\bavatar|\bai\b|\bhumanoid|\brobot|เพอร์โซนา|ตัวตน|อวตาร|หุ่นยนต์|ไฮบริด|персон|аватар|двойник|гибрид|робот|角色|分身|化身|机器人|混合/ },
    { id: 'contact',  link: 'contact',  re: /\bcontact|\bprice|\bcost|how much|\bemail|\bline\b|ติดต่อ|ราคา|เท่าไหร่|เท่าไร|อีเมล|связ|цен|стоим|сколько|联系|价格|多少钱|费用/ },
    { id: 'who',      link: 'team',     re: /who are you|\babout you|\bintroduce|\byour name|tell me about yourself|ใคร|แนะนำตัว|ชื่ออะไร|кто ты|кто вы|расскажи о себе|представ|你是谁|介绍|你叫什么/ },
    { id: 'greet',    link: null,       re: /^\s*(hi|hello|hey|yo|sup)\b|how are you|สวัสดี|หวัดดี|ดีครับ|ดีค่ะ|สบายดี|привет|здравств|как дела|你好|您好|嗨|哈喽/ }
  ];

  // REPLIES[intent][persona][lang]. Voices: Three = warm storyteller (INFP),
  // B. = calm strategist in steps (INFJ), Hour = short, energetic, action first (ESTP).
  var REPLIES = {
    welcome: {
      tee:  { th: 'สวัสดีครับ ผมชื่อที นักเล่าเรื่องของทีม อยากคุยเรื่องไหนก่อนดี เรื่อง AI ที่มีตัวตน หรือเรื่องราวเบื้องหลังผลงานของพวกเรา?',
              en: "Hi, I'm Three, the storyteller of the team. Where shall we start: AI with a real personality, or the stories behind our work?",
              ru: 'Привет, я Три, рассказчик команды. С чего начнём: с ИИ, у которого есть личность, или с историй за нашими работами?',
              zh: '你好，我是三，团队里的讲故事的人。想先聊什么：有个性的AI，还是我们作品背后的故事？' },
      b:    { th: 'สวัสดีครับ ผมบี ดูแลเรื่องกลยุทธ์ บอกเป้าหมายของคุณมาได้เลย แล้วเราจะดูกันทีละขั้นว่า AI ช่วยได้ตรงไหน',
              en: "Hello, I'm B., the strategist. Tell me your goal and we'll work out, step by step, where AI can help.",
              ru: 'Здравствуйте, я Б., стратег. Расскажите о цели, и мы шаг за шагом разберём, где поможет ИИ.',
              zh: '你好，我是B.，负责策略。告诉我你的目标，我们一步步看看AI能在哪里帮上忙。' },
      hour: { th: 'ไง! ผมอาวว์ สายลงมือทำ มีไอเดียอะไรอยู่ในหัว ยิงมาเลยครับ',
              en: "Hey! I'm Hour, the one who gets things done. Got an idea? Fire away.",
              ru: 'Привет! Я Час, человек действия. Есть идея? Выкладывай.',
              zh: '嘿！我是时，行动派。脑子里有什么想法？直接说吧。' }
    },
    greet: {
      tee:  { th: 'สบายดีครับ ขอบคุณที่ถาม วันนี้ผมกำลังคิดพล็อตเรื่องใหม่อยู่พอดี แล้วคุณล่ะ มีเรื่องอะไรอยากเล่าให้ฟังไหม?',
              en: "I'm well, thanks for asking. I was just dreaming up a new story. How about you, anything on your mind?",
              ru: 'Всё хорошо, спасибо. Как раз придумываю новую историю. А у вас что на уме?',
              zh: '我很好，谢谢关心。我正好在构思一个新故事。你呢，有什么想聊的？' },
      b:    { th: 'สวัสดีครับ ยินดีที่ได้คุยกัน วันนี้อยากคุยเรื่องไหน คอร์ส Hybrid AI, การ collab หรือ AI กับงานอสังหา?',
              en: 'Hello, good to meet you. What would you like to cover today: the Hybrid AI course, a collab, or AI for real estate?',
              ru: 'Здравствуйте, рад знакомству. О чём поговорим: курс Hybrid AI, сотрудничество или ИИ в недвижимости?',
              zh: '你好，很高兴认识你。今天想聊什么：Hybrid AI 课程、合作，还是 AI 与房地产？' },
      hour: { th: 'สบายมาก พร้อมลุย! วันนี้จะเอาเรื่องไหนดี?',
              en: 'Great, ready to roll! What are we tackling today?',
              ru: 'Отлично, готов действовать! Чем займёмся?',
              zh: '很好，随时开干！今天搞什么？' }
    },
    who: {
      tee:  { th: 'ผมคือที (INFP) หนึ่งในสาม Hybrid AI Persona ที่เกิดจากตัวตนของธอร์ ผมชอบเล่าเรื่อง ทำ MV และหนังสั้นด้วย AI ส่วนบีเป็นนักกลยุทธ์ และอาวว์เป็นนักธุรกิจสายลุย',
              en: "I'm Three (INFP), one of three Hybrid AI Personas born from Thor's own identity. I tell stories and make MVs and short films with AI. B. is our strategist, and Hour is the hands-on entrepreneur.",
              ru: 'Я Три (INFP), одна из трёх Hybrid AI Persona, созданных из личности Тора. Я рассказываю истории и делаю клипы и короткие фильмы с ИИ. Б. — наш стратег, а Час — предприниматель-практик.',
              zh: '我是三（INFP），由 Thor 本人身份衍生出的三个混合AI角色之一。我负责讲故事，用AI制作MV和短片。B. 是我们的策略师，时是实干型的创业者。' },
      b:    { th: 'ผมบี (INFJ) ดูแลกลยุทธ์และเทคโนโลยี หน้าที่ผมคือแปลงไอเดียให้เป็นแผนที่ทำได้จริง เช่น วางระบบเว็บขายอสังหาด้วย Hybrid AI หรือออกแบบ persona ให้แบรนด์',
              en: "I'm B. (INFJ), in charge of strategy and technology. I turn ideas into plans that actually work, like Hybrid AI property sales sites or a persona for a brand.",
              ru: 'Я Б. (INFJ), отвечаю за стратегию и технологии. Превращаю идеи в рабочие планы: сайты продаж недвижимости на Hybrid AI или персону для бренда.',
              zh: '我是B.（INFJ），负责策略与技术。我把想法变成可执行的计划，比如用混合AI打造房产销售网站，或为品牌设计角色。' },
      hour: { th: 'อาวว์ (ESTP) สายธุรกิจ ชอบลงมือก่อนคิดเยอะ! ผมดูแลการ collab กับ creator และพาร์ทเนอร์ใหม่ๆ',
              en: "Hour (ESTP), business side. I'd rather act than overthink! I handle collabs with creators and new partners.",
              ru: 'Час (ESTP), бизнес. Лучше действовать, чем долго думать! Веду коллаборации с авторами и новыми партнёрами.',
              zh: '时（ESTP），负责商务。比起想太多，我更爱先动手！我负责与创作者和新伙伴的合作。' }
    },
    persona: {
      tee:  { th: 'Hybrid AI Persona คือ AI ที่มีตัวตน ความทรงจำ และวิธีพูดของคนจริงอยู่ข้างใน ไม่ใช่แค่เครื่องมือตอบคำถาม เหมือนพวกเราสามคนที่มาจากธอร์คนเดียว แต่มีบุคลิกต่างกัน',
              en: "A Hybrid AI Persona is an AI with a real person's identity, memories and way of speaking inside it, not just a tool that answers questions. Like the three of us: one Thor, three personalities.",
              ru: 'Hybrid AI Persona — это ИИ с личностью, памятью и манерой речи реального человека, а не просто инструмент для ответов. Как мы трое: один Тор, три характера.',
              zh: '混合AI角色是一个内含真人身份、记忆和说话方式的AI，而不只是回答问题的工具。就像我们三个：同一个 Thor，三种性格。' },
      b:    { th: 'คิดง่ายๆ เป็น 3 ขั้นครับ 1) เก็บตัวตนและความเชี่ยวชาญของคุณ 2) ออกแบบบุคลิกด้วย framework อย่าง MBTI 3) นำไปใช้กับคอนเทนต์ งานขาย หรือ avatar ในอนาคต รายละเอียดอยู่ในคอร์ส 6 session',
              en: 'Think of it in three steps: 1) capture your identity and expertise, 2) shape the personality with a framework like MBTI, 3) use it for content, sales, or avatars later on. The 6-session course covers it in full.',
              ru: 'Три шага: 1) зафиксировать вашу личность и опыт, 2) задать характер через MBTI, 3) применить в контенте, продажах или аватарах. Подробно — в курсе из 6 сессий.',
              zh: '分三步：1）记录你的身份与专长；2）用MBTI等框架塑造性格；3）用于内容、销售或未来的虚拟形象。6节课程里有完整内容。' },
      hour: { th: 'สั้นๆ คือ AI ที่เป็น "คุณ" ในเวอร์ชันดิจิทัล ทำงานแทนคุณได้ 24 ชม. อยากเห็นของจริง ดูคอร์สได้เลย!',
              en: "In short: a digital version of you that works 24/7. Want to see it for real? Check the course!",
              ru: 'Коротко: цифровая версия вас, которая работает 24/7. Хотите увидеть вживую? Смотрите курс!',
              zh: '简单说：一个24小时为你工作的数字版的你。想亲眼看看？去看课程吧！' }
    },
    course: {
      tee:  { th: 'คอร์ส Hybrid AI Persona มี 6 session ครับ เราจะช่วยกันปั้นตัวตนดิจิทัลของคุณให้มีเรื่องราวและมีชีวิต ถ้าอยากได้แบบเร่งรัดก็มีแบบ 1 วันด้วย',
              en: "The Hybrid AI Persona course has 6 sessions. Together we'll shape a digital you with its own story and life. There's also a 1-day intensive.",
              ru: 'Курс Hybrid AI Persona — 6 сессий. Вместе создадим цифрового вас с собственной историей. Есть и интенсив за 1 день.',
              zh: 'Hybrid AI Persona 课程共6节。我们一起打造一个有故事、有生命的数字版你。也有1天的速成版。' },
      b:    { th: 'มี 2 ทางให้เลือกครับ 1) คอร์สเต็ม 6 session ลงลึกทั้ง persona, คอนเทนต์ และการใช้งานจริง 2) Gen. AI & Hybrid แบบ 1 วัน สรุปแก่นเร่งรัด ดูรายละเอียดคอร์สเต็มได้ที่ลิงก์นี้',
              en: 'Two options: 1) the full 6-session course, going deep on persona, content and real use; 2) the 1-day Gen. AI & Hybrid intensive. Full course details are here.',
              ru: 'Два варианта: 1) полный курс из 6 сессий — персона, контент, практика; 2) однодневный интенсив Gen. AI & Hybrid. Подробности полного курса — по ссылке.',
              zh: '两种选择：1）完整6节课程，深入角色、内容与实际应用；2）1天的 Gen. AI & Hybrid 速成课。完整课程详情见链接。' },
      hour: { th: 'อยากเรียนใช่ไหม? ดูเนื้อหาแล้วทักมาในฟอร์มด้านล่างได้เลย เริ่มเร็วได้เปรียบ!',
              en: 'Want in? Check the content, then drop us a line in the form below. The sooner you start, the better!',
              ru: 'Хотите учиться? Посмотрите программу и напишите нам в форме ниже. Чем раньше, тем лучше!',
              zh: '想学？先看看内容，然后在下方表单给我们留言。越早开始越好！' }
    },
    creators: {
      tee:  { th: 'ผมชอบ collab กับ creator มากครับ เราเล่าเรื่องด้วยกันได้ทั้งคลิป MV และคอนเทนต์ที่มีพวกเราสามคนอยู่ในนั้น',
              en: 'I love collabs with creators. We can tell stories together in clips, MVs and content featuring the three of us.',
              ru: 'Обожаю коллаборации с авторами. Можем вместе рассказывать истории в клипах, MV и контенте с нами троими.',
              zh: '我很喜欢和创作者合作。我们可以一起用短片、MV和有我们三个出镜的内容讲故事。' },
      b:    { th: 'ThB.Ho Creators เปิดรับ creator สายฟิตเนส influencer และนายแบบครับ ขั้นแรกทำแบบทดสอบสั้นๆ ว่าคุณเข้ากับใครในพวกเรา แล้วเราค่อยคุยรูปแบบ collab ที่เหมาะ',
              en: 'ThB.Ho Creators is open to fitness creators, influencers and models. First, take a short quiz to see which of us you match, then we talk about the right kind of collab.',
              ru: 'ThB.Ho Creators открыт для фитнес-авторов, инфлюенсеров и моделей. Сначала короткий тест — с кем из нас вы совпадаете, затем обсудим формат.',
              zh: 'ThB.Ho Creators 欢迎健身创作者、网红和模特。先做个小测试看看你和我们谁最合拍，再聊合适的合作方式。' },
      hour: { th: 'collab เลย! ดูรายละเอียดที่หน้า ThB.Ho Creators แล้วทักมา ผมรออยู่',
              en: "Let's collab! Check the ThB.Ho Creators page and ping me. I'm waiting.",
              ru: 'Давайте сотрудничать! Загляните на страницу ThB.Ho Creators и напишите мне.',
              zh: '来合作吧！看看 ThB.Ho Creators 页面，然后找我。我等着。' }
    },
    fitness: {
      tee:  { th: 'GymMateX Fitness & Fantasy คือโลกที่ฟิตเนสมาเจอเรื่องราวแฟนตาซี มีนักเดินทางข้ามเวลาเป็นเทรนเนอร์ ลองแวะไปดูนะครับ',
              en: 'GymMateX Fitness & Fantasy is where fitness meets fantasy stories, with time-traveling trainers. Do drop by.',
              ru: 'GymMateX Fitness & Fantasy — где фитнес встречается с фэнтези, а тренеры путешествуют во времени. Загляните.',
              zh: 'GymMateX Fitness & Fantasy 是健身与奇幻故事相遇的地方，教练都是时空旅行者。欢迎去看看。' },
      b:    { th: 'โปรเจกต์ Fitness & Fantasy เป็นงานทดลองพิเศษสำหรับสายฟิตเนส ใช้ Hybrid AI สร้างคอนเทนต์และเทรนเนอร์ persona ข้อมูลทั้งหมดอยู่ที่หน้าโปรเจกต์ครับ',
              en: 'Fitness & Fantasy is a special experiment for the fitness crowd, using Hybrid AI for content and trainer personas. Everything is on the project page.',
              ru: 'Fitness & Fantasy — особый эксперимент для фитнес-аудитории: контент и персоны-тренеры на Hybrid AI. Всё на странице проекта.',
              zh: 'Fitness & Fantasy 是专为健身爱好者的特别实验，用混合AI制作内容和教练角色。全部信息在项目页面。' },
      hour: { th: 'สายฟิตต้องไม่พลาด! ไปดูหน้า Fitness & Fantasy เลย แล้วไปยิมกัน 💪',
              en: "Fitness fans can't miss this! Open Fitness & Fantasy, then hit the gym 💪",
              ru: 'Фанатам фитнеса — обязательно! Открывайте Fitness & Fantasy и в зал 💪',
              zh: '健身爱好者不能错过！去看 Fitness & Fantasy，然后去健身房 💪' }
    },
    property: {
      tee:  { th: 'บ้านทุกหลังมีบุคลิกของตัวเองครับ เราใช้ Hybrid AI ช่วยให้แต่ละหลังเจอผู้ซื้อที่ใช่ ทั้งจาก MBTI ดวงชะตา และฮวงจุ้ย',
              en: 'Every home has a personality. We use Hybrid AI to help each one meet the right buyer, through MBTI, birth chart and feng shui.',
              ru: 'У каждого дома есть характер. С Hybrid AI мы помогаем каждому найти своего покупателя — по MBTI, натальной карте и фэншуй.',
              zh: '每栋房子都有自己的性格。我们用混合AI，通过MBTI、命盘和风水，帮每栋房子找到对的买家。' },
      b:    { th: 'ฝั่งอสังหาเราทำ 3 อย่างครับ 1) เว็บขายของเอเจนซีบนระบบ Hybrid AI 2) จับคู่บ้านกับผู้ซื้อ 3) เครือข่าย Hybrid AI Agent Network ที่แชร์ทรัพย์และลูกค้าข้ามเมือง ส่วนงานตกแต่งและ smart home อยู่ภายใต้ WIDEROOMS',
              en: 'On the property side we do three things: 1) agency sales sites on the Hybrid AI engine, 2) home-to-buyer matching, 3) the Hybrid AI Agent Network, sharing listings and clients across cities. Interiors and smart home sit under WIDEROOMS.',
              ru: 'В недвижимости мы делаем три вещи: 1) сайты продаж для агентств на движке Hybrid AI, 2) подбор жилья под покупателя, 3) сеть Hybrid AI Agent Network с обменом объектами и клиентами между городами. Интерьеры и умный дом — в WIDEROOMS.',
              zh: '房地产方面我们做三件事：1）基于混合AI引擎的中介销售网站；2）房屋与买家匹配；3）跨城市共享房源与客户的 Hybrid AI Agent Network。室内设计与智能家居属于 WIDEROOMS。' },
      hour: { th: 'เป็นเอเจนต์หรือมีทรัพย์อยากขายเร็วขึ้น? ดูเครือข่ายของเราแล้วทักมาเลย!',
              en: 'Agent, or got a property that should sell faster? Check our network and get in touch!',
              ru: 'Вы агент или хотите продать объект быстрее? Смотрите нашу сеть и пишите!',
              zh: '你是中介，或有房子想卖得更快？看看我们的网络，然后联系我们！' }
    },
    video: {
      tee:  { th: 'ผลงานที่ผมภูมิใจที่สุดคือ MV และหนังสั้นที่เราทำกับ AI ทุกเรื่องมีหัวใจของคนจริงอยู่ข้างใน รวมไว้ในหน้าเดียวแล้วครับ',
              en: "What I'm proudest of are our MVs and short films made with AI, each with a real human heart inside. They're all on one page.",
              ru: 'Больше всего горжусь нашими клипами и короткими фильмами с ИИ — в каждом живое человеческое сердце. Всё собрано на одной странице.',
              zh: '我最自豪的是我们用AI制作的MV和短片，每一部都有真实的人心。全都汇集在一个页面上。' },
      b:    { th: 'ผลงาน MV, หนังสั้น และคลิป Hybrid AI ของพวกเรารวมอยู่ในหน้า Portfolio ครับ กดเล่นได้เลย',
              en: 'Our MVs, short films and Hybrid AI clips are collected on the Portfolio page, ready to play.',
              ru: 'Наши клипы, короткие фильмы и ролики Hybrid AI собраны на странице Portfolio.',
              zh: '我们的MV、短片和混合AI短视频都收录在 Portfolio 页面，点开即可播放。' },
      hour: { th: 'ไปดูเลย! เปิดเสียงด้วยนะ 🎬',
              en: 'Go watch! Sound on 🎬',
              ru: 'Смотрите! Со звуком 🎬',
              zh: '去看吧！记得开声音 🎬' }
    },
    contact: {
      tee:  { th: 'อยากคุยต่อ ทักมาในฟอร์มด้านล่างได้เลยครับ เล่าเรื่องของคุณให้ฟังหน่อย',
              en: "Let's keep talking. Drop a message in the form below and tell me your story.",
              ru: 'Давайте продолжим. Напишите в форме ниже и расскажите свою историю.',
              zh: '我们继续聊吧。在下方表单留言，说说你的故事。' },
      b:    { th: 'รายละเอียดและราคาขึ้นกับงานแต่ละแบบครับ ส่งข้อความในฟอร์มด้านล่างพร้อมช่องทางติดต่อ แล้วทีมจะตอบกลับ',
              en: 'Details and pricing depend on the kind of work. Send a message in the form below with your contact, and the team will reply.',
              ru: 'Детали и цены зависят от задачи. Оставьте сообщение и контакт в форме ниже — команда ответит.',
              zh: '细节和价格取决于具体项目。请在下方表单留言并附上联系方式，团队会回复你。' },
      hour: { th: 'ฟอร์มอยู่ด้านล่าง ทักมาเลย ตอบไว!',
              en: "The form's right below. Message us, we reply fast!",
              ru: 'Форма ниже. Пишите, отвечаем быстро!',
              zh: '表单就在下面。留言吧，我们回得很快！' }
    },
    thanks: {
      tee:  { th: 'ด้วยความยินดีครับ ขอให้วันนี้เป็นเรื่องราวที่ดีของคุณนะ', en: 'My pleasure. May today be a good chapter in your story.', ru: 'Пожалуйста. Пусть сегодня будет хорошей главой вашей истории.', zh: '不客气。愿今天是你故事里美好的一章。' },
      b:    { th: 'ยินดีครับ ถ้ามีคำถามเพิ่ม ถามได้ตลอด', en: "You're welcome. Ask anytime.", ru: 'Пожалуйста. Спрашивайте в любое время.', zh: '不客气，随时问我。' },
      hour: { th: 'ได้เลย! ลุยต่อกัน', en: "Anytime! Let's keep going.", ru: 'Всегда пожалуйста! Вперёд.', zh: '随时！继续冲。' }
    },
    bye: {
      tee:  { th: 'แล้วพบกันใหม่ครับ ไว้มาเล่าเรื่องให้ฟังอีกนะ', en: 'See you again. Come back and tell me more stories.', ru: 'До встречи. Возвращайтесь с новыми историями.', zh: '再见，下次再来给我讲故事。' },
      b:    { th: 'ขอบคุณที่แวะมาครับ แล้วพบกัน', en: 'Thanks for stopping by. See you.', ru: 'Спасибо, что заглянули. До встречи.', zh: '谢谢来访，再见。' },
      hour: { th: 'บาย! เจอกันใหม่', en: 'Bye! Catch you later.', ru: 'Пока! Ещё увидимся.', zh: '拜！回头见。' }
    },
    fallback: {
      tee:  { th: 'น่าสนใจครับ ตอนนี้ผมเป็นเวอร์ชันเดโม เลยตอบได้เฉพาะเรื่อง Hybrid AI Persona คอร์ส การ collab ผลงาน และ AI กับอสังหา ลองเลือกคำถามด้านล่างดูนะครับ',
              en: "Interesting! I'm a demo version, so I can talk about Hybrid AI Personas, the course, collabs, our work, and AI for real estate. Try a question below.",
              ru: 'Интересно! Я демо-версия и могу рассказать о Hybrid AI Persona, курсе, сотрудничестве, наших работах и ИИ в недвижимости. Попробуйте вопрос ниже.',
              zh: '有意思！我是演示版，可以聊混合AI角色、课程、合作、我们的作品，以及AI与房地产。试试下面的问题吧。' },
      b:    { th: 'ขอบคุณสำหรับคำถามครับ เวอร์ชันเดโมนี้ตอบได้ 5 เรื่องหลัก: Hybrid AI Persona, คอร์ส, collab, ผลงาน และ AI กับอสังหา ถ้าเป็นเรื่องอื่น ส่งข้อความในฟอร์มด้านล่างได้เลย',
              en: 'Thanks for asking. This demo covers five topics: Hybrid AI Personas, the course, collabs, our work, and AI for real estate. For anything else, use the form below.',
              ru: 'Спасибо за вопрос. Демо охватывает пять тем: Hybrid AI Persona, курс, сотрудничество, работы и ИИ в недвижимости. По остальному — форма ниже.',
              zh: '谢谢提问。这个演示版涵盖五个主题：混合AI角色、课程、合作、作品，以及AI与房地产。其他问题请用下方表单。' },
      hour: { th: 'อันนี้ขอส่งต่อให้ทีมตัวจริงนะ! ทักในฟอร์มด้านล่าง หรือลองกดคำถามข้างล่างดู',
              en: 'That one goes to the real team! Use the form below, or tap a question underneath.',
              ru: 'Это передам настоящей команде! Пишите в форме ниже или нажмите вопрос внизу.',
              zh: '这个交给真人团队！用下方表单，或点下面的问题试试。' }
    }
  };

  function pick(table, lang) { return (table && (table[lang] || table.en)) || ''; }

  function detect(text) {
    var t = String(text || '').toLowerCase();
    for (var i = 0; i < INTENTS.length; i++) if (INTENTS[i].re.test(t)) return INTENTS[i];
    return { id: 'fallback', link: null };
  }

  function linkOf(key, lang) {
    var l = LINKS[key];
    return l ? { href: l.href, text: pick(l.t, lang) } : null;
  }

  function scripted(persona, lang, text) {
    var it = detect(text);
    return { text: pick(REPLIES[it.id][persona], lang), link: it.link ? linkOf(it.link, lang) : null };
  }

  function viaApi(persona, lang, text) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 20000) : null;
    return fetch(CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona: persona, lang: lang, message: String(text).slice(0, 500) }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        if (!d || !d.reply) throw new Error('empty');
        var s = scripted(persona, lang, text);
        return { text: String(d.reply), link: s.link };
      })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  window.FactoryChat = {
    chips: function (lang) { return CHIPS.map(function (c) { return pick(c, lang); }); },
    welcome: function (persona, lang) { return pick(REPLIES.welcome[persona], lang); },
    reply: function (persona, lang, text) {
      if (!CHAT_API) return Promise.resolve(scripted(persona, lang, text));
      return viaApi(persona, lang, text).catch(function () { return scripted(persona, lang, text); });
    }
  };
})();
