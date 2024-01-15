const fs = require("fs"),
      colors = require("colors"),
      { parse } = require('comment-parser');

colors.enable();

function debug(match) {
    console.log("\n===================================================".gray, "\n                  Regexp Result                    ".yellow)
    for (let i = 0; i < match.length; i ++) console.log(`Group ${i}:`.green, match[i]?.brightCyan);
    console.log("\n===================================================\n".gray);
}

function optionalParser(match, $) {
    if (!match[5]) return {
        name: match[3],
        data: {
            comment: match[1],
            match: $
        }
    };
    return {
        name: match[4],
        data: {
            [match[5]]: match[6],
            comment: match[1],
            match: $
        }
    };
}

async function init(filePath) {
    let fileContent = String(await fs.readFileSync(filePath, "utf-8"));
    
    fileContent = fileContent.replace(/\/\/[\S\s]+?;/m, "").replace(/\r/g, "").replace(/\/\/ @ts-ignore Class inheritance allowed for native defined classes\n/g, "");

    let regex = /^(\/\*[\s\S]+?\*\/|\/\/[\s\S]+?|\/\*[\s\S]+?$|)\s+export\s+(class|enum|function|interface)\s+(\w+|(\w+)\s+(extends|implements)\s+([<>:()\w\.]+))\s*{[\S\s]+?}$(?=\n{2,}|;)/gm;

    let exportClass = {},
        exportEnum = {},
        exportInterface = {},
        exportFunction = {},
        match, cache;

    while ((match = regex.exec(fileContent)) !== null) {
        regex.lastIndex = match.index + match[0].length;
        /**
         * [0] Match result
         * [1] group <header comment>
         * [2] group <match type>
         * [3] group <name>
         * [4] group <class name>
         * [5] group <innerhit method>
         * [6] group <innerhit class name>
         */
        cache = match[0].replace(match[1], "").replace(/\s+?(?=export)/, "");
        switch (match[2]) {
            case 'enum':
                exportEnum[match[3]] = {
                    comment: match[1],
                    match: cache
                };
                break;
            case 'function':
                exportFunction[match[3]] = {
                    comment: match[1],
                    match: cache
                };
                break;
            case 'interface':
                cache = optionalParser(match, cache);
                exportInterface[cache.name] = cache.data;
                break;
            case 'class':
                cache = optionalParser(match, cache);
                exportClass[cache.name] = cache.data;
                break;
            default:
                throw new Error("Missing handle for type: " + match[2]);
                process.exit(1);
        }
    }
    return {
        class: exportClass,
        interface: exportInterface,
        enum: exportEnum,
        function: exportFunction
    }
}

function nestedExtend(data, cur, root = true) {
    let shiftExp = /(?:export|)\s*?(class|enum|function|interface)\s+(\w+|(\w+)\s+(extends|implements)\s+([<>:()\w]+))\s*{/gm;
 
    if (!cur.extends) return root ? cur.match : cur.match.replace(shiftExp, "");
    let extendClass = data[cur.extends],
        outStr = "";
    if (!extendClass) throw new Error("Missing typing for: " + cur.extends);

    outStr += (root ? cur.match.slice(0, cur.match.length - 2) : cur.match.trim().slice(0, cur.match.length - 2).replace(shiftExp, "")) + nestedExtend(data, extendClass, false);
    
    return outStr;
}

function mergeExtends(data) {
    let o = {};
    for (let key in data) {
        if (!data[key].extends || data[key].extends === "Error") {
            o[key] = data[key];
            continue;
        }
        let s = data[key].extends.split(/\./);
        
        if (s.length > 1) {
            data[key].extends = s.pop();
            o[key] = {
                comment: data[key].comment,
                match: nestedExtend(data, data[key])
            }
            continue;  
        }
        o[key] = {
            comment: data[key].comment,
            match: nestedExtend(data, data[key])
        }
    }
    return o;
}

function methodSplitor(c, n) {
  //  let regex = /(?:^\s*)(\/\/[\s\S]+?$|\/\*[\s\S]+?\*\/$|)(?!\s+export)\s*((static\ readonly|static|private|readonly|)\s+(\w+|\[[\s\S]+?\])\s*(\(\)|\([\s\S]+?\)\s*?=>\s*?\w+\)|\([\s\S]+?\)|)\s*(\:\s*|=\s*|\?:\s*|)([\s\S]+?|)(;|))$/gm;
    let regex = /(?:^\s*)(\/\/[\s\S]+?$|\/\*[\s\S]+?\*\/$|)(?!\s+export)\s*((static\ readonly|static|private|readonly|)\s*(\w+?)\s*(|\(\)|\([\s\S]+?\))(;$|:|=)($|\s([\s\S]+?);))/gm;
    let o = {},
        match, cache;
        let i = 0;
    
    while ((match = regex.exec(c.match)) !== null) {
        regex.lastIndex = match.index + match[0].length;
        if (!match[4]) throw new Error("Match name not found");
        
        //debug(match);
        o[match[4]] = {
            comment: match[1],
            match: match[2].trim().slice(0, -1).replace(/[\s]{2,}/g, ""),
            kind: match[3] === "" ? "public" : match[3],
            param: match[5].slice(1, -1).replace(/[\s]{2,}/g, ""),
            return: match[4] === "constructor" ? n : match[8] || match[4]
        };
    }
    return o;
}
function enumSlitor(c) {
    /(?:^\s*)(\/\/[\s\S]+?$|\/\*[\s\S]+?\*\/$|)(?!\s+export)\s*(\S+?)\s*=\s*([\s\S]+?(?=,|^))/gm
}

function DocReader(filePath) {
    return init(filePath);
}

async function main() {
    console.time("Reading and compiling the document is completed in");
    let versions = {
          "server": require("./node_modules/@minecraft/server/package.json").version,
          "server-ui": require("./node_modules/@minecraft/server-ui/package.json").version,
          "server-gametest": require("./node_modules/@minecraft/server-gametest/package.json").version
        };

    const c = mergeExtends({
        ...(await DocReader("./node_modules/@minecraft/server/index.d.ts")).class,
        ...(await DocReader("./node_modules/@minecraft/server-ui/index.d.ts")).class,
        ...(await DocReader("./node_modules/@minecraft/common/index.d.ts")).class,
        ...(await DocReader("./node_modules/@minecraft/server-gametest/index.d.ts")).class,
    });

    const o = {};
    for (let className in c) o[className] = methodSplitor(c[className], className);

    for (let key in o) {
      for (let prop in o[key]) {
        let data = parse(o[key][prop].comment)[0];

        o[key][prop].comment = { params: {} };
        if (!data) continue;
        if (data.description.length !== 0) o[key][prop].comment.description = data.description;
        
        if (data.tags.length) for (let d of data.tags) {
          if (d.tag === "param") {
            o[key][prop].comment.params[d.name] = d.description;
            continue;
          }
          o[key][prop].comment[d.tag] = d.description;
        }
      }
    }
    
    fs.writeFileSync("./bp/scripts/modules/spinnet.js", "let Spinnet = " + JSON.stringify({versions, ...o}, void 0, 2) + ";\nexport default Spinnet;", "utf-8");
    
    console.timeEnd("Reading and compiling the document is completed in");
    console.info("Document version:");
    console.info(versions);
    process.exit(0);
}
main();
