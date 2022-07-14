import "./modules/autoload.js";
import "./moderation/index.js";
import { SA } from "../../../index.js";
import { world } from "mojang-minecraft";
import { BLOCK_CONTAINERS, CHECK_SIZE } from "./config.js";
import { BlockInventory } from "./utils/BlockInventory.js";

export let db_mutes = new SA.Utilities.storage.scoreboard("mutes");
export let db_freezes = new SA.Utilities.storage.scoreboard("freezes");
export let db_bans = new SA.Utilities.storage.scoreboard("bans");

/**
 * storage of all container locations in the world
 * @type {Object<string, BlockInventory>}
 */
export const CONTAINER_LOCATIONS = {};

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
