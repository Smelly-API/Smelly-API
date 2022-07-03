import {
  BlockLocation,
  Location,
  MinecraftBlockTypes,
  world,
} from "mojang-minecraft";

/**
 * Minecraft Bedrock Anti Reach
 * @license MIT
 * @author Smell of curry
 * @author Visual1mpact
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * Detect players who are reaching and autmaticly cancel that action
 * Works with block placing, block interacting, block destroying, and hurting
 * entitys. tests by using 7 block max reach distance
 * --------------------------------------------------------------------------
 */

/**
 * Max reach limit for players in minecraft
 */
const MAX_REACH_LIMIT = 7;

/**
 * Caculates the distance from one pos to another and tests if its greater than max
 * @param {Location | BlockLocation} p1
 * @param {Location | BlockLocation} p2
 * @returns {Boolean} if it was reach
 */
function isReach(p1, p2) {
  return (
    Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2) >
    MAX_REACH_LIMIT
  );
}

world.events.beforeItemUseOn.subscribe((data) => {
  if (!isReach(data.source, data.blockLocation)) return;
  // flagged
  data.cancel = true;
});

world.events.blockBreak.subscribe((data) => {
  if (!isReach(data.player.location, data.block.location)) return;
  // flagged
  data.dimension
    .getBlock(data.block.location)
    .setPermutation(data.brokenBlockPermutation);
});

world.events.blockPlace.subscribe((data) => {
  if (!isReach(data.player.location, data.block.location)) return;
  // flagged
  data.dimension
    .getBlock(data.block.location)
    .setPermutation(MinecraftBlockTypes.air);
});

world.events.entityHit.subscribe((data) => {
  if (data.hitEntity) {
    if (!isReach(data.entity.location, data.hitEntity.location)) return;
  } else if (data.hitBlock) {
    if (!isReach(data.entity.location, data.hitBlock.location)) return;
  } else {
    return;
  } 
  //flagged
  // do something here maybe flag or send a message to staff
  data.entity.runCommand(`say bad boi using reach`);
});
