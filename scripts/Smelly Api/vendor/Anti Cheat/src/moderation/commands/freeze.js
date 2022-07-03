import { SA } from "../../../../../index.js";
import { STAFF_TAG } from "../../config.js";
import { Freeze } from "../../utils/Freeze.js";

new SA.Command({
  name: "freeze",
  description: "Freeze a player",
  tags: [STAFF_TAG],
})
  .addOption("player", "player", "Player to ban")
  .addOption("reason", "string", "reason for ban", true)
  .executes((ctx, { player, reason }) => {
    new Freeze(player, reason);
    ctx.reply(
      `§cFroze §f"§a${player.name}§f" Because: "${
        reason ?? "No reason Provided"
      }" §aSuccessfully`
    );
    SA.Providers.chat.broadcast(
      `§cYou have been frozen by §f"§a${ctx.sender.nameTag}§f" Because: "${
        reason ?? "No reason Provided"
      }"`,
      player.nameTag
    );
  });
