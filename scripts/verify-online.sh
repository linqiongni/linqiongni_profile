#!/usr/bin/env bash
# 验线上 —— 一条命令替代 workflows.md 第三节那三步 curl
#
# 用法：
#   bash scripts/verify-online.sh <slug>                 查 https://linqiongni.top/<slug>/index.html 是否可达
#   bash scripts/verify-online.sh <slug> "关键文本"       再查线上 HTML/bundle 里是否真有这句话
#   bash scripts/verify-online.sh <slug> "文本" --wait 120    GH Pages 有 10 分钟缓存，等它刷出来
#   bash scripts/verify-online.sh https://.../x.html      直接给完整 URL
#   bash scripts/verify-online.sh --push                  只核对本地 HEAD 与 origin/main（验推送）
#
# 退出码：全通过 0；任何一项不过 1。想把它串进别的命令就靠这个。

set -uo pipefail

SITE="https://linqiongni.top"
TARGET=""
NEEDLE=""
WAIT=0
ONLY_PUSH=0

while [ $# -gt 0 ]; do
  case "$1" in
    --wait|-w) WAIT="${2:-0}"; shift 2 ;;
    --push|-p) ONLY_PUSH=1; shift ;;
    -h|--help) sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *)
      if [ -z "$TARGET" ]; then TARGET="$1"; else NEEDLE="$1"; fi
      shift
      ;;
  esac
done

if [ "$ONLY_PUSH" -eq 1 ]; then
  a=$(git rev-parse --short HEAD 2>/dev/null)
  b=$(git rev-parse --short origin/main 2>/dev/null)
  if [ -n "$a" ] && [ "$a" = "$b" ]; then
    echo "推送：PASS  (本地 $a = 线上 $a)"
  else
    echo "推送：FAIL  (本地 $a / 线上 $b) —— hook 的自动 push 可能静默失败了，见 MIGRATION.md 第三节"
  fi
  [ "$a" = "$b" ] && exit 0 || exit 1
fi

if [ -z "$TARGET" ]; then
  echo "用法：bash scripts/verify-online.sh <slug|完整URL> [\"关键文本\"] [--wait 秒] [--push]"
  exit 1
fi

# --- curl 双层：先走系统代理，不通就绕开（本地代理挂过，见 MIGRATION.md 第三节）---
http_code() {
  local url="$1" c
  c=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$url" 2>/dev/null)
  if [ "$c" != "200" ] && [ "$c" != "304" ]; then
    c=$(curl -s -o /dev/null -w "%{http_code}" --noproxy '*' --max-time 20 "$url" 2>/dev/null)
  fi
  printf '%s' "$c"
}

fetch() {
  local url="$1" body
  body=$(curl -s --max-time 25 "$url" 2>/dev/null)
  if [ -z "$body" ]; then
    body=$(curl -s --noproxy '*' --max-time 25 "$url" 2>/dev/null)
  fi
  printf '%s' "$body"
}

# 首页引用的第一个 js bundle
bundle_of() {
  fetch "$SITE/" | grep -o '/assets/[^"]*\.js' | head -1
}

# --- 组装目标 URL ---
if [ "${TARGET#http}" = "$TARGET" ]; then
  if [ "$TARGET" = "/" ] || [ -z "$TARGET" ]; then
    URL="$SITE/index.html"; SLUG=""
  else
    URL="$SITE/${TARGET%/}/index.html"; SLUG="${TARGET%/}"
  fi
else
  URL="$TARGET"
  SLUG=""
  case "$URL" in
    "$SITE"/?*/index.html) SLUG="${URL#"$SITE"/}"; SLUG="${SLUG%/index.html}" ;;
  esac
fi

# --- 等待 GH Pages 刷新 ---
MAXTRY=1
if [ "$WAIT" -gt 0 ] 2>/dev/null; then MAXTRY=$(( WAIT / 5 + 1 )); fi

echo "目标：$URL"
probe=$(fetch "$SITE/" | head -c 200)
if [ -z "$probe" ]; then
  echo "线上不可达（本地网络或代理问题）——本次没验成，别当回事也别当成已生效。"
  exit 1
fi
echo "等线上刷新中……（GH Pages 有 10 分钟缓存，最多等 ${WAIT}s）"
code=""
i=0
while [ $i -lt "$MAXTRY" ]; do
  code=$(http_code "$URL")
  if [ "$code" = "200" ] || [ "$code" = "304" ]; then break; fi
  i=$(( i + 1 ))
  [ $i -lt "$MAXTRY" ] && sleep 5
done

ok=0
if [ "$code" = "200" ] || [ "$code" = "304" ]; then
  echo "可达：PASS  (HTTP $code)"
else
  echo "可达：FAIL  (HTTP $code)"
  ok=1
fi

# --- 文本核查：命中才算真生效，只 grep 字符串会误判 ---
if [ -n "$NEEDLE" ]; then
  found="no"
  page=$(fetch "$URL")
  printf '%s' "$page" | grep -qF -- "$NEEDLE" && found="yes"
  if [ "$found" = "no" ] && [ -n "$SLUG" ]; then
    BD=$(bundle_of)
    if [ -n "$BD" ]; then
      printf '%s' "$(fetch "$SITE$BD")" | grep -qF -- "$NEEDLE" && found="yes"
    fi
  fi
  if [ "$found" = "yes" ]; then
    echo "内容：PASS  (线上能查到「${NEEDLE}」)"
  else
    echo "内容：FAIL  (线上查不到「${NEEDLE}」—— 要么没推上去，要么还在 GH Pages 缓存里，加 --wait 再试)"
    ok=1
  fi
fi

# --- 顺带验推送 ---
a=$(git rev-parse --short HEAD 2>/dev/null)
b=$(git rev-parse --short origin/main 2>/dev/null)
if [ -n "$a" ] && [ -n "$b" ] && [ "$a" != "$b" ]; then
  echo "提醒：本地 $a ≠ 线上 $b —— 推送没成功，别当成已发布"
  ok=1
fi

if [ "$ok" -eq 0 ]; then
  echo "结果：线上已生效。"
else
  echo "结果：线上没验过。别汇报「已上线」。"
fi
exit "$ok"
