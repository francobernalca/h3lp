/* Inlines icons/sprite.svg into index.html between the sprite markers. Run: node tools/inline-sprite.js */
"use strict";
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const sprite = fs.readFileSync(path.join(root, "icons/sprite.svg"), "utf8").trim().replace(/\r\n/g, "\n");
const file = path.join(root, "index.html");
const html = fs.readFileSync(file, "utf8");
const out = html.replace(/<!-- sprite:start -->[\s\S]*?<!-- sprite:end -->/, "<!-- sprite:start -->\n" + sprite + "\n<!-- sprite:end -->");
if (out === html && !html.includes(sprite)) throw new Error("sprite markers not found");
fs.writeFileSync(file, out);
console.log("sprite inlined:", (sprite.match(/<symbol/g) || []).length, "symbols,", sprite.length, "bytes");
