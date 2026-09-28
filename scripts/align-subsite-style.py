# -*- coding: utf-8 -*-
"""v2：修复 set_decl 多写 } 的 bug；版式同时覆盖 CSS 与 labor 的内联 <style>"""
import re, glob, os

SERIF = '"Songti SC", "STSong", "Noto Serif SC", Georgia, serif'
SANS  = '-apple-system, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif'
MONO  = '"SF Mono", ui-monospace, Menlo, Consolas, monospace'
LIGHT_ADD = ("\n  --ink-2: #5A5449;\n  --ink-3: #8A8275;\n  --serif: %s;\n  --sans: %s;\n"
             "  --mono: %s;\n  --gold-deep: #8C7443;\n  --gold-soft: rgba(184, 159, 107, .12);" % (SERIF, SANS, MONO))
DARK_ADD  = "\n  --ink-2: #C3BDB1;\n  --ink-3: #8F8A80;\n  --gold-deep: #D9C79C;"

LIGHT_INK_MAP = [
    (r'(--ink:\s*)#1D1D1F', r'\1#23201B'), (r'(--tx:\s*)#1D1D1F', r'\1#23201B'),
    (r'(--tx:\s*)#091A2E', r'\1#23201B'),  (r'(--ink:\s*)#091A2E', r'\1#23201B'),
    (r'(--ink2:\s*)#57575C', r'\1#5A5449'), (r'(--tx2:\s*)#57575C', r'\1#5A5449'),
    (r'(--tx2:\s*)#5A5A5F', r'\1#5A5449'),
    (r'(--ink3:\s*)#86868B', r'\1#8A8275'), (r'(--tx3:\s*)#86868B', r'\1#8A8275'),
    (r'(--tx3:\s*)#6E6E73', r'\1#8A8275'),  (r'(--tx3:\s*)#909095', r'\1#8A8275'),
    (r'(--gold:\s*)#8A6716', r'\1#B89F6B'), (r'(--gold:\s*)#96792F', r'\1#B89F6B'),
    (r'(--red:\s*)#[0-9A-Fa-f]{6}', r'\1#A8342F'),
    (r'(--green:\s*)#[0-9A-Fa-f]{6}', r'\1#3F6B4E'),
    (r'(--blue:\s*)#[0-9A-Fa-f]{6}', r'\1#2F5578'),
]
LABOR_MAP = [
    (r'(--bg:\s*)#0e1014', r'\1#091A2E'), (r'(--bg2:\s*)#151922', r'\1#0C1B2B'),
    (r'(--card:\s*)#12161d', r'\1#0C1B2B'), (r'(--line:\s*)#252b36', r'\1#1B2E45'),
    (r'(--line2:\s*)#39414f', r'\1#2A3E52'), (r'(--tx:\s*)#e8e6e1', r'\1#F4EFE4'),
    (r'(--tx2:\s*)#a8b0bd', r'\1#C3BDB1'), (r'(--tx3:\s*)#6b7480', r'\1#8F8A80'),
    (r'(--gold:\s*)#c9a227', r'\1#C9A86A'), (r'(--red:\s*)#c05c4e', r'\1#E38B84'),
    (r'(--blue:\s*)#5b8dd6', r'\1#7BA6C9'), (r'(--jade:\s*)#4a9d9c', r'\1#6FB3B1'),
]

def rename_vars(t):
    for old, new in (('var(--ink2)','var(--ink-2)'), ('var(--ink3)','var(--ink-3)'),
                     ('var(--tx2)','var(--ink-2)'),  ('var(--tx3)','var(--ink-3)'),
                     ('var(--txt2)','var(--ink-2)'), ('var(--txt3)','var(--ink-3)')):
        t = t.replace(old, new)
    return t

def inject_blocks(t, is_labor=False):
    def light(m):
        body = m.group(0)
        if '--ink-2:' in body: return body
        inner = m.group(1)
        for pat, rep in (LABOR_MAP if is_labor else LIGHT_INK_MAP):
            inner = re.sub(pat, rep, inner)
        if is_labor:
            return ':root{' + inner + DARK_ADD + '\n  --serif: %s;\n  --sans: %s;\n  --mono: %s;}' % (SERIF, SANS, MONO)
        return ':root{' + inner + LIGHT_ADD + '}'
    t = re.sub(r':root\s*\{([^}]*)\}', light, t)
    def dark(m):
        if '--ink-2:' in m.group(0): return m.group(0)
        return 'html[data-theme="dark"]{' + m.group(1) + DARK_ADD + '}'
    t = re.sub(r'html\[data-theme="dark"\]\s*\{([^}]*)\}', dark, t)
    return t

# ---------- 版式 ----------
def set_decl(block, prop, val):
    if re.search(r'(?<![\w-])' + prop + r'\s*:', block):
        return re.sub(r'(?<![\w-])' + prop + r'\s*:\s*[^;]+;', prop + ': ' + val + ';', block, count=1)
    b = block.rstrip()
    if not b.endswith((';', '{')):
        b += ';'          # 原块最后一条声明可能没写分号，补上再追加
    return b + ' ' + prop + ': ' + val + ';'

def fix_selector(t, sel, mutator):
    pat = re.compile(r'(?ms)(^|[\}\s;])(' + sel + r')\s*\{(.*?)\}')
    out, last = [], 0
    for m in pat.finditer(t):
        out.append(t[last:m.start(3)]); out.append(mutator(m.group(3))); last = m.end(3)
    out.append(t[last:])
    return ''.join(out)

def bump(block, prop, cur_min, new):
    m = re.search(prop + r'\s*:\s*([\d.]+)px', block)
    if m and float(m.group(1)) >= cur_min:
        block = re.sub(prop + r'\s*:\s*[\d.]+px', prop + ': ' + new, block, count=1)
    return block

def de_gold(block):
    return re.sub(r'color:\s*var\(--gold\)', 'color: var(--ink)', block, count=1)

def typography(t):
    t = fix_selector(t, 'body', lambda b: set_decl(set_decl(
        set_decl(b, 'font-family', 'var(--sans)'), 'font-size', '15.5px'), 'line-height', '1.78'))
    def h1(b):
        b = set_decl(b, 'font-family', 'var(--serif)'); b = set_decl(b, 'font-weight', '700')
        b = bump(b, 'font-size', 25, '34px'); return set_decl(b, 'letter-spacing', '.01em')
    def h2(b):
        return bump(set_decl(b, 'font-family', 'var(--serif)'), 'font-size', 19, '23px')
    def h3(b):
        b = set_decl(b, 'font-family', 'var(--serif)'); b = bump(b, 'font-size', 15, '17px')
        b = set_decl(b, 'font-weight', '650'); return de_gold(b)
    def h4(b):
        return set_decl(bump(b, 'font-size', 15, '15px'), 'color', 'var(--ink-2)')
    for sel, fn in (('h1', h1), ('h2', h2), ('h3', h3), ('h4', h4)):
        t = fix_selector(t, sel, fn)
    t = fix_selector(t, r'\.kicker', lambda b: set_decl(set_decl(
        bump(b, 'font-size', 10, '12.5px'), 'letter-spacing', '.22em'), 'color', 'var(--gold-deep)'))
    t = fix_selector(t, r'\.subtitle', lambda b: bump(set_decl(b, 'color', 'var(--ink-2)'), 'font-size', 13, '15px'))
    t = fix_selector(t, r'\.sub\b', lambda b: bump(set_decl(b, 'color', 'var(--ink-2)'), 'font-size', 13, '15px'))
    t = fix_selector(t, r'\.meta-line', lambda b: set_decl(b, 'color', 'var(--ink-3)'))
    t = fix_selector(t, r'em\b', lambda b: set_decl(b, 'color', 'var(--ink)'))
    def lead(b):
        for p, v in (('background','none'), ('border','0'), ('border-radius','0'),
                     ('padding','0'), ('margin','0 0 22px'), ('font-size','15px'), ('color','var(--ink-2)')):
            b = set_decl(b, p, v)
        return b
    return fix_selector(t, r'\.lead', lead)

def typography_html(t):
    """只处理 labor 这类把样式写在内联 <style> 里的页面"""
    def repl(m):
        return '<style' + m.group(1) + '>' + typography(m.group(2)) + '</style>'
    return re.sub(r'<style([^>]*)>(.*?)</style>', repl, t, flags=re.S)

SITES = ['criminal','econ-crime','arbitration','insurance','labor']
CSS = {'criminal':['public/criminal/assets/crim-style.css'], 'econ-crime':['public/econ-crime/assets/style.css'],
       'arbitration':['public/arbitration/assets/style.css'], 'insurance':['public/insurance/styles.css'],
       'labor':['public/labor/assets/layout.css']}
INLINE_TYPO = {'labor'}   # 需要把版式写进内联 <style> 的站

total = 0
for s in SITES:
    is_labor = s == 'labor'
    n = 0
    for f in glob.glob('public/%s/**/*.html' % s, recursive=True):
        t = open(f, encoding='utf-8').read(); o = t
        t = rename_vars(t)
        t = inject_blocks(t, is_labor)
        if s in INLINE_TYPO:
            t = typography_html(t)
        if t != o:
            open(f, 'w', encoding='utf-8').write(t); n += 1
    for f in CSS.get(s, []):
        if not os.path.exists(f): continue
        t = open(f, encoding='utf-8').read(); o = t
        t = rename_vars(t); t = inject_blocks(t, is_labor); t = typography(t)
        if t != o:
            open(f, 'w', encoding='utf-8').write(t); n += 1
    print(f'  {s}: 改动 {n} 个文件')
    total += n
print('合计:', total)
