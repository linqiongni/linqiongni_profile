#!/usr/bin/env python3
# 批量抓取 WorkBuddy 空间「餐饮加盟法务总监养成计划」各周课程 HTML 到 public/lessons/
# 文件名使用 nodeId（唯一、稳定），便于前端按 id 映射本地文件
import os, re, json, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

TOKEN = os.environ["WB_TOKEN"]
REPO = "/Users/linqiongni/Downloads/linqiongni_profile"
SKILL = "/Users/linqiongni/.workbuddy/plugins/cache/workbuddy-builtin/skill-library/0.5.9/page/list_page_artifacts.py"
OUT_DIR = os.path.join(REPO, "public", "lessons")
os.makedirs(OUT_DIR, exist_ok=True)

tsx = open(os.path.join(REPO, "src/components/CateringLegalTab.tsx"), encoding="utf-8").read()
# 匹配单行课程项：{ title: '...', id: '...' }
pairs = re.findall(r"\{\s*title:\s*'([^']+)',\s*id:\s*'([A-Za-z0-9_-]+)'\s*\}", tsx)
# 去重保序
seen, lessons = set(), []
for title, nid in pairs:
    if nid not in seen:
        seen.add(nid)
        lessons.append((title, nid))

print(f"共解析到 {len(lessons)} 篇课程", flush=True)


def fetch(item):
    title, nid = item
    dest = os.path.join(OUT_DIR, f"{nid}.html")
    try:
        p = subprocess.run(
            ["python3", SKILL, "--token-stdin", "--node-id", nid],
            input=TOKEN, capture_output=True, text=True, timeout=60
        )
        data = json.loads(p.stdout)
        arts = data.get("data", {}).get("artifacts") or []
        if not arts:
            return (nid, title, False, "无产物")
        base = data["data"].get("url", "").rstrip("/")
        # 取体积最大的 html 产物（正文本体）
        htmls = [a for a in arts if str(a.get("path", "")).endswith(".html")]
        pick = htmls[0] if htmls else arts[0]
        url = f"{base}/{pick['path']}"
        r = subprocess.run(["curl", "-sL", "--max-time", "90", url, "-o", dest],
                           capture_output=True, text=True, timeout=120)
        size = os.path.getsize(dest) if os.path.exists(dest) else 0
        # 内容校验：必须是 HTML 且不为空
        ok = size > 2000
        if ok:
            head = open(dest, encoding="utf-8", errors="ignore").read(400).lower()
            ok = "<html" in head or "<!doctype" in head
        return (nid, title, ok, f"{size//1024}KB")
    except Exception as e:
        return (nid, title, False, str(e)[:60])


results = []
with ThreadPoolExecutor(max_workers=8) as ex:
    for r in ex.map(fetch, lessons):
        results.append(r)
        print(("  OK  " if r[2] else "  FAIL"), r[0], r[1][:40], r[3], flush=True)

ok_ids = [r[0] for r in results if r[2]]
fail = [r for r in results if not r[2]]
json.dump({"ok": ok_ids, "fail": fail}, open("/tmp/local_lessons.json", "w"), ensure_ascii=False, indent=1)
print(f"\n成功 {len(ok_ids)} / {len(results)}；失败 {len(fail)}")
for f in fail[:10]:
    print("  失败:", f[0], f[1][:40], f[3])
