import { DynamicPropertiesDefinition, Player, world } from "mojang-minecraft";

export class Permission {
  /**
   * Sets a players permission
   * @param {Player} player player to give permission
   * @param {String} permission permission id to give
   * @param {Boolean} value value of the permission boolean
   * @example Permission.setPlayerPermission(Player, "SA.commands.save", true)
   */
  static setPlayerPermission(player, permission, value) {
    world.events.worldInitialize.subscribe(({ propertyRegistry }) => {
      let q = new DynamicPropertiesDefinition();
      q.defineBoolean(permission);
      propertyRegistry.registerEntityTypeDynamicProperties(q, player);
      player.setDynamicProperty(permission, value);
    });
  }

  /**
   * Gets a players permission
   * @param {Player} player player to give permission
   * @param {String} permission permission id to give
   * @example Permission.getPlayerPermission(Player, "SA.commands.save")
   */
  static getPlayerPermission(player, permission) {
    try {
      return player.getDynamicProperty(permission);
    } catch (error) {
      return false;
    }
  }

  /**
   * Creates a new permission
   * @param {String} name name of the permission
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * Tests if a player meets permission requiremtns
   * @param {Player} player player to test
   * @returns {Boolean}
   */
  isVaild(player) {
    return player.getDynamicProperty(this.name);
  }

  /**
   * Sets a player to this permission
   * @param {Player} player player to add
   * @param {Boolean} value value of the permission boolean
   */
  setPlayer(player, value) {
    world.events.worldInitialize.subscribe(({ propertyRegistry }) => {
      let q = new DynamicPropertiesDefinition();
      q.defineBoolean(this.name);
      propertyRegistry.registerEntityTypeDynamicProperties(q, player);
      player.setDynamicProperty(this.name, value);
    });
  }
}
