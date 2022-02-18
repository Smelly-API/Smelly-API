import { world } from "mojang-minecraft";

/**
 * Register a tick timeout
 * @param {(data: BeforeChatEvent, args: Array<string>) => void} callback Code you want to execute when the command is executed
 * @param {number} tick time in ticks you want the return to occur
 * @example
 *  SA.TickTimeOutBuild.setTickTimeout(function () {
 *    console.log(`callback`)
 * });
 */
export function setTickTimeout(callback, tick) {
  new tickTimeout(callback, tick);
}
/**
 * Delay executing a function, REPEATEDLY
 * @param {(data: BeforeChatEvent, args: Array<string>) => void} callback Code you want to execute when the command is executed
 * @param {number} tick time in ticks you want the return to occur
 * @returns {number}
 */
export function setTickInterval(callback, tick) {
  new tickTimeout(callback, tick, true);
}
class tickTimeout {
  /**
   * Register a timeout
   * @param {(data: BeforeChatEvent, args: Array<string>) => void} callback Code you want to execute when the command is executed
   * @param {number} time time in Date want the function to run
   */
  constructor(callback, tick, loop = false) {
    this.tickDelay = tick;
    this.callbackTick = 0;
    this.loop = loop;

    let TickCallBack = world.events.tick.subscribe((data) => {
      if (this.callbackTick == 0) {
        this.callbackTick = data.currentTick + this.tickDelay;
      }
      try {
        if (this.callbackTick <= data.currentTick) {
          // return callback
          callback();
          if (this.loop) {
            this.callbackTick = data.currentTick + this.tickDelay;
          } else {
            world.events.tick.unsubscribe(TickCallBack);
          }
        }
      } catch (error) {
        console.warn(`${error} : ${error.stack}`);
      }
    });
  }
}
