#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
兰香如故 · 英文有声剧集 生成器
================================
把每集「英文分段 + 中文翻译」生成为：
  1) public/lanxiang/EPxx_seg_NN.m4a  —— 逐段母语英语配音（macOS `say` Samantha）
  2) public/lanxiang/EPxx.html        —— 对齐主站字体/玻璃化/aquatic 金本的有声页
  3) 兰香如故/EPxx.html + 兰香如故/EPxx_seg_NN.m4a —— 同源归档副本（file:// 直开可播）

机制（已验证）：
  - `say -v Samantha -f 文本.txt -o 分段.m4a` 直接产出浏览器原生支持的 m4a（无需 ffmpeg）
  - `afinfo` 取每段时长（仅用于日志/校验，播放用 per-segment 换源，无需偏移表）
  - 嵌入主站 iframe 时：背景透明透出鱼影、明暗随主站、指针转发给主站鱼群聚拢
  - 独立打开：跟随系统深浅色 + 自绘同参鱼影

用法：
  python3 scripts/gen_lanxiang.py            # 生成全部（EP02 解析现有 html，EP03-05 用内置文案）
  python3 scripts/gen_lanxiang.py ep03      # 仅生成某集
"""
import subprocess, re, html, os, sys, shutil
from pathlib import Path

ROOT = Path("/Users/linqiongni/Downloads/linqiongni_profile")
PUB  = ROOT / "public" / "lanxiang"
SRC  = ROOT / "兰香如故"
VOICE = "Samantha"
PUB.mkdir(parents=True, exist_ok=True)
SRC.mkdir(parents=True, exist_ok=True)

# ---------- 集数文案 ----------
# EP02 从现有 html 解析（保留用户真文字）；EP03-05 内置我方创作续作。
def parse_existing_html(path: Path):
    """从已有 EP02.html 抽取 (en, zh) 段落序列（顺序保持）"""
    t = path.read_text(encoding="utf-8")
    # 匹配 <blockquote/p class="seg" ...>EN</...> 与其后 <details class="zhfold">...<p>ZH</p></details>
    seg_re = re.compile(r'<(blockquote|p)\s+class="seg"[^>]*>(.*?)</\1>', re.S)
    zh_re  = re.compile(r'<details class="zhfold">.*?<p>(.*?)</p>', re.S)
    segs = seg_re.findall(t)
    out = []
    pos = 0
    for tag, en in segs:
        en = re.sub(r'\s+', ' ', en).strip()
        # 找该 seg 之后的 zhfold
        after = t[pos:]
        mz = zh_re.search(after)
        zh = re.sub(r'\s+', ' ', mz.group(1)).strip() if mz else ""
        out.append((en, zh))
        # 推进 pos 到该 seg 之后
        idx = t.find(en[:30], pos)
        pos = idx + len(en) if idx > 0 else pos + 1
    return out

EP03 = [
 ("Let me tell you about episode three, because episode two ended with two people living three streets apart and not knowing it — and episode three is the slow, almost accidental tightening of the thread between them.",
  "让我跟你讲讲第三集吧，因为第二集停在两个人相隔三条街、彼此不知的境地——而第三集，是那根线缓慢地、近乎无意地，开始收紧。"),
 ("Word of what happened at the Rongbao Pavilion spreads the way news does in a close courtyard: quietly, and then everywhere. A bonded hired hand's daughter, they say, is the one who saw through the forgery. Old Master Lin, it's whispered, asked after her by name. For Jialan, who spent six years learning to be invisible, being noticed at all is its own small danger.",
  "荣宝阁里发生的事，像大杂院里的新闻那样传开：先是悄无声息，然后到处都是。说是那个奴籍帮工的女儿，看破了那幅赝品。据说林老太爷还点名问起她。对嘉兰而言，花了六年学做隐形人的她，被人注意到本身，就是一种小小的危险。"),
 ("She says nothing. She keeps her head down, carries her father's meals, scrubs the linens. But the head clerk, the Da Zhanggui, has started handing her the easier tasks — sorting the scroll racks, wiping the glass over the inkstones — and she learns the shop the way she once learned a household: by watching who touches what, and what they pretend not to see.",
  "她什么也没说。依旧低着头，给父亲送饭，浆洗衣物。可大掌柜开始把轻省活计交给她——理画轴架、擦砚台上的玻璃罩——而她像当年摸透一个宅门那样，把铺子也摸透了：看谁碰什么，又假装没看见什么。"),
 ("Meanwhile, across the city, Lin Jinqi comes home to a colder house than the one he left. The Zhao girl — now his wife — is beautiful and composed and exactly as distant as her father intended. The war hero finds that a medal earns a man respect from strangers and silence from the woman he sleeps beside. He drinks more than the household likes, and walks the long way home past the bonded quarters without quite knowing why.",
  "与此同时，城的彼端，林锦岐回到一座比离时更冷的家。赵家的女儿——如今他的妻子——美丽、端凝，也恰如她父亲所愿地疏离。这位英雄发现，一枚勋章换得来陌生人的敬重，却换不来枕边人的言语。他酒喝得比府里乐意看到的要多，也总绕远路走过奴籍聚居的巷子，自己也不大清楚为什么。"),
 ("One morning Jialan is sent to deliver a repaired brush-case to the Lin residence itself. She has never set foot past the outer gate. The courtyard is larger than her whole world; the stone under her cloth shoes is cut finer than anything she owns. A servant girl her own age smirks and says, 'You there — the bonded one — mind the threshold.' Jialan lowers her eyes and does, the way she has learned to do with everyone who holds a threshold over her head.",
  "一天早上，嘉兰被派去林府本宅送一只修好的笔匣。她从没踏进过外门以内。那院子比她整个天地还大；她布鞋下的石，凿得比她任何一件物事都细。一个与她同岁的丫鬟撇嘴道：'你，那个奴籍的，当心门槛。'嘉兰垂下眼，照做了——对每一个把门槛压在她头上的人，她都已学会如此。"),
 ("What she does not know is that Lin Jinqi is standing in the gallery above, and that something about the slope of her shoulder, the careful way she sets the case down without a sound, catches at a memory he cannot place. He says nothing. He only watches until she is gone, then finds himself at the rail where she stood, tracing the grain of the wood she touched.",
  "她不知道的是，林锦岐正站在上面的廊下，而她肩头微微的斜度、放笔匣时那无声的仔细，勾起了他一个安置不下的记忆。他什么也没说。只目送她离去，而后发现自己站在她站过的栏杆处，顺着她碰过的木纹，一点点描。"),
 ("Back at the shop, Jialan's eye keeps proving itself. A regular brings a poem-scroll said to be by a famous hand; she pauses at the seal, the way a person pauses at a face that resembles someone they loved. 'The paper's wrong for the reign,' she tells her father, who tells the Da Zhanggui, who tells Old Master Lin. The old man comes, looks, and for the second time, leaves pleased. Jialan is becoming, without meaning to, the shop's quiet conscience.",
  "回到铺子，嘉兰的眼力一证再证。一位常客拿来一轴据称出自名家的诗卷；她在那方印上顿了顿，像一个人在一张像故人的脸上顿住。'这纸的年份，对不上那个年号。'她对父亲说，父亲转告大掌柜，大掌柜转告林老太爷。老太爷来了一看，第二次，满意地走了。嘉兰不知不觉间，成了这铺子安静的良心。"),
 ("The Zhao family notices. They would not, perhaps, if Jinqi were happy — but a restless war hero is a loose thread in a marriage meant to bind two houses, and the Zhao clan has clerks who count everything. A note is sent to the Lin residence: who is this girl in the curio shop, and why does the young master walk past the bonded quarters so often of late?",
  "赵家注意到了。若锦岐安分，或许不会；可一个 restless 的英雄，是这桩本要系住两家的婚姻里一根松脱的线，而赵家有的是会算计下人的清客。一张便笺送进林府：这字画铺里的丫头是谁，又为何少爷近来总走过奴籍巷子？"),
 ("It is nothing yet. A question is not an accusation. But Jialan feels the air shift the way a household dog feels a storm — by scent, before the rain. She tells her father she'd rather not deliver to the residence anymore. Xu Wanquan, who has spent a life reading rooms, does not ask why. He simply tells the Da Zhanggui his daughter is needed at the shop, and the errands to the Lin house stop.",
  "眼下还什么都不是。一个问题还不是一桩罪。可嘉兰感到空气变了，像看家狗在雨前凭气味知觉风暴。她告诉父亲，她不愿再去本宅送东西了。许万全一辈子读人脸色，没问为什么。只跟大掌柜说女儿铺子里离不得人，去林府的差事便停了。"),
 ("Episode three's quiet climax is a non-event. Lin Jinqi, out walking, rounds a corner and nearly collides with a girl carrying linens from the well — Jialan, who ducks her head and murmurs an apology and is gone before he can see her face. He is left holding a single dropped hairpin that is not hers, and a feeling he cannot name. The thread has passed within an arm's length and not once touched.",
  "第三集安静的高潮，是一件没发生的事。林锦岐散步转过街角，险些撞上一位从井边拎着衣裳的姑娘——嘉兰，她低头道了声歉，趁他看清脸之前便去了。他手里只多了一支并非她落下的发簪，和一种说不清的感觉。那根线曾近在臂距，却一次也没碰上。"),
 ("And still, underneath, the episode is kind. Jialan buys a small freedom she never names: she saves a copper from the sweet vendor, and one evening slips her parents the extra bun they pretend not to notice she bought. Six years ago she was a corpse's daughter on a boat. Now she is a girl who can, occasionally, buy someone she loves a bun. The world is turning back, exactly as slowly as she feared it would.",
  "而这一集的底下，到底是温和的。嘉兰买下一种她从不点名的自由：从卖糖人那儿省下一枚铜钱，有天傍晚给父母塞了那只他们假装没看见是她买的馒头。六年前她是船上一具尸体的女儿。如今她是个偶尔能给所爱之人买个馒头的姑娘。世界正转回来，慢得恰如她所惧。"),
 ("That's episode three. No one is unmasked. No secret is spoken. But two people who were promised to each other before either could choose have now, without knowing, stood close enough to share the same breath of air — and the show lets the moment pass, because the best tensions are the ones nobody in the story has noticed yet.",
  "那就是第三集。没有人被揭穿。没有秘密被说出。但两个在各自能选择之前便被许配的人，如今已在不自知中，近到能分同一口空气——而剧集任那刻过去，因为最好的张力，是故事里谁都还没察觉的那一种。"),
]

EP04 = [
 ("Let me tell you about episode four, because episode three let two people brush past each other unseeing — and episode four is what happens when someone with reason to hate the Shen name starts, very slowly, to wonder who the quiet girl in the curio shop really is.",
  "让我跟你讲讲第四集吧，因为第三集让两个人擦肩而过、互不相识——而第四集，是一个有理由恨沈家的人，如何极缓慢地，开始疑心那字画铺里安静的姑娘究竟是谁。"),
 ("The Zhao clan's question does not die. A clerk is dispatched, informal and smiling, to 'browse' the Rongbao Pavilion — and to watch. He notes the girl's hands (too fine for a bonded servant's daughter), her reading (she corrects a character on a label without thinking), and the way Old Master Lin's clerk defers to her. He reports back in a sentence: 'That one is not what she pretends to be.'",
  "赵家的问题没有过去。一个清客被派来，客客气气地'逛'荣宝阁——也是来盯人的。他记下姑娘的手（太细，不似奴籍帮工之女）、她的识字（想也不想便改了标签上一个字）、以及林老太爷的掌柜对她的退让。他回去一句话：'那位，不是她装的那个人。'"),
 ("Lin Jinqi hears the report and feels, for the first time, something like interest rather than restlessness. He does not connect her to the Shen family — that name is a closed door in his mind, boarded shut by his father's displeasure. He connects her only to the feeling at the rail, the slope of a shoulder, the unhurried hands. He begins, careless at first, to find reasons to be near the shop.",
  "林锦岐听了回报，头一回生出的不是躁动，而是兴趣。他没把她和沈家连起来——那个姓在他心里是一扇钉死的门，被父亲的恼怒封着。他只把她和栏杆处的感觉、肩头的斜度、那双不慌不忙的手连在一起。他开始，起先漫不经心，找起靠近那铺子的由头。"),
 ("Jialan feels him before she sees him. A war hero does not move like a customer; he carries the particular stillness of a man who has stood in open ground and waited for arrows. She glances up once, and something in her goes very cold and very still — not recognition of his face, but recognition of danger wearing a familiar shape. She has spent her life reading rooms. This room, suddenly, has a wolf in it.",
  "嘉兰是未及见他便先觉出他。英雄走路不似顾客；他带着一种特定静气，是曾在空旷之地候箭的男人才有。她抬头一瞥，身子某处变得极冷极静——不是认出了他的脸，而是认出了披着熟悉形状的危险。她一辈子读人脸色。这间屋子，忽然有了狼。"),
 ("She tells her father she is unwell and stays home two days. Xu Wanquan asks no questions; he has questions enough of his own. On the third day she returns, and the young master is gone from the street — but the Zhao clerk is back, and this time he is not browsing. He is asking the Da Zhanggui, too loudly, where the girl learned to read.",
  "她告诉父亲身子不适，在家歇了两日。许万全没问——他自己有的是问号。第三日她回去，街上的少爷是不见了——可赵家的清客又来了，这回不是逛。他问得太大声：这姑娘的字，是在哪儿念的。"),
 ("The Da Zhanggui, wary now, answers lightly and turns away. But the question has been asked in a voice meant to be overheard, and Jialan understands the shape of the trap: not 'who is she' yet, but 'how does a bonded servant's daughter read law-character labels.' The answer, if they dig, leads to a dead academician and a forbidden name. She sleeps that night with the talisman her mother left her pressed to her palm.",
  "大掌柜如今警觉，淡淡答了，转身走开。可这问题是用存心让人听见的嗓门问的，嘉兰看清了陷阱的形状：还不是'她是谁'，而是'一个奴籍帮工的女儿，怎认得律法字样的标签'。这答案若被刨，会引向一位死去的大学士，和一个被禁的姓。那夜她睡着时，母亲留下的符按在掌心。"),
 ("Episode four's turn comes from an unexpected hand. Old Master Lin, pleased with the shop's fortunes, announces a small contest: his clerks may each submit one item from the storeroom they believe undervalued, and the sharpest eye wins a prize. The Da Zhanggui, to flatter his master, puts Jialan's name forward as 'the girl with the good eye.' It is meant as a compliment. It is, in fact, a lantern held up to her face.",
  "第四集的转折，出人意料地来自一只手。林老太爷见铺子兴旺，宣布一个小比试：手下人各从库房挑一件自认被低估的物事，眼力最利者得赏。大掌柜为讨好东家，把嘉兰的名字报上去，称'那丫头眼力好'。本意是夸。实则，是把照着她脸的一盏灯。"),
 ("Jialan submits a humble inkstone, mislabeled for a century, whose underside bears a reign-mark no one bothered to turn it over for. She says, in front of the old master, only: 'The stone remembers what the label forgets.' Lin Jinqi is present for the contest — his father insisted — and for the first time he hears her voice. It does something to him he cannot account for. The voice is low, careful, and oddly formal, as if shaped by books.",
  "嘉兰交上一块朴素的砚，被误标了一个世纪，底下有方年款，无人肯翻过来看。她当着老太爷只说：'石记得标签忘的事。'林锦岐在座——他父亲坚持要他来——头一回听见她说话。那声音在他心里搅起无法解释的东西。低，仔细，且奇异地文雅，仿佛被书塑过形。"),
 ("That night the Zhao clerk writes his second note: the girl speaks like a scholar's daughter, not a servant's. The Zhao clan, patient and thorough, begins to pull the thread in earnest. They do not yet know the name Shen. They only know a false bottom is waiting to be knocked out — and that the young master, who should be theirs, keeps finding his way to a curio shop.",
  "那夜赵家清客写下第二张便笺：这姑娘说话像学士之女，不像奴婢。赵家耐性而周全，开始认真抽那根线。他们尚不知沈这个姓。只知道一处假底，等着被人敲开——而本该是赵家的人，总寻路去一家字画铺。"),
 ("Jialan, for her part, has made a decision. She will not run. Running is what killed her mother, she thinks — the flight, the borrowed name, the life lived three streets from the people who wanted her dead. She will stay, and she will be careful, and if they come for her she will meet them with the only weapon she has ever owned: a clear eye and a quiet tongue.",
  "嘉兰这边，已下了决断。她不走。逃，是害死母亲的的东西，她想——那逃亡、那借来的名、那活在想她死的人三条街外的日子。她留下，她小心，若他们来寻她，她以平生唯一的兵器迎他们：一双清眼，一条静舌。"),
 ("Episode four ends where episode three did — with two people uncaught, unconfessed, a thread pulled almost to the snapping point and held, for one more breath, by nothing but the show's mercy. But this time Jinqi has heard her voice. And Jialan has felt the wolf. Neither will forget.",
  "第四集收在第三集的地方——两个人仍未被擒、未坦白，一根线被拉到几乎崩断，又凭剧集的慈悲，为多喘一口气而悬着。但这一回，锦岐听见了她的声音。嘉兰也觉出了那匹狼。谁都不会忘。"),
]

EP05 = [
 ("Let me tell you about episode five, because episode four held the thread at the breaking point — and episode five is the first time the two people at its ends are given, by accident, a real reason to look at each other's faces.",
  "让我跟你讲讲第五集吧，因为第四集把那根线悬在崩断处——而第五集，是线的两端头一回，因一个意外，得了确凿的理由，去望对方的脸。"),
 ("The Rongbao Pavilion is commissioned to mount a small exhibition for the city's scholars — a harmless prestige piece for Old Master Lin. Jialan is tasked, as the 'girl with the good eye,' with arranging the scroll racks by reign and school. She works the floor for two days, unseen behind the screens, while the young master is summoned by his father to attend as the family's representative.",
  "荣宝阁受委托，为城中士子办一场小展——于林老太爷不过一桩无伤体面的风光。嘉兰以'眼力好的丫头'之名，受命按年号与流派理画轴架。她在屏风后埋首两日，无人得见，而少爷被其父唤来，以林家代表之名出席。"),
 ("On the second afternoon a scholar drops a lacquer box at the threshold and the contents — a collector's seals, dozens of them — spill across the floor. Jialan is the nearest hand. She kneels, gathers them, and without thinking sorts them by carver and decade the way another might sort pebbles. A small crowd forms. Among them, Lin Jinqi, who has been avoiding her face all afternoon, looks down — and finds her looking up.",
  "第二日午后，一位士子在门槛处摔了只漆盒，里头——藏家印鉴，数十方——洒了一地。嘉兰最近，跪下拾拢，想也不想便按刻工与年代分了类，如旁人理石子。小圈子围上。其中林锦岐，一下午都在避开她的脸，低头——却正撞上她抬起的眼。"),
 ("For one held second neither performs. His breath catches; hers does not, but something in her goes still in the old way, the way it went still when the wolf entered the room. She sets the last seal in his palm — deliberate, unhurried, the same hands he remembered from the rail — and rises and is gone before he can speak. But the face is now a face. The thread has, at last, a name to wear on each end.",
  "被定住的那一瞬，谁都没做戏。他屏息；她没有，可她身子某处以旧法静下，正如狼入屋时那样。她将最后一方印放入他掌心——刻意、不慌，正是他记得的栏杆处的那双手——起身，趁他开口前去了。但那脸，如今是张脸了。那根线，终于两端都有了可挂的名。"),
 ("Lin Jinqi does the unwise thing a restless man does: he asks the Da Zhanggui about her. The clerk, who has his own reasons to be careful, says only that she is Xu's daughter, a bonded servant's child, a good eye, nothing more. 'Bonded,' Jinqi repeats, and something in him — the part that was raised to command, the part his father beat flat — sits up. A bonded girl who reads like a scholar. A bonded girl his father's clerk defers to. The contradiction itches.",
  "林锦岐做了一桩 restless 的人会做的糊涂事：他去问大掌柜她的来历。掌柜自有小心之处，只说她是许家女儿，奴籍出身，眼力好，余者没有。'奴籍，'锦岐重复，而他里头——那被养来号令、被父亲打平的部分——竖起了耳朵。一个奴籍丫头，念书像学士。一个奴籍丫头，父亲的掌柜对她退让。这矛盾，痒。"),
 ("The Zhao clan feels the itch too. Their clerk reports the incident at the threshold, and the phrase 'the young master looked down and found her looking up' lands like a stone in still water. A marriage meant to bind two houses cannot abide a war hero who lingers on a bonded girl's face. A quieter, sharper instruction goes out: learn the girl's true name, and learn it before the young master does.",
  "赵家也觉出了那痒。清客报了门槛处那一幕，'少爷低头，正撞上她抬眼'这句话，落进静水如石。一桩本要系住两家的婚姻，容不下一个英雄少爷在奴籍丫头脸上流连。一道更轻更利的指令发出：弄清这姑娘的真名，且抢在少爷之前。"),
 ("Jialan knows none of this. She knows only that the young master looked at her, and that looking, for a girl with a borrowed name, is the most dangerous thing in the world. She tells her father, finally, a version of the truth: that the Lin family's son makes her afraid, and that fear is a thing she has learned to trust. Xu Wanquan, who has carried her secret six years, holds her hand and says the only honest thing he can: 'Then we watch the door together.'",
  "嘉兰对这些一无所知。她只知少爷看了她，而'被看'，对一个借名儿的姑娘，是这世上最险的事。她终于对父亲说了几分真：林家的少爷让她害怕，而怕，是她学会去信的东西。许万全藏她秘密六年，握住她的手，只说得出一句实话：'那咱爷俩一起望着那门。'"),
 ("Episode five's set piece is small and perfect. Lin Jinqi, unable to sleep, walks to the shop after dark and finds the side lamp lit — Jialan mending a screen by himself, humming a tune his grandmother used to hum, a tune from a house that no longer exists. He stops at the window. He does not know the tune is a Shen lullaby. But something in the melody makes his chest ache the way a half-remembered name does.",
  "第五集的重场戏，小而妥帖。林锦岐夜不成眠，天黑后踱到铺子，见侧灯亮着——嘉兰独自补一扇屏风，哼着祖母曾哼的调子，那调子出自一所已不存在的宅子。他在窗外停住。他不知那是沈家的摇篮曲。可那旋律里有什么，揪得他胸口发疼，如一个半被记起的名字。"),
 ("He does not go in. He cannot say why. He only stands until the lamp is blown out, and walks home with a melody and a face and a contradiction he cannot name — and with the first unbidden thought of his adult life that is not about duty or wine or his father's displeasure, but about a girl he is not allowed to want.",
  "他没进去。他说不清为什么。只站到灯灭，带着一段旋律、一张脸、一个说不清的矛盾走回家——也带着成年后头一个不由自主的念头，不为职守、不为酒、不为父亲的恼怒，而为一个他不该想的姑娘。"),
 ("That's episode five. Still no name spoken. Still no unmasking. But a wolf has stood at a window and chosen not to enter, and a girl with a dead family's lullaby has been heard by the one man who must never hear it. The thread is pulled to its limit now — and episode six is the hand that finally, gently, lets it go.",
  "那就是第五集。仍无人说出名字。仍无人被揭穿。但一匹狼曾立窗前，选了不进去；一个怀着亡家摇篮曲的姑娘，已被那绝不该听见的男人听见。那根线如今拉到极限——而第六集，是终于、轻轻，松开它的那只手。"),
]

# ---------- 生成单集 ----------
HEAD = '''<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{TITLE}</title>
<script>
document.documentElement.classList.toggle('embedded', !!(window.parent && window.parent !== window));
(function () {
  var r = document.documentElement;
  function apply(m) { r.setAttribute('data-theme', m === 'light' ? 'light' : 'dark'); }
  if (r.classList.contains('embedded')) { apply('dark'); }
  else { apply(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.type === 'theme' && (d.mode === 'light' || d.mode === 'dark')) apply(d.mode);
  });
})();
</script>
<style>
  :root, html[data-theme="light"] {
    --bg:#FDFCF9; --card:#FFFFFF; --card-border:#E8E8E6;
    --ink:#23201B; --ink-soft:#8a7c63; --ink-faint:#b3a888;
    --gold:#B89F6B; --gold-deep:#92702f;
    --seg-hover:#f0e7d4; --seg-active:#f3e8cf;
    --zh:#4a423a; --bar:#e7ddc7;
    --shadow:0 6px 20px rgba(120,90,40,.08);
    --bq-bg:#fbf6ec; --bq-ink:#7a5a22;
    --sans:-apple-system,BlinkMacSystemFont,"SF Pro Display","PingFang SC","Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
    --serif:Georgia,"Times New Roman","Noto Serif SC",serif;
  }
  html[data-theme="dark"] {
    --bg:#091A2E; --card:#0C1B2B; --card-border:#1B2E45;
    --ink:#F4EFE4; --ink-soft:#93A6BC; --ink-faint:#6E8299;
    --gold:#C9A86A; --gold-deep:#A08442;
    --seg-hover:rgba(201,168,106,.10); --seg-active:rgba(201,168,106,.16);
    --zh:#C7CBBF; --bar:#1B2E45;
    --shadow:0 6px 22px rgba(0,0,0,.35);
    --bq-bg:#12263C; --bq-ink:#D9C79B;
    --sans:-apple-system,BlinkMacSystemFont,"SF Pro Display","PingFang SC","Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
    --serif:Georgia,"Times New Roman","Noto Serif SC",serif;
  }
  html.embedded { color-scheme:light; background:transparent !important; background-image:none !important; }
  html.embedded body { background:transparent !important; background-image:none !important; }
  html.embedded .player { background:transparent !important; box-shadow:none !important; border-color:transparent !important; }
  html.embedded blockquote.seg { background:transparent !important; }
  html.embedded .seg:hover { background:var(--seg-hover) !important; }
  html.embedded .seg.active { background:var(--seg-active) !important; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--ink);
    font-family:var(--sans); line-height:1.85; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
  .wrap { max-width:760px; margin:0 auto; padding:32px 22px 64px; }
  h1 { font-family:var(--serif); font-size:26px; text-align:center; margin:0 0 4px; letter-spacing:.5px; }
  .sub { text-align:center; color:var(--gold); font-size:14px; margin-bottom:6px; letter-spacing:2px; font-family:var(--sans); }
  .hint { text-align:center; font-size:12px; color:var(--ink-soft); margin-bottom:22px; font-family:var(--sans); }
  .player { background:var(--card); border:1px solid var(--card-border); border-radius:14px;
    padding:18px 22px; display:flex; align-items:center; gap:18px;
    box-shadow:var(--shadow); margin-bottom:14px; font-family:var(--sans); }
  .playbtn { flex:0 0 auto; width:58px; height:58px; border-radius:50%; border:none;
    cursor:pointer; background:var(--gold); color:#fff; font-size:22px;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 12px rgba(168,133,63,.4); }
  .playbtn:hover { background:var(--gold-deep); }
  .meta { flex:1 1 auto; }
  .track { font-size:14px; color:var(--ink-soft); margin-bottom:8px; }
  .bar { height:6px; background:var(--bar); border-radius:3px; cursor:pointer; overflow:hidden; }
  .fill { height:100%; width:0%; background:var(--gold); }
  .time { font-size:12px; color:var(--ink-soft); margin-top:6px; display:flex; justify-content:space-between; }
  .speed { flex:0 0 auto; font-size:12px; color:var(--ink-soft); border:1px solid var(--card-border);
    border-radius:8px; padding:4px 8px; background:var(--card); cursor:pointer; }
  .seg { margin:0 0 6px; font-size:17px; cursor:pointer; border-radius:8px;
    padding:6px 10px; transition:background .15s; position:relative; font-family:var(--sans); }
  .seg:hover { background:var(--seg-hover); }
  .seg::before { content:"\\1F50A\\00A0"; opacity:.35; font-size:13px; }
  .seg.active { background:var(--seg-active); box-shadow:inset 3px 0 0 var(--gold); }
  .seg.active::before { content:"\\25B6\\00A0"; opacity:1; }
  .seg.active.paused::before { content:"\\23F8\\00A0"; opacity:1; }
  blockquote.seg { margin:14px 0 6px; padding:10px 18px; border-left:4px solid var(--gold);
    font-family:var(--serif); font-size:20px; font-style:italic; color:var(--bq-ink); background:var(--bq-bg); }
  blockquote.seg:hover { background:var(--seg-hover); }
  details.zhfold { margin:0 0 22px 0; }
  details.zhfold summary { cursor:pointer; color:var(--gold); font-size:13px;
    padding:4px 0 4px 10px; list-style:none; font-family:var(--sans); }
  details.zhfold summary::before { content:"\\25B8\\00A0"; }
  details.zhfold[open] summary::before { content:"\\25BE\\00A0"; }
  details.zhfold[open] summary { margin-bottom:8px; }
  details.zhfold p { margin:0; font-size:16px; color:var(--zh); padding-left:10px; font-family:var(--sans); }
  footer { text-align:center; color:var(--ink-faint); font-size:12px; margin-top:40px; font-family:var(--sans); }
</style>
</head>
<body>
<div class="wrap">
  <h1>兰香如故 · The Fragrance of Orchids Remains</h1>
  <div class="sub">{SUB}</div>
  <div class="hint">点击任意一段英文即可播放该段配音；下方「🇨🇳 中文翻译」展开对应译文</div>
  <div class="player">
    <button class="playbtn" id="btn" aria-label="播放">▶</button>
    <div class="meta">
      <div class="track" id="track">English narration · 逐段母语配音</div>
      <div class="bar" id="bar"><div class="fill" id="fill"></div></div>
      <div class="time"><span id="cur">0:00</span><span id="dur">0:00</span></div>
    </div>
    <div class="speed" id="spd">1.0×</div>
  </div>
  <div class="err" id="err" style="display:none"></div>
  <div class="story">
'''

TAIL = '''  </div>
  <footer>兰香如故 · 第 {EPN} 集有声剧集介绍 · 逐段中英对照（母语英语配音）</footer>
</div>
<audio id="au" preload="metadata"></audio>
<script>
  const HAS_AUDIO = true;
  const SEG = {SEG_ARRAY};
  const au=document.getElementById('au'), btn=document.getElementById('btn'),
        bar=document.getElementById('bar'), fill=document.getElementById('fill'),
        cur=document.getElementById('cur'), dur=document.getElementById('dur'),
        spd=document.getElementById('spd'), err=document.getElementById('err'),
        track=document.getElementById('track');
  const segs=[...document.querySelectorAll('.seg')];
  let active=-1, playAll=false;
  const fmt=s=>{const m=Math.floor(s/60),x=Math.floor(s%60);return m+':'+(x<10?'0':'')+x;};
  function setActive(i,playing){
    segs.forEach(s=>s.classList.remove('active','paused'));
    if(i>=0){ segs[i].classList.add('active'); if(!playing) segs[i].classList.add('paused'); }
    active=i;
  }
  function playSeg(i){
    if(active===i && !au.paused){ au.pause(); return; }
    if(au.src.indexOf(SEG[i])===-1) au.src=SEG[i];
    track.textContent='EP seg '+(i+1)+' / '+SEG.length;
    au.play().then(()=>setActive(i,true)).catch(()=>{err.style.display='block';});
  }
  segs.forEach(s=>s.addEventListener('click',()=>{playAll=false;playSeg(+s.dataset.i);}));
  au.addEventListener('loadedmetadata',()=>dur.textContent=fmt(au.duration));
  au.addEventListener('timeupdate',()=>{ if(au.duration){ fill.style.width=(au.currentTime/au.duration*100)+'%'; cur.textContent=fmt(au.currentTime);} });
  au.addEventListener('play',()=>{ btn.textContent='⏸'; if(active>=0) setActive(active,true); });
  au.addEventListener('pause',()=>{ btn.textContent='▶'; if(active>=0) segs[active].classList.add('paused'); });
  au.addEventListener('ended',()=>{
    if(playAll && active < segs.length-1){ playSeg(active+1); }
    else { btn.textContent='▶'; setActive(-1,false); playAll=false; track.textContent='English narration · 逐段母语配音'; }
  });
  au.addEventListener('error',()=>{ err.textContent='音频加载失败：请确认 EP{EPN}_seg_XX.m4a 与本页同目录'; err.style.display='block'; });
  btn.onclick=()=>{
    if(au.paused){ if(active<0){ playAll=true; playSeg(0); } else { au.play(); } }
    else { au.pause(); }
  };
  bar.onclick=e=>{const r=bar.getBoundingClientRect(); if(au.duration) au.currentTime=((e.clientX-r.left)/r.width)*au.duration;};
  const rates=[1,1.25,1.5,0.75]; let ri=0;
  spd.onclick=()=>{ri=(ri+1)%rates.length;au.playbackRate=rates[ri];spd.textContent=rates[ri]+'×';};
</script>
<script>(function(){if(window.__aqKitV4)return;window.__aqKitV4=1;try{
var EMBEDDED=false;try{EMBEDDED=!!(window.parent&&window.parent!==window);}catch(e){EMBEDDED=false;}
if(EMBEDDED){
var lastFwd=0;
document.addEventListener('pointermove',function(e){
var now=Date.now();if(now-lastFwd<16)return;lastFwd=now;
try{window.parent.postMessage({type:'aquatic-pointer',x:e.clientX,y:e.clientY},'*');}catch(_){}
},{passive:true});
return;
}
var s=document.createElement('script');s.src='/theme-kit/profile-bg.js?v=20260928b';s.defer=true;
(document.head||document.documentElement).appendChild(s);
}catch(e){}})();</script>
</body>
</html>
'''

def synth(text: str, out: Path) -> float:
    tmp = "/tmp/lx_seg.txt"
    Path(tmp).write_text(text, encoding="utf-8")
    subprocess.run(["say", "-v", VOICE, "-f", tmp, "-o", str(out)], check=True)
    info = subprocess.run(["afinfo", str(out)], capture_output=True, text=True).stdout
    m = re.search(r"estimated duration:\s*([\d.]+)", info)
    return float(m.group(1)) if m else 0.0

def build_html(epn: int, title: str, sub: str, segs):
    story = []
    for i, (en, zh) in enumerate(segs):
        tag = "blockquote" if i == 0 or i == len(segs) - 1 else "p"
        en_h = html.escape(en, quote=False)
        zh_h = html.escape(zh, quote=False)
        story.append(f'<{tag} class="seg" data-i="{i}">{en_h}</{tag}>')
        story.append(f'<details class="zhfold"><summary>🇨🇳 中文翻译</summary><p>{zh_h}</p></details>')
    seg_arr = "[" + ",".join(f"'EP{epn:02d}_seg_{i+1:02d}.m4a'" for i in range(len(segs))) + "]"
    return (HEAD.replace("{TITLE}", title).replace("{SUB}", sub) + "\n".join(story) +
            TAIL.replace("{EPN}", str(epn)).replace("{SEG_ARRAY}", seg_arr))

def gen_episode(epn: int, segs):
    epd = f"EP{epn:02d}"
    sub = f"EPISODE {epn} · TOLD LIKE A STORY · 有声版"
    title = f"兰香如故 · Episode {epn} — Audio Story"
    total = 0.0
    for i, (en, zh) in enumerate(segs):
        out_pub = PUB / f"{epd}_seg_{i+1:02d}.m4a"
        out_src = SRC / f"{epd}_seg_{i+1:02d}.m4a"
        if out_pub.exists() and out_pub.stat().st_size > 2000:
            # 命中缓存：跳过 say 合成，仅取时长 + 确认同源副本
            info = subprocess.run(["afinfo", str(out_pub)], capture_output=True, text=True).stdout
            m = re.search(r"estimated duration:\s*([\d.]+)", info)
            d = float(m.group(1)) if m else 0.0
            if not out_src.exists() or out_src.stat().st_size != out_pub.stat().st_size:
                shutil.copy(out_pub, out_src)
            print(f"  (缓存) {epd}_seg_{i+1:02d}.m4a  {d:6.2f}s")
        else:
            d = synth(en, out_pub)
            shutil.copy(out_pub, out_src)
            print(f"  {epd}_seg_{i+1:02d}.m4a  {d:6.2f}s")
        total += d
    html_text = build_html(epn, title, sub, segs)
    (PUB / f"{epd}.html").write_text(html_text, encoding="utf-8")
    (SRC / f"{epd}.html").write_text(html_text, encoding="utf-8")
    print(f"  -> {epd}.html 生成（{len(segs)} 段，配音总时长 {total/60:.1f} 分）")

def main():
    only = sys.argv[1].lower() if len(sys.argv) > 1 else None
    # EP02：解析现有 html（保留用户真文字）
    ep02_segs = parse_existing_html(PUB / "EP02.html")
    plan = {
        2: ("EP02", ep02_segs),
        3: ("EP03", EP03),
        4: ("EP04", EP04),
        5: ("EP05", EP05),
    }
    for epn, (_, segs) in plan.items():
        if only and f"ep{epn}" != only:
            continue
        if epn == 2 and not ep02_segs:
            print("跳过 EP02：未解析到现有段落")
            continue
        print(f"=== 生成 Episode {epn} ===")
        gen_episode(epn, segs)

if __name__ == "__main__":
    main()
