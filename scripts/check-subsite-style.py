# -*- coding: utf-8 -*-
import re, glob
SITES = ['criminal','econ-crime','arbitration','insurance','labor']
CSS = {'criminal':'public/criminal/assets/crim-style.css','econ-crime':'public/econ-crime/assets/style.css',
       'arbitration':'public/arbitration/assets/style.css','insurance':'public/insurance/styles.css',
       'labor':'public/labor/assets/layout.css'}
MISS = re.compile(r'[a-z-]+\s*:\s*[^;{}]+?\s+(?:font-family|font-size|line-height|font-weight|letter-spacing|color|background|border|border-radius|padding|margin)\s*:')
print('=== 1) 花括号平衡 + 缺分号扫描 ===')
for s in SITES:
    fb = ms = 0
    files = [p for p in glob.glob('public/%s/**/*' % s, recursive=True) if p.endswith(('.html','.css')) and 'aquatic' not in p]
    for f in files:
        t = open(f, encoding='utf-8').read()
        if t.count('{') != t.count('}'): fb += 1
        ms += len(MISS.findall(t))
    print(f'  {s}: 花括号不平衡文件 {fb} / 疑似缺分号 {ms}   (文件 {len(files)})')

print('\n=== 2) 关键规则 ===')
for s in SITES:
    files = [CSS[s]] + [p for p in glob.glob('public/%s/**/*.html' % s, recursive=True)]
    all_t = '\n'.join(open(f, encoding='utf-8').read() for f in files if __import__('os').path.exists(f))
    c = {
      'body --sans': re.search(r'body\s*\{[^}]*font-family:\s*var\(--sans\)', all_t, re.S) is not None,
      'body 15.5px': re.search(r'body\s*\{[^}]*font-size:\s*15\.5px', all_t, re.S) is not None,
      'h1 衬线34': re.search(r'h1\s*\{[^}]*var\(--serif\)[^}]*34px', all_t, re.S) is not None,
      'h2 衬线23': re.search(r'h2\s*\{[^}]*var\(--serif\)[^}]*23px', all_t, re.S) is not None,
      'h3 去金': re.search(r'h3\s*\{[^}]*color:\s*var\(--ink\)', all_t, re.S) is not None,
      '--ink-2 已定义': '--ink-2:' in all_t,
      '暗态暖灰': '#C3BDB1' in all_t,
      '旧变量残留': len(re.findall(r'var\(--(?:ink2|ink3|tx2|tx3|txt2|txt3)\)', all_t)),
    }
    print(f'  --- {s} ---')
    for k, v in c.items(): print(f'      {k}: {v}')

print('\n=== 3) labor 底色 ===')
l = open('public/labor/index.html', encoding='utf-8').read()
print('  --bg:#091A2E :', '--bg:#091A2E' in l)
print('  --tx2:#C3BDB1:', '--tx2:#C3BDB1' in l)
