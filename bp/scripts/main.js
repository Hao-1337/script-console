/*
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 *         _    _  __            ____                          
 *        | |  | | \_\          / __ \                         
 *        | |__| | __ _  ___   | |  | |_   _  __ _ _ __   __ _ 
 *        |  __  |/ _` |/ _ \  | |  | | | | |/ _` | '_ \ / _` |
 *        | |  | | (_| | (_) | | |__| | |_| | (_| | | | | (_| |
 *        |_|  |_|\__,_|\___/   \___\_\\__,_|\__,_|_| |_|\__, |
 *                                                        __/ |
 *                                                        |___/ 
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 *
 * Minecraft Scripting API
 * @author Choigame123 (Choigame123#5666)
 * @helper no one
 *
 * @supporter NTTRedstone (NTTRedstone#2349)
 * @supporter NovaStak1245
 * @supporter DucDuck
 *
 * Do not steal without my permission
 */

const modules = {
        command: false,
        worldEdit: false,
        veinmine: false,
        leaderboard: false,
        dash: false,
        thirstBar: false,
        veinmine: false,
        healthIndicator: false,
        redstoneInterface: false,
        chestPicker: false,
        console: true
    };

const G = {modules, time: 0};

import { Player, system, world } from "@minecraft/server";
import "./prototype.js";
export * from "@minecraft/server";
export { G };

MainThread(modules, G, false);

//import WorldEdit from "./modules/worldedit.js";
//import _ from "./video-praser/index.js";
    
/**
 * make a debug
 * @param {any} t data need debug
 * @param {EntityQuerryOption} e
 * @return {void}
 */
world.debug= (t,e={},r=false) => {
    if (!G["enabled-debug"]) return;
    const tell = m => {
      for (let d of world.getPlayers(e)) d.sendMessage(m);
    },
    o = t?.constructor?.name;
    let line;
    try {
        let u = void 0;
        u.clear();
    } catch (e) {
        line = `${e.stack}`.match(/\d+/g)[1];
    }
    
    let data = o?.includes("Error") ? `§4[Debugger Error]§c ${t}\n${t.stack}` : `§4[Debugger<§eLine: §f${line}§c> - Class: ${o ?? "None"}]§r ${JSON.colorStringify(t)}`;
    return r ? data : tell(data);
}

async function MainThread(modules, config, freeze = false) {
  /* Config won't be change in runtime */
  if (freeze) (function freeze(obj) {
    Object.freeze(obj);
    for (let key in obj) if (typeof obj[key] === "object") freeze(obj[key]);
  })(config);

  await import("./core.js");
  
  console.warn("§aConfig and interface load complete!")
}