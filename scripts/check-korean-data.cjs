// 数据层校验：node scripts/check-korean-data.cjs
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const p = path.join(__dirname, '../public/korean/assets/data.js');
const src = fs.readFileSync(p, 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(src + '\n;globalThis.__d={KO_SECTIONS,KO_UNITS_RAW,KO_EXTRA,KO_CONTENT,KO_NOTION};', ctx);
const { KO_SECTIONS, KO_UNITS_RAW, KO_CONTENT, KO_NOTION } = ctx.__d;

let bad = 0;
const fail = (m) => { console.log('✗', m); bad++; };

console.log('KO_SECTIONS', KO_SECTIONS.length, '· KO_UNITS_RAW', KO_UNITS_RAW.length);
console.log('KO_CONTENT', Object.keys(KO_CONTENT).length, '· KO_NOTION', Object.keys(KO_NOTION).length);

for (const no of [8, 9, 11, 12, 13]) {
  if (KO_CONTENT[no]) fail('KO_CONTENT 仍残留 ' + no + '（应只保留 Notion 内容）');
  if (!KO_NOTION[no]) fail('KO_NOTION 缺 ' + no);
}

const audioDir = path.join(__dirname, '../public/korean/assets/audio');
const files = new Set(fs.readdirSync(audioDir));

for (const no of Object.keys(KO_NOTION)) {
  const u = KO_NOTION[no];
  const meta = KO_UNITS_RAW.find((x) => x[0] === Number(no));
  if (!meta) fail('单元 ' + no + ' 不在 KO_UNITS_RAW 里，左栏不会出现');
  const kinds = u.blocks.map((b) => b.k);
  if (kinds[0] !== 'sent') fail('单元 ' + no + ' 首块应为句子');
  if (new Set(kinds).size !== kinds.length) fail('单元 ' + no + ' 有重复板块');
  let total = 0;
  for (const b of u.blocks) {
    if (!b.rows.length) fail('单元 ' + no + ' 的「' + b.t + '」是空的');
    for (const r of b.rows) {
      if (!r.ko && !r.zh) fail('单元 ' + no + ' 有空行');
      if (/[\u00a0]/.test((r.ko || '') + (r.zh || ''))) fail('单元 ' + no + ' 残留不换行空格');
      total++;
    }
    if (!files.has(b.audio)) fail('缺音频 ' + b.audio);
  }
  console.log('  ' + no + ' · ' + u.tag + ' · ' + u.blocks.map((b) => b.t + b.rows.length).join(' / ') + '  → ' + total + ' 行');
}

const s = JSON.stringify(KO_NOTION);
if (/艾디|奥斯카|奥스카/.test(s)) fail('角色名仍有中韩混写');

console.log(bad ? '\n失败 ' + bad + ' 项' : '\n全部通过');
process.exit(bad ? 1 : 0);
