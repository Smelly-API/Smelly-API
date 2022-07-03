import { Player } from "mojang-minecraft";
import { db_freezes } from "../index.js";

export class Freeze {
  /**
   * Freeze a player
   * @param {Player} player
   * @param {string} reason
   */
  constructor(player, reason = "No Reason") {
    const data = {
      player: player.name,
      key: player.scoreboard.id,
      reason: reason,
      location: {
        x: player.location.x,
        y: player.location.y,
        z: player.location.z,
        dimension: player.dimension.id,
      },
    };
    db_freezes.set(player.scoreboard.id, data);
  }
}
