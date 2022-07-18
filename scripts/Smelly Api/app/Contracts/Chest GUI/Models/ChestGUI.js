import {
  Entity,
  EntityQueryOptions,
  InventoryComponentContainer,
  Items,
  ItemStack,
  MinecraftItemTypes,
  Player,
  PlayerInventoryComponentContainer,
  world,
} from "mojang-minecraft";
import { getItemUid, Page, PAGES } from "./Page.js";
import {
  DEFAULT_STATIC_PAGE_ID,
  ENTITY_INVENTORY,
  GUI_ITEM,
} from "../../../../config/chest.js";
import { IEntity } from "../../../Models/Entity.js";
import { IWorld } from "../../../Models/World.js";
import { ItemGrabbedCallback } from "./ItemGrabbedCallback.js";
import { text } from "../../../../lang/text.js";

/**
 * @typedef {Object} MappedInventoryItem a inventory that has been saved
 * @property {String} uid a unique id for a itemStack
 * @property {ItemStack} item the item
 */

/**
 * @typedef {Object} SlotChangeReturn What gets return on a slot change
 * @property {Number} slot Slot that changed
 * @property {ItemStack} item the item that was grabbed
 */

/**
 * This is a object showing players chestGUI to entity
 * @type {Object<string, ChestGUI>}
 */
export const CURRENT_GUIS = {};

export class ChestGUI {
  /**
   * Finds and returns a slot change in a inventory
   * @param {Array<MappedInventoryItem>} oldInv
   * @param {Array<MappedInventoryItem>} newInv
   * @returns {SlotChangeReturn | null}
   */
  static getSlotChange(oldInv, newInv) {
    if (oldInv.length != newInv.length) return null;
    for (let i = 0; i < oldInv.length; i++) {
      if (oldInv[i].uid != newInv[i].uid)
        return { slot: i, item: oldInv[i].item };
    }
    return null;
  }

  /**
   * Creates a new chestGUI and assigns it to a player
   * @param {Player} player the player this chestGUI is asigned to
   * @param {Entity} entity entity to use if undefined will create one
   */
  constructor(player, entity = null) {
    this.player = player;
    this.playersName = player.name;
    this.entity = entity;
    this.previousMap = null;
    /**
     * @type {Page}
     */
    this.page = null;
    if (!this.entity) this.summon();

    this.events = {
      tick: world.events.tick.subscribe(() => {
        try {
          try {
            if (this.entity.getComponent("minecraft:health").current <= 0)
              return this.kill();
          } catch (error) {
            this.kill();
          }
          if (IEntity.getHeldItem(this.player)?.id != GUI_ITEM)
            return this.kill();
          if (!this.player) return this.kill();

          this.entity.teleport(
            this.player.location,
            this.player.dimension,
            0,
            0
          );

          if (!this.player.hasTag(`has_container_open`)) return;
          if (!this.previousMap) return;
          const change = ChestGUI.getSlotChange(
            this.previousMap,
            this.mapInventory
          );
          if (change == null) return;
          this.onSlotChange(change);
        } catch (error) {}
      }),
      playerLeave: world.events.playerLeave.subscribe(({ playerName }) => {
        if (playerName != this.playersName) return;
        this.kill();
      }),
    };

    CURRENT_GUIS[this.playersName] = this;
  }

  /**
   * This spawns a chest GUI entity and sets the this.entity
   */
  summon() {
    try {
      IWorld.getEntitys(ENTITY_INVENTORY)
        ?.find((e) => e.getTags().includes(`id:${this.playersName}`))
        ?.triggerEvent("despawn");
      let e = world.events.entityCreate.subscribe((data) => {
        if (data.entity?.id == ENTITY_INVENTORY) {
          this.entity = data.entity;
          this.entity.addTag(`id:${this.playersName}`);
          this.setPage(DEFAULT_STATIC_PAGE_ID);
        }
        world.events.entityCreate.unsubscribe(e);
      });
      this.player.triggerEvent("smelly:spawn_inventory");
    } catch (error) {
      console.warn(error + error.stack);
    }
  }

  /**
   * Reloads this chect GUI
   */
  reload() {
    this.entity.triggerEvent("despawn");
    this.summon();
  }

  /**
   * Kills this chestGUI and removes all events
   */
  kill() {
    try {
      this.entity?.triggerEvent("despawn");
    } catch (error) {}
    for (const key in this.events) {
      world.events[key].unsubscribe(this.events[key]);
    }
    delete CURRENT_GUIS[this.playersName];
  }

  /**
   * Sets a container to specific page
   * @param {Number | String} page page number its the index of const PAGES
   * @param {String} extras stuff that needs to be passed into this page
   */
  setPage(id, extras = null) {
    /**
     * @type {Page}
     */
    const page = PAGES[id];
    if (!page) return new Error(text["api.ChestGUI.error.pagenotfound"](id));

    page.fillType(this.entity, page);

    this.page = page;
    this.previousMap = this.mapInventory;
    this.entity.nameTag = `size:${page.size}` ?? "size:27";
    // entity.triggerEvent(`size:${page.size}`);
  }

  /**
   * Gets a entitys inventory but with mapped data
   * @returns {Array<MappedInventoryItem>}
   */
  get mapInventory() {
    let container = this.entity.getComponent("inventory").container;
    let inventory = [];

    for (let i = 0; i < container.size; i++) {
      let currentItem = container.getItem(i);

      inventory.push({
        uid: getItemUid(currentItem),
        item: currentItem,
      });
    }

    this.previousMap = inventory;
    return inventory;
  }

  /**
   * This runs when a slot gets changed in the chest inventory
   * @param {SlotChangeReturn} change slot that was changed
   */
  onSlotChange(change) {
    /**
     * The guiItem that was changed
     * @type {import("./Page.js").Slot}
     */
    const slot = this.page.slots[change.slot];

    if (!slot) {
      // item was added to page
      /**
       * @type {InventoryComponentContainer}
       */
      this.setPage(this.page?.id);
    } else {
      // item was taken from this page
      try {
        /**
         * @type {PlayerInventoryComponentContainer}
         */
        const inventory = this.player.getComponent(
          "minecraft:inventory"
        ).container;
        let itemsToLoad = [];
        for (let i = 0; i < inventory.size; i++) {
          const item = inventory.getItem(i);
          if (!item) continue;
          if (item?.id == slot.item?.id) {
            itemsToLoad.push({ slot: i, item: item });
            if (i < 9) {
              this.player.runCommand(
                `replaceitem entity @s slot.hotbar ${i} air`
              );
            } else {
              this.player.runCommand(
                `replaceitem entity @s slot.inventory ${i - 9} air`
              );
            }
          }
        }
        this.player.runCommand(
          `clear @s ${slot.item?.id} ${slot.item.data} ${slot.item.amount}`
        );
        for (const item of itemsToLoad) {
          inventory.setItem(item.slot, item.item);
        }
      } catch (error) {
        // the item couldnt be cleared that means
        // they now have a item witch is really BAD
        const q = new EntityQueryOptions();
        (q.type = "minecraft:item"), (q.location = this.player.location);
        q.maxDistance = 2;
        [...this.player.dimension.getEntities(q)].forEach((e) => e.kill());
      }
      this.runItemAction(slot, change);
    }

    this.previousMap = this.mapInventory;
  }

  /**
   * Runs a item action when its grabbed out of a container
   * @param {import("./Page").Slot} slot the slot informtaion
   * @param {import("./ChestGUI").SlotChangeReturn} change change that occured
   */
  runItemAction(slot, change) {
    if (!slot.action) return;
    slot.action(new ItemGrabbedCallback(this, slot, change));
  }
}
