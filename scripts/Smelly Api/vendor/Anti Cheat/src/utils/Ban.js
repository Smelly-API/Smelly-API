import { Player } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { db_bans } from "../index.js";

export class Ban {
  /**
   * Ban a player for a set length
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
      key: SA.Models.entity.getId(player),
      player: player.name,
      date: Date.now(),
      length: length,
      expire: length ? length + Date.now() : null,
      reason: reason,
      by: by,
    };
    db_bans.set(SA.Models.entity.getId(player), data);
  }
}
