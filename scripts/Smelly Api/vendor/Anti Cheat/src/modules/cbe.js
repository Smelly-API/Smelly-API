import {
  InventoryComponentContainer,
  world,
  ItemStack,
  MinecraftItemTypes,
} from "mojang-minecraft";
import { BANNED_ITEMS } from "../config.js";
import { forEachValidPlayer } from "../utils/Players.js";

/**
 * Minecraft Bedrock Anti CBE
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is a anti hacked items, meaning it checks a players inventory every
 * tick then it tests if they have any banned items, then checks if they have
 * items that have hacked enchants and clears the item from inventory
 * --------------------------------------------------------------------------
 */

/**
 * An empty item stack bassicly means air
 */
const EMPTY = new ItemStack(MinecraftItemTypes.air);

/**
 * The max a item stack ammount can be
 */
const MAX_STACK_AMMOUNT = 64;

/**
 * This is the max length a itemsNametag can be before its considerd hacked
 */
const MAX_NAMETAG_LENGTH = 32;

/**
 * Enttiies that are not allowed to spawn because they can be used by CBE
 */
const CBE_ENTITIES = ["minecraft:command_block_minecart"];

forEachValidPlayer((player) => {
  /**
   * @type {InventoryComponentContainer}
   */
  const container = player.getComponent("minecraft:inventory").container;
  for (let i = 0; i < container.size; i++) {
    const item = container.getItem(i);
    if (!item) continue;
    const clear = () => container.setItem(i, EMPTY);
    if (item.amount > MAX_STACK_AMMOUNT) return clear();
    if (BANNED_ITEMS.includes(item.id)) return clear();
    if (item.nameTag?.length > MAX_NAMETAG_LENGTH) return clear();
  }
});

world.events.entityCreate.subscribe((data) => {
  const kill = () => data.entity.kill();
  if (CBE_ENTITIES.includes(data.entity.id)) return kill();
});
