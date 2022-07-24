import {
  ActionFormData,
  ActionFormResponse,
  MessageFormData,
  MessageFormResponse,
  ModalFormData,
  ModalFormResponse,
} from "mojang-minecraft-ui";
import { sleep } from "../../../Utilities/scheduling";
import { ChestGUI } from "./ChestGUI";

export class ItemGrabbedCallback {
  /**
   *
   * @param {ChestGUI} gui the chest gui
   * @param {import("./Page").Slot} slot the slot informtaion
   * @param {import("./ChestGUI").SlotChangeReturn} change change that occured
   */
  constructor(gui, slot, change) {
    this.gui = gui;
    this.slot = slot;
    this.change = change;
  }

  /**
   * Gives the player the item the grabbed
   * @param {ChestGUI} chestGUI chest gui used
   * @param {import("./Page.js").Item} Item item that was grabbed
   */
  GiveAction() {
    this.gui.player
      .getComponent("minecraft:inventory")
      .container.addItem(this.slot.item.itemStack);
  }

  /**
   * Changes the page of the chestGui when this item is grabbed
   * @param {String} page page to send to
   */
  PageAction(page) {
    this.gui.setPage(page);
  }

  /**
   * Closes the chect GUI when this item is grabbed
   */
  CloseAction() {
    this.gui.kill();
  }

  /**
   * Sets the item back
   */
  SetAction() {
    /**
     * @type {InventoryComponentContainer}
     */
    const container = this.gui.entity.getComponent(
      "minecraft:inventory"
    ).container;
    container.setItem(this.change.slot, this.slot.item.itemStack);
  }

  /**
   * Opens a form to the player
   * @param {ActionFormData | ModalFormData | MessageFormData} form form to load
   * @returns {Promise<ActionFormResponse | ModalFormResponse | MessageFormResponse>}
   */
  async FormAction(form) {
    this.CloseAction();
    await sleep(5)
    return await form.show(this.gui.player);
  }
}
