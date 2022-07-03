import { EntityQueryOptions, GameMode, world } from "mojang-minecraft";
import { STAFF_TAG } from "../config.js";
import { Ban } from "../../utils/Ban.js";

/**
 * Minecraft Bedrock Anti Gamemode
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This checks every tick to test if a player has entered a gamemode that they
 * shouldnet be able to get into. If the player has the staff tag it wont
 * check the list of illegle gamemodes are below
 * --------------------------------------------------------------------------
 */

/**
 * The gamemode that you cannot be in unless you have staff tag
 */
const ILLEGLE_GAMEMODE = GameMode.creative;

world.events.tick.subscribe((data) => {
  const q = new EntityQueryOptions();
  q.excludeTags = [STAFF_TAG];
  q.gameMode = ILLEGLE_GAMEMODE;
  for (const player of world.getPlayers(q)) {
    new Ban(player, null, null, "Illegle Gamemode");
  }
});
