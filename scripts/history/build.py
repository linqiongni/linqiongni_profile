# -*- coding: utf-8 -*-
# 生成「人文历史」静态站源目录：assets/people.js + index.html + p01..p63 人物页
import os, re, json, html

_HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(_HERE, "..", ".."))
SRC = os.path.join(_HERE, "data.py")
ROOT = os.path.join(REPO, "人文历史")
LONGDIR = os.path.join(ROOT, "assets", "long")

# 长文扩展：文件名 -> assets/long/<文件名> 里的「正文 + 深一层 + 纪录片 + 脚注」整块替换
# （先写中段 HTML 片段，重建时自动覆盖；用过的示例见 assets/long/p01-kongzi.html）
LONG_ARTICLE = {"p01-kongzi.html"}
MID_PAT = re.compile(
    r'          <div class="body">.*?</div>\n'
    r'          <div class="deepen">.*?</div>\n'
    r'          <div class="docs">.*?</div>\n',
    re.S)

# 编号 -> 文件名 slug
SLUG = {
    1:'kongzi', 2:'shangyang', 3:'liubang', 4:'xiangyu', 5:'hanxin', 6:'simaqian',
    7:'wangmang', 8:'caocao', 9:'jikang', 10:'wangxizhi', 11:'taoyuanming', 12:'libai',
    13:'dufu', 14:'baijuyi', 15:'mengjiao', 16:'hanyu', 17:'liyu', 18:'sushi',
    19:'liqingshao0' if False else 'liqingzhao', 20:'yuefei', 21:'luyou', 22:'xinqiji',
    23:'wentianxiang', 24:'zhuyuanzhang', 25:'wangyangming', 26:'zhangjuzheng', 27:'hairui',
    28:'zhenghe', 29:'qianlong', 30:'linzexu', 31:'zengguofan', 32:'lihongzhang',
    33:'yuanshikai', 34:'sunzhongshan', 35:'socrates', 36:'alexander', 37:'caesar',
    38:'cleopatra', 39:'jesus', 40:'constantine', 41:'muhammad', 42:'charlemagne',
    43:'dante', 44:'davinci', 45:'columbus', 46:'luther', 47:'elizabeth', 48:'newton',
    49:'louis14', 50:'peter1', 51:'washington', 52:'napoleon', 53:'darwin', 54:'lincoln',
    55:'victoria', 56:'bismarck', 57:'tolstoy', 58:'churchill', 59:'roosevelt',
    60:'gandhi', 61:'einstein', 62:'mandela', 63:'curie',
}

FIX = {
    "他的国企改革、土地国有、废奴 ideas 比晚清早了近两千年":
    "他推的国企改革、土地国有、废奴，比晚清早了近两千年",
    "王羲之却以书法把『晋人风度』literally 固化成肌肉记忆":
    "王羲之却以书法把『晋人风度』实实在在固化成了肌肉记忆",
}
ASCII = re.compile(r"[A-Za-z]{3,}")
ALLOW = {"BBC"}  # 允许中英混排的专有名词

# ---- 读数据 ----
src = open(SRC, encoding="utf-8").read()
s = src.index("D = [")
e = src.index("\n]\n", s) + 3
ns = {}
exec(src[s:e], ns)
D = [(r[0], r[1], r[2], r[3], r[4], r[5], list(r[6:])) for r in ns["D"]]
assert len(D) == 63, len(D)

def fix(t):
    for k, v in FIX.items():
        t = t.replace(k, v)
    return t

def esc(t):
    return html.escape(fix(t), quote=False)

# ---- 自检英文残留 ----
for i, (sec, era, name, hook, b1, b2, docs) in enumerate(D, 1):
    for fld, val in (("钩子", hook), ("正文", b1), ("深一层", b2)):
        hit = [w for w in ASCII.findall(fix(val)) if w not in ALLOW]
        if hit:
            print(f"⚠️ D{i:02d} {name} {fld} 英文残留: {hit}")

# ---- people.js ----
lines = ["/* 人文历史 · 人物志 —— 人物清单（由生成脚本产出，勿手改） */",
         "window.HISTORY_PEOPLE = ["]
for i, (sec, era, name, hook, b1, b2, docs) in enumerate(D, 1):
    slug = SLUG[i]
    rec = {
        "no": f"D{i:02d}",
        "id": f"p{i:02d}-{slug}",
        "file": f"p{i:02d}-{slug}.html",
        "era": era,
        "name": name,
        "hook": hook,
        "kw": f"{era} {name} {slug} {' '.join(docs)}",
    }
    lines.append("  " + json.dumps(rec, ensure_ascii=False) + ",")
lines.append("];")
os.makedirs(ROOT + "/assets", exist_ok=True)
open(ROOT + "/assets/people.js", "w", encoding="utf-8").write("\n".join(lines) + "\n")
print("people.js OK")

SCRIPTS = '<script src="/theme-toggle.js"></script>\n<script src="assets/people.js"></script>\n<script src="assets/app.js"></script>'

# ---- 人物页 ----
for i, (sec, era, name, hook, b1, b2, docs) in enumerate(D, 1):
    slug = SLUG[i]
    pid = f"p{i:02d}-{slug}"
    file = f"{pid}.html"
    docss = " · ".join(f"《{esc(d)}》" for d in docs)
    mid = None
    if file in LONG_ARTICLE:
        lp = os.path.join(LONGDIR, file)
        if os.path.exists(lp):
            mid = open(lp, encoding="utf-8").read().strip()
        else:
            print(f"⚠️ {file} 已在 LONG_ARTICLE 清单但缺 assets/long/{file}")
    page = f'''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(name)} · 人文历史人物志</title>
<meta name="description" content="{esc(hook)}">
<link rel="stylesheet" href="assets/style.css">
<script>if(self!==top)document.documentElement.classList.add("embedded");</script>
</head>
<body data-p="{pid}">
<div id="progress"></div>
<div class="layout">
  <div class="row">
    <aside id="side"></aside>
    <div id="mainwrap">
      <main id="main">
        <article class="article">
          <span class="tagline">D{i:02d} · {esc(era)}</span>
          <h1>{esc(name)}</h1>
          <p class="hook">{esc(hook)}</p>
          <div class="body"><p>{esc(b1)}</p></div>
          <div class="deepen"><h2>再深一层 · 时代背景</h2><p>{esc(b2)}</p></div>
          <div class="docs"><b>纪录片延伸</b>{docss}</div>
          <div id="pager"></div>
        </article>
      </main>
    </div>
  </div>
</div>
{SCRIPTS}
</body>
</html>
'''
    if mid:
        page, n = MID_PAT.subn(mid + "\n", page)
        if n != 1:
            raise SystemExit(f"❌ {file} 长文替换未命中模板（命中 {n} 次）")
    open(os.path.join(ROOT, file), "w", encoding="utf-8").write(page)

print("人物页 OK:", len(D))

# ---- 目录页 ----
eras = []
seen = set()
for i, (sec, era, name, hook, b1, b2, docs) in enumerate(D, 1):
    if era not in seen:
        seen.add(era); eras.append(era)

buf = []
buf.append('<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>人文历史 · 人物志</title>\n<meta name="description" content="63 位历史人物，每人一页：名声之外的真实活法。">\n<link rel="stylesheet" href="assets/style.css">\n</head>\n<body>\n<div class="layout">\n  <div class="row" id="side-wrap">\n    <div class="home" id="home">\n      <header>\n        <h1>人文历史 · 人物志</h1>\n        <p class="lede">63 个人物，每人一页：他们的名声，和他们真实的活法。</p>\n      </header>\n')

for era in eras:
    buf.append(f'      <section class="era-sec"><h2>{esc(era)}</h2><div class="grid">')
    for i, (sec, e2, name, hook, b1, b2, docs) in enumerate(D, 1):
        if e2 != era:
            continue
        slug = SLUG[i]
        kw = esc(f"D{i:02d} {era} {name} {' '.join(docs)}")
        buf.append(f'        <a class="cell" href="p{i:02d}-{slug}.html" data-kw="{kw}">'
                   f'<span class="no">D{i:02d}</span><span class="nm">{esc(name)}</span>'
                   f'<span class="hk">{esc(hook)}</span></a>')
    buf.append('      </div></section>')

buf.append('      <p class="foot-note">依据通行史学共识与人物传记整理；凡「约 / 可能 / 据传」处为学界存疑或传统纪年。纪录片片名以实际检索为准。</p>\n')
buf.append('    </div>\n  </div>\n</div>\n')
buf.append(SCRIPTS + "\n</body>\n</html>\n")
open(ROOT + "/index.html", "w", encoding="utf-8").write("\n".join(buf))
print("index.html OK")

# ---- 标签配平自检 ----
for f in sorted(os.listdir(ROOT)):
    if not f.endswith(".html"):
        continue
    t = open(os.path.join(ROOT, f), encoding="utf-8").read()
    for tag in ["div", "aside", "main", "article", "section", "header", "span", "p", "a", "h1", "h2"]:
        o = len(re.findall(rf"<{tag}[\s>]", t))
        c = len(re.findall(rf"</{tag}>", t))
        if o != c:
            print(f"❌ {f} <{tag}> 开{o} 闭{c}")
print("标签配平检查完成")

total = sum(os.path.getsize(os.path.join(ROOT, f)) for f in os.listdir(ROOT))
print(f"目录总大小 {total/1024:.0f} KB")
