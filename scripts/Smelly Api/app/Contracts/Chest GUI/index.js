import { world } from "mojang-minecraft";
import { GUI_ITEM } from "../../../config/chest.js";
import { IEntity } from "../../Models/Entity.js";
import { ChestGUI, CURRENT_GUIS } from "./Models/ChestGUI.js";
import "./static_pages.js";

/*
|--------------------------------------------------------------------------
| Player to Chest GUI Manager
|--------------------------------------------------------------------------
|
| This system makes sure a player always has a chest GUI when they have the
| GUI_ITEM out this is a very important script because without this
| the chest GUI would not spawn or despawn when moved
|
*/
world.events.tick.subscribe(() => {
  for (const player of world.getPlayers()) {
    if (IEntity.getHeldItem(player)?.id != GUI_ITEM) continue;
    let PLAYERS_GUI = CURRENT_GUIS[player.name];
    if (!PLAYERS_GUI) CURRENT_GUIS[player.name] = new ChestGUI(player);
  }
});
