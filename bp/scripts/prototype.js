import Spinnet from "./modules/spinnet.js";

/**
 * Convert json to jsonstring color highlight
 * @private
 * @return {Object<String|Object>}
 */
export function JsonString(d) {
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
                out[keyC + k] = `§s ${d[k]}`
                break;
            case "Boolean":
                out[keyC + k] = `§${d[k] ? "a" : "c"}o ${d[k]}`
                break;
            case "Array":
            case "Object":
                out[keyC + k] = JsonString(d[k]);
                break;
            case "Map":
                out[keyC + k] = JsonString(Array.from(d[k].entries()));
                break;
            case "WeakMap":
                out[keyC + k] = "§4o [Cannot Read WeakMap]";
                break;
            case "Set":
                out[keyC + k] = JsonString(Array.from(d[k]));
                break;
            case "WeakSet":
                out[keyC + k] = "§4o [Cannot Read WeakSet]";
                break;
            case "Date":
                out[keyC + k] = `§e ${d[k].toString()}`;
                break;
            case "Promise":
                d[k].then(() => (pIs = "Resolve"), () => (pIs = "Reject"));
                out[keyC + k] = `§d [Promise ${pIs}]`;
                break;
            case "Function":
                cache = SPINNET[d.constructor?.name]?.[k];
                out[keyC + k] = /function \(\) \{\n    \[native code\]\n\}/gm.exec(d[k].toString()) ? (cache ? `§e (${cache.param}) => ${cache.return}` : "§u [Native Function]") : ("§t$ " + d[k].toString().replace(/\s{4,}/g, ""));
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