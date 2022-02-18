import { world } from "mojang-minecraft";
import * as SA from "../../index.js";
class ChatBuilder {
  /**
   * Broadcast a message in chat
   * @param {string} text Message you want to broadcast in chat
   * @param {string} [player] Player you want to broadcast to
   * @returns {runCommandReturn}
   * @example ServerBuilder.broadcast('Hello World!');
   */
  broadcast(text, player) {
    return SA.build.chat.runCommand(
      `tellraw ${
        player ? `"${player}"` : "@a"
      } {"rawtext":[{"translate":${JSON.stringify(text)}}]}`
    );
  }
  /**
   * Runs a Command
   * @param {string} command a minecraft /command
   * @param {string} dimension: "overworld" | "nether" | "the end"
   * @param {boolean} debug: true console logs the command, else it runs command
   * @example runCommand(`say test`)
   */
  runCommand(command, dimension = "overworld", debug = false) {
    try {
      return debug
        ? console.warn(JSON.stringify(this.runCommand(command)))
        : world.getDimension(dimension).runCommand(command);
    } catch (error) {
      return { error: true };
    }
  }
  /**
   * Run an array of commands
   * @param {Array<string>} commands Put '%' before your commands. It will make it so it only executes if all the commands thta came before it executed successfully!
   * @returns {{ error: boolean }}
   * @example runCommands([
   * 'clear "Smell of curry" diamond 0 0',
   * '%say Smell of curry has a Diamond!'
   * ]);
   */
  runCommands(commands) {
    try {
      const conditionalRegex = /^%/;
      if (conditionalRegex.test(commands[0]))
        throw new Error(
          "[Server]: runCommands(): Error - First command in the Array CANNOT be Conditional"
        );
      commands.forEach((cmd) => {
        this.runCommand(cmd.replace(conditionalRegex, ""));
      });
    } catch (error) {
      return { error: true };
    }
  }
}
export const chat = new ChatBuilder();
