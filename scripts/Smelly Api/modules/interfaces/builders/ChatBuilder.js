import { world } from "mojang-minecraft";
import * as SA from "../../index.js";
class ChatBuilder {
  /**
   * Broadcast a message in chat
   * @param {string} text Message or a lang code
   * @param {string} player Player you want to broadcast to
   * @param {Array<string>} with_ lang arguments
   * @returns {any} For commands that return data, returns a JSON structure with command response values.
   * @example broadcast('Hello World!');
   */
  broadcast(text, player, args = []) {
    try {
      args = args.map(String).filter((n) => n);
      return SA.build.chat.runCommand(
        `tellraw ${
          player ? `"${player}"` : "@a"
        } {"rawtext":[{"translate":"${text}","with":${JSON.stringify(args)}}]}`
      );
    } catch (error) {
      return { error: true };
    }
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
      let error = false;
      commands.forEach((cmd) => {
        if (error && conditionalRegex.test(cmd)) return;
        error = this.runCommand(cmd.replace(conditionalRegex, "")).error;
      });
    } catch (error) {
      return { error: error };
    }
  }
}
export const chat = new ChatBuilder();
