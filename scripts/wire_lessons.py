#!/usr/bin/env python3
# 将已抓取的站内课程接入前端：按 nodeId 映射 public/lessons/{id}.html
import json, re, os

REPO = "/Users/linqiongni/Downloads/linqiongni_profile"
TSX = os.path.join(REPO, "src/components/CateringLegalTab.tsx")

ids = json.load(open("/tmp/local_lessons.json"))["ok"]
ids.append("week09-day1")  # 第 9 周第 1 天（食安专题）
ids = sorted(set(ids))

src = open(TSX, encoding="utf-8").read()

# 1) 插入本地课程集合与工具函数
anchor = "const lessonUrl = (id: string) => `https://www.workbuddy.cn/space/d/${id}`;"
assert anchor in src, "未找到 lessonUrl 锚点"
block = anchor + "\n\n// 已抓取至站内的课程（public/lessons/{id}.html）：免登录、可直接站内阅读\n"
block += "const LOCAL_LESSON_IDS = new Set([\n"
for i in ids:
    block += f"  '{i}',\n"
block += """]);
const lessonLocalUrl = (id: string) => `/lessons/${id}.html`;
const hasLocalLesson = (id: string) => LOCAL_LESSON_IDS.has(id);"""
src = src.replace(anchor, block, 1)

# 2) 渲染分支：改为按 id 判断是否可站内阅读
old_branch = "{l.localHtml ? ("
assert old_branch in src, "未找到渲染分支判断"
src = src.replace(old_branch, "{hasLocalLesson(l.id) ? (", 1)

# 3) iframe 与新窗口链接改用统一映射
src = src.replace("src={activeLesson.localHtml}", "src={lessonLocalUrl(activeLesson.id)}", 1)
src = src.replace("href={activeLesson.localHtml}", "href={lessonLocalUrl(activeLesson.id)}", 1)

# 4) 底部说明
old_note = "* 计划共 16 周。第 1–8 周、第 13 周为资料库原文（点击跳转阅读）；第 9 周第 1 天为站内全文，点击「站内阅读」直接在页内展开。"
new_note = "* 计划共 16 周。已发布的课程全文均已存于本站，点击「站内阅读」免登录直接查看；需看原文可点上方「在资料库查看全部」。"
if old_note in src:
    src = src.replace(old_note, new_note, 1)

# 5) 顶部注释同步
src = src.replace("// 周模块（第 1–8 周、第 13 周为资料库原文；第 9 周为站内直读）",
                  "// 周模块（课程全文已抓取至站内，见 LOCAL_LESSON_IDS）", 1)

open(TSX, "w", encoding="utf-8").write(src)
print(f"✅ 已写入 {len(ids)} 个站内课程 id")
print("   渲染分支:", "hasLocalLesson(l.id)" in src)
print("   iframe 映射:", "lessonLocalUrl(activeLesson.id)" in src)
