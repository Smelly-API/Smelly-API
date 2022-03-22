import { world } from "mojang-minecraft";
import * as SA from "../../../Smelly Api/index.js";

SA.build.command.register(
  {
    name: "test",
    description: "Test command",
    usage: [""],
  },
  (data, args) => {
    console.warn("this command was used!");
  }
);

SA.build.command.register(
  {
    name: "ping",
    description: "Returns the current TPS of the servers ping",
    usage: [""],
  },
  (data, args) => {
    let pingTick = world.events.tick.subscribe(({ currentTick, deltaTime }) => {
      SA.build.chat.broadcast(`Server TPS: ${1 / deltaTime}`);
      world.events.tick.unsubscribe(pingTick);
    });
  }
);

SA.build.command.register(
  {
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
      const command = commands.find(
        (element) =>
          element.name === args[0] ||
          (element.aliases && element.aliases.includes(args[0]))
      );
      if (!command)
        return SA.build.chat.broadcast(
          "commands.generic.unknown",
          data.sender.nameTag,
          ["§f${args[0]}§c"]
        );
      SA.build.chat.broadcast(
        `§e${command.name} ${
          command.aliases ? "(also " + command.aliases.join(" , ") + ")" : ""
        }:\n${command.description}\n§fUsage:\n -${command.name} ${
          command.usage?.join(`\n ${SA.prefix}${command.name} `) ?? ""
        }`,
        data.sender.nameTag
      );
    } else {
      // help list
      const current_page = args[0] ? args[0] : "1";
      const max_pages = Math.ceil(commands.length / 7);
      if (current_page > max_pages) current_page = max_pages;
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
