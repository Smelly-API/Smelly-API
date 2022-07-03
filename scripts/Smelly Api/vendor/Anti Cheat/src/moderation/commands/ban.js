import { SA } from "../../../../../index.js";
import { STAFF_TAG } from "../../config.js";
import { Ban } from "../../utils/Ban.js";

new SA.Command({
  name: "ban",
  description: "Ban players for lengths",
  tags: [STAFF_TAG],
})
  .addOption("player", "player", "Player to ban")
  .addOption("length", "int", "Time ammount to ban")
  .addOption("unit", "string", "The unit for the time")
  .addOption("reason", "string", "reason for ban", true)
  .executes((ctx, { player, length, unit, reason }) => {
    new Ban(player, length, unit, reason, ctx.sender.name);
    ctx.reply(
      `§cBanned §f"§a${player.name}§f" §cfor ${length} ${unit} Because: "${
        reason ?? "No reason Provided"
      }" §aSuccessfully`
    );
  });
