import { BeforeChatEvent, world } from "mojang-minecraft";
import { SA } from "../../../index.js";
import { CommandCallback } from "./Callback.js";
import { CommandOption } from "./Options.js";

/** @type {Array<Command>} */
export const COMMAND_PATHS = [];

/**
 * Returns the acuall command that was used
 * @param {BeforeChatEvent} data chat data that was used
 * @returns {Command}
 * @example this.getChatCommand(BeforeChatEvent)
 */
function getChatCommand(data) {
  const args = getChatAugments(data);
  let checker = (arr, target) => target.every((v, index) => v === arr[index]);
  let command = null;
  const cmds = {};
  for (const command of COMMAND_PATHS) {
    cmds[command.path] = command;
    for (const aliase of command.aliases) {
      let p = [...command.path];
      p[0] = aliase;
      cmds[p] = command;
    }
    if (command.path.length > 1) {
      const a = COMMAND_PATHS.find((cmd) => cmd.name == command.path[0]);
      for (const aliase of a.aliases) {
        let p = [...command.path];
        p[0] = aliase;
        cmds[p] = command;
      }
    }
  }
  for (let [path, cmd] of Object.entries(cmds)) {
    path = path.split(",");
    if (checker(args, path)) command = cmd;
  }
  return command;
}

/**
 * Returns a Before chat events augments
 * @param {BeforeChatEvent} data chat data that was used
 * @returns {Array<string>}
 * @example this.getChatAugments(BeforeChatEvent)
 */
function getChatAugments(data) {
  return data.message
    .slice(SA.prefix.length)
    .trim()
    .match(/"[^"]+"|[^\s]+/g)
    .map((e) => e.replace(/"(.+)"/, "$1").toString());
}

world.events.beforeChat.subscribe((data) => {
  try {
    if (!data.message.startsWith(SA.prefix)) return;
    data.cancel = true;
    let args = getChatAugments(data);
    const command = getChatCommand(data);
    if (
      !command ||
      !command.callback ||
      !command.tags.every((tag) => data.sender.hasTag(tag))
    )
      return SA.Providers.chat.broadcast(
        `commands.generic.unknown`,
        data.sender.nameTag,
        [`§f${args[0]}§c`]
      );
    args.shift();
    args = args.filter((el) => !command.path.includes(el)); // removes command and subcommands from path
    for (let [index, option] of command.options.entries()) {
      if (option.type == "location") {
        if (option.x.verify(args[index])) {
          if (args?.[index + 1] && option.y.verify(args[index + 1])) {
            if (args?.[index + 2] && option.z.verify(args[index + 2])) {
              continue;
            } else {
              index += 2;
            }
          } else {
            index += 1;
          }
        }
      } else {
        if (option.verify(args[index])) continue;
      }
      if (option.optional) break;
      return SA.Providers.chat.broadcast(
        `commands.generic.syntax`,
        data.sender.nameTag,
        [
          `${SA.prefix}${command.path.join(" ")} ${args
            .slice(0, index)
            .join(" ")}`,
          args[index],
          args.slice(index + 1).join(" "),
        ]
      );
    }
    command.sendCallback(data, args);
  } catch (error) {
    console.warn(`${error} : ${error.stack}`);
    data.cancel = false;
  }
});

export class Command {
  /**
   * Register a command
   * @param {Object} CommandInfo description
   * @param {string} CommandInfo.name name of the command
   * @param {string} CommandInfo.description name of the command
   * @param {Array<string>} CommandInfo.aliases other names for the command
   * @param {Array<string>} CommandInfo.tags required tags to use command
   * @param {Array<string>} CommandInfo.path a path of all the command it runs through ["maincommand", "firstsubcommand", "second subcommand"]
   * @param {Array<String>} CommandInfo.permissions A list of permissions the sender must have to run this command
   * @param {function(CommandCallback, Object)} callback Code you want to execute when the command is executed
   * @returns {void}
   * @example new CommandBuilder({ name: "good", description: "subcommand for worldedit" }, callback)
   */
  constructor(CommandInfo, callback = null) {
    this.name = CommandInfo.name.toString().toLowerCase();
    this.description = CommandInfo.description;
    this.aliases = CommandInfo.aliases ?? [];
    this.tags = CommandInfo.tags ?? [];
    this.path = CommandInfo.path ?? [this.name];
    this.permissions = CommandInfo.permissions ?? [];
    /**
     * @type {Array<CommandOption>}
     */
    this.options = [];
    this.callback = callback;

    // adds a new path to the stored global paths
    COMMAND_PATHS.push(this);
  }
  /**
   * Register a subCommand for this command
   * @param {Object} SubCommandInfo description
   * @param {string} SubCommandInfo.name name of the command
   * @param {string} SubCommandInfo.description name of the command
   * @param {Array<string>} SubCommandInfo.tags required tags to use command
   * @param {function(CommandCallback, Object)} callback Code you want to execute when the command is executed
   * @example command.addSubCommand({ name: "good", description: "subcommand for worldedit" }, callback)
   */
  addSubCommand(SubCommandInfo, callback) {
    const newPath = [...this.path];
    newPath.push(SubCommandInfo.name);
    const subCommand = new Command(
      {
        name: SubCommandInfo.name,
        description: SubCommandInfo.description,
        tags: SubCommandInfo.tags,
        path: newPath,
      },
      callback
    );
    return subCommand;
  }

  /**
   * Registers a Usage option for a command
   * @param {string} name name of the option
   * @param {string | Array} type type number of option type
   * @param {string} description description of the option
   * @param {Boolean} optional tells to script to allow the sender to not input this command
   * @returns {Command}
   * @example command.addOption("amount", "int",  "The amount of items to drop")
   */
  addOption(name, type, description, optional = false) {
    if (type == "location") {
      this.options.push({
        name: name,
        type: "location",
        description: description,
        optional: optional,
        x: new CommandOption("x", type, description, optional),
        y: new CommandOption("y", type, description, optional),
        z: new CommandOption("z", type, description, optional),
      });
      return this;
    }
    this.options.push(new CommandOption(name, type, description, optional));
    return this;
  }
  /**
   * Returns a commands name
   * @returns {string}
   * @example this.getName()
   */
  getName() {
    return this.name;
  }
  /**
   * Returns a commands callback
   * @param {BeforeChatEvent} data chat data that was used
   * @param {Array<string>} args aguments used this will exclude command name and subcommand name
   * @returns {void}
   * @example this.sendCallback(BeforeChatEvent, ["2", "sd"])
   */
  sendCallback(data, args) {
    if (!this.callback) return;
    const options = {};
    for (const [i, option] of this.options.entries()) {
      if (option.type == "location") {
        options[option.name] = SA.Utilities.format.parseLocationAugs(
          [args[i], args[i + 1], args[i + 2]],
          {
            location: [
              data.sender.location.x,
              data.sender.location.y,
              data.sender.location.z,
            ],
            viewVector: [
              data.sender.viewVector.x,
              data.sender.viewVector.y,
              data.sender.viewVector.z,
            ],
          }
        );
        continue;
      }
      options[option.name] = option.validate(args[i]);
    }
    this.callback(new CommandCallback(data, args), options);
  }
  /**
   * Registers a callback
   * @param {function(CommandCallback, Object)} callback Code you want to execute when the command is executed
   * @returns {Command}
   * @example executes((ctx) => {})
   */
  executes(callback) {
    this.callback = callback;
    return this;
  }
}
