import { world } from "mojang-minecraft";
import { SA } from "../../index.js";

export class Chat {
  /**
   * Broadcast a message in chat
   * @param {string} text Message or a lang code
   * @param {string} player Player you want to broadcast to
   * @param {Array<string>} args lang arguments
   * @returns {any} For commands that return data, returns a JSON structure with command response values.
   * @example broadcast('Hello World!');
   */
  static broadcast(text, player, args = []) {
    try {
      args = args.map(String).filter((n) => n);
      text = text.replace(/["]/g, "/'");
      return SA.Providers.chat.runCommand(
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
   * @returns {Object}
   * @example runCommand(`say test`)
   * @author notbeer
   */
  static runCommand(command, dimension = "overworld", debug = false) {
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
   * @param {Array<string>} cmds Put '%' before your commands. It will make it so it only executes if all the commands that came before it executed successfully!
   * @returns {Boolean} returns if all commands ran succesfully
   * @example runCommands([
   * 'clear "Smell of curry" diamond 0 0',
   * '%say Smell of curry has a Diamond!'
   * ]);
   * @author Smell of curry
   */
  static runCommands(cmds) {
    if (cmds[0] && /^%/.test(cmds[0])) return new Error("cmds[0] != %");
    for (let [i, v] of cmds.entries()) {
      if (i > 0 && cmds[i - 1]) return false;
      cmds[i] = this.runCommand(v.replace(/^%/, ""))?.error;
    }
    return true;
  }
}
