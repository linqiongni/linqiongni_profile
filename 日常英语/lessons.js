/* 日常英语 · 内容数据
 * 一篇 = 一个对象。新增课文：复制一个对象、改 id/title，追加到数组末尾即可。
 * 也可用 `python3 scripts/add_daily_english.py "<docx路径>"` 直接从同格式 Word 生成一条。
 * 字段：id(英文短标识) / title(英文标题) / zh(中文标题) / tag(主题标签) / section(小节标题)
 *       blocks:[{en,zh,words,note}] / replacements:[{en,zh}]
 */
window.DAILY_LESSONS = [
  {
    id: 'cleaning-routine',
    title: 'Cleaning Routine',
    zh: '清洁',
    tag: '日常生活 · 晨间洗漱',
    section: 'Morning bathroom routine | 早晨洗漱流程',
    blocks: [
      {
        en: 'I go into my bathroom sometime around 6:45 a.m. My sink and medicine cabinet are on the left when you enter my bathroom. The toilet is next to them, with the tub in front.',
        zh: '我通常在早上6点45分左右走进卫生间。进入卫生间后，洗手池和药柜在左侧。马桶就在旁边，浴缸位于前方。',
        words: 'sometime around 6:45 a.m. = 大约早上6点45分；medicine cabinet = 药柜；on the left = 在左边；with the tub in front = 浴缸在前面',
        note: 'when you enter my bathroom 是时间状语从句；with the tub in front 是 with 复合结构，用来补充说明浴室布局。',
      },
      {
        en: 'Anyway, I turn on the lights and try to find the mouthwash in the medicine cabinet. I pour a small amount into a cup, swish it around for 30 seconds, gargle, and spit.',
        zh: '接着，我打开灯，试着在药柜里找到漱口水。我往杯子里倒少量漱口水，让漱口水在口中来回漱动30秒，然后漱喉并吐掉。',
        words: 'turn on the lights = 开灯；try to find = 试着寻找；pour a small amount into... = 往……里倒少量……；swish, gargle, and spit = 漱口、漱喉并吐掉',
        note: '第二句使用连续动作结构：pour、swish、gargle、spit 共用主语 I，按时间顺序描述一整套动作。',
      },
      {
        en: "Not pleasant, but necessary. Then I get out the floss. When I'm done flossing, I pull out the toothbrush and the toothpaste.",
        zh: '这并不舒服，但很有必要。然后我拿出牙线。用牙线清洁完牙齿后，我取出牙刷和牙膏。',
        words: 'not pleasant, but necessary = 不舒服，但有必要；get out the floss = 拿出牙线；be done doing something = 做完某事；pull out = 取出、拿出',
        note: "Not pleasant, but necessary 是省略句，完整表达可理解为 It is not pleasant, but it is necessary。When I'm done flossing 表示“当我用完牙线后”。",
      },
      {
        en: "I brush my teeth, and then it's off to the shower. I pull the shower curtain aside, step into the tub, and pull the curtain back.",
        zh: '我刷完牙，接着去洗澡。我把浴帘拉到一旁，迈进浴缸，再把浴帘拉回原位。',
        words: "brush my teeth = 刷牙；it's off to... = 接着去……；pull ... aside = 把……拉到一旁；step into the tub = 迈进浴缸",
        note: "it's off to the shower 是口语表达，表示“接下来去洗澡”。第二句同样用三个并列动词描述连续动作。",
      },
      {
        en: 'I turn on both the hot and the cold water, looking for the perfect temperature. I lather up with soap, put some shampoo in my hair, then rinse and dry off.',
        zh: '我同时打开热水和冷水，调到合适的水温。我用肥皂打出泡沫，把洗发水抹在头发上，然后冲洗并擦干身体。',
        words: 'both the hot and the cold water = 热水和冷水两边；look for the perfect temperature = 调到最合适的水温；lather up with soap = 用肥皂打出泡沫；rinse and dry off = 冲洗并擦干身体',
        note: 'looking for the perfect temperature 是现在分词短语，说明打开冷热水时的目的或伴随状态。both A and B 表示“A和B两者都”。',
      },
      {
        en: "Now it's shaving time. I used to own an electric razor, but I found it didn't shave close enough. So now I'm back to the old hand razor.",
        zh: '现在该刮胡子了。我以前有一把电动剃须刀，但发现它剃得不够干净。因此，我现在又改回使用传统的手动剃须刀。',
        words: "it's shaving time = 该刮胡子了；used to own = 以前拥有，现已不是；shave close = 把胡须剃得很贴面、很干净；be back to = 重新使用、回到……",
        note: "used to do 表示过去经常做或过去存在、现在已经改变。I found (that) it didn't... 中省略了宾语从句连接词 that。",
      },
      {
        en: "I lather up with shaving cream, and I start to shave. I rinse the razor and throw the disposable blades in the trash. It's about 7:00 a.m., and I'm on to breakfast.",
        zh: '我在脸上涂好剃须膏，然后开始刮胡子。刮完后，我冲洗剃须刀，并把一次性刀片扔进垃圾桶。此时大约是早上7点，我接着去吃早餐。',
        words: "lather up with shaving cream = 涂上剃须膏并打出泡沫；start to shave = 开始刮胡子；disposable blades = 一次性刀片；be on to breakfast = 接下来去吃早餐",
        note: "throw A in B 表示“把A扔进B”。I'm on to breakfast 是自然口语，表示当前步骤结束后进入下一项活动。",
      },
    ],
    replacements: [
      { en: 'I usually go into the bathroom at around 6:45 a.m.', zh: '我通常在早上6点45分左右进卫生间。' },
      { en: 'When I finish flossing, I take out my toothbrush and toothpaste.', zh: '用完牙线后，我拿出牙刷和牙膏。' },
      { en: 'I adjust the hot and cold water until the temperature feels right.', zh: '我调节冷热水，直到水温合适。' },
      { en: 'The electric razor did not give me a close enough shave.', zh: '电动剃须刀剃得不够干净。' },
      { en: 'After shaving, I rinse the razor and move on to breakfast.', zh: '刮完胡子后，我冲洗剃须刀，接着去吃早餐。' },
    ],
  },
];
