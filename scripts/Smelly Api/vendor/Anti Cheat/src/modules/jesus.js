import { SA } from "../../../../index.js";
import { PlayerLog } from "../utils/PlayerLog.js";
import { forEachValidPlayer } from "../utils/Players.js";
import { PreviousLocation as PrevLo } from "../utils/PreviousLocation.js";

/**
 * Minecraft Bedrock Anti Jesus
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is a anti phase system. It works by getting the block the player is in
 * every tick. If the block there in is a FULL_BLOCK it will tp the player to
 * there last position where they wernt in one of those blocks
 * --------------------------------------------------------------------------
 */

/**
 * Stores Last Previous grounded location
 */
const log = new PlayerLog();

/**
 * If a player has one of these tags then the proccess stops for them
 */
const TAGS = ["levitating", "swimming"];

const LIQUIDS = [
  "minecraft:water",
  "minecraft:flowing_water",
  "minecraft:lava",
  "minecraft:flowing_lava",
];

forEachValidPlayer((player, { currentTick }) => {
  if (player.getTags().some((tag) => TAGS.includes(tag))) return;
  const block = player.dimension.getBlock(
    SA.Models.entity.locationToBlockLocation(player.location).offset(0, -1, 0)
  );
  const get = () => log.get(player) ?? new PrevLo(player, currentTick, log);
  if (!LIQUIDS.includes(block.id)) return get().update();
  // Player is on top of water
  get().back();
});
