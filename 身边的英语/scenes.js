/* 身边的英语 · 内容数据
   主人公：广州租房上班族，外企法务（in-house legal counsel），已婚未育。
   住 1 号线沿线，坐 1 号线到体育西路，出站扫码共享单车去写字楼；9 点上班 6 点下班。
   中午在楼下吃，晚上要么顺路买菜做饭、更经常是点外卖。
   一篇 = 一个场景。第一人称短文为主，对话片段嵌在里面。
   字段：t 英文标题 / z 中文标题 / lead 场景说明 / paras 段落（p 英文 z 中文 w 说话人）
        notes 本篇值得带走的说法（e 英文 c 中文 x 例句）
   加新场景：往 SCENES 数组末尾追加一条即可，目录与播放会自动带上。 */

/* 两种看法：按类型（什么时候）/ 按场景（在哪个地方）。
   同一篇会同时出现在两个视角里 —— part 决定它挂在「周几 / 哪个假期」下，place 决定它挂在哪个地点下。
   place 留空的篇目只出现在「按类型分类」里（比如堵在高速上那篇，不属于任何一个地点）。 */

const VIEWS = [
  { id: "type",  label: "按类型分类", en: "When" },
  { id: "place", label: "按场景分类", en: "Where" }
];

/* by: "part" 按时间分组 / "place" 按地点分组。kids 为空或 label 为空时，篇目直接挂在组下面，不再多一层。 */
const GROUPS = [
  /* ---- 按类型 ---- */
  { id: "weekday", view: "type", by: "part", label: "工作日", en: "Weekdays", kids: [
    { id: "mon", label: "周一", en: "Mon" },
    { id: "tue", label: "周二", en: "Tue" },
    { id: "wed", label: "周三", en: "Wed" },
    { id: "thu", label: "周四", en: "Thu" },
    { id: "fri", label: "周五", en: "Fri" }
  ]},
  { id: "weekend", view: "type", by: "part", label: "周末", en: "Weekend", kids: [
    { id: "sat", label: "周六", en: "Sat" },
    { id: "sun", label: "周日", en: "Sun" }
  ]},
  { id: "holiday", view: "type", by: "part", label: "节假日", en: "Holidays", kids: [
    { id: "midautumn", label: "中秋", en: "Mid-Autumn" },
    { id: "national", label: "国庆", en: "Oct 1st" },
    { id: "spring", label: "春节", en: "Spring Festival" },
    { id: "labour", label: "五一", en: "May Day" },
    { id: "dragon", label: "端午", en: "Dragon Boat" },
    { id: "chongyang", label: "重阳", en: "Chongyang" }
  ]},
  /* ---- 按场景 ---- */
  { id: "gp-tiyu",     view: "place", by: "place", label: "体育西路地铁站", en: "Tiyu Xilu" },
  { id: "gp-station",  view: "place", by: "place", label: "广州火车站", en: "Guangzhou Station" },
  { id: "gp-yuexiu",   view: "place", by: "place", label: "越秀公园", en: "Yuexiu Park" },
  { id: "gp-baiyun",   view: "place", by: "place", label: "白云山", en: "Baiyun Mountain" },
  { id: "gp-office",   view: "place", by: "place", label: "写字楼楼下", en: "Outside the office" },
  { id: "gp-market",   view: "place", by: "place", label: "肉菜市场", en: "The wet market" },
  { id: "gp-teahouse", view: "place", by: "place", label: "早茶楼", en: "The dim sum place" },
  { id: "gp-mall",     view: "place", by: "place", label: "天河城", en: "Teemall" },
  { id: "gp-tower",    view: "place", by: "place", label: "广州塔 · 花城广场", en: "Canton Tower" },
  { id: "gp-airport",  view: "place", by: "place", label: "白云机场", en: "Baiyun Airport" },
  { id: "gp-shamian",  view: "place", by: "place", label: "沙面", en: "Shamian Island" },
  { id: "gp-river",    view: "place", by: "place", label: "猎德涌 · 珠江边", en: "By the river" },
  { id: "gp-home",     view: "place", by: "place", label: "出租屋", en: "The flat" }
];

const SCENES = [
  {
    id: "s01", part: "mon", place: "gp-tiyu", time: "7:10",
    t: "Line 1 at eight in the morning", z: "早八点的一号线",
    lead: "从出租屋走到地铁站八分钟。这八分钟决定我今天迟不迟到，也决定我今天是什么心情。",
    paras: [
      { p: "I leave the flat at seven ten. The walk to the station takes eight minutes if I don't stop for anything, nine if the lift is slow, and twelve if I remember something I forgot and have to turn back — which, on a Monday, is more or less guaranteed.", z: "七点十分出门。走到地铁站八分钟，前提是中途不停；电梯慢一点是九分钟；如果想起忘了东西折回去拿就是十二分钟——周一这天，折回去基本是必然的。" },
      { p: "Did you take the umbrella?", z: "伞带了吗？", w: "Wife" },
      { p: "It's not going to rain.", z: "不会下雨的。", w: "Me" },
      { p: "This is the third time this week I've said it's not going to rain, and it has rained twice. In Guangzhou that sentence is not a weather forecast. It's a challenge.", z: "这已经是我这周第三次说不会下雨了，而前两次都下了。在广州，这句话不是天气预报，是 flag。" },
      { p: "At the station I do the same three moves I do every morning: phone to the gate, bag on the belt, shoulder check for the security guy who is already waving me through, because he's seen me five hundred times and has decided I'm not worth stopping.", z: "进站后是每天早上固定的三件事：手机贴闸机、包放安检机、回头看一眼安检员——他已经懒得看我了，见过我五百次，判定我不值得拦。" },
      { p: "The platform is already two deep. Everyone is standing in the exact spots where the doors will be, while pretending they're not doing that. Nobody makes eye contact. We have all silently agreed that we are not the kind of people who push.", z: "站台已经站了两层人。每个人都精准地站在车门将要停的位置，同时假装自己没在干这件事。没人跟人对视。大家默认达成一条默契：我们不是会挤人的那种人。" },
      { p: "Stand clear of the doors, please. Let the passengers off first.", z: "请勿靠近车门，请先下后上。", w: "Announcement" },
      { p: "The announcement says it in three languages and about forty percent of us listen. The train arrives, the doors open, and for four seconds there's a genuine standoff between the people getting off and the people getting on — a small, polite war that the people getting off always win, because they're already moving.", z: "广播用三种语言说这段话，大概四成的人听。车来了，门开了，下车的和上车的对峙了四秒——一场小型的、讲礼貌的战争，永远是下车的人赢，因为他们已经在动了。" },
      { p: "I get a seat by the third stop. Ten minutes later we cross into the part of the line where the carriage fills up for real — shoulders touching, everybody holding their bag on their chest like a shield, everyone watching a phone screen nobody is really reading.", z: "到第三站我有了座位。十分钟后车开进真正拥挤的那一段——肩膀贴肩膀，所有人都把包抱在胸前当盾牌，都在看手机，但没人真的在看什么。" },
      { p: "Next stop, Tiyu Xilu. Passengers for Line 3, please transfer here.", z: "下一站，体育西路。换乘三号线的乘客请在此站下车。", w: "Announcement" },
      { p: "Tiyu Xilu is where the line breaks open. Half the carriage stands up at once and moves towards the doors in that particular way a crowd moves when it has done this exact thing every morning for years — fast, wordless, and somehow never actually colliding.", z: "体育西路是一号线爆开的那一站。半个车厢的人同时站起来涌向车门，那种「已经这么干了几年」的走法——快、不出声、而且神奇地从不真的撞上。" },
      { p: "Up the escalator, out of the gate, and then the second half of the commute: four shared bikes, three of which have something wrong with them. One has a saddle you can't sit on, one has a chain that sounds like it's filing a complaint, one is somebody's private bike with the QR code scratched off. I take the fourth.", z: "上电梯、出闸，然后通勤的下半场：四辆共享单车，其中三辆有问题。一辆车座没法坐，一辆链条响得像在投诉，一辆是私人车、二维码被刮掉了。我选第四辆。" },
      { p: "The ride is seven minutes. Down the bike lane, past the banyan trees that make this street feel ten degrees cooler than the next one, past a delivery guy going the wrong way at the speed of a small motorcycle, past the same auntie doing the same slow stretching routine on the same patch of pavement every single morning.", z: "骑七分钟。沿自行车道走，路过那些让这条街比隔壁凉快十度的榕树，路过一个逆行、速度快得像小摩托的外卖小哥，路过那位每天早上在同一块地砖上做同一套拉伸的阿姨。" },
      { p: "I lock the bike in the rack at eight fifty-two, and I check the app out of habit — last month I forgot to end a ride once and paid for forty-one minutes of a bike I wasn't on.", z: "八点五十二把车锁进车架，然后习惯性地打开 App 确认——上个月有一次我忘了结束行程，为四十一个不在车上的分钟付了钱。" },
      { p: "Eight minutes to nine. Enough time to get upstairs, sit down, and become the other version of me — the one who reviews contracts, instead of the one who negotiates with an alarm clock.", z: "还有八分钟到九点。够我上楼、坐下、切换成另一个版本的自己——那个审合同的我，而不是跟闹钟谈判的我。" }
    ],
    notes: [
      { e: "it's not going to rain", c: "不会下雨的（经典 flag）", x: "It's not going to rain — I've said that twice this week already." },
      { e: "let the passengers off first", c: "先下后上", x: "The announcement always says let the passengers off first." },
      { e: "shoulder to shoulder", c: "肩并肩，挤到贴着", x: "By the fourth stop we're shoulder to shoulder." },
      { e: "wordless", c: "一言不发的", x: "The whole carriage moves wordless and fast." },
      { e: "out of habit", c: "出于习惯", x: "I check the app now out of habit." }
    ]
  },

  {
    id: "s02", part: "tue", place: "gp-office", time: "12:15",
    t: "The lunch question", z: "中午吃什么",
    lead: "每天十二点一刻，办公室里会准时出现一个难题：吃什么。它不难在没得选，难在所有人都不肯先说。",
    paras: [
      { p: "At twelve fifteen somebody says the words that start the hardest negotiation of the day: what's for lunch?", z: "十二点一刻，有人说出开启一天中最难谈判的那句话：吃什么？" },
      { p: "I'm easy. Anything.", z: "我随便，都行。", w: "Me" },
      { p: "No, you're not. You said no noodles yesterday and no rice bowls the day before.", z: "你不随便。你昨天说不吃面，前天说不吃盖饭。", w: "Nina" },
      { p: "She's right, and it's annoying. Nobody in this office is actually easy. We've all just agreed to pretend we are, because saying what you really want out loud makes you the person who has to decide — and nobody wants to be that person before the coffee has fully worked.", z: "她是对的，而且很烦。这间办公室里没有一个人真的「随便」。大家只是约定好假装随便——因为说出真实想法的人就成了拍板的那个，而咖啡还没完全起效之前，没人想当那个人。" },
      { p: "There's a food street underneath the building, which sounds better than it is. The pig's trotter rice place that everybody goes to twice a week; the malaxiangguo place where you pay by weight and somehow always overshoot; the Lanzhou noodle shop where the guy pulls the noodles in the window; a salad place that costs sixty yuan and leaves me hungry at three; and a Shaxian that has been there longer than any of us.", z: "楼下有条美食街，听起来比实际好。有那家大家一周去两次的猪脚饭；有按重量称、永远会称多的麻辣香锅；有师傅在橱窗里拉面的兰州拉面；有一份六十块、下午三点就饿了的沙拉店；还有一家比我们所有人都更早在这里的沙县。" },
      { p: "We end up at the trotter place. You scan the code at the door, order on your phone, and wait for your number to be shouted. Mine is 47 and they're on 39, which in this shop means either four minutes or eleven, depending on how many delivery orders just came in.", z: "最后去了猪脚饭。门口扫码、手机点单、等号被喊。我是 47 号，现在叫到 39 号——在这家店里这意味着四分钟或十一分钟，取决于刚进来多少外卖单。" },
      { p: "Do you want the corner table?", z: "坐角落那桌？", w: "Nina" },
      { p: "Yes. It's the only table in the room where you can't see your own screen reflection and pretend you're still working.", z: "坐。那是全店唯一一张看不见自己屏幕反光、不用假装还在工作的桌子。" },
      { p: "Halfway through, Nina asks the question I get at least once a week, usually with food in her mouth.", z: "吃到一半，Nina 问了我那个每周至少被问一次的问题，通常是嘴里塞着东西问的。" },
      { p: "Quick one — is it legal if a company makes you sign something saying you won't sue them?", z: "问个快的——公司让你签一个承诺不起诉的东西，合法吗？", w: "Nina" },
      { p: "It depends what it says and who's asking you to sign it. Which is my professional answer, and also my way of not answering this before I've finished eating.", z: "要看它具体怎么写、谁让你签。这是我的职业回答，也是我在吃完之前不想回答这个问题的方式。", w: "Me" },
      { p: "Every in-house lawyer I know has a version of this: the it depends answer, the let me look at the actual wording answer, and the real answer — which is usually no, but I'd need to see it. People hear the first one and think you're being careful. They're right. That's the job.", z: "我认识的每个法务都有这套回答的变体：「要看情况」、「我得看具体措辞」，和真正的答案——通常是「不行，但我得先看看原文」。大家听到第一句，觉得你谨慎。他们没错，这就是这份工作。" },
      { p: "She laughs. We pay separately, even though we've eaten together twice a week for a year. Back at my desk at one, and the afternoon arrives like a wet blanket. I have a redline to finish on a vendor contract, and the words limitation of liability are about to become the most interesting thing in my day.", z: "她笑了。我们各付各的，尽管一周一起吃两次、吃了一年。一点回到工位，下午像一条湿毯子盖下来。我手上还有一份供应商合同的修订要完成，「责任限额」这几个字即将成为我今天最有趣的东西。" }
    ],
    notes: [
      { e: "I'm easy", c: "我随便 / 我好说话", x: "I'm easy — anything is fine with me." },
      { e: "what's for lunch", c: "中午吃什么", x: "Every day at twelve: what's for lunch?" },
      { e: "it depends", c: "要看情况（法务口头禅）", x: "It depends what the clause actually says." },
      { e: "pay separately", c: "各付各的", x: "We always pay separately, even after a year." },
      { e: "halfway through", c: "进行到一半时", x: "Halfway through lunch she asked me a legal question." }
    ]
  },

  {
    id: "s03", part: "wed", place: "gp-home", time: "18:40",
    t: "Cook or order in", z: "做饭还是点外卖",
    lead: "出门前我说好今晚自己做饭。出了地铁我就开始跟这句话谈判。",
    paras: [
      { p: "I get off at six twenty with a plan. The plan is: stop at the vegetable shop on the way, cook something, eat at eight, feel like an adult. I make this plan about three nights a week and execute it roughly once.", z: "六点二十出站，带着一个计划。计划是：路上拐进菜店，做点东西，八点吃饭，感觉自己像个成年人。这个计划我一周做三次，执行大概一次。" },
      { p: "There's a Qian Dama on the corner with the sign I've read a thousand times: we don't sell yesterday's meat. At seven they start discounting, and by a quarter to eight there's a small crowd of people who all had the same idea at the same time.", z: "转角有家钱大妈，招牌我看过一千遍：不卖隔夜肉。晚上七点开始打折，到七点四十五就聚了一小群人——大家都在同一时间想到了同一件事。" },
      { p: "I go in and look at the greens. I pick up a bag of bean sprouts, put it back, pick it up again, and walk out with two spring onions and no dinner.", z: "我走进去看了看青菜，拿起一袋豆芽，放回去，又拿起来，最后拎着两根葱走出来了——没有晚饭。" },
      { p: "At home my wife is already on the sofa, shoes off, in the specific posture that means the day is over and nothing else is happening tonight.", z: "到家时我老婆已经瘫在沙发上，鞋脱了，摆着那个特定姿势——意思是今天结束了，今晚不会再有任何事发生。" },
      { p: "Do you feel like cooking?", z: "你想做饭吗？", w: "Me" },
      { p: "Do you?", z: "你呢？", w: "Wife" },
      { p: "I could. If you start the rice.", z: "我可以，如果你先把饭煮上。", w: "Me" },
      { p: "If I start the rice, I'm cooking.", z: "我要是煮饭，那就是我在做饭。", w: "Wife" },
      { p: "That's the whole negotiation, and it takes eleven seconds. We both know where it ends. We've had this exact conversation so many times that neither of us is even pretending any more — it's a ritual we perform before ordering food, like saying grace.", z: "这就是整场谈判，耗时十一秒。我们都知道结局。这段对话演过太多遍，双方连装都不装了——它基本是点外卖前的仪式，像饭前祷告。" },
      { p: "So we order in. The app part takes twenty minutes, which is longer than cooking would have taken, and I want to be clear about that: we are not saving time. We are saving the part where somebody has to stand up.", z: "于是点外卖。在 App 里挑了二十分钟——比做饭还久，这点我要说清楚：我们不是在省时间，我们是在省「有人要站起来」这件事。" },
      { p: "There's a thirty-yuan minimum, a five-yuan delivery fee, a two-yuan packaging fee, and a discount that only applies if we spend fifteen more — which of course we do, because everyone does, because that's the trick and it works on us every single time.", z: "有三十块起送、五块配送费、两块包装费，还有一个满减——当然我们会凑单，因为所有人都凑，因为这就是套路，而且每次都对我们奏效。" },
      { p: "It arrives at seven forty. We eat at the coffee table with the TV on, which the internet says is bad for you and which is nonetheless the best part of a Wednesday. Rice, two dishes, one of them too salty, both of them somebody else's washing-up.", z: "七点四十到了。我们开着电视在茶几上吃，网上说这习惯不好，但这仍然是周三最好的一段。米饭、两个菜，其中一个偏咸，两个都不用我们自己洗锅。" },
      { p: "The spring onions go back in the fridge. They'll still be there on Sunday, slightly sadder, and we'll throw them out together without discussing it — some things in a marriage don't need to be said.", z: "两根葱回到冰箱。周日它们还在，只是更蔫了一点，我们会一起扔掉、一句话不说——婚姻里有些事不用讲。" }
    ],
    notes: [
      { e: "order in / get takeaway", c: "点外卖", x: "We were going to cook, but we ordered in." },
      { e: "I can't be bothered", c: "我懒得动 / 提不起劲", x: "I could cook, but honestly I can't be bothered." },
      { e: "do you feel like ...", c: "你想不想……", x: "Do you feel like cooking tonight?" },
      { e: "the delivery fee", c: "配送费", x: "The delivery fee is five yuan and the food arrives cold." },
      { e: "there's nothing in the fridge", c: "冰箱里什么都没有", x: "There's nothing in the fridge but two spring onions." }
    ]
  },

  {
    id: "s04", part: "thu", place: "gp-home", time: "21:05",
    t: "The nine o'clock call", z: "晚上九点那场会",
    lead: "公司总部在欧洲。这意味着每年有几十个晚上，我九点钟还在说英语。",
    paras: [
      { p: "Our head office is in Europe, which means roughly two evenings a week I'm on a call at nine at night. Not a crisis — just the arithmetic of time zones. Nine here is their afternoon, and somebody's calendar has to close the day.", z: "我们总部在欧洲，这意味着大概一周有两个晚上，我九点还在开会。不是出了什么事，就是时区算术：我们这儿九点是他们下午，总得有个地方收摊。" },
      { p: "Tonight it's a vendor contract that's been going back and forth for three weeks. I've redlined it twice; they've rejected the limitation of liability clause both times and put it back the way it was, which is a very polite way of saying no.", z: "今晚谈的是一份来回拉扯了三周的供应商合同。我改了两稿，他们两次都把责任限额条款改回原样——这是一种非常礼貌的拒绝。" },
      { p: "Thanks for joining. Let's kick off — I'll walk you through where we are on the vendor agreement.", z: "谢谢上线。我们开始吧——我先把供应商合同的进展过一遍。", w: "Me" },
      { p: "Sure. Just to flag before you start: we're short on time, so if we could keep it to thirty minutes.", z: "好。开始前先说明一下：我们时间紧，能不能控制在三十分钟。", w: "Marcus" },
      { p: "Thirty minutes, fine. My read on this is that we're actually arguing about one sentence, and everything else in these thirty pages is agreed. So let's argue about the sentence.", z: "三十分钟，行。我的判断是：我们其实只在争一句话，这三十页里其他都谈定了。那就争这句话。" },
      { p: "The sentence is the one that says neither side pays more than the value of the contract if something goes wrong. Our vendor wants that. We want it too, mostly. What we don't want is the version where it also covers data breaches, because under PIPL a data incident is not a contract-sized problem.", z: "那句话是：出事时任一方赔付不超过合同金额。供应商想要，我们大体也想。我们不想要的是把它也覆盖数据泄露的版本——因为在个人信息保护法下，数据事故不是一个「合同大小」的问题。" },
      { p: "Sorry — can I just check, are we recording this?", z: "抱歉打断一下——我们这会有在录吗？", w: "Marcus" },
      { p: "Yes.", z: "在的。", w: "Me" },
      { p: "Then let's take that offline. I'll email you.", z: "那这块我们线下聊，我发邮件给你。", w: "Marcus" },
      { p: "Take it offline is the most useful four words in corporate English. It means: I don't want to say this where it's being recorded. It isn't rude. It's how grown-ups disagree.", z: "「线下聊」是职场英语里最有用的四个字。意思是：这话我不想留在录音里。它不粗鲁，这是成年人的分歧方式。" },
      { p: "The line drops twice — Guangzhou wifi, European servers, and whatever sits between them. Both times somebody says can you hear me now, and both times I say you're breaking up a bit but go on, which is what you say when you've understood eighty percent and hope the rest is in the slides.", z: "掉了两次线——广州的 wifi、欧洲的服务器、中间那一大段不知道什么。两次都有人问「现在能听见吗」，两次我都说「有点断续你继续」——就是当你听懂八成、指望剩下两成在 PPT 里时会说的话。" },
      { p: "We land it at nine forty. A thirty-minute call that runs forty minutes, which is the industry standard. I write the follow-up email immediately, because at ten at night the version of me that remembers what we agreed is about to go to bed.", z: "九点四十谈完。三十分钟的会开了四十分钟，这是行业标准。我立刻写跟进邮件，因为晚上十点，那个还记得我们谈了什么的我马上要睡了。" },
      { p: "Action items, owners, one open question on data. Send. I close the laptop and go out to the living room, where my wife has been watching something with the sound low for the last forty minutes so she wouldn't be on my call.", z: "行动项、负责人、一个关于数据的未决问题。发送。合上电脑走到客厅——我老婆把声音调得很低看了四十分钟，就为了不出现在我的会议里。" },
      { p: "Done?", z: "完了？", w: "Wife" },
      { p: "Done. Sorry.", z: "完了。不好意思。", w: "Me" },
      { p: "You say sorry every Thursday and I've stopped accepting it. Put the sound up.", z: "你每周四道歉，我已经不接受了。把声音开大。", w: "Wife" }
    ],
    notes: [
      { e: "kick off", c: "开始（会议）", x: "Let's kick off — I'll walk you through it." },
      { e: "walk you through", c: "带你过一遍", x: "Let me walk you through the changes." },
      { e: "my read on this is ...", c: "我的判断是……", x: "My read on this is that we're arguing about one sentence." },
      { e: "let's take it offline", c: "这块线下聊（不想留痕）", x: "Let's take that offline — I'll email you." },
      { e: "can you hear me now", c: "现在能听见吗", x: "Sorry, can you hear me now?" }
    ]
  },

  {
    id: "s05", part: "fri", place: "gp-office", time: "18:20",
    t: "Friday, off the hook", z: "周五，下班了",
    lead: "六点整，我合上电脑。周五的下班和别的日子不一样：不是逃离，是结束。",
    paras: [
      { p: "At six on Friday I close the laptop, and I want to point out that this is a different action from closing it at six on Monday. On Monday, closing the laptop means I've escaped. On Friday, it means the week is over and I'm allowed to stop thinking about it.", z: "周五六点，我合上电脑。我要指出这跟周一六点合电脑不是同一个动作：周一是「我逃出来了」，周五是「这周结束了，我可以不想了」。" },
      { p: "We're going for a drink. You in?", z: "我们去喝一杯，你来吗？", w: "Nina" },
      { p: "Next time. I've got nothing on tonight and I really want to keep it that way.", z: "下次吧。我今晚什么都没安排，而且我真的很想保持这个状态。", w: "Me" },
      { p: "This is a newer skill than it sounds. In my twenties I said yes to everything on a Friday, because I was afraid the weekend would be wasted if I didn't. Now I know the opposite is true: the weekend is wasted by the Friday you spend recovering from it.", z: "这听起来简单，其实是后来才学会的本事。二十几岁时周五我什么都答应，因为怕不答应周末就被浪费了。现在我知道正好相反：周末是被那个用来恢复的周五浪费掉的。" },
      { p: "I don't take the metro home on Fridays. I walk fifteen minutes to the next station and get a seat, which sounds like a worse deal than it is — fifteen minutes outside, in the part of Guangzhou where the light is going orange and the fruit shops are putting the good stuff out front.", z: "周五我不坐地铁。我走到下一站再坐，多走十五分钟换一个座位——听起来亏，其实不亏：十五分钟在外面，在广州这段天色转橙、水果店把好货摆到门口的时间里。" },
      { p: "I buy a bag of lychees from the guy who never smiles and always gives me the ripe ones. I buy milk tea, no sugar, because I've decided this counts as restraint, and because my wife will ask and I want an answer ready.", z: "我在那个从不笑、但总给我挑熟的老板那儿买了一袋荔枝。又买了奶茶，不加糖，因为我认定这算克制，也因为我老婆会问，我得有个答案等着。" },
      { p: "Home by seven. The flat is rented, which means the kitchen is somebody else's kitchen and the walls are the colour the landlord liked in 2016. But it's ours for now, and on a Friday evening with the window open, it's exactly the right size.", z: "七点到家。房子是租的，意味着厨房是别人的厨房，墙是房东 2016 年喜欢的颜色。但现在它是我们的，周五晚上开着窗，大小刚刚好。" },
      { p: "My wife gets in ten minutes later. Neither of us cooks, because Friday has a rule, and the rule is: eating out, twenty minutes' walk, no reservation, wherever has a table.", z: "我老婆十分钟后到家。我们不做饭，因为周五有条规矩：下馆子，走二十分钟，不订位，哪家有座吃哪家。" },
      { p: "Any plans tomorrow?", z: "明天有安排吗？", w: "Wife" },
      { p: "Sleeping in. Then dim sum. Then nothing.", z: "睡到自然醒。然后喝早茶。然后什么都没有。", w: "Me" },
      { p: "That's the whole plan.", z: "这就是全部计划。", w: "Me" },
      { p: "Good. She says it like she's approving a document, which, given who she's married to, she probably learned from me.", z: "好。她说这话的口气像在批一份文件——考虑到她嫁的是谁，大概跟我学的。" },
      { p: "We walk back slowly in the warm dark. No alarm tomorrow. I'll set one anyway out of habit, wake up before it, and lie there for a while — which is the actual luxury of this life: nobody is coming to get you on a Saturday morning.", z: "我们在暖烘烘的夜色里慢慢走回去。明天没有闹钟。我还是会定一个，出于习惯，然后在它响之前醒来，躺一会儿——这就是这种生活的真正奢侈品：周六早上没有人来找你。" }
    ],
    notes: [
      { e: "off the hook", c: "脱身了、没我事了", x: "Six o'clock Friday and I'm off the hook." },
      { e: "you in?", c: "你来吗？", x: "We're going for a drink — you in?" },
      { e: "I've got nothing on", c: "我什么安排都没有", x: "I've got nothing on tonight and I want to keep it that way." },
      { e: "sleep in", c: "睡到自然醒", x: "No alarm tomorrow. We're sleeping in." },
      { e: "wherever has a table", c: "哪家有位吃哪家", x: "No reservation — wherever has a table." }
    ]
  },

  {
    id: "s06", part: "sat", place: "gp-teahouse", time: "10:20",
    t: "Dim sum at eleven on a Saturday", z: "周六十一点的早茶",
    lead: "广州的早茶不是在「吃早餐」，它是一项需要排号的活动。十一点到，等于迟到。",
    paras: [
      { p: "We get to the tea house at ten twenty, which we thought was early. It isn't. The machine at the door spits out a number — A62 — and the screen says 41 tables ahead of us, which my wife reads out loud in the flat tone of someone delivering bad news she has delivered before.", z: "十点二十到茶楼，我们以为算早。并不。门口的取号机吐出一张 A62，屏幕上写着前面还有 41 桌——我老婆念出来的时候用的是那种报过很多遍坏消息的平腔。" },
      { p: "Forty-one tables.", z: "四十一桌。", w: "Wife" },
      { p: "We could go somewhere else.", z: "要不换一家。", w: "Me" },
      { p: "Everywhere else is the same. It's Saturday.", z: "哪家都一样。今天是周六。", w: "Wife" },
      { p: "She's right, and this is the first rule of weekend Cantonese dining: on a Saturday the queue is not a problem to be solved, it's the weather. You join it and you stand in it, next to a dozen other people who also knew better and came anyway.", z: "她是对的，这是广式周末用餐第一条：周六的队不是待解决的问题，是天气。你加入它、站在里面，旁边是十几个同样明知如此还是来了的人。" },
      { p: "Around us: a family of nine negotiating seating with the intensity of a peace treaty; two aunties who have clearly been doing this together every weekend for thirty years and no longer need to speak; a couple our age taking photos of the menu instead of reading it.", z: "周围：一家九口以和平条约级别的强度在讨论座位；两位明显每周都来、一起喝了三十年、已经不需要说话的阿姨；一对跟我们年纪差不多的情侣在拍菜单而不是看菜单。" },
      { p: "A62, please. Table for two.", z: "A62，两位。", w: "Staff" },
      { p: "Forty minutes. We get a small table by the window, the one everyone walks past, which is the table you get when you arrive at ten twenty and think you're early.", z: "等了四十分钟。拿到靠窗的小桌，就是所有人都要从旁边走过的那张——十点二十到、还以为自己算早的人，拿到的就是这种桌子。" },
      { p: "You order by ticking a paper list now, but the carts still come round, and the auntie with the cart still has the power to make you take something you didn't plan on. We end up with har gow, chicken feet, cheung fun, a plate of greens, and one thing we can't identify that arrived because I nodded at the wrong moment.", z: "现在是在纸单上勾选，但推车还在转，推车的阿姨仍然有能力让你拿下一份你没打算点的东西。最后我们桌上有了虾饺、凤爪、肠粉、一碟青菜，还有一样我们认不出来、因为我点头点错了时机而上桌的东西。" },
      { p: "The tea is chrysanthemum, and it keeps coming. Nobody at this table is in a hurry, and that's the entire point — dim sum on a Saturday is not breakfast, it's the two hours where the week is not allowed to touch you.", z: "茶是菊普，一直有人来续。这桌上没人赶时间，而这正是全部意义——周六的早茶不是早餐，是那两个小时里，这一周不准碰你。" },
      { p: "How's your mother?", z: "你妈最近怎样？", w: "Wife" },
      { p: "Fine. She asked about children again. Third time this month.", z: "挺好的。她又问孩子的事了。这个月第三次。", w: "Me" },
      { p: "Mine asked on Tuesday. They're syncing up.", z: "我妈周二问的。她们对过表了。", w: "Wife" },
      { p: "We're not avoiding the subject so much as we're both waiting for the other one to start it, which is the same thing with better manners. We eat a chicken foot and change the subject, which in a marriage is also a form of agreement.", z: "我们不是回避这个话题，我们是在等对方先开口——本质一样，只是更有礼貌。我们啃了个凤爪，换了话题，在婚姻里这本身也算一种共识。" },
      { p: "Two hours, ninety-two yuan, and one more pot of tea than we needed. We walk out into the light and both say the same thing at the same time: that was worth the queue.", z: "两个小时，九十二块，多喝了一壶本来不必喝的茶。我们走到阳光里，同时说了同一句话：这队排得值。" }
    ],
    notes: [
      { e: "there are 41 tables ahead of us", c: "前面还有 41 桌", x: "There are forty tables ahead of us — it's Saturday." },
      { e: "join the queue", c: "加入排队", x: "You don't solve the queue. You join it." },
      { e: "table for two", c: "两位（用餐）", x: "Table for two, please." },
      { e: "change the subject", c: "换话题", x: "We ate a chicken foot and changed the subject." },
      { e: "worth the queue", c: "这队排得值", x: "Two hours in, and it was worth the queue." }
    ]
  },

  {
    id: "s07", part: "sat", place: "gp-home", time: "20:10",
    t: "A Saturday night in", z: "周六，在家",
    lead: "朋友群里有人在清吧，有人在珠江边跑步。我们在家，煮一锅饭，把窗户全打开。",
    paras: [
      { p: "Saturday night and we're home, which sounds like a failure of planning and is actually the thing we've been looking forward to all week. My phone shows a group chat with nine unread messages: someone at a bar in Zhujiang New Town, someone running along the river, someone sending a photo of a restaurant we can't get into tonight.", z: "周六晚上我们在家，听起来像计划失败，其实是我们盼了一周的事。手机群里九条未读：有人在珠江新城的清吧，有人沿江跑步，有人发了一家我们今晚订不到的餐厅的照片。" },
      { p: "Do you want to go out?", z: "想出去吗？", w: "Me" },
      { p: "Do you?", z: "你呢？", w: "Wife" },
      { p: "There it is again — the same move we do about cooking, applied to the entire city. Two people who both secretly want to stay in, checking that the other one isn't being deprived. Neither of us moves for four seconds. Then she puts her phone down and that's the decision.", z: "又来了——跟做饭那套一模一样的招数，只是对象换成了整座城市。两个人都暗自想待在家，都在确认对方没有因此受委屈。我们僵了四秒。然后她放下手机，这事就定了。" },
      { p: "Tonight we actually cook. Not the weekday version where cooking means reheating something, but the version with three dishes, actual garlic, and a pan that needs soaking afterwards. I chop. She cooks. This division of labour is not written down anywhere and has never once been discussed.", z: "今晚我们真的做饭。不是工作日那种「热一下」的做饭，是三个菜、真的用到蒜、事后锅要泡水的那种。我切，她炒。这个分工没有写下来，也从来没讨论过。" },
      { p: "The window is open and the whole street is audible: a scooter, someone's TV through a wall, a child being told to come inside in Cantonese, and underneath all of it the low hum of a city that is not going to sleep just because it's Saturday.", z: "窗开着，整条街都听得见：一辆电瓶车、隔壁墙里透出来的电视声、一个小孩被用粤语喊回家，在这所有声音底下，是这座城市低频的嗡嗡声——它不会因为是周六就睡。" },
      { p: "We eat at nine, which is late by weekday standards and early by everyone else's. There's a bottle of wine that's been on the shelf since someone gave it to us two years ago, and tonight is the night, because tonight there's no meeting tomorrow and no alarm to respect.", z: "九点吃饭，按工作日标准算晚，按别人算早。架子上有一瓶两年前别人送的酒，今晚就是今晚了——因为今晚之后没有会议、没有要respect的闹钟。" },
      { p: "Afterwards we sit on the floor with our backs against the sofa, which is what you do when you're the only two people in a one-bedroom flat and the sofa is technically fine but the floor is better.", z: "吃完我们背靠沙发坐在地板上——当你俩是这套一居室里仅有的两个人时，你就会这样：沙发其实没毛病，但地板更好。" },
      { p: "My wife is looking at flats on her phone again. Not seriously. Just the way you look at something you're not going to buy but want to know the price of. The numbers in this city are the same every time she checks, and she checks anyway.", z: "我老婆又在手机上看房子。不是认真的，就是那种「不会买但想知道价钱」的看。这座城市的数字每次看都一样，她还是看。" },
      { p: "Don't.", z: "别看了。", w: "Me" },
      { p: "I'm not doing anything. I'm just looking.", z: "我又没干什么，就看看。", w: "Wife" },
      { p: "I know that tone. That's the tone that ends with a spreadsheet.", z: "我认得这个语气。这个语气的结局是一张 Excel。", w: "Me" },
      { p: "She laughs and turns the phone over. The flat is rented, the lease runs to March, and neither of us knows what we'll do then. But right now the window is open, the dishes are soaking, and there is nobody in the world I would rather be not-deciding this with.", z: "她笑着把手机翻过去。房子是租的，租约到三月，我们谁也不知道到时候怎么办。但此刻窗开着，锅在泡，这个世界上没有第二个我更愿意跟ta一起「还没决定」的人。" }
    ],
    notes: [
      { e: "stay in", c: "待在家（不出去）", x: "We're staying in tonight — nothing on." },
      { e: "go out", c: "出去玩 / 下馆子", x: "Do you want to go out? — Do you?" },
      { e: "I'm just looking", c: "我就看看（不买）", x: "I'm not buying anything. I'm just looking." },
      { e: "the lease runs to ...", c: "租约到……", x: "The flat is rented — the lease runs to March." },
      { e: "not seriously", c: "不是认真的", x: "She's looking at flats again, not seriously." }
    ]
  },

  {
    id: "s08", part: "sun", place: "gp-home", time: "17:40",
    t: "The Sunday feeling", z: "周日傍晚的那种感觉",
    lead: "周日下午五点，快乐里开始掺东西。不是难过，是下周开始往回渗。",
    paras: [
      { p: "It arrives around five on a Sunday, and it isn't sadness exactly. It's the week starting to seep back in. One minute you're fine, the next minute you're mentally in Monday's nine o'clock meeting, and the afternoon you were enjoying is suddenly something you're losing.", z: "它大概在周日五点左右到达，严格说不是难过。是这一周开始往回渗。上一分钟你还好好的，下一分钟你人已经在周一九点的会议里了，而你正享受着的这个下午，忽然变成了你正在失去的东西。" },
      { p: "There's a name for it in English — the Sunday scaries — and naming it doesn't fix it, but it does mean that when I say I've got the Sunday scaries, my wife knows precisely what I mean and doesn't ask if I'm all right.", z: "英语里有个名字：Sunday scaries。给它命名治不好它，但好处是，当我说我 Sunday scaries 了，我老婆精确地知道我在说什么，不会问我「你还好吗」。" },
      { p: "I deal with it the way a lot of people deal with it: by doing chores I don't need to do yet. I start the laundry at six on a Sunday, which is the least efficient possible time, because folding something feels like being in control of something.", z: "我跟大多数人一样应对它：提前做那些还不必做的家务。周日六点我开始洗衣服，这是一周里效率最低的时间点，因为叠东西这件事，让人感觉自己在掌控某件事。" },
      { p: "In Guangzhou the laundry has a season of its own. There are weeks — usually March — when the air itself is wet, the walls sweat, the mirror fogs, and nothing you hang up ever actually dries. We call it the return of the south wind. The clothes don't care what we call it.", z: "在广州，晾衣服有自己的季节。有些周——通常是三月——空气本身是湿的，墙在出汗，镜子起雾，你晾上去的东西永远不会真的干。我们叫它回南天。衣服不在乎我们怎么叫它。" },
      { p: "Is it dry?", z: "干了吗？", w: "Wife" },
      { p: "It's optimistic.", z: "还很乐观。", w: "Me" },
      { p: "While the machine runs, I do the thing that actually helps: I open my calendar and look at Monday. Not to work — just to see it. The scaries are always worse than the week. Seeing it written down, with the gaps visible, usually takes it down from a nine to a four.", z: "洗衣机转着的时候，我做那件真正有用的事：打开日历看一眼周一。不是工作，就是看看。那种慌永远比那一周本身严重。看到它写在那里、中间还有空隙，通常能把九分降到四分。" },
      { p: "My phone buzzes. My mother, as she does most Sundays.", z: "手机震了。我妈，跟大多数周日一样。" },
      { p: "Eat properly. Don't just order takeaway every night.", z: "好好吃饭，别天天点外卖。", w: "Mum" },
      { p: "We cook.", z: "我们有做饭。", w: "Me" },
      { p: "Last night you ordered takeaway.", z: "昨晚你们就点了外卖。", w: "Mum" },
      { p: "I don't ask how she knows. Mothers have a second, undocumented source of intelligence about their children's dinner, and it is not worth investigating.", z: "我没问她怎么知道的。母亲们关于孩子晚饭有一个未公开的第二个情报来源，不值得追查。" },
      { p: "By eight the flat is clean-ish, the laundry is on the rack doing its best, and I've made lunch for tomorrow — leftovers, in a container, in the fridge, which is the single highest-leverage thing you can do on a Sunday night.", z: "到八点，房子算收拾过了，衣服在架子上尽力晾着，明天的午饭做好了——剩菜，装盒，进冰箱。这是周日晚上你能做的杠杆最高的一件事。" },
      { p: "We're in bed by eleven, which is late for a school night and early for anything else. Tomorrow is Monday. I've looked at it, it's fine, and I say so out loud, which is how you make something true at five o'clock on a Sunday.", z: "十一点上床，按上学日算晚，按别的算早。明天周一。我看过了，没事，我把这句话说出口——在周日五点，让一件事成真的方式就是把它说出来。" }
    ],
    notes: [
      { e: "the Sunday scaries", c: "周日傍晚的焦虑感", x: "I've got the Sunday scaries again." },
      { e: "seep back in", c: "慢慢渗回来", x: "Around five, the week starts to seep back in." },
      { e: "do the laundry", c: "洗衣服", x: "I deal with it by doing the laundry at six on a Sunday." },
      { e: "leftovers", c: "剩菜", x: "I've made lunch for tomorrow — leftovers in a container." },
      { e: "a school night", c: "第二天要上班的晚上", x: "Eleven is late for a school night." }
    ]
  },

  {
    id: "s09", part: "midautumn", place: "gp-office", time: "八月十五",
    t: "The mooncake economy", z: "月饼经济学",
    lead: "中秋前十天，办公室开始出现一个现象：没人买月饼，但每个人都有月饼。",
    paras: [
      { p: "Ten days before Mid-Autumn, a strange thing happens at work: nobody buys mooncakes, and everybody has mooncakes. They arrive in boxes the size of a laptop, from vendors, from clients, from the building management, from a bank I once opened an account with in 2019 and have not thought about since.", z: "中秋前十天，办公室会出现一个怪现象：没人买月饼，但每个人都有月饼。它们装在笔记本电脑那么大的盒子里，来自供应商、客户、物业，还有一家我 2019 年开过户、之后再没想起来的银行。" },
      { p: "Take one. We've got about forty.", z: "拿一盒，我们还有差不多四十盒。", w: "Nina" },
      { p: "Nobody wants the lotus seed ones.", z: "没人要莲蓉的。", w: "Me" },
      { p: "Nobody has ever wanted the lotus seed ones.", z: "从来没有人要过莲蓉的。", w: "Nina" },
      { p: "This is the mooncake economy: a gift that circulates. You give what you received, to someone who received something else, and by the end of the week everybody has had the same four boxes pass through their hands in different orders. It is not food any more. It is a token that says we remembered you existed.", z: "这就是月饼经济：一份在流通的礼物。你把收到的送给别人，别人再把收到的送出去，到周末，每个人都经手过同样的四盒月饼，只是顺序不同。它已经不是食物了，它是一个token，意思是「我们记得你还存在」。" },
      { p: "The actual festival, we spend with my wife's parents this year, which was decided in August and is, as always, the result of a negotiation conducted entirely in hints.", z: "节本身，今年去我老婆父母家过。这件事八月就定了，而且一如既往，是一场完全靠暗示完成的谈判的产物。" },
      { p: "Your mother already bought the tickets last week, didn't she.", z: "你妈上周就把票买好了吧。", w: "Me" },
      { p: "She mentioned it.", z: "她提了一句。", w: "Wife" },
      { p: "She mentioned it in a way that involved a date and a train number. That's not mentioning, that's booking.", z: "她提的时候带了日期和车次。那不叫提，那叫订。", w: "Me" },
      { p: "We take the train on the Sunday before. Her mother cooks too much food, as mothers do, and her father asks me about work in the way that means he's proud but doesn't know how to say it, so he says has the company treated you well instead.", z: "我们前一个周日坐车过去。她妈做了一桌子菜，像所有妈妈那样；她爸问我工作的事，方式是那种——他其实是骄傲的，但不知道怎么说，于是说「公司待你还好吧」。" },
      { p: "After dinner we go up to the roof. The moon is out, doing its job, and for a few minutes nobody says anything, which is the best part of the festival and the part nobody photographs.", z: "晚饭后我们上楼顶。月亮出来了，尽职尽责，有几分钟大家都不说话——这是这个节最好的部分，也是没人拍下来的部分。" },
      { p: "On the way back we video-call my parents, hold the phone up so they can see the moon, and hold it at roughly the same angle they'd see it from their balcony two hundred kilometres away. It's the same moon. Everyone knows it's the same moon. We do it anyway, every year, and it works every year.", z: "回程路上我们跟我爸妈视频，把手机举起来让他们看月亮，角度大致是他们从两百公里外自家阳台看到的样子。是同一个月亮。谁都知道是同一个月亮。我们还是每年都这么做，而且每年都管用。" }
    ],
    notes: [
      { e: "take one", c: "拿一个（别客气）", x: "Take one — we've got about forty." },
      { e: "it's the thought that counts", c: "心意到了就行", x: "The mooncake is terrible, but it's the thought that counts." },
      { e: "we're spending it with ...", c: "我们跟……一起过", x: "We're spending Mid-Autumn with her parents this year." },
      { e: "she mentioned it", c: "她提了一句（轻描淡写）", x: "She mentioned it — with a date and a train number." },
      { e: "video-call", c: "视频通话", x: "We video-call my parents and hold up the phone so they can see the moon." }
    ]
  },

  {
    id: "s10", part: "national", time: "10/2",
    t: "Four hours for ninety kilometres", z: "九十公里开了四个小时",
    lead: "国庆第二天，我们开车去汕头。导航说两小时四十分钟。导航是个乐观的人。",
    paras: [
      { p: "We leave at eight in the morning on 2 October, heading for Shantou. The map app says two hours forty. The map app is an optimist, and it is working from data about a road that does not exist on 2 October.", z: "十月二号早上八点出发去汕头。导航说两小时四十。导航是个乐观主义者，它依据的是一条十月二号并不存在的路的数据。" },
      { p: "By nine thirty we have moved forty kilometres. By ten we have moved three. The car in front has a window down and somebody's arm out, and the whole motorway is doing that thing where everyone is moving at walking pace and nobody has turned their engine off.", z: "九点半走了四十公里，到十点走了三公里。前面那辆车窗摇下来了，有只手伸在外面，整条高速都在做同一件事：所有人以步行的速度前进，没人熄火。" },
      { p: "We should have taken the train.", z: "我们应该坐高铁的。", w: "Wife" },
      { p: "The tickets went in eleven seconds.", z: "票十一秒就没了。", w: "Me" },
      { p: "That's not a complaint, it's just a fact about this country in October: sixty million people have the same seven days off, and a large number of them had the same idea about where to spend them. You don't beat that. You join it, or you stay home.", z: "这不是抱怨，只是这个国家十月的一个事实：六千万人同时放这七天假，其中很多人想到了同一个地方。你斗不过这件事。你只能加入它，或者待在家里。" },
      { p: "We stop at a service area that has been designed for four hundred people and is currently hosting four thousand. The queue for the toilets goes out the door and turns left. I buy two bottles of water and a thing on a stick that I regret immediately and finish anyway.", z: "我们在一个设计容纳四百人、此刻塞了四千人的服务区停了一下。厕所的队排到门外还拐了个弯。我买了两瓶水和一根签子上的东西，立刻后悔，还是吃完了。" },
      { p: "The ninety kilometres take four hours. When we finally arrive it's one in the afternoon, and Shantou is, I should say, completely worth it — beef hotpot the size of a small swimming pool, streets that smell like broth and toasted sugar, and a beach we have entirely to ourselves on day three, because everyone else went home on day two.", z: "九十公里开了四个小时。到的时候下午一点。我得说，汕头是完全值得的——有小游泳池那么大的牛肉火锅，闻着像高汤和焦糖的街，还有第三天几乎被我们包场的一片海滩，因为别人都在第二天回去了。" },
      { p: "On the way back we take the train. That sentence is the entire lesson of the trip, and I will forget it by next October.", z: "回程我们坐高铁。这句话就是这趟旅程的全部教训，而明年十月我会忘掉它。" }
    ],
    notes: [
      { e: "the map app says ...", c: "导航说……", x: "The map app says two hours forty." },
      { e: "walking pace", c: "步行的速度（堵车）", x: "Everyone is moving at walking pace and nobody has turned the engine off." },
      { e: "a service area", c: "高速服务区", x: "We stopped at a service area built for four hundred people." },
      { e: "the queue goes out the door", c: "队伍排到门外", x: "The queue goes out the door and turns left." },
      { e: "it's worth it", c: "值了", x: "Four hours for ninety kilometres, and it was worth it." }
    ]
  },

  {
    id: "s11", part: "spring", place: "gp-station", time: "除夕",
    t: "Getting home for New Year", z: "过年回家",
    lead: "抢票这件事每年一次，每年都像第一次：你准备好了，然后它开始了，然后它结束了。",
    paras: [
      { p: "Ticket sales open at ten in the morning on a Thursday. I have the app open at nine fifty-eight, two devices, and my wife on the phone doing the same thing from her office, because we have learned that the only thing that helps is redundancy.", z: "周四上午十点开售。我九点五十八打开 App，两台设备，我老婆在办公室同步操作，因为我们早就学到：唯一有用的办法是冗余。" },
      { p: "Got anything?", z: "抢到了吗？", w: "Wife" },
      { p: "It's spinning.", z: "在转圈。", w: "Me" },
      { p: "Mine's spinning too. Refresh?", z: "我的也在转。刷新？", w: "Wife" },
      { p: "Don't refresh.", z: "别刷新。", w: "Me" },
      { p: "Every year at ten o'clock on this Thursday, several hundred million people make the same journey home, and the ticketing system does its best, which is genuinely impressive and also not enough. We get two seats on the four p.m. train on the twenty-eighth. Not our first choice, not our second. Home.", z: "每年这个周四的十点，几亿人要做同一段回家的路，票务系统尽力了——确实了不起，但不够。我们抢到二十八号下午四点那趟的两个座。不是首选，也不是次选。但回家。" },
      { p: "Before we go, there is the flower market. Guangzhou does this properly: for the week before Spring Festival the city builds whole streets of flowers, and everybody walks through them buying things they don't need and will throw away in ten days. Kumquats for luck, peach blossom for luck, a narcissus bulb in a shallow bowl for luck.", z: "走之前有花市。广州把这件事做得很认真：春节前一周，整座城市会搭出一整条条花街，所有人都从里面穿过去，买一堆自己不需要、十天后扔掉的东西。金桔为了吉利，桃花为了吉利，浅盆里的一颗水仙也为了吉利。" },
      { p: "Do we need two kumquat trees?", z: "我们需要两棵金桔吗？", w: "Me" },
      { p: "It's not about need.", z: "这不是需不需要的问题。", w: "Wife" },
      { p: "That line settles every argument at the flower market, every year, and I walk home with a tree under each arm.", z: "这句话每年都能终结花市里所有的争论，然后我两只胳膊各夹一棵树走回家。" },
      { p: "At my parents' house the questions come in the order they always do: how's work, when are you eating, are you eating enough, and then — usually on day two, usually when my mother and I are alone in the kitchen — the one that isn't really a question.", z: "在我爸妈家，问题按固定顺序来：工作怎样，什么时候吃饭，吃够了没有，然后——通常是第二天，通常是我妈跟我单独在厨房时——那个其实不是问题的问题。" },
      { p: "You're not getting any younger.", z: "你们也不小了。", w: "Mum" },
      { p: "I know.", z: "我知道。", w: "Me" },
      { p: "I'm just saying.", z: "我就说说。", w: "Mum" },
      { p: "We've agreed, my wife and I, not to make it a fight. It isn't a fight. It's a season. Every year my mother says it once, every year I say I know, and every year we both move on to whether there's enough rice. That's how families work: the big things get handled in small sentences.", z: "我和老婆说好了不为这事吵。这也不是吵架，这是一个季节。每年我妈说一次，每年我说我知道，每年我们接着聊饭够不够。家庭就是这么运转的：大事用很小的句子处理掉。" },
      { p: "Back on the train on the fifth, two seats, four hours, one bag of oranges my mother put in at the last minute and which we will find at the bottom of the bag in March.", z: "初五回程的火车上，两个座，四小时，还有一袋我妈最后一刻塞进来的橘子——我们会在三月从包底翻出它。" }
    ],
    notes: [
      { e: "ticket sales open at ...", c: "开售时间是……", x: "Ticket sales open at ten on Thursday." },
      { e: "make the journey home", c: "踏上回家的路", x: "Millions of people make the same journey home." },
      { e: "the flower market", c: "（迎春）花市", x: "Before we go, there's the flower market — the whole street is flowers." },
      { e: "it's not about need", c: "这不是需不需要的问题", x: "Do we need two kumquat trees? — It's not about need." },
      { e: "I'm just saying", c: "我就说说（不逼你）", x: "I'm not pushing. I'm just saying." }
    ]
  },

  {
    id: "s12", part: "labour", place: "gp-home", time: "5/1",
    t: "Five days off, one of them real", z: "放五天，其中一天是真的",
    lead: "五一放五天。仔细一看，其中两天是周末，两天是调休补回来的。这事每年都要算一遍。",
    paras: [
      { p: "The notice goes up in April: five days off for Labour Day. Five days. Everyone forwards it to everyone else, and then, about forty minutes later, somebody in the group chat does the maths.", z: "四月贴出通知：五一放五天。五天。所有人转发给所有人，大约四十分钟后，群里有人算了一下。" },
      { p: "Wait. Two of these are the weekend.", z: "等等，其中两天本来就是周末。", w: "Nina" },
      { p: "And the other two we work back. So it's one new day.", z: "另外两天要补班。所以只多了一天。", w: "Me" },
      { p: "That's the holiday shuffle, and it's a very local piece of arithmetic: you move a Saturday and a Sunday around the calendar until they sit next to the actual public holiday, and then you work both of them before or after. You gain a long weekend. You lose a Saturday. Nobody complains, because five days sounds better than one.", z: "这就是调休，一个非常本地的算术：你把周六和周日在日历上挪来挪去，直到它们挨着那个真正的法定假日，然后你在这头或那头把这两天补回来。你得了一个长假，你丢了一个周六。没人抱怨，因为五天听起来比一天好。" },
      { p: "I'm working this Saturday, by the way.", z: "顺便说，这周六我要补班。", w: "Me" },
      { p: "For the holiday.", z: "为了那个假。", w: "Wife" },
      { p: "For the holiday.", z: "为了那个假。", w: "Me" },
      { p: "We say it like a prayer. We're not unhappy about it — the system delivers what it promises, just not in the way the headline suggests, and everyone over thirty has quietly made peace with that.", z: "我们像念祷告一样说这句话。我们并不不满——制度兑现了它承诺的，只是方式跟标题写的不一样，而所有三十岁以上的人都已经悄悄接受了这件事。" },
      { p: "We don't travel. Three days is not enough to go anywhere worth going and long enough to make staying feel like wasting it, so we do the thing that actually works: we stay in the city and go to the places we never go to on weekends.", z: "我们不出远门。三天不够去任何值得去的地方，却长到让「待着」显得像浪费。于是我们做了那件真正有效的事：留在城里，去那些周末永远不会去的地方。" },
      { p: "On the second day we walk through Sham Chun Island in the morning, when it's still quiet, and sit in a tea house where the only other customers are three old men who have been sitting there since before we were born. The city is different when the commuters aren't in it. Same streets, better ratio of people to pigeons.", z: "第二天早上我们走了沙面，那时还很安静，然后在一家茶楼坐下，店里另外只有三个从我们出生前就坐在那里的老人。通勤的人不在城里时，这座城市是另一个样子。街还是那些街，人和鸽子的比例好多了。" },
      { p: "By four in the afternoon everyone else has had the same idea and it's a weekend again. We go home, order in, and watch something with the fan on. A five-day holiday, used properly: two days out, three days of nothing, one of which we'll work back on Saturday.", z: "下午四点，其他所有人也想到了同一件事，又变回周末了。我们回家、点外卖、开着风扇看点东西。五天假期，用得挺正确：两天出门，三天什么也没干，其中一天周六要补回来。" }
    ],
    notes: [
      { e: "five days off", c: "放五天假", x: "Five days off for Labour Day — in theory." },
      { e: "the holiday shuffle", c: "调休", x: "That's the holiday shuffle: you work a Saturday to get a Monday." },
      { e: "work it back", c: "补班 / 补回来", x: "We work both days back before or after." },
      { e: "do the maths", c: "算一笔账", x: "Somebody in the group chat did the maths." },
      { e: "a long weekend", c: "连着周末的小长假", x: "You gain a long weekend and lose a Saturday." }
    ]
  },

  {
    id: "s13", part: "dragon", place: "gp-river", time: "五月初五",
    t: "Dragon boats on the Liede", z: "猎德涌上看龙舟",
    lead: "端午在广州不只是吃粽子。是有那么一天，整条涌边上站满了人，为了看二十几个人划一条船。",
    paras: [
      { p: "Dragon Boat Festival in Guangzhou is not really about the rice dumplings. It's about one day a year when the whole village — and I mean village, because these used to be villages and still think of themselves that way — turns out to watch twenty-two men paddle a boat very fast up a very ordinary stretch of water.", z: "广州的端午其实不是关于粽子。它是一年中的那一天，整个村——我是说村，因为这些地方以前是村、现在心里也还是村——全体出动，去看二十二个人划着一条船在一段极其普通的水面上飞快经过。" },
      { p: "We get to the bank at Liede at ten, and it's already shoulder to shoulder along the water. Grandparents with folding stools who clearly arrived at eight. Kids sitting on the wall with their legs through the railings. Someone's drone, which is not allowed and is nevertheless up there.", z: "十点到猎德涌边，水边已经肩挨着肩。带折叠凳的老人，显然八点就到了；把腿从栏杆缝里伸出去坐在墙上的小孩；还有人放了无人机——规定不许放，但它就在天上。" },
      { p: "When do they start?", z: "什么时候开始？", w: "Wife" },
      { p: "Soon. Nobody knows. That's traditional too.", z: "快了。没人知道具体几点。这也算传统的一部分。", w: "Me" },
      { p: "Then it happens and it is much louder than you expect. There's a drum at the front setting the pace, twenty-two paddles hitting the water on the same beat, and the sound comes off the water and off the buildings on both sides at the same time, so you feel it before you work out where it's coming from.", z: "然后它开始了，比你想的吵得多。船头有鼓在定节奏，二十二支桨以同一拍打进水里，声音同时从水面和两岸的楼上传回来——你先感觉到它，才搞清楚它从哪来。" },
      { p: "Forty seconds. That's the race. Two boats, one length of the creek, forty seconds of noise, and then it's over and everyone starts talking about the next one.", z: "四十秒。比赛就这么长。两条船，一段涌，四十秒的喧闹，然后结束，所有人开始聊下一场。" },
      { p: "People come back year after year for forty seconds. I find this genuinely moving, and also very Cantonese: enormous organisation, decades of tradition, and absolute refusal to explain any of it to anybody.", z: "为了四十秒，人们年年来。我觉得这真的很动人，也很广东：巨大的组织工作量、几十年的传统，以及绝对拒绝向任何人解释这一切。" },
      { p: "Afterwards we eat zongzi at her uncle's place — savoury, with pork and salted egg yolk, which is the correct kind, and I will not be taking questions on this. Her aunt has made about sixty of them and is now giving them away the way ammunition is given away.", z: "之后我们去她舅舅家吃粽子——咸的，有猪肉和咸蛋黄，这是正确的那一派，这个问题不接受提问。她姨妈做了大概六十个，现在正在以分发弹药的方式分发出去。" },
      { p: "Take twenty.", z: "拿二十个。", w: "Aunt" },
      { p: "We can't eat twenty.", z: "我们吃不了二十个。", w: "Me" },
      { p: "Freeze them.", z: "冻起来。", w: "Aunt" },
      { p: "There is no arguing with an auntie holding a bag. I know this. I've known it for eleven years. I take the bag.", z: "跟一个拎着袋子的阿姨是没有道理可讲的。这点我知道，已经知道十一年了。我接过袋子。" },
      { p: "We walk home in the heat with twenty zongzi. Three days of holiday, one morning of noise, forty seconds of actual racing, and enough food to last until the Mid-Autumn boxes start arriving.", z: "我们拎着二十个粽子在热天里走回家。三天假，一上午的喧闹，四十秒真正的比赛，还有足够吃到月饼礼盒又开始出现的食物。" }
    ],
    notes: [
      { e: "shoulder to shoulder", c: "肩并肩（挤满人）", x: "By ten it's shoulder to shoulder along the water." },
      { e: "set the pace", c: "定节奏", x: "There's a drum at the front setting the pace." },
      { e: "year after year", c: "年复一年", x: "People come back year after year for forty seconds." },
      { e: "give away", c: "送人 / 分发出去", x: "She made sixty zongzi and is giving them away." },
      { e: "there's no arguing with ...", c: "跟……是没道理可讲的", x: "There's no arguing with an auntie holding a bag." }
    ]
  },
  {
    id: "s14", part: "sat", place: "gp-tiyu", time: "15:40",
    t: "How do I get to Quzhuang?", z: "你要去区庄？",
    lead: "周六下午在体育西路，一个外国人拿着手机拦住我问路。巧的是我也往那边去——仲裁委在环市东，从区庄走过去十分钟。于是我们同路了三站。",
    paras: [
      { p: "It's a Saturday afternoon and I'm at Tiyu Xilu with a folder of papers under my arm, which is not a normal Saturday. The Guangzhou Arbitration Commission sits on Huanshi East Road and they want a hard copy of something, and in 2026 that is still a thing that happens.", z: "周六下午，我夹着一袋文件站在体育西路——这本身就不正常。广州仲裁委在环市东路，他们要一份纸质材料，这种事在 2026 年依然会发生。" },
      { p: "The transfer corridor is running at about seventy percent of a weekday, which at Tiyu Xilu still means a lot of people. I'm heading for the Line 1 side when a man steps into my path with his phone held out — the universal gesture for I'm lost and you look like someone who knows.", z: "换乘通道里的人大概是工作日的七成，在体育西路这仍然算很多。我正往一号线那边走，一个人横到我面前把手机递过来——全世界通用的「我迷路了，你看起来像知道路的人」的手势。" },
      { p: "Excuse me — do you speak English?", z: "不好意思，你会说英语吗？", w: "Tom" },
      { p: "More than a bit, yeah. Where are you trying to get to?", z: "会一点，还不止一点。你要去哪？", w: "Me" },
      { p: "Quzhuang. The map says change at Yangji, but I've been down here twice and both times I ended up on the wrong platform.", z: "区庄。地图说在杨箕换乘，但我下来两次了，两次都走到了错的站台。", w: "Tom" },
      { p: "You've made the classic Tiyu Xilu mistake. This station is two stations pretending to be one, and most of the signs point at Line 3 because most of the people want Line 3. Don't follow the crowd. Follow the yellow.", z: "你犯了体育西路的经典错误。这个站是两个站假装成一个站，而且大部分指示牌都指向三号线，因为大部分人要坐三号线。别跟着人流走，跟着黄色走。" },
      { p: "Quzhuang is on Line 5. Take Line 1 one stop to Yangji, go down to Line 5, then two stops — Dongwuyuan, then Quzhuang. Twelve minutes on the train, plus five for the walk inside Yangji, because that interchange was designed by somebody who has never carried a suitcase.", z: "区庄在五号线上。坐一号线一站到杨箕，下到五号线，再坐两站——动物园、区庄。车上十二分钟，外加杨箕站内走五分钟，因为那个换乘通道是某个从没拎过行李箱的人设计的。", w: "Me" },
      { p: "I'm going that way as well. Come on — I'll walk you to the platform.", z: "我也往那边去。走吧，我带你到站台。", w: "Me" },
      { p: "Strictly I'm only going as far as Taojin, one stop past his. But directions given once are directions wasted; the only version that works is the one where you walk it. My grandmother taught me that, and she never took a train in her life.", z: "严格说我只到淘金，比他多一站。但指路只说一遍等于白说，唯一有效的版本是陪着走一遍。这是我奶奶教我的，而她一辈子没坐过地铁。" },
      { p: "On the train he tells me his name is Tom, he's from Manchester, he buys lighting for a company that sells it to hotels, and he has been in Guangzhou fourteen months.", z: "车上他说他叫 Tom，曼彻斯特人，替一家把灯具卖给酒店的公司做采购，来广州十四个月了。" },
      { p: "How's your Cantonese?", z: "你粤语怎么样了？", w: "Me" },
      { p: "Three words. Two of them are food. The third one I use on taxis and it means turn left, but I'm not certain it only means turn left.", z: "三个词。两个是吃的。第三个我用来跟出租车说，意思是左转，但我不确定它是不是只有左转的意思。", w: "Tom" },
      { p: "I teach him the one phrase that actually matters down here: m goi, je gwo — excuse me, let me through. He tries it. It comes out like a sneeze. I tell him nobody gets it right the first time, and that saying it badly still works, because people move for the attempt, not the tone.", z: "我教了他一句在这里真正有用的话：唔该，借过。他试着说了一遍，听起来像个喷嚏。我告诉他没人第一次就说对，而且说得难听也照样管用——人是看你肯开口才让的，不是看你音调准不准。" },
      { p: "What's surprised you most?", z: "最让你意外的是什么？", w: "Me" },
      { p: "Delivery. I ordered at twenty to twelve and a man was at my door at eleven minutes past. In Manchester that's a text message saying it's on its way.", z: "外卖。我十一点四十下单，十一点五十一人到门口。在曼彻斯特，那个时间点你收到的只是一条短信：正在配送中。", w: "Tom" },
      { p: "And the thing he likes: dim sum on a Sunday, the banyan trees that make whole streets feel like rooms, and the fact that there is a shop underneath his building that will sell him a single bulb at ten at night. The thing he doesn't like: the humidity in March, when nothing dries.", z: "他喜欢的：周日的早茶、把整条街盖成房间的榕树、还有楼下那家晚上十点还愿意卖他一个灯泡的小店。他不喜欢的：三月的回南天，什么都干不了。" },
      { p: "I bought a dehumidifier. It filled up in two days. Two days! I have lived in England my whole life and I have never seen water behave like this.", z: "我买了台抽湿机。两天就满了。两天！我在英国活了半辈子，从没见过水能这样。", w: "Tom" },
      { p: "Next station, Quzhuang. Doors will open on the left.", z: "下一站，区庄。列车运行方向左侧车门将会打开。", w: "Announcement" },
      { p: "This is you. Exit B, then keep walking — don't turn off at the first junction, everyone does and it's wrong.", z: "你到了。B 出口，然后一直走——第一个路口别拐，所有人都拐，都是错的。", w: "Me" },
      { p: "Thanks. You didn't have to walk me through it.", z: "谢谢。你其实不用陪我走这一趟。", w: "Tom" },
      { p: "It's nothing. Enjoy Quzhuang. It's mostly roadworks and one extremely good brisket noodle shop.", z: "没什么。好好逛区庄吧。那儿基本都在修路，外加一家非常好吃的牛腩粉。", w: "Me" },
      { p: "The doors close and he's gone, and I ride one more stop thinking about how that was seven minutes of English with no business words in it at all — no clause, no liability, no counterparty — and it was easily the most useful English I've used all week.", z: "车门关上，他走了。我又坐了一站，想着刚才那七分钟英语里一个商务词都没有——没有条款、没有责任、没有对方当事人——却是我这周用过的最有用的一段英语。" },
      { p: "We didn't add each other on WeChat. Three stops together is a complete thing. It doesn't have to be the start of one.", z: "我们没加微信。同路三站本身就是一件完整的事，不必非得是另一件事的开始。" }
    ],
    notes: [
      { e: "I'm going that way (as well)", c: "我也顺路", x: "I'm going that way too — I'll walk you to the platform." },
      { e: "change at ... / transfer", c: "在……换乘", x: "Take Line 1 one stop and change at Yangji." },
      { e: "walk someone through something", c: "陪人把某事走一遍 / 给人说清楚", x: "You didn't have to walk me through it." },
      { e: "it's on its way", c: "在路上了 / 正在配送", x: "In Manchester that's a text saying it's on its way." },
      { e: "give someone directions", c: "给某人指路", x: "He asked me for directions at the interchange." },
      { e: "don't follow the crowd", c: "别跟着人流走", x: "Don't follow the crowd — follow the yellow signs." }
    ]
  },
  {
    id: "s15", part: "fri", place: "gp-tiyu", time: "18:50",
    t: "Ten minutes under the awning", z: "在雨棚下站了十分钟",
    lead: "广州夏天的雨不讲道理，也不打招呼。六点四十出闸，体育西路站口站着两百个人，都在等同一件事：雨小一点。",
    paras: [
      { p: "I hear the rain before I see it. Not the rain itself — the rain hitting the metal awning over the exit, which sounds like someone pouring a bag of beans onto a drum.", z: "我先听见雨，才看见雨。不是雨声，是雨砸在出站口那块金属雨棚上的声音，听起来像有人把一袋豆子倒在鼓面上。" },
      { p: "There are maybe two hundred of us under here and none of us are going anywhere. Half are on their phones. The other half are filming the rain to send to somebody, which is what you do when you're stuck: you turn the waiting into content.", z: "雨棚下大概两百人，没人打算动。一半在看手机，另一半在拍雨发给别人——被困住的时候人就会干这个：把等待变成素材。" },
      { p: "A woman next to me is on video with her boyfriend. Don't come and get me, she says. You can't get through either. We'd just be two people in a car instead of two people under a roof.", z: "我旁边一个女生在跟男朋友视频：你别来接我，你也进不来。那样我们只是从「两个人在雨棚下」变成「两个人在车里」。" },
      { p: "The delivery riders go anyway. They always go. Their time is the most expensive thing on this street, and the rain has already been priced in — a wet rider who is late pays twice, so they pull the poncho over the bag first and themselves second.", z: "外卖骑手照样冲进雨里。他们永远冲。在这条街上他们的时间最贵，而且雨早就折算进成本了——一个迟到的湿身骑手要付两次代价，所以他们先把雨衣盖在箱子上，再盖自己。" },
      { p: "An uncle appears with a trolley of umbrellas. Fifteen yuan yesterday, twenty-five now. Nobody argues, because everybody understands the mechanism: the price isn't the umbrella, it's the distance between you and the nearest dry place.", z: "一个阿伯推着一车伞过来。昨天十五，现在二十五。没人还价，因为大家都懂这个机制：你买的不是伞，是你和最近的干燥地点之间的距离。" },
      { p: "My own calculation takes about thirty seconds. The bike is seven minutes. In this rain it's seven minutes of not seeing, plus a wet shirt through a meeting if I had one, plus the specific danger of a white line in the road that has become a slide. A taxi is forty-seven people ahead of me in the queue. Walking is twenty-five minutes home.", z: "我自己的计算用了三十秒。骑车七分钟。这种雨里骑车等于七分钟看不见路，外加一件湿衬衫——如果有会的话——再加路面标线变成滑道的那种具体危险。打车前面排了四十七个人。走路回家二十五分钟。" },
      { p: "So I wait. Everyone waits. This is the part people from dry countries never understand about a Guangzhou summer: waiting out the rain is not a delay, it's the schedule.", z: "于是我等。所有人都等。这是干燥国家的人永远理解不了的广州夏天：等雨停不是延误，等雨停就是日程本身。" },
      { p: "At ten to seven the noise on the awning drops half a level, and two hundred people make the same decision within about four seconds. You can hear it: two hundred phone screens unlocking at once, the little beep of a hundred shared bikes waking up.", z: "六点五十分，雨棚上的声音降了半级，两百个人在大约四秒内做了同一个决定。你能听见：两百块手机屏幕同时解锁，一百辆共享单车同时被唤醒的那声嘀。" },
      { p: "I get the fourth bike again. Some things are consistent.", z: "我又选了第四辆车。有些事是稳定的。" },
      { p: "I ride home slowly, and I am soaked anyway — not from the rain, mostly from the spray off the road and the water that comes up through the sole of the shoe. By the time I'm at our door my socks are a separate weather system.", z: "我慢慢骑回去，结果还是湿透了——主要不是雨，是路面溅起来的水和从鞋底渗进来的水。到家门口时，我的袜子已经自成一套天气系统。" },
      { p: "You said it wasn't going to rain.", z: "你说过不会下雨的。", w: "Wife" },
      { p: "I know. I'm aware of the record.", z: "我知道。我有在记账。", w: "Me" }
    ],
    notes: [
      { e: "wait out the rain", c: "等雨停 / 躲雨", x: "Waiting out the rain isn't a delay, it's the schedule." },
      { e: "the rain eased off", c: "雨小了", x: "At ten to seven the rain eased off and everyone moved." },
      { e: "soaked (through)", c: "湿透了", x: "I rode slowly and was soaked anyway." },
      { e: "be priced in", c: "已经被算进去了", x: "For riders the rain is already priced in." },
      { e: "I'm aware of the record", c: "我有在记账（我知道自己说过什么）", x: "You said it wasn't going to rain. — I know. I'm aware of the record." }
    ]
  },
  {
    id: "s16", part: "sun", place: "gp-station", time: "16:20",
    t: "Picking someone up at Guangzhou Station", z: "在广州火车站接人",
    lead: "表弟第一次来广州。我让他别出站，站在出站口左边第三根柱子下面别动——在广州火车站接过人的人都懂，谁动谁就永远找不到对方。",
    paras: [
      { p: "Guangzhou Station is always like this and always has been: the rolling of a hundred suitcase wheels, a man holding a sign that says Mr. Chen, a woman asking nobody in particular if we need a room, and three different people offering Dongguan, Shenzhen, Foshan.", z: "广州火车站永远是这样，一直都是：一百个拉杆箱轮子的滚动声、一个举着「陈总」牌子的男人、一个对着空气问我们要不要住宿的女人，还有三个人分别喊着东莞、深圳、佛山。" },
      { p: "I stand at the third pillar on the left of the exit, which is the arrangement every Guangzhou person has with their visiting relatives. Don't move, I tell him. If you move, we will spend forty minutes doing this.", z: "我站在出站口左边第三根柱子旁——每个广州人和来探亲的亲戚都是这么约定的。别动，我告诉他。你一动，我们就得花四十分钟来演这一出。" },
      { p: "The board says his train is twelve minutes late, which for a K-train is basically on time. Next to me a mother is holding an A4 sheet with a name printed on it, and a driver is holding a phone with a name on the screen. Two systems, same purpose.", z: "屏幕上显示他的车晚点十二分钟，对 K 字头来说这基本等于准点。我旁边一个妈妈举着一张印着名字的 A4 纸，一个司机举着一部亮着名字的手机。两套系统，同一个目的。" },
      { p: "He comes out with a backpack and the face of someone who expected a station and got a city. This is big, he says. I know, I say. It's the oldest one. The newer ones are bigger and further away.", z: "他背着包出来，脸上是那种「以为是车站、结果是座城市」的表情。好大啊，他说。我知道，我说。这是最老的一个。新的更大，也更远。" },
      { p: "How do we get to your place?", z: "怎么去你那儿？", w: "Cousin" },
      { p: "Metro. Line 2, then change to Line 1. Forty minutes, door to door.", z: "地铁。二号线换一号线。四十分钟，门到门。", w: "Me" },
      { p: "Can't we just get a taxi?", z: "不能打车吗？", w: "Cousin" },
      { p: "We can. The queue is about twenty minutes and then we sit on the road for another thirty. The metro is bored, predictable and moving. In this city the word metro solves about eighty percent of going anywhere; shared bikes do most of the other twenty.", z: "可以。排队二十分钟，然后再在路上坐三十分钟。地铁无聊、可预期、而且在动。这座城市里「地铁」两个字能解决大约八成的出行，剩下两成大部分靠共享单车。", w: "Me" },
      { p: "An auntie asks him if he wants a room. I say no thank you for him. He asks what she said, I tell him, and he looks faintly disappointed, as if he'd expected something more dramatic from his first ten minutes in Guangzhou.", z: "一个阿姨问他要不要住宿。我替他说了不用了谢谢。他问她说的是什么，我翻译了，他有点失望，好像以为来广州的头十分钟应该发生点更戏剧性的事。" },
      { p: "We buy water outside the station and I watch him look at the price. Inside it's three yuan. Outside, same bottle, five. He says nothing. I say nothing. This is also part of the tour.", z: "我们在站外买水，我看着他看价格的样子。站里三块，站外同样一瓶五块。他没说话，我也没说话。这也是行程的一部分。" },
      { p: "On the train he watches the windows go from concrete to trees and says the thing everyone says the first time: there are so many trees. It's my favourite thing about this city too — the banyans that close over a street until the street is a room with a roof.", z: "在车上他看着窗外从水泥变成树，说出了每个第一次来的人都会说的那句：树好多。这也是我最喜欢这座城市的地方——榕树把一条街盖起来，盖到那条街变成一个有屋顶的房间。" },
      { p: "Are the trees here all year?", z: "这些树一年四季都在吗？", w: "Cousin" },
      { p: "All year. That's the trick. Nothing in this city ever admits what month it is.", z: "一年四季都在。这就是它的本事。这座城市从来不承认现在是几月。", w: "Me" }
    ],
    notes: [
      { e: "pick someone up", c: "接人", x: "I'm picking up my cousin at Guangzhou Station." },
      { e: "the train is running late", c: "火车晚点", x: "His train is twelve minutes late." },
      { e: "door to door", c: "门到门（全程）", x: "Forty minutes, door to door." },
      { e: "stand still and I'll find you", c: "你站着别动，我去找你", x: "Don't move — stand still and I'll find you." },
      { e: "no thank you (for him)", c: "替他回绝", x: "I said no thank you for him." }
    ]
  },
  {
    id: "s17", part: "spring", place: "gp-station", time: "腊月廿八",
    t: "You're at the wrong station", z: "你跑错站了",
    lead: "朋友从武汉来广州转车，票上写的是广州南站，人却站在广州火车站门口给我打电话。这是这座城市给外地人的第一课。",
    paras: [
      { p: "I'm at the station, he says. Where are you?", z: "我到车站了，他说。你在哪？", w: "Friend" },
      { p: "I'm at the station too. The problem is that your train isn't.", z: "我也在车站。问题是你那趟车不在。", w: "Me" },
      { p: "There are four places in this city that call themselves Guangzhou on a ticket: Guangzhou, Guangzhou East, Guangzhou South, Guangzhou North. The fast trains to Wuhan leave from the south one, which is twenty-five minutes away by metro and roughly forty by road on a good day, and today is not a good day.", z: "这座城市有四个在票面上都叫「广州」的地方：广州站、广州东站、广州南站、广州北站。去武汉的高铁从南站走，坐地铁过去二十五分钟，路况好的时候开车大概四十分钟，而今天路况不好。" },
      { p: "I find him by the pillar with a suitcase and the particular expression of a man who has been betrayed by a noun. It says Guangzhou, he says. It does, I say. That's the whole trick. It says Guangzhou the way a menu says soup.", z: "我在柱子旁边找到他，他拎着箱子，脸上有一种「被一个名词背叛了」的表情。票上写的是广州啊，他说。是的，我说。整套把戏就在这里。它写着「广州」的方式，跟菜单上写着「汤」是一回事。" },
      { p: "How much time have I got?", z: "我还剩多少时间？", w: "Friend" },
      { p: "Fifty-eight minutes. Enough, but not enough to be calm about it. Come on — Line 2 goes there directly, no changes.", z: "五十八分钟。够，但不够从容。走吧——二号线直达，不用换乘。", w: "Me" },
      { p: "This is the one thing about Guangzhou Station that I actually like: Line 2 runs straight from here to the south station, no changing, no thinking. Twenty-five minutes of sitting down, which is twenty-five minutes he can stop being frightened.", z: "这是广州火车站唯一一件我真心喜欢的事：二号线从这儿直达南站，不用换乘，不用思考。坐着二十五分钟，这二十五分钟他可以不用再慌。" },
      { p: "Is it far from the metro to the platform?", z: "地铁到站台远吗？", w: "Friend" },
      { p: "Ten minutes on foot once you're inside, and the place is the size of an airport terminal. You'll run. Everyone runs. Running inside Guangzhou South is not embarrassing, it's the local custom.", z: "进去之后还要走十分钟，那地方有一个航站楼那么大。你会跑的，所有人都跑。在广州南站里跑步不丢人，那是本地风俗。", w: "Me" },
      { p: "At the south station he goes, and I get back on Line 2 alone. The carriage is full of people carrying new-year things: boxes of biscuits, two bottles of something, a bag of mandarins, a plastic bag containing a whole frozen chicken that has started to give up.", z: "在南站他跑进去了，我一个人又坐上二号线。车厢里全是拎着年货的人：饼干礼盒、两瓶什么酒、一袋橘子，还有一只装在塑料袋里、已经开始放弃的冻鸡。" },
      { p: "He messages at the platform: made it. Two words and a photo of a departure board. That's the whole thank-you, and it's plenty.", z: "他在站台发来消息：到了。两个字加一张车次显示屏的照片。这就是全部的感谢，而且足够了。" },
      { p: "I ride back thinking about how a city's friendliness isn't measured by its skyline. It's measured by what happens in the ten minutes when somebody is standing in the wrong place with a suitcase and no idea.", z: "回去的路上我在想，一座城市是否友好，不是看天际线。是看那十分钟里会发生什么——有人拎着箱子站在错的地方，一无所知的那十分钟。" }
    ],
    notes: [
      { e: "you're at the wrong station", c: "你跑错站了", x: "The problem is that your train isn't here — you're at the wrong station." },
      { e: "no changes / direct", c: "不用换乘 / 直达", x: "Line 2 goes there directly, no changes." },
      { e: "cut it fine", c: "时间卡得很紧", x: "Fifty-eight minutes — enough, but we're cutting it fine." },
      { e: "make it (in time)", c: "赶上了", x: "He made it, with four minutes to spare." },
      { e: "give up (on something)", c: "撑不住了 / 放弃了", x: "A frozen chicken that has started to give up." }
    ]
  },
  {
    id: "s18", part: "sat", place: "gp-yuexiu", time: "8:30",
    t: "Five goats and a man with a loudspeaker", z: "五羊和那个拿喇叭的人",
    lead: "周六早上八点半的越秀公园不属于游客，属于晨练的人。我们本来是来看五羊石像的，结果整个公园的日常先把我们接管了。",
    paras: [
      { p: "We get to Yuexiu Park at half past eight, which is the hour that belongs to nobody visiting. The tourists haven't arrived and the morning people have already finished their first round. The air under the trees smells filtered, which is the only way I can describe it — like the park has done something to it on the way in.", z: "我们八点半到越秀公园，这是一个不属于任何游客的时段。游客还没来，晨练的人已经练完第一轮。树下的空气闻起来像被过滤过——我只能这样描述，好像公园在空气进来的路上对它做了点什么。" },
      { p: "Within two minutes of the gate there is a man with a loudspeaker singing, a group doing tai chi at a speed that suggests they have been doing it together for a decade, and an old man writing characters on the pavement with a brush the size of a broom and a bottle of water. Water calligraphy. It dries in ten minutes and he does it again.", z: "进门不到两分钟：一个拿喇叭的人在唱歌，一伙人打太极的速度说明他们已经一起打了十年，还有一个老人拿着扫帚那么大的毛笔和一瓶水在地上写字。地书。十分钟就干，然后他再写一遍。" },
      { p: "My wife says what she says every time: people here don't visit a park, they use one. It's not a place you look at. It's a room with a roof made of trees, and everybody has brought something to do in it.", z: "我老婆说了她每次都会说的那句：这儿的人不是「逛」公园，是「用」公园。这不是用来看的地方，是一个树做的屋顶盖着的房间，每个人都带了点事来里面干。" },
      { p: "At the Five Goats statue there is, as always, a queue of people being photographed, and a tour group with a little flag. A man in his forties hands me his phone and asks in careful English if I wouldn't mind.", z: "五羊石像前照例排着一队等着拍照的人，还有一个举小旗的旅行团。一个四十来岁的男人把手机递给我，用很谨慎的英语问我方不方便。" },
      { p: "Of course. One, two, three — say qiezi.", z: "当然。一、二、三——茄子。", w: "Me" },
      { p: "Cheese?", z: "说 cheese？", w: "Him" },
      { p: "We say the word for aubergine. Nobody in China says cheese. We've been saying the name of a vegetable for forty years and nobody has ever thought to question it.", z: "我们说的是「茄子」。中国没人说 cheese。我们把一种蔬菜的名字喊了四十年，从来没人觉得应该质疑一下。", w: "Me" },
      { p: "He laughs, takes the phone back, and asks the question I have been waiting for, because it's the only interesting thing about this statue.", z: "他笑了，拿回手机，然后问了那个我一直在等的问题——这是这座石像唯一有意思的地方。" },
      { p: "Why five goats? Is there a story, or is it just five goats?", z: "为什么是五只羊？是有故事，还是就是五只羊？", w: "Him" },
      { p: "There's a story. Five immortals came down on five goats and brought rice with them, and that's why the city is called the City of Goats. Nobody finds this strange. My firm is on a road called Ring Road East and our logo has a ram on it, and none of us have ever asked why.", z: "有故事。五位仙人骑着五只羊下来，带来了稻穗，所以这座城市叫羊城。没人觉得这有什么奇怪。我公司在环市东路，我们的 logo 上有只羊，而我们从没问过为什么。", w: "Me" },
      { p: "And is it true?", z: "那是真的吗？", w: "Him" },
      { p: "Allegedly. Which, speaking as a lawyer, is my favourite category of story: the kind nobody can verify and everybody repeats.", z: "据说是。作为律师，这是我最喜欢的一类故事：没人能证实，但所有人都在讲。", w: "Me" },
      { p: "We walk up past the old city wall and the Zhenhai Tower, and my wife points at a kapok tree that isn't flowering yet and tells me the exact month it will. She knows this about four trees in this city and I have never once remembered which.", z: "我们往上走过古城墙和镇海楼，我老婆指着一棵还没开的木棉树，告诉我会开在哪个月。这座城市里有四棵树她知道得这么清楚，而我一次也没记住是哪四棵。" },
      { p: "We come out of the north gate at ten and eat rice noodle rolls at a place that has been there longer than the queue outside it. She says we should bring my mother next time. I say yes. We both know we'll be back in August, when it's too hot for this and we won't.", z: "十点从北门出来，在一家比它门口的队更老的店吃了肠粉。她说下次带我妈来。我说好。我们都知道下一次是八月，那时候太热，来不了。" }
    ],
    notes: [
      { e: "would you mind (doing something)", c: "你介意……吗", x: "He asked if I wouldn't mind taking the photo." },
      { e: "allegedly", c: "据说是", x: "Allegedly — the kind of story nobody can verify." },
      { e: "say cheese / say qiezi", c: "拍照喊「茄子」", x: "One, two, three — say qiezi." },
      { e: "be made of", c: "由……做成", x: "A room with a roof made of trees." },
      { e: "point at / point out", c: "指着 / 指出来", x: "She pointed at a kapok tree and told me the month it flowers." }
    ]
  },
  {
    id: "s19", part: "sun", place: "gp-baiyun", time: "6:40",
    t: "Up Baiyun Mountain before the heat", z: "趁还没热，上白云山",
    lead: "周日六点四十出门。在广州爬白云山有一条硬规则：十点之后上山，那是另一种活动，而且不是给游客准备的那种。",
    paras: [
      { p: "We meet at the gate at twenty to seven: my wife, my colleague Nina, and Nina's boyfriend, who has agreed to this in the way people agree to things on a Saturday night.", z: "六点四十在山门口集合：我老婆、同事 Nina，还有 Nina 的男朋友——他答应这件事的方式，就是人们在周六晚上答应事情的那种方式。" },
      { p: "Are we walking up or taking the shuttle bus?", z: "我们爬上去还是坐电瓶车？", w: "Nina" },
      { p: "I'd like to say walk up and take the bus down. This has been my position on every mountain for ten years, and I see no reason to change it now.", z: "我想说的是爬上去、坐车下来。这个立场我保持了十年，没理由现在改。", w: "Me" },
      { p: "We're here to climb. That's the verb.", z: "我们是来爬的。爬是个动词。", w: "Nina" },
      { p: "Halfway up, Nina has stopped being a person who says things like that's the verb. The steps are the enemy, not the slope: it's the fact that they never stop being steps. My wife counts them out loud for a while and then stops, which I take as a serious medical signal.", z: "爬到一半，Nina 已经不再是那种会说「爬是个动词」的人了。敌人不是坡度，是台阶——它们永远都是台阶这件事本身。我老婆念了一段时间的台阶数，然后不念了，我认为这是个严重的医学信号。" },
      { p: "An uncle coming down tells us it's twenty minutes more. Every uncle on every mountain in Guangdong says twenty minutes, and it always means forty. I have never understood why they do this. I think it's kindness with the numbers changed.", z: "一个下山的大爷跟我们说还有二十分钟。广东每座山上的每个大爷都说二十分钟，而它永远意味着四十分钟。我一直不明白为什么。我觉得这是把数字改过了的善意。" },
      { p: "At the top we buy douhua and soy milk from a stall that has clearly been carrying things up this mountain for a very long time. Ten yuan for a bowl of bean curd that costs four down there, and not one of us mentions it, because we all know what the carrying costs.", z: "山顶我们在一家小摊买了豆腐花和豆浆——那家摊子显然已经往这座山上搬了很久的东西。一碗山下四块的豆腐花卖十块，我们谁都没提，因为大家都知道搬上来要多少成本。" },
      { p: "The view from the platform is grey. Not fog exactly — Guangzhou visibility. You can't see the city, but you can see that it's there, which on a clear morning is apparently a completely different experience and which I have never once had.", z: "平台上看出去是灰的。不完全是雾——是广州的能见度。你看不见这座城市，但你知道它在那儿。听说天气好的早上完全是另一种体验，而我一次也没赶上过。" },
      { p: "Is it worth it?", z: "值吗？", w: "Nina" },
      { p: "The view, no. The fact that at half past eleven on a Sunday we have already done something — yes, that's worth a lot.", z: "风景不值。但「周日十一点半我们已经做完了一件事」这件事——值很多。", w: "Me" },
      { p: "We take the shuttle bus down, which Nina agrees to immediately and without comment. Back at the flat by eleven, showered, on the sofa, all four of us in the same silence. Nobody says that was nice. It's understood.", z: "我们坐电瓶车下山，Nina 立刻同意，一句话没说。十一点回到出租屋，洗完澡，摊在沙发上，四个人陷入同一种沉默。没人说「挺好的」。这不用讲。" }
    ],
    notes: [
      { e: "be worth it", c: "值得", x: "The view, no. The fact we've done something — yes, that's worth a lot." },
      { e: "walk up / take the bus down", c: "爬上去坐车下来", x: "My position is walk up and take the bus down." },
      { e: "halfway up", c: "爬到一半", x: "Halfway up, Nina stopped saying things like that." },
      { e: "not one of us", c: "我们中没有一个人", x: "Not one of us mentioned the price." },
      { e: "call it a day", c: "收工 / 到此为止", x: "We got back at eleven and called it a day." }
    ]
  },
  {
    id: "s20", part: "sat", place: "gp-market", time: "9:10",
    t: "The wet market on a Saturday morning", z: "周六早上的肉菜市场",
    lead: "菜市场是我在广州最喜欢的一间教室。这里的句子都很短，而且每个词都有后果：说错了，你今晚吃的就是错的鱼。",
    paras: [
      { p: "Nine in the morning and the floor is wet, which is not a defect — it's how you know the fish is fresh and the vegetables have been sprayed. There is ice, there is light, there is a man with a knife who works faster than I can follow.", z: "早上九点，地面是湿的——这不是缺陷，这是你判断鱼新不新鲜、菜有没有喷过水的方式。有冰，有灯，还有一个挥刀速度跟不上的男人。" },
      { p: "There used to be live chickens in here. There aren't any more — the city decided that after one bird flu season too many, and now it's all chilled, and everybody still calls it fresh. My wife tells me this every time and I forget it every time.", z: "以前这里有活鸡。现在没有了——经历过一次禽流感之后城市做了这个决定，现在全是冰鲜的，但所有人都还是管它叫「鲜」。我老婆每次都跟我说一遍，我每次都忘记。" },
      { p: "We have a division of labour: she chooses, I hold the bags. My second job, which I have learned the hard way, is to say nothing while she is choosing.", z: "我们有分工：她挑，我拎袋子。我的第二份工作——这个我是吃过亏才学会的——是在她挑的时候闭嘴。" },
      { p: "The auntie on the greens has recognised us for about six months. Every single week she puts two spring onions on top of the bag and every single week my wife tries to refuse them and every single week she loses. This is not a discount. It's a relationship, and it's not up for discussion.", z: "卖青菜的阿姨认得我们大概半年了。每周她都在袋子上放两根葱，每周我老婆都试图拒绝，每周她都输。这不是打折，这是一段关系，而且不接受讨论。" },
      { p: "Today we're having fish. Which one?", z: "今天吃鱼。哪条？", w: "Wife" },
      { p: "For steaming, take this one. For frying, don't take this one. Steaming wants a fish that doesn't fall apart; frying wants one that doesn't mind.", z: "清蒸拿这条，煎不要拿这条。清蒸要一条蒸不散的；煎要一条不怕煎的。", w: "Auntie" },
      { p: "She says it in about four seconds and I catch maybe seventy percent. My wife catches all of it, which is the real reason she does the choosing and I do the holding.", z: "她四秒内说完，我大概听懂七成。我老婆全听懂了——这才是她负责挑、我负责拎的真正原因。" },
      { p: "The greens are three fifty. My wife says three. The auntie says three. Then she says three thirty and puts in another handful, and everyone wins by twenty fen. Haggling at a wet market is not about money. It's a short ceremony that ends with both people having been reasonable.", z: "青菜三块五。我老婆说三块。阿姨说三块。然后她说三块三，又抓了一把，双方各赢两毛。菜市场讲价不是为了钱，是一个简短的仪式，结束时双方都显得通情达理。" },
      { p: "She pays by scanning the code taped to the stall. Next to it is a smaller sign saying cash is fine — for the old ones, she says, meaning people older than her, which at this stall means people in their eighties who have been shopping here since before the code existed.", z: "她扫摊位上贴着的码付钱。旁边还有一块小牌子写着「现金也可以」——给老人家的，她说，指的是比她更老的人；在这个摊位，那意味着八十多岁、在这个码出现之前就来买菜的人。" },
      { p: "A neighbour auntie stops us by the door and asks when my mother is coming down. My wife answers for both of us, because she keeps the calendar of two families in her head and I keep the calendar of one company.", z: "门口一个邻居阿姨拦住我们，问我妈什么时候来广州。我老婆替我们两个回答了，因为她脑子里装着两个家庭的日程，而我只装了一家公司的。" },
      { p: "We walk home with four bags and my hands hurt in exactly the same place they hurt every Saturday. Every sentence in this place is short and every one of them has consequences, and I have never once learned the word for the thing I was pointing at.", z: "我们拎着四个袋子走回家，我的手疼在每周六都会疼的同一个位置。这里的每个句子都很短，而且每一句都有后果；而我至今没学会我指着的那个东西叫什么。" }
    ],
    notes: [
      { e: "for steaming / for frying", c: "清蒸用 / 煎用", x: "For steaming, take this one. For frying, don't." },
      { e: "throw in (something extra)", c: "搭送 / 额外给", x: "She throws in two spring onions every week." },
      { e: "haggle / knock something off", c: "讲价 / 便宜一点", x: "We knocked twenty fen off and both felt reasonable." },
      { e: "be up for discussion", c: "可以商量", x: "It's not a discount — it's a relationship, and it's not up for discussion." },
      { e: "learn the hard way", c: "吃过亏才学会", x: "I learned the hard way to say nothing while she chooses." }
    ]
  },
  {
    id: "s21", part: "sat", place: "gp-mall", time: "15:20",
    t: "Do you have this in a bigger size?", z: "这有大一号的吗？",
    lead: "我一年逛两次商场，两次都在换季。天河城里有两套排队系统：试衣间门口的，和奶茶店门口的。",
    paras: [
      { p: "I shop twice a year, both times at the change of season, and my wife has decided today is one of them. I don't like buying clothes, because trying clothes on requires a second language that I don't have: the language of it's a bit tight here.", z: "我一年逛两次店，两次都在换季，而我老婆认定今天就是其中一次。我不喜欢买衣服，因为试衣服需要第二套语言——「这里有点紧」的那种语言，而我没有。" },
      { p: "A shop assistant appears within four seconds of the door. Just looking, thanks — I'll have a look myself first. In Guangzhou the interesting question isn't whether they approach you; it's whether they know when to stop. The good ones do.", z: "进门四秒内店员就出现了。「随便看看，谢谢——我先自己看看。」在广州有意思的问题不是他们会不会上来，而是他们知不知道什么时候停。好的知道。" },
      { p: "Can I try this on?", z: "可以试穿吗？", w: "Me" },
      { p: "Sure. Fitting rooms at the back. What size are you?", z: "可以。试衣间在里面。你穿什么码？", w: "Assistant" },
      { p: "Forty-one, I think. In Europe I'm a forty, here I'm usually a forty-one, and I never remember which way round until I'm in the room with the curtain.", z: "四十一吧。在欧洲我穿四十，在这里通常四十一，而我一直要到拉上试衣间的帘子才记得清顺序。", w: "Me" },
      { p: "The shoulders are fine and the sleeves are a bit tight. Which is my whole problem with shirts in this city: they're cut for someone whose arms end earlier than mine.", z: "肩膀没问题，袖子有点紧。这就是我在这座城市买衬衫的终极问题：衣服是照着一个手臂比我早结束的人剪的。", w: "Me" },
      { p: "Do you have this in a bigger size? Or the same size in a different cut?", z: "这有大一号的吗？或者同码的不同版型？", w: "Me" },
      { p: "This one's a slim fit. There's a regular fit in the same colour — it'll give you room in the arm.", z: "这是修身版。同色有常规版，手臂那里会松一点。", w: "Assistant" },
      { p: "At the till she asks if I'm a member, which means a phone number, which means a code, which means I now receive a message every season whether I like it or not. Then: can I get an invoice? It's an occupational disease. I ask for receipts the way other people ask for directions.", z: "收银台她问我是不是会员，这意味着手机号，意味着验证码，意味着从此每季都会收到一条不管我愿不愿意的短信。然后是：可以开发票吗？这是职业病。我要发票的样子，就像别人问路。" },
      { p: "Outside, the milk tea place has sixty-one orders ahead of it. Nobody in this city queues for anything except milk tea, hot pot, and the toilet at a scenic spot — and we do all three with the same patience, which I've never been able to explain to anyone from anywhere else.", z: "外面那家奶茶店前面排了六十一杯。这座城市里没人为任何事排队，除了奶茶、火锅和景区厕所——而且这三件事我们都用同一种耐心排，这点我从没能向任何外地人解释清楚。" },
      { p: "Two shirts. I'll like one of them until I get it home, and then I won't. This is my most consistent record in any category of my life.", z: "两件衬衫。其中一件我会喜欢到回家为止，然后就不喜欢了。这是我人生中所有类别里最稳定的记录。" }
    ],
    notes: [
      { e: "just looking, thanks", c: "随便看看，谢谢", x: "Just looking, thanks — I'll have a look myself first." },
      { e: "try something on", c: "试穿", x: "Can I try this on?" },
      { e: "do you have this in ...?", c: "这有……号的吗？", x: "Do you have this in a bigger size?" },
      { e: "it's a bit tight", c: "有点紧", x: "The sleeves are a bit tight." },
      { e: "Can I get an invoice / a receipt?", c: "可以开发票 / 给张小票吗？", x: "Can I get an invoice? It's an occupational disease." },
      { e: "be ahead of (someone) in the queue", c: "排在前面", x: "There are sixty-one orders ahead of us." }
    ]
  },
  {
    id: "s22", part: "sun", place: "gp-shamian", time: "15:00",
    t: "Shamian on a Sunday", z: "周日的沙面",
    lead: "朋友从上海来出差，只剩半天。我带他去沙面——这是我在广州唯一愿意当一次游客的地方。",
    paras: [
      { p: "Shamian is an island, which is the first thing that matters about it. You cross a little bridge and the noise drops about thirty percent. The buildings are low and old, the roads are stone, and the trees are the kind that were planted by someone who expected to be dead before they mattered.", z: "沙面是个岛，这是关于它的第一件要紧事。你过一座小桥，噪音大概降三成。楼是矮的、旧的，路是石板的，树是那种「种的人没指望自己活着看到它成气候」的树。" },
      { p: "What was this place?", z: "这地方以前是什么？", w: "Friend" },
      { p: "Foreign concession. British and French, mostly, from the eighteen-fifties onwards. The trade houses were on the other side of the water at Thirteen Hongs, and this is where the foreigners lived. Now it's apartments, consulates, coffee shops and about eight weddings a day.", z: "租界。主要是英法租界，十九世纪五十年代起。洋行在水对面十三行那边，外国人住这儿。现在是民居、领馆、咖啡馆，还有一天大概八场婚礼。", w: "Me" },
      { p: "Eight is not an exaggeration. Every twenty metres there is a couple in white standing under a tree while a photographer tells the groom to move closer, and every twenty metres there is another one, and none of them are annoyed, because everyone understands that on a Sunday this island belongs to the brides.", z: "八场不是夸张。每二十米就有一对穿白的站在树下，摄影师在喊新郎靠近一点；再二十米又是一对。没人不耐烦，因为大家都懂：周日的这座岛归新娘。" },
      { p: "Are these buildings actually old?", z: "这些楼是真的老吗？", w: "Friend" },
      { p: "Some are. Some are rebuilt in the old style, which in this city is a different thing and nobody here pretends otherwise. We're not precious about it. A building that looks a hundred years old and is forty still does the job of making a street feel like a street.", z: "有些是。有些是按老样子重建的——在这座城市里这是另一回事，而且这儿没人装作不是。我们不太纠结这个。一栋看着一百年、实际四十年的楼，照样能把一条街撑得像一条街。", w: "Me" },
      { p: "We sit down for coffee that costs twice what it costs three streets away, and I don't mind, because what you're buying isn't the coffee. You're buying forty minutes inside an old room with a ceiling that's too high, which on a Sunday afternoon is worth more than the difference.", z: "我们坐下喝了杯比三条街外贵一倍的咖啡，我不介意，因为你买的不是咖啡。你买的是在一个天花板过高的旧房间里待四十分钟——周日下午，这比差价值钱。" },
      { p: "An old foreign gentleman passes with a small dog and greets the woman sweeping the steps in Cantonese — proper Cantonese, the kind that takes twenty years. She answers without looking up, which is how you know he lives here and isn't a visitor.", z: "一位外国老先生牵着一只小狗经过，用粤语跟正在扫台阶的阿姨打招呼——真正的粤语，那种要学二十年的粤语。她头也没抬就回了，这就是你知道他住这儿、不是游客的方式。" },
      { p: "The cats are the civil servants of Shamian. They have posts, they have regular hours, and they are fed by at least four separate people who each believe they are the only one.", z: "猫是沙面的公务员。它们有岗位，有固定作息，而且至少有四个人在喂它们，每个人都以为只有自己在喂。" },
      { p: "This doesn't feel like Guangzhou, he says on the way out. It is Guangzhou, I say. That's the thing about this city that takes people a year to get: it's five completely different places stacked on top of each other, and every one of them is real, and none of them cancels the others out.", z: "这里不像广州啊，他走的时候说。这就是广州，我说。这座城市要花一年才让人明白的就是这点：它是五个完全不同的地方叠在一起，每一个都是真的，而且谁也不把谁抵消掉。" }
    ],
    notes: [
      { e: "used to be", c: "以前是", x: "It used to be a foreign concession." },
      { e: "be worth (the money / it)", c: "值这个钱 / 值得", x: "Forty minutes in an old room is worth more than the difference." },
      { e: "without looking up", c: "头也不抬", x: "She answered without looking up." },
      { e: "on the way out", c: "走的时候 / 临走", x: "He said it on the way out." },
      { e: "cancel each other out", c: "互相抵消", x: "None of them cancels the others out." }
    ]
  },
  {
    id: "s23", part: "wed", place: "gp-river", time: "周三 20:30",
    t: "A run along the river", z: "沿江跑一圈",
    lead: "周三晚上八点半，我终于做成了那件一周计划三次、大概只执行一次的事。换衣服花了十分钟，其中八分钟在跟自己谈判。",
    paras: [
      { p: "Getting changed takes ten minutes, eight of which are negotiation. The negotiation is not about whether I want to run. Nobody wants to run. It's about whether the version of me that gets out of the door can be produced from the version of me that is currently on the sofa.", z: "换衣服花了十分钟，其中八分钟在谈判。谈判的内容不是我想不想跑。没人想跑。谈判的内容是：从沙发上这个我，能不能生产出那个会出门的我。" },
      { p: "By the water at half past eight the whole street is in use, and everybody is using a different part of it. The running lane is for running. The square is for dancing — two groups, two songs, one of them clearly louder than the other and neither of them caring. The steps are for sitting and looking at a phone. Every bench has a couple on it.", z: "八点半的江边，整条街都在被使用，而且每个人用的是不同的部分。跑道是给跑的。广场是给跳舞的——两拨人、两首歌，其中一首明显比另一首响，谁也不在乎。台阶是给坐着看手机的。每张长椅上都有一对。" },
      { p: "There is a man fishing with a bucket that is empty, and he has been empty for a while, and he doesn't care at all. I have decided this is the correct way to fish.", z: "有个男人在钓鱼，桶是空的，而且已经空了一阵了，他一点都不在意。我认定这才是钓鱼的正确方式。" },
      { p: "Then the running club goes past: fifteen people in matching vests, all at exactly the same speed, not talking. They scare me slightly every single time. Running in silence and in formation is not exercise, it's a statement.", z: "然后跑团过去了：十五个人穿着同款背心，速度一模一样，不说话。每次都让我有点怕。安静地、成队形地跑步那不叫锻炼，那叫表态。" },
      { p: "A boy on a shared bike overtakes me at the two kilometre mark. He is not going fast. I am going slower than a person who is not going fast, and I want that written down somewhere.", z: "两公里处，一个骑共享单车的男生超过了我。他骑得并不快。我比一个骑得不快的人还慢，这句话我想被记录在某个地方。" },
      { p: "There's an uncle walking barefoot on the pebble path, which is a fitness thing here — the stones press the bottom of your feet and this is supposed to be good for you. I watch his face every time I pass and his face says the same thing every time, and it is not this is good for me.", z: "有个大爷光脚在鹅卵石路上走，这是这儿的一种健身方式——石头压脚底，据说有好处。我每次经过都看他的脸，他的脸每次说的都是同一句话，而那句话不是「这对我有好处」。" },
      { p: "I stop at three kilometres and sit on the steps. Across the water is the Zhujiang New Town skyline doing its colours, and the tower is purple tonight, which means nothing and which everybody photographs anyway.", z: "三公里我停了，坐在台阶上。水对面是珠江新城的天际线在换颜色，今晚塔是紫色的——这颜色没有任何含义，而所有人照样在拍。" },
      { p: "You actually went?", z: "你真去了？", w: "Wife" },
      { p: "Three kilometres. Slowly.", z: "三公里。很慢。", w: "Me" },
      { p: "You say three kilometres the way other people say I tried.", z: "你说「三公里」的语气，跟别人说「我试过了」是一样的。", w: "Wife" },
      { p: "Running doesn't fix anything. What it does is cut the day into two pieces: before the run and after it. And the piece after is always the better one, which is the only argument for it that has ever worked on me.", z: "跑步解决不了任何事。它做的事情是把一天切成两半：跑之前和跑之后。而后面那一半永远更好——这是唯一一个对我有效的论据。" }
    ],
    notes: [
      { e: "talk myself into (doing something)", c: "说服自己去做", x: "Eight of those ten minutes were me talking myself into it." },
      { e: "get overtaken (by someone)", c: "被……超过", x: "A boy on a shared bike overtook me at two kilometres." },
      { e: "be in use", c: "在被使用", x: "By half past eight the whole street is in use." },
      { e: "cut something into two", c: "把……分成两半", x: "It cuts the day into two pieces." },
      { e: "work on someone", c: "对某人有效（说服得了某人）", x: "It's the only argument that has ever worked on me." }
    ]
  },
  {
    id: "s24", part: "thu", place: "gp-tower", time: "20:10",
    t: "The tower and the ten-minute walk", z: "塔，和那十分钟的路",
    lead: "总部来的 Marcus 在广州待两天，今晚是最后一晚。他点名要看广州塔，还用了一种很客气的方式说：如果不太麻烦的话。",
    paras: [
      { p: "Marcus is the one person at head office who has never once opened an email with the phrase just to flag. He arrives, he does two days of meetings, he leaves. Tonight is the last night and he wants to see the tower, and he asks for it in the way English people ask for things: if it's not too much trouble.", z: "Marcus 是总部唯一一个从来不用「只是想提醒一下」开头发邮件的人。他来，开两天会，走。今晚是最后一晚，他想看塔，而且是用英国人请求事情的方式提出来的：如果不麻烦的话。" },
      { p: "It is a bit of trouble. It's a Thursday, I have a call at seven tomorrow morning, and the queue for the observation deck on a clear night is not a joke. I say of course, because some of my job is clauses and some of it is this.", z: "确实有点麻烦。今天是周四，我明早七点有电话会，而且天气好的晚上观景台的队不是开玩笑的。我说当然，因为我这份工作一部分是条款，一部分是这个。" },
      { p: "We come out of the metro at Chigang Pagoda and the tower is right there, doing that thing it does — 600 metres of it, leaning, lit in a colour that nobody chose and everybody photographs. Marcus stops walking for a second, which is the correct response.", z: "我们从赤岗塔站出来，塔就在那儿，做着它一贯做的事——六百米，扭曲着，亮着一个没人选的、所有人都在拍的颜色。Marcus 停了半秒，这是正确的反应。" },
      { p: "Why is it twisted? Is it structural?", z: "它为什么是扭的？结构需要吗？", w: "Marcus" },
      { p: "No. It's a decision. Someone sat in a room and said: make it twisted, and everybody agreed, and now it's our tower.", z: "不是。这是个决定。有人坐在一个房间里说：把它做成扭的。所有人都同意了。现在它就是我们的塔。", w: "Me" },
      { p: "We don't go up. Sixty-nine yuan to stand in a queue for forty minutes to look at a city that is grey anyway — I tell him the honest version instead, which is that the best view of that tower is not from the tower. It's from the bridge, ten minutes' walk, at no cost.", z: "我们没上去。六十九块钱排四十分钟，看一座本来就是灰的城市——我直接跟他说了实话：看那座塔最好的角度不在塔里，在桥上，走过去十分钟，不要钱。" },
      { p: "The bridge is where everyone in this city has had the same photograph taken. Couples, families, one man with a tripod and the patience of a monk. A boy is selling little glowing hairbands off a trolley at the bottom, and his entire business model is the twenty minutes between the bridge and the car park.", z: "桥上就是这座城市所有人拍过同一张照片的地方。情侣、一家人、一个架着三脚架耐心如僧的男人。桥下有个男生推着车卖发光发箍，他整个商业模式就是「从桥到停车场这二十分钟」。" },
      { p: "The locals call it Xiaomanyao. Little waist. Nobody here says Canton Tower unless they're reading a road sign.", z: "本地人管它叫小蛮腰。这儿没人说 Canton Tower，除非在读路牌。", w: "Me" },
      { p: "So the official name is wrong?", z: "所以官方名字是错的？", w: "Marcus" },
      { p: "The official name works in documents. That's what official names are for. In conversation you use the one that the city gave it, and the city's name is better, and every city does this. In London you say the Eye, not the London Eye. Nobody has time.", z: "官方名字用在文件里。官方名字就是干这个的。日常说话你用这座城市给它起的名字，而城市的名字更好——每座城市都这样。在伦敦你说 the Eye，不说 the London Eye。没人有那个时间。", w: "Me" },
      { p: "Afterwards we eat noodles at a place with plastic stools and a queue that moves because everybody eats in eleven minutes. Marcus asks whether air conditioning counts as a human right in this city. I say it should.", z: "之后我们在一家塑料凳子的店吃面，队伍一直动着，因为每个人十一分钟吃完。Marcus 问空调在这座城市算不算人权。我说应该算。" },
      { p: "He pays for the noodles and will not let me pay him back. He says head office owes me a dinner. What he means, and what I decline to explain to him, is that head office already owes me about four hundred of them.", z: "他抢着付了面钱，也不让我还给他。他说总部欠我一顿饭。他真正的意思——而我不打算跟他解释的是——总部已经欠我大概四百顿了。" },
      { p: "At the hotel he says the thing he's been holding all evening: you don't sound like a lawyer when you talk about this city. And I say: that's the only subject.", z: "到酒店门口，他说出了憋了一晚上的那句话：你聊这座城市的时候，一点都不像律师。我说：那是唯一一个我不像律师的话题。" }
    ],
    notes: [
      { e: "if it's not too much trouble", c: "如果不麻烦的话", x: "He asked if it's not too much trouble." },
      { e: "not a joke", c: "不是开玩笑的（很夸张 / 很厉害）", x: "The queue on a clear night is not a joke." },
      { e: "the honest version", c: "实话版本", x: "I told him the honest version instead." },
      { e: "counts as", c: "算作", x: "Does air conditioning count as a human right here?" },
      { e: "let someone pay you back", c: "让某人还钱", x: "He won't let me pay him back." },
      { e: "owe someone (one)", c: "欠某人（一顿 / 一个人情）", x: "Head office owes me about four hundred dinners." }
    ]
  },
  {
    id: "s25", part: "fri", place: "gp-airport", time: "7:20",
    t: "Meeting the boss off the plane", z: "去机场接老板",
    lead: "总部 GC 来两天。她只有一天半的时间，所以我们把她的全部日程压缩到了一辆车上——这是我这份工作里最不写在合同里的部分。",
    paras: [
      { p: "Baiyun Airport has two terminals and they are twenty minutes apart by road, which is the kind of detail that has ended careers. I check the flight number twice, then photograph the arrivals board and send it to her assistant, which is what you do when you want to be able to prove that you were right about a fact.", z: "白云机场有两个航站楼，路上相隔二十分钟——这种细节毁过人的职业生涯。我核了两遍航班号，然后拍了到达屏幕的照片发给她助理。当你想留下「这件事我是对的」的证据时，你就是这样做的。" },
      { p: "She comes out with one carry-on bag and the specific calm of someone who has been in the air for twelve hours and has decided not to mention it. I start to apologise for the early start. She says: it's fine, the meetings are the point.", z: "她出来时只带一个登机箱，带着那种飞了十二小时、并且决定不提这件事的人特有的平静。我正要为这么早开始道歉。她说：没事，会才是重点。" },
      { p: "Where are we going first?", z: "我们先去哪？", w: "GC" },
      { p: "Office. Forty-five minutes if the road behaves. I've printed everything and put the indemnity section at the front, since it's the only one where you're going to disagree with the other side.", z: "公司。路况好的话四十五分钟。我把所有材料都打印了，把赔偿条款放在最前面——因为那是唯一一个你会跟对方意见不同的部分。", w: "Me" },
      { p: "In the car, then. Let's talk in the car.", z: "那就在车上谈。我们在车上谈。", w: "GC" },
      { p: "This is the part of the job that nobody explains when you interview. A general counsel flying from Europe with thirty-six hours on the ground does not want a meeting room, a projector and an agenda. She wants the thing narrowed down before the meeting starts, and she wants it narrowed down in a car, because the car is the only time she has that isn't already somebody else's.", z: "这就是面试时没人会跟你解释的那部分工作。一位从欧洲飞来、在地面只有三十六小时的总法律顾问，不想要会议室、投影仪和议程。她想要的是在会议开始之前把事情收窄，而且要在一辆车里收窄——因为车上是她唯一一段还没被别人的日程占掉的时间。" },
      { p: "So we do it at 70 kilometres an hour with a Cantonese radio station arguing about football in the background. The cap, the carve-outs, the jurisdiction clause that the other side has quietly moved from Guangzhou to Singapore, and the one sentence on page nineteen that I want her to read out loud so that there are two people who have noticed it.", z: "于是我们在时速七十公里、背景是粤语电台在吵足球的情况下谈完了。上限、排除项、对方悄悄从广州改到新加坡的管辖条款，还有第十九页上那一句——我要她念出声来，这样就有两个人注意到了它。" },
      { p: "Say page nineteen again.", z: "第十九页再说一遍。", w: "GC" },
      { p: "Nineteen, second paragraph. They've added a review right without a time limit. It's one line and it's the whole contract.", z: "第十九页，第二段。他们加了一个没有期限的复核权。就一行，但它是整份合同。", w: "Me" },
      { p: "Good. You found it. That's why I'm here and not on a video call. Video calls are for people who have already agreed.", z: "很好。你找到了。这就是我来这儿、而不是开视频的原因。视频会是为已经谈成的人准备的。", w: "GC" },
      { p: "There is a version of this morning where I say something clever. In the real version I say thank you and look out of the window at the banyan trees going past, and think about how the best compliment I've had this year came at forty kilometres from an airport.", z: "这个早上本有一个我说句漂亮话的版本。真实的版本是我说了声谢谢，然后看着窗外掠过的榕树，想着今年我得到的最好的夸奖，是在离机场四十公里的地方听到的。" },
      { p: "The driver has the radio on the whole way and never once looks at us. Not because he isn't listening. Because he's decided that whatever we're doing back there is none of his business, which is a level of professionalism I would like to be able to buy.", z: "司机一路开着收音机，一次都没回头看我们。不是因为他没在听。是因为他决定后面那两个人在干什么不关他的事——这种职业素养我想花钱买。" }
    ],
    notes: [
      { e: "on the ground", c: "在当地 / 在现场（的时间内）", x: "She has thirty-six hours on the ground." },
      { e: "narrow something down", c: "把范围收窄", x: "She wants it narrowed down before the meeting." },
      { e: "the point (of something)", c: "重点 / 关键所在", x: "The meetings are the point." },
      { e: "it's the whole contract", c: "这就是整份合同（的要害）", x: "It's one line and it's the whole contract." },
      { e: "if the road behaves", c: "如果路况好的话", x: "Forty-five minutes if the road behaves." },
      { e: "none of my business", c: "不关我的事", x: "He decided it was none of his business." }
    ]
  },
  {
    id: "s26", part: "spring", place: "gp-yuexiu", time: "正月十五",
    t: "Lanterns, and a boy who lost his balloon", z: "灯，和一个飞走气球的小孩",
    lead: "广州人一年里几乎不为任何东西排队。元宵这晚例外——整个城市都去越秀公园看灯，而且心甘情愿。",
    paras: [
      { p: "One night a year this city agrees to queue. Lantern Festival, Yuexiu Park, and a crowd that the park has clearly not been designed for. There are marshals with megaphones, there is a one-way system through the gardens, and there is absolutely no chance of moving at your own speed.", z: "一年就这么一晚，这座城市愿意排队。元宵，越秀公园，人多到这座公园显然不是为这个设计的。有拿喇叭的引导员，有单向通行的园区路线，而且完全没可能按自己的速度走。" },
      { p: "My wife has a specific ambition and it involves a photograph of the lanterns over the water. This is a project. We have been talking about this photograph since January.", z: "我老婆有一个明确的目标，跟「水上那组灯的合影」有关。这是一个项目。我们从一月就开始讨论这张照片。" },
      { p: "The queue for tickets is an hour. We have bought them on the phone, so it is only forty minutes of queueing to get the phone scanned, which is the oldest joke in this city and everybody still tells it every year.", z: "买票的队伍一小时。我们在手机上买好了，所以只剩下四十分钟排队等扫码——这是这座城市最老的笑话，而每年所有人都还在讲。" },
      { p: "Is it always like this?", z: "每次都是这样吗？", w: "Wife" },
      { p: "Every year. And every year you say the same thing, which is: why do we do this. And every year we do it again.", z: "每年都这样。而且每年你都说同一句话，就是：我们为什么要来。然后每年我们照样来。", w: "Me" },
      { p: "She is right, though, and I know she's right, which is why I'm not arguing. The lanterns over the lake are genuinely good — twenty metres of a single gold fish swimming through the water, a peacock made of lights, and the whole east side of the park hung with red that turns everybody's face red as well.", z: "不过她说得对，我知道她说得对，所以我不争。湖上的灯是真好——一条二十米的金鱼在水里游，一只灯做的孔雀，公园整个东侧挂满红色，把每个人的脸也照成红的。" },
      { p: "There is a stall selling tangyuan and it costs four yuan for five, and here is the thing nobody outside Guangdong understands: the soup is not sweet. It's ginger. Ginger and sugar, and the ginger is the whole point, because it's still cold at night in the first month of the year.", z: "有个摊子卖汤圆，四块钱五个，而这里有一件广东以外的人都不懂的事：汤不是甜的。是姜的。姜和糖，而姜才是全部重点——因为正月里的晚上还是冷的。" },
      { p: "Halfway round, a small boy lets go of his balloon. It goes up through the lights and into the dark and he stands there with his arm still up, and every adult within five metres looks up with him. Nobody laughs. This is a group of maybe thirty people who have all agreed, without discussing it, that this is a tragedy.", z: "走到一半，一个小男孩把气球放飞了。气球从灯里穿上去，进了黑暗，他就站在那儿，手臂还举着，五米以内的每个成年人跟着他一起抬头。没人笑。这是大概三十个人在没有商量的情况下达成的一致：这是一件悲剧。" },
      { p: "His father does the correct thing, which is not to buy another one immediately. He says: it went to see the whole city. The boy considers this. Then he accepts it, which is the most impressive thing I see all evening.", z: "他爸爸做了正确的事——没有马上再买一个。他说：它去看整座城市了。小孩想了想，然后接受了。这是我今晚看到的最了不起的一件事。" },
      { p: "We eat noodles at eleven on the way home and my wife, looking at her phone, says the photograph came out badly. I say we'll come back next year. She says yes. Both of us know it will be exactly as crowded, and that this is not a reason not to come, and we will be standing in the same queue and having the same argument about the soup.", z: "十一点我们在回家路上吃面，我老婆看着手机说照片拍得不好。我说明年再来。她说好。我们俩都知道明年还是一样挤，而这不是不来的理由；而且我们还会站在同一个队伍里，为同一碗汤再争一次。" }
    ],
    notes: [
      { e: "one night a year", c: "一年就这么一晚", x: "One night a year this city agrees to queue." },
      { e: "it's the whole point", c: "这才是重点", x: "The ginger is the whole point." },
      { e: "let go of (something)", c: "放开 / 松手", x: "He let go of the balloon and it went up." },
      { e: "come out badly", c: "（照片）拍糊了 / 效果不好", x: "She said the photograph came out badly." },
      { e: "there is absolutely no chance of ...", c: "完全不可能……", x: "There's no chance of moving at your own speed." }
    ]
  },
  {
    id: "s27", part: "chongyang", place: "gp-baiyun", time: "九月初九 7:00",
    t: "Nine-nine, and everyone goes up the mountain", z: "九九重阳，全城上山",
    lead: "重阳这天，广州人会做一件平时不做的事：爬白云山。我丈母娘走得比我快，而且她从不回头看我们。",
    paras: [
      { p: "Chongyang, the ninth day of the ninth month, and in this city that means one thing: go up a mountain. Not a tourist thing. Not a photo thing. An instruction, roughly two thousand years old, that for one morning everybody follows.", z: "重阳，九月初九。在这座城市，这一天的意思只有一件事：上山。不是旅游，不是拍照，是一条大约两千年前的指令，一整个早上所有人都照做。" },
      { p: "We go with my wife's parents. Her mother is seventy-one and she puts on the shoes she walks in every day and she goes, and by the halfway point she is ahead of us and has not once looked back to check that we are coming.", z: "我们跟岳父岳母一起去。我丈母娘七十一岁，穿上她每天走路穿的那双鞋就走了，到一半的时候她已经在我们前面，而且一次都没回头看我们有没有跟上。" },
      { p: "She says the same thing every year: the mountain doesn't care how old you are, it only cares whether you keep moving. This is not a proverb. She is telling me something.", z: "她每年都说同一句话：山不管你多大年纪，它只管你有没有在走。这不是谚语。她是在跟我说一件事。", w: "Wife" },
      { p: "There are two kinds of people coming down as we go up: the ones who started at six and are done, and the ones who came last night and camped on the ridge. The second group look like they have had an argument with nature and lost on points.", z: "我们上山的时候，下山的有两种人：六点就出发、现在已经完事的；还有昨晚就上来、在山脊上扎营的。第二种人看起来像跟自然吵了一架，然后点数输了。" },
      { p: "At the top there is a man selling chrysanthemum wine in small plastic bottles and a woman selling kite strings, and both of them have been doing this on this one day for twenty years, which means they do not have a plan B and they do not need one.", z: "山顶有个男人用小塑料瓶卖菊花酒，有个女人在卖风筝线，两个人都已经在这一天做这件事做了二十年——这意味着他们没有备用方案，也不需要。" },
      { p: "An old man next to us shouts one long note off the edge of the ridge, the way people do, and waits. Then he does it again. I ask my father-in-law why and he says: you shout up here so the year goes well. I ask whether it matters what you shout. He thinks about it and says no, that nobody has ever tested that.", z: "旁边一个老人对着山脊边缘喊了一声长音，跟别人一样，然后等。然后他又喊了一次。我问岳父为什么。他说：在这儿喊一声，这一年会顺。我问喊什么内容重不重要。他想了想说，不重要，而且没人测试过。" },
      { p: "My wife buys two bottles of the chrysanthemum wine and gives one to her mother, and they drink it standing up with the city grey and enormous underneath them. Then her mother says the thing that she only ever says on this mountain: that she wants to be walked up here for as long as she can be walked up here.", z: "我老婆买了两瓶菊花酒，一瓶给她妈，母女俩站着喝，脚下是灰蒙蒙、巨大的一座城市。然后她妈说了那句只在山上才会说的话：只要还能被扶着上来，她就想一直上来。" },
      { p: "We go down the way we came, which is harder than going up, and my knees file a formal complaint at the four hundredth step. The whole mountain is full of people doing exactly this, at exactly this speed, and nobody is in a hurry, because getting down from this mountain in a hurry is how you end up hurt.", z: "我们原路下山，比上山更难，到第四百级台阶时我的膝盖提出了正式投诉。整座山都是人在做同一件事、用同一个速度，没人着急——因为从这座山上着急下来，就是你会受伤的方式。" },
      { p: "At the bottom we eat at a place with no menu and no prices, and my father-in-law pays before anyone can argue, and my wife tells me this is not something I should ever try to win. I wasn't planning to.", z: "山下我们在一家没有菜单也没有价目表的店吃饭，岳父在任何人开口之前就付了钱，我老婆告诉我这件事我永远不要试图赢。我也没打算赢。" },
      { p: "Nine-nine. Two nines, meaning long life, and the whole day exists because of that. People come up here for the number, and what they actually get is one morning of walking with the people they came with, which is the older and better reason.", z: "九九，两个九，意思是长久。这一整天就是因为这个数字存在的。人们为了这个数字上山，实际拿到的却是一个上午——跟一起来的人走路的一个上午。这才更古老、也更好的理由。" }
    ],
    notes: [
      { e: "keep moving", c: "继续走 / 不停下来", x: "The mountain doesn't care how old you are — only whether you keep moving." },
      { e: "have a plan B", c: "有备用方案", x: "They've done this one day for twenty years and don't need a plan B." },
      { e: "on points", c: "按点数（输了）", x: "They look like they lost an argument on points." },
      { e: "in a hurry", c: "着急", x: "Getting down in a hurry is how you get hurt." },
      { e: "as long as ...", c: "只要……", x: "As long as she can be walked up here, she wants to come." }
    ]
  }
];
