import { world } from "mojang-minecraft";
import { SA } from "../../../../../index.js";
import { APPEAL_LINK } from "../../config.js";
import { db_bans } from "../../index.js";
import { kick } from "../../utils/kick.js";

world.events.tick.subscribe((tick) => {
  try {
    for (const player of world.getPlayers()) {
      const banData = db_bans.get(SA.Models.entity.getId(player));
      if (!banData) return;
      if (banData.expire && banData.expire < Date.now())
        return db_bans.delete(SA.Models.entity.getId(player));
      kick(player, [
        `§cYou have been banned!`,
        `§aReason: §f${banData.reason}`,
        `§fExpiry: §b${
          banData.expire ? SA.Utilities.format.MS(banData.length) : "Forever"
        }`,
        `§fAppeal at: §b${APPEAL_LINK}`,
      ]);
    }
  } catch (error) {
    console.warn(error + error.stack);
  }
});
