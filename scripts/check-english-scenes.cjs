#!/usr/bin/env node
/**
 * 校验「身边的英语」内容数据（身边的英语/scenes.js）。
 *
 * 为什么需要它：每批新内容都是「往 SCENES 追加几条」，手写批次最容易出的错是
 * 漏/多逗号导致语法错，以及 place 用了 GROUPS 里没登记的 id（该地点整组不显示，
 * 页面上看不出来，只有少了一个分组）。这两类错都不会报得很明显。
 *
 * 用法：node scripts/check-english-scenes.js [scenes.js 路径]
 * 默认读 身边的英语/scenes.js。退出码非 0 表示有问题。
 */
const fs = require("fs");
const path = require("path");

const file = process.argv[2] || path.join(__dirname, "..", "身边的英语", "scenes.js");
const src = fs.readFileSync(file, "utf8");

let SCENES, GROUPS, VIEWS;
try {
  ({ SCENES, GROUPS, VIEWS } = new Function(
    src + "; return { SCENES: SCENES, GROUPS: GROUPS, VIEWS: VIEWS };"
  )());
} catch (e) {
  console.error("✗ scenes.js 语法错误（多半是批次追加时漏/多逗号）：");
  console.error("  " + e.message);
  process.exit(1);
}

const problems = [];
const info = [];

// 1) 必需字段
const REQUIRED = ["id", "part", "time", "t", "z", "lead"];
for (const s of SCENES) {
  for (const k of REQUIRED) {
    if (!s[k]) problems.push(`${s.id || "(无 id)"} 缺字段 ${k}`);
  }
  if (!Array.isArray(s.paras) || !s.paras.length) {
    problems.push(`${s.id} 没有 paras`);
    continue;
  }
  s.paras.forEach((p, i) => {
    if (!p.p || !p.z) problems.push(`${s.id} 第 ${i + 1} 段缺英文或中文`);
  });
  if (!Array.isArray(s.notes) || !s.notes.length) problems.push(`${s.id} 没有 notes`);
  else s.notes.forEach((n, i) => {
    if (!n.e || !n.c) problems.push(`${s.id} 第 ${i + 1} 条说法缺 e 或 c`);
  });
  // 不应出现的多余键（手写批次误敲过）
  const allow = { id: 1, part: 1, place: 1, time: 1, t: 1, z: 1, lead: 1, paras: 1, notes: 1 };
  for (const k of Object.keys(s)) {
    if (!allow[k]) problems.push(`${s.id} 有多余字段 ${k}`);
  }
}

// 2) id 唯一
const idSeen = new Set();
for (const s of SCENES) {
  if (idSeen.has(s.id)) problems.push(`id 重复：${s.id}`);
  idSeen.add(s.id);
}

// 3) part / place 必须在 GROUPS 里登记
const partIds = new Set();
const placeIds = new Set();
for (const g of GROUPS) {
  for (const kid of g.kids && g.kids.length ? g.kids : [{ id: g.id }]) {
    (g.by === "place" ? placeIds : partIds).add(kid.id);
  }
}
for (const s of SCENES) {
  if (!partIds.has(s.part)) problems.push(`${s.id} 的 part="${s.part}" 没在 GROUPS 里登记`);
  if (s.place && !placeIds.has(s.place)) {
    problems.push(`${s.id} 的 place="${s.place}" 没在 GROUPS 里登记 —— 该地点整组不会显示`);
  }
}

// 4) 视角 / 分组统计
const byView = {};
for (const g of GROUPS) {
  const v = g.view || "type";
  byView[v] = byView[v] || [];
  const kids = g.kids && g.kids.length ? g.kids : [{ id: g.id }];
  const field = g.by || "part";
  const n = SCENES.filter((s) => kids.some((k) => k.id === s[field])).length;
  byView[v].push(`${g.label}(${n})`);
}
for (const v of VIEWS) info.push(`  ${v.label}[${v.id}] ${(byView[v.id] || []).length} 组：${(byView[v.id] || []).join(" · ")}`);

const withPlace = SCENES.filter((s) => s.place).length;

console.log(`内容文件：${file}`);
console.log(`篇数 ${SCENES.length}｜组数 ${GROUPS.length}｜视角 ${VIEWS.length}`);
console.log(`有地点标签 ${withPlace} 篇（缺 place 的只出现在「按类型分类」：${SCENES.filter((s) => !s.place).map((s) => s.id + " " + s.z).join("、") || "无"}）`);
console.log(info.join("\n"));


if (problems.length) {
  console.log(`\n✗ 发现 ${problems.length} 个问题：`);
  problems.forEach((p) => console.log("  - " + p));
  process.exit(1);
}
console.log("\n✓ 校验通过");
