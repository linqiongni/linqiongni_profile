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
    id: "scan-to-order",
    title: "Scan to Order",
    titleZh: "扫码点餐",
    tags: ["科技", "生活", "餐饮"],
    date: "2026-11-25",
    en: [
      "Walk into almost any restaurant in China and there's a small square on your table.",
      "Scan it and a whole world opens up.",
      "High-def photos, real reviews, even short videos of the chef in action.",
      "You order, you pay, you relax.",
      "Not a single word needed.",
      "If you're not in the mood, this is Scan to Order.",
      "It's built on WeChat and Alipay, the invisible infrastructure of modern China.",
      "For the shop, it's about pure efficiency.",
      "But for us, the diners, it means no awkward waiting for a server and no pressure to pick a dish in 10 seconds.",
      "You get to own your time.",
      "Some might miss the old school service, but others find this digital distance quietly liberating.",
      "One tiny QR code has completely rewritten the ritual of eating out."
    ],
    zh: [
      "走进中国几乎任何一家餐厅，桌上都会有一个小小的方块。",
      "扫一扫，一个全新的世界就此展开。",
      "高清图片、真实评价，甚至还有大厨操作的短视频。",
      "你点单、付款，然后安心等候。",
      "一个字都不用说。",
      "如果你不想开口说话，那就用「扫码点餐」吧。",
      "它建立在微信和支付宝之上，那是现代中国无形的基础设施。",
      "对商家而言，这纯粹关乎效率。",
      "但对我们食客而言，这意味着不必尴尬地等服务员，也没有十秒内必须点好菜的压力。",
      "你可以掌控自己的时间。",
      "有些人或许会怀念传统的点餐服务，但另一些人却觉得这种「数字距离」悄然带来了解放感。",
      "一个小小的二维码，彻底改写了外出就餐的仪式。"
    ],
    notes: [
      { en: "a whole world opens up", zh: "一个全新的世界就此展开", note: "opens up 表示「展开、呈现」，画面感强" },
      { en: "in action", zh: "在操作中的；正在施展的", note: "the chef in action＝大实际操作的过程" },
      { en: "in the mood", zh: "有心情；有兴致", note: "not in the mood＝没那个心情，口语高频" },
      { en: "invisible infrastructure", zh: "无形的基础设施", note: "写作好词，形容看不见却支撑一切的系统" },
      { en: "pure efficiency", zh: "纯粹的效率", note: "pure 起强调作用，比 just efficiency 更地道" },
      { en: "get to do sth", zh: "得以……；有机会做……", note: "You get to own your time＝你能掌控自己的时间" },
      { en: "old school", zh: "老派的；传统的", note: "old school service＝传统的人工服务" },
      { en: "the ritual of", zh: "……的仪式／固定流程", note: "the ritual of eating out＝外出就餐这套仪式" }
    ]
  },
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
