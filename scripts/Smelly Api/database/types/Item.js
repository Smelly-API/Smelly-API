import {
  Entity,
  EntityQueryOptions,
  InventoryComponentContainer,
  ItemStack,
  Location,
  MinecraftItemTypes,
  world,
} from "mojang-minecraft";

/**
 * Minecraft Bedrock Item Database
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * Stores items in a database. This works by having a custom entity at a
 * location then it grabs that entity and ads items to it inventory
 * each item in the inventory is then stored in a scoreboard DB to find it
 * --------------------------------------------------------------------------
 */

/**
 * Where the entity is going to be at
 * @type {Location}
 */
const ENTITY_LOCATION = new Location(0, 0, 0);

const ENTITY_DATABSE_ID = "mcbehub:inventory";

export class ItemDatabase {
  /**
   * The name of the table
   * @param {String} TABLE_NAME
   */
  constructor(TABLE_NAME) {
    this.TABLE_NAME = TABLE_NAME;
  }

  /**
   * Grabs all database entitys
   * @returns {Array<Entity>}
   */
  get ENTITIES() {
    const q = new EntityQueryOptions();
    q.type = ENTITY_DATABSE_ID;
    q.location = ENTITY_LOCATION;
    q.tags = [this.TABLE_NAME];
    return world.getDimension("overworld").getEntities(q);
  }

  /**
   * Returns all items that are stored
   * @returns {Array<ItemStack>}
   */
  get ITEMS() {
    let ITEMS = [];
    for (const entity of this.ENTITIES) {
      /**
       * @type {InventoryComponentContainer}
       */
      const inv = entity.getComponent("minecraft:inventory").container;
      for (let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
        if (!item) continue;
        ITEMS.push(item);
      }
    }
    return ITEMS;
  }

  /**
   * Gets a item by id from inv
   * @param {string} id
   */
  get(id) {
    const item = this.ITEMS.find((item) => item.getLore().includes(id));
    if (!item) return null;
    item.setLore(item.getLore().filter((i) => i !== id));
    return item;
  }

  /**
   * Saves a item to the database
   * @param {ItemStack} item
   * @returns {string} an id to grab the item
   */
  add(item) {
    let entity = null;
    for (const e of this.ENTITIES) {
      /**
       * @type {InventoryComponentContainer}
       */
      const inv = e.getComponent("minecraft:inventory").container;
      console.warn(inv.emptySlotsCount);
      if (inv.emptySlotsCount > 0) {
        entity = e;
        break;
      }
    }
    if (!entity) {
      entity = world
        .getDimension("overworld")
        .spawnEntity(ENTITY_DATABSE_ID, ENTITY_LOCATION);
    }
    try {
      entity.addTag(this.TABLE_NAME);
    } catch (error) {}

    /**
     * @type {InventoryComponentContainer}
     */
    const inv = entity.getComponent("minecraft:inventory").container;
    const ID = Date.now();
    let lore = item.getLore() ?? [];
    lore.push(`${ID}`);
    item.setLore(lore);
    inv.addItem(item);
    return `${ID}`;
  }

  /**
   * deletes a item from the chests
   * @param {string} id
   * @returns {Boolean} If it deleted or not
   */
  delete(id) {
    for (const entity of this.ENTITIES) {
      /**
       * @type {InventoryComponentContainer}
       */
      const inv = entity.getComponent("minecraft:inventory").container;
      for (let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
        if (!item || !item.getLore().includes(id)) continue;
        inv.setItem(i, new ItemStack(MinecraftItemTypes.air));
        return true;
      }
    }
    return false;
  }
}
