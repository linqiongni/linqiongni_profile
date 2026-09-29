---
name: sub-site-style-align
description: 把 linqiongni_profile 个人站里某个子站（public/<slug>/）的字体、颜色、版式对齐到基准站 commercial-ops 的风格。当用户说「这个站和 XX 风格不一致 / 字体颜色对齐 / 次级文字发蓝 / 改成和某张截图一样」时使用。含已核实根因、基准口径、可直接跑的脚本与验收清单。
agent_created: true
---

# 子站风格对齐（基准 = 商业运营法务 commercial-ops）

## 何时用
- 用户拿两张截图说「把第二个改成第一个的风格/字体/颜色」。
- 说「次级文字发蓝」「标题不够大」「正文怎么是宋体」「金色撒太多」。
- 新增子站后要统一到全站口径。

## 一、先搞清楚基准（不要凭印象）
```bash
sed -n '/:root/,/}/p' public/commercial-ops/assets/style.css      # 字体三件套 + 色 token
awk '/html\[data-theme="dark"\]/{f=1} f{print} f&&/^}/{exit}' public/commercial-ops/assets/style.css
```
必要的话用 `agent-browser` 打开主站 → 点分组 → 点 tab → 给 iframe 换 `src='/<slug>/index.html?nc='+Date.now()` 强刷，
再 `getComputedStyle` 量 body/h1/.subtitle 的真实值（**截图可能是缓存页，别拿旧图当现状**）。

## 二、根因：次级文字「发蓝」不是颜色值错，是变量名错
`scripts/theme-kit/dark_unify.navy.txt` 只覆盖**无横杠**的
`--ink2 / --tx2 / --txt2 / --muted / --sub` → 蓝灰 `#93A6BC`；
**带横杠的 `--ink-2 / --ink-3` 它不碰**，所以基准站能保持暖灰 `#C3BDB1`。

> 对齐动作 = 全站把 `var(--ink2) var(--ink3) var(--tx2) var(--tx3) var(--txt2) var(--txt3)`
> 换成 `var(--ink-2) / var(--ink-3)`，并在 `:root`（暖棕 `#5A5449 / #8A8275`）
> 与 `html[data-theme="dark"]`（暖灰 `#C3BDB1 / #8F8A80`）里补定义。

**别去改 navy kit 的色值** —— 暗态全站统一深海蓝是刻意设计，改了别的站会跟着错位。

## 三、基准口径（照抄，别自己发明）
| 项 | 值 |
|---|---|
| body | `--sans`（`-apple-system,"PingFang SC",…`）15.5px / 1.78 |
| `--serif` | `"Songti SC","STSong","Noto Serif SC",Georgia,serif`（Songti 必须在前） |
| h1 | serif 34px / 700 / letter-spacing .01em |
| h2 | serif 23px |
| h3 | serif 17px / 650，颜色 `--ink`（**原来很多站误用金色**） |
| h4 | 15px `--ink-2`（去金） |
| kicker | 12.5px / .22em / `--gold-deep` |
| 亮态墨色 | `--ink #23201B` / `--ink-2 #5A5449` / `--ink-3 #8A8275` |
| 金 | `#B89F6B` + `--gold-deep #8C7443` |
| 语义色 | 红 `#A8342F` / 绿 `#3F6B4E` / 蓝 `#2F5578` |

## 四、执行（脚本已固化，改 SITES 即可）
```bash
cd /Users/linqiongni/Downloads/linqiongni_profile
python3 scripts/align-subsite-style.py     # 改令牌 + 版式（含 labor 的内联 <style>）
python3 scripts/check-subsite-style.py     # 验收：花括号平衡 / 缺分号 / 关键规则 / 旧变量残留
python3 scripts/apply-theme-kit.py --fix public && python3 scripts/apply-theme-kit.py --check public
```
脚本顶部 `SITES` / `CSS` 两个 dict 指定要改的站与各自的 CSS 路径；
`INLINE_TYPO` 放「版式写在 HTML 内联 `<style>` 里」的站（目前是 labor）。

## 五、必知的坑（都实踩过，靠「回滚 + 重跑」解决）
1. **改前先查规则落在哪个文件**：labor 的 body/h1 在 HTML 内联 `<style>`（`assets/layout.css` 里根本没有）；
   insurance 标题写成 `.content h1/h2/h3`。默认「都在 style.css」会白改。
2. **用正则追加 CSS 属性时，原块最后一条声明常常不带分号** → 新属性黏上去变成
   `border-bottom:1px solid var(--line) font-family: var(--serif)`，整条规则静默失效。
   追加前先 `if not body.endswith(';'): body += ';'`，且**绝不能追加 `}`**（`set_decl` 只拿到花括号内内容）。
3. **验收必须机器扫描**：花括号 `{` `}` 计数相等 + 正则扫「值后面紧跟下一个属性名」的缺分号。
   只看「改动 N 个文件」会漏掉上面这类语法级损坏。
4. 改坏了就 `git checkout -- public/<slug>` 回滚重跑，别手工补。
5. **只改 `public/`** —— 中文源目录保持纯净，补丁由 `apply-theme-kit.py` 打（见项目 MEMORY）。

## 六、验收
- 脚本检查全绿 + `apply-theme-kit --check` 通过（254 页）。
- 浏览器逐站测量：body `-apple-system / 15.5px / rgb(244,239,228)`，
  h1 `Songti SC / 34px`，`.subtitle`（或 `.sub`）`rgb(195,189,177)`。
- 截图与基准图并排给用户看；提醒强刷（Cmd+Shift+R）。
- 提交前确认是否推 main —— 本仓库 commit hook 会自动 push 并触发 CI 发布。
