import { world } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { PlayerLog } from "../utils/PlayerLog.js";

/**
 * Minecraft Bedrock Anti Spammer
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is a anti spammer it works by testing alot of conditions weather its
 * possible to send chats, if its not it will flag the person
 * it will stop the chat from being sent and warn the player
 * --------------------------------------------------------------------------
 */

/**
 * The log of the players last message
 */
const log = new PlayerLog();

/**
 * Checks if the message is trying to use spammer bypass
 */
const SPAMMER_BYPASS_CHECK = /\| [a-zA-Z0-9]{8}$/;

/**
 * if a player has one of these tags its impossible for them to send a message
 */
const TAGS = ["eating", "digging", "jumping", "using_item"];

world.events.beforeChat.subscribe((data) => {
  if (data.message.startsWith(SA.config.commands.PREFIX)) return;
  const fail = () => {
    SA.Providers.chat.broadcast(`Stop Spamming!`, data.sender.nameTag);
    return (data.cancel = true);
  };
  const tags = data.sender.getTags();
  if (SPAMMER_BYPASS_CHECK.test(data.message)) return fail();
  if (log.get(data.sender) == data.message) return fail();
  if (tags.some((tag) => TAGS.includes(tag))) return fail();
  if (tags.includes("on_ground") && tags.includes("moving")) return fail();

  // Valid Message Log it
  log.set(data.sender, data.message);
});
