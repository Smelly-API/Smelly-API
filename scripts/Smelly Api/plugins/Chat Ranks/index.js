import { world } from "mojang-minecraft";
import { configuration } from "./config.js";
import * as SA from "../../index.js";

const talkedRecently = new Map();

world.events.beforeChat.subscribe((data) => {
  if (data.message.startsWith(SA.prefix)) return;
  try {
    if (
      talkedRecently.has(data.sender.name) &&
      talkedRecently.get(data.sender.nameTag) > Date.now()
    ) {
      const timeLeft =
        Math.ceil(
          (talkedRecently.get(data.sender.nameTag) - Date.now()) / 1000
        ) ?? 0;
      return (
        (data.cancel = true),
        SA.build.chat.broadcast(
          `§l§8[§r§fCooldown§l§8]§r§c You have §b${timeLeft}s§c left!`,
          data.sender.nameTag
        )
      );
    } else {
      // Adds the user to the set so that they can't talk for a minute
      talkedRecently.set(data.sender.name, Date.now() + 1000);
      // Send chat
      const rank =
        SA.build.player.getTags(data.sender.nameTag)
          .find((tag) => tag.startsWith("rank:"))
          ?.substring(5)
          ?.replaceAll("--", "§r§l§8][§r") ?? configuration.defaultRank;
      return (
        (data.cancel = true),
        SA.build.chat.broadcast(
          `§l§8[§r${rank}§l§8]§r §7${data.sender.nameTag}:§r ${data.message}`
        )
      );
    }
  } catch (error) {
    talkedRecently.clear();
    return (data.cancel = false), console.warn(`${error}, ${error.stack}`);
  }
});
