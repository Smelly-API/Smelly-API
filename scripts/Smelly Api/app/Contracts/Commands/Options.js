import { Types } from "./OptionTypes.js";

export class CommandOption {
  /**
   * Registers a command option
   * @param {string} name name of the option
   * @param {string | Array} type type of the option
   * @param {string} description what is this option for
   * @param {boolean} optional is this optional?
   * @example new CommandOption("name",DefaultType,"the name of this", false)
   */
  constructor(name, type, description, optional = false) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.optional = optional;
  }
  /**
   * Verifys the string to see if it meets the critera of the type
   * @param {string} value
   * @returns {Boolean}
   */
  verify(value) {
    if (Array.isArray(this.type)) return Types.array.validate(value, this.type);
    return Types[this.type].validate(value);
  }
  /**
   * Validates the arg and returns the parsed value
   * @param {string} value
   * @returns {number | Location | boolean | string}
   */
  validate(value) {
    if (Array.isArray(this.type)) return value;
    return Types[this.type].parse(value);
  }
}
