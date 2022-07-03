import { SA } from "../../../../../index.js";
import { STAFF_TAG } from "../../config.js";
import { Mute } from "../../utils/Mute.js";

new SA.Command({
  name: "mute",
  description: "Mute a player for lengths",
  tags: [STAFF_TAG],
})
  .addOption("player", "player", "Player to mute")
  .addOption("length", "int", "Time ammount of mute", true)
  .addOption("unit", "string", "The unit for the time", true)
  .addOption("reason", "string", "reason for mute", true)
  .executes((ctx, { player, length, unit, reason }) => {
    new Mute(player.name, length, unit, reason, ctx.sender.nameTag);
    ctx.reply(
      `§cMuted §f"§a${player.name}§f" §cfor ${length} ${unit} Because: "${
        reason ?? "No reason Provided"
      }" §aSuccessfully`
    );
    SA.Providers.chat.broadcast(
      `§cYou have been muted by §f"${
        ctx.sender.name
      }" §cfor ${length} ${unit} Because: "${reason ?? "No reason Provided"}"`,
      player.nameTag
    );
  });
