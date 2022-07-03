import {
  Enchantment,
  Entity,
  Items,
  ItemStack,
  MinecraftEnchantmentTypes,
} from "mojang-minecraft";
import { DefaultFill } from "./FillTypes";
import { Item } from "./Item";
import { ItemGrabbedCallback } from "./ItemGrabbedCallback";

/**
 * @typedef {Object} Slot a gui slot
 * @property {Item} item the Item in this slot
 * @property {function(ItemGrabbedCallback)} action the that runs when item is grabbed
 */

/**
 * An array of items to fill the chest with this is index slot based so index 0 = slot 0
 *@type {Object<string, Page>}
 */
export const PAGES = {};

/**
 * Converts a itemStack to a unique id
 * @param {ItemStack} item
 * @returns {string}
 */
export function getItemUid(item) {
  let uid = "";
  if (item) {
    let { id, name, amount, data } = item;
    let lore = item.getLore();
    uid = [id, name, amount, data, lore].join("");
  }
  return uid;
}

export class Page {
  /**
   * Items that are in this page
   * @type {Array<Slot>}
   */
  static slots = [];

  /**
   * Converts a itemStack to a  GUI Item
   * @param {ItemStack} item
   * @param {function(ItemGrabbedCallback)} action action to preform when this item is grabbed
   * @param {Object} extras extra info to store on the item
   */
  static itemStackToItem(item, action, extras = {}) {
    const MinecraftEnchantments = Object.values(MinecraftEnchantmentTypes);
    const itemEnchants = item.getComponent("enchantments").enchantments;
    const ItemEnchantTypes = [];
    for (const e of MinecraftEnchantments) {
      /**
       * @type {Enchantment}
       */
      const ench = itemEnchants.getEnchantment(e);
      if (!ench) continue;
      ItemEnchantTypes.push({ level: ench.level, id: ench.type?.id });
    }
    return {
      itemStack: item,
      uid: getItemUid(item),
      action: action,
      extras: extras,
    };
  }

  /**
   * Creats a new page
   * @param {string} id the unique id of this page
   * @param {number} size the size of the GUI
   * @param {Array<Item>} items items in the page
   * @param {function(Entity, Page)} fillType how this page fills
   */
  constructor(id, size, fillType = DefaultFill) {
    if (size % 9 != 0) return new Error("Size needs to be in a increment of 9");
    if (PAGES[id]) return new Error(`Id of ${id} Already exsists`);
    this.id = id;
    this.size = size;
    this.slots = Array(this.size);
    this.fillType = fillType;
    PAGES[id] = this;
  }
  /**
   * Adds a item to the page
   * @param {Array<Number>} slot where to position the item
   * @param {Item} item
   * @param {function(ItemGrabbedCallback)} action action to preform when this item is grabbed
   * @returns {Boolean} if it faild or not
   */
  setSlots(slot, Item, action = SetAction) {
    for (const i of slot) {
      this.slots[i] = { item: Item, action: action };
    }
    return this;
  }
}
