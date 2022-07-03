import { world } from "mojang-minecraft";
import { PlayerLog } from "./PlayerLog";

export class PreviousLocation {
  /**
   * Saves a constructs a new saved location of a player
   * @param {Player} player this player to use
   * @param {number} tick the current tick of save
   * @param {PlayerLog} storage where to store the locations
   */
  constructor(player, tick, storage) {
    this.player = player;
    this.location = player.location;
    this.dimension = player.dimension;
    this.rotation = player.rotation;
    this.tick = tick;
    this.storage = storage;

    this.events = {
      playerLeave: world.events.playerLeave.subscribe(({ playerName }) => {
        if (playerName == this.player.name) this.expire();
      }),
    };

    this.storage.set(player, this);
  }

  /**
   * Teleports the player back to the previous location
   */
  back() {
    this.player.teleport(
      this.location,
      this.dimension,
      this.rotation.x,
      this.rotation.y
    );
  }

  /**
   * Updates this save to a new location
   */
  update() {
    let a = world.events.tick.subscribe((data) => {
      this.tick = data.currentTick;
      world.events.tick.unsubscribe(a);
    });
    this.location = this.player.location;
    this.dimension = this.player.dimension;
    this.rotation = this.player.rotation;
  }

  /**
   * Expires this previous location
   */
  expire() {
    this.storage.delete(this.player);
    for (const key in this.events) {
      world.events[key].unsubscribe(this.events[key]);
    }
  }
}
