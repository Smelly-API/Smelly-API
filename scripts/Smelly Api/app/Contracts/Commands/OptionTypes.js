import { SA } from "../../../index.js";

class DefaultType {
  /**
   * The Fail message for the value
   */
  static fail = "commands.generic.parameter.invalid";
  /**
   * Validates a argument
   * @param {string} value the value to validate
   * @returns {boolean}
   */
  static validate = (value) => value && value != "";
  /**
   * Parses a argument
   * @param {string} value the value to parse
   * @returns {boolean}
   */
  static parse = (value) => value;
}

class IntegerOption extends DefaultType {
  static fail = "commands.generic.num.invalid";
  static validate = (value) => !isNaN(value);
  static parse = (value) => parseInt(value);
}

class FloatOption extends DefaultType {
  static fail = IntegerOption.fail;
  static validate = (value) => value?.match(/^\d+\.\d+$/)?.[0];
  static parse = (value) => parseFloat(value);
}

class LocationOption extends DefaultType {
  static fail = IntegerOption.fail;
  static validate = (value) => value?.match(/^([\~\^]{1})?\d*$/)?.[0];
  static parse = (value) => value;
}

class BooleanOption extends DefaultType {
  static fail = "commands.generic.boolean.invalid";
  static validate = (value) => value?.match(/^(true|false)$/)?.[0];
  static parse = (value) => (value == "true" ? true : false);
}

class PlayerOption extends DefaultType {
  static fail = "commands.generic.player.notFound";
  static validate = (value) => (SA.Models.world.fetch(value) ? true : false);
  static parse = (value) => SA.Models.world.fetch(value);
}

class TargetOption extends DefaultType {
  static fail = "commands.generic.player.notFound";
  static validate = (value) => value?.match(/^(@.|"[\s\S]+")$/)?.[0];
}

class ArrayOption extends DefaultType {
  static fail = "commands.generic.parameter.invalid";
  static validate = (value, types) => types.includes(value);
}

export const Types = {
  string: DefaultType,
  int: IntegerOption,
  float: FloatOption,
  location: LocationOption,
  boolean: BooleanOption,
  player: PlayerOption,
  target: TargetOption,
  array: ArrayOption,
};
