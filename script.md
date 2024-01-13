# Use scripts independently:

+ `world.debug(data: any, option: EntityQuerryOption, returnValue: boolean): void | string`: Print everything in your chat (true) or just return debug string (false), including line numbers, color formatting.
+ `JSON.colorStringify(data: any): String`: highlight you object with minecraft color only.
+ `new ScriptDocument(player: Player): ScriptDocument`: Open script document for specific player.
+ `new ScriptConsole(player: Player): ScriptDocument`: Open script console for specific player.
+ `ScriptDocument.versions`: Return a object with current version of spinnet.