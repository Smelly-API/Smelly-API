import { EntityQueryOptions, world, Player, TickEvent } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { STAFF_TAG } from "../config";

const q = new EntityQueryOptions();
q.excludeTags = [STAFF_TAG];

export const STAFF_QUERY = q;

/**
 * Sends a callback for each player
 * @param {function(Player, TickEvent)} callback
 * @param {number} delay delay in ticks to send callback
 */
export function forEachValidPlayer(callback, delay = 0) {
  SA.Utilities.time.setTickInterval((tick) => {
    for (const player of world.getPlayers(q)) {
      callback(player, tick);
    }
  }, delay);
}
