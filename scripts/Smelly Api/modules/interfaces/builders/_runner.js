import { world } from "mojang-minecraft";
import * as SA from "../../../index.js";

world.events.beforeChat.subscribe((data) => {
  try {
    if (!data.message.startsWith(SA.prefix)) return;
    const args = data.message.slice(SA.prefix.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();
    const getCommand = SA.build.command
      .getAllRegistation()
      .filter(
        (element) =>
          element.name === command ||
          (element.aliases && element.aliases.includes(command))
      );
    if (getCommand.length === 0) {
      data.cancel = true;
      return SA.build.chat.runCommand(
        `tellraw "${data.sender.nameTag}" {"rawtext":[{"text":"§c"},{"translate":"commands.generic.unknown", "with": ["§f${command}§c"]}]}`
      );
    }

    if (getCommand[0]?.cancelMessage) data.cancel = true;
    getCommand[0].callback(data, args);
  } catch (error) {
    console.warn(`${error} : ${error.stack}`);
  }
});
