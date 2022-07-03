import { BlockLocation, MinecraftBlockTypes } from "mojang-minecraft";
import { forEachValidPlayer } from "../utils/Players.js";

/**
 * Minecraft Bedrock Anti Bedrock
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This system is used to validate bedrock and make sure its not destroyed or
 * removed. This is used to make sure map gliches cant occur and places it back
 * instally. Works by detecting blocks above them and confirimg bedrock
 * --------------------------------------------------------------------------
 */

/**
 * A list of Block Y locations to check on a specific dimension
 */
const BLOCKS_Y_TO_CHECK = {
  "minecraft:overworld": [-64],
  "minecraft:nether": [0, 127],
  "minecraft:the_end": [],
};

forEachValidPlayer((player) => {
  for (const y of BLOCKS_Y_TO_CHECK[player.dimension.id]) {
    const block = player.dimension.getBlock(
      new BlockLocation(
        Math.round(player.location.x),
        y,
        Math.round(player.location.z)
      )
    );
    if (block.id == "minecraft:bedrock") return;
    block.setType(MinecraftBlockTypes.bedrock);
  }
});
