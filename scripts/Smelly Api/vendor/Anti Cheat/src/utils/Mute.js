import { Player } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { db_mutes } from "../index.js";

export class Mute {
  /**
   * Mutes a player for a length
   * @param {Player} player
   * @param {number} length
   * @param {string} unit
   * @param {string} reason
   * @param {Player.name} by
   */
  constructor(
    player,
    length = null,
    unit = null,
    reason = "No Reason",
    by = "Smelly Anti Cheat"
  ) {
    length = length ? SA.Utilities.format.MS(`${length} ${unit}`) : null;
    const data = {
      player: SA.Models.entity.getId(player),
      date: Date.now(),
      length: length,
      expire: length ? length + Date.now() : null,
      reason: reason,
      by: by,
    };
    db_mutes.set(SA.Models.entity.getId(player), data);
  }
}
