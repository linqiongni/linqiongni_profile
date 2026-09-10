#!/usr/bin/env python3
"""
把新生成的「第 N 周第 M 天」HTML 合并进个人主页的「餐饮法务」tab。

用法：
  python3 scripts/add_lesson.py --src "/path/to/课程.html" --week 10 --day 2 \
      --title "供应链食安条款设计" [--theme "第10周主题"] [--id week10-day2] [--repo /path]

行为：
  1. 复制 HTML 到 public/lessons/{id}.html（文件名强制 ASCII）
  2. 在 CateringLegalTab.tsx 的对应周 lessons 里插入条目（周不存在则按周序新建）
  3. 把 id 加入 LOCAL_LESSON_IDS（决定站内免登录阅读）
  4. 打印后续校验/推送命令

不自动 commit/push —— 留给用户确认后执行。
"""
import argparse, os, re, shutil, sys

DEF_REPO = "/Users/linqiongni/Downloads/linqiongni_profile"
TSX_REL = "src/components/CateringLegalTab.tsx"

ap = argparse.ArgumentParser()
ap.add_argument("--src", required=True, help="源 HTML 路径")
ap.add_argument("--week", required=True, type=int, help="周序号，如 10")
ap.add_argument("--day", required=True, type=int, help="天序号，如 2（周末实战填 6）")
ap.add_argument("--title", required=True, help="课程标题（不含「第N周第M天」前缀，脚本会自动加）")
ap.add_argument("--theme", default="", help="该周主题（仅新建周时需要）")
ap.add_argument("--id", default="", help="自定义 nodeId，默认 week{NN}-day{M}")
ap.add_argument("--repo", default=DEF_REPO)
a = ap.parse_args()

repo = a.repo
tsx_path = os.path.join(repo, TSX_REL)
nid = a.id or f"week{a.week:02d}-day{a.day}"
full_title = f"第 {a.week} 周第 {a.day} 天 · {a.title}"

if not os.path.isfile(a.src):
    sys.exit(f"源文件不存在: {a.src}")
if not os.path.isfile(tsx_path):
    sys.exit(f"未找到组件文件: {tsx_path}")

# 1. 复制 HTML
out_dir = os.path.join(repo, "public", "lessons")
os.makedirs(out_dir, exist_ok=True)
dest = os.path.join(out_dir, f"{nid}.html")
shutil.copyfile(a.src, dest)
print(f"✅ 已复制 → public/lessons/{nid}.html ({os.path.getsize(dest)//1024}KB)")

src = open(tsx_path, encoding="utf-8").read()

# 2. 加入 LOCAL_LESSON_IDS
if nid in src:
    print(f"⚠️  id {nid} 已存在于组件中，跳过 Set 写入")
else:
    m = re.search(r"(LOCAL_LESSON_IDS = new Set\(\[)(.*?)(\n\]\);)", src, re.S)
    if not m:
        sys.exit("未找到 LOCAL_LESSON_IDS，检查组件结构是否变更")
    src = src[:m.end(1)] + m.group(2) + f"\n  '{nid}'," + m.group(3) + src[m.end(3):]
    print(f"✅ 已加入 LOCAL_LESSON_IDS: {nid}")

# 3. 插入/新建周条目
label = f"第 {a.week} 周"
week_re = re.compile(
    r"\{\s*\n\s*id:\s*'[^']+',\s*\n\s*label:\s'" + re.escape(label) + r"',\s*\n\s*theme:\s*'[^']*',\s*\n\s*lessons:\s*\[(.*?)\n\s*\],\s*\n\s*\},",
    re.S,
)
m = week_re.search(src)
if m:
    # 已有该周 → 在 lessons 末尾插入
    block = m.group(1)
    indent = "      "
    src = src[:m.end(1)] + f"\n{indent}{{ title: '{full_title}', id: '{nid}' }}," + src[m.end(1):]
    print(f"✅ 已在「{label}」下新增条目")
else:
    # 新建周块，按周序插入
    new_block = (
        "  {\n"
        f"    id: 'week-{a.week:02d}',\n"
        f"    label: '{label}',\n"
        f"    theme: '{a.theme or full_title}',\n"
        "    lessons: [\n"
        f"      {{ title: '{full_title}', id: '{nid}' }},\n"
        "    ],\n"
        "  },\n"
    )
    # 找到所有已有周块及其序号，插到第一个更大的周之前（保持周序，切勿追加末尾）
    labels = [(int(x.group(1)), x.start()) for x in re.finditer(r"label:\s*'第 (\d+) 周'", src)]
    bigger = [pos for num, pos in labels if num > a.week]
    if bigger:
        insert_at = min(bigger)
        # 回退到该周块的起始 '{'
        start = src.rfind("  {\n", 0, insert_at)
        src = src[:start] + new_block + src[start:]
        print(f"✅ 已新建「{label}」并按周序插入（在更大的周之前）")
    else:
        # 没有更大的周 → 插到 WEEKS 数组末尾前
        end = src.index("\n];", src.index("const WEEKS: Week[] = ["))
        src = src[:end] + "\n" + new_block.rstrip("\n") + src[end:]
        print(f"✅ 已新建「{label}」并插入数组末尾（当前已是最大周序）")

open(tsx_path, "w", encoding="utf-8").write(src)
print(f"✅ 已写入 {TSX_REL}")

print("\n接下来执行：")
print(f"  cd {repo}")
print("  <npm> run lint && <npm> run build")
print("  git add -A && git commit -q -m 'feat: 新增" + full_title + "'")
print("  git -c http.proxy= -c https.proxy= push origin main   # 失败重试即可；大文件先 git config http.postBuffer 524288000")
