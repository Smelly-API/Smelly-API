import { EntityQueryOptions, world, Location } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { BLOCK_CONTAINERS, STAFF_TAG } from "../config.js";
import { CONTAINER_LOCATIONS } from "../index.js";
import { locationInVolumeArea } from "../moderation/managers/region.js";
import { PlayerLog } from "../utils/PlayerLog.js";

/**
 * Minecraft Bedrock Anti Nuker
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This anti nuker works by loging everytime a player breaks a block
 * Then the next time they break a block it tests the time from now to then
 * And if they broke a block in 50 miliseconds than we place that block back
 * --------------------------------------------------------------------------
 */

/**
 * The log of the players break times
 */
const log = new PlayerLog();

/**
 * if a block is broken faster than this time it is considered hacking
 */
const IMPOSSIBLE_BREAK_TIME = 70;

/**
 * When breaking vegitation blocks it could cause a false trigger
 * so when a block gets broken and it has one of the block tags
 * it gets skipped and doesnt count in the nuker event
 *
 * @link https://wiki.bedrock.dev/blocks/block-tags.html
 */
const VAILD_BLOCK_TAGS = [
  "snow",
  "lush_plants_replaceable",
  "azalea_log_replaceable",
  "minecraft:crop",
  "fertilize_area",
];

/**
 * A list of all the blocks that are impossible to break unless you have hacks
 */
const IMPOSSIBLE_BREAKS = [
  "minecraft:water",
  "minecraft:flowing_water",
  "minecraft:lava",
  "minecraft:flowing_lava",
  "minecraft:bedrock",
];

world.events.blockBreak.subscribe(
  ({ block, brokenBlockPermutation, dimension, player }) => {
    if (player.hasTag(STAFF_TAG)) return;
    if (block.getTags().some((tag) => VAILD_BLOCK_TAGS.includes(tag))) return;
    if (locationInVolumeArea(block.location, "smelly:region")) return;
    const old = log.get(player);
    log.set(player, Date.now());

    if (IMPOSSIBLE_BREAKS.includes(block.id)) return;
    if (old < Date.now() - IMPOSSIBLE_BREAK_TIME) return;
    // setting block back
    dimension
      .getBlock(block.location)
      .setPermutation(brokenBlockPermutation.clone());
    // setting chest inventory back
    if (BLOCK_CONTAINERS.includes(brokenBlockPermutation.type.id)) {
      const OLD_INVENTORY = CONTAINER_LOCATIONS[JSON.stringify(block.location)];
      OLD_INVENTORY.load(block.getComponent("inventory").container);
      delete CONTAINER_LOCATIONS[JSON.stringify(block.location)];
    }
    // killing dropped items
    SA.Utilities.time.setTickTimeout(() => {
      const q = new EntityQueryOptions();
      q.maxDistance = 2;
      q.type = "minecraft:item";
      q.location = new Location(
        block.location.x,
        block.location.y,
        block.location.z
      );
      [...dimension.getEntities(q)].forEach((e) => e.kill());
    }, 0);
  }
);
