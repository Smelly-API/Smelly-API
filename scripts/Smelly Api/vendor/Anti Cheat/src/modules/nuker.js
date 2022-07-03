import {
  BlockAreaSize,
  BlockInventoryComponent,
  BlockInventoryComponentContainer,
  BlockLocation,
  EntityQueryOptions,
  world,
  Location,
} from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { STAFF_TAG } from "../config.js";
import { BlockInventory } from "../utils/BlockInventory.js";
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
 * When breaking vegitation blocks it could cause a false trigger
 * so when a block gets broken and it has one of the block tags
 * it gets skipped and doesnt count in the nuker event
 *
 * @link https://wiki.bedrock.dev/blocks/block-tags.html
 */
const TAGS = [
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

/**
 * A List of all containers a item could be in
 */
const BLOCK_CONTAINERS = [
  "minecraft:chest",
  //"minecraft:barrel",
  "minecraft:trapped_chest",
  //"minecraft:dispenser",
  //"minecraft:dropper",
  //"minecraft:furnace",
  //"minecraft:blast_furnace",
  //"minecraft:lit_furnace",
  //"minecraft:lit_blast_furnace",
  //"minecraft:hopper",
  //"minecraft:shulker_box",
  //"minecraft:undyed_shulker_box",
];

/**
 * The block size to check for blockContainers
 */
const CHECK_SIZE = { x: 7, y: 7, z: 7 };

/**
 * Block Location to block inventory component
 * @type {Object<string, BlockInventory>}
 */
const CONTAINER_LOCATIONS = {};

world.events.tick.subscribe((data) => {
  for (const player of world.getPlayers()) {
    const blockLoc = SA.Models.entity.locationToBlockLocation(player.location);
    const pos1 = blockLoc.offset(CHECK_SIZE.x, CHECK_SIZE.y, CHECK_SIZE.z);
    const pos2 = blockLoc.offset(-CHECK_SIZE.x, -CHECK_SIZE.y, -CHECK_SIZE.z);

    for (const location of pos1.blocksBetween(pos2)) {
      const block = player.dimension.getBlock(location);
      if (!BLOCK_CONTAINERS.includes(block.id)) continue;
      CONTAINER_LOCATIONS[JSON.stringify(location)] = new BlockInventory(
        block.getComponent("inventory").container
      );
    }
  }
});

world.events.blockBreak.subscribe(
  ({ block, brokenBlockPermutation, dimension, player }) => {
    if (player.hasTag(STAFF_TAG)) return;
    if (block.getTags().some((tag) => TAGS.includes(tag))) return;
    const old = log.get(player);
    log.set(player, Date.now());
    if (old < Date.now() - 70 || IMPOSSIBLE_BREAKS.includes(block.id)) return;
    dimension
      .getBlock(block.location)
      .setPermutation(brokenBlockPermutation.clone());
    if (BLOCK_CONTAINERS.includes(brokenBlockPermutation.type.id)) {
      const OLD_INVENTORY = CONTAINER_LOCATIONS[JSON.stringify(block.location)];
      OLD_INVENTORY.load(block.getComponent("inventory").container);
      delete CONTAINER_LOCATIONS[JSON.stringify(block.location)];
    }
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
