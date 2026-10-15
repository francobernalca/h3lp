/* Writes the English chips, paths, browse tiles and city options from data.js into
   index.html between their markers, so the first paint already has them. Without this,
   site.js builds them after the scripts arrive and on a weak connection the page jumps
   (layout shift 0.18 at 400 ms RTT). site.js rebuilds the same markup on boot, so the
   two must match: keep this in step with buildChips, buildPaths, buildTiles and
   buildCitySelect in site.js. Run: node tools/prerender.js */
"use strict";
const fs = require("fs"), path = require("path");
const D = require("../data.js");
const root = path.join(__dirname, "..");
const file = path.join(root, "index.html");
const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const icon = (id) => '<svg class="i" aria-hidden="true"><use href="#i-' + id + '"/></svg>';
const en = D.STR.en;

const blocks = {
  chips: D.SITUATIONS.map((s) => '<button class="chip" type="button" data-sit="' + s.id + '" aria-pressed="false">' + icon(s.icon) + "<span>" + esc(s.en) + "</span></button>").join(""),
  paths: D.PATHS.map((p) => {
    const c = en.paths[p.id];
    return '<button class="path' + (p.hot ? " hot" : "") + '" type="button" data-path="' + p.id + '" aria-pressed="false">' +
      '<span class="path-ic">' + icon(p.icon) + '</span><span><span class="path-t">' + esc(c.label) + '</span><span class="path-s">' + esc(c.sub) + "</span></span>" + icon("chevron") + "</button>";
  }).join(""),
  tiles: D.TABS.map((t) => '<button class="tile" type="button" data-tab="' + t.id + '" aria-pressed="false">' + icon(t.icon) + "<span>" + esc(t.en.label) + "</span></button>").join(""),
  city: D.CITIES.map((c) => '<option value="' + c.slug + '"' + (c.slug === "" ? " selected" : "") + ">" + esc(c.en) + "</option>").join("")
};

let html = fs.readFileSync(file, "utf8");
for (const [name, markup] of Object.entries(blocks)) {
  const re = new RegExp("<!-- " + name + ":start -->[\\s\\S]*?<!-- " + name + ":end -->");
  if (!re.test(html)) throw new Error(name + " markers not found in index.html");
  html = html.replace(re, "<!-- " + name + ":start -->" + markup + "<!-- " + name + ":end -->");
}
fs.writeFileSync(file, html);
console.log("prerendered:", Object.keys(blocks).map((k) => k + " " + blocks[k].length + " B").join(", "));
