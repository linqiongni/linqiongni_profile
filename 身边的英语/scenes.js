/* 身边的英语 · 内容数据
   主人公：广州租房上班族，外企法务（in-house legal counsel），已婚未育。
   住 1 号线沿线，坐 1 号线到体育西路，出站扫码共享单车去写字楼；9 点上班 6 点下班。
   中午在楼下吃，晚上要么顺路买菜做饭、更经常是点外卖。
   一篇 = 一个场景。第一人称短文为主，对话片段嵌在里面。
   字段：t 英文标题 / z 中文标题 / lead 场景说明 / paras 段落（p 英文 z 中文 w 说话人）
        notes 本篇值得带走的说法（e 英文 c 中文 x 例句）
   加新场景：往 SCENES 数组末尾追加一条即可，目录与播放会自动带上。 */

const PARTS = [
  { id: "weekday", label: "工作日", en: "Weekdays", kids: [
    { id: "mon", label: "周一", en: "Mon" },
    { id: "tue", label: "周二", en: "Tue" },
    { id: "wed", label: "周三", en: "Wed" },
    { id: "thu", label: "周四", en: "Thu" },
    { id: "fri", label: "周五", en: "Fri" }
  ]},
  { id: "weekend", label: "周末", en: "Weekend", kids: [
    { id: "sat", label: "周六", en: "Sat" },
    { id: "sun", label: "周日", en: "Sun" }
  ]},
  { id: "holiday", label: "节假日", en: "Holidays", kids: [
    { id: "midautumn", label: "中秋", en: "Mid-Autumn" },
    { id: "national", label: "国庆", en: "Oct 1st" },
    { id: "spring", label: "春节", en: "Spring Festival" },
    { id: "labour", label: "五一", en: "May Day" },
    { id: "dragon", label: "端午", en: "Dragon Boat" }
  ]}
];

const SCENES = [
  {
    id: "s01", part: "mon", time: "7:10",
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
    id: "s02", part: "tue", time: "12:15",
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
    id: "s03", part: "wed", time: "18:40",
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
    id: "s04", part: "thu", time: "21:05",
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
    id: "s05", part: "fri", time: "18:20",
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
    id: "s06", part: "sat", time: "10:20",
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
    id: "s07", part: "sat", time: "20:10",
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
    id: "s08", part: "sun", time: "17:40",
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
    id: "s09", part: "midautumn", time: "八月十五",
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
    id: "s11", part: "spring", time: "除夕",
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
    id: "s12", part: "labour", time: "5/1",
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
    id: "s13", part: "dragon", time: "五月初五",
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
  }
];
