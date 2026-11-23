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
  }
];
