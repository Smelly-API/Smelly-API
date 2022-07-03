import { SA } from "../../../index.js";
import { BlockLocation, EntityQueryOptions, world } from "mojang-minecraft";
import "./modules/commands.js";
import { Leaderboard } from "./modules/Leaderboard.js";

export let db_leaderboards = new SA.Utilities.storage.scoreboard(
  "leaderboards"
);

SA.Utilities.time.setTickInterval(() => {
  const q = new EntityQueryOptions();
  q.type = "mcbehub:floating_text";
  for (const entity of world.getDimension("overworld").getEntities(q)) {
    const lb = new Leaderboard(
      entity.getDynamicProperty("objective"),
      new BlockLocation(
        entity.location.x,
        entity.location.y,
        entity.location.z
      ),
      entity.dimension,
      entity
    );
    lb.update();
  }
}, 100);
