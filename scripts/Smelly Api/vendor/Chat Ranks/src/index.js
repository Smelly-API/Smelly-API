import { Player, world } from "mojang-minecraft";
import { SA } from "../../../index.js";
import { CHAT_COOLDOWN, DEFAULT_RANK } from "./config.js";

/**
 * Minecraft Bedrock Chat Ranks
 * @license MIT
 * @author Smell of curry
 * @version 5.0.0
 * --------------------------------------------------------------------------
 * This is chatranks for minecraft bedrock. this system has a inbuit cooldown
 * System works by setting a players cooldown through memory then every time
 * The player types in chat it checks that cooldown stops the message
 * --------------------------------------------------------------------------
 */

/**
 * The log of the players cooldowns
 * @type {Object.<string, Cooldown>}
 */
const COOLDOWNS = {};

/**
 * Formats the Chat Ranks
 */
const FORMAT = (player) =>
  `§l§8[§r${ranks(player).join("§r§l§8][§r")}§l§8]§r §7${player.nameTag}:§r`;

/**
 * Gets ranks from player
 * @param {Player} player player to get ranks from
 * @returns {string[]}
 */
function ranks(player) {
  const ranks = player
    .getTags()
    .filter((tag) => tag.startsWith("rank-"))
    .map((rank) => rank.replace("rank-", ""));
  return ranks.length > 0 ? ranks : [DEFAULT_RANK];
}

world.events.beforeChat.subscribe((data) => {
  let { message, sender } = data;
  data.cancel = true;
  if (message.startsWith(SA.prefix)) return;
  try {
    const cooldown = COOLDOWNS[sender.nameTag];
    if (cooldown) return cooldown.reply();
    new Cooldown(sender.nameTag);

    return SA.Providers.chat.broadcast(`${FORMAT(sender)} ${message}`);
  } catch (error) {
    return (data.cancel = false), console.warn(`${error}, ${error.stack}`);
  }
});

class Cooldown {
  /**
   * Generates a cooldown for a player
   * @param {Player.nameTag} player player whos the cooldown is for
   */
  constructor(player) {
    this.player = player;
    this.time = Date.now() + CHAT_COOLDOWN * 1000;

    COOLDOWNS[this.player] = this;
    this.events = {
      tick: world.events.tick.subscribe((data) => {
        if (this.time <= Date.now()) this.expire();
      }),
      playerLeave: world.events.playerLeave.subscribe(({ playerName }) => {
        if (playerName == this.player) this.expire();
      }),
    };
  }

  /**
   * Caculates the time left of the cooldown
   * @returns {number}
   */
  get TIME_LEFT() {
    return Math.ceil((this.time - Date.now()) / 1000);
  }

  /**
   * Sends a chat reply
   * @returns {void}
   */
  reply() {
    return SA.Providers.chat.broadcast(
      `§l§8[§r§fCooldown§l§8]§r§c You have §b${this.TIME_LEFT}s§c left!`,
      this.player
    );
  }

  /**
   * Expires the cooldown
   */
  expire() {
    delete COOLDOWNS[this.player];
    for (const key in this.events) {
      world.events[key].unsubscribe(this.events[key]);
    }
  }
}
