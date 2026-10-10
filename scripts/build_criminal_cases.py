#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""构建《刑事辩护实录：三十宗虚拟案件的完整诉讼》静态子站 -> public/criminal-record/

读取仓库根目录的 Word 源文件（唯一真源），生成：
  public/criminal-record/index.html         全书导览
  public/criminal-record/ch01..ch09.html    九篇已写章节
  public/criminal-record/docs-ch01/02/16.html  各章配套文书全集（DOCS 常量登记哪些就出哪些）
  public/criminal-record/assets/crim-style.css   布局（复制 criminal 站的 B 布局 + 追加少量辅助类）
  public/criminal-record/assets/app.js           STATIONS 驱动的左侧目录/右侧页内目录/搜索/scrollspy

之后由 scripts/apply-theme-kit.py --fix 注入鱼影背景 + 深浅色同步补丁。
改内容只需改 Word 源 → 重新跑本脚本 → apply-theme-kit --fix。
"""
import os, re, json, zipfile
from xml.etree import ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "《刑事辩护实录：三十宗虚拟案件的完整诉讼》")
OUT = os.path.join(ROOT, "public", "criminal-record")
ASSETS = os.path.join(OUT, "assets")
os.makedirs(ASSETS, exist_ok=True)

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

def docx_paras(path):
    z = zipfile.ZipFile(path)
    root = ET.fromstring(z.read("word/document.xml"))
    out = []
    for p in root.iter(W + "p"):
        txt = "".join(t.text or "" for t in p.iter(W + "t"))
        out.append(txt)
    return out

def docx_blocks(path):
    """按文档顺序返回块列表：('p', 文本) 或 ('tbl', [[单元格段落列表, ...], ...])。
    旧 docx_paras 会把表格里的段落拍散混进正文，表格结构全丢；这里保序保留表格。"""
    z = zipfile.ZipFile(path)
    root = ET.fromstring(z.read("word/document.xml"))
    body = root.find(W + "body")
    blocks = []
    if body is None:
        return blocks

    def cell_paras(tc):
        txts = []
        for p in tc.iter(W + "p"):
            t = "".join(n.text or "" for n in p.iter(W + "t")).strip()
            if t:
                txts.append(t)
        return txts

    for child in body:
        if child.tag == W + "p":
            txt = "".join(t.text or "" for t in child.iter(W + "t"))
            blocks.append(("p", txt))
        elif child.tag == W + "tbl":
            rows = []
            for tr in child.findall(W + "tr"):
                rows.append([cell_paras(tc) for tc in tr.findall(W + "tc")])
            if rows:
                blocks.append(("tbl", rows))
    return blocks

def render_table(rows):
    def cell(lines):
        lines = [esc(x) for x in lines if x.strip()]
        return "<br>".join(lines) if lines else ""
    # 单行单格的「第X卷」横幅表 -> 弱化分隔条，不渲染成表格
    if len(rows) == 1 and len(rows[0]) == 1:
        txt = " ".join(rows[0][0]).split()
        txt = "".join(txt) if len(txt) <= 2 else " ".join(txt)
        if re.match(r"^第[一二三四五六七八九十]+卷", txt):
            return '<p class="volband">%s</p>' % esc(txt)
    out = ['<div class="tblwrap"><table class="dtable">']
    for ri, row in enumerate(rows):
        out.append("<tr>")
        for c in row:
            html = cell(c)
            # 第一行作表头（正文表格均为「项目/对比维度」型首行表头）
            if ri == 0 and len(rows) > 1:
                out.append("<th>%s</th>" % html)
            else:
                out.append("<td>%s</td>" % html)
        out.append("</tr>")
    out.append("</table></div>")
    return "\n".join(out)

# ---------------- 章节结构数据 ----------------
VOLUMES = [
    ("第一卷 · 人身边界", ["ch01", "ch02", "ch03", "ch04", "ch05"]),
    ("第二卷 · 财物迷局", ["ch06", "ch07", "ch08", "ch09", "ch10"]),
    ("第三卷 · 屏幕背后的犯罪", ["ch11", "ch12", "ch13", "ch14", "ch15"]),
    ("第四卷 · 危险现场", ["ch16", "ch17", "ch18", "ch19", "ch20"]),
    ("第五卷 · 公司与权力", ["ch21", "ch22", "ch23", "ch24", "ch25"]),
    ("第六卷 · 程序本身就是辩护", ["ch26", "ch27", "ch28", "ch29", "ch30"]),
]
CHAPTERS = {
    "ch01": ("第一章：深夜烧烤店的最后一拳", "第一章", "正当防卫 互殴 防卫过当 因果关系 伤情鉴定 监控"),
    "ch02": ("第二章：出租屋里无人看见的死亡", "第二章", "故意杀人 故意伤害致死 过失致人死亡 存疑不起诉 尸体检验 排除合理怀疑"),
    "ch03": ("第三章：失控的方向盘", "第三章", "过失致人死亡 意外事件 因果关系 车辆故障 侦查实验"),
    "ch04": ("第四章：接孩子时发生的冲突", "第四章", "非法拘禁 故意伤害 探望权 家庭矛盾 刑事拘留"),
    "ch05": ("第五章：十四岁少年的秘密", "第五章", "抢劫罪 刑事责任年龄 共同犯罪 从犯 附条件不起诉 记录封存"),
    "ch06": ("第六章：中山一路的手机", "第六章", "抢劫罪 折叠刀 辨认笔录 扣押 坦白 自首 退赃"),
    "ch07": ("第七章：便利店门口的苹果手机", "第七章", "盗窃 抢夺 转化型抢劫 时空连续性 伤情鉴定"),
    "ch08": ("第八章：酒店遗落的手表", "第八章", "盗窃 侵占 遗忘物 管理占有 告诉才处理 自诉"),
    "ch09": ("第九章：借来的汽车没有归还", "第九章", "诈骗 侵占 民事违约 非法占有目的 刑民交叉 电子数据"),
    "ch10": ("第十章：仓库里少掉的二十箱货", "第十章", "职务侵占 盗窃 单位财物 职务便利 共同犯罪"),
    "ch11": ("第十一章：兼职刷单群", "第十一章", "电信网络诈骗 主观明知 共同犯罪 从犯 犯罪金额"),
    "ch12": ("第十二章：银行卡里的三百万元流水", "第十二章", "帮信罪 掩饰隐瞒犯罪所得 主观明知 上游犯罪 资金流水"),
    "ch13": ("第十三章：直播间里的投资导师", "第十三章", "诈骗 非法经营 刑民交叉 交易对价 平台电子数据"),
    "ch14": ("第十四章：被删掉的聊天记录", "第十四章", "敲诈勒索 权利行使 威胁 电子数据真实性 司法鉴定"),
    "ch15": ("第十五章：游戏账号交易骗局", "第十五章", "虚拟财产 诈骗 盗窃 计算机犯罪 平台数据 价格认定"),
    "ch16": ("第十六章：凌晨两点的代驾订单", "第十六章", "危险驾驶 道路概念 醉酒标准 血样鉴定 行政刑事边界"),
    "ch17": ("第十七章：暴雨中的货车事故", "第十七章", "交通肇事 因果关系 事故责任认定 电子数据 被害人过错"),
    "ch18": ("第十八章：仓库里的烟花", "第十八章", "非法储存爆炸物 非法经营 行政犯 鉴定取样 罪刑法定"),
    "ch19": ("第十九章：楼道里蔓延的火", "第十九章", "放火 失火 间接故意 危险犯 火灾鉴定 财产损失"),
    "ch20": ("第二十章：包厢里的违禁物品", "第二十章", "容留他人吸毒 主观明知 场所控制 证人证言 经营者责任"),
    "ch21": ("第二十一章：老板拿走的项目款", "第二十一章", "挪用资金 职务侵占 单位财产 非法占有目的 公司人格"),
    "ch22": ("第二十二章：无法交付的五百台设备", "第二十二章", "合同诈骗 非法占有目的 刑民交叉 企业合规 审计"),
    "ch23": ("第二十三章：虚开的发票", "第二十三章", "虚开增值税专用发票 单位犯罪 主观目的 审计 责任人员"),
    "ch24": ("第二十四章：招标前的一只信封", "第二十四章", "行贿 受贿 谋取利益 言词证据 翻供 对合型犯罪"),
    "ch25": ("第二十五章：执法记录仪缺失的六分钟", "第二十五章", "滥用职权 玩忽职守 非法拘禁 电子数据缺失 国家工作人员"),
    "ch26": ("第二十六章：照片墙上的第六个人", "第二十六章", "辨认规则 孤证 证明标准 不在场证明 无罪辩护"),
    "ch27": ("第二十七章：凌晨四点的讯问笔录", "第二十七章", "非法证据排除 疲劳审讯 同步录音录像 翻供 口供补强"),
    "ch28": ("第二十八章：检察院作出的不起诉决定", "第二十八章", "不批准逮捕 补充侦查 不起诉 刑民交叉 审查起诉"),
    "ch29": ("第二十九章：一份已经生效的判决", "第二十九章", "刑事申诉 审判监督 再审 新证据 错案救济 国家赔偿"),
    "ch30": ("第三十章：铁门打开以后", "第三十章", "刑罚执行 减刑 假释 申诉 刑满释放 社会回归"),
}

# 章节中文数字 -> 序号（第X章 -> chNN）
_CN_NUM = ['零','一','二','三','四','五','六','七','八','九','十',
           '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
           '二十一','二十二','二十三','二十四','二十五','二十六','二十七','二十八','二十九','三十']

# 配套文书全集：自动发现，无需手动登记。
# 扫描源文件夹里所有「*配套法律文书*.docx」，从文件名「第X章…」推导章号，
# 自动生成 (源 stem, 输出 id docs-chNN, 左侧目录/STATIONS 显示名「第X章配套文书全集」)。
# 命名前缀不统一（_虚构示例 / 全文 / 空格数字后缀）都能匹配；缺文件的章节不会出现死链。
_CN_TO_IDX = {cn: i for i, cn in enumerate(_CN_NUM) if i >= 1}

def _discover_docs():
    found = []
    for f in sorted(os.listdir(SRC)):
        if "配套法律文书" not in f or not f.endswith(".docx") or f.startswith("~"):
            continue
        m = re.match(r"^第(.+?)章配套法律文书", f)
        if not m:
            continue
        cn = m.group(1)
        if cn not in _CN_TO_IDX:
            continue
        n = _CN_TO_IDX[cn]
        cid = "ch%02d" % n
        found.append((f[:-5], "docs-" + cid, "第%s章配套文书全集" % cn))
    return sorted(found, key=lambda x: x[1])

DOCS = _discover_docs()

def src_docx(stem):
    p = os.path.join(SRC, stem + ".docx")
    return p if os.path.exists(p) else None

# 章节 id(ch01..ch30) -> 源 docx 文件名(第一章..第三十章)
CHAP_DOCX = {cid: ('第' + _CN_NUM[int(cid[2:])] + '章') for cid in CHAPTERS}

# ---------------- HTML 工具 ----------------
def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

RE_H2 = re.compile(r"^([一二三四五六七八九十百零]+)、(.+)$")
RE_H3 = re.compile(r"^（([一二三四五六七八九十]+)）(.+)$")
RE_N = re.compile(r"^(\d+)\.(.+)$")
META_KEYS = ["案件性质", "核心争议", "案件结果", "特别说明", "案发地点", "涉嫌罪名", "关联审查"]

def split_meta(line):
    pat = "(" + "|".join(META_KEYS) + r")："
    parts = re.split(pat, line)
    # parts: [pre, key1, val1, key2, val2, ...]
    res = []
    for i in range(1, len(parts), 2):
        res.append((parts[i], parts[i + 1]))
    return res

def find_meta(paras, scan=6):
    """在前 scan 段里找「案件要素」行（含 >=2 个要素键）。
    ch01-05 的要素行在第 2 段；ch06 起前面多了卷名+章题两行，位置不固定。"""
    for i, p in enumerate(paras[:scan]):
        if p.strip() and sum(1 for k in META_KEYS if k + "：" in p) >= 2:
            return i
    return None

def vol_of(cid):
    for v, chs in VOLUMES:
        if cid in chs:
            return v
    return ""

def build_chapter(stem):
    title, _, _ = CHAPTERS[stem]
    blocks = docx_blocks(src_docx(CHAP_DOCX[stem]))

    def ptxt(b):
        return b[1].strip() if b[0] == "p" else None

    # 只弹空段落块，不能动表格块（开头可能是卷名横幅表）
    while blocks and blocks[0][0] == "p" and not blocks[0][1].strip():
        blocks.pop(0)
    while blocks and blocks[-1][0] == "p" and not blocks[-1][1].strip():
        blocks.pop()
    paras = [b[1] for b in blocks if b[0] == "p"]
    out = []
    vol = vol_of(stem)
    kicker = "刑事辩护实录 · CASE %s" % stem[2:]
    if vol:
        kicker = "刑事辩护实录 · %s · CASE %s" % (vol, stem[2:])
    out.append('<header class="page-head">')
    out.append('<div class="kicker">%s</div>' % esc(kicker))
    out.append('<h1>%s</h1>' % esc(title.split("：", 1)[-1] if "：" in title else title))
    out.append('</header>')
    out.append('<div class="wrap">')

    def is_front_matter(s):
        if re.match(r"^第[一二三四五六七八九十]+卷", s):
            return True
        if s == title or (s.startswith("第") and "章：" in s and len(s) < 40):
            return True
        return False

    # 案件要素行：位置自适应（ch01-05 在第 2 段，ch06 起前面多卷名+章题）
    meta_i = find_meta(paras)
    meta_done = False
    p_seen = -1
    for kind, data in blocks:
        if kind == "tbl":
            out.append(render_table(data))
            continue
        p_seen += 1
        s = data.strip()
        if not s:
            continue
        # 要素行之前的段落（卷名/章题等）整段跳过，与旧版 start=meta_i+1 行为一致
        if meta_i is not None and p_seen < meta_i:
            continue
        if meta_i is not None and not meta_done and p_seen == meta_i:
            m = split_meta(s)
            if m:
                out.append('<div class="box law"><span class="lb">案件要素</span>')
                for k, v in m:
                    out.append('<p><b>%s</b>：%s</p>' % (esc(k), esc(v.strip())))
                out.append('</div>')
            meta_done = True
            continue
        if not meta_done and is_front_matter(s):
            continue
        if RE_H2.match(s):
            out.append("<h2>%s</h2>" % esc(s))
        elif RE_H3.match(s):
            out.append("<h3>%s</h3>" % esc(s))
        elif RE_N.match(s):
            out.append("<h3>%s</h3>" % esc(s))
        else:
            out.append("<p>%s</p>" % esc(s))
    out.append("</div>")
    return "\n".join(out)

def build_docs(stem, out_id):
    blocks = docx_blocks(src_docx(stem))

    def ptxt(b):
        return b[1].strip() if b[0] == "p" else None

    # 只弹空段落块，不能动表格块（开头可能是卷名横幅表）
    while blocks and blocks[0][0] == "p" and not blocks[0][1].strip():
        blocks.pop(0)
    while blocks and blocks[-1][0] == "p" and not blocks[-1][1].strip():
        blocks.pop()
    # 标题 = 第一个非空段落（全文版文书开头是卷名横幅表 + 空段，首段常为空白串）
    # 副题 = 标题之后第一个含「虚构」的非空段落
    title_idx = None
    sub_idx = None
    for bi, (k, d) in enumerate(blocks):
        if k == "p" and d.strip():
            if title_idx is None:
                title_idx = bi
            elif sub_idx is None and "虚构" in d:
                sub_idx = bi
                break
    doc_title = blocks[title_idx][1].strip() if title_idx is not None else out_id
    sub = blocks[sub_idx][1].strip() if sub_idx is not None else None
    skip = {title_idx} if title_idx is not None else set()
    if sub_idx is not None:
        skip.add(sub_idx)
    out = []
    out.append('<header class="page-head">')
    out.append('<div class="kicker">刑事辩护实录 · 配套文书（虚构示例）</div>')
    out.append('<h1>%s</h1>' % esc(doc_title))
    if sub:
        out.append('<div class="sub">%s</div>' % esc(sub))
    out.append('</header>')
    out.append('<div class="wrap">')
    n = len(blocks)
    i = 0
    doc_open = False
    while i < n:
        if i in skip:
            i += 1
            continue
        kind, data = blocks[i]
        if kind == "tbl":
            out.append(render_table(data))
            i += 1
            continue
        s = data.strip()
        i += 1
        if not s:
            continue
        if s == "案件基本信息":
            out.append("<h3>案件基本信息</h3>")
            continue
        if s in ("文书目录", "目录"):
            out.append("<h3>文书目录</h3><ol>")
            # 收集后续段落中的 N. 条目直到非列表项（表格块会自然中断）
            j = i
            while j < n and blocks[j][0] == "p":
                t = blocks[j][1].strip()
                mm = RE_N.match(t)
                if mm and not t.startswith("文书"):
                    out.append("<li>%s</li>" % esc(mm.group(2).strip()))
                    j += 1
                else:
                    break
            out.append("</ol>")
            i = j
            continue
        if re.match(r"^文书[一二三四五六七八九十]+[:：]", s):
            if doc_open:
                out.append("</div>")
            out.append("<h2>%s</h2>" % esc(s))
            out.append('<div class="docbox">')
            doc_open = True
            continue
        if RE_H3.match(s) or RE_N.match(s):
            out.append("<h3>%s</h3>" % esc(s))
            continue
        # key:value 行
        kv = re.match(r"^([^：\n]{1,14})：([^\n]*)$", s)
        if kv and doc_open and not s.startswith("一") and not s.startswith("二"):
            out.append('<p class="kv"><b>%s</b>　%s</p>' % (esc(kv.group(1)), esc(kv.group(2).strip())))
            continue
        out.append("<p>%s</p>" % esc(s))
    if doc_open:
        out.append("</div>")
    out.append("</div>")
    return "\n".join(out)

# ---------------- index 导览页 ----------------
def build_index(main_paras):
    # 切分主文档各节
    def section(marker):
        # 从 marker 行开始到下一个 "N、" 或文件尾
        idx = None
        for j, p in enumerate(main_paras):
            if p.strip().startswith(marker):
                idx = j
                break
        if idx is None:
            return ""
        buf = []
        for p in main_paras[idx + 1:]:
            st = p.strip()
            if re.match(r"^[一二三四五六七八九十]+、", st):
                break
            if st.startswith("七、"):
                break
            if st:
                buf.append(st)
        return "\n".join(buf)

    abstract = section("二、全书摘要")
    framework = section("四、每章统一写作框架")
    results = section("五、整部小说覆盖的辩护结果")
    opening = section("七、作品开篇说明")

    out = []
    out.append('<header class="page-head">')
    out.append('<div class="kicker">律师实务 · 案例式法律小说</div>')
    out.append('<h1>刑事辩护实录：三十宗虚拟案件的完整诉讼</h1>')
    out.append('<div class="sub">从案发现场到刑满释放，以三十宗虚拟案件，完整呈现刑事辩护的事实判断、证据审查、程序控制与庭审策略。</div>')
    out.append('</header>')
    out.append('<div class="wrap">')

    out.append('<div class="box tip"><span class="lb">阅读导航</span><p>本书按「罪名类型 + 程序节点 + 辩护方法」分为六卷三十章，每章一宗独立虚拟案件。左侧目录按卷分组，点击即可阅读。建议从《全书摘要》建立整体印象，再按卷逐案精读。</p></div>')

    out.append("<h2>全书摘要</h2>")
    for ln in abstract.split("\n"):
        if ln.strip():
            out.append("<p>%s</p>" % esc(ln))

    out.append("<h2>六卷结构总览</h2>")
    out.append('<div class="cards">')
    vol_intro = {
        "第一卷 · 人身边界": "故意伤害、过失致死、非法拘禁等侵害公民人身权利案件。",
        "第二卷 · 财物迷局": "盗窃、抢劫、诈骗、侵占等侵犯财产权利案件。",
        "第三卷 · 屏幕背后的犯罪": "电信网络诈骗、帮信、网络虚拟财产等新型犯罪。",
        "第四卷 · 危险现场": "危险驾驶、交通肇事、放火、危险物品等公共安全案件。",
        "第五卷 · 公司与权力": "挪用资金、合同诈骗、虚开、行贿受贿等职务与经济犯罪。",
        "第六卷 · 程序本身就是辩护": "辨认、讯问、不起诉、申诉、再审、执行与错案救济。",
    }
    for v, _ in VOLUMES:
        out.append('<a class="card" href="#roadmap"><span class="d">%s</span><span class="t">%s</span></a>' % (esc(v.split(" · ")[0]), esc(vol_intro.get(v, ""))))
    out.append("</div>")

    out.append("<h2>每章统一写作框架</h2>")
    out.append("<p>每一章虽为不同案件，均按相同结构展开，保证全站专业、统一：</p>")
    out.append('<ol class="steps-plain">')
    for ln in framework.split("\n"):
        m = RE_N.match(ln.strip())
        if m:
            out.append("<li><b>%s</b>　%s</li>" % (esc(m.group(1)), esc(m.group(2).strip())))
    out.append("</ol>")

    out.append("<h2>辩护结果的多样性</h2>")
    out.append("<p>全书不把刑事辩护写成「有罪变无罪」的套路。已规划的结果类型包括：</p>")
    out.append('<div class="box warn"><span class="lb">结果谱系</span>')
    for ln in results.split("\n"):
        if ln.strip():
            out.append("<p>%s</p>" % esc(ln))
    out.append("</div>")

    # 全书目录（roadmap）
    out.append('<h2 id="roadmap">全书目录</h2>')
    out.append('<div class="roadmap">')
    for v, chs in VOLUMES:
        out.append('<div class="rvol"><div class="rvh">%s</div><ul>' % esc(v))
        for cid in chs:
            title, _, _ = CHAPTERS[cid]
            name = title.split("：", 1)[-1] if "：" in title else title
            if src_docx(CHAP_DOCX[cid]):
                out.append('<li><a href="%s.html">%s</a></li>' % (cid, esc(name)))
            else:
                out.append('<li class="pend">%s <span class="tag">待续</span></li>' % esc(name))
        out.append("</ul></div>")
    # 配套文书
    out.append('<div class="rvol"><div class="rvh">配套文书（虚构示例）</div><ul>')
    for stem, out_id, label in DOCS:
        if src_docx(stem):
            out.append('<li><a href="%s.html">%s</a></li>' % (out_id, esc(label)))
    out.append("</ul></div>")
    out.append("</div>")

    out.append("<h2>作品开篇说明 / 虚构声明</h2>")
    for ln in opening.split("\n"):
        if ln.strip():
            out.append("<p>%s</p>" % esc(ln))

    out.append("</div>")
    return "\n".join(out)

# ---------------- 页面外壳 ----------------
def page(body_html, title, data_ch):
    return """<!DOCTYPE html>
<html lang="zh-CN" data-theme-default="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%s</title>
<link rel="stylesheet" href="assets/crim-style.css">
</head>
<body data-ch="%s">
%s
<script src="assets/app.js"></script>
<script src="/theme-toggle.js"></script>
</body>
</html>
""" % (esc(title), data_ch, body_html)

# ---------------- STATIONS / app.js ----------------
PART_ORDER = ["导览"] + [v[0] for v in VOLUMES] + ["配套文书（虚构示例）"]
PART_DESC = {
    "导览": "全书摘要 / 结构 / 框架 / 目录",
    "第一卷 · 人身边界": "故意伤害 · 过失致死 · 非法拘禁",
    "第二卷 · 财物迷局": "盗窃 · 抢劫 · 诈骗 · 侵占",
    "第三卷 · 屏幕背后的犯罪": "电诈 · 帮信 · 网络虚拟财产",
    "第四卷 · 危险现场": "危险驾驶 · 交通肇事 · 放火 · 危险物品",
    "第五卷 · 公司与权力": "挪用资金 · 合同诈骗 · 虚开 · 贿赂",
    "第六卷 · 程序本身就是辩护": "辨认 · 讯问 · 不起诉 · 申诉 · 执行",
    "配套文书（虚构示例）": "接待 / 会见 / 辩护词 / 申请书模板",
}

def build_stations():
    st = []
    st.append({"id": "index", "no": "导览", "t": "全书导览", "part": "导览", "kw": "目录 摘要 结构 框架 开篇 虚构"})
    for v, chs in VOLUMES:
        for cid in chs:
            title, _, kw = CHAPTERS[cid]
            name = title.split("：", 1)[-1] if "：" in title else title
            if src_docx(CHAP_DOCX[cid]):
                st.append({"id": cid, "no": cid[2:], "t": name, "part": v, "kw": kw})
            else:
                st.append({"id": cid, "no": cid[2:], "t": name, "part": v, "kw": kw, "disabled": True})
    for stem, out_id, label in DOCS:
        st.append({"id": out_id, "no": "文书", "t": label, "part": "配套文书（虚构示例）", "kw": "文书 模板 笔录 意见书 申请书"})
    return st

def build_appjs(stations):
    data = json.dumps(stations, ensure_ascii=False)
    parts = json.dumps(
        [{"key": k, "name": k, "desc": PART_DESC.get(k, "")} for k in PART_ORDER],
        ensure_ascii=False,
    )
    return APPJS_TEMPLATE.replace("/*__STATIONS__*/", "var STATIONS = %s;" % data).replace(
        "/*__PARTS__*/", "var PARTS = %s;" % parts
    )

APPJS_TEMPLATE = r"""(function () {
  'use strict';
  /*__STATIONS__*/
  /*__PARTS__*/
  var cur = document.body.getAttribute('data-ch') || 'index';
  var idx = STATIONS.findIndex(function (s) { return s.id === cur; });
  if (idx < 0) idx = 0;
  var me = STATIONS[idx];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function hrefOf(s) { return s.id === 'index' ? 'index.html' : s.id + '.html'; }

  var body = document.body;
  var orig = [].slice.call(body.childNodes).filter(function (n) {
    return !(n.nodeType === 1 && n.tagName === 'SCRIPT');
  });

  var topbar = el('header', 'topbar');
  topbar.appendChild(el('div', 'brand', '刑事辩护实录<small>30 CRIMINAL CASES</small>'));
  var searchWrap = el('div', 'searchwrap');
  var search = el('input');
  search.id = 'search';
  search.type = 'search';
  search.autocomplete = 'off';
  search.placeholder = '搜索案件：正当防卫 / 诈骗 / 非法证据 / 辨认笔录 / 侵占 / 不起诉…';
  searchWrap.appendChild(search);
  var searchCount = el('span', 'scount');
  searchWrap.appendChild(searchCount);
  topbar.appendChild(searchWrap);
  topbar.appendChild(el('span', 'cur-chip', me.no === '导览' ? me.t : '第 ' + me.no + ' 章 · ' + me.t));
  var menuBtn = el('button', 'menu-btn', '目录');
  menuBtn.setAttribute('aria-label', '打开目录');
  topbar.appendChild(menuBtn);

  var layout = el('div', 'layout');
  var side = el('aside', 'side');
  side.id = 'side';
  var sideHd = el('div', 'side-hd');
  sideHd.appendChild(el('span', 't', '目录'));
  var collapseBtn = el('button', 'collapse-btn', '⟨');
  collapseBtn.setAttribute('aria-label', '收起目录');
  sideHd.appendChild(collapseBtn);
  side.appendChild(sideHd);
  var main = el('div', 'main');
  main.id = 'main';
  var bodywrap = el('div', 'bodywrap');
  var content = el('div', 'content');
  orig.forEach(function (n) { content.appendChild(n); });
  var tocBox = el('aside', 'pagetoc');
  tocBox.id = 'pagetoc';
  bodywrap.appendChild(content);
  bodywrap.appendChild(tocBox);
  main.appendChild(bodywrap);
  layout.appendChild(side);
  layout.appendChild(main);

  body.appendChild(topbar);
  body.appendChild(layout);

  function isWide() {
    if (window.matchMedia) return window.matchMedia('(min-width: 1001px)').matches;
    return (window.innerWidth || 1024) >= 1001;
  }
  function fitHeight() {
    var h = topbar.offsetHeight || 56;
    if (isWide()) {
      layout.style.height = 'calc(100vh - ' + h + 'px)';
    } else {
      layout.style.height = '';
      side.style.top = h + 'px';
      side.style.height = 'calc(100vh - ' + h + 'px)';
    }
  }
  fitHeight();
  window.addEventListener('resize', fitHeight);

  var linkMap = {};
  PARTS.forEach(function (p) {
    var items = STATIONS.filter(function (s) { return s.part === p.key; });
    if (!items.length) return;
    var g = el('div', 'grp');
    g.appendChild(el('div', 'grp-h', p.name));
    if (p.desc) g.appendChild(el('div', 'grp-d', p.desc));
    items.forEach(function (s) {
      if (s.disabled) {
        var d = el('a', 'pending', '<span class="no">' + s.no + '</span>' + s.t + '<span class="tag">待续</span>');
        d.setAttribute('title', s.t + '（待续）');
        g.appendChild(d);
        return;
      }
      var a = el('a', s.id === cur ? 'on' : '', '<span class="no">' + s.no + '</span>' + s.t);
      a.href = hrefOf(s);
      a.title = s.t;
      linkMap[s.id] = a;
      g.appendChild(a);
    });
    side.appendChild(g);
  });

  var foot = el('div', 'sidefoot');
  foot.appendChild(el('div', 'badge', '内容性质'));
  foot.appendChild(el('div', 'lv', '<b>·</b>全部人物、地点、金额、案情与诉讼结果均为虚构'));
  foot.appendChild(el('div', 'lv', '<b>·</b>用于展示刑事辩护的事实判断、证据审查、程序控制与庭审策略'));
  foot.appendChild(el('div', 'lv', '<b>·</b>不构成对任何具体案件的法律意见'));
  side.appendChild(foot);

  var onLink = linkMap[cur];
  if (onLink && side.scrollHeight > side.clientHeight) {
    var t = onLink.offsetTop;
    if (t > side.scrollTop + side.clientHeight - 80 || t < side.scrollTop) {
      side.scrollTop = Math.max(0, t - 120);
    }
  }
  menuBtn.addEventListener('click', function () { side.classList.toggle('open'); });
  Object.keys(linkMap).forEach(function (k) {
    linkMap[k].addEventListener('click', function () { side.classList.remove('open'); });
  });

  var fab = el('button', 'side-fab', '⟩ 目录');
  fab.setAttribute('aria-label', '展开目录');
  body.appendChild(fab);
  function setCollapsed(on) {
    document.body.classList.toggle('side-collapsed', on);
    try { localStorage.setItem('crimrec_side_collapsed', on ? '1' : '0'); } catch (e) {}
  }
  collapseBtn.addEventListener('click', function () { setCollapsed(true); });
  fab.addEventListener('click', function () { setCollapsed(false); });
  try {
    if (localStorage.getItem('crimrec_side_collapsed') === '1' && isWide()) setCollapsed(true);
  } catch (e) {}

  search.addEventListener('input', function () {
    var q = (search.value || '').trim().toLowerCase();
    var n = 0;
    STATIONS.forEach(function (s) {
      if (s.disabled) return;
      var a = linkMap[s.id];
      if (!a) return;
      if (!q) { a.classList.remove('hide'); return; }
      var hay = (s.no + ' ' + s.t + ' ' + s.part + ' ' + (s.kw || '')).toLowerCase();
      if (hay.indexOf(q) >= 0) { a.classList.remove('hide'); n++; }
      else { a.classList.add('hide'); }
    });
    [].slice.call(side.querySelectorAll('.grp')).forEach(function (g) {
      g.style.display = g.querySelectorAll('a:not(.hide)').length ? '' : 'none';
    });
    searchCount.textContent = !q ? '' : (n ? n + ' 篇命中' : '无命中');
  });

  var pg = el('div');
  pg.id = 'progress';
  body.appendChild(pg);
  function scroller() {
    var inner = main.scrollHeight - main.clientHeight;
    if (inner > 4) return { top: main.scrollTop, max: inner };
    var de = document.documentElement;
    return { top: window.scrollY || de.scrollTop, max: de.scrollHeight - de.clientHeight };
  }
  var ticking = false;
  function updProgress() {
    var s = scroller();
    pg.style.width = (s.max > 0 ? (s.top / s.max) * 100 : 0) + '%';
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(updProgress); } }
  main.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  var heads = [].slice.call(content.querySelectorAll('h2, h3'));
  heads.forEach(function (h, i) { if (!h.id) h.id = 'sec-' + (i + 1); });
  function scrollToHead(h) {
    if (main.scrollHeight - main.clientHeight > 4) {
      var mr = main.getBoundingClientRect();
      var hr = h.getBoundingClientRect();
      main.scrollTo({ top: main.scrollTop + hr.top - mr.top - 16, behavior: 'smooth' });
    } else { h.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  if (heads.length >= 3) {
    tocBox.appendChild(el('div', 'toc-h', '本页目录'));
    heads.forEach(function (h) {
      var a = el('a', h.tagName === 'H3' ? 'lv3' : '', h.textContent);
      a.setAttribute('data-sec', h.id);
      a.addEventListener('click', function (e) { e.preventDefault(); scrollToHead(h); });
      tocBox.appendChild(a);
    });
    tocBox.classList.add('show');
    var host = content.querySelector('header.page-head') || content.querySelector('.sub');
    var inline = el('div', 'toc');
    inline.appendChild(el('div', 'h', '本页目录'));
    var ol = el('ol');
    heads.forEach(function (h) {
      var li = el('li');
      var a = el('a', null, h.textContent);
      a.href = '#' + h.id;
      a.addEventListener('click', function (e) { e.preventDefault(); scrollToHead(h); });
      li.appendChild(a); ol.appendChild(li);
    });
    inline.appendChild(ol);
    if (host) host.parentNode.insertBefore(inline, host.nextSibling);
    else content.insertBefore(inline, content.firstChild);
    var tocLinks = [].slice.call(tocBox.querySelectorAll('a'));
    var spy = false;
    function updSpy() {
      var mr = main.getBoundingClientRect();
      var active = null;
      heads.forEach(function (h) { if (h.getBoundingClientRect().top - mr.top <= 90) active = h; });
      if (!active) active = heads[0];
      tocLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-sec') === active.id); });
      spy = false;
    }
    main.addEventListener('scroll', function () { if (!spy) { spy = true; window.requestAnimationFrame(updSpy); } }, { passive: true });
    updSpy();
  }

  window.cp = function (btn) {
    var box = btn.closest('.pbox') || btn.parentElement;
    var txt = box ? box.innerText : '';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () {
        var o = btn.textContent; btn.textContent = '已复制';
        setTimeout(function () { btn.textContent = o; }, 1200);
      }).catch(function () {});
    }
  };

  var liveStations = STATIONS.filter(function (s) { return !s.disabled; });
  var li = liveStations.findIndex(function (s) { return s.id === cur; });
  var wrap = content.querySelector('.wrap') || content;
  var pager = el('div', 'pager');
  if (li > 0) {
    var p = liveStations[li - 1];
    var a1 = el('a', 'prev', '<span class="dir">上一篇</span><span class="tt">' + p.no + ' ' + p.t + '</span>');
    a1.href = hrefOf(p);
    pager.appendChild(a1);
  }
  if (li >= 0 && li < liveStations.length - 1) {
    var nx = liveStations[li + 1];
    var a2 = el('a', 'next', '<span class="dir">下一篇</span><span class="tt">' + nx.no + ' ' + nx.t + '</span>');
    a2.href = hrefOf(nx);
    pager.appendChild(a2);
  }
  wrap.appendChild(pager);
  wrap.appendChild(el('div', 'site-foot',
    '《刑事辩护实录：三十宗虚拟案件的完整诉讼》为虚构案例作品集，全部人物姓名、单位名称、案发地点、金额、案件事实及诉讼结果均为虚构，不对应任何特定真实案件。本作品旨在展示刑事案件中事实认定、证据审查、程序保障与辩护方法，不构成对任何具体案件的法律意见。案件处理应以当时有效的法律、司法解释、证据材料及有权机关的依法认定为准。'));

  updProgress();
  if (location.hash && location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { scrollToHead(target); }, 60);
  }
})();
"""

# ---------------- 主流程 ----------------
def main():
    main_doc = docx_paras(src_docx("《刑事辩护实录：三十宗虚拟案件的完整诉讼》"))
    stations = build_stations()

    # 复制并追加辅助类到 crim-style.css
    src_css = os.path.join(ROOT, "public", "criminal", "assets", "crim-style.css")
    css = open(src_css, encoding="utf-8").read()
    css += """
/* ===== 刑事辩护实录（criminal-record）追加辅助类 ===== */
.side a.pending{color:var(--ink-3);cursor:default;opacity:.72;display:flex;align-items:center;gap:6px;}
.side a.pending .no{color:var(--ink-3);}
.side a.pending .tag{font-size:10.5px;letter-spacing:.08em;color:var(--ink-3);border:1px solid var(--line2);border-radius:999px;padding:0 7px;margin-left:auto;}
.side a.pending:hover{background:transparent;color:var(--ink-3);}
.kv{font-size:14px;margin:6px 0;color:var(--ink-2);}
.kv b{color:var(--gold);font-weight:600;margin-right:2px;}
.docbox{border:1px solid var(--line);border-radius:9px;padding:6px 16px 10px;margin:12px 0;background:var(--bg2);}
.docbox .kv{font-size:13.4px;}
.roadmap{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin:14px 0 8px;}
.rvol{border:1px solid var(--line);border-radius:10px;padding:12px 16px;background:var(--panel);}
.rvh{font-size:13.5px;font-weight:700;color:var(--gold);letter-spacing:.06em;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--line2);}
.rvol ul{list-style:none;margin:0;padding:0;}
.rvol li{padding:5px 0;font-size:13.6px;border-bottom:1px dashed var(--dash);}
.rvol li:last-child{border-bottom:none;}
.rvol li a{color:var(--ink-2);text-decoration:none;}
.rvol li a:hover{color:var(--gold);}
.rvol li.pend{color:var(--ink-3);}
.rvol li .tag{font-size:10px;border:1px solid var(--line2);border-radius:999px;padding:0 6px;margin-left:6px;color:var(--ink-3);}
.steps-plain{margin:10px 0;padding-left:22px;}
.steps-plain li{font-size:14.5px;margin:7px 0;line-height:1.7;}
@media (max-width:640px){ .roadmap{grid-template-columns:1fr;} }
/* Word 表格：可横向滚动 + 表头金色 + 深浅色适配 */
.tblwrap{overflow-x:auto;margin:14px 0;border:1px solid var(--line);border-radius:9px;background:var(--bg2);-webkit-overflow-scrolling:touch;}
.dtable{width:100%;border-collapse:collapse;font-size:13.2px;line-height:1.65;}
.dtable th,.dtable td{border:1px solid var(--line2);padding:8px 12px;text-align:left;vertical-align:top;color:var(--ink-2);}
.dtable th{background:var(--panel);color:var(--gold);font-weight:600;}
.dtable td b,.dtable td strong{color:var(--ink);}
.volband{margin:20px 0 4px;font-size:13px;letter-spacing:.14em;color:var(--gold);font-weight:600;text-align:center;}
.volband::after{content:"";display:block;width:44px;height:1px;background:var(--gold);opacity:.5;margin:8px auto 0;}
@media (max-width:640px){ .dtable th,.dtable td{padding:6px 8px;font-size:12.4px;} }
"""
    open(os.path.join(ASSETS, "crim-style.css"), "w", encoding="utf-8").write(css)

    # app.js
    open(os.path.join(ASSETS, "app.js"), "w", encoding="utf-8").write(build_appjs(stations))

    # index
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(
        page(build_index(main_doc), "刑事辩护实录：三十宗虚拟案件的完整诉讼 · 全书导览", "index"))

    # 章节
    written = 0
    for cid in CHAPTERS:
        if src_docx(CHAP_DOCX[cid]):
            _, title, _ = CHAPTERS[cid]
            open(os.path.join(OUT, cid + ".html"), "w", encoding="utf-8").write(
                page(build_chapter(cid), title, cid))
            written += 1

    # 配套文书
    for stem, out_id, _ in DOCS:
        if src_docx(stem):
            open(os.path.join(OUT, out_id + ".html"), "w", encoding="utf-8").write(
                page(build_docs(stem, out_id), out_id, out_id))
            written += 1

    print("已生成章节页 %d 个（含 index + 2 文书）；STATIONS 共 %d 条（含 %d 条待续）" %
          (written, len(stations), sum(1 for s in stations if s.get("disabled"))))

if __name__ == "__main__":
    main()
