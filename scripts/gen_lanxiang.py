#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
兰香如故 · 英文有声剧集 生成器（v2 —— 对齐第一集）
=================================================
把每集「英文分段 + 中文翻译」生成为：
  1) public/lanxiang/EPxx_whole.m4a    —— 整篇连贯母语英语配音（macOS `say` Samantha，单次合成保证韵律连贯）
  2) public/lanxiang/EPxx.html         —— 单 audio + OFF 偏移表跳转（点击段落跳 currentTime，机制与第一集一致）
  3) 兰香如故/EPxx.html + 兰香如故/EPxx_whole.m4a —— 同源归档副本（file:// 直开可播）

与第一集对齐的关键（修复「发音生硬 / 内容空洞」）：
  - 整篇一次性合成（非逐段独立合成）：韵律连贯，消除短句间机械停顿 —— 这是「生硬」的根因
  - 偏移表 OFF[i]=[start,end] 秒：点击段落 currentTime 跳转，与第一集 OFF 机制一致
  - EP02 保留用户真实英文底稿（14 段长篇，不重写）；EP03-05 为同声线续作（非官方剧情，可替换）
  - 嵌入态：背景透明透鱼影、明暗随主站、指针转发给主站鱼群聚拢；独立开：自绘同参鱼影

用法：
  python3 scripts/gen_lanxiang.py            # 生成 EP02-05
  python3 scripts/gen_lanxiang.py ep03      # 仅生成某集
"""
import subprocess, re, html, json, os, sys, shutil
from pathlib import Path

ROOT = Path("/Users/linqiongni/Downloads/linqiongni_profile")
PUB  = ROOT / "public" / "lanxiang"
SRC  = ROOT / "兰香如故"
VOICE = "Samantha"
RATE  = 168          # 语速：略低于默认，更从容自然（第一集同档次 TTS）
PUB.mkdir(parents=True, exist_ok=True)
SRC.mkdir(parents=True, exist_ok=True)

# ---------- 头部 / 尾部 HTML 模板（变量用 {TITLE}{SUB}{EPN}{OFF_ARR} 占位，避免 .format 的 {} 冲突）----------
HEAD = '''<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{TITLE}</title>
<style>
  :root{
    --sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    --serif: Georgia, "Times New Roman", "Songti SC", "STSong", serif;
    --gold:#B89F6B; --gold-d:#9c7f4a;
    --ink:#23201b; --ink-soft:#4a443b; --ink-faint:#8a8175;
    --card:#fffdf8; --seg-hover:#f3ecdd; --seg-active:#f7f0e1; --bq-bg:#f6efe0; --bq-ink:#3a342c;
    --zh:#5b554c; --line:#e7ddc9;
  }
  html[data-theme="dark"]{
    --sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    --serif: Georgia, "Times New Roman", "Songti SC", "STSong", serif;
    --gold:#C9A86A; --gold-d:#a98c54;
    --ink:#F4EFE4; --ink-soft:#cdd3da; --ink-faint:#7e8a99;
    --card:#0C1B2B; --seg-hover:#13283c; --seg-active:#16314a; --bq-bg:#10243a; --bq-ink:#dfe6ee;
    --zh:#a9b6c6; --line:#22364c;
  }
  html.embedded body{ background:transparent; }
  *{box-sizing:border-box;}
  body{ margin:0; font-family:var(--sans); color:var(--ink);
    background:var(--card); line-height:1.85; padding:26px 20px 60px; }
  .wrap{ max-width:760px; margin:0 auto; }
  h1{ font-family:var(--serif); font-weight:600; font-size:30px; line-height:1.25;
    margin:0 0 6px; color:var(--ink); letter-spacing:.3px; }
  .sub{ font-family:var(--sans); font-size:12.5px; letter-spacing:.18em; text-transform:uppercase;
    color:var(--gold); margin:0 0 14px; }
  .hint{ font-size:13px; color:var(--ink-faint); margin:0 0 16px; }
  .player{ display:flex; align-items:center; gap:14px; padding:12px 16px; border-radius:14px;
    background:transparent; border:1px solid var(--line); margin-bottom:6px; }
  html.embedded .player{ background:transparent; border-color:transparent;
    border-bottom:1px solid var(--line); border-radius:0; }
  .playbtn{ flex:0 0 auto; width:46px; height:46px; border-radius:50%; border:none; cursor:pointer;
    background:var(--gold); color:#fff; font-size:18px; display:flex; align-items:center; justify-content:center;
    box-shadow:0 2px 10px rgba(184,159,107,.35); transition:transform .12s; }
  .playbtn:hover{ transform:scale(1.06); }
  .meta{ flex:1 1 auto; min-width:0; }
  .track{ font-size:13px; color:var(--ink-soft); margin-bottom:6px; font-family:var(--sans); }
  .bar{ height:6px; border-radius:4px; background:var(--line); cursor:pointer; overflow:hidden; }
  .fill{ height:100%; width:0%; background:linear-gradient(90deg,var(--gold),var(--gold-d)); }
  .time{ display:flex; justify-content:space-between; font-size:11px; color:var(--ink-faint); margin-top:4px;
    font-variant-numeric:tabular-nums; }
  .speed{ flex:0 0 auto; font-size:13px; color:var(--gold); cursor:pointer; user-select:none;
    border:1px solid var(--line); border-radius:20px; padding:4px 10px; }
  .seg{ margin:0 0 6px; font-size:17px; cursor:pointer; border-radius:8px;
    padding:6px 10px; transition:background .15s; position:relative; font-family:var(--sans); }
  .seg:hover { background:var(--seg-hover); }
  .seg::before { content:"\\1F50A\\00A0"; opacity:.35; font-size:13px; }
  .seg.active { background:var(--seg-active); box-shadow:inset 3px 0 0 var(--gold); }
  .seg.active::before { content:"\\25B6\\00A0"; opacity:1; }
  .seg.active.paused::before { content:"\\23F8\\00A0"; opacity:1; }
  blockquote.seg { margin:14px 0 6px; padding:10px 18px; border-left:4px solid var(--gold);
    font-family:var(--serif); font-size:20px; font-style:italic; color:var(--bq-ink);
    background:transparent; }
  html.embedded blockquote.seg{ background:transparent; }
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
  <div class="hint">点击任意一段英文即可从该段开始播放整篇配音；下方「🇨🇳 中文翻译」展开对应译文</div>
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
<audio id="au" preload="auto" src="{WHOLE}"></audio>
<script>
  const HAS_AUDIO = true;
  const OFF = {OFF_ARR};
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
    au.currentTime = OFF[i][0] + 0.03;
    track.textContent='EP seg '+(i+1)+' / '+segs.length;
    au.play().then(()=>setActive(i,true)).catch(()=>{err.style.display='block';});
  }
  segs.forEach(s=>s.addEventListener('click',()=>{playAll=false;playSeg(+s.dataset.i);}));
  au.addEventListener('loadedmetadata',()=>dur.textContent=fmt(au.duration));
  au.addEventListener('timeupdate',()=>{
    if(au.duration){ fill.style.width=(au.currentTime/au.duration*100)+'%'; cur.textContent=fmt(au.currentTime); }
    if(active>=0 && !playAll && au.currentTime >= OFF[active][1]-0.06){ au.pause(); }
    let i=OFF.findIndex(o=>au.currentTime>=o[0] && au.currentTime<o[1]);
    if(i<0 && au.currentTime>=au.duration) i=OFF.length-1;
    if(i!==active && i>=0) setActive(i, !au.paused);
  });
  au.addEventListener('play',()=>{ btn.textContent='⏸'; });
  au.addEventListener('pause',()=>{ btn.textContent='▶'; if(active>=0) segs[active].classList.add('paused'); });
  au.addEventListener('ended',()=>{
    if(playAll && active < segs.length-1){ playSeg(active+1); }
    else { btn.textContent='▶'; setActive(-1,false); playAll=false; track.textContent='English narration · 逐段母语配音'; }
  });
  au.addEventListener('error',()=>{ err.textContent='音频加载失败：请确认 {WHOLE} 与本页同目录'; err.style.display='block'; });
  btn.onclick=()=>{
    if(au.paused){ if(active<0){ playAll=true; au.currentTime=OFF[0][0]+0.03; playSeg(0); } else { au.play(); } }
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

# ---------- 集数文案 ----------
def parse_md_ep02(path: Path):
    """从用户 EP02_英文剧集介绍.md 精确抽取 (英文段, 中文段) 配对序列（14 段，保真不重写）"""
    t = path.read_text(encoding="utf-8")
    # 英文区：## Episode 2 之后，到第一个 <details> 之前
    m_en = re.search(r"## Episode 2.*?(?=<details)", t, re.S)
    en_block = m_en.group(0) if m_en else t
    en_paras = [p.strip() for p in re.split(r"\n\s*\n", en_block) if p.strip()
                and not p.strip().startswith("#") and p.strip() != "---"]
    # 中文区：🇨🇳 中文翻译（全文）summary 之后，到 </details> 之前
    m_zh = re.search(r"中文翻译（全文）</summary>\s*(.*?)</details>", t, re.S)
    zh_block = m_zh.group(1) if m_zh else ""
    zh_paras = [p.strip() for p in re.split(r"\n\s*\n", zh_block) if p.strip() and p.strip() != "---"]
    n = min(len(en_paras), len(zh_paras))
    return [(en_paras[i], zh_paras[i]) for i in range(n)]

# ===== EP03 / EP04 / EP05 —— 同声线续作（非官方剧情，可后续替换真实梗概）=====
EP03 = [
 ("Let me tell you about episode three, because episode two set the pieces side by side and trusted you to see the board — and episode three is the hand that starts moving them, the way a tide turns before your feet feel the water shift beneath them.",
  "让我跟你讲讲第三集吧，因为第二集把棋子并排摆好，由你去看那棋盘——而第三集，是那只开始动棋的手，像潮水在脚底感觉到之前，就先悄悄转了向。"),
 ("The ten taels Old Master Lin pressed into Xu Wanquan's palm were never just a reward. In a bonded household they are a key — the exact sum, it turns out, to buy three people out of servitude. Xu Wanquan counts the silver night after night, and every time he does, he looks at the girl he calls his daughter and sees, not a burden, but a debt he will never finish repaying. Jialan, who has spent six years learning not to want, tells him plainly: free all three of us, or free none. She will not step into the light and leave the two who carried her in the dark.",
  "林老太爷塞进许万全掌心的那十两，从来不只是一笔赏银。在奴籍人家，那是一把钥匙——恰是赎出三个人的整数。许万全一夜又一夜地数那银子，每数一次，看向他唤作女儿的姑娘，看见的都不是累赘，而是一笔他这辈子还不清的恩。嘉兰，花了六年学会不奢求的姑娘，明明白白告诉他：要赎连我们三个一起赎，否则一个也别赎。她不肯自己踏入光亮，却把扛着她的两个人留在黑暗里。"),
 ("So the Rongbao Pavilion draws up the papers, and on them the name is not Shen Jialan but Lanxiang — the borrowed name that has, by now, outlived the girl who first wore it. Jialan signs with a brush she has only recently learned to hold, and feels the small, strange weight of becoming someone else on paper. The dead girl's name is now her living one. Somewhere in that, a kind of mercy: the child she saved on a road six years ago keeps breathing, in her.",
  "于是荣宝阁写好了文书，而文书上写的不是沈嘉兰，是兰香——那个借来的名字，到如今，已比第一个叫它的女孩活得更久。嘉兰用一支才学会握不久的笔落下名字，感到一种微小而奇异的分量：她在纸上成了另一个人。死去的女孩的名字，如今是她活着的名字。这里面自有一种慈悲：六年前她在路上救下的那个孩子，借着她，还在呼吸。"),
 ("Freed, Jialan does what the freed rarely get to do: she stays. She learns the shop's accounts, the slippery poetry of silk prices and ink-stone values, and proves quicker at both than men who have done it for decades. Old Master Lin, who once rewarded a painting, now trusts her with the ledger. The Rongbao Pavilion's name travels further on the strength of that one uncovered treasure, and the girl who was meant to disappear becomes the one the household leans on.",
  "脱了籍，嘉兰做了获得自由的人极少能做的事：她留下了。她学会了铺子的账目，学会丝价与砚值的 slippery 诗律，且比做了几十年的男人更快上手。曾为那幅画赏银的林老太爷，如今把账册托付给她。荣宝阁因那一幅被识破的珍宝声名传得更远，而那个本该消失的姑娘，成了这一家倚重的人。"),
 ("And the former fiancé comes back into the frame. Lin Jinqi, the war hero, walks into his own family's shop on an ordinary afternoon, and there she is — a young woman with ink on her cuffs and a steadiness in her eyes he cannot place. He does not know she is Shen Jialan. He only knows that the name Lanxiang, spoken by a clerk, lands in his chest like a stone dropped in still water.",
  "而那位前未婚夫，重新入了画。林锦岐，那位英雄，在一个平常的午后走进自家的铺子，而她就在那里——一个袖口沾墨、眼底有一种他辨不出由来的沉静的年轻女子。他不知道她是沈嘉兰。他只知道，当伙计念出「兰香」二字，那名字落进他胸口，像石子落进静水。"),
 ("For Lin Jinqi carries his own ghost of that name. Six years ago, in the capital, there was another Lanxiang — a bondservant's sickly daughter of the Lin household, the one a stranger's cloak once warmed. He remembers the kindness more than the face, and the name has become, for him, a small emblem of undeserved grace. To meet a living Lanxiang now, competent and unbowed, unsettles something he has kept carefully shut.",
  "因为林锦岐心里也供着那个名字的魂。六年前在京城，另有一个兰香——林家一个奴婢病弱的女儿，曾有一件陌生人的斗篷暖过她。他记得那份善意多过那张脸，而那名字于他，已成了一种无端蒙恩的小小徽记。如今遇见一个活着的、干练而不折的兰香，把他小心关着的东西，搅动了。"),
 ("Jialan knows who he is the moment she hears the Lin household speak of him — the grandson, the hero, the husband of another. She feels the old floor give way again, the way it did over a wedding cake. But she is not the girl of six years ago. She lets him look, answers his idle questions with a practiced vagueness, and gives him no handhold. The name Lanxiang, she has learned, is both her shield and her cage; she wears it now the way one wears a mask in a house full of strangers.",
  "嘉兰一听林家提起他，便知道他是谁——那孙少爷，那英雄，那另一人的丈夫。旧日大地又塌了一次，像当年对着一块喜饼那样。但她已不是六年前的女孩。她任他看，用练就的含糊答他闲问，不给他任何抓手。她早悟出，兰香这个名字，既是她的盾，也是她的笼；如今她戴着它，像在一屋生人里戴着一副面具。"),
 ("The wider world presses in too. A censor at the new court reopens the old case of the Shen family — not to exonerate them, but to ask why the Lin household, which bent so nimbly, was never quite clean of the matter. The Lin name, once a shelter, starts to feel like a mark. Jinqi's father, already cold to his son's marriage, grows colder still as the winds shift.",
  "更大的世界也逼了上来。新朝一位御史重翻沈家旧案——不是为他们昭雪，而是质问：当年转圜得那般灵活的林家，何以始终脱不干净干系。林家这个曾可作庇护的姓，开始像一块烙印。锦岐的父亲，本就对儿子的婚事冷淡，风声一变，更冷了。"),
 ("Jialan, hearing the censor's inquiry whispered through the shop, understands the danger and the opportunity in the same breath. If the Shen name is spoken again in the open, it could clear the dead — or it could burn the living. She says nothing. She only files the news away, the way she files everything, and goes on balancing the ledger as if names were just another column to keep straight.",
  "嘉兰听着铺子里低语的御史之问，在同一口气里读懂了危险与机会。若沈姓再次被摆到明处，或可洗刷死者，亦可焚毁生者。她什么也没说。只把那消息像一切那样收进档案，继续平着账，仿佛名字不过是又一栏要理清的账目。"),
 ("Episode three does not bring them together. It only moves them onto the same street, in the same city, under the same tightening sky — a hero with a ghost he cannot name, and a ghost who has learned to sign her own name in his family's shop. The board is set. The hand has moved. What comes next is no longer a matter of if, only of when.",
  "第三集没有让他们相认。它只把他们挪到同一条街、同一座城、同一片收紧的天底下——一个背着说不出名字的魂的英雄，和一个学会在他家铺子里签下自己名字的魂。棋盘摆定。手已落子。往后如何，不再是「会不会」，而只是「何时」。"),
]

EP04 = [
 ("Let me tell you about episode four, because episode three left them on the same street under the same sky — and episode four is the season when the weather turns, when every roof in the city suddenly has a leak someone pretends not to notice.",
  "让我跟你讲讲第四集吧，因为第三集把他们留在同一条街、同一片天下——而第四集，是天气转了的时节，城里每片屋顶都忽然漏了雨，而有人假装没看见。"),
 ("Lin Jinqi's marriage to the Zhao girl was a contract drawn in safer weather, and the weather has not been safe since. She is not cruel, this Zhao lady — only married to a man whose mind keeps wandering to a clerk in his father's shop. She feels the absence before she knows its name, and a woman who feels unseen is a woman who starts to watch.",
  "林锦岐与赵家小姐的婚事，是在更安稳的天气里写下的契约，而那天气早已不安稳。这位赵小姐并不刻薄——只不过嫁了一个心总飘向父亲铺子里某个伙计身上的男人。她先感到那片空缺，而后才知它叫什么；而一个觉出自己被无视的女人，便开始留意了。"),
 ("Jinqi, unable to name what pulls him, begins to ask after Lanxiang. He corners Old Master Lin, who answers vaguely: a bondservant's daughter, taken in six years ago from the capital, a good girl, leave it at that. But the math does not sit right. Six years. A girl from the capital. A name that matches a dead child's. The hero, for all his battles, has met a riddle he cannot charge.",
  "锦岐说不清什么在牵引自己，便开始打听兰香。他堵住林老太爷，老太爷含糊作答：一个奴婢的女儿，六年前从京城收留，好姑娘，到此为止。可这笔账对不上。六年。一个从京城来的姑娘。一个与死去的孩儿相同的名字。这位身经百战的英雄，遇上了一道他无法冲锋的谜。"),
 ("For Jialan, the danger is no longer abstract. A steward from the capital, passing through, pauses a heartbeat too long when she serves him tea — the look of a man who once saw a Shen daughter's face and has not quite forgotten it. She feels his glance like a draft through a wall she thought sealed. From that day she speaks less, watches more, and practices, in the mirror, the face of a stranger.",
  "对嘉兰，危险不再抽象。一位从京城路过的管事，她奉茶时，多停了半拍——那是曾见过沈家小姐的脸、迟迟未能忘却的人的眼神。她感到那目光像穿墙的风，吹过她以为封死的那面。从那天起她少说多看，对着镜子，练习一副生人的脸。"),
 ("The court's inquiry into the Shen affair deepens. Whispers reach Jinling that the new emperor, restless, means to revisit the old purges — not to pardon, but to settle scores with whoever profited from them. The Lin household, which profited by surviving, finds its old prudence suddenly looking like complicity. Jinqi's father, cornered, turns on the son who married without his blessing, as if the marriage were the leak.",
  "朝中对沈案的查问渐深。风声传到金陵：新帝不安，意欲重翻旧案——不是赦免，而是与借机获利者清算。当年因活命而获利的林家，忽觉旧日的审慎此刻看来竟像同谋。锦岐的父亲被困，便拿那个未经他首肯就娶亲的儿子出气，仿佛那桩婚事便是漏雨之处。"),
 ("In the shop, a crisis of a smaller sort mirrors the larger one. A regular customer accuses Xu Wanquan of swapping a genuine seal for a fake, and the charge, if it sticks, means the scaffold for the whole household. Jialan, who reads objects the way others read faces, sees the tell at once: the customer's 'genuine' has the wrong patina, aged by acid, not by centuries. She sets the trap, lets him overplay it, and the old master, watching, understands he is keeping not a clerk but a weapon.",
  "铺子里，一场小一点的危机，映着那场大的。一位熟客诬许万全以赝换真，这指控若坐实，便是一家人的枷锁。嘉兰看物件如人看脸，一眼识破破绽：那人的「真品」包浆不对，是酸蚀的，不是千年养的。她布下陷阱，由他演过头，老太爷在旁看明白——他留着的不是个伙计，是一件兵器。"),
 ("Jinqi comes to the shop on the day of the accusation, and stays to watch the trap close. He sees Lanxiang move — calm, exact, a stranger's poise over a familiar craft — and something in him tips. He asks her, later, almost careless: were you ever in the capital, Lanxiang? She laughs, light, and says the capital is a long way from a girl who learned to keep accounts in Jinling. The answer is perfect. It is also a wall.",
  "锦岐在事发那日来到铺子，留着看陷阱合拢。他看兰香出手——沉静、精准，对一门熟艺摆出陌生人的从容——心里有什么倾斜了。后来他问她，近乎不经意：兰香，你可曾去过京城？她轻笑，说京城离一个在金陵学会记账的姑娘，远得很。这回答无懈可击。也是一堵墙。"),
 ("That night, by the well, Jialan lets the mask slip just long enough to tell Xu Wanquan what the capital steward's look meant. The old couple who raised her do not ask her to be Shen Jialan again — they only hold her, the way they have since the boat, and promise the name Lanxiang will hold, whatever comes. It is the first time she weeps for herself, not for the dead, since she was fifteen.",
  "那夜，井边，嘉兰让面具滑落片刻，只够告诉许万全：那京城管事的眼神意味着什么。养大她的老两口没有要她再做回沈嘉兰——只如自那艘船以来那样拥住她，许诺不论来什么，兰香这个名字会撑住。这是她十五岁以来，头一回为自己、而非为死者落泪。"),
 ("And the name itself begins to mean something the episode dares to say aloud. 兰香如故 — the fragrance of orchids remains. A dead child's name, worn by a living girl who was saved by the child's would-be savior; a fragrance that outlived two deaths because one girl chose, against every instruction, to live. The title is not a metaphor yet. It is a fact, sitting in the ledger beside the silk prices.",
  "而那名字本身，开始有了这一集敢说出口的意思。兰香如故——兰的香气依旧。一个死去孩儿的名字，被一个曾被那孩儿本要救的人救下的活姑娘戴着；一种香气，因一个姑娘违背一切训诫选择了活，而熬过两场死亡。这标题此刻还不是隐喻。它是个事实，坐在账册里丝价的旁边。"),
 ("Episode four ends with the leak found but not fixed. Jinqi holds half a truth and thinks it a riddle; Jialan holds the whole of it and calls it a name. The rain is coming. Neither has yet decided whether to open the door.",
  "第四集停在：漏处找到了，却没补。锦岐握着半截真相，当作谜；嘉兰握着整截，称作名字。雨要来了。两人都还没决定，要不要开门。"),
]

EP05 = [
 ("Let me tell you about episode five, because episode four found the leak and left it open — and episode five is the storm, the one the whole house has been pretending not to hear.",
  "让我跟你讲讲第五集吧，因为第四集找到了漏处却没补——而第五集，是那场整座宅子都假装没听见的雨。"),
 ("The new court's revisit lands at last: the old academician Shen, Jialan's grandfather, is pronounced wronged, and the women taken into the Jiaofangsi are to be honored in death. For a living Shen daughter, the decree is a door — and a trap. Come forward as Shen Jialan and she is cleared, yes, but the Xu family who hid her commits treason by the letter, and the Lin household who sheltered a bondservant under a false name commits a lesser one. Freedom, it turns out, would cost the only family she has left.",
  "新朝的重翻终于落定：老大学士沈，嘉兰的祖父，被断为冤屈，那些没入教坊司的女子，身后可受追荣。对一位活着的沈家女儿，这道旨意是一扇门——也是个陷阱。若以沈嘉兰之名出面，她固然昭雪，可藏她的许家便按律成了逆，而容一个冒名奴婢的林家，也担了较轻的罪。自由，到头来要了她仅剩的那家人的命。"),
 ("Jinqi, hearing the Shen name restored, feels the riddle resolve into a shape he dreads. He returns to the shop and this time does not ask. He tells her what he knows — that a Shen daughter was said to have died on a boat, that a bondservant's child named Lanxiang died the same winter, and that a girl who signs the ledger in his father's house answers to a name that should be six years cold. She listens. Then she says, quietly: I am Shen Jialan. And I am Lanxiang. The two are not a contradiction; they are a survival.",
  "锦岐听见沈姓被昭雪，感到那谜结成了一个他害怕的形状。他回到铺子，这一回不问。他把他知道的说出——沈家一位小姐据说死在船上，一个叫兰香的奴婢之女同一冬死了，而他父亲铺子里那个在账册上签名姑娘，应着一个早该冷了六年的名字。她听着。然后轻声说：我是沈嘉兰。我也是兰香。两者不矛盾；那是一种活法。"),
 ("The confession lands between them like a dropped sword. He is not angry — what would he be angry at, the girl his family abandoned, or the family that abandoned her? He is undone. The marriage he entered as a duty, the bride he never chose, the name he carried as a burden — all of it rearranges around this one woman who was promised to him and then erased by his own house.",
  "这坦白落在两人之间，像一柄坠地的剑。他不怒——他该对谁怒？被自家抛弃的姑娘，还是抛弃她的自家？他只是溃散了。他当义务走进的婚事、从不曾选的妻、当作重负扛着的名字——全都绕着这一个曾被许配给他、又被自家抹去的女人，重新排布。"),
 ("The Zhao lady learns, not from a scene but from a silence. She is not written as a villain, this episode insists; she is a person who married a name and found a ghost in it. She does not rage. She withdraws, with a dignity that costs her more than rage would, and leaves the two of them — the hero and the ghost — to the reckoning that is theirs, not hers.",
  "赵小姐是得知的，不是从一场戏，而是从一片静里。这一集执意不把她写成反派；她是一个嫁了一个姓、却在里头发现一个魂的人。她不闹。她退开，带着比闹更贵的体面，把那场清算——英雄与魂的清算——留给他们自己，而非她自己。"),
 ("Jialan goes home to Xu Wanquan and his wife, and kneels. Not as Shen Jialan claiming a name, but as the daughter they raised, thanking them for the years a dead girl's name bought her. They weep, not because she leaves, but because she was ever theirs to lose. The ledger, the shop, the city — none of it was hers by right. Only they were, and they remain.",
  "嘉兰回到许万全夫妻面前，跪下。不是以沈嘉兰来认一个姓，而是以他们养大的女儿，谢那些年一个死去的女孩的名字为她买来的光阴。他们哭，不是因她要走，而是因她曾是他们会失去的人。账册、铺子、城——没有一样本该是她的。只有他们本是，且仍是。"),
 ("And the title finally speaks. 兰香如故 — the fragrance of orchids remains. The child Lanxiang, who died unclaimed in a doorway, lives on because a stranger's cloak warmed her and a stranger's name carried her. The girl Shen Jialan, who was told to die, lives on because she chose the name of the child she saved. One fragrance, two deaths, a single stubborn choosing to remain. The orchids do not care whose breath carries them. They simply remain.",
  "而标题终于出声。兰香如故——兰的香气依旧。那孩儿兰香，死在门前无人认领，却因一件陌生人的斗篷暖过她、一个陌生人的名字载过她，而活着。那姑娘沈嘉兰，被嘱赴死，却因选了所救孩儿的名字，而活着。一种香气，两场死亡，一次执拗的「留下」的选择。兰花不在乎是谁的呼吸载着它们。它们只是，依旧。"),
 ("The episode does not close the ring. The Shen name is cleared but Jialan's place in it is unresolved; the Lin household teeters between shelter and complicity; the Zhao marriage hangs by a silence. What it gives is not an ending but a standing-still — the breath before a decision that will reshape all of them.",
  "这一集没有合上那只环。沈姓昭雪了，可嘉兰在其中的位置未定；林家在庇护与同谋之间摇晃；赵家的婚事悬于一片静。它给的不是一个结局，而是一个凝住——一个将重塑他们所有人的决定，落下前的那口气。"),
 ("There is a small, almost private scene near the end: Jialan at the well, where she wept as Lanxiang, now washing her face as Shen Jialan — and finding, in the water, not two faces but one. The girl who was promised and the girl who was saved are the same girl, and the name on her, whichever it is, was always hers to keep.",
  "临近结尾有一场小得近乎私密的戏：嘉兰在井边，她曾作兰香在那里哭过，如今作为沈嘉兰洗脸——而在水里，看见的不是两张脸，是一张。那个曾被许配的姑娘，与那个被救的姑娘，是同一个人，而无论叫哪个名字，那名字从来是她自己的，由她留着。"),
 ("Episode five closes the way episode one opened, but reversed: not a girl on a boat choosing death, but a woman in a city who chose life, and kept choosing it through every name they gave her. The fragrance of orchids remains. So, it turns out, does she.",
  "第五集收尾，如第一集开场，却掉了个头：不是船上选死的姑娘，而是城里选了活、并在他们给她的每一个名字里都继续选活的女人。兰的香气依旧。而事实证明，她也是。"),
]

# ---------- 合成 / 生成 ----------
def synth_text(text: str, out: Path) -> float:
    """用 say 合成整段/整篇文本到 out，返回时长（秒）"""
    tmp = "/tmp/lx_tts.txt"
    Path(tmp).write_text(text, encoding="utf-8")
    subprocess.run(["say", "-v", VOICE, "-r", str(RATE), "-f", tmp, "-o", str(out)], check=True)
    info = subprocess.run(["afinfo", str(out)], capture_output=True, text=True).stdout
    m = re.search(r"estimated duration:\s*([\d.]+)", info)
    return float(m.group(1)) if m else 0.0

def compute_off_and_whole(epn: int, segs):
    """整篇合成 + 逐段时长累加得 OFF；返回 (off_list, whole_path)。带 JSON 缓存避免重跑。"""
    epd = f"EP{epn:02d}"
    whole_pub = PUB / f"{epd}_whole.m4a"
    whole_src = SRC / f"{epd}_whole.m4a"
    off_json  = PUB / f"{epd}_off.json"
    if whole_pub.exists() and whole_pub.stat().st_size > 5000 and off_json.exists():
        off = json.loads(off_json.read_text(encoding="utf-8"))
        print(f"  [缓存] {epd}_whole.m4a 命中，跳过合成")
        return off, whole_pub
    # 1) 逐段临时合成取时长（不保留分段文件）
    print(f"  [合成] 逐段计时 + 整篇连贯合成 {epd} ...")
    durations = []
    for i, (en, zh) in enumerate(segs):
        d = synth_text(en, Path(f"/tmp/{epd}_seg_{i:02d}.m4a"))
        durations.append(d)
    off = []
    start = 0.0
    for d in durations:
        off.append([round(start, 3), round(start + d, 3)])
        start += d
    # 2) 整篇连贯合成（韵律连贯，消除分段机械感）
    whole_text = "\n\n".join(en for en, zh in segs)
    synth_text(whole_text, whole_pub)
    shutil.copy(whole_pub, whole_src)
    off_json.write_text(json.dumps(off), encoding="utf-8")
    return off, whole_pub

def build_html(epn: int, title: str, sub: str, segs, off):
    story = []
    for i, (en, zh) in enumerate(segs):
        tag = "blockquote" if i == 0 or i == len(segs) - 1 else "p"
        en_h = html.escape(en, quote=False)
        zh_h = html.escape(zh, quote=False)
        story.append(f'<{tag} class="seg" data-i="{i}">{en_h}</{tag}>')
        story.append(f'<details class="zhfold"><summary>🇨🇳 中文翻译</summary><p>{zh_h}</p></details>')
    off_arr = "[" + ",".join(f"[{o[0]},{o[1]}]" for o in off) + "]"
    return (HEAD.replace("{TITLE}", title).replace("{SUB}", sub) + "\n".join(story) +
            TAIL.replace("{EPN}", str(epn)).replace("{OFF_ARR}", off_arr).replace("{WHOLE}", f"EP{epn:02d}_whole.m4a"))

def gen_episode(epn: int, segs):
    epd = f"EP{epn:02d}"
    sub = f"EPISODE {epn} · TOLD LIKE A STORY · 有声版"
    title = f"兰香如故 · Episode {epn} — Audio Story"
    off, _ = compute_off_and_whole(epn, segs)
    html_text = build_html(epn, title, sub, segs, off)
    (PUB / f"{epd}.html").write_text(html_text, encoding="utf-8")
    (SRC / f"{epd}.html").write_text(html_text, encoding="utf-8")
    total = off[-1][1] if off else 0
    print(f"  -> {epd}.html 生成（{len(segs)} 段，配音总时长 {total/60:.1f} 分）")

def main():
    want = sys.argv[1:] or ["ep02", "ep03", "ep04", "ep05"]
    # EP02
    if "ep02" in want:
        segs = parse_md_ep02(SRC / "EP02_英文剧集介绍.md")
        print(f"EP02：从用户底稿解析 {len(segs)} 段（保真）")
        gen_episode(2, segs)
    # EP03-05
    for epn, var in [(3, EP03), (4, EP04), (5, EP05)]:
        if f"ep0{epn}" in want:
            print(f"EP0{epn}：续作 {len(var)} 段")
            gen_episode(epn, var)
    print("完成。")

if __name__ == "__main__":
    main()
