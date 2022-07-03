import {
  MinecraftEnchantmentTypes,
  InventoryComponentContainer,
  EnchantmentList,
} from "mojang-minecraft";
import { enchantmentSlot } from "../utils/Enchantments.js";
import { forEachValidPlayer } from "../utils/Players.js";

/**
 * Minecraft Bedrock Anti Enchants
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is an anti enchants. This system is used to check all the players
 * inventorys, it searches it for hacked enchants. It figures out its hacked
 * by using a predifined max level for enchant defined in ../utils/Enchantments.js
 * --------------------------------------------------------------------------
 */

forEachValidPlayer((player) => {
  /**
   * @type {InventoryComponentContainer}
   */
  const container = player.getComponent("minecraft:inventory").container;
  for (let i = 0; i < container.size; i++) {
    const item = container.getItem(i);
    if (!item) continue;
    /**
     * @type {EnchantmentList}
     */
    const enchantments = item.getComponent("enchantments").enchantments;
    const slot = enchantmentSlot[enchantments.slot];
    let change = false;
    for (const Enchantment in MinecraftEnchantmentTypes) {
      const ItemEnchantment = enchantments.getEnchantment(
        MinecraftEnchantmentTypes[Enchantment]
      );
      if (!ItemEnchantment) continue;
      const remove = () => {
        enchantments.removeEnchantment(ItemEnchantment.type);
        change = true;
      };
      if (enchantments.slot == 0) {
        if (!enchantments.canAddEnchantment(ItemEnchantment)) remove();
      } else {
        if (ItemEnchantment.level > (slot[ItemEnchantment.type.id] ?? 0))
          remove();
      }
    }
    if (!change) continue;
    item.getComponent("enchantments").enchantments = enchantments;
    container.setItem(i, item);
  }
});
