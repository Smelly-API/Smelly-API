import { world } from "mojang-minecraft";
import * as SA from "../../../index.js";
import { Database } from "./index.js";

export let db_factions = null;
export let db_claims = null;
export let db_leaderboards = null;

let TickCallback = world.events.tick.subscribe((callback) => {
  // first entity has been spawned so your able to get entitys now
  try {
    world.getDimension("overworld").runCommand(`testfor @a`);

    try {
      db_factions = new Database("factions");
      db_claims = new Database("claims");
      db_leaderboards = new Database("leaderboards");
    } catch (error) {
      console.warn(error + error.stack);
    }

    world.events.tick.unsubscribe(TickCallback);
  } catch (error) {}
});
