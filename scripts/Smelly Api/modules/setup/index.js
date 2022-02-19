import * as SA from "../../index.js";
import { world } from "mojang-minecraft";

SA.build.command.register(
  {
    cancelMessage: true,
    name: "ping",
    description: "Returns the current TPS of the servers ping",
    usage: [""],
  },
  (chatmsg, args) => {
    let pingTick = world.events.tick.subscribe(({ currentTick, deltaTime }) => {
      world.events.tick.unsubscribe(pingTick);
      return SA.build.chat.broadcast(`Server TPS: ${1 / deltaTime}`);
    });
  }
);

SA.build.command.register(
  {
    cancelMessage: true,
    name: "help",
    description: "Provides help/list of commands.",
    usage: ["<page: int>", "[command: CommandName]"],
    example: ["help", "help ping"],
    aliases: ["?", "h"],
  },
  (data, args) => {
    const commands = SA.build.command.getAllRegistation().sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    if (isNaN(args[0]) && args[0] != undefined) {
      // help command
      const command = SA.build.command.getRegistration(args[0]);
      if (!command)
        return SA.build.chat.runCommand(
          `tellraw "${data.sender.nameTag}" {"rawtext":[{"text":"§c"},{"translate":"commands.generic.unknown", "with": ["§f${args[0]}§c"]}]}`
        );
      SA.build.chat.broadcast(
        `§e${command.name} ${
          command.aliases ? "(also " + command.aliases.join(" ,") + ")" : ""
        }:\n${command.description}\n§fUsage:\n -${command.name} ${
          command.usage?.join(`\n -${command.name} `) ?? ""
        }`,
        data.sender.nameTag
      );
    } else {
      // help list
      const current_page = args[0] ? args[0] : "1";
      const max_pages = Math.ceil(commands.length / 7);
      SA.build.chat.broadcast(
        `§2--- Showing help page ${current_page} of ${max_pages} (-help <page>) ---`
      );

      [...commands]
        .splice(current_page * 7 - 7, current_page * 7)
        .forEach((command) => {
          SA.build.chat.broadcast(
            `${SA.prefix}${command.name} ${command.description}`
          );
        });
    }
  }
);
