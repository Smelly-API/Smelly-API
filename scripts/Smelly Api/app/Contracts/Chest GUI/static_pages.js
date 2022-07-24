import { ActionFormData, ModalFormData } from "mojang-minecraft-ui";
import { DefaultFill } from "./Models/FillTypes.js";
import { Item } from "./Models/Item.js";
import { Page } from "./Models/Page.js";

/**
 * The Home page of this GUI this is the most important because
 * when the GUI is opned it will open up here, any plugin can
 * change this but this is the default screen
 * @type {Page}
 */
export let HOME_PAGE = new Page("home", 54, DefaultFill).setSlots(
  [0, 1, 2, 9],
  new Item("minecraft:wooden_hoe", 1, 0),
  (ctx) => {
    const form = new ActionFormData();
    form.title("form");
    form.button("click");
    ctx.FormAction(form).then((data) => {
      console.warn(`Selection ${data.selection}`);
    });
  }
);
