import { world, EntityHealthComponent } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { Ban } from "../utils/Ban";
import { PlayerLog } from "../utils/PlayerLog";

/**
 * Minecraft Bedrock Anti CBS
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is a anti CBS it works by testing everytime a player swings, it test
 * if the time between theose attacks was less than 50 miliseconds if it is
 * it will stop that attack
 * --------------------------------------------------------------------------
 */

/**
 * The log of the last swing
 */
const log = new PlayerLog();

world.events.entityHurt.subscribe((data) => {
  if (data.projectile || data.cause != "entity_attack") return;
  if (!data.damagingEntity || data.damagingEntity.id != "minecraft:player")
    return;
  const old = log.get(data.damagingEntity);
  log.set(data.damagingEntity, Date.now());
  if (!old) return;
  console.warn(old);
  if (old >= Date.now() - 50) return;
  new Ban(data.damagingEntity, null, null, "Invalid CPS");
  /**
   * @type {EntityHealthComponent}
   */
  const health = data.hurtEntity.getComponent("minecraft:health");
  console.warn(data.damage);
  health.setCurrent(health.current + data.damage);
  SA.Providers.chat.broadcast(
    `You have just been attacked by someone using CPS, the damage they delt has been replinished`,
    data.hurtEntity.nameTag
  );
});
