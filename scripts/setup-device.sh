#!/usr/bin/env bash
# setup-device.sh —— 新设备的一条命令：装上自动同步，并当场自检。
#
# 用法（在仓库根目录）：
#     bash scripts/setup-device.sh            装 + 自检
#     bash scripts/setup-device.sh --uninstall 卸掉
#
# 为什么要它：装 hook 是一次性动作，不装就永远不装。这个脚本把「装 → 验证 →
# 告诉下一步该读什么」压成一条命令，新设备上不会漏。

set -uo pipefail

RED=$'\033[0;31m'; GRN=$'\033[0;32m'; RST=$'\033[0m'
say(){ printf '%s\n' "$*"; }
fail(){ printf '%s✗  %s%s\n' "$RED" "$*" "$RST" >&2; }

case "${1:-}" in
  -h|--help) sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
esac

SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SELF_DIR/.." 2>/dev/null || { fail "进不去仓库根目录"; exit 1; }

say "· 先卸掉旧的，再按当前版本重装"
if bash "$SELF_DIR/install-git-hooks.sh" --uninstall >/dev/null 2>&1; then :; fi

REPO="$(git rev-parse --show-toplevel 2>/dev/null)" || { fail "当前目录不是一个 git 仓库"; exit 1; }
cd "$REPO"
GD="$(git rev-parse --git-dir)"

if [ "${1:-}" = "--uninstall" ]; then
  bash "$SELF_DIR/install-git-hooks.sh" --uninstall
  exit $?
fi

if bash "$SELF_DIR/install-git-hooks.sh" >/dev/null 2>&1; then :; else
  bash "$SELF_DIR/install-git-hooks.sh"; fail "安装器执行失败，上面是它的报错"; exit 1
fi

say ""
say "${GRN}✓ 自动同步已装到本设备${RST}"
say "  仓库：$REPO"

# ---- 技能接管：仓库 skills/ 是真源，软链进 ~/.workbuddy/skills -----------------
# 为什么：本仓库专属技能（透明底/鱼影 bug、当前页打开、子站同步发布…）写在仓库里才能跟着 git 走。
# 只写在本机 ~/.workbuddy/skills/ 的话，它不进 git，换台电脑就是「什么都不懂」的状态。
# 所以一律改仓库那份，本机目录换成指向它的软链。
say ""
say "· 接管仓库自带的技能"
SKILLS_HOME="$HOME/.workbuddy/skills"
mkdir -p "$SKILLS_HOME"
sk=1
shopt -s nullglob
for SRC in "$REPO"/skills/*/SKILL.md; do
  NAME="$(basename "$(dirname "$SRC")")"
  DST="$SKILLS_HOME/${NAME}"
  if [ -L "$DST" ]; then
    CUR="$(readlink "$DST")"
    if [ "$CUR" = "$REPO/skills/${NAME}" ]; then say "  ✓ ${NAME}（软链已正确）"; continue; fi
    rm "$DST" && ln -s "$REPO/skills/${NAME}" "$DST" && say "  → ${NAME}（旧软链已指向新仓库）"
  elif [ -d "$DST" ]; then
    fail "  ✗ ${NAME}：本机已有一份实体目录，且内容可能与仓库不同。"
    say "     先把本机那份有用的改动并入仓库 skills/${NAME}，再删目录重跑本脚本。"
    say "     本机目录：$DST"
    sk=0
  else
    ln -s "$REPO/skills/${NAME}" "$DST" && say "  + ${NAME}（已软链）"
  fi
done
shopt -u nullglob
if [ "$sk" -eq 0 ]; then fail "有技能没接管成功，重跑本脚本确认全绿"; fi

# ---- 自检：装了 ≠ 生效。逐项验，别只信安装器说"装好了" -------------------
say ""
say "· 自检"
CORE="$GD/hooks/git-autosync.sh"
NAME="$(basename "$GD")"
ok=1
chk(){ # chk "说明" 命令…
  if eval "$2" >/dev/null 2>&1; then say "  ✓ $1"; else fail "  ✗ $1"; ok=0; fi
}
chk "入口 hook 已生成：${NAME}"        'test -f "$GD/hooks/post-commit"'
chk "hook 可执行"                      '[ -x "$GD/hooks/post-commit" ]'
chk "核心脚本可执行"                   '[ -x "$CORE" ]'
chk "核心脚本语法没问题"               'bash -n "$CORE"'
chk "有 remote（没有它自动同步会静默跳过）" '[ "$(git remote | wc -l | tr -d " ")" -ge 1 ]'
chk "当前分支有上游"                   'git rev-parse --abbrev-ref --symbolic-full-name "@{u}"'

if [ "$ok" -eq 1 ]; then
  say ""
  say "  生效方式：进这个目录就自动拉最新；写完 git commit 就自动推（不用 push）。"
  say "  出问题先看日志：${GD}/autosync.log"
else
  say ""
  fail "有项目没通过。上面的 ✗ 是哪一项，照着修再重跑本脚本。"
  exit 1
fi

# ---- 下一步 ---------------------------------------------------------------
say ""
say "· 这个仓库接下来怎么用"
say "  开工：直接进目录即可（自动拉最新），不用想别的"
say "  收工：一句 git commit，push 它自己做"
say "  想确认真的通了：改一行文件 → git commit → 看有没有输出「push ok」"
