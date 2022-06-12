import { Player } from "mojang-minecraft";

/**
 * Gets a score from a player
 * @param {string} objective
 * @returns {number}
 */
Player.prototype.getScore = function (objective) {
  try {
    const command = this.runCommand(
      `scoreboard players test @s "${objective}" * *`
    );
    return parseInt(String(command.statusMessage?.split(" ")[1]), 10);
  } catch (error) {
    return 0;
  }
};
/**
 * Tests if a entity is dead
 * @returns {Boolean}
 * @example Player.isDead();
 */
Player.prototype.isDead = function () {
  return (
    this.hasComponent("minecraft:health") &&
    this.getComponent("minecraft:health").current <= 0
  );
};
