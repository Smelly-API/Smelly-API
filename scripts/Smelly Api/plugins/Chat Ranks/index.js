import { world } from "mojang-minecraft";
import { configuration } from "./config.js";
import * as SA from "../../index.js";

world.events.beforeChat.subscribe((data) => {
  if (data.message.startsWith(SA.prefix)) return;
  try {
    const cooldown =
      data.sender
        .getTags()
        .find((tag) => tag.startsWith("cooldown:"))
        ?.substring(9) ?? null;
    if (cooldown && cooldown > Date.now())
      return (
        (data.cancel = true),
        SA.build.chat.broadcast(
          `§l§8[§r§fCooldown§l§8]§r§c You have §b${Math.ceil(
            (cooldown - Date.now()) / 1000
          )}s§c left!`,
          data.sender.nameTag
        )
      );
    data.sender.removeTag(`cooldown:${cooldown}`);
    data.sender.addTag(
      `cooldown:${Date.now() + configuration.chatCooldown * 1000}`
    );
    return (
      (data.cancel = true),
      SA.build.chat.broadcast(
        `§l§8[§r${(
          data.sender
            .getTags()
            .find((tag) => tag.startsWith("rank:"))
            ?.substring(5)
            ?.split("--") ?? [configuration.defaultRank]
        ).join("§r§l§8][§r")}§l§8]§r §7${data.sender.nameTag}:§r ${
          data.message
        }`
      )
    );
  } catch (error) {
    return (data.cancel = false), console.warn(`${error}, ${error.stack}`);
  }
});
