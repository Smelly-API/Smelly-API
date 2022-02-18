import { world } from "mojang-minecraft";

export class inviteRequest {
  /**
   * Registers a invite request
   * @param {(data: BeforeChatEvent, args: Array<string>) => void} callback Code you wan to execute when the request expires
   * @param {Date} expireDate time in Date want the function to run
   * @param {Player.nameTag} sender nametag of sender
   * @param {Player.nameTag} target nametag of the target getting the request
   * @param {String} type type of invite request optional but will alow you to get all invite request from it
   */
  constructor(
    callback,
    expireDate = Date.now(),
    sender,
    target,
    type = "default"
  ) {
    this.callback = callback;
    this.expireDate = expireDate;
    this.sender = sender;
    this.target = target;
    this.type = type;

    this.TickCallBack = world.events.tick.subscribe((data) => {
      try {
        if (this.expireDate >= Date.now()) {
          // return callback
          this.callback();
          world.events.tick.unsubscribe(this.TickCallBack);
        }
      } catch (error) {
        console.warn(`${error} : ${error.stack}`);
      }
    });
  }
  /**
   * returns the sender of the invite request
   * @returns {String} Sender
   */
  getSender() {
    return this.sender;
  }
  /**
   * returns the target of the invite request
   * @returns {String} Target
   */
  getTarget() {
    return this.target;
  }
  /**
   * returns the type of invite
   * @returns {String} type
   */
  getType() {
    return this.type;
  }
  /**
   * returns the expire date
   * @returns {Date} expire date
   */
  getExpireDate() {
    return this.expireDate;
  }
  /**
   * Removes invite request
   */
  unsubscribe() {
    world.events.tick.unsubscribe(this.TickCallBack);
  }
  /**
   * updates the expire time
   * @param {Date} expireDate time in Date want the function to run
   */
  setExpireDate(expireDate = Date.now()) {
    this.expireDate = expireDate;
  }
}
