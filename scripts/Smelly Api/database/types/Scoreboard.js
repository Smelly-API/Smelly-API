import { world } from "mojang-minecraft";
import { Chat } from "../../app/Providers/Chat";
import { database } from "../../config/index.js";
import { text } from "../../lang/text.js";

/**
 * Minecraft Bedrock Gametest Database
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This database stores data on players inside a objective
 * Each objective can only store 32768 string data inside its players
 * So we split up the save and save it across chunks in multiple objectives
 * --------------------------------------------------------------------------
 */

/**
 * The max string size of a objective, 32768 is max NBT
 */
const MAX_DATABASE_STRING_SIZE = database.MAX_DATABASE_STRING_SIZE;

/**
 * Splits a string into chunk sizes
 * @param {string} str string to split
 * @param {number} length length of string
 * @returns {Array<string>}
 */
function chunkString(str, length) {
  return str.match(new RegExp(".{1," + length + "}", "g"));
}

/**
 * Runs a Command
 * @param {string} command a minecraft /command
 * @param {string} dimension: "overworld" | "nether" | "the end"
 * @param {boolean} debug: true console logs the command, else it runs command
 * @example runCommand(`say test`)
 */
function runCommand(command, dimension = "overworld", debug = false) {
  Chat.runCommand(command, dimension, debug);
}

/**
 * Convert string to binary
 * @param {String} text you want to trasnslate to binary
 * @returns {String}
 */
function textToBinary(text) {
  return text
    .split("")
    .map((char) => {
      return char.charCodeAt(0).toString(2);
    })
    .join(" ");
}
/**
 * Convert binary to string
 * @param {String} binary the binary that you want converted
 * @returns {String}
 */
function binaryToText(binary) {
  return binary
    .split(" ")
    .map((char) => {
      return String.fromCharCode(parseInt(char, 2));
    })
    .join("");
}

export class ScoreboardDatabase {
  /**
   * Creates a new database
   * @param {String} TABLE_NAME a three letter short name for this DB
   */
  constructor(TABLE_NAME) {
    if (!/^([a-zA-Z]{1,16})$/.test(TABLE_NAME))
      return new Error(text["api.database.error.table_name"](TABLE_NAME, 16));
    this.TABLE_NAME = TABLE_NAME;
    this.MEMORY = [];
    this.build();
    this.fetch();
  }

  /**
   * This grabs all the data from the database every time the world is loaded
   */
  fetch() {
    try {
      for (let i = 0; i <= this.SAVE_NAMES; i++) {
        const name = `${this.INDEX}_${i}`;
        const regex = new RegExp(`(?<=${name}\\()[0-1\\s]+(?=\\))`);
        const RAW_TABLE_DATA = this.SCOREBOARD_DATA.match(regex)[0];
        this.MEMORY.push({ index: i, data: `${RAW_TABLE_DATA}` });
      }
    } catch (error) {
      this.MEMORY = [{ index: 0, data: "01111011 01111101" }];
    }
  }

  /**
   * This builds the database and make sure the database is set
   * @param {String} objective
   */
  build(objective = this.TABLE_NAME) {
    runCommand(`scoreboard objectives add "DB_GLOBAL" dummy`);
    runCommand(`scoreboard objectives add ${objective} dummy`);
    runCommand(`scoreboard players add "DB_SAVE" ${objective} 0`);
    runCommand(`scoreboard players add "DB_INDEXS" "DB_GLOBAL" 0`);
  }

  /**
   * Wipes this database and clears all its data
   */
  wipe() {
    this.MEMORY = [];
    for (let i = 0; i <= this.SAVE_NAMES; i++) {
      const name = `${this.INDEX}_${i}`;
      runCommand(`scoreboard objectives remove ${name}`);
    }
    runCommand(`scoreboard objectives remove ${this.TABLE_NAME}`);
    this.build();
  }

  /**
   * Grabs all scoreboard data on the world
   * @returns {String} scoreboard data
   */
  get SCOREBOARD_DATA() {
    return world.getDimension("overworld").runCommand(`scoreboard players list`)
      .statusMessage;
  }

  /**
   * Gets the ammount of saves on this database
   */
  get SAVE_NAMES() {
    try {
      const command = world
        .getDimension("overworld")
        .runCommand(
          `scoreboard players test "DB_SAVE" "${this.TABLE_NAME}" * *`
        );
      return parseInt(command.statusMessage.split(" ")[1]);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Sets the ammount of saves for this database
   */
  set SAVE_NAMES(value) {
    world
      .getDimension("overworld")
      .runCommand(
        `scoreboard players set "DB_SAVE" "${this.TABLE_NAME}" ${value}`
      );
  }

  /**
   * Grabs the index of this database to be used for string conversion
   * @returns {Number | null}
   */
  get INDEX() {
    try {
      const command = world
        .getDimension("overworld")
        .runCommand(
          `scoreboard players test "${this.TABLE_NAME}" "DB_GLOBAL" * *`
        );
      return parseInt(command.statusMessage.split(" ")[1]);
    } catch (error) {
      let index = null;
      try {
        const command = world
          .getDimension("overworld")
          .runCommand(`scoreboard players test DB_INDEXS "DB_GLOBAL" * *`);
        index = parseInt(command.statusMessage.split(" ")[1]) + 1;
      } catch (error) {
        index = 0;
      }
      world
        .getDimension("overworld")
        .runCommand(`scoreboard players set DB_INDEXS "DB_GLOBAL" ${index}`);
      this.INDEX = index;
      return index;
    }
  }

  /**
   * Sets the DB index this is used as small string convesion for the tablename
   */
  set INDEX(value) {
    world
      .getDimension("overworld")
      .runCommand(
        `scoreboard players set "${this.TABLE_NAME}" "DB_GLOBAL" ${value}`
      );
  }

  /**
   * Gets the database from the world
   * @returns {Object}
   */
  get data() {
    try {
      const data = this.MEMORY.map((a) => binaryToText(a.data));
      return JSON.parse(data.join(""));
    } catch (error) {
      return {};
    }
  }

  /**
   * Saves local memory data to database
   * @param {Object} json value to save to DB
   */
  save(json) {
    const SPLIT_DATA = chunkString(
      JSON.stringify(json),
      MAX_DATABASE_STRING_SIZE
    );
    this.wipe();
    for (const [index, chunk] of SPLIT_DATA.entries()) {
      const name = `${this.INDEX}_${index}`;
      this.SAVE_NAMES = index;
      const data = textToBinary(chunk);
      this.MEMORY.push({
        index: index,
        data: data,
      });
      runCommand(`scoreboard objectives add ${name} dummy`);
      runCommand(`scoreboard players set "${name}(${data})" ${name} 0`);
    }
  }

  /**
   * Returns a value of a key
   * @param {String} key key to grab
   * @returns {any | null}
   */
  get(key) {
    const data = this.data;
    return data[key];
  }

  /**
   * Sets a value into the database
   * @param {String} key key to set
   * @param {any} value value to set for the key
   */
  set(key, value) {
    let data = this.data;
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
    let json = this.data;
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
    return Object.keys(this.data);
  }

  /**
   * Get all the values in the table
   * @returns {Array<any>}
   * @example Database.values();
   */
  values() {
    return Object.values(this.data);
  }

  /**
   * Gets all the keys and values
   * @returns {Object}
   * @example Database.getCollection();
   */
  getCollection() {
    return this.data;
  }
}
