function nestedExtend(data, cur, root = true) {
    let shiftExp = /(?:export|)\s*?(class|enum|function|interface)\s+(\w+|(\w+)\s+(extends|implements)\s+([<>:()\w]+))\s*{/gm;
 
    if (!cur.extends) return root ? cur.match : cur.match.replace(shiftExp, "");
    let extendClass = data[cur.extends],
        outStr = "";
    if (!extendClass) throw new Error("Missing typing for: " + cur.extends);

    outStr += (root ? cur.match.slice(0, cur.match.length - 2) : cur.match.trim().slice(0, cur.match.length - 2).replace(shiftExp, "")) + nestedExtend(data, extendClass, false);
    
    return outStr;
}


let struct = {
  a: {
    extends: "b",
    match: "export class a extends b { con() { return 0; } }"
  },
  b: {
    extends: "c",
    match: "export class b extends c { con1() { return 1; } }"
  },
  c: {
    extends: "d",
    match: "export class c extends d { con2() { return 2; } }"
  },
  d: {
    match: "class d { con3() { return 3; } }"
  }
}

console.log(nestedExtend(struct, struct.a));
