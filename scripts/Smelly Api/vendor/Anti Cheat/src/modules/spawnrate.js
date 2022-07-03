import { Entity, EntityQueryOptions, world } from "mojang-minecraft";
import { SA } from "../../../../index.js";

/**
 * Minecraft Bedrock Anti Gamemode
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This checks if a entity has spawned right after each other so it checks
 * if one entity has spawned then if antother entity spawns in 50 miliseconds
 * of it it will kill it
 * --------------------------------------------------------------------------
 */

/**
 * The Date.now() time of the last entity spawn
 */
let LAST_ENTIY_SPAWN = null;

/**
 * This is the value of the max entituies that can be present in the world before it kills the new ones
 */
const MAX_WORLD_ENTITIES = 200;

/**
 * This is an array of entities that will be ingored by this check
 */
const IGNORE_ENTITIES = ["minecraft:player", "minecraft:item"];

world.events.entityCreate.subscribe(({ entity }) => {
  const old = LAST_ENTIY_SPAWN;
  LAST_ENTIY_SPAWN = Date.now();
  if (!old || IGNORE_ENTITIES.includes(entity.id)) return;

  const kill = (e = entity) => SA.Models.entity.despawn(e);
  if (old >= Date.now() - 50) return kill();
  const q = new EntityQueryOptions();
  q.excludeTypes = IGNORE_ENTITIES;
  /**
   * @type {Array<Entity>}
   */
  let worldEntites = [];

  for (const dimension of [
    "minecraft:overworld",
    "minecraft:nether",
    "minecraft:the_end",
  ]) {
    [...world.getDimension(dimension).getEntities(q)].forEach((entity) =>
      worldEntites.push(entity)
    );
  }
  if (worldEntites.length < MAX_WORLD_ENTITIES) return;
  for (const entity of worldEntites) {
    kill(entity);
  }
  SA.Providers.chat.broadcast(
    `[Smelly-Anti-Cheat] Despawned ${worldEntites.length}x Entitys`
  );
  worldEntites = [];
});
