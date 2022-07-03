import { Player, world } from "mojang-minecraft";

export class PlayerLog {
  /**
   * The data that is stored in this log
   */
  static data = null;

  constructor() {
    this.data = new Map();
    this.events = {
      playerLeave: world.events.playerLeave.subscribe((data) =>
        this.data.delete(data.playerName)
      ),
    };
  }

  /**
   * Logs a player to a value
   * @param {Player} player
   * @param {any} value
   */
  set(player, value) {
    this.data.set(player.name, value);
  }

  /**
   * Gets a players value
   * @param {Player} player
   * @returns {any}
   */
  get(player) {
    return this.data.get(player.name);
  }

  /**
   * Deletes a player from log
   * @param {Player} player
   */
  delete(player) {
    this.data.delete(player.name);
  }

  /**
   * Gets all the players in the log
   * @returns {Array<String>}
   */
  playerNames() {
    return this.data.keys();
  }
}
