const fs = require("fs"),
      colors = require("colors"),
      { parse } = require('comment-parser');

colors.enable();

function debug(match) {
    console.log("\n===================================================".gray, "\n                  Regexp Result                    ".yellow)
    for (let i = 0; i < match.length; i ++) console.log(`Group ${i}:`.green, match[i]?.brightCyan);
    console.log("\n===================================================\n".gray);
}

function staticImport(str) {
  let regex = /(\n|)import\s*(((?:\*\s*as\s*(\w+)\s*)?((\w+)(?:\s*as\s+?(\w+)|))?\s*(?:(,|)\s*{([\s\S]+?)})?)\s*from\s*"(.+?)")?(;|)/gm,
      match;
      out = "";
  while ((match = regex.exec(str)) !== null) {
    regex.lastIndex = match.index + match[0].length;
    debug(match)
    out += match[1] || "";
    /**
     * import everything (*)
     */
    if (match[4]) {
      out += `var ${match[4]} = await import("${match[10]}");`;
      continue;
    }
    /**
     * Default import
     */
    if (match[6]) out += `var { "default": ${match[7] || match[6]}`;
    /**
     * Normal import
     */
    if (match[9]) {
      out += `${match[5] ? "," : "var {"} ${match[9].replace(/as/g, ":")}`;
    }
    out += ` } = await import("${match[10]}");`;
  }
  return out;
}

let str = `
import * as s from "a";
import a from "b";
import { b } from "c"
import c, {
  d
} from "e";
import * as s from "a";
import a as e from "b";
import { b as c } from "c"
import c as d, {
  d as m,
  c as s,
  m,
  n
} from "e";
`;
console.log("Input:\n".red, str, "\n", "Output:\n".green, staticImport(str));