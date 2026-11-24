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
  },
  {
    "id": "getting-dressed-and-ready-for-work",
    "title": "Getting Dressed and Ready for Work",
    "zh": "穿好衣服，准备上班",
    "tag": "日常生活",
    "section": "Getting ready to leave | 出门上班前的准备",
    "blocks": [
      {
        "en": "I go back into my bedroom and open up my closet door. I have about 30 dress shirts, 10 pairs of pants, a half-dozen ties, and some sweaters, suit jackets, and T-shirts.",
        "zh": "我回到卧室，打开衣柜门。我有大约30件正装衬衫、10条裤子、6条领带，以及一些毛衣、西装外套和T恤。",
        "words": "go back into = 回到……里面；open up my closet door = 打开衣柜门；dress shirt = 正装衬衫；a half-dozen ties = 6条领带；suit jacket = 西装外套",
        "note": "a half-dozen 表示“半打”，即6个。列举多类衣物时，最后两项通常用 and 连接。open up 在这里与 open 意思相近，语气更口语化。"
      },
      {
        "en": "I pull out a clean pair of socks and some underwear, then decide which shirt I'm going to wear today. I'm terrible at color coordinating, so I usually bring my wife in at this point to help match my shirt and pants.",
        "zh": "我取出一双干净的袜子和一些内衣，然后决定今天要穿哪件衬衫。我很不擅长颜色搭配，所以到了这一步，我通常会请妻子过来帮我搭配衬衫和裤子。",
        "words": "pull out = 取出、拿出；a clean pair of socks = 一双干净的袜子；decide which shirt to wear = 决定穿哪件衬衫；be terrible at = 很不擅长……；color coordinating = 颜色搭配",
        "note": "which shirt I'm going to wear 是宾语从句，作 decide 的宾语。be terrible at 后接名词或动名词。bring someone in 表示请某人过来提供帮助或参与。"
      },
      {
        "en": "I put on my belt with the silver buckle and polish my shoes. I put my cell phone and car keys in my front pocket, and my wallet in the back one.",
        "zh": "我系上带银色搭扣的皮带，并把鞋擦亮。我把手机和车钥匙放进前裤袋，把钱包放进后裤袋。",
        "words": "put on my belt = 系上皮带；silver buckle = 银色搭扣；polish my shoes = 把鞋擦亮；front pocket = 前裤袋；the back one = 后面的那个口袋",
        "note": "put on 强调穿戴动作。第二句为省略结构，and my wallet in the back one 省略了重复的 I put；one 指代 pocket，避免重复。"
      },
      {
        "en": "I put on my glasses and check myself in the mirror to make sure I look okay. Then I go into the home office to get my bag.",
        "zh": "我戴上眼镜，照镜子检查一下自己的仪表，确保看起来得体。然后我走进家庭办公室取包。",
        "words": "put on my glasses = 戴上眼镜；check myself in the mirror = 照镜子检查仪表；make sure = 确保；look okay = 看起来得体、没有问题；home office = 家庭办公室",
        "note": "to make sure... 是目的状语，说明照镜子的目的。look 在这里是系动词，后接形容词 okay，表示“看起来不错或得体”。"
      },
      {
        "en": "I used to carry a more traditional briefcase, but now I just use my computer bag to hold my laptop and papers. Now it's back into the kitchen to grab my Thermos on the way out the door.",
        "zh": "我过去常带一个比较传统的公文包，但现在只用电脑包装笔记本电脑和文件。接着，我在出门途中回到厨房拿保温瓶。",
        "words": "used to carry = 过去常常携带；traditional briefcase = 传统公文包；computer bag = 电脑包；hold my laptop and papers = 装笔记本电脑和文件；on the way out the door = 出门途中",
        "note": "used to do 表示过去经常做、现在已经改变。use A to do B 表示“用A来做B”。on the way out the door 指正准备离开住所时。"
      },
      {
        "en": "I lock the door and then hurry to my car in the garage. I'm usually running late, and today is no exception!",
        "zh": "我锁好门，然后匆忙赶到车库里的汽车旁。我通常都会赶时间，今天也不例外。",
        "words": "lock the door = 锁门；hurry to my car = 匆忙赶到车旁；garage = 车库；run late = 迟到、赶不上时间；be no exception = 也不例外",
        "note": "be running late 表示已经落后于计划时间、可能迟到，不宜直译成“正在跑迟”。today is no exception 是固定表达，表示今天和通常情况一样。"
      }
    ],
    "replacements": [
      {
        "en": "I choose my clothes the night before to save time in the morning.",
        "zh": "我会在前一晚选好衣服，以节省早上的时间。"
      },
      {
        "en": "I'm not very good at matching colors, so I sometimes ask for help.",
        "zh": "我不太擅长颜色搭配，所以有时会请别人帮忙。"
      },
      {
        "en": "Before leaving, I check that I have my phone, keys, and wallet.",
        "zh": "出门前，我会检查是否带了手机、钥匙和钱包。"
      },
      {
        "en": "I use a computer bag instead of a traditional briefcase.",
        "zh": "我用电脑包代替传统公文包。"
      },
      {
        "en": "I'm running a little late, so I need to hurry.",
        "zh": "我有点赶时间，所以得快一点。"
      }
    ]
  },
  {
    "id": "driving-to-work",
    "title": "Driving to Work",
    "zh": "开车上班",
    "tag": "日常生活",
    "section": "The commute to work | 开车通勤流程",
    "blocks": [
      {
        "en": "I open my car door, throw my briefcase in the back seat, and get comfortable for my drive. I put my coffee mug into the cup holder, put the keys in the ignition, find the gas pedal, and start the car.",
        "zh": "我打开车门，把公文包放到后座上，然后调整好坐姿，准备开车。我把咖啡杯放进杯架，将钥匙插入点火开关，踩住油门踏板并发动汽车。",
        "words": "throw my briefcase in the back seat = 把公文包放到后座；get comfortable for my drive = 调整好坐姿准备开车；cup holder = 杯架；put the keys in the ignition = 把钥匙插入点火开关；start the car = 发动汽车",
        "note": "两句都使用多个并列动词，按实际操作顺序描述动作。throw 在这里是口语化的“随手放”，不一定表示用力扔。find the gas pedal 可理解为把脚放到油门踏板位置。"
      },
      {
        "en": "My wife drove the car last night, so I have to readjust the rearview mirror and the side mirrors. I turn on the radio to listen to the drive-time traffic report.",
        "zh": "我妻子昨晚开过这辆车，所以我得重新调整车内后视镜和两侧后视镜。我打开收音机，收听上班高峰时段的路况播报。",
        "words": "readjust = 重新调整；rearview mirror = 车内后视镜；side mirrors = 两侧后视镜；turn on the radio = 打开收音机；drive-time traffic report = 上下班高峰时段路况播报",
        "note": "so 表示因果关系：别人开过车，因此镜子的位置需要重新调整。to listen to... 是目的状语，说明打开收音机的目的。"
      },
      {
        "en": "I take the transmission out of park and put it into reverse. I back out of the garage, down the driveway, and into the street, close the garage door, and put the car into drive.",
        "zh": "我把挡位从驻车挡切换到倒车挡。随后我把车倒出车库，沿车道倒到街上，关上车库门，再挂入前进挡。",
        "words": "take the transmission out of park = 把挡位移出驻车挡；put it into reverse = 挂入倒车挡；back out of the garage = 倒车驶出车库；driveway = 住宅车道；put the car into drive = 挂入前进挡",
        "note": "out of park、into reverse 和 into drive 是自动挡汽车的常用表达。back out 表示“倒车退出”。第二句用多个并列动作描述倒车出库的完整流程。"
      },
      {
        "en": "I used to drive a stick shift, but as I get older, I like my automatic transmission more and more. I usually take the freeway to the office, so I get on the on-ramp and drive to the exit where I have to get off.",
        "zh": "我过去常开手动挡汽车，但随着年龄增长，我越来越喜欢自动挡。我通常走高速公路去办公室，所以会从入口匝道驶上高速，再开到需要驶出的出口。",
        "words": "used to drive = 过去常开；stick shift = 手动挡汽车／手动变速器；automatic transmission = 自动变速器、自动挡；more and more = 越来越……；on-ramp = 高速公路入口匝道；get off = 驶离高速公路",
        "note": "used to do 表示过去的习惯。as I get older 表示“随着年龄增长”。where I have to get off 是定语从句，修饰 exit，说明需要在哪个出口驶离。"
      },
      {
        "en": "My office is only a few miles from the exit. I pull into the parking garage, swiping my key card to get in.",
        "zh": "我的办公室距离高速公路出口只有几英里。我把车开进停车库，刷钥匙卡进入。",
        "words": "a few miles from the exit = 距离出口几英里；pull into = 驶入；parking garage = 停车库；swipe my key card = 刷钥匙卡；to get in = 为了进入",
        "note": "only 强调距离很近。swiping my key card 是现在分词短语，说明进入停车库时同时进行的动作；to get in 表示刷卡的目的。"
      },
      {
        "en": "I park, grab my briefcase and coffee, and head toward the elevator. And that only took 40 minutes!",
        "zh": "我停好车，拿上公文包和咖啡，然后朝电梯走去。整个上班路程只用了40分钟！",
        "words": "park = 停车、停好车；grab my briefcase and coffee = 拿上公文包和咖啡；head toward the elevator = 朝电梯走去；take 40 minutes = 花费40分钟",
        "note": "head toward... 表示“朝……方向前往”。that 指代从家开车到办公室并停好车的整个过程。take 加时间表示“花费多长时间”。"
      }
    ],
    "replacements": [
      {
        "en": "Before driving, I adjust the seat and mirrors and make sure everything is in the right position.",
        "zh": "开车前，我会调整座椅和后视镜，确保所有位置合适。"
      },
      {
        "en": "I listen to the traffic report before getting on the freeway.",
        "zh": "驶上高速公路前，我会收听路况播报。"
      },
      {
        "en": "I back out of the garage slowly and check both sides before entering the street.",
        "zh": "我慢慢倒出车库，驶入街道前会查看两侧情况。"
      },
      {
        "en": "I take the freeway and get off at the exit closest to my office.",
        "zh": "我走高速公路，并从离办公室最近的出口驶出。"
      },
      {
        "en": "The drive usually takes about 40 minutes, depending on traffic.",
        "zh": "这段车程通常约需40分钟，具体取决于路况。"
      }
    ]
  },
  {
    "id": "work-breaks-and-lunch",
    "title": "Work, Breaks and Lunch",
    "zh": "工作、休息和吃午饭",
    "tag": "日常生活",
    "section": "A workday before and during lunch | 午饭前后的工作安排",
    "blocks": [
      {
        "en": "On the way to the office, I was thinking about what I have on my agenda today. When I get to my desk, there is a stack of new memos and papers in my inbox.",
        "zh": "去办公室的路上，我一直在想今天的日程安排。到达办公桌时，我发现收件箱里有一摞新的备忘录和文件。",
        "words": "on the way to the office = 去办公室的路上；have on my agenda = 列入我的日程；a stack of = 一摞、一叠；memos and papers = 备忘录和文件；inbox = 收件箱／文件收件盘",
        "note": "what I have on my agenda 是宾语从句，作 thinking about 的宾语。there is... 用于说明某处有某物；a stack of 后接复数名词。"
      },
      {
        "en": "When I turn on my computer, I see at least two dozen emails I need to go through. Just as I start in on the email, my phone rings.",
        "zh": "打开电脑后，我看到至少有24封邮件需要逐一查看。正当我开始处理邮件时，电话响了。",
        "words": "turn on my computer = 打开电脑；at least two dozen emails = 至少24封邮件；go through = 逐一查看、处理；start in on = 开始着手处理；my phone rings = 电话响了",
        "note": "emails 后省略了关系代词 that/which，完整理解为 emails that I need to go through。Just as 表示“正当……的时候”，突出两件事几乎同时发生。"
      },
      {
        "en": "It's my project manager, Julie, asking me to come in for a conference call with our head office. I don't get back to my desk for nearly two hours, and by that time, I'm ready for a break.",
        "zh": "电话是项目经理 Julie 打来的，她让我过去参加与总部的多方电话会议。我将近两个小时后才回到办公桌，那时已经很需要休息一下了。",
        "words": "project manager = 项目经理；ask someone to do something = 让某人做某事；conference call = 电话会议、多方通话；head office = 总部；get back to my desk = 回到办公桌；be ready for a break = 需要休息一下",
        "note": "asking me... 是现在分词短语，补充说明电话内容。ask someone to do something 是重要结构。by that time 表示“到那时为止”。"
      },
      {
        "en": "At 10:30, I head down to the break room and get some hot water from the water cooler to make some tea. There are a couple of other people on break, having snacks from the vending machine and reading the new notices on the bulletin board.",
        "zh": "上午10点30分，我走到休息室，从饮水机接些热水泡茶。休息室里还有几个人在休息，他们吃着自动售货机里的零食，并阅读公告栏上的新通知。",
        "words": "head down to = 前往、走到；break room = 休息室；water cooler = 饮水机；a couple of = 几个、两个左右；on break = 正在休息；vending machine = 自动售货机；bulletin board = 公告栏",
        "note": "to make some tea 是目的状语。having... and reading... 是两个并列的现在分词短语，描述休息室里其他人正在做的事。"
      },
      {
        "en": "I run into Sam, one of my friends at work, and we chat a little before going back to work. Before long, it's time for lunch.",
        "zh": "我偶遇了同事朋友 Sam，回去工作前，我们聊了一会儿。没过多久，就到了午饭时间。",
        "words": "run into someone = 偶遇某人；a friend at work = 工作中的朋友、同事朋友；chat a little = 聊一会儿；go back to work = 回去工作；before long = 没过多久",
        "note": "one of my friends at work 是同位语，补充说明 Sam。before going back to work 中 before 后接动名词。Before long 表示“不久之后”。"
      },
      {
        "en": "I usually bring my lunch with me to work and eat it at my desk. If I don't have time to pack a lunch, I sometimes go across the street for some takeout.",
        "zh": "我通常会自带午餐上班，并在办公桌旁吃。如果没有时间准备盒饭，我有时会去街对面买些外卖。",
        "words": "bring my lunch to work = 自带午餐上班；eat at my desk = 在办公桌旁吃饭；pack a lunch = 准备并打包午餐；go across the street = 去街对面；takeout = 外卖食品",
        "note": "If 引导真实条件句，表示可能发生的日常情况。have time to do 表示“有时间做某事”。for some takeout 表示去购买外卖。"
      },
      {
        "en": "The only trouble is that it's always so busy during the lunch hour, and I always have to stand in line. That's usually a pain.",
        "zh": "唯一的问题是，午餐高峰时段总是非常繁忙，我常常不得不排队。这通常很麻烦。",
        "words": "the only trouble is that... = 唯一的问题是……；during the lunch hour = 午餐高峰时段；have to stand in line = 不得不排队；be a pain = 很麻烦、令人头疼",
        "note": "The only trouble is that... 中 that 引导表语从句。so busy 用 so 加形容词表示程度。a pain 是常见口语，表示麻烦或令人头疼的事情。"
      },
      {
        "en": "On Fridays, I usually go out to lunch with a few friends from work. On casual Fridays, we can kick back a little and take it easy.",
        "zh": "每逢周五，我通常会和几位同事外出吃午饭。便装星期五时，我们可以稍微放松一下。",
        "words": "go out to lunch = 外出吃午饭；friends from work = 工作中的朋友、同事；casual Friday = 便装星期五；kick back = 放松、歇一歇；take it easy = 放轻松、别太紧张",
        "note": "On Fridays 表示每周五的习惯。kick back 和 take it easy 都是口语化的“放松”，连用可加强轻松语气。"
      }
    ],
    "replacements": [
      {
        "en": "I check my agenda as soon as I arrive at the office.",
        "zh": "我一到办公室就会查看当天日程。"
      },
      {
        "en": "I have several emails to go through before the morning meeting.",
        "zh": "晨会前我有几封邮件需要逐一处理。"
      },
      {
        "en": "I usually take a short tea break around 10:30.",
        "zh": "我通常在10点30分左右短暂休息并喝杯茶。"
      },
      {
        "en": "If I don't bring lunch, I pick up something from a nearby restaurant.",
        "zh": "如果没有带午餐，我会去附近餐馆买点吃的。"
      },
      {
        "en": "On Fridays, I sometimes have lunch with my coworkers and relax for a while.",
        "zh": "周五我有时会和同事一起吃午饭，稍微放松一下。"
      }
    ]
  },
  {
    "id": "driving-home-and-running-errands",
    "title": "Driving Home and Running Errands",
    "zh": "开车回家和跑腿（2）",
    "tag": "日常生活",
    "section": "生活英语双语精读 · 分段重点解析版",
    "blocks": [
      {
        "en": "It's five o'clock, and it's quitting time. I put a few files into my bag, grab my mug, and say goodnight to the rest of the people in my area. I go to the parking garage and get into my car.",
        "zh": "现在是下午5点，到了下班时间。我把几份文件放进包里，拿上杯子，向办公区域里还没离开的同事道晚安。随后我走到停车库，上了车。",
        "words": "quitting time = 下班时间；put a few files into my bag = 把几份文件放进包里；say goodnight to = 向……道晚安；the rest of the people = 其余的人；parking garage = 停车库",
        "note": "it's quitting time 是口语化表达，表示“到下班时间了”。put、grab、say 是三个并列动词，按顺序描述离开办公室前的动作。"
      },
      {
        "en": "I signal my turn onto the street and drive toward the freeway on-ramp. I merge as best as I can onto the freeway, which is always a bit of a hassle at this hour.",
        "zh": "我打转向灯驶上街道，然后朝高速公路入口匝道开去。我尽量顺利地并入高速公路，但在这个时段，并线总有些麻烦。",
        "words": "signal my turn = 打转向灯示意转弯；drive toward = 朝……行驶；freeway on-ramp = 高速公路入口匝道；merge onto the freeway = 并入高速公路；as best as I can = 尽我所能；a bit of a hassle = 有点麻烦",
        "note": "as best as I can 表示“尽我所能地”。which 引导非限制性定语从句，补充说明在该时段并入高速公路很麻烦。"
      },
      {
        "en": "Traffic is stop-and-go all the way from downtown. I hear on the radio that there's a stalled car in the fast lane near La Brea, backing up traffic all the way to Hoover.",
        "zh": "从市中心出来的一路上，车辆都是走走停停。我从广播里听说，La Brea 附近的快车道有一辆车抛锚，导致车流一直堵到 Hoover。",
        "words": "stop-and-go traffic = 走走停停的拥堵交通；all the way from downtown = 从市中心出来的一路上；stalled car = 抛锚的汽车；fast lane = 快车道；back up traffic = 造成交通拥堵；all the way to = 一直延伸到……",
        "note": "that 引导宾语从句，说明广播内容。backing up traffic 是现在分词短语，表示抛锚车辆造成的结果。"
      },
      {
        "en": "I decide to get off the freeway and take surface streets for the rest of the trip. I need to make a stop on the way home, and I know that the fridge is empty, so I decide to stop by the market.",
        "zh": "我决定驶离高速公路，剩下的路程改走普通道路。回家途中我需要顺路办点事，而且我知道冰箱已经空了，所以决定去一趟市场。",
        "words": "get off the freeway = 驶离高速公路；surface streets = 普通道路、地面道路；for the rest of the trip = 在剩余路程中；make a stop = 途中停一下、顺路办事；on the way home = 回家途中；stop by the market = 顺路去市场",
        "note": "decide to do 表示“决定做某事”。that the fridge is empty 是宾语从句。so 引出结果：因为冰箱空了，所以顺路购物。"
      },
      {
        "en": "I get there and pick up some French bread, a bag of apples, a few bananas, some pasta, tomato sauce, and a cooked chicken. Luckily, they have a lot of checkout stands open, and I get through the line pretty quickly.",
        "zh": "到达市场后，我买了一些法式面包、一袋苹果、几根香蕉、一些意大利面、番茄酱和一只熟鸡。幸运的是，开放的收银台很多，所以我很快就排完队结了账。",
        "words": "pick up = 顺便购买、拿取；a bag of apples = 一袋苹果；tomato sauce = 番茄酱；a cooked chicken = 一只熟鸡；checkout stand = 收银台；get through the line = 排完队并完成结账",
        "note": "pick up 在购物语境中表示购买或拿取。a few 修饰可数名词复数，some 可修饰可数或不可数名词。get through 表示顺利完成某个过程。"
      },
      {
        "en": "I thank the cashier and the bagger and push my cart to my car. I open the trunk and load everything up. Just then, my wife calls me on my cell phone.",
        "zh": "我向收银员和装袋员道谢，然后把购物车推到车旁。我打开后备箱，把所有东西装进去。就在这时，我妻子打电话到我的手机上。",
        "words": "cashier = 收银员；bagger = 装袋员；push my cart to my car = 把购物车推到车旁；trunk = 汽车后备箱；load everything up = 把所有东西装上车；call someone on a cell phone = 打某人的手机",
        "note": "thank A and B 是并列宾语结构。load up 表示把物品装入车辆或容器。Just then 表示“就在那时”，用来引出突然发生的事情。"
      },
      {
        "en": "She is going to be a little late getting home and asks me to make something for dinner. Tonight, I will be the cook.",
        "zh": "她会晚一点到家，并让我准备些晚餐。今晚由我来下厨。",
        "words": "be late getting home = 晚一点到家；ask someone to do something = 让某人做某事；make something for dinner = 准备些晚餐；be the cook = 负责下厨",
        "note": "be late doing 表示做某事晚了。ask me to make... 是 ask someone to do 的结构。I will be the cook 是自然口语，表示今晚由说话者负责做饭。"
      }
    ],
    "replacements": [
      {
        "en": "Traffic is usually heavy during the evening rush hour.",
        "zh": "晚高峰期间交通通常很拥堵。"
      },
      {
        "en": "A stalled car was causing a long backup in the fast lane.",
        "zh": "一辆抛锚汽车导致快车道长距离拥堵。"
      },
      {
        "en": "I got off the freeway and took local streets instead.",
        "zh": "我驶离高速公路，改走普通道路。"
      },
      {
        "en": "I stopped by the grocery store to pick up a few things for dinner.",
        "zh": "我顺路去食品店买了几样晚餐需要的东西。"
      },
      {
        "en": "After loading the groceries into the trunk, I headed home to cook dinner.",
        "zh": "把食品装进后备箱后，我便回家准备晚餐。"
      }
    ]
  },
  {
    "id": "getting-ready-for-bed-and-going-to-sleep",
    "title": "Getting Ready for Bed and Going to Sleep",
    "zh": "睡前准备和睡觉",
    "tag": "日常生活",
    "section": "Bedtime routine | 睡前流程",
    "blocks": [
      {
        "en": "At 10:30, I decide to get ready for bed. When I was little, my mother would read me a bedtime story. I'm looking forward to having that ritual with my own kids someday.",
        "zh": "晚上10点30分，我决定开始准备睡觉。小时候，母亲常常给我读睡前故事。我期待将来有一天，也能和自己的孩子保持这样的睡前习惯。",
        "words": "get ready for bed = 准备睡觉；when I was little = 我小时候；would read me a bedtime story = 过去常给我读睡前故事；look forward to doing = 期待做某事；bedtime ritual = 睡前习惯、固定仪式",
        "note": "would 在这里表示过去反复发生的习惯。look forward to 中 to 是介词，后接名词或动名词，因此用 having，不能用 have。"
      },
      {
        "en": "I go into the bathroom and turn on the tap. I wash my face and dry it with my towel. Then I floss and brush my teeth.",
        "zh": "我走进卫生间，打开水龙头。我洗脸，再用毛巾把脸擦干。然后我使用牙线并刷牙。",
        "words": "turn on the tap = 打开水龙头；wash my face = 洗脸；dry it with my towel = 用毛巾把它擦干；floss = 使用牙线清洁牙齿；brush my teeth = 刷牙",
        "note": "it 指代 my face。with my towel 表示使用的工具。floss 和 brush 是并列谓语，按照洗漱顺序描述连续动作。"
      },
      {
        "en": "I have to admit that by this time, I'm beat, and so is my wife. She cleans up when I've finished up. In the meantime, I walk into the bedroom and get undressed.",
        "zh": "我不得不承认，到了这个时候，我已经筋疲力尽，妻子也是如此。我洗漱完后，她开始洗漱。与此同时，我走进卧室脱下衣服。",
        "words": "have to admit that... = 不得不承认……；by this time = 到这个时候；be beat = 筋疲力尽；so is my wife = 妻子也是如此；finish up = 完成、做完；in the meantime = 与此同时",
        "note": "so is my wife 是倒装结构，表示前面的情况同样适用于妻子。when I've finished up 使用现在完成时，强调一个动作完成后另一个动作开始。"
      },
      {
        "en": "I put my dirty clothes in the hamper and put on my pajamas. Wearing my slippers, I go into the kitchen to get a glass of water to put next to the bed in case I need it during the night.",
        "zh": "我把脏衣服放进衣物篮，并穿上睡衣。我穿着拖鞋走进厨房，倒一杯水放在床边，以防夜里需要喝水。",
        "words": "put dirty clothes in the hamper = 把脏衣服放进衣物篮；put on my pajamas = 穿上睡衣；wearing my slippers = 穿着拖鞋；next to the bed = 放在床边；in case = 以防、以备",
        "note": "Wearing my slippers 是现在分词短语，说明进入厨房时的穿着状态。两个 to do 分别表示取水和放置水杯的目的。in case 后接从句，表示预防性的准备。"
      },
      {
        "en": "I pull back the covers, fluff my pillow, and climb into bed. I set my alarm clock for 6:15 and turn off the overhead light. Then I lay my head down and pull up the covers, kissing my wife goodnight.",
        "zh": "我掀开被子，拍松枕头，然后爬上床。我把闹钟设在早上6点15分，并关掉顶灯。接着我躺下，把被子拉到身上，亲吻妻子道晚安。",
        "words": "pull back the covers = 掀开被子；fluff my pillow = 拍松枕头；climb into bed = 爬上床；set my alarm clock for... = 把闹钟设为……；turn off the overhead light = 关掉顶灯；pull up the covers = 把被子拉上来",
        "note": "三个句子都用并列动词呈现睡前动作顺序。kissing my wife goodnight 是现在分词短语，表示躺下盖被时同时进行的动作。"
      },
      {
        "en": "Some nights I have trouble falling asleep, but tonight, I don't need to count any sheep. I nod off right away, and before long, I'm fast asleep.",
        "zh": "有些晚上我很难入睡，但今晚不需要数羊。我很快就打起瞌睡，没过多久便进入熟睡。",
        "words": "have trouble doing = 做某事有困难；fall asleep = 入睡；count sheep = 数羊助眠；nod off = 打瞌睡、睡着；right away = 立刻、很快；before long = 没过多久；be fast asleep = 熟睡",
        "note": "have trouble 后接动名词，所以使用 falling。fall asleep 强调从清醒到入睡的变化，be asleep 表示已经处于睡眠状态；fast 在 fast asleep 中表示“完全地、熟熟地”。"
      }
    ],
    "replacements": [
      {
        "en": "I start getting ready for bed at around 10:30 every night.",
        "zh": "我每天晚上10点30分左右开始准备睡觉。"
      },
      {
        "en": "After washing my face and brushing my teeth, I change into my pajamas.",
        "zh": "洗脸刷牙后，我换上睡衣。"
      },
      {
        "en": "I keep a glass of water beside the bed in case I get thirsty during the night.",
        "zh": "我会在床边放一杯水，以防夜里口渴。"
      },
      {
        "en": "I set the alarm, turn off the light, and get under the covers.",
        "zh": "我设好闹钟、关灯，然后钻进被窝。"
      },
      {
        "en": "I sometimes have trouble falling asleep, but tonight I fell asleep almost immediately.",
        "zh": "我有时很难入睡，但今晚几乎马上就睡着了。"
      }
    ]
  },
  {
    "id": "making-and-eating-dinner-and-doing-the-dishes",
    "title": "Making and Eating Dinner, and Doing the Dishes",
    "zh": "做晚饭、吃晚饭和清洗餐具",
    "tag": "日常生活",
    "section": "Dinner preparation and cleanup | 晚饭准备及餐后清理",
    "blocks": [
      {
        "en": "When I get home, I start on dinner right away. I clean off the kitchen counter after putting away the groceries and decide to make pasta.",
        "zh": "回到家后，我立刻开始准备晚饭。把买回来的食品收好后，我清理厨房操作台，并决定做意大利面。",
        "words": "start on dinner = 开始准备晚饭；right away = 立刻、马上；clean off the kitchen counter = 清理厨房操作台；put away the groceries = 把买回来的食品收好；decide to make pasta = 决定做意大利面",
        "note": "after putting away... 中 after 后接动名词，表示先把食品收好，再清理操作台。start on 表示开始处理某项工作。"
      },
      {
        "en": "I preheat the oven to 375 degrees to bake the bread and keep the chicken hot until my wife gets home. I put some water in a pan and turn the burner on high.",
        "zh": "我把烤箱预热到华氏375度，用来烤面包，并在妻子回家前让鸡肉保持热度。我往锅里加水，把炉火调到高火。",
        "words": "preheat the oven = 预热烤箱；to 375 degrees = 调到375度；bake the bread = 烤面包；keep the chicken hot = 让鸡肉保持热度；turn the burner on high = 把炉火调到高火",
        "note": "两个 to do 分别表示目的：预热烤箱是为了烤面包和保温。keep A + 形容词表示“使A保持某种状态”。until 引导时间状语从句。"
      },
      {
        "en": "When the water starts boiling, I put in the pasta and decide to make a salad. Just then, my wife opens the back door and yells, “I'm home!”",
        "zh": "水开始沸腾后，我放入意大利面，并决定再做一份沙拉。就在这时，妻子打开后门大声喊道：“我回来了！”",
        "words": "start boiling = 开始沸腾；put in the pasta = 放入意大利面；make a salad = 做一份沙拉；just then = 就在这时；yell = 大声喊",
        "note": "When 引导时间状语从句。start doing 表示动作开始。Just then 用于引出紧接着发生的事情，使叙述更连贯。"
      },
      {
        "en": "She comes into the kitchen and helps chop the tomatoes to add to the sauce. She stirs the sauce until it's done, while I finish tossing the salad.",
        "zh": "她走进厨房，帮忙切西红柿，准备加进酱汁里。她把酱汁搅拌到做好为止，而我则把沙拉拌好。",
        "words": "help chop the tomatoes = 帮忙切西红柿；add to the sauce = 加入酱汁；stir the sauce = 搅拌酱汁；until it's done = 直到做好为止；toss the salad = 拌沙拉",
        "note": "help 后可直接接动词原形。to add to the sauce 表示切西红柿的用途。while 连接同时进行的两项动作，并带有分工对照。"
      },
      {
        "en": "I get out the place mats and napkins to set the table. I also make sure that there is a spoon, knife, fork, and plate for each of us.",
        "zh": "我拿出餐垫和餐巾来摆餐桌。我还确认我们每个人都有一把勺子、一把刀、一把叉子和一个盘子。",
        "words": "get out = 拿出；place mats = 餐垫；set the table = 摆餐桌、摆放餐具；make sure that... = 确保……；for each of us = 我们每个人各有一份",
        "note": "to set the table 是目的状语。make sure that 后接宾语从句。there is 使用单数形式，是因为列举项从单数 a spoon 开始。"
      },
      {
        "en": "About 15 minutes later, we sit down at the table in the dining room and talk about our long day. My wife says she'll do the dishes since I cooked, but of course I help out by drying them.",
        "zh": "大约15分钟后，我们在餐厅的餐桌旁坐下，聊起漫长的一天。妻子说因为晚饭是我做的，所以由她洗碗；当然，我会帮忙把餐具擦干。",
        "words": "sit down at the table = 在餐桌旁坐下；dining room = 餐厅；talk about our long day = 聊聊漫长的一天；do the dishes = 清洗餐具；since I cooked = 因为是我做的饭；help out by doing = 通过做某事帮忙",
        "note": "since 在这里表示原因。she'll 是 she will 的缩写。help out by drying them 中 by 后接动名词，说明帮忙的方式；them 指餐具。"
      },
      {
        "en": "First, I put some of the leftovers in a Tupperware container, wrap some in plastic wrap, and wrap the rest in aluminum foil. Then I dry the pans, plates, glasses, and silverware.",
        "zh": "首先，我把一部分剩菜放进保鲜盒，一部分用保鲜膜包好，其余的用铝箔包好。然后，我把锅、盘子、玻璃杯和餐具擦干。",
        "words": "leftovers = 剩菜、剩余食物；Tupperware container = 密封保鲜盒；plastic wrap = 保鲜膜；the rest = 其余部分；aluminum foil = 铝箔；silverware = 刀叉勺等餐具",
        "note": "some... some... the rest... 是常用分配结构，表示“一些……另一些……其余……”。三个并列动作 put、wrap、wrap 的宾语不同。"
      }
    ],
    "replacements": [
      {
        "en": "I put away the groceries before I start cooking dinner.",
        "zh": "开始做晚饭前，我先把买回来的食品收好。"
      },
      {
        "en": "I preheat the oven while the water is coming to a boil.",
        "zh": "烧水的同时，我把烤箱预热。"
      },
      {
        "en": "One person prepares the sauce while the other makes the salad.",
        "zh": "一个人准备酱汁，另一个人拌沙拉。"
      },
      {
        "en": "After dinner, we divide the leftovers into containers and wrap them up.",
        "zh": "晚饭后，我们把剩菜分别装进容器并包好。"
      },
      {
        "en": "I wash the dishes, and someone else dries and puts them away.",
        "zh": "我洗餐具，其他人负责擦干并收好。"
      }
    ]
  },
  {
    "id": "relaxing-mail-and-trash",
    "title": "Relaxing, Mail and Trash",
    "zh": "休息、邮件和垃圾",
    "tag": "日常生活",
    "section": "An evening at home | 晚间居家活动",
    "blocks": [
      {
        "en": "With the dinner dishes done, my wife and I each sit down on the couch to chill out and watch the national news, which comes on at 6:30. During the newscast, I sort through the day's mail.",
        "zh": "晚餐餐具收拾好后，我和妻子各自在沙发上坐下放松，观看6点30分开播的全国新闻。新闻播出期间，我把当天的邮件逐一整理。",
        "words": "with the dinner dishes done = 晚餐餐具收拾好后；sit down on the couch = 在沙发上坐下；chill out = 放松、休息；come on at 6:30 = 在6点30分开播；sort through the day's mail = 逐一整理当天的邮件",
        "note": "With + 名词 + 过去分词构成独立结构，表示背景状态。which comes on at 6:30 是非限制性定语从句，补充说明新闻节目的开播时间。"
      },
      {
        "en": "Most of it is junk mail and bills. There are also several fliers for houses for sale in the area, so I check the front stoop and see that there are no packages.",
        "zh": "其中大部分是广告邮件和账单。还有几张附近房屋出售的宣传单，所以我查看了一下门前台阶，确认没有包裹。",
        "words": "junk mail = 垃圾邮件、广告邮件；bills = 账单；fliers = 宣传单；houses for sale = 待售房屋；front stoop = 门前台阶、小门廊；packages = 包裹",
        "note": "Most of it 中 it 指当天收到的邮件。There are... 用于说明存在某物。that there are no packages 是 see 后的宾语从句。"
      },
      {
        "en": "I like to watch TV, and my wife likes to watch reality shows. One thing I hate is having to watch all of the commercials, so I turn the sound down when they come on.",
        "zh": "我喜欢看电视，妻子喜欢看真人秀节目。我讨厌的一件事是不得不看完所有广告，所以广告一出现，我就把音量调低。",
        "words": "reality shows = 真人秀节目；one thing I hate = 我讨厌的一件事；have to watch = 不得不看；commercials = 电视广告；turn the sound down = 把音量调低；come on = 开始播放、出现",
        "note": "One thing I hate is... 中 I hate 是省略关系代词 that 的定语从句。having to watch 是动名词短语作表语。when 引导时间状语从句。"
      },
      {
        "en": "After the show is over, I thumb through the latest issue of The Atlantic Monthly, while my wife reads a novel by her favorite mystery writer.",
        "zh": "节目结束后，我随手翻阅最新一期的《大西洋月刊》，妻子则阅读其最喜欢的推理小说作家写的一本小说。",
        "words": "after the show is over = 节目结束后；thumb through = 快速翻阅、随手翻看；the latest issue = 最新一期；a novel by... = 由……创作的小说；mystery writer = 推理小说作家",
        "note": "thumb through 强调快速、随意地翻阅。while 在这里表示两个人同时进行不同活动，也带有对照意味。by her favorite mystery writer 中 by 表示作者。"
      },
      {
        "en": "At around nine, I remember that tomorrow is trash day, so I take the kitchen garbage out and dump the recycling bins as well. I roll the trash container out to the street, ready for the garbage trucks, which come by early in the morning.",
        "zh": "晚上9点左右，我想起明天是垃圾收集日，于是把厨房垃圾拿出去，同时清空回收箱。我把垃圾桶推到街边，等待一早经过的垃圾车收运。",
        "words": "trash day = 垃圾收集日；take the kitchen garbage out = 把厨房垃圾拿出去；dump the recycling bins = 清空回收箱；as well = 也、同时；roll the trash container out = 把垃圾桶推出去；come by = 经过、上门收取",
        "note": "remember that... 中 that 引导宾语从句。ready for the garbage trucks 是形容词短语，说明垃圾桶已准备好等待收运。which come by... 修饰 garbage trucks。"
      }
    ],
    "replacements": [
      {
        "en": "After dinner, we relax on the couch and watch the evening news.",
        "zh": "晚饭后，我们坐在沙发上放松并观看晚间新闻。"
      },
      {
        "en": "I sort the mail into bills, advertisements, and important letters.",
        "zh": "我把邮件分成账单、广告和重要信件。"
      },
      {
        "en": "I mute the television whenever the commercials come on.",
        "zh": "每当广告开始播放时，我就把电视静音。"
      },
      {
        "en": "I usually read a magazine while someone else reads a novel.",
        "zh": "我通常看杂志，其他人则看小说。"
      },
      {
        "en": "The night before collection day, I roll the trash and recycling bins to the curb.",
        "zh": "垃圾收集日前一晚，我会把垃圾桶和回收箱推到路边。"
      }
    ]
  }
];
