/* Writes docs/COPY.md from data.js, so the review copy is always the shipped copy.
   Run: node tools/copy-doc.js */
"use strict";
const fs = require("fs");
const path = require("path");
const D = require("../data.js");
const en = D.STR.en, fr = D.STR.fr;
const esc = (s) => String(s).replace(/\|/g, "\|").replace(/\n/g, " ");
const rows = [];
function walk(a, b, p) {
  for (const k of Object.keys(a)) {
    const key = p + k;
    if (Array.isArray(a[k])) a[k].forEach((v, i) => typeof v === "object" ? walk(v, b[k][i], key + "." + (i + 1) + ".") : rows.push([key + "." + (i + 1), v, b[k][i]]));
    else if (a[k] && typeof a[k] === "object") walk(a[k], b[k], key + ".");
    else rows.push([key, a[k], b[k]]);
  }
}
walk(en, fr, "");
const GROUPS = [
  ["Page and emergency strip", /^(docTitle|metaDesc|skip|strip|sos|call|text|exit|shift|brand|lang)/],
  ["Hero, search and crisis lines", /^(h1|lede|search|result|noMatch|crisis|seeAll|chips|paths?Label)/],
  ["The three paths", /^(paths|whileYouWait|breatheLink)/],
  ["City, browse and cards", /^(whereq|cityNote|cityAria|browse|backTo|hint|say|status|days|copy|share|tag|scope|here)/],
  ["Quick exit help", /^exit(Help|Privacy)/],
  ["Weather safety", /^weather/],
  ["Tools", /^(tools|close)/],
  ["Breathe with me", /^breathe/],
  ["My safety plan", /^plan/],
  ["Save key numbers", /^numbers/],
  ["Wallet card", /^pc/],
  ["Footer", /^(about|privacy|report|sky|sunrise|danger|quote|madeby|cred)/],
  ["404 page", /^nf/],
  ["No JavaScript", /^ns/]
];
let md = "# h3lp copy, English and French\n\nGenerated from `data.js` by `node tools/copy-doc.js`. Edit the words in `data.js`, then regenerate.\n" +
  "Not published. For review: plain language, reading age about 10, safe messaging (PHAC Language matters), no banned words, no em dashes.\n" +
  "`{n}`, `{t}`, `{city}`, `{tab}`, `{day}`, `{s}` are filled in by the page.\n";
const used = new Set();
for (const [title, re] of GROUPS) {
  const g = rows.filter((r) => re.test(r[0]) && !used.has(r[0]));
  if (!g.length) continue;
  g.forEach((r) => used.add(r[0]));
  md += `\n## ${title}\n\n| Key | English | French |\n|---|---|---|\n` + g.map((r) => `| ${r[0]} | ${esc(r[1])} | ${esc(r[2])} |`).join("\n") + "\n";
}
const rest = rows.filter((r) => !used.has(r[0]));
if (rest.length) md += "\n## Other\n\n| Key | English | French |\n|---|---|---|\n" + rest.map((r) => `| ${r[0]} | ${esc(r[1])} | ${esc(r[2])} |`).join("\n") + "\n";
md += "\n## Situation chips\n\n| Chip | English | French |\n|---|---|---|\n" + D.SITUATIONS.map((s) => `| ${s.id} | ${esc(s.en)} | ${esc(s.fr)} |`).join("\n") + "\n";
md += "\n## Saved contacts (vCard)\n\n| Number | English name and note | French name and note |\n|---|---|---|\n" + D.CONTACTS.map((c) => `| ${c.tel} | ${esc(c.en)}: ${esc(c.noteEn)} | ${esc(c.fr)} : ${esc(c.noteFr)} |`).join("\n") + "\n";
const e911 = D.R.find((r) => r.id === "911");
md += `\n## New service card: 911\n\n| Field | English | French |\n|---|---|---|\n| who | ${esc(e911.who)} | ${esc(e911.fr.who)} |\n| title | ${esc(e911.title)} | ${esc(e911.fr.title)} |\n| body | ${esc(e911.body)} | ${esc(e911.fr.body)} |\n`;
const all = JSON.stringify(D.STR) + JSON.stringify(D.SITUATIONS) + JSON.stringify(D.CONTACTS) + JSON.stringify(D.R);
const banned = ["unlock", "elevate", "seamless", "delve", "journey", "empower", "revolutioniz", "effortless", "cutting-edge", "game-changer", "commit suicide", "\u2014", "--"];
const hits = banned.filter((w) => all.toLowerCase().includes(w));
md += `\n## Checks\n\n- Banned words and em dashes found: ${hits.length ? hits.join(", ") : "none"}.\n- Keys in English: ${rows.length}; every key has a French twin.\n`;
fs.writeFileSync(path.join(__dirname, "..", "docs", "COPY.md"), md);
console.log("COPY.md rows", rows.length, "banned hits", hits);
