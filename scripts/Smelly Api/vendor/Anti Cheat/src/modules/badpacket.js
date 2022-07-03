import { forEachValidPlayer } from "../utils/Players.js";

/**
 * Minecraft Bedrock Anti Bad Packet
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is a bad packet system it checks wether a players selected slot
 * is bad, meaning if the slot is over 8 or under 0. if it flags it it
 * means that the players slot will just be set back so no ban
 * --------------------------------------------------------------------------
 */

/**
 * These are a list of slots a player is allowed to have
 */
const GOOD_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

forEachValidPlayer((player) => {
  if (GOOD_SLOTS.includes(player.selectedSlot)) return;
  player.selectedSlot = 0;
});
