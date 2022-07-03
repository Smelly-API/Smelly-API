import { SA } from "../../../../../index.js";
import { STAFF_TAG } from "../../config.js";
import { Ban } from "../../utils/Ban.js";

new SA.Command({
  name: "inv",
  description: "Views the inventory of a player",
  tags: [STAFF_TAG],
})
  .addOption("player", "player", "Player to view")
  .executes((ctx, { player }) => {
    
  });
