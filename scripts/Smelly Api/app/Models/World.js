import {
  world,
  BlockLocation,
  Player,
  Entity,
  Dimension,
  PropertyRegistry,
} from "mojang-minecraft";

export class WorldBuilder {
  /**
   * Get list of players in game
   * @param {String} dimension dimension id you want to list
   * @returns {Array<string>}
   * @example PlayerBuilder.list();
   */
  list(dimension = null) {
    if (dimension)
      return [...world.getDimension(dimension).getPlayers()].map(
        (player) => player.nameTag
      );
    return [...world.getPlayers()].map((player) => player.nameTag);
  }
  /**
   * Look if player is in the game
   * @param {Player.name} player Player you are looking for
   * @param {Dimension.id} dimension dimension id you want to look
   * @returns {boolean}
   * @example PlayerBuilder.has('notbeer');
   */
  has(player, dimension = null) {
    return this.list(dimension).includes(player);
  }
  /**
   * Fetch an online players data
   * @param {Player.name} player players nameTag
   * @returns {Player | null}
   */
  fetch(player) {
    return [...world.getPlayers()].find((plr) => plr.name === player);
  }
  /**
   * Get entitie(s) at a position
   * @param {number} x X position of the entity
   * @param {number} y Y position of the entity
   * @param {number} z Z position of the entity
   * @param {String} dimension Dimesion of the entity
   * @returns {Entity}
   * @example EntityBuilder.getEntityAtPos(0, 5, 0, { dimension: 'nether', ignoreType: ['minecraft:player']});
   */
  getEntityAtPos(x, y, z, dimension = "overworld") {
    try {
      return world
        .getDimension(dimension)
        .getEntitiesAtBlockLocation(new BlockLocation(x, y, z));
    } catch (error) {
      return [];
    }
  }

  registerStringProperty(identifer, maxLength) {}
}
export const WorldBuild = new WorldBuilder();
