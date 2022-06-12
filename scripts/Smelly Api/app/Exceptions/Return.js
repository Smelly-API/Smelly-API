export class Return {
  /**
   * Constructs a new Return for a function
   * @param {Boolean} error true or false if there was a error
   * @param {number} statusCode status code for the execute
   * @param {Object} data other data to pass through the return like statusMessage
   * @example new Return(false, {});
   */
  constructor(error = false, statusCode = 0, data = {}) {
    this.error = error;
    this.statusCode = statusCode;
    this.data = data;
  }
}
