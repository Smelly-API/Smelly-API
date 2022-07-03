import { world } from "mojang-minecraft";
import { SA } from "../../../../../index.js";
import { db_mutes } from "../../index.js";

world.events.beforeChat.subscribe((data) => {
  if (data.message.startsWith(SA.config.commands.PREFIX)) return;
  const muteData = db_mutes.get(data.sender.scoreboard.id);
  if (!muteData) return;
  if (muteData.expire && muteData.expire < Date.now())
    return db_mutes.delete(data.sender.scoreboard.id);
  data.cancel = true;
  SA.Providers.chat.broadcast(
    `You are muted and cannot send messages please try again later`,
    data.sender.nameTag
  );
});
