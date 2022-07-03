import "./modules/autoload.js";
import "./moderation/index.js";
import { SA } from "../../../index.js";
import { world } from "mojang-minecraft";

export let db_mutes = new SA.Utilities.storage.scoreboard("mutes");
export let db_freezes = new SA.Utilities.storage.scoreboard("freezes");
export let db_bans = new SA.Utilities.storage.scoreboard("bans");

world.events.playerJoin.subscribe((data) => {
  const { player } = data;
  let e = world.events.tick.subscribe((tick) => {
    try {
      player.runCommand(`scoreboard objectives add dummyid dummy`);
      player.runCommand(`scoreboard players add @s dummyid 0`);
      world.events.tick.unsubscribe(e);
    } catch (error) {}
  });
});
