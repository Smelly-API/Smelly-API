import {
  DynamicPropertiesDefinition,
  EntityTypes,
  world,
} from "mojang-minecraft";
import { Return } from "./app/Exceptions/Return.js";
import { EntityBuild } from "./app/Models/Entity.js";
import { WorldBuild } from "./app/Models/World.js";
import { Request } from "./app/Models/Request.js";
import { Chat } from "./app/Providers/Chat.js";
import { Command } from "./app/Contracts/Commands/Command.js";
import { Permission } from "./app/Contracts/Permission/Permission.js";
import { Group } from "./app/Contracts/Permission/Group.js";
import { text } from "./lang/text.js";
import { emoji } from "./lang/emoji.js";
import { profanity } from "./lang/profanirty.js";
import * as form from "./app/Providers/Form.js";
import * as configuration from "./config/index.js";
import * as tables from "./database/tables.js";
import * as scheduling from "./app/Utilities/scheduling.js";
import * as format from "./app/Utilities/formatter.js";
import { ItemDatabase } from "./database/types/Item.js";
import { ScoreboardDatabase } from "./database/types/Scoreboard.js";
import { DynamicPropertysDatabase } from "./database/types/DynamicPropertys.js";

/**
 * Smelly API
 * @license MIT
 * @author Smell of curry
 * @version 3.0.0
 * --------------------------------------------------------------------------
 * This is the main export file it exports all modules and moduleses
 * of Smelly API please do not try to change or configure any line in this file
 * Because it could end up breaking smelly api and its connected plugins
 * --------------------------------------------------------------------------
 */

export class SA {
  static prefix = configuration.commands.PREFIX;
  static version = configuration.app.VERSION;
  static config = configuration;
  static tables = tables;
  static Command = Command;
  static Permission = Permission;
  static Group = Group;
  static Lang = {
    lang: text,
    emoji: emoji,
    profanity: profanity,
  };
  static Exceptions = {
    return: Return,
  };
  static Models = {
    entity: EntityBuild,
    request: Request,
    world: WorldBuild,
  };
  static Providers = {
    chat: Chat,
    form: form,
  };
  static Utilities = {
    time: scheduling,
    format: format,
    storage: {
      item: ItemDatabase,
      scoreboard: ScoreboardDatabase,
      dynamic: DynamicPropertysDatabase,
    },
  };

  /**
   * Gets the ping of the server
   * @returns {Promise<number>}
   */
  static async getPing() {
    let currentPing = 0;
    let e = world.events.tick.subscribe(({ deltaTime }) => {
      currentPing = 1 / deltaTime;
      world.events.tick.unsubscribe(e);
    });
    return currentPing;
  }

  static async getTick() {
    let tick = 0;
    let e = world.events.tick.subscribe(({ currentTick }) => {
      tick = currentTick;
      world.events.tick.unsubscribe(e);
    });
    return tick;
  }
}

world.events.worldInitialize.subscribe(({ propertyRegistry }) => {
  let q = new DynamicPropertiesDefinition();
  q.defineString("objective", 16);
  propertyRegistry.registerEntityTypeDynamicProperties(
    q,
    EntityTypes.get("mcbehub:floating_text")
  );

  /**
   * Loads Plugins
   */
  import("./vendor/autoload.js");
});
