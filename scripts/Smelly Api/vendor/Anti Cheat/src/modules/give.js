import {
  InventoryComponentContainer,
  ItemStack,
  MinecraftItemTypes,
  Player,
  world,
} from "mojang-minecraft";
import { forEachValidPlayer } from "../utils/Players.js";

/**
 * Minecraft Bedrock Anti Give
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is a anti give system it works by tracking items. Bassicly it tracks
 * all the possible items a player could obtain and checks if it was possible
 * to get that item if not it will remove that item from inventory
 * --------------------------------------------------------------------------
 */

/**
 * The log of all the possible items for a player
 * @type {Object<string, InventoryComponentContainer}
 */
const INVENTORYS = {};

const empty = new ItemStack(MinecraftItemTypes.air);

/**
 * Returns a players inventory in type array of item stacks
 * @param {Player} player player to grab
 * @returns {Array<ItemStack>} current inventory
 */
function getInventoryItems(player) {
  const inventory = player.getComponent("minecraft:inventory").container;
  let items = [];
  for (let i = 0; i < inventory.size; i++) {
    let item = inventory.getItem(i);
    if (item) items.push(item);
  }
  return items;
}

/**
 * Finds the diffrences between two inventorys
 * @param {Array<ItemStack>} inv1 first inventory
 * @param {Array<ItemStack>} inv2 second inventory
 * @returns {Array<ItemStack>} items that are diffrent
 */
function findDiffrences(inv1, inv2) {
  return inv1.filter((x) => inv2.find((y) => y.id == x.id));
}

world.events.playerJoin.subscribe((data) => {
  INVENTORYS[data.player.name] = getInventoryItems(data.player);
});

forEachValidPlayer((player) => {
  const oldInv = INVENTORYS[player.name];
  const currentInv = getInventoryItems(player);
  console.warn(
    JSON.stringify(findDiffrences(oldInv, currentInv).map((i) => (i = i.id)))
  );
  INVENTORYS[player.name] = currentInv;
}, 50);
