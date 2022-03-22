import { BeforeChatEvent, world } from "mojang-minecraft";
import * as SA from "../../../index.js";

export class CommandBuilder {
  constructor() {
    this._registrationInformation = [];
    world.events.beforeChat.subscribe((data) => {
      try {
        if (!data.message.startsWith(SA.prefix)) return;
        data.cancel = true;
        const args = data.message
          .slice(SA.prefix.length)
          .trim()
          .match(/"[^"]+"|[^\s]+/g)
          .map((e) => e.replace(/"(.+)"/, "$1"));
        const command = args.shift().toLowerCase();
        const getCommand = SA.build.command
          .getAllRegistation()
          .find(
            (element) =>
              element.name === command ||
              (element.aliases && element.aliases.includes(command))
          );
        if (
          !getCommand ||
          (getCommand.tags.length > 0 &&
            getCommand.tags.every((i) => data.sender.getTags().includes(i)))
        ) {
          return SA.build.chat.runCommand(
            `tellraw "${data.sender.nameTag}" {"rawtext":[{"text":"§c"},{"translate":"commands.generic.unknown", "with": ["§f${command}§c"]}]}`
          );
        }
        getCommand.callback(data, args);
      } catch (error) {
        console.warn(`${error} : ${error.stack}`);
      }
    });
  }
  /**
   * Register a command with a callback
   * @param {registerInformation} register An object of information needed to register the custom command
   * @param {(data: BeforeChatEvent, args: Array<string>) => {BeforeChatEvent, args: Array<string>}} callback Code you want to execute when the command is executed
   * @example import { Server } from "../../Minecraft";
   *  Server.commands.register({ name: 'ping' }, (data, args) => {
   *  Server.broadcast('Pong!', data.sender.nameTag);
   * });
   */
  register(register, callback) {
    this._registrationInformation.push({
      tags: register.tags ?? [], // Required tags to run command
      name: register.name.toLowerCase(), // name of command
      aliases: register.aliases // other names that could run the command
        ? register.aliases.map((v) => v.toLowerCase())
        : null,
      description: register.description ?? "",
      usage: register.usage ?? ["<>"],
      example: register.example ?? null,
      callback,
    });
  }
  /**
   * Get all the registered informations
   * @returns {Array<storedRegisterInformation>}
   * @example getAllRegistration();
   */
  getAllRegistation() {
    return this._registrationInformation;
  }
}
export const CommandBuild = new CommandBuilder();
