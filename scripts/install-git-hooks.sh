#!/usr/bin/env bash
# install-git-hooks.sh —— 给当前仓库装上「自动同步线」：开工自动拉、提交自动推
#
# 用法（每个仓库、每台电脑，clone 之后跑一次就永久生效）：
#     bash scripts/install-git-hooks.sh
#     bash scripts/install-git-hooks.sh /path/to/another/repo
#
# 幂等：重复执行会覆盖旧的 hook，日志与状态文件保留。
# 卸载：bash scripts/install-git-hooks.sh --uninstall

set -uo pipefail

RED=$'\033[0;31m'; YEL=$'\033[0;33m'; GRN=$'\033[0;32m'; RST=$'\033[0m'
say(){ printf '%s\n' "$*"; }
warn(){ printf '%s⚠  %s%s\n' "$YEL" "$*" "$RST" >&2; }

case "${1:-}" in
  -h|--help)
    sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'
    exit 0 ;;
  --uninstall) UNINSTALL=1 ;;
esac

if [ -n "${UNINSTALL:-}" ]; then
  GD_UI="$(git rev-parse --git-dir 2>/dev/null)" || { warn "当前目录不是一个 git 仓库"; exit 1; }
  rm -f "$GD_UI/hooks/git-autosync.sh" \
        "$GD_UI/hooks/pre-commit" "$GD_UI/hooks/post-commit" \
        "$GD_UI/hooks/pre-push" "$GD_UI/hooks/post-checkout"
  say "${GRN}已卸载自动同步 hook（${PWD}）${RST}"
  exit 0
fi

TARGET="${1:-.}"
cd "$TARGET" 2>/dev/null || { warn "进不去目录：$TARGET"; exit 1; }
REPO="$(git rev-parse --show-toplevel 2>/dev/null)" || { warn "$TARGET 不是一个 git 仓库"; exit 1; }
cd "$REPO"
GD="$(git rev-parse --git-dir)"
HOOKS="$GD/hooks"
mkdir -p "$HOOKS"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
REMOTE_COUNT="$(git remote | wc -l | tr -d ' ')"
# 本安装器（含旧版本）生成过的全部 hook 名
KNOWN_HOOKS="post-checkout post-commit pre-push pre-commit"

CORE="$HOOKS/git-autosync.sh"

[ "$REMOTE_COUNT" -ge 1 ] || warn "这个仓库还没有 remote，hook 会装上但 pull/push 会静默跳过。"

# ---------------------------------------------------------------------------
# 1) 中央逻辑
#    时序是就这么定的，别随手挪：所有会动状态的动作，一律在「改动已经固化成
#    提交之后」执行。pre-commit 阶段改动还挂在 index 上，此时 pull --rebase
#    会把正在提交的这批改动搅散（实测：提交被吞、改动掉回工作区）。
# ---------------------------------------------------------------------------
cat > "$CORE" <<'CORE_EOF'
#!/usr/bin/env bash
# git-autosync —— 由 post-checkout / post-commit / pre-push 调用，别直接手跑。
#   · 开工时（post-checkout）把线上最新拉下来
#   · 提交后（post-commit）rebase 到最新并推上去
#   · 推送前（pre-push）兜底再拉一次
#   · 主远端推成后再推镜像远端（autosync.extraremote，例如 Gitee）
# 递归守卫：hook 自己触发的动作带 AUTO_SYNC=1，遇到就跳过。

GD="$(git rev-parse --git-dir)"
LOG="$GD/autosync.log"
say(){ printf '%s\n' "$*"; }
warn(){ printf '⚠  %s\n' "$*" >&2; }
log(){ printf '[%s] %s\n' "$(date '+%F %T')" "$*" >> "$LOG"; }

# 空仓库（一次提交都还没有）时什么都别做，直接放行
git rev-parse --verify -q HEAD >/dev/null 2>&1 || { log "仓库还没有任何提交，跳过 autosync"; exit 0; }

# 完整性自检：hook 在、core 不在，说明装到一半或被删过。
# 注意别指望「clone 下来会提醒你装」——clone 不跑任何第三方脚本，
# 没装就是没装，安静得跟生效了一样。能说的话只有下面这段。
if [ ! -f "$GD/hooks/git-autosync.sh" ]; then
  log "自动同步不完整（core 缺失）"
  warn "自动同步装得不完全：.git/hooks/ 里有入口，但没有核心脚本。"
  warn "重跑一次即可：bash scripts/setup-device.sh"
  exit 0
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
UPSTREAM="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
REMOTE="${UPSTREAM%%/*}"
MODE="${1:-commit}"

# hook 自己触发的动作（例如 post-commit 触发的 push）不重复 pull/push
[ -n "${AUTO_SYNC:-}" ] && { log "跳过（递归守卫，${MODE}）"; exit 0; }

has_upstream(){ [ -n "$UPSTREAM" ]; }
worktree_clean(){ git diff --quiet && git diff --cached --quiet; }

# macOS 没有 GNU timeout，命令不存在会让整条探测静默失败（踩过：被误判成空远端）
if command -v timeout >/dev/null 2>&1; then T12=(timeout 12); else T12=(); fi

# 远端一次都没推过 → refs 还没建起来，pull 必然失败，得单独放行
remote_empty(){ [ -z "$("${T12[@]}" git ls-remote --heads "$REMOTE" 2>/dev/null)" ]; }
# 连通性探测，避免把「网络抽风」当成「有冲突」来吓人。
# 注意别写 `ls-remote --heads <remote> HEAD` —— HEAD 是符号引用，不匹配
# refs/heads/*，会永远返回「ref 不存在」，把可达的远端误判成不可达。
remote_ok(){ "${T12[@]}" git ls-remote --heads "$REMOTE" "$BRANCH" >/dev/null 2>&1; }

# 把线上最新拉下来；flag 为空表示工作区干净、不需要 autostash
do_pull(){
  has_upstream || { log "跳过 pull（无上游）"; return 0; }
  remote_empty && { log "远端还是空仓库，跳过 pull"; return 0; }
  if remote_ok; then :; else
    log "首次探测失败（很可能是网络/代理），重试一次"
    sleep 3
    remote_ok || {
      log "远端不可达，放弃 pull"
      warn "拉不到远端（多半是网络问题）。修好网络后手动执行：git pull"
      return 1
    }
  fi
  local flag="--autostash" out rc=0
  worktree_clean && flag=""
  out="$(git pull --rebase --no-recurse-submodules $flag 2>&1)" || rc=$?
  log "pull 退出码 ${rc}：$(printf '%s' "$out" | head -6)"
  if [ "$rc" -ne 0 ]; then
    log "pull 失败：$(printf '%s' "$out" | head -6)"
    printf '%s\n' "$out"
    warn "rebase 停在一处冲突上 —— **改动没有丢**，冲突标记就写在下面的文件里。"
    warn "按这四步继续（注意是 rebase --continue，不是重新 commit）："
    warn "  1) 打开冲突文件，删掉 <<<<<<< / ======= / >>>>>>> 三行，留下要保留的内容"
    warn "  2) git add <那个文件>"
    warn "  3) git rebase --continue          ← 你的提交会在这时回到 git log"
    warn "     （若它打开了一个编辑器界面，直接保存退出即可）"
    warn "  4) 之后再 git commit 才会自动推（或手动 git push）"
    warn "想放弃这些改动回到原样：git rebase --abort"
    return 1
  fi
  log "pull ok（${BRANCH}）"
  return 0
}

do_push(){
  if [ "${AUTOSYNC_PUSH:-1}" = "0" ]; then
    log "跳过自动 push（AUTOSYNC_PUSH=0）"
    return 0
  fi
  has_upstream || { log "跳过 push（无上游）"; return 0; }
  if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    warn "正在推 $BRANCH —— 这个仓库的 CI 会把它发布上线"
    warn "    做了一半的东西先 git checkout -b wip/$(date +%Y%m%d) 再提交，别推 main。"
  fi
  local out rc=0
  PUSHED=0   # 给 do_mirror_push 判断用：主远端到底推没推成功
  out="$(AUTO_SYNC=1 git push 2>&1)" || rc=$?
  if [ "$rc" -ne 0 ]; then
    # 判据来自 MIGRATION 第三节：走代理 000 且绕过代理 200 = 本地代理挂了（git 的 CONNECT 回 502，curl 却通）
    if [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 8 https://github.com)" = "000" ] && \
       [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 8 --noproxy '*' https://github.com)" = "200" ]; then
      log "本地代理看着挂了（走代理不通、绕过代理通），绕开代理自动重试一次"
      out="$(AUTO_SYNC=1 env -u HTTPS_PROXY -u https_proxy -u HTTP_PROXY -u http_proxy git push 2>&1)" || rc=$?
    fi
  fi
  if [ "$rc" -ne 0 ]; then
    log "push 失败：$(printf '%s' "$out" | head -6)"
    printf '%s\n' "$out"
    # 两边 curl 都 000 = 真的断网，不是代理问题：要说清楚，别写成笼统的「push 失败」
    if [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 8 https://github.com)" = "000" ] && \
       [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 8 --noproxy '*' https://github.com)" = "000" ]; then
      warn "本机网络看着不通（走代理和绕开代理都拿不到 200）——是断网，不是代理配置问题"
      warn "本次没验成：改动还在本地（没丢），等网络恢复再 git push"
    fi
    warn "push 失败，改动还在本地，没丢。手动执行：git push"
    # 实测过的解：本地代理挂了时 curl 能通、git 的 CONNECT 却回 502
    if echo "$out" | grep -q "CONNECT tunnel failed\|Could not connect to server"; then
      warn "看着像本地代理的问题（curl 通、git 不通）。绕开代理再试："
      warn "  env -u HTTPS_PROXY -u https_proxy -u HTTP_PROXY -u http_proxy git push"
    fi
    return 1
  fi
  PUSHED=1
  log "push ok（${BRANCH}）"
  return 0
}

# 主远端推成之后的「镜像推送」（例如 Gitee 当备份）。
# 用显式 refspec 而不是 git push <remote>，因为镜像远端通常没有 upstream。
do_mirror_push(){
  local extra rc=0 out
  extra="${AUTOSYNC_EXTRA_REMOTE:-$(git config --get autosync.extraremote 2>/dev/null || true)}"
  [ -n "$extra" ] || return 0
  [ "$extra" = "$REMOTE" ] && { log "跳过镜像 push（$extra 就是主远端）"; return 0; }
  git remote get-url "$extra" >/dev/null 2>&1 || {
    log "跳过镜像 push（远端 $extra 不存在）"; return 0; }
  # Gitee 那类国内远端常常不吃代理，所以第一次就绕开环境变量试，失败再走默认。
  # 行续行这里只能写一个反斜杠：外面是 quoted heredoc，写两个会被 bash 缩成一个字面\，
  # 结果变成 env 拿到参数「\」报错（实测：env: \: No such file or directory）。
  out="$(AUTO_SYNC=1 env -u HTTPS_PROXY -u https_proxy -u HTTP_PROXY -u http_proxy \
             git push "$extra" "HEAD:refs/heads/$BRANCH" 2>&1)" || rc=$?
  if [ "$rc" -ne 0 ]; then
    out="$(AUTO_SYNC=1 git push "$extra" "HEAD:refs/heads/$BRANCH" 2>&1)" || rc=$?
  fi
  if [ "$rc" -ne 0 ]; then
    log "镜像 push 失败（$extra）：$(printf '%s' "$out" | head -4)"
    printf '%s\n' "$out" | head -6
    # 主远端成、镜像挂 = 最危险的部分成功，必须比普通失败说得更狠
    if [ "${PUSHED:-0}" = "1" ]; then
      warn "主远端推成功了，但「$extra」没推上去 —— 现在只有主远端有这批提交。"
    else
      warn "「$extra」没推上去（主远端这次也没推）。"
    fi
    warn "改动没丢，手动补一条即可：git push $extra $BRANCH"
    if printf '%s' "$out" | grep -qE "repository not found|does not appear to exist|404"; then
      warn "看着像 Gitee 上那个仓库还没建（或名字对不上）："
      warn "  git remote set-url $extra https://gitee.com/<你的用户名>/<仓库名>.git"
    fi
    return 1
  fi
  log "镜像 push ok（$extra）"
  return 0
}

case "$MODE" in
  # 开工 / 切换分支 / 克隆之后：工作区若干净就真拉，否则只提醒
  checkout)
    worktree_clean || { log "工作区有未提交改动，只提醒不拉"; warn "开工前有未提交的改动，建议先提交或暂存。等会 push 前会自动拉。"; exit 0; }
    do_pull ;;
  # 提交之后：改动已固化，此时 rebase + push 是安全的
  commit)
    do_pull || { warn "这次没自动推送，先解决拉取冲突再手动 git push"; exit 0; }
    # 主远端成、镜像挂要单独报（do_mirror_push 内部 warn），别混进「push ok」里
    do_push && do_mirror_push ;;
  push) do_pull ;;
  *) do_pull ;;
esac
exit 0
CORE_EOF

chmod +x "$CORE"

# ---------------------------------------------------------------------------
# 2) hook 入口
# ---------------------------------------------------------------------------
write_hook(){
  local name="$1" mode="$2"
  cat > "$HOOKS/$name" <<EOF
#!/usr/bin/env bash
# 自动同步 hook（由 scripts/install-git-hooks.sh 生成，要改请改安装器）
export AUTO_SYNC="\$AUTO_SYNC"
exec "\$(dirname "\$0")/git-autosync.sh" "$mode"
EOF
  chmod +x "$HOOKS/$name"
}

# 先扫掉本安装器（含旧版本）生成过的 hook，否则旧产物会和新 core 打架。
# 踩过：第一版装的 pre-commit 留着不动，它调的是被覆盖后的新 core，
# 结果在「改动还挂在 index 上」的阶段执行了 pull —— 正是会吞提交的位置。
for h in $KNOWN_HOOKS; do
  [ -e "$HOOKS/$h" ] && rm -f "$HOOKS/$h" && say "  清理旧 hook：$h"
done

write_hook post-checkout checkout
write_hook post-commit   commit
write_hook pre-push      push

# ---------------------------------------------------------------------------
say "${GRN}✓ 已装好自动同步 hook${RST}"
say "  仓库：$REPO"
say "  当前分支：$BRANCH"
say "  日志：$GD/autosync.log"
say ""
say "  它会做什么："
say "    · 进入仓库 / 切换分支时  → 自动把线上最新拉下来"
say "    · 提交之后                 → 先 rebase 到最新，再自动推上去"
say "    · 推送之前                 → 兜底再拉一次，避免被拒"
say "    · 推 main 时               → 先警告一次（这个仓库推 main 等于发布上线）"
say ""
say "  不想要自动推：export AUTOSYNC_PUSH=0 后重跑本安装器（手动 push 照常）"
say ""
say "  多推一个镜像远端（例如 Gitee 当备份，私有也行）："
say "    git remote add gitee https://gitee.com/<用户名>/<仓库名>.git"
say "    git config autosync.extraremote gitee"
say "    之后每次 commit 会依次推 GitHub + Gitee；只推一个时删掉那行 config 即可。"
say ""
say "  彻底卸载：      bash scripts/install-git-hooks.sh --uninstall"
