import { world } from "mojang-minecraft";

const openRequests = [
  /**
   * {sender: "Steve", target: "Steve", type: "default"}
   */
];

export class Request {
  /**
   * Registers a new request
   * @param {(data: BeforeChatEvent, args: Array<string>) => void} on_expire Code you wan to execute when the request expires
   * @param {Date} expireDate time in Date want the function to run
   * @param {Player.nameTag} sender nametag of sender
   * @param {Player.nameTag} target nametag of the target getting the request
   * @param {String} type type of invite request optional but will alow you to get all invite request from it
   */
  constructor(
    on_expire,
    expireDate = Date.now(),
    sender,
    target,
    type = "default"
  ) {
    this.callback = on_expire;
    this.expireDate = expireDate;
    this.sender = sender;
    this.target = target;
    this.type = type;

    openRequests.push({
      sender: this.sender,
      target: this.target,
      type: this.type,
    });

    this.TickCallBack = world.events.tick.subscribe((data) => {
      try {
        if (this.expireDate >= Date.now()) {
          // return callback
          this.expire();
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
  cancel() {
    world.events.tick.unsubscribe(this.TickCallBack);
  }
  /**
   * Expire
   */
  expire() {
    this.cancel();
    this.on_expire();
  }
  /**
   * updates the expire time
   * @param {Date} expireDate time in Date want the function to run
   */
  updateExpireDate(expireDate = Date.now()) {
    this.expireDate = expireDate;
  }
}
