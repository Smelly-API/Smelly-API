import { Location } from "mojang-minecraft";
import { PlayerLog } from "../utils/PlayerLog.js";
import { forEachValidPlayer } from "../utils/Players.js";

/**
 * Minecraft Bedrock Anti Speed
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is a anti speed it works by testing if a players velocity is at
 * a rate that is not possible for normal players.
 * --------------------------------------------------------------------------
 */

/**
 * Stores the players last Tick Location
 */
const log = new PlayerLog();

/**
 * The max velocity speed of a player sprinting
 */
const MAX_SPRINTING_SPEED = 0.3;

/**
 * Caculates the distance from loc1 to loc2
 * @param {Location} loc1 location 1
 * @param {Location} loc2 location 2
 * @returns {number}
 */
function distance(loc1, loc2) {
  return Math.hypot(loc2.x - loc1.x, loc2.z - loc1.z);
}

forEachValidPlayer((player, { currentTick }) => {
  const old = log.get(player);
  log.set(player, { location: player.location, dimension: player.dimension });
  if (!old || old.dimension != player.dimension) return;
  const velocity = distance(old.location, player.location);
  // console.warn(velocity);
});
