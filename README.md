# Smelly API

Welcome to a Framework designed to add easy, Built in fast modules
to make Developing Gametest Addons Eaiser, Faster, and Cleaner.

## Features

Smelly API Adds many features that make Building gametest addons eaiser
Like:

- Custom Command Generator
- Lang system with Predefined Emojies, and Profainty
- 3 Database Types (Scoreboard, Item, Dynamic Property)
- Many Scripts that add more funcanility to Verious Mojang Clases
- Built in Tick Scheduling system and verious formatting options
- Easy Drop in plugins
- Build system that Compiles your packs to a Plugin Desier

## Npm Commands

Compiles a pack and exports it in `build/output/`

```
$ npm run compile <Plugins: String,> [Name: String] [Version: String]
```

Example

```
$ npm run compile Factions,"Chat Ranks" Factions 5.0.2
```

## Documentation

#### Creating a Command:

This is a Simple Spawn Command teleporting the player to Spawn

```js
import { SA } from "../../../../index.js";
import { Location } from "mojang-minecraft";

const command = new SA.Command(
  {
    name: "spawn",
    description: "Teleports you to spawn",
    tags: [],
    aliases: ["s"],
  },
  (ctx) => {
    ctx.sender.teleport(new Location(0, 0, 0), ctx.sender.dimension, 0, 0);
  }
);
```

Creating a Command using aguments is also very easy

```js
import { SA } from "../../../../index.js";
import { Location } from "mojang-minecraft";

const command = new SA.Command({
  name: "spawn",
  description: "Teleports you to spawn",
  tags: [],
  aliases: ["s"],
})
  .addOption(
    "dimension",
    ["overworld", "nether", "the end"],
    "Dimension to tp in"
  )
  .executes((ctx, { dimension }) => {
    ctx.sender.teleport(
      new Location(0, 0, 0),
      world.getDimension(dimension),
      0,
      0
    );
  });
```

If You want to make a command where only certin people can use it add
tags to the command registry like:

```js
import { SA } from "../../../../index.js";

const command = new SA.Command({
  name: "kick",
  description: "Kicks a player",
  tags: ["staff"],
})
  .addOption("player", "player", "Player to kick")
  .executes((ctx, { player }) => {
    player.runCommand(`kick @s`);
    ctx.reply(`Kicked ${player.nameTag}`);
  });
```

## Support

For support, join the discord: https://discord.gg/dMa3A5UYKX
