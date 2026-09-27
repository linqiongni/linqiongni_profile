#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
wip-snapshot.py —— 为「做了一半的功能」生成断点卡的现场快照。

只做三件事，不 commit、不 push（提交推送是人的决定，别让脚本越权）：
  1. 抓当前 git 状态：分支 / HEAD / 已暂存 / 未暂存 / 未跟踪 / 今天改过哪些文件
  2. 写进 process/HANDOFF.md 第七节「现场快照」
  3. 打印接下来要填哪几栏

用法：
    python3 scripts/wip-snapshot.py                 # 生成快照并回显待填清单
    python3 scripts/wip-snapshot.py --no-write      # 只看，不改文件
"""
import os
import subprocess
import sys
from datetime import datetime

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HANDOFF = os.path.join(REPO, 'process', 'HANDOFF.md')
NO_WRITE = '--no-write' in sys.argv


def git(*args):
    """跑一条 git 命令，失败返回 (None, 错误信息)。"""
    try:
        p = subprocess.run(['git', '-c', 'core.quotepath=false', *args], cwd=REPO, capture_output=True, text=True, timeout=30)
        return (p.stdout.strip(), '') if p.returncode == 0 else (None, p.stderr.strip())
    except Exception as e:                                  # noqa: BLE001
        return None, str(e)


def section(title):
    for line in title.splitlines():
        if line.startswith('#'):
            return line.strip('# ').strip()
    return title


def sections_body(text, from_title, to_title):
    """取 from_title 与 to_title 两节之间的正文。"""
    a = text.find(from_title)
    b = text.find(to_title)
    if a < 0 or b < 0 or b <= a:
        return ''
    return text[a + len(from_title):b]


def is_filled(body):
    """节正文里剔除引导下划线句后还有实质内容，才算填过。"""
    real = [l for l in body.splitlines()
            if l.strip() and not l.strip().startswith('_') and not l.strip().startswith('（')]
    return bool([l for l in real if l.strip() not in ('无', '_（无）_')])


def main():
    # ---- 抓现场 ----
    branch, err = git('rev-parse', '--abbrev-ref', 'HEAD')
    if err:
        print('不是 git 仓库或 git 不可用：', err)
        return 1

    head, _ = git('log', '-1', '--format=%h %ad %s', '--date=short')
    staged, _ = git('diff', '--cached', '--name-only')
    unstaged, _ = git('diff', '--name-only')
    untracked, _ = git('ls-files', '--others', '--exclude-standard')
    since = datetime.now().strftime('%Y-%m-%d')
    today_files, _ = git('log', '--name-only', '--pretty=format:', f'--since={since} 00:00:00')

    def todo(block, limit=25):
        # 去重 + 排序：同一天改多次的文件会重复出现，且路径要稳定排序
        seen, lines = set(), []
        for x in (block or '').splitlines():
            x = x.strip()
            if x and x not in seen:
                seen.add(x)
                lines.append(x)
        lines.sort()
        shown = '\n'.join(f'- `{x}`' for x in lines[:limit]) or '_（无）_'
        if len(lines) > limit:
            shown += f'\n- _…另有 {len(lines) - limit} 条，用 git 命令看全_'
        return shown

    now = datetime.now().strftime('%Y-%m-%d %H:%M')

    # ---- 前置校验：断点卡的关键几节填了吗？没填就别生成快照 ----
    if os.path.exists(HANDOFF):
        _t = open(HANDOFF, encoding='utf-8').read()
        keys = [('一、我在做什么', '二、现在的状态'),
                ('二、现在的状态', '三、做完了'),
                ('三、做完了', '四、下一步第一步'),
                ('四、下一步第一步', '五、卡住的地方')]
        empty = [k[0].split('、')[0] for k in keys if not is_filled(sections_body(_t, '## ' + k[0], '## ' + k[1]))]
        if empty:
            print('=' * 60)
            print('!! 拒绝生成快照。`process/HANDOFF.md` 的 ' + '、'.join(empty) + ' 节还是空的。')
            print('   快照只记录「代码在哪」，记不了「你想到哪了」。先填这几节再打包，')
            print('   否则接手的人拿到干净的仓库，却不知道从哪接着干。')
            print('=' * 60)
            return 2

    table = f"""
- **抓于**：{now}
- **分支**：`{branch}`
- **最近提交**：`{head or '（无历史）'}`
- **已暂存改动**：
{todo(staged)}
- **未暂存改动**（含未提交的中途状态，**这些才是「做了一半」的主体**）：
{todo(unstaged)}
- **未跟踪的新文件**：
{todo(untracked)}
- **今天（{since}）动过的文件**：
{todo(today_files)}
"""

    # ---- 回显待填清单 ----
    print('=' * 60)
    print('现场快照已抓（分支 %s，最近提交 %s）' % (branch, (head or '无')[:40]))
    print('=' * 60)
    if not NO_WRITE:
        if not os.path.exists(HANDOFF):
            print('!! 找不到 process/HANDOFF.md，只打印不写入：')
            print(table)
        else:
            text = open(HANDOFF, encoding='utf-8').read()
            anchor = '## 七、现场快照（脚本生成，别手改）'
            if anchor not in text:
                print('!! HANDOFF.md 里没有第七节锚点，未能写入。请先保留该标题。')
            else:
                i = text.index(anchor) + len(anchor)
                rest = text[i:]
                # 替换区间只到第七节结束（下一道 --- 分隔线之前），后面的正文原样保留
                j = rest.find('\n---\n')
                tail = rest[j:] if j >= 0 else ''
                body = table.lstrip('\n')
                head_part = text[:i] + '\n\n_由 `python3 scripts/wip-snapshot.py` 自动写入_\n\n'
                open(HANDOFF, 'w', encoding='utf-8').write(head_part + body + tail)
                print('✓ 已写入 process/HANDOFF.md 第七节（第七节之后的内容原样保留）')
    print(table)
    print('=' * 60)
    print('接下来请您（或 Andy）手填前三节：')
    print('  一、我在做什么      二、现在的状态      三、做完/没做完')
    print('  四、下一步第一步 ★  五、卡住的地方与备选方案   六、别碰')
    print('填完再执行打包四行（HANDOFF.md 底部有现成命令）。')
    return 0


if __name__ == '__main__':
    sys.exit(main())
