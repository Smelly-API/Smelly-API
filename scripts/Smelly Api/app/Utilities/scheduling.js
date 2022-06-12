import { world } from "mojang-minecraft";
import { SA } from "../../index.js";

/**
 * Sleeps your code
 * @param {number} tick time in ticks you want the return to occur
 * @returns {Promise<void>}
 */
export const sleep = (tick) => {
  return new Promise((resolve) => setTickTimeout(resolve, tick));
};

/**
 * Register a tick timeout
 * @param {(data: BeforeChatEvent, args: Array<string>) => void} callback Code you want to execute when the command is executed
 * @param {number} tick time in ticks you want the return to occur
 */
export function setTickTimeout(callback, tick) {
  new Timeout(callback, tick);
}

/**
 * Delay executing a function, REPEATEDLY
 * @param {(tick: number) => void} callback
 * @param {number} tick
 * @returns {number}
 */
export function setTickInterval(callback, tick) {
  return new Timeout(callback, tick, true);
}

/**
 * Clears a interval
 * @param {Timeout} callback
 */
export function clearTickInterval(callback) {
  callback.expire();
}

/**
 * A list of timeouts that are occuring
 * @type {Map<string, Timeout>}
 */
const TIMEOUTS = new Map();

class Timeout {
  /**
   * Register a timeout
   * @param {() => void} callback On timeout complete code to be executed
   * @param {number} tick tick of the timeout
   */
  constructor(callback, tick, loop = false, id = Date.now()) {
    this.callbackTick = null;
    this.tickDelay = tick;
    this.loop = loop;
    this.callback = callback;
    this.id = id;

    TIMEOUTS.set(id, this);

    this.TickCallBack = world.events.tick.subscribe(({ currentTick }) => {
      if (!this.callbackTick) this.callbackTick = currentTick + this.tickDelay;
      if (this.callbackTick > currentTick) return;
      this.callback(currentTick);

      if (!this.loop) return this.expire();
      this.callbackTick = currentTick + this.tickDelay;
    });
  }

  /**
   * Expires this tickTimeout
   */
  expire() {
    world.events.tick.unsubscribe(this.TickCallBack);
    TIMEOUTS.delete(this.id);
  }
}
