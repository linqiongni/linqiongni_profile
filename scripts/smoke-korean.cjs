// DOM 冒烟：node scripts/smoke-korean.cjs
// 用 jsdom 渲染 index.html，逐单元断言板块 / 音频 / 目录 / 不出现记录框。
process.env.NODE_PATH = 'C:/Users/lin.qiong.ni/.workbuddy/binaries/node/workspace/node_modules';
require('module')._initPaths();
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dir = path.join(__dirname, '../public/korean');
let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
// jsdom 默认不跑外链脚本，直接内联注入
html = html
  .replace(/<script src="assets\/data\.js[^"]*"><\/script>/, '<script>' + fs.readFileSync(path.join(dir, 'assets/data.js'), 'utf8') + '</script>')
  .replace(/<script src="assets\/app\.js[^"]*"><\/script>/, '<script>' + fs.readFileSync(path.join(dir, 'assets/app.js'), 'utf8') + '</script>');

let bad = 0;
const fail = (m) => { console.log('✗', m); bad++; };

function open(hash) {
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://x/korean/index.html' + (hash || '') });
  dom.window.matchMedia = dom.window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));
  return dom;
}

// jsdom 的 DOMContentLoaded 在构造之后才派发，等一拍再断言
const tick = () => new Promise((r) => setTimeout(r, 30));

(async () => {
// 1) 首页
{
  const dom = open('');
  await tick();
  const d = dom.window.document;
  const cells = d.querySelectorAll('.home-grid .cell');
  if (!cells.length) fail('首页没有单元卡');
  const badges = d.querySelectorAll('.home-grid .cell .badge');
  console.log('首页单元卡', cells.length, '· 原文标记', badges.length);
  if (badges.length !== 8) fail('首页「原文」标记应为 8 个，实际 ' + badges.length);
}

// 2) 每个已并入单元
const checks = {
  8: { tag: '1-8', blocks: ['句子'], rows: 5 },
  9: { tag: '1-9', blocks: ['句子'], rows: 5 },
  11: { tag: '2-1', blocks: ['句子', '小故事'], rows: 21 },
  12: { tag: '2-2', blocks: ['句子'], rows: 5 },
  13: { tag: '2-3', blocks: ['句子', '小故事', '笔记'], rows: 42 },
  14: { tag: '2-4', blocks: ['句子', '笔记'], rows: 22 },
  15: { tag: '2-5', blocks: ['句子', '小故事', '笔记'], rows: 39 },
  16: { tag: '2-6', blocks: ['小故事', '笔记'], rows: 68 },
};
for (const no of Object.keys(checks)) {
  const want = checks[no];
  const dom = open('#u' + no);
  await tick();
  const d = dom.window.document;
  const art = d.querySelector('.article');
  const txt = art.textContent;
  const blks = [...d.querySelectorAll('.blk')];
  const h2 = blks.map((b) => b.querySelector('h2').getAttribute('data-toc'));
  const rows = d.querySelectorAll('.ex.sentbox .row2').length;
  const auds = [...d.querySelectorAll('.blk .audio audio')].map((a) => decodeURI(a.getAttribute('src')));
  const loopBtns = d.querySelectorAll('.blk .audio .loop-btn').length;
  const toc = [...d.querySelectorAll('#toc a')].map((a) => a.textContent);

  console.log(no, '·', want.tag, '· 板块', h2.join('/'), '· 行', rows, '· 目录', toc.join('/'));
  if (h2.join('/') !== want.blocks.join('/')) fail('单元 ' + no + ' 板块不对：' + h2.join('/'));
  if (!txt.includes(want.tag)) fail('单元 ' + no + ' 页头缺少标号 ' + want.tag);
  if (rows !== want.rows) fail('单元 ' + no + ' 行数 ' + rows + ' ≠ ' + want.rows);
  if (toc.join('/') !== want.blocks.join('/')) fail('单元 ' + no + ' 右侧目录不对：' + toc.join('/'));
  auds.forEach((s) => {
    if (!fs.existsSync(path.join(dir, s))) fail('单元 ' + no + ' 音频 404：' + s);
  });
  if (auds.length !== want.blocks.length) fail('单元 ' + no + ' 音频数 ' + auds.length + ' ≠ 板块数');
  if (loopBtns !== want.blocks.length) fail('单元 ' + no + ' 循环按钮数 ' + loopBtns + ' ≠ 板块数');
  if (/App 原句记录|我的笔记/.test(txt)) fail('单元 ' + no + ' 仍出现「原句记录 / 我的笔记」');
  if (/语法要点|词汇表/.test(txt)) fail('单元 ' + no + ' 出现未清理的旧生成内容');
}

// 3) 未并入的单元仍保留记录框（未动）
{
  const dom = open('#u1');
  await tick();
  const txt = dom.window.document.querySelector('.article').textContent;
  if (!/App 原句记录/.test(txt)) fail('单元 1 的原句记录被误删');
  console.log('单元 1 仍保留记录框 ✓');
}

console.log(bad ? '\n失败 ' + bad + ' 项' : '\n全部通过');
process.exit(bad ? 1 : 0);
})();
