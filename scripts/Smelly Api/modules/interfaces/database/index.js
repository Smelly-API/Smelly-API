import { world } from "mojang-minecraft";
import * as SA from "../../../index.js";

export class Database {
  constructor(TABLE_NAME) {
    this.TABLE_NAME = TABLE_NAME;
    this.build();
  }

  build() {
    SA.build.chat.runCommands([
      `scoreboard objectives add database dummy`,
      `scoreboard players add global database 0`,
    ]);
  }

  data() {
    try {
      let raw_data = world
        .getDimension("overworld")
        .runCommand(`scoreboard players list`);
      const regex = new RegExp(
        `(?<=DB${this.TABLE_NAME}\\()[0-1\\s]+(?=\\))`,
        "g"
      );
      const binary_json = raw_data.statusMessage.match(regex);
      if (!binary_json) return {};
      return JSON.parse(SA.untils.binaryToText(binary_json[0])) ?? {};
    } catch (error) {
      console.warn(error + error.stack);
    }
  }

  save(value) {
    try {
      SA.build.chat.runCommand(
        `scoreboard players reset "DB${
          this.TABLE_NAME
        }(${SA.untils.textToBinary(JSON.stringify(this.data()))})" database`
      );
      world
        .getDimension("overworld")
        .runCommand(
          `scoreboard players set "DB${
            this.TABLE_NAME
          }(${SA.untils.textToBinary(JSON.stringify(value))})" database 0`
        );
    } catch (error) {
      console.warn(error + error.stack);
    }
  }

  get(key) {
    const data = this.data();
    return data[key];
  }

  set(key, value) {
    let data = this.data();
    data[key] = value;
    this.save(data);
  }
  /**
   * Check if the key exists in the table
   * @param {string} key
   * @returns {boolean}
   * @example Database.has('Test Key');
   */
  has(key) {
    return this.keys().includes(key);
  }
  /**
   * Delete the key from the table
   * @param {string} key
   * @returns {boolean}
   * @example Database.delete('Test Key');
   */
  delete(key) {
    let json = this.data();
    const status = delete json[key];
    this.save(json);
    return status;
  }
  /**
   * Returns the number of key/value pairs in the Map object.
   * @example Database.size()
   */
  size() {
    return this.keys().length;
  }
  /**
   * Clear everything in the table
   * @example Database.clear()
   */
  clear() {
    this.save({});
  }
  /**
   * Get all the keys in the table
   * @returns {Array<string>}
   * @example Database.keys();
   */
  keys() {
    let json = this.data();
    return Object.keys(json);
  }
  /**
   * Get all the values in the table
   * @returns {Array<any>}
   * @example Database.values();
   */
  values() {
    let json = this.data();
    return Object.values(json);
  }
  /**
   * Gets all the keys and values
   * @returns {any}
   * @example Database.getCollection();
   */
  getCollection() {
    let json = this.data();
    return json;
  }
}
