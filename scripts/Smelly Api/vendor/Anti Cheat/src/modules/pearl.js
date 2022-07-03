import { world, EntityHealthComponent } from "mojang-minecraft";
import { SA } from "../../../../index.js";

/**
 * Minecraft Bedrock Anti Ender Pearl Glitching
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is an anti enderpearl gliching. It checks if an enderpearl is inside
 * a climbable block. if it is it will kill the ender pearl. It uses a list of
 * cliamble blocks and tests the enderpearls location
 * --------------------------------------------------------------------------
 */

/**
 * An array of all the cliamable blocks in minecraft
 */
const CLIAMBLE_BLOCKS = [
  "minecraft:ladder",
  "minecraft:vine",
  "minecraft:cave_vines",
  "minecraft:cave_vines_body_with_berries",
  "minecraft:cave_vines_head_with_berries",
  "minecraft:twisting_vines",
  "minecraft:weeping_vines",
  "minecraft:scaffolding",
];

world.events.entityCreate.subscribe(({ entity }) => {
  if (entity.id != "minecraft:ender_pearl") return;
  const tick = world.events.tick.subscribe(() => {
    const remove = () => world.events.tick.unsubscribe(tick);
    try {
      /**
       * @type {EntityHealthComponent}
       */
      const health = entity.getComponent("minecraft:health");
      const block = entity.dimension.getBlock(
        SA.Models.entity.locationToBlockLocation(entity.location)
      );
      if (!CLIAMBLE_BLOCKS.includes(block.id)) return;
      entity.kill();
    } catch (error) {
      remove();
    }
  });
});
