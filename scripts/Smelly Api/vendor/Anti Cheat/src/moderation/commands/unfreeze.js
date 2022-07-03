import { SA } from "../../../../../index.js";
import { STAFF_TAG } from "../../config.js";
import { db_freezes } from "../../index.js";

new SA.Command({
  name: "unfreeze",
  description: "Unfreeze a frozen player",
  tags: [STAFF_TAG],
})
  .addOption("player", "string", "Player to unfreeze")
  .executes((ctx, { player }) => {
    const freeze = db_freezes.values().find((freze) => freze.player == player);
    if (!freeze) return ctx.reply(`${player} is not frozen`);

    db_freezes.delete(freeze.key);
    ctx.reply(`§a${player}§r has been UnFrozen!`);
  });
