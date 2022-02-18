import { world, BlockLocation } from "mojang-minecraft";
import * as SA from "../../index.js";
export class PlayerBuilder {
  /**
   * Get list of players in game
   * @returns {Array<string>}
   * @example PlayerBuilder.list();
   */
  list() {
    let data = [];
    data = SA.build.chat.runCommand(`list`).players.split(", ");
    return data;
  }
  /**
   * Look if player is in the game
   * @param {string} player Player you are looking for
   * @returns {boolean}
   * @example PlayerBuilder.has('notbeer');
   */
  has(player) {
    const players = this.list();
    return players.includes(player);
  }
  /**
   * Fetch an online players data
   * @param player
   * @returns {Player}
   */
  fetch(player) {
    for (const p of world.getPlayers())
      if (player && p.name === player) return p;
  }
  /**
   * Get tags player(s) has
   * @param {string} playerName Requirements for the entity
   * @returns {Array<string>}
   * @example getTags('Smell of curry');
   */
  getTags(playerName) {
    const player = this.fetch(playerName);
    return player.getTags();
  }
  /**
   * Look for a tag on player(s)
   * @param {string} tag Tag you are seraching for (WARNING: Color Coding with § is ignored)
   * @param {string} playerName Requirements for the entity
   * @returns {boolean}
   * @example hasTag("Owner", 'Smell of curry');
   */
  hasTag(tag, playerName) {
    const player = this.fetch(playerName);
    return player.hasTag(tag);
  }
  /**
   * Remove a tag from a player
   * @param {string} tag Tag you are seraching for (WARNING: Color Coding with § is ignored)
   * @param {string} playerName Requirements for the entity
   * @returns {boolean}
   * @example removeTag("Owner", 'Smell of curry');
   */
  removeTag(tag, playerName) {
    const player = this.fetch(playerName);
    return player.removeTag(tag);
  }
  /**
   * Get Players Position
   * @param {string} playerName Valid player name
   * @returns {Array{x,y,z}}
   * @example PlayerBuilder.getPos('Smell of curry');
   */
  getPos(playerName) {
    const player = this.fetch(playerName);
    return {
      x: player.location.x,
      y: player.location.y,
      z: player.location.z,
    };
  }
  /**
   * Get the amount on a specific items player(s) has
   * @param {string} itemIdentifier Item you are looking for
   * @param {number} [itemData] Item data you are looking for
   * @param {string} [player] Player you are searching
   * @returns {Array<getItemCountReturn>}
   * @example PlayerBuilder.getItemCount('minecraft:diamond', '0', 'notbeer');
   */
  getItemCount(itemIdentifier, itemData, player) {
    let itemCount = [];
    const data = SA.build.chat.runCommand(
      `clear "${player}" ${itemIdentifier} ${itemData ? itemData : "0"} 0`
    );
    if (data.error) return itemCount;
    data.playerTest.forEach((element) => {
      const count = parseInt(element.match(/(?<=.*?\().+?(?=\))/)[0]);
      const player = element.match(/^.*(?= \(\d+\))/)[0];
      itemCount.push({ player, count });
    });
    return itemCount ? itemCount : [];
  }
  /**
   * Get players score on a specific objective
   * @param {string} objective Objective name you want to search
   * @param {string} player Requirements for the entity
   * @param {number} [minimum] Minumum score you are looking for
   * @param {number} [maximum] Maximum score you are looking for
   * @returns {number}
   * @example PlayerBuilder.getScore('Money', 'notbeer', { minimum: 0 });
   */
  getScore(objective, player, { minimum, maximum } = {}) {
    try {
      const data = SA.build.chat.runCommand(
        `scoreboard players test "${player}" ${objective} ${
          minimum ? minimum : "*"
        } ${maximum ? maximum : "*"}`
      );
      if (data.error) return 0;
      return parseInt(data.statusMessage.match(/-?\d+/)[0] ?? 0) ?? 0;
    } catch (error) {
      return 0;
    }
  }
}
export const PlayerBuild = new PlayerBuilder();
