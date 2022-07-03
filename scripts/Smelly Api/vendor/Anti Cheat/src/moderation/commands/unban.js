import { SA } from "../../../../../index.js";
import { STAFF_TAG } from "../../config.js";
import { db_bans } from "../../index.js";

new SA.Command({
  name: "unban",
  description: "Unban a banned player",
  tags: [STAFF_TAG],
})
  .addOption("player", "string", "Player to ban")
  .executes((ctx, { player }) => {
    const banData = db_bans.values().find((ban) => ban.player == player);
    if (!banData) return ctx.reply(`${player} is not banned`);
    console.warn(`bandata ${JSON.stringify(banData)}`);
    db_bans.delete(banData.key);
    ctx.reply(`§a${player}§r has been Unbanned!`);
  });
