import { BlockInventoryComponentContainer, world } from "mojang-minecraft";

export class BlockInventory {
  /**
   * Coverts a blockInventoryComponentContainer and saves it
   * @param {BlockInventoryComponentContainer} inventory
   */
  constructor(inventory) {
    this.emptySlotsCount = inventory.emptySlotsCount;
    this.size = inventory.size;
    this.items = [];
    for (let i = 0; i < this.size; i++) {
      this.items[i] = inventory.getItem(i);
    }
  }

  /**
   * Loads this inventory onto a BlockInventoryComponentContainer
   * @param {BlockInventoryComponentContainer} block block to load on
   */
  load(block) {
    for (let i = 0; i < block.size; i++) {
      if (!this.items[i]) continue;
      block.setItem(i, this.items[i]);
    }
  }
}
