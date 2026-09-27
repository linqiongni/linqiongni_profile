#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
wip-pack.py —— 一键把「做了一半的功能」打包推到 wip 分支。

把原本需要人手工做的四步串成一条命令：
    1. 校验 process/HANDOFF.md 前三节是否已填（没填就拒绝，退码 2）
    2. 抓 git 现场写进第七节「现场快照」
    3. 从 main 拉一条 wip/YYYYMMDD 分支，commit
    4. push 到远端，并打印新机器上的恢复命令

**只认 wip 分支。** 本仓库 CI 是 push main 触发构建并发布到 linqiongni.top，
推 main 等于把半成品发上线。脚本里没有 main 的出口，想推 main 也推不出去。

用法：
    python3 scripts/wip-pack.py -m "在做什么的一句话"     # 一键打包并推送
    python3 scripts/wip-pack.py -m "……" --no-push        # 只 commit，不 push
    python3 scripts/wip-pack.py --dry-run                # 只看会做什么，一点不改

前置（这一步绕不过去，脚本也不替你做）：
    先把 process/HANDOFF.md 前三节填了 —— 脚本不知道你「想到哪了」，
    它只会拒绝。这正是它存在的意义。
"""
import os
import subprocess
import sys
from datetime import datetime

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HANDOFF = os.path.join(REPO, 'process', 'HANDOFF.md')
TODAY = datetime.now().strftime('%Y%m%d')

args = sys.argv[1:]
DRY = '--dry-run' in args
NO_PUSH = '--no-push' in args
msg = ''
if '-m' in args:
    i = args.index('-m')
    if i + 1 < len(args):
        msg = args[i + 1]


def git(*a):
    try:
        p = subprocess.run(['git', '-c', 'core.quotepath=false', *a], cwd=REPO,
                           capture_output=True, text=True, timeout=60)
        return (p.stdout.strip(), '') if p.returncode == 0 else (None, p.stderr.strip())
    except Exception as e:                                  # noqa: BLE001
        return None, str(e)


def sections_body(text, a, b):
    i, j = text.find(a), text.find(b)
    if i < 0 or j < 0 or j <= i:
        return ''
    return text[i + len(a):j]


def is_filled(body):
    real = [l for l in body.splitlines()
            if l.strip() and not l.strip().startswith('_') and not l.strip().startswith('（')]
    return bool([l for l in real if l.strip() not in ('无', '_（无）_')])


def todo(block, limit=25):
    seen, out = set(), []
    for x in (block or '').splitlines():
        x = x.strip()
        if x and x not in seen:
            seen.add(x)
            out.append(x)
    out.sort()
    shown = '\n'.join(f'- `{x}`' for x in out[:limit]) or '_（无）_'
    if len(out) > limit:
        shown += f'\n- _…另有 {len(out) - limit} 条_'
    return shown


def banner(t):
    print('\n' + '=' * 62)
    print(t)
    print('=' * 62)


def main():
    branch, err = git('rev-parse', '--abbrev-ref', 'HEAD')
    if err:
        print('不是 git 仓库：', err)
        return 1
    # 在 main 上是对的：脚本只会从当前分支另开 wip 分支，绝不在原地提交。
    # 唯一的例外要拦：已经站在某个 wip 分支上却想打包另一批 —— 先切回去，免得两个半成品混进一条提交。
    if branch.startswith('wip/') and branch != f'wip/{TODAY}':
        print(f'!! 当前在 {branch} 上。先把要打包的那批回到 main 或对应分支再打包，')
        print('   否则两批没做完的东西会混进同一条提交，接手的人分不清哪段是哪段。')
        return 1

    banner('第 1 步 / 校验：断点卡填了吗')
    head, _ = git('log', '-1', '--format=%h %ad %s', '--date=short')
    staged, _ = git('diff', '--cached', '--name-only')
    unstaged, _ = git('diff', '--name-only')
    untracked, _ = git('ls-files', '--others', '--exclude-standard')
    date_str = datetime.now().strftime('%Y-%m-%d')
    today_files, _ = git('log', '--name-only', '--pretty=format:', f'--since={date_str} 00:00:00')

    if not os.path.exists(HANDOFF):
        banner('!! 找不到 process/HANDOFF.md，拒绝打包。')
        return 2
    text = open(HANDOFF, encoding='utf-8').read()
    keys = [('## 一、我在做什么', '## 二、现在的状态'),
            ('## 二、现在的状态', '## 三、做完了'),
            ('## 三、做完了', '## 四、下一步第一步'),
            ('## 四、下一步第一步', '## 五、卡住的地方')]
    empty = [k[0].split('、')[0] for k in keys
             if not is_filled(sections_body(text, k[0], k[1]))]
    if empty:
        banner('!! 拒绝打包。`process/HANDOFF.md` 的 ' + '、'.join(empty) + ' 节还是空的。')
        print('   git 带得走代码，带不走「你想到哪了」。这几节是接手的人唯一的路标，')
        print('   空着打包 = 把一份干净的仓库送过去，对方照样不知道从哪接着干。')
        print('   填完再跑一次本脚本。')
        return 2
    print('✓ 断点卡四节已填（一 / 二 / 三 / 四）')

    banner('第 2 步 / 抓现场写进第七节')
    table = f"""
- **抓于**：{datetime.now().strftime('%Y-%m-%d %H:%M')}
- **分支**：`{branch}`
- **最近提交**：`{head or '（无历史）'}`
- **已暂存改动**：
{todo(staged)}
- **未暂存改动**（含未提交的中途状态，**这些才是「做了一半」的主体**）：
{todo(unstaged)}
- **未跟踪的新文件**：
{todo(untracked)}
- **今天（{date_str}）动过的文件**：
{todo(today_files)}
"""
    anchor = '## 七、现场快照（脚本生成，别手改）'
    if anchor not in text:
        banner('!! HANDOFF.md 缺少第七节锚点，拒绝继续。')
        return 2
    i = text.index(anchor) + len(anchor)
    rest = text[i:]
    j = rest.find('\n---\n')
    tail = rest[j:] if j >= 0 else ''
    new_text = (text[:i] + '\n\n_由 `python3 scripts/wip-pack.py` 自动写入_\n\n'
                + table.lstrip('\n') + tail)
    if DRY:
        print(table)
    else:
        open(HANDOFF, 'w', encoding='utf-8').write(new_text)
        print('✓ 已刷新第七节快照（第七节之后的内容原样保留）')

    banner('第 3 步 / 选分支并提交')
    if not msg:
        print('!! 没给 `-m` 描述。打包的是半成品，半年后你得靠这行字认出它。')
        print('   例如：python3 scripts/wip-pack.py -m "视觉升级：悬浮胶囊导航+背景氛围"')
        return 2
    wip = f'wip/{TODAY}'
    if DRY:
        print(f'[dry-run] 将切换/创建分支 {wip}，commit 信息：{msg}')
        print(f'[dry-run] 将 push 到 origin/{wip}')
        return 0

    existing, _ = git('rev-parse', '--verify', f'refs/heads/{wip}')
    if existing is None:
        out, err = git('checkout', '-b', wip)
        print('✓ 新建分支 ' + wip if out else '!! 建分支失败：' + err)
    else:
        out, err = git('checkout', wip)
        print('✓ 复用已有分支 ' + wip if out else '!! 切分支失败：' + err)
        git('pull', '--rebase', 'origin', wip)

    files = todo(unstaged) + todo(untracked) + todo(staged)
    print('  本次将入库的文件（' + str(len([l for l in files.splitlines() if l.strip() not in ('- `_（无）_`',)])) + ' 处改动）：')
    for l in files.splitlines()[:12]:
        print('   ', l)
    if len(files.splitlines()) > 12:
        print('    …另有若干')

    out, err = git('add', '-A')
    if out is None:
        print('!! git add 失败：' + err)
        return 1
    out, err = git('commit', '-m', f'wip: {msg}')
    print('✓ 已提交：' + (err if out is None else out.splitlines()[-1]))

    if NO_PUSH:
        banner('已生成，未推送。确认无误后手动：git push -u origin ' + wip)
        return 0

    banner('第 4 步 / 推送到远端')
    out, err = git('push', '-u', 'origin', wip)
    if out is None:
        banner('!! push 失败。按顺序排查（完整表见 process/MIGRATION.md 第三节）：')
        print('   1) git config --global --get http.version       期望 HTTP/1.1')
        print('   2) git config --global --get http.userAgent      期望 curl/8.x')
        print('   3) 代理挂了会报 Empty reply from server：')
        print('      env -u HTTPS_PROXY -u https_proxy -u HTTP_PROXY -u http_proxy git push')
        print('   4) 两条 curl 都返回 000 → 周期性网络故障，等几分钟重试，别动配置')
        print('   5) 仍不通：把本地 commit 留在本地，换机器后再推（代码不丢，只是没送出去）')
        print('   本地分支 ' + wip + ' 已留存，失败不影响。')
        return 1
    print('✓ 已推送：' + wip)

    banner('打包完成 · 新机器上怎么接着干')
    print('```bash')
    print(f'git clone <仓库地址> && cd $(basename $(pwd))')
    print(f'git checkout {wip}          # wip 分支不在默认分支上，要手动切')
    print(f'git branch -a               # 确认它真的带过来了')
    print('git reset --soft HEAD~1     # 拆回工作区接着改，一个不丢')
    print('```')
    print()
    print('然后对新机器上的 AI 说这段（原文见 process/MIGRATION.md 〇节）：')
    print('  「我换了台电脑，继续开发 linqiongni_profile。仓库已 clone 到')
    print('   当前路径。当前有一个做了一半的东西，状态在 process/HANDOFF.md，')
    print('   先读它，再按 HANDOFF 第四节的下一步第一步接着干。」')
    return 0


if __name__ == '__main__':
    sys.exit(main())
