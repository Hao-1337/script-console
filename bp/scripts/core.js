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
 import { 
  system, world, G
} from "./main.js";

let config = G;
core(G.modules, G.modules);

let time = Date.now(),
    bootTime = time;

function timeMarker(str) {
    let _ = Date.now(),
        c = _ - time;
   time = _;
   console.warn(`§a[Boot Loader]§r ${str} §f(§e${c}ms§f)`);
}

async function core(modules = {}, addons = {}) {try{
  console.warn("Modules starting up....");
//=====================================================÷===============
//                          CORE MODULES
//=====================================================÷===============
  /*if (modules.command) {
    var {
        default: CommandBuilder,
        ChatHandle
    } = await import("./modules/command.js");
    //update config
    CommandBuilder.updateConfig(config.ChatHandle);
    //event sub
    world.beforeEvents.chatSend.subscribe(_ => {
      var {message, sender} = _;
      _.setTargets([]);
      _.cancel = true;
      system.run(() => ChatHandle({message, sender}));
    });
    // You command must be on here 
    try {
      new CommandBuilder({
        command: "gamemode",
        alias: ["gm"],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}gamemode <gamemode>`,
        permission: player => player.hasTag("admin"),
        args: {
          1: {
            type: "string",
            valid_value: ["a", "s", "c", "sp"]
          }
        },
        callBack: ({player, pData}) => {
          let gm = pData[1];
          if (gm === "sp") gm = "spectator";
          player.runCommandAsync(`gamemode ${gm}`);
        }
      });
      new CommandBuilder({
        command: "database",
        alias: ["dbs"],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}database`,
        permission: player => player.hasTag("admin"),
        args: {
          0: {
            type: "string"
          }
        },
        callBack: () => 0,
        openForm: () => ({
          form: (new ActionFormData().title("Database").body(JSON.colorStringify(database.getAll())).button("OK")),
          callBack: () => 0
        })
      });
      
      new CommandBuilder({
        command: "sound",
        permission: player => player.hasTag(G.admin_tag),
        help_permission: player => player.hasTag(G.admin_tag),
        usage: `${CommandBuilder.prefix()}sound <player: selector>: Play some random sound`,
        args: {
          0: { type: "string" },
          1: {
            type: "selector",
            can_empty: true,
            default_value: "@s"
          }
        },
        callBack: ({player, pData}) => {
          const song = soundTrack.random();
          for (let entity of pData[1]) {
            if (!entity instanceof Player) return player.sendMessage("§cSelector must be a player");
            player.onScreenDisplay.setActionBar(`§aNow play:§e ${song.id}§r (${song.pitch === 1 ? "§bnormal version" : song.pitch < 1 ? "§eslow down" : "§cspeed up"}§r)`);
            player.playSound(song.id, {
              pitch: song.pitch,
              volume: song.volume
            });
          }
        }
      });
      new CommandBuilder({
        command: "import",
        alias: ["i"],
        permission: player => player.hasTag(G.admin_tag),
        usage: `${CommandBuilder.prefix}import <file_path_from_root: String>: Import js file`,
        args: {
          1: {
            type: "string"
          }
        },
        callBack: async ({pData, player}) => {
          let time = Date.now();
          try {
            await import(pData[1]).catch(e => world.debug(e));
          } catch (e) {
            world.debug(e);
            return;
          }
          player.sendMessage(`§aSuccessfully imported file with path:§e ${pData[1]}§a in§e ${Date.now() - time}ms`)
        }
      });
    } catch (e) {
      console.warn(`§c[Commands]- Error: ${e} ${e.stack}`);
    }
    timeMarker("§nModule command loadded");
  }
  var lb;
  function LBBuffer() {
    if (lb) Timer.clearRun(lb);
    lb = Timer.setInterval(() => world.getEntities({type: "choigame:floating_text", tags: ["is_leaderboard"]}).forEach(e => LeaderboardThread(e)), () => 0, 60, Infinity);
  }
  if (modules.leaderboard) {
    var {
      default: LeaderboardThread,
      LeaderboardUI,
      addLB,
      removeLB,
      changeLB
    } = await import("./modules/leaderboard.js");
    LBBuffer();
 
    new CommandBuilder({
      command: "leaderboard",
      alias: ["lb"],
      error_show: "both",
      usage: `${CommandBuilder.prefix()}leaderboard <add|remove|change|>`,
      permission: player => player.hasTag("admin"),
      args: {
        1: {
          type: "string",
          valid_value: ["add", "remove", "change"],
          can_empty: true,
          default_value: ""
        }
      },
      callBack: async ({player, pData}) => {
        player.sendMessage("§a[Leaderboard]§f I don't think force form is good idea. So just out you chat.");
        await AsyncMethod.waitPlayerRotation(player);
        switch (pData[1]) {
          case "add": {
            addLB(player);
            break;
          }
          case "remove": {
            removeLB(player);
            break;
          }
          case "change": {
            changeLB(player);
            break;
          }
          default: {
            LeaderboardUI(player);
          }
        }
      }
    });
    timeMarker("§nLeader loadded");
  }
  if (modules.worldEdit) {
    var PR = {};
    var { default: WorldEdit } = await import("./modules/worldedit.js");
    new CommandBuilder({
        command: "wand",
        alias: [],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}wand <kind: number>`,
        permission: player => player.hasTag("admin"),
        args: {
          0: {
            type: "string"
          },
          1: {
            type: "number",
            can_empty: false
          }
        },
        callBack: ({player, pData}) => {
            new Function("player", `WorldEdit.wand${pData[1]}(player)`)(player);
        }
    });
    new CommandBuilder({
        command: "undo",
        alias: [],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}undo`,
        permission: player => player.hasTag("admin"),
        args: {
          0: {
            type: "string"
          }
        },
        callBack: ({player}) => {
            WorldEdit.ROM[player.id].undo();
        }
    });
    new CommandBuilder({
        command: "redo",
        alias: [],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}redo`,
        permission: player => player.hasTag("admin"),
        args: {
          0: {
            type: "string"
          }
        },
        callBack: ({player}) => {
            WorldEdit.ROM[player.id].redo();
        }
    });
    new CommandBuilder({
        command: "cut",
        alias: [],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}cut`,
        permission: player => player.hasTag("admin"),
        args: {
          0: {
            type: "string"
          }
        },
        callBack: ({player}) => {
            WorldEdit.ROM[player.id].cut();
        }
    });
    new CommandBuilder({
        command: "coppy",
        alias: [],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}coppy`,
        permission: player => player.hasTag("admin"),
        args: {
          0: {
            type: "string"
          }
        },
        callBack: ({player}) => {
            WorldEdit.ROM[player.id].coppy();
        }
    });
    new CommandBuilder({
        command: "paste",
        alias: [],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}paste`,
        permission: player => player.hasTag("admin"),
        args: {
          0: {
            type: "string"
          }
        },
        callBack: ({player}) => {
            WorldEdit.ROM[player.id].paste();
        }
    });
    new CommandBuilder({
        command: "wdEx",
        alias: [],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}wdEx <expression: String>: Testing new expression`,
        permission: player => player.hasTag("admin"),
        args: {
          1: {
            type: "string"
          },
          2: {
              type: "number",
              can_empty: true,
              default_value: 2
          }
        },
        callBack: ({player, pData}) => {
            player instanceof WorldEdit || new WorldEdit(player);
            WorldEdit.ROM[player.id].set({
                setBlocks: [{id: "stone", prb: 100}],
                shape: pData[1],
                shapeKind: pData[2],
                shapeDef: {
                    radius: 9,
                    height: 18
                },
                railLength: 200
            });
        }
    });
    new CommandBuilder({
        command: "wdSh",
        alias: [],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}wdSh <shape: String>: Testing shape that includes in 'Shapes'`,
        permission: player => player.hasTag("admin"),
        args: {
          1: {
            type: "string"
          },
          2: {
              type: "number",
              number_range: {
                min: -1,
                max: 32767
              },
              can_empty: true,
              default_value: 2
          }
        },
        callBack: ({player, pData}) => {
            player instanceof WorldEdit || new WorldEdit(player);
            if (!Shapes[pData[1]]) return WorldEdit.ROM[player.id].tell(`§c There is no shape with name §e"${pData[1]}"§c in shape register!`);
            WorldEdit.ROM[player.id].set({
                setBlocks: [{id: "stone", prb: 100}],
                shape: Shapes[pData[1]],
                shapeKind: pData[2],
                railLength: true,
                railLength: 200
            });
        }
    });
    new CommandBuilder({
        command: "set",
        alias: [],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}set <block: ID | blocks: Array<block: id, state: string>> <state: string | data: number>`,
        permission: player => player.hasTag("admin"),
        args: {
          0: {
            type: "string"
          },
          1: {
            type: ["string", "array"]
          },
          2: {
            type: ["string", "array"],
            valid_value: ["solid", "hollow", "replace", "ireplace"],
            can_empty: true,
            default_value: "solid",
            break_condition: ({raw}) => raw[2] === "replace" || raw[2] === "ireplace",
            break_callBack: ({player, pData, type}) => {
              player instanceof WorldEdit || new WorldEdit(player);
              let data = [];
              if (type[1].includes("array")) {
                for (let {id, state, prb} of pData[1]) {
                  if (!id) return WorldEdit.ROM[player.id].tell("§c Please enter block id");
                  if (!prb) return WorldEdit.ROM[player.id].tell("§c Please enter probability");

                  !state || (state = {});
                  data.push({id, state});
                }
              }
            WorldEdit.ROM[player.id].set({
                shapeKind: 2,
                shape: Shapes[`cube_${pData[2]}`],
                setBlocks: (type[1].includes("array") ? pData[1] : pData[1] === "*" ? "*" : [{prb: 100, id: pData[1]}]),
                saveUndo: true,
                railLength: 120,
                replaceList: type[3].includes("string") ? [pData[3]] : pData[3],
                replaceOnly: false,
                inverseReplace: (pData[2] === "ireplace")
              });
            }
          },
          3: {
            type: ["string"],
            valid_value: ["solid", "hollow"],
            can_empty: true,
            default_value: "solid"
          }
        },
        callBack: ({player, pData, type}) => {
            player instanceof WorldEdit || new WorldEdit(player);
            let data = [];
            if (type[1].includes("array")) {
              for (let {id, state, prb} of pData[1]) {
                if (!id) return WorldEdit.ROM[player.id].tell("§c Please enter block id");
                if (!prb) return WorldEdit.ROM[player.id].tell("§c Please enter probability");

                !state || (state = {});
                data.push({id, state});
              }
            }
            WorldEdit.ROM[player.id].set({
                shapeKind: 2,
                shape: Shapes[`cube_${pData[2]}`],
                setBlocks: (type[1].includes("array") ? data : pData[1] === "*" ? "*" : [{prb: 100, id: pData[1]}]),
                saveUndo: true,
                railLength: 120
            });
        }
    });
    
    new CommandBuilder({
        command: "ellipse",
        alias: [],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}ellipse <block: ID | blocks: Array<block: id, state: string>> <state: string | data: number>`,
        permission: player => player.hasTag("admin"),
        args: {
          0: {
            type: "string"
          },
          1: {
            type: ["string", "array"],
          },
          2: {
            type: ["string"],
            valid_value: ["solid", "hollow"],
            can_empty: true,
            default_value: "solid"
          }
        },
        callBack: ({player, pData, type}) => {
            if (type[1].includes("array")) {
              let data = [];
              for (let {id, state, prb} of pData[1]) {
                if (!id) return WorldEdit.ROM[player.id].tell("§c Please enter block id");
                if (!prb) return WorldEdit.ROM[player.id].tell("§c Please enter probability");

                !state || (state = {});
                data.push({id, state});
              }
              return WorldEdit.ROM[player.id].set({
                  shapeKind: 2,
                  shape: Shapes[`ellipse_${pData[2]}`]
              });
            }
            WorldEdit.ROM[player.id].set({
                shapeKind: 2,
                shape: Shapes[`ellipse_${pData[2]}`],
                setBlocks: (pData[1] === "*" ? "*" : [{
                    prb: 100,
                    id: pData[1]
                }])
            });
        }
    });
    new CommandBuilder({
        command: "sphere",
        alias: [],
        error_show: "both",
        usage: `${CommandBuilder.prefix()}sphere <block: ID | blocks: Array<block: id, state: string>> <state: string | data: number>`,
        permission: player => player.hasTag("admin"),
        args: {
          0: {
            type: "string"
          },
          1: {
            type: ["string", "array"],
          },
          2: {
            type: ["string"],
            valid_value: ["solid", "hollow"],
            can_empty: true,
            default_value: "solid"
          }
        },
        callBack: async ({player, pData, type}) => {
            if (type[1].includes("array")) {
              let data = [];
              for (let {id, state, prb} of pData[1]) {
                if (!id) return WorldEdit.ROM[player.id].tell("§c Please enter block id");
                if (!prb) return WorldEdit.ROM[player.id].tell("§c Please enter probability");

                !state || (state = {});
                data.push({id, state});
              }
              return WorldEdit.ROM[player.id].set({
                  shapeKind: 1,
                  shape: Shapes[`sphere_${pData[2]}`]
              });
            }
            WorldEdit.ROM[player.id].set({
                shapeKind: 1,
                shape: Shapes[`sphere_${pData[2]}`],
                setBlocks: (pData[1] === "*" ? "*" : [{
                    prb: 100,
                    id: pData[1]
                }])
            });
        }
    });
 
    world.afterEvents.playerBreakBlock.subscribe(({block, brokenBlockPermutation, player, itemStackBeforeBreak: item}) => {
      player instanceof WorldEdit || new WorldEdit(player);
      if (item && item.typeId === G.WorldEdit.pickItem) {
        block.setPermutation(brokenBlockPermutation);
        player.sendMessage(`§4[WorldEdit]§a You set block picker position 1 at: §e${block.location.x}, ${block.location.y}, ${block.location.z}`);
        WorldEdit.ROM[player.id].pPos1 = block.location;
        WorldEdit.ROM[player.id].pPos1 && WorldEdit.ROM[player.id].pPos2 && WorldEdit.ROM[player.id].pick_effect();
          
      }
      if (item && item.typeId === G.WorldEdit.item) {
        block.setPermutation(brokenBlockPermutation);
        player.sendMessage(`§4[WorldEdit]§a You set position 1 at: §e${block.location.x}, ${block.location.y}, ${block.location.z}`);
        WorldEdit.ROM[player.id].pos1 = block.location;
        WorldEdit.ROM[player.id].pos1 && WorldEdit.ROM[player.id].pos2 && WorldEdit.ROM[player.id].particle();
      }
    });
    world.afterEvents.playerInteractWithBlock.subscribe(({itemStack: item, player, block}) => {
      player instanceof WorldEdit || new WorldEdit(player);
      if (item && item.typeId === G.WorldEdit.pickItem) {
        player.sendMessage(`§4[WorldEdit]§a You set block picker position 2 at: §e${block.location.x}, ${block.location.y}, ${block.location.z}`);
        WorldEdit.ROM[player.id].pPos2 = block.location;
        WorldEdit.ROM[player.id].pPos2 && WorldEdit.ROM[player.id].pPos2 && WorldEdit.ROM[player.id].pick_effect();
          
      }
      if (item && item.typeId === G.WorldEdit.pasteItem) {
          WorldEdit.ROM[player.id].paste_render();
      }
      if (item && item.typeId === G.WorldEdit.item) {
        player.sendMessage(`§4[WorldEdit]§a You set position 2 at: §e${block.location.x}, ${block.location.y}, ${block.location.z}`);
        WorldEdit.ROM[player.id].pos2 = block.location;
        WorldEdit.ROM[player.id].pos1 && WorldEdit.ROM[player.id].pos2 && WorldEdit.ROM[player.id].particle();
      }
    });
    timeMarker("§nWorldEdit loadded");
  }*/
  if (modules.console) {
      var { ScriptDocument, ScriptConsole } = await import("./modules/console.js");
      
      world.beforeEvents.itemUse.subscribe(async ({source: player, itemStack: item}) => {
         if (player.typeId !== "minecraft:player" || !item) return;
         await new Promise(r => system.runTimeout(() => r(), 1));
         if (item.typeId === "choigame:script_document_book") new ScriptDocument(player);
         if (item.typeId === "choigame:script_console_book") new ScriptConsole(player);
      });

      timeMarker("§nScript console loaded!");
  }

//=====================================================÷===============
//                          CORE MODULES
//=====================================================÷===============
  if (modules.thirstBar) {
      await import("./addons/thrist-bar.js");
      timeMarker("§n[Addons] Thirst bar loadded");
  }
  if (modules.veinmine) {
     var { default: veinmine } = await import("./modules/veinmine.js");
     world.afterEvents.blockBreak.subscribe(veinmine);
     timeMarker("§n[Addons] Veinmine loadded");
  }
  if (modules.dash) {
      await import("./addons/dash.js");
      timeMarker("§n[Addons] Dash loadded");
  }
  if (modules.healthIndicator) {
      await import("./addons/health-indicator.js");
      timeMarker("§n[Addons] Health indicator loadded");
  }
  if (modules.redstoneInterface) {
     var { $: redstoneBuild } = await import("./addons/redstone.js");
     timeMarker("§n[External Addons] Redstone interface loadded");
  }
  if (modules.chestPicker) {
      await import("./addons/chest-picker.js");
      timeMarker("§n[Addons] Chest picker loadded");
  }

   console.warn(`§aAll modules and addons load in§e ${Date.now() - bootTime}ms§r`);
} catch (e) {
    console.warn(`§a[Boot Loader]§4 ERROR§c ${e}\n${e.stack}`);
}}