#!/usr/bin/env python3
"""把源目录 英语拾遗/ 同步到部署副本 public/english-scraps/。
不依赖 rsync（本机 bash 无该命令）。只同步白名单文件，绝不删除副本里的其它资源。
主题补丁（EMBEDDED_KIT 等五块）已写进源目录 index.html，随同步一起走——不要改 public 副本。
"""
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "英语拾遗"
DST = ROOT / "public" / "english-scraps"

if not SRC.is_dir():
    raise SystemExit(f"源目录不存在: {SRC}")
DST.mkdir(parents=True, exist_ok=True)

copied = []
for f in SRC.rglob("*"):
    if not f.is_file():
        continue
    rel = f.relative_to(SRC)
    if any(part in {".git", ".workbuddy"} for part in rel.parts) or f.name == ".DS_Store":
        continue
    target = DST / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(f, target)
    copied.append(str(rel))

print(f"已同步 {len(copied)} 个文件到 public/english-scraps/")
for c in copied:
    print("  " + c)
