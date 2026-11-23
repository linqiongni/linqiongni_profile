/* 日常英语 · 内容数据
 * 一篇 = 一个对象。新增课文：用 `python3 scripts/add_daily_english.py "<docx路径>"` 从同格式 Word 生成；
 * 默认追加末尾，加 `--before <id>` 可插到指定课文前（如 --before cleaning-routine）。
 * 字段：id(英文短标识) / title(英文标题) / zh(中文标题) / tag(主题标签) / section(小节标题)
 *       blocks:[{en,zh,words,note}] / replacements:[{en,zh}]
 */
window.DAILY_LESSONS = [
  {
    "id": "getting-up",
    "title": "Getting Up",
    "zh": "起床",
    "tag": "日常生活",
    "section": "Getting out of bed | 起床过程",
    "blocks": [
      {
        "en": "The worst part of the day for me is definitely when I have to get up. Waking up, that I can handle. But getting up? That, I hate.",
        "zh": "对我来说，一天中最难熬的时刻绝对是必须起床的时候。醒过来这件事，我还能接受；但真正从床上起来，我很讨厌。",
        "words": "the worst part of the day = 一天中最糟糕的部分；have to get up = 不得不起床；I can handle that = 那件事我还能应付；That, I hate. = 那个我很讨厌",
        "note": "Waking up 和 getting up 都是动名词短语作话题，但含义不同：wake up 是“醒来”，get up 是“起床”。That, I hate 把宾语 That 前置，用于加强语气。"
      },
      {
        "en": "The covers I have on my bed are heavy, mostly because I have a comforter as well as a light blanket. I sleep with two pillows, which for some reason have different color pillowcases. Well, at least the sheets match.",
        "zh": "我床上的盖被很重，主要是因为除了一床厚被子，我还有一条薄毯。我睡觉时用两个枕头，不知为什么，它们的枕套颜色不同。不过，至少床单的颜色是搭配的。",
        "words": "covers = 床上的盖被、床上用品；mostly because = 主要因为；as well as = 以及、除……之外还有；for some reason = 不知为什么；at least = 至少",
        "note": "I have on my bed 是省略关系代词 that/which 的定语从句，修饰 covers。which 引导非限制性定语从句，补充说明 two pillows。as well as 强调“除此之外还有”。"
      },
      {
        "en": "I sometimes wake up before the alarm goes off. I like to keep the alarm at a low volume, with some classical music, nothing too jarring.",
        "zh": "有时我会在闹钟响之前醒来。我喜欢把闹钟音量调低，用一些古典音乐作为铃声，不要太刺耳。",
        "words": "before the alarm goes off = 在闹钟响之前；keep ... at a low volume = 把……保持在较低音量；classical music = 古典音乐；nothing too jarring = 不要太刺耳、太突然",
        "note": "go off 用于闹钟时表示“响起”。keep A at B 表示“使A保持在B状态”。with some classical music 是伴随说明，nothing too jarring 是补充限定。"
      },
      {
        "en": "My old roommate used to like the terrible buzzer that you find on most alarm clocks nowadays. That sound always used to drive me nuts.",
        "zh": "我以前的室友喜欢现在大多数闹钟上都有的那种难听蜂鸣声。那种声音过去总能把我逼疯。",
        "words": "old roommate = 以前的室友；used to like = 过去喜欢；buzzer = 蜂鸣器、蜂鸣声；nowadays = 如今；drive me nuts = 把我逼疯、让我十分烦躁",
        "note": "used to do 表示过去经常发生、现在已经改变。that you find on most alarm clocks 是定语从句，修饰 buzzer。drive someone nuts 是常见口语表达。"
      },
      {
        "en": "As I was saying, I sometimes wake up before the alarm, usually because of some noise outside the house: a car door slamming, an alarm going off, or gunfire. Well, okay, not gunfire, but man, is my neighborhood noisy!",
        "zh": "正如我刚才所说，我有时会在闹钟响之前醒来，通常是因为屋外的噪声，例如车门砰地关上、警报器响起，或者枪声。好吧，并没有枪声，但天哪，我住的社区可真吵！",
        "words": "as I was saying = 正如我刚才所说；because of = 因为，后接名词或短语；a car door slamming = 车门砰地关上；an alarm going off = 警报器响起；is my neighborhood noisy! = 我的社区可真吵",
        "note": "冒号后列举屋外噪声。slamming 和 going off 是现在分词结构。but man, is my neighborhood noisy 是倒装感叹表达，用来加强“非常吵”的语气。"
      },
      {
        "en": "Of course, when I'm staying in a hotel, it's usually easier to get a wake-up call from the hotel than to set the alarm. I'm not really an early riser, so I don't jump out of bed ready to take on the world.",
        "zh": "当然，住酒店时，让酒店提供叫醒服务通常比自己设置闹钟更方便。我不算早起型的人，因此不会一下子跳下床，精神饱满地准备迎接新的一天。",
        "words": "stay in a hotel = 住酒店；wake-up call = 叫醒服务；early riser = 习惯早起的人；jump out of bed = 迅速跳下床；take on the world = 精力充沛地迎接挑战",
        "note": "it's easier to do A than to do B 是比较句型，表示“做A比做B更容易”。ready to take on the world 是形容词短语，补充说明起床时的状态。"
      },
      {
        "en": "I get up very slowly, usually one foot on the floor at a time. Once in a while, I'll oversleep, but not too often. I really love the weekends, when I can sleep in.",
        "zh": "我起床很慢，通常一只脚先落地，再放下另一只脚。偶尔我会睡过头，但并不经常。我非常喜欢周末，因为周末可以睡懒觉。",
        "words": "one foot ... at a time = 一次放下一只脚；once in a while = 偶尔；oversleep = 睡过头；sleep in = 睡懒觉、晚起",
        "note": "at a time 表示“一次、每次”。will 在这里表示偶尔会发生的习惯性情况。when I can sleep in 是非限制性定语从句，补充说明 weekends。"
      }
    ],
    "replacements": [
      {
        "en": "I'm not a morning person, so it takes me a while to get out of bed.",
        "zh": "我不是早起型的人，所以要过一会儿才能起床。"
      },
      {
        "en": "I prefer a gentle alarm sound rather than a loud buzzer.",
        "zh": "比起刺耳的蜂鸣声，我更喜欢柔和的闹铃。"
      },
      {
        "en": "Sometimes outside noise wakes me up before my alarm.",
        "zh": "有时屋外的噪声会在闹钟响之前把我吵醒。"
      },
      {
        "en": "When I stay at a hotel, I usually request a wake-up call.",
        "zh": "住酒店时，我通常会要求提供叫醒服务。"
      },
      {
        "en": "On weekends, I like to turn off the alarm and sleep in.",
        "zh": "周末我喜欢关掉闹钟睡懒觉。"
      }
    ]
  },
  {
    "id": "cleaning-routine",
    "title": "Cleaning Routine",
    "zh": "清洁",
    "tag": "日常生活 · 晨间洗漱",
    "section": "Morning bathroom routine | 早晨洗漱流程",
    "blocks": [
      {
        "en": "I go into my bathroom sometime around 6:45 a.m. My sink and medicine cabinet are on the left when you enter my bathroom. The toilet is next to them, with the tub in front.",
        "zh": "我通常在早上6点45分左右走进卫生间。进入卫生间后，洗手池和药柜在左侧。马桶就在旁边，浴缸位于前方。",
        "words": "sometime around 6:45 a.m. = 大约早上6点45分；medicine cabinet = 药柜；on the left = 在左边；with the tub in front = 浴缸在前面",
        "note": "when you enter my bathroom 是时间状语从句；with the tub in front 是 with 复合结构，用来补充说明浴室布局。"
      },
      {
        "en": "Anyway, I turn on the lights and try to find the mouthwash in the medicine cabinet. I pour a small amount into a cup, swish it around for 30 seconds, gargle, and spit.",
        "zh": "接着，我打开灯，试着在药柜里找到漱口水。我往杯子里倒少量漱口水，让漱口水在口中来回漱动30秒，然后漱喉并吐掉。",
        "words": "turn on the lights = 开灯；try to find = 试着寻找；pour a small amount into... = 往……里倒少量……；swish, gargle, and spit = 漱口、漱喉并吐掉",
        "note": "第二句使用连续动作结构：pour、swish、gargle、spit 共用主语 I，按时间顺序描述一整套动作。"
      },
      {
        "en": "Not pleasant, but necessary. Then I get out the floss. When I'm done flossing, I pull out the toothbrush and the toothpaste.",
        "zh": "这并不舒服，但很有必要。然后我拿出牙线。用牙线清洁完牙齿后，我取出牙刷和牙膏。",
        "words": "not pleasant, but necessary = 不舒服，但有必要；get out the floss = 拿出牙线；be done doing something = 做完某事；pull out = 取出、拿出",
        "note": "Not pleasant, but necessary 是省略句，完整表达可理解为 It is not pleasant, but it is necessary。When I'm done flossing 表示“当我用完牙线后”。"
      },
      {
        "en": "I brush my teeth, and then it's off to the shower. I pull the shower curtain aside, step into the tub, and pull the curtain back.",
        "zh": "我刷完牙，接着去洗澡。我把浴帘拉到一旁，迈进浴缸，再把浴帘拉回原位。",
        "words": "brush my teeth = 刷牙；it's off to... = 接着去……；pull ... aside = 把……拉到一旁；step into the tub = 迈进浴缸",
        "note": "it's off to the shower 是口语表达，表示“接下来去洗澡”。第二句同样用三个并列动词描述连续动作。"
      },
      {
        "en": "I turn on both the hot and the cold water, looking for the perfect temperature. I lather up with soap, put some shampoo in my hair, then rinse and dry off.",
        "zh": "我同时打开热水和冷水，调到合适的水温。我用肥皂打出泡沫，把洗发水抹在头发上，然后冲洗并擦干身体。",
        "words": "both the hot and the cold water = 热水和冷水两边；look for the perfect temperature = 调到最合适的水温；lather up with soap = 用肥皂打出泡沫；rinse and dry off = 冲洗并擦干身体",
        "note": "looking for the perfect temperature 是现在分词短语，说明打开冷热水时的目的或伴随状态。both A and B 表示“A和B两者都”。"
      },
      {
        "en": "Now it's shaving time. I used to own an electric razor, but I found it didn't shave close enough. So now I'm back to the old hand razor.",
        "zh": "现在该刮胡子了。我以前有一把电动剃须刀，但发现它剃得不够干净。因此，我现在又改回使用传统的手动剃须刀。",
        "words": "it's shaving time = 该刮胡子了；used to own = 以前拥有，现已不是；shave close = 把胡须剃得很贴面、很干净；be back to = 重新使用、回到……",
        "note": "used to do 表示过去经常做或过去存在、现在已经改变。I found (that) it didn't... 中省略了宾语从句连接词 that。"
      },
      {
        "en": "I lather up with shaving cream, and I start to shave. I rinse the razor and throw the disposable blades in the trash. It's about 7:00 a.m., and I'm on to breakfast.",
        "zh": "我在脸上涂好剃须膏，然后开始刮胡子。刮完后，我冲洗剃须刀，并把一次性刀片扔进垃圾桶。此时大约是早上7点，我接着去吃早餐。",
        "words": "lather up with shaving cream = 涂上剃须膏并打出泡沫；start to shave = 开始刮胡子；disposable blades = 一次性刀片；be on to breakfast = 接下来去吃早餐",
        "note": "throw A in B 表示“把A扔进B”。I'm on to breakfast 是自然口语，表示当前步骤结束后进入下一项活动。"
      }
    ],
    "replacements": [
      {
        "en": "I usually go into the bathroom at around 6:45 a.m.",
        "zh": "我通常在早上6点45分左右进卫生间。"
      },
      {
        "en": "When I finish flossing, I take out my toothbrush and toothpaste.",
        "zh": "用完牙线后，我拿出牙刷和牙膏。"
      },
      {
        "en": "I adjust the hot and cold water until the temperature feels right.",
        "zh": "我调节冷热水，直到水温合适。"
      },
      {
        "en": "The electric razor did not give me a close enough shave.",
        "zh": "电动剃须刀剃得不够干净。"
      },
      {
        "en": "After shaving, I rinse the razor and move on to breakfast.",
        "zh": "刮完胡子后，我冲洗剃须刀，接着去吃早餐。"
      }
    ]
  },
  {
    "id": "eating-breakfast",
    "title": "Eating Breakfast",
    "zh": "吃早餐",
    "tag": "日常生活",
    "section": "Morning breakfast routine | 早餐流程",
    "blocks": [
      {
        "en": "I walk into my kitchen and turn on the coffeemaker. I always put the coffee, filter, and water in the night before, so it's ready to go.",
        "zh": "我走进厨房，打开咖啡机。我总会在前一晚把咖啡、滤纸和水放好，这样第二天早上就可以直接启动咖啡机。",
        "words": "turn on the coffeemaker = 打开咖啡机；the night before = 前一天晚上；ready to go = 准备妥当，可以立即使用",
        "note": "put A in 表示“把A放进去”。so it's ready to go 说明提前准备的结果。ready to go 在这里不是“准备离开”，而是“准备好可以使用”。"
      },
      {
        "en": "Next, I open the door of the cupboard where the cereal is stored. I would love to have ham and eggs for breakfast every morning, or maybe a stack of waffles, but the truth is that I just don't have the time to cook.",
        "zh": "接着，我打开存放麦片的橱柜。我很想每天早上都吃火腿煎蛋，或者来一摞华夫饼，但实际情况是，我根本没有时间做早餐。",
        "words": "cupboard = 橱柜；where the cereal is stored = 存放麦片的地方；a stack of waffles = 一摞华夫饼；the truth is that... = 实际情况是……；have the time to cook = 有时间做饭",
        "note": "where 引导定语从句，修饰 cupboard。would love to 表示强烈愿望。but the truth is that... 用于从理想转入现实，that 后接表语从句。"
      },
      {
        "en": "So, I pour myself a bowl of cereal and pour in a glass of skim milk, making sure I take a spoon out of the silverware tray. I go outside, pick up my newspaper, and sit down at the kitchen table.",
        "zh": "所以，我给自己倒一碗麦片，再倒入一杯脱脂牛奶，同时确认从餐具托盘里拿了一把勺子。随后我走到外面拿起报纸，再坐到厨房餐桌旁。",
        "words": "pour myself a bowl of cereal = 给自己倒一碗麦片；skim milk = 脱脂牛奶；make sure = 确保、确认；silverware tray = 餐具托盘；pick up my newspaper = 拿起／取回报纸",
        "note": "pour someone something 是双宾语结构。making sure... 是现在分词短语，补充说明同时进行的动作。第二句用 go、pick up、sit down 三个并列动词描述动作顺序。"
      },
      {
        "en": "I love reading the paper in the morning, though usually I just have time to read a few of the stories. When I've finished my cereal, I grab a banana and maybe make a slice of toast with jam.",
        "zh": "我喜欢早上读报，不过通常只来得及看其中几篇报道。吃完麦片后，我拿一根香蕉，有时还会做一片抹果酱的吐司。",
        "words": "read the paper = 读报纸；though = 不过、尽管；have time to do something = 有时间做某事；a few of the stories = 其中几篇报道；a slice of toast with jam = 一片抹果酱的吐司",
        "note": "though 引出让步或转折，说明喜欢读报但时间有限。When I've finished... 使用现在完成时，强调先完成吃麦片，再进行下一步。stories 在报纸语境中指“新闻报道”。"
      },
      {
        "en": "I rinse off my breakfast dishes in the sink and put them in the dishwasher. By that time, my coffee is ready, so I pour myself a cup and put the rest in a Thermos for work.",
        "zh": "我在水槽里把早餐餐具简单冲洗一下，再放进洗碗机。到那时咖啡已经煮好，于是我给自己倒一杯，并把剩下的咖啡装进保温瓶带去上班。",
        "words": "rinse off = 简单冲洗干净；breakfast dishes = 早餐使用的餐具；dishwasher = 洗碗机；by that time = 到那时；put the rest in a Thermos = 把剩下的装进保温瓶",
        "note": "rinse off 强调用水快速冲洗。them 指代 breakfast dishes，the rest 指代剩余咖啡。By that time 表示到某个时间节点时，前一动作已经完成。"
      }
    ],
    "replacements": [
      {
        "en": "I prepare the coffeemaker the night before to save time in the morning.",
        "zh": "我会在前一晚准备好咖啡机，以节省早上的时间。"
      },
      {
        "en": "I usually have cereal with skim milk because it is quick and easy.",
        "zh": "我通常吃脱脂牛奶泡麦片，因为方便快捷。"
      },
      {
        "en": "I only have enough time to skim a few newspaper articles.",
        "zh": "我只有时间快速浏览几篇报纸文章。"
      },
      {
        "en": "After breakfast, I rinse the dishes and load the dishwasher.",
        "zh": "早餐后，我冲洗餐具并把餐具放进洗碗机。"
      },
      {
        "en": "I take the remaining coffee to work in a Thermos.",
        "zh": "我把剩下的咖啡装进保温瓶带去上班。"
      }
    ]
  }
];
