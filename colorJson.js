/**
 * Convert json to jsonstring color highlight
 * @private
 * @return {Object<String|Object>}
 */
function JsonString(d) {
    try {
        let b = Array.isArray(d),
            out = b ? []: {},
            keyC = b ? "" : "§4∆ ",
            pIs = "Pending",
            cache;

        for (let k in d) switch (d[k]?.constructor?.name || Object.getPrototypeOf(d[k])?.constructor?.name) {
            case undefined:
            case null:
                out[keyC + k] = `§6o ${d[k]}`
                break;
            case "String":
                out[keyC + k] = `§a$ ${d[k]}`
                break;
            case "Number":
                out[keyC + k] = `§6 ${d[k]}`
                break;
            case "Boolean":
                out[keyC + k] = `§3o ${d[k]}`
                break;
            case "Array":
            case "Object":
                console.log(0)
                out[keyC + k] = JsonString(d[k]);
                break;
            case "Map":
                out[keyC + k] = JsonString(Array.from(d[k].entries()));
                break;
            case "WeakMap":
                out[keyC + k] = "§4o Cannot Read WeakMap";
                break;
            case "Set":
                out[keyC + k] = JsonString(Array.from(d[k]));
                break;
            case "WeakSet":
                out[keyC + k] = "§4o Cannot Read WeakSet";
                break;
            case "Date":
                out[keyC + k] = `§e ${d[k].toString()}`;
                break;
            case "Promise":
                d[k].then(() => (pIs = "Resolve"), () => (pIs = "Reject"));
                out[keyC + k] = `§d [Promise ${pIs}]`;
                break;
            case "Function":
                cache = Spinnet[d.constructor?.name]?.[k];
                out[keyC + k] = /function \(\) \{\n    \[native code\]\n\}/gm.exec(d[k].toString()) ? (cache ? `§e (${cache.param}) => ${cache.return}` : "§4 [Native Function]") : d[k].toString().replace(/\s{4,}/g, "");
                break;
            case "GeneratorFunction":
                out[keyC + k] = "§d Iterator<Unknow>"
                break;
            default:
               out[keyC + (b ? "" : `§0${d[k].constructor.name}0§ `) + k] = JsonString(d[k]);
        }

        return out;
    } catch (e) {
        console.error(e)
    }
}

/**
 * Add minecraft color for you object
 * @param {any} data data for format
 * @param {number} space space
 * @return {String}
 */
JSON.colorStringify = function(data, space = 4) {
  if (!(typeof data === "object")) return `§6${data}`;
  return JSON.stringify(JsonString(data), void 0, space).replace(/\"§(\w+?|\w+?(∆|\$))\s(§0[\s\S]+?0§(\s*)|)([\s\S]*?)\"(:\s|,|$)/gm, (_, color, type, className, isKey, name, kind) => (_ = (isKey = type === "∆") || type === "$", `§${color.replace(/[∆$]/g, "").split("").join("§")}${type ? '"' : ""}${name}${type ? '"' : ""}§r${isKey ? `: ${className?.length ? `§8[§e${className.slice(2, -3)}§8]§l >§r ` : ""}` : kind?.length ? "," : ""}`));
};


class test {
    constructor() {
        this.sét = 1;
    }
    [Symbol.iterator]() {
        return 0;
    }
}

const Spinnet = {};

let a = {
  "format_version": "1.16.0",
  "minecraft:entity": {
    "description": {
      "identifier": "minecraft:player",
      "is_spawnable": false,
      "is_summonable": false,
      "is_experimental": false,
      "scripts": {
        "animate": [
          "sleep",
          "sneak",
          "jump",
          "land",
          "fire",
          "inwater",
          "move",
          "riding",
          "sprint",
          "swim",
          "death",
          "gliding",
          "POV1",
          "eating",
          "invisible",
          "item_is_charged",
          "using_item",
          "selected_item",
          "speed"
        ]
      }
    }
  },
  promise: new Promise(r => setTimeout(() => (console.log("Resolve"), r()), 300)),
  cl: new test(),
  smthel: [
      new test()
  ],
  l: null,
  a: undefined
};

console.log(JSON.colorStringify({"Block":{"constructor":{"comment":"","match":"private constructor();","kind":"private","param":"","return":""},"dimension":{"comment":"/**\n     * @remarks\n     * Returns the dimension that the block is within.\n     *\n     */","match":"readonly dimension: Dimension;","kind":"readonly","param":"","return":"Dimension"},"isAir":{"comment":"/**\n     * @remarks\n     * Returns true if this block is an air block (i.e., empty\n     * space).\n     *\n     * @throws This property can throw when used.\n     *\n     * {@link LocationInUnloadedChunkError}\n     *\n     * {@link LocationOutOfWorldBoundariesError}\n     */","match":"readonly isAir: boolean;","kind":"readonly","param":"","return":"boolean"},"isLiquid":{"comment":"/**\n     * @remarks\n     * Returns true if this block is a liquid block - (e.g., a\n     * water block and a lava block are liquid, while an air block\n     * and a stone block are not. Water logged blocks are not\n     * liquid blocks).\n     *\n     * @throws This property can throw when used.\n     *\n     * {@link LocationInUnloadedChunkError}\n     *\n     * {@link LocationOutOfWorldBoundariesError}\n     */","match":"readonly isLiquid: boolean;","kind":"readonly","param":"","return":"boolean"}},"BlockAreaSize":{"x":{"comment":"/**\n     * @remarks\n     * X size (west to east) component of this block area.\n     *\n     */","match":"x: number;","kind":"public","param":"","return":"number"},"y":{"comment":"/**\n     * @remarks\n     * Y size (down to up) of this block area size.\n     *\n     */","match":"y: number;","kind":"public","param":"","return":"number"},"z":{"comment":"/**\n     * @remarks\n     * Z size (south to north) of this block area size.\n     *\n     */","match":"z: number;","kind":"public","param":"","return":"number"},"constructor":{"comment":"/**\n     * @remarks\n     * Creates a new BlockAreaSize object.\n     *\n     */","match":"constructor(x: number, y: number, z: number);","kind":"public","param":"x: number, y: number, z: number","return":""}}}));
