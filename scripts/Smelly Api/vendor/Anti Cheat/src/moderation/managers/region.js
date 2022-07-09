import {
  Block,
  BlockLocation,
  EntityQueryOptions,
  Location,
  world,
} from "mojang-minecraft";
import { SA } from "../../../../../index.js";
import { BLOCK_CONTAINERS, STAFF_TAG } from "../../config.js";
import { CONTAINER_LOCATIONS } from "../../index.js";

/**
 * @typedef {Object} volume
 * @property {String} identifer the identifer of the volume
 * @property {BlockLocation} from the pos1 of the volume
 * @property {BlockLocation} to the pos2 of the volume
 */

/**
 * Returns an array of volume areas
 * @returns {Array<volume>}
 */
function getVolumeAreas() {
  try {
    /**
     * @type {String}
     */
    const statusMessage = world
      .getDimension("overworld")
      .runCommand(`volumearea list all-dimensions`).statusMessage;
    return statusMessage
      .match(/-?\d+ -?\d+ -?\d+ to -?\d+ -?\d+ -?\d+/g)
      .map((v, i) => {
        const split = v
          .split(" to ")
          .map((a) => a.split(" ").map((b) => parseInt(b)));
        return {
          identifer: statusMessage
            .match(/(- \w*:) ([\s\S]*?) (from)/g)
            [i].split(" ")[2],
          from: new BlockLocation(split[0][0], split[0][1], split[0][2]),
          to: new BlockLocation(split[1][0], split[1][1], split[1][2]),
        };
      });
  } catch (error) {
    return [];
  }
}

/**
 * Checks if a blockLocation is in a volume area
 * @param {BlockLocation} blockLocation block to check
 * @returns {Boolean}
 */
export function locationInVolumeArea(blockLocation, identifer) {
  for (const volume of getVolumeAreas().filter(
    (v) => v.identifer == identifer
  )) {
    const blocks = volume.from.blocksBetween(volume.to);
    if (blocks.find((loc) => loc.equals(blockLocation))) return true;
  }
  return false;
}

world.events.blockBreak.subscribe(
  ({ block, dimension, brokenBlockPermutation, player }) => {
    if (player.hasTag(STAFF_TAG)) return;
    if (!locationInVolumeArea(block.location, "smelly:region")) return;
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

world.events.beforeItemUseOn.subscribe((data) => {
  if (data.source.hasTag(STAFF_TAG)) return;
  if (!locationInVolumeArea(data.blockLocation, "smelly:region")) return;
  data.cancel = true
});