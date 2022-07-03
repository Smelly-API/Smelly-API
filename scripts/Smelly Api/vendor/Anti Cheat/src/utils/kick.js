import { Player } from "mojang-minecraft";

/**
 * Kicks a player
 * @param {Player} player player to kick
 * @param {Array<String>} message array of data to send in the kick message
 */
export function kick(player, message = []) {
  player.runCommand(
    `kick "${player.nameTag}" §r
    ${message.join("\n")}`
  );
  player.triggerEvent("kick");
}
