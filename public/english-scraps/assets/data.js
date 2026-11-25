/* 英语拾遗 · 内容数据
   加一条 = 复制下面整个 {...} 对象，粘到数组最前面（最新的排最上）。
   字段说明：
     id       唯一短标识（英文连字符）
     title    英文标题；titleZh 中文标题
     tags     可选，几个词即可，想不出就留空数组 []
     date     收录日期 YYYY-MM-DD
     en       英文句子数组；zh 中文对应数组（两句数要一致，按序一一对齐）
     notes    可选，值得记的表达 [{en, zh, note}]，没有就留空数组 []
*/
window.SCRAPS = [
  {
    id: "library-late-night",
    title: "The Library That Never Turns Off the Lights",
    titleZh: "不关灯的图书馆",
    tags: ["城市", "社会", "阅读"],
    date: "2026-11-25",
    en: [
      "It is ten o'clock at night.",
      "Office towers have gone dark.",
      "Yet many city libraries in Chinese cities are still brilliantly lit.",
      "Inside, hundreds of seats are packed with quiet readers and students burning the midnight oil.",
      "Why do these cultural spaces stay open so late?",
      "In fast-paced cities, small rooms can hardly fit a quiet desk.",
      "Libraries stepped up, extending hours to become urban sanctuaries.",
      "Behind the late-night lights lies smart management, self-service borrowing and returns, facial recognition security, and smart climate control systems.",
      "Make extended hours safe and efficient.",
      "A library open at 10 p.m. offers more than shelves of books.",
      "It offers a warm desk, shared ambition, and quiet proof that a modern city will always keep its doors open for those who refuse to stop learning."
    ],
    zh: [
      "此时已是晚上十点。",
      "写字楼的灯火已然熄灭。",
      "然而中国许多城市的图书馆依旧灯火通明。",
      "馆内数百个座位坐满了安静的读者与挑灯夜读的学生。",
      "这些文化空间为何开放到如此之晚？",
      "在快节奏的城市里，狭小的居所难容一张安静的书桌。",
      "图书馆挺身而出，延长开放时间，成为城市中的静谧港湾。",
      "深夜灯火背后，是智慧管理：自助借还、人脸识别安防与智能温控系统。",
      "让延时开放既安全又高效。",
      "一间开到晚上十点的图书馆，提供的远不止满架书籍。",
      "它提供一张温暖的书桌、一份共同的志向，并默默证明：这座现代都市，永远为不愿停止学习的人敞开大门。"
    ],
    notes: [
      { en: "burning the midnight oil", zh: "挑灯夜读；熬夜", note: "固定习语，比 stay up late 更有画面感" },
      { en: "be packed with", zh: "挤满了……", note: "比 be full of 更强调人挤人的状态" },
      { en: "brilliantly lit", zh: "灯火通明", note: "brilliantly 修饰灯光，比 very bright 地道" },
      { en: "step up", zh: "站出来应对；挺身而出", note: "主动承担、迎难而上的常用短语动词" },
      { en: "urban sanctuary", zh: "城市中的静谧港湾", note: "sanctuary 原指避难所，比喻闹市中的安宁处" },
      { en: "extend hours", zh: "延长开放时间", note: "商铺、图书馆延时常用表达" },
      { en: "more than", zh: "远不止", note: "后接名词，表示超出字面意义" },
      { en: "refuse to do", zh: "不愿做……；拒绝做……", note: "refuse to stop learning＝不愿停止学习" }
    ]
  }
];
