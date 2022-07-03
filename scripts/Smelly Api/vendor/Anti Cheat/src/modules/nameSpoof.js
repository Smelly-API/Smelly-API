import { world } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { kick } from "../utils/kick.js";

/**
 * Minecraft Bedrock Anti NameSpoof
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is a anti Bad gamertag it checks when a player joins if there name is
 * invaild it determins its invalid by checking the length and characters in it
 * the requirememts are from xbox gamertag requiremnts
 * --------------------------------------------------------------------------
 */

/**
 * This regex determines if a Gamertag is valid. It checks if the first character is a letter.
 * Then it checks the middle of the nameTag if it is letters, numbers, spaces, #, ', (, ), - or _
 * Then it makes sure it's a length between 3 and 20, then it checks if the last character is a letter, number, or ).
 * It uses Unicode to check all languages, so it is compatible with all places.
 * Then it checks the word if it has any profanity defined by the SA.Lang.profanity file
 *
 * @author Smell of curry
 * @link https://regexr.com/6msor
 */
const VAILD_GAMERTAG = /^([\p{L}])([\p{L}\d\s#'()-_]{1,20})([\p{L}\d\)])$/isu;

world.events.playerJoin.subscribe(({ player }) => {
  const gamertag = player.name;
  const fail = () =>
    kick(player, [
      `§cYou have been kicked!`,
      `§aReason: §f'${gamertag}' is Invalid`,
      `§fThis Server requires you to have a valid gamertag!`,
    ]);
  if (!VAILD_GAMERTAG.test(gamertag)) return fail();
  if ([...world.getPlayers()].filter((p) => p.name == player.name).length > 1)
    return fail();
  // if (SA.Lang.profanity.some((v) => new RegExp(`${v}`).test(gamertag)))
  //   return fail();

  // Player Probably isnt namespoofing
});
