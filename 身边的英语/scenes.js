/* 身边的英语 · 内容数据
   一篇 = 一个场景。第一人称短文为主，对话片段嵌在里面。
   字段：t 英文标题 / z 中文标题 / lead 场景说明 / paras 段落（p 英文 z 中文 w 说话人）
        notes 本篇值得带走的说法（e 英文 c 中文 x 例句）
   加新场景：往 SCENES 数组末尾追加一条即可，目录与播放会自动带上。 */

const PARTS = [
  { id: "morning", label: "早上", en: "Morning" },
  { id: "commute", label: "通勤", en: "On the way" },
  { id: "work", label: "上班", en: "At work" },
  { id: "evening", label: "晚上", en: "Evening" },
  { id: "weekend", label: "周末", en: "Weekend" }
];

const SCENES = [
  {
    id: "s01", part: "morning", time: "6:50",
    t: "The snooze negotiation", z: "闹钟响了，跟自己谈判",
    lead: "闹钟响第一遍。我跟自己达成协议：再睡五分钟。这份协议从来没有被执行过。",
    paras: [
      { p: "My alarm goes off at 6:50 and I do the thing I do every morning: I negotiate. Five more minutes, I tell myself, and then I'll be a completely different person — awake, motivated, maybe even someone who makes the bed.", z: "闹钟六点五十响，然后我开始每天早上都要做的事：跟自己谈判。再五分钟，我告诉自己，五分钟后的我会是另一个人——清醒、有干劲，说不定还会叠被子。" },
      { p: "It's never true. Five minutes later I'm still me, just later.", z: "从来没实现过。五分钟后我还是我，只是晚了五分钟。" },
      { p: "You said that twenty minutes ago.", z: "你二十分钟前就这么说了。", w: "Partner" },
      { p: "I said it with feeling this time.", z: "这次我说得很有诚意。", w: "Me" },
      { p: "My partner doesn't even open her eyes when she says these things. She's had the same conversation with me about four hundred times, and she can run it on autopilot now. I respect that.", z: "她说这些的时候眼睛都没睁。这段对话她跟我演过大概四百遍，现在可以自动驾驶了。我respect。" },
      { p: "Outside it's still that flat grey that means either early morning or rain. I can't tell which, and honestly I don't have time to care. Feet on the floor. That's the whole trick — don't think, just stand up.", z: "外面还是那种一片灰，分不清是清晨还是要下雨。没空管了。脚落地，这是唯一的诀窍：别想，先站起来。" },
      { p: "By the time I'm in the kitchen I've mostly forgiven myself for waking up late, which is the real reason I set the alarm early in the first place.", z: "等我走到厨房，我已经基本原谅自己起晚了——而这恰恰是我把闹钟定早的真正原因。" }
    ],
    notes: [
      { e: "go off", c: "（闹钟）响", x: "My alarm goes off at six and I ignore it at 6:01." },
      { e: "five more minutes", c: "再五分钟（赖床专用）", x: "Just five more minutes, I promise." },
      { e: "on autopilot", c: "自动驾驶模式，不用过脑子", x: "I brush my teeth on autopilot every morning." },
      { e: "feet on the floor", c: "起床的第一步：脚落地", x: "No thinking. Feet on the floor." }
    ]
  },

  {
    id: "s02", part: "morning", time: "7:20",
    t: "Where the other sock went", z: "找袜子大作战",
    lead: "衣柜里大概有三十双袜子，但每天早上我只能找到二十九只。",
    paras: [
      { p: "There is a law in this apartment: the sock you are looking for is never in the drawer with all the other socks. It's under the bed, or inside a sweater, or in the laundry basket pretending to be clean.", z: "这个公寓有条定律：你要找的那只袜子，从来不跟其他袜子待在同一个抽屉里。它在床底下，或者卷在某件毛衣里，或者在脏衣篓里假装自己是干净的。" },
      { p: "I do the maths every morning. Thirty pairs should mean sixty socks. In practice it means about forty-one, eleven of which have holes I keep meaning to deal with.", z: "我每天早上都要算一遍。三十双应该是六十只。实际上大概四十一只，其中十一只有洞，我一直说要处理，一直没处理。" },
      { p: "Have you seen a grey one?", z: "看到一只灰色的没？", w: "Me" },
      { p: "They're all grey.", z: "全是灰的啊。", w: "Partner" },
      { p: "She's right, of course. I bought one colour specifically so this wouldn't happen, and then it happened anyway, because that's what buying one colour does — it doesn't prevent the problem, it just makes it boring.", z: "她当然是对的。我特意只买一个颜色就是为了避免这件事，然后它还是发生了——这就是只买一个颜色的后果：它不解决问题，它只是让问题变得无聊。" },
      { p: "I find it behind the radiator. Warm. I put it on and leave the bedroom looking like a small argument happened in it.", z: "我在暖气片后面找到了它，还是热的。穿上，然后把卧室留在身后——看起来像里面刚发生过一场小型争执。" }
    ],
    notes: [
      { e: "the sock you are looking for", c: "你正在找的那只", x: "The sock you are looking for is always under the bed." },
      { e: "keep meaning to deal with", c: "一直想着要处理（但没处理）", x: "I keep meaning to fix that door." },
      { e: "it happened anyway", c: "它还是发生了", x: "I locked the door twice and it happened anyway." }
    ]
  },

  {
    id: "s03", part: "morning", time: "7:40",
    t: "Breakfast in nine minutes", z: "九分钟的早餐",
    lead: "冰箱门开三次，每次都希望里面出现了新东西。它没有。",
    paras: [
      { p: "I open the fridge three times in four minutes. This is not because I forget what's in there. It's because I'm hoping something new has appeared since the last time I looked, which is a feeling I have about the fridge maybe forty times a week.", z: "四分钟里我开了三次冰箱。不是因为我忘了里面有什么。是因为我希望上次看完之后，里面冒出了新东西——这种感觉我一周大概有四十次。" },
      { p: "Eggs. There are always eggs. Eggs are the backup plan of every working adult I know, and the reason is simple: they cook fast and they're hard to ruin badly enough to matter.", z: "鸡蛋。永远有鸡蛋。鸡蛋是我认识的每个上班族的B计划，原因很简单：熟得快，而且很难难吃到影响心情的程度。" },
      { p: "What do you want, toast or congee?", z: "你想吃啥，吐司还是粥？", w: "Me" },
      { p: "Whatever's fastest.", z: "哪个快哪个来。", w: "Partner" },
      { p: "Whatever's fastest is the answer to most questions in this house before eight a.m.", z: "早上八点前，这个家里大多数问题的答案都是「哪个快哪个来」。" },
      { p: "I get the pan going, put bread in the toaster, and stand there for a second doing nothing — the only ten seconds of the morning that belong entirely to me. Then the toast pops and the day starts properly.", z: "我把锅热上，面包丢进烤面包机，然后站在那儿愣了一秒——这是整个早晨唯一完全属于我的十秒钟。然后吐司「叮」一声弹出来，一天正式开始。" }
    ],
    notes: [
      { e: "the backup plan", c: "备选方案、兜底的", x: "Eggs are my backup plan for every meal." },
      { e: "whatever's fastest", c: "哪个快就哪个（不当真的选择）", x: "Lunch? Whatever's fastest." },
      { e: "get the pan going", c: "先把锅热上", x: "Get the pan going while I chop the onions." },
      { e: "the day starts properly", c: "一天才算真正开始", x: "After the first coffee the day starts properly." }
    ]
  },

  {
    id: "s04", part: "morning", time: "8:15",
    t: "Keys, phone, badge", z: "出门前的那套仪式",
    lead: "手机、钥匙、工牌、伞。出门前拍一遍口袋，这套动作比刷牙还熟练。",
    paras: [
      { p: "Phone, keys, badge. I pat my pockets in that order, every single day, and about once a fortnight I still get to the lobby and find one of them missing — usually the badge, which is the one thing I actually cannot get into the building without.", z: "手机、钥匙、工牌。我每天都按这个顺序拍一遍口袋，大概每两周还是会有一次到了大堂发现少一样——通常是工牌，而工牌恰恰是我没它进不了大楼的那一样。" },
      { p: "My partner is already at the door, holding my umbrella.", z: "我对象已经站在门口了，手里拿着我的伞。", w: "Partner" },
      { p: "It's not raining.", z: "没在下雨啊。", w: "Me" },
      { p: "It's going to rain. Check your app.", z: "要下了。你看看你那个app。", w: "Partner" },
      { p: "I check. Sixty percent. Sixty percent means I carry an umbrella all day for a chance of rain that may never come, and if I don't, it rains — this is the deal I have with the weather, and the weather always wins.", z: "我看了。60%。60%的意思是：我得为了一场可能不会来的雨带一整天伞；而如果我不带，它就一定会下——这是我和天气之间的约定，而天气从来没输过。" },
      { p: "I take the umbrella. Downstairs, the lift takes long enough that I have time to remember, briefly and with total clarity, that I left the kitchen light on.", z: "我拿了伞。楼下电梯来得够慢，慢到我有一段完整的时间想起来——清清楚楚地想起来——厨房灯没关。" }
    ],
    notes: [
      { e: "pat my pockets", c: "拍一遍口袋（检查东西）", x: "Phone, keys, wallet — I pat my pockets before every exit." },
      { e: "about once a fortnight", c: "大概两周一次", x: "I lose my badge about once a fortnight." },
      { e: "the weather always wins", c: "天气从来没输过", x: "I never take the umbrella and the weather always wins." },
      { e: "with total clarity", c: "清清楚楚地（想起来）", x: "I remembered, with total clarity, that I'd left the oven on." }
    ]
  },

  {
    id: "s05", part: "commute", time: "8:35",
    t: "Eight stops standing", z: "站八站",
    lead: "早高峰的地铁里，所有人都在假装自己不挤。",
    paras: [
      { p: "I get on at the third stop, which is the difference between sitting down and standing for eight stops. I've run this experiment many times. Third stop: standing. If I left ten minutes earlier, second stop: sitting. Ten minutes of sleep versus a seat. I choose sleep almost every day, and then I resent the seat I don't have.", z: "我在第三站上车——这一站的区别，就是坐着还是站八站。这个实验我做过很多次：第三站，站着；早出门十分钟，第二站，坐着。十分钟睡眠换一个座位。我几乎每天都选睡眠，然后又为自己没座位而生闷气。" },
      { p: "Everyone on this train is doing the same thing: pretending not to be touching anyone. It's a skill you pick up in about a month and never formally learn. Elbows in, bag in front, eyes somewhere neutral and slightly above everyone's head.", z: "这趟车上的每个人都在做同一件事：假装自己没碰到任何人。这技能大概一个月就学会了，从来没人正式教过。手肘收进来，包抱在前面，眼睛看向某个中立的位置——略微高过所有人的头顶。" },
      { p: "The doors open, nobody gets off, and somehow six more people get on. There is no physics to explain this. I've stopped trying.", z: "门开了，没人下车，然后神奇的又挤进来六个人。这事没有物理学能解释。我已经放弃理解了。" },
      { p: "Next stop is mine. I start moving early, because on this line you either commit to getting off or you accept that you're getting off at the stop after.", z: "下一站是我的。我提前开始挪动，因为在这条线上，你要么果断下车，要么接受自己在下一站下车。" },
      { p: "Excuse me, getting off.", z: "不好意思，下车。", w: "Me" },
      { p: "I say it to nobody in particular and it works about sixty percent of the time, which in rush hour counts as a result.", z: "我不对着任何人说这句话，成功率大概六成——在早高峰里，这已经算成果了。" }
    ],
    notes: [
      { e: "get on / get off", c: "上车 / 下车（公交地铁）", x: "I get on at the third stop and get off at the eleventh." },
      { e: "pick up a skill", c: "不知不觉学会一个技能", x: "You pick up the etiquette in about a month." },
      { e: "commit to getting off", c: "果断下车（别犹豫）", x: "Either commit to getting off or you'll miss your stop." },
      { e: "in rush hour", c: "在高峰时段", x: "In rush hour, sixty percent counts as a result." }
    ]
  },

  {
    id: "s06", part: "commute", time: "8:58",
    t: "Elevator small talk", z: "电梯里的三十秒",
    lead: "电梯里遇到同事，三十秒。够尴尬，不够聊完任何事。",
    paras: [
      { p: "The elevator is the worst place for a conversation, because it's long enough to require one and short enough that you can't actually finish it. Thirty seconds. Nobody is going to solve anything in thirty seconds, and yet every morning, we try.", z: "电梯是全世界最不适合聊天的地方：它长到必须有话说，又短到你根本说不完。三十秒。没人能在三十秒里解决任何事，但每天早上我们都在试。" },
      { p: "Morning! You're early.", z: "早！今天挺早啊。", w: "Coworker" },
      { p: "Yeah, meeting at nine. Didn't want to risk it.", z: "嗯，九点有个会，不想冒险。", w: "Me" },
      { p: "Smart. The lift was down yesterday, did you hear?", z: "明智。昨天电梯坏了，你听说了吗？", w: "Coworker" },
      { p: "I hadn't, and now I have twelve seconds to care about it. I make the right noises. The doors open on our floor and the conversation ends exactly where all elevator conversations end: mid-sentence, unresolved, fine.", z: "我没听说，现在我有十二秒来关心这件事。我发出得体的声音。门在我们那层打开，对话停在所有电梯对话都会停的地方：话说到一半、没有结论、也挺好的。" },
      { p: "We both walk to our desks. It was a good conversation, by elevator standards.", z: "我们各自走向工位。按电梯的标准，这算是一次不错的对话。" }
    ],
    notes: [
      { e: "you're early", c: "你今天挺早（寒暄）", x: "Morning! You're early today." },
      { e: "didn't want to risk it", c: "不想冒险（怕迟到）", x: "I left twenty minutes early — didn't want to risk it." },
      { e: "make the right noises", c: "发出得体的回应（其实没在意）", x: "I wasn't listening, but I made the right noises." },
      { e: "by ... standards", c: "按……的标准来说", x: "By my standards, that's a win." }
    ]
  },

  {
    id: "s07", part: "work", time: "9:30",
    t: "Stand-up", z: "晨会，三十秒汇报",
    lead: "站会每人三十秒。我永远在说最后一句时才想明白自己今天要干嘛。",
    paras: [
      { p: "Stand-up is fifteen minutes and eight people, which means each of us gets roughly ninety seconds, minus the time someone spends explaining why their thing was blocked. I've learned to prepare my two sentences while the person before me is still talking, which I recognise is exactly the rudeness I complain about in others.", z: "站会十五分钟、八个人，也就是每人大概九十秒，还要扣掉某人解释自己为什么被卡住的时间。我学会了在前一个人还在说的时候就准备好自己的两句话——我承认，这恰恰是我抱怨别人做的那种没礼貌。" },
      { p: "Yesterday I finished the reconciliation, today I'm starting on the vendor list, no blockers.", z: "昨天我把对账做完了，今天开始处理供应商名单，没有阻塞。", w: "Me" },
      { p: "It sounds clean. What it leaves out is that I finished the reconciliation at 7 p.m., that the vendor list is a spreadsheet nobody has touched since March, and that 'no blockers' really means 'one blocker, but it's a person and I'd rather deal with it privately.'", z: "听起来很干净。它省略掉的是：那份对账我是晚上七点做完的；供应商名单是一张从三月起没人碰过的表；而「没有阻塞」真正的意思是「有一个，但那是一个人，我宁愿私下解决」。" },
      { p: "Everyone nods. Nobody wants details at 9:30. We all want the same thing from stand-up: to say our piece, be briefly witnessed, and get back to it.", z: "大家都点头。九点半没人想要细节。我们对站会的要求是一样的：说两句、被短暂看见、然后回去干活。" }
    ],
    notes: [
      { e: "no blockers", c: "没有阻塞（站会黑话）", x: "Yesterday I closed the tickets, today I'll pick up the new one, no blockers." },
      { e: "say my piece", c: "把话说完（不一定有人听）", x: "Let me say my piece and then I'll drop it." },
      { e: "get back to it", c: "回去干活", x: "Meeting's over — let's get back to it." },
      { e: "I recognise that ...", c: "我承认……（自我吐槽）", x: "I recognise that I do the same thing." }
    ]
  },

  {
    id: "s08", part: "work", time: "11:10",
    t: "Can you squeeze this in", z: "临时插进来的活",
    lead: "「这个能不能今天弄完」——这句话从来没有答案，只有代价。",
    paras: [
      { p: "It always arrives in the same shape. A message, not a call. Starts with a sorry, ends with a deadline, and in the middle is a sentence I have learned to read very carefully: 'It's pretty quick, should only take you an hour.'", z: "它总是以同一种形状出现。一条消息，不是电话。开头是sorry，结尾是deadline，中间夹着一句我已经学会仔细读的话：「很快的，你一个小时应该就够了」。" },
      { p: "Nothing that starts with 'pretty quick' has ever taken an hour. I've tested this. The sample size is large and the result is consistent.", z: "没有一件以「很快的」开头的事，在一个小时内完成过。我测过。样本量很大，结果很稳定。" },
      { p: "Can you squeeze this in today?", z: "这个今天能挤进去吗？", w: "Coworker" },
      { p: "Depends what moves.", z: "看什么要让路。", w: "Me" },
      { p: "It's a good answer, and it took me four years to learn it. 'Sure' means it's now my problem. 'No' makes me the person who says no. 'Depends what moves' puts the decision back where it belongs — with the person who owns the deadline, not the person who owns the work.", z: "这是个好答案，我花了四年才学会。说「行」意味着这事从此是我的问题；说「不行」会让我变成那个说不行的人；而「看什么要让路」把决定权还回了它该在的地方——在拥有deadline的人手里，而不是在拥有这份工作的人手里。" },
      { p: "We agree the Friday thing can slip. I write it down, because 'we agreed' without a written note is just a nice conversation.", z: "我们商定周五那件可以往后挪。我把它记下来，因为没有落在纸上的「我们商定过了」，只是一段愉快的对话。" }
    ],
    notes: [
      { e: "squeeze this in", c: "把这个挤进去（加活）", x: "Can you squeeze this in before Friday?" },
      { e: "depends what moves", c: "看什么要让路（不答应也不拒绝）", x: "I can do it — depends what moves." },
      { e: "the person who says no", c: "那个说不行的人（负面标签）", x: "Nobody wants to be the person who says no." },
      { e: "without a written note", c: "没有落在纸面上的", x: "Verbal agreements without a written note don't survive Monday." }
    ]
  },

  {
    id: "s09", part: "work", time: "12:30",
    t: "The lunch debate", z: "午饭吃什么",
    lead: "十二点半，四个人，十五分钟，讨论一个永远没有结论的问题。",
    paras: [
      { p: "Lunch takes fifteen minutes to decide and twelve minutes to eat. This ratio is stable across every office I've worked in, and I've stopped expecting it to improve.", z: "午饭要花十五分钟决定、十二分钟吃完。这个比例在我待过的每个办公室都稳定成立，我已经不指望它会改善了。" },
      { p: "The debate has four moves. Someone suggests something. Someone says they had it yesterday. Someone suggests the place that's too far. Someone says 'I'm easy, whatever you want,' which sounds flexible and actually means 'I will veto the first two options.'", z: "这场辩论有四步：有人提一个；有人说昨天吃过了；有人提一家太远的；有人说「我都行，你们定」——听上去随和，实际意思是「前两个我都会否决」。" },
      { p: "I'm easy, whatever you want.", z: "我都行，你们定。", w: "Coworker" },
      { p: "That's not an answer, Lin.", z: "那不是答案啊，Lin。", w: "Me" },
      { p: "We end up at the noodle place on the corner, which is where we always end up. The walk there is seven minutes, which leaves five minutes of actual eating, which is why all of us are slightly hungry at 3 p.m. and all of us pretend it's a surprise.", z: "最后我们去了转角那家面馆，也就是我们每次最后都会去的那家。走过去七分钟，剩下五分钟真正吃饭——这就是为什么我们所有人下午三点都会有点饿，而所有人都在假装这是个意外。" }
    ],
    notes: [
      { e: "I'm easy", c: "我都行（其实有意见）", x: "I'm easy, whatever you want — just not spicy." },
      { e: "veto an option", c: "否决一个选项", x: "He'll veto the first two options and call it being easy." },
      { e: "end up at ...", c: "最后去了……", x: "We always end up at the noodle place." },
      { e: "pretend it's a surprise", c: "假装这是个意外", x: "We're all tired at 3 p.m. and pretend it's a surprise." }
    ]
  },

  {
    id: "s10", part: "work", time: "14:00",
    t: "This could have been an email", z: "这个会本可以是一封邮件",
    lead: "四十分钟的会，前二十五分钟在对齐背景，最后五分钟才是真正的事。",
    paras: [
      { p: "There's a specific feeling you get around minute twenty-five of a meeting: the realisation that the actual decision will take four minutes, and the other twenty-one were spent getting eight people to the same sentence.", z: "会议开到第二十五分钟左右，会有一种特定的感觉：你意识到真正的决定只需要四分钟，而另外二十一分钟是用来把八个人带到同一句话上。" },
      { p: "I don't mind meetings. I mind meetings that are documents pretending to be conversations. If the point is to tell me something, send it. If the point is to decide something with me, then let's decide it and go.", z: "我不讨厌开会。我讨厌那些假装是对话的文件。如果目的是告诉我一件事，那就发过来；如果目的是跟我一起决定一件事，那就决定完走人。" },
      { p: "So, just to align on context —", z: "那，先对齐一下背景——", w: "Coworker" },
      { p: "Sorry, quick one: what's the decision we need out of this?", z: "打断一下：我们这个会需要产出什么决定？", w: "Me" },
      { p: "It's a risky sentence. It can read as impatient. But ninety percent of the time it saves twenty minutes, and the other ten percent the room says 'good question' and someone realises there isn't one — which is also worth knowing.", z: "这话有风险，可能被理解为不耐烦。但九成的情况下它能省二十分钟；另外一成的情况，全场会说「问得好」，然后有人意识到根本没有要做的决定——这也值得知道。" },
      { p: "We decide it in six minutes. Everyone leaves happy. Nobody ever says the obvious thing out loud: we could have skipped the first twenty-five.", z: "我们用六分钟决定了。大家开心地散会。没人把那句显而易见的话说出口：前面那二十五分钟本来可以省掉。" }
    ],
    notes: [
      { e: "this could have been an email", c: "这事发封邮件就行（吐槽开会）", x: "Forty minutes of context — this could have been an email." },
      { e: "align on context", c: "对齐背景（会议黑话）", x: "Let's align on context before we discuss options." },
      { e: "what's the decision we need", c: "我们要产出什么决定", x: "What's the decision we need out of this meeting?" },
      { e: "it can read as ...", c: "这话可能被理解为……", x: "It's direct, but it can read as rude." }
    ]
  },

  {
    id: "s11", part: "work", time: "16:40",
    t: "Chasing a file", z: "催人要文件",
    lead: "催人是不好受的，尤其是催一个你不熟的人。于是催人变成了一门措辞的艺术。",
    paras: [
      { p: "Chasing someone for a file is an art form, because the request is simple and the relationship is not. You need a thing. They have the thing. They haven't sent it. And you have to say all of this without sounding like you're keeping score.", z: "催人要文件是一门艺术，因为这件事本身简单，关系不简单。你需要一个东西，对方有这个东西，对方还没发。而你得把这一切说出口，又不能听起来像在记账。" },
      { p: "The first message is always gentle: 'Hey, any chance you've had a look at that?' The second, two days later, is gentler still, which is strange, because by then you're actually more annoyed, not less.", z: "第一条消息总是温和的：「嘿，那个你看了吗？」两天后的第二条更温和——这很奇怪，因为到那时你其实更烦了，不是更不烦。" },
      { p: "Hi! Just circling back on the numbers file — no rush if you're buried, I just want to check it's still on your list.", z: "嗨，我回来问一下那个数据表——你要是忙得埋起来了不着急，我就是确认一下它还在你清单上。", w: "Me" },
      { p: "'Circling back' means I never stopped thinking about it. 'No rush' means there is a rush. 'Still on your list' means it has been on your list for six days. Everyone knows this. Everyone writes it anyway, because the alternative is honest and honesty at 4:40 p.m. on a Wednesday costs relationships.", z: "「回来问一下」意思是我从没停止想这件事；「不着急」意思是急；「还在你清单上」意思是它已经在你清单上躺了六天。所有人都知道。所有人还是这么写，因为另一选项是诚实，而周三下午四点四十的诚实是要花关系成本的。" },
      { p: "It arrives at 6:12 p.m., with 'sorry for the delay!!' and no explanation. It's exactly what I needed. I say thanks, and mean it, and make a private note to ask two days earlier next time.", z: "它下午六点十二分到了，附一句「抱歉晚了！！」，没有任何解释。完全是我要的东西。我说谢谢，是真心的，然后私下记了一笔：下次提前两天问。" }
    ],
    notes: [
      { e: "circle back on sth", c: "回头再来问某事（催人）", x: "Just circling back on that file." },
      { e: "if you're buried", c: "如果你忙得埋起来了", x: "No rush if you're buried, just checking." },
      { e: "still on your list", c: "还在你待办里吗", x: "I just want to check it's still on your list." },
      { e: "sorry for the delay", c: "抱歉晚了", x: "Sorry for the delay — here it is." }
    ]
  },

  {
    id: "s12", part: "work", time: "18:35",
    t: "Packing up", z: "收拾东西下班",
    lead: "该走了，但没人动。第一个站起来的人承担了所有心理压力。",
    paras: [
      { p: "The hardest part of leaving on time isn't the work. It's the standing up. At 6:30 everyone in the room is finished and nobody is leaving, because the first person to stand up makes a statement about everyone else.", z: "准时下班最难的部分不是工作，是站起来那一下。六点半，屋里所有人都做完了，没人走——因为第一个站起来的人，等于替所有人发表了一份声明。" },
      { p: "So we all develop the same technique: pack slowly. Put the laptop in the bag at a normal pace. Don't put your coat on at your desk. Walk out like you're going to the bathroom and simply never come back.", z: "于是我们都练成了同一套技术：慢慢收拾。以正常速度把电脑放进包里。别在工位上穿外套。走出去的时候像是去洗手间，然后就再也没回来。" },
      { p: "You heading off?", z: "你走了？", w: "Coworker" },
      { p: "Yeah, I'll pick this up tomorrow. Night.", z: "嗯，明天接着弄。拜。", w: "Me" },
      { p: "'I'll pick this up tomorrow' is the sentence that makes leaving legal. It tells the room you haven't abandoned anything, you've just scheduled the rest of it. It's almost always true. That's why it works.", z: "「明天接着弄」这句话让下班变得合法。它告诉全屋人你没丢下什么，你只是把剩下的排到了明天。而且它几乎总是真的——这正是它管用的原因。" },
      { p: "Outside it's properly dark, which in winter means the day has been stolen from me in two installments: the morning by the office, the evening by the office. I get on the train and don't think about work for eleven minutes, which is a personal record.", z: "外面已经很黑了——冬天里，这意味着我的一天被分两期偷走了：早上被公司偷走，晚上被公司偷走。上了地铁，我有十一分钟没想工作，这是个人纪录。" }
    ],
    notes: [
      { e: "head off", c: "走了、出发了", x: "You heading off? I'll finish this." },
      { e: "pick this up tomorrow", c: "明天接着弄（下班护身符）", x: "I'll pick this up tomorrow morning." },
      { e: "make a statement about ...", c: "等于对……表态", x: "Leaving first makes a statement about everyone else." },
      { e: "at a normal pace", c: "以正常速度（别显得急着跑）", x: "Pack up at a normal pace, don't sprint for the door." }
    ]
  },

  {
    id: "s13", part: "evening", time: "19:40",
    t: "What's for dinner", z: "晚饭吃什么",
    lead: "回家打开冰箱，跟早上一样，还是那些东西。但晚上有耐心一点。",
    paras: [
      { p: "I open the fridge, again, and it's the same fridge from this morning, with the same four things in it. The difference is that at night I have enough patience to actually cook, and at night the phrase 'let's just order something' is available, which it isn't at seven in the morning.", z: "我又打开冰箱，还是早上那个冰箱，里面还是同样的四样东西。区别在于，晚上我有足够的耐心真的做点什么，而且晚上「要不点外卖吧」这个选项是开放的——早上七点它不是。" },
      { p: "There's a ten-minute window in every evening where cooking still feels like a good idea. After that window closes, it's delivery. I've learned to start within eight minutes of walking through the door, or not at all.", z: "每个晚上都有一个十分钟窗口，在那里面做饭还算是个好主意。窗口一关，就变外卖。我学会了在进门八分钟内动手，否则就别做。" },
      { p: "I'll do the rice if you handle the greens.", z: "我煮饭，你弄青菜。", w: "Me" },
      { p: "Deal. Don't put garlic in it this time.", z: "成交。这次别放蒜。", w: "Partner" },
      { p: "I always put garlic in it. She always says this. Neither of us is going to change, and somehow this is one of the most stable things in my life.", z: "我每次都放蒜。她每次都说这句。我们俩谁都不会改，而这件事不知怎么成了我生活里最稳定的东西之一。" },
      { p: "We eat at the small table with one chair pulled up and the TV off. Twenty minutes, no phones. It's the part of the day I'd defend in an argument.", z: "我们在小桌子上吃饭，拉过来一把椅子，电视关着。二十分钟，不看手机。这是一天里我会据理力争去保住的那一段。" }
    ],
    notes: [
      { e: "let's just order something", c: "要不点外卖吧", x: "Too tired to cook — let's just order something." },
      { e: "I'll do X if you handle Y", c: "我干X你干Y（分工）", x: "I'll do the rice if you handle the greens." },
      { e: "neither of us is going to change", c: "我们俩谁都不会改", x: "We've argued about it for years. Neither of us is going to change." },
      { e: "with the TV off", c: "关着电视（不看）", x: "We eat with the TV off and the phones face down." }
    ]
  },

  {
    id: "s14", part: "evening", time: "20:50",
    t: "Bath time and the missing homework", z: "洗澡与失踪的作业",
    lead: "八点半到九点半是一天里最吵的半小时，也是最值得记录的一段英语。",
    paras: [
      { p: "The half hour between homework and bed is the loudest part of the day, and also the part where I do the most negotiating per minute. Nobody is being difficult on purpose. It's just that everyone in this flat wants a different version of the next thirty minutes.", z: "从作业到睡觉的那半小时，是一天里最吵的，也是我每分钟谈判次数最多的一段。没人故意为难谁。只是这套房子里每个人想要的，都是接下来三十分钟的不同版本。" },
      { p: "You said five minutes and it's been twenty.", z: "你说五分钟，已经二十分钟了。", w: "Me" },
      { p: "I'm on the last one.", z: "我在做最后一道了。", w: "Kid" },
      { p: "'I'm on the last one' is the same sentence I say about socks, about emails, about everything. Hearing it come out of a nine-year-old is uncomfortable in a way I don't enjoy examining.", z: "「我在做最后一道了」——这句话我说袜子的时候说过，说邮件的时候说过，说什么都说过。听到它从一个九岁小孩嘴里说出来，那种不自在我不太想深究。" },
      { p: "Bath first or homework first? We've had this debate eleven hundred times and the answer is always homework first, and it will still be asked tomorrow, because the function of the question isn't to get an answer. It's to delay.", z: "先洗澡还是先作业？这场辩论我们进行过一千一百次，答案永远是先作业，明天它还是会被问一遍——因为这个问题的功能不是得到答案，是拖延。" },
      { p: "By 9:30 the flat goes quiet and I stand in the kitchen for a minute, not doing anything, enjoying a silence I was too tired to enjoy twenty minutes ago.", z: "九点半，屋里安静下来。我在厨房站了一分钟，什么都没做，享受着二十分钟前我累得享受不了的安静。" }
    ],
    notes: [
      { e: "I'm on the last one", c: "我在做最后一个了（拖延专用）", x: "I'm on the last one, two minutes." },
      { e: "on purpose", c: "故意的", x: "Nobody is being difficult on purpose." },
      { e: "the function of the question", c: "这个问题的作用", x: "The function of the question isn't to get an answer." },
      { e: "too tired to enjoy", c: "累得无法享受", x: "I was too tired to enjoy the quiet." }
    ]
  },

  {
    id: "s15", part: "evening", time: "22:10",
    t: "Making plans", z: "微信上约周末",
    lead: "约人这件事，中文里三句解决，英文里要绕一圈才显得不强势。",
    paras: [
      { p: "Making plans in English takes more words than it does in Chinese, and it took me a while to understand why. It's not that English is wordier. It's that English-speaking culture seems to treat a plan as something you arrive at together, not something you propose and confirm.", z: "用英文约人比中文费字，我花了好一阵才明白为什么。不是英文更啰嗦，而是英语文化似乎把「计划」当成一件大家一起走到那儿的事，而不是你提出、对方确认的事。" },
      { p: "We should do something this weekend. Are you around Saturday?", z: "这周末咱们搞点什么吧。你周六在吗？", w: "Me" },
      { p: "Saturday's a bit up in the air — can I let you know Friday?", z: "周六还有点悬，我周五告诉你行吗？", w: "Friend" },
      { p: "'Up in the air' is the phrase I'd translate as 待定, and it's the honest version of 'maybe'. It means no decision has been made and nothing is being hidden from you. I've learned not to push it. Pushing turns a soft maybe into a hard no.", z: "「up in the air」我会翻译成「待定」，它是「maybe」的诚实版本。意思是还没决定，也没有瞒你什么。我学会了别逼问——一逼，软的maybe就变成硬的不行。" },
      { p: "So I say 'sounds good, just let me know,' and I genuinely leave it. The plan may happen, may not, and both are fine. This took practice. My instinct is to pin everything down on the first message.", z: "于是我说「好啊，到时候告诉我」，然后真的就放下了。这事可能发生，也可能不发生，两种都行。这是练出来的——我的本能是在第一条消息里把一切都钉死。" }
    ],
    notes: [
      { e: "are you around", c: "你在吗 / 有空吗", x: "Are you around this weekend?" },
      { e: "up in the air", c: "悬着、待定", x: "Saturday's a bit up in the air." },
      { e: "can I let you know Friday", c: "我周五告诉你行吗", x: "Can I let you know by Friday?" },
      { e: "pin everything down", c: "把一切钉死（确定下来）", x: "My instinct is to pin everything down immediately." }
    ]
  },

  {
    id: "s16", part: "evening", time: "23:20",
    t: "Scrolling in the dark", z: "关灯后刷手机",
    lead: "说好十一点睡，现在十一点二十，屏幕亮度是我唯一承认的错误。",
    paras: [
      { p: "I said eleven. It's 11:23 and I'm lying in the dark, holding my phone above my face, reading about a city I will never visit. This is not relaxation. It's the day refusing to end.", z: "我说十一点。现在十一点二十三，我躺在黑暗里，把手机举在脸上方，读着一个我永远不会去的城市。这不是放松，这是这一天拒绝结束。" },
      { p: "There's a moment, right around now, when I know exactly what I'm doing and do it anyway. I call it the last scroll. It's never the last scroll.", z: "总有这么一个时刻，大概就是现在，我清清楚楚知道自己在干嘛，然后继续干。我管它叫「最后刷一下」。它从来不是最后一下。" },
      { p: "Five more minutes and I'm putting it down.", z: "再五分钟我就放下。", w: "Me" },
      { p: "It's the same sentence from this morning, aimed at the other end of the day. I am, it turns out, extremely consistent.", z: "跟早上那句是同一句，只是对准了一天的另一头。事实证明，我这人非常一致。" },
      { p: "Eventually I put it face down on the floor, which is far enough away that picking it up requires a decision. That's the whole system. Not discipline — distance.", z: "最后我把它屏幕朝下放在地板上，远到要拿起来就得做一个决定。这就是整套系统。不是自律，是距离。" }
    ],
    notes: [
      { e: "I said eleven", c: "我说好十一点的（口语省略）", x: "I said eleven and it's already midnight." },
      { e: "the last scroll", c: "最后刷一下（永远不会是最后）", x: "It's the last scroll. It's never the last scroll." },
      { e: "do it anyway", c: "明知故犯", x: "I know exactly what I'm doing and do it anyway." },
      { e: "face down", c: "屏幕朝下", x: "I put it face down on the floor." }
    ]
  },

  {
    id: "s17", part: "weekend", time: "Sat 9:30",
    t: "The market run", z: "周末去菜市场",
    lead: "周末上午的菜市场，是一周里唯一一个不用排队也不用解释的地方。",
    paras: [
      { p: "The market on a Saturday morning is the only place all week where I'm not waiting for anything. No ticket number, no ticket system, no 'we'll get back to you.' You point, they weigh it, you pay, done. Forty seconds, complete.", z: "周六上午的菜市场，是一周里唯一一个我不用等任何东西的地方。没有取号，没有系统，没有「我们回头联系你」。你指一下，他称一下，你付钱，完事。四十秒，闭环。" },
      { p: "I've decided to stop asking for prices in advance. It's slower, but saying 'how much' before they wrap it makes the whole thing feel like a transaction, and I'd rather it feel like two people doing a small piece of business.", z: "我决定不再提前问价了。这样慢一点，但在他们包起来之前问「多少钱」，会让整件事变得像一笔交易；我宁愿它像两个人做了一笔小生意。" },
      { p: "How much for the greens?", z: "青菜怎么卖？", w: "Me" },
      { p: "Four. Take two bunches, six.", z: "四块。拿两把，六块。", w: "Vendor" },
      { p: "I take two bunches. He throws in three spring onions without comment, which is not a discount, it's a relationship, and the difference matters to me more than fifty cents does.", z: "我拿了两把。他没说话，顺手丢进三根葱。这不是打折，这是关系——而这个区别对我的意义，比五毛钱大。" },
      { p: "Back home I unpack on the counter and feel, briefly, like someone who has their life together. It lasts until about eleven, when I remember the laundry.", z: "回家把东西摊在灶台上，有那么一瞬间觉得自己是个把生活安排明白的人。这种感觉持续到大概十一点，然后我想起来还有衣服没洗。" }
    ],
    notes: [
      { e: "how much for ...", c: "……怎么卖", x: "How much for the greens?" },
      { e: "take two bunches", c: "拿两把", x: "Take two bunches, it's six." },
      { e: "throw in", c: "额外送（搭着给）", x: "He threw in three spring onions." },
      { e: "have my life together", c: "把生活安排明白", x: "For about an hour I feel like I have my life together." }
    ]
  },

  {
    id: "s18", part: "weekend", time: "Sun 5:00",
    t: "One more set", z: "最后一组",
    lead: "健身房的谎言只有一句，就是「最后一组」。它跟「再睡五分钟」是同一句。",
    paras: [
      { p: "Every gym has one sentence that keeps the whole business running, and it's 'one more set.' It's the same sentence as 'five more minutes,' just aimed at a different kind of tired.", z: "每家健身房都靠一句话运转，那就是「最后一组」。它跟「再睡五分钟」是同一句话，只是对准了另一种累。" },
      { p: "I'm on my third one-more-set. There is a version of me that could have left after the second, but that version doesn't go to the gym on a Sunday, so here we are.", z: "我现在是第三个「最后一组」了。存在一个本可以在第二组之后就走的我，但那个我周日不会来健身房，所以我们走到了这里。" },
      { p: "Are you using this?", z: "这个你还在用吗？", w: "Coworker" },
      { p: "Yeah, two more. Take it after.", z: "嗯，还两组。用完给你。", w: "Me" },
      { p: "'Are you using this' is the most efficient sentence in any gym. Five words, no ambiguity, and it prevents the thing everyone is quietly worried about: standing next to someone else's machine doing nothing.", z: "「这个你还在用吗」是任何健身房里效率最高的一句话。五个词，没有歧义，而且它避免了所有人私下都在担心的事：站在别人的器械旁边干瞪眼。" },
      { p: "On the way out I feel the specific good tired that makes stairs an event. I'll be sore tomorrow, I'll complain about it, and I'll go back on Thursday. This is the deal.", z: "出门时我感到那种特定的、让楼梯变成一件大事的健康的累。明天我会酸痛，我会抱怨，然后周四我还会去。这就是约定。" }
    ],
    notes: [
      { e: "one more set", c: "最后一组（通常不是最后）", x: "One more set and then I'm done." },
      { e: "are you using this", c: "这个你还在用吗（健身房）", x: "Are you using this? No? Mind if I take it?" },
      { e: "take it after", c: "用完给你", x: "I've got two more, take it after." },
      { e: "the deal", c: "就这么说定了 / 这就是约定", x: "I'll complain, and I'll go back. That's the deal." }
    ]
  }
];
