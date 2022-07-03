import { BlockLocation, Dimension, Entity, world } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { db_leaderboards } from "../index.js";

export class Leaderboard {
  /**
   * Creates a new leaderboard instance
   * @param {String} objective objective of the leaderboard
   * @param {BlockLocation} location location of the leaderboard
   * @param {Dimension} dimension dimension of this lb
   * @param {Entity} entity if this is undefined a new lb will be created
   */
  constructor(objective, location, dimension, entity = null) {
    this.objective = objective;
    this.location = location;
    this.dimension = dimension;
    this.entity = entity;
    if (!entity) this.create();
  }

  /**
   * Creates a new LB
   */
  create() {
    SA.Providers.chat.runCommand(
      `scoreboard objectives add ${this.objective} dummy`
    );
    this.entity = this.dimension.spawnEntity(
      "mcbehub:floating_text",
      this.location
    );
    this.entity.nameTag = "Updating...";
    this.entity.setDynamicProperty("objective", this.objective);
  }

  /**
   * Trys to delete this leaderboard
   * @returns {Boolean}
   */
  delete() {
    try {
      this.entity.triggerEvent("kill");
      return true;
    } catch (error) {
      return false;
    }
  }

  update() {
    const playerOfflineName = "commands.scoreboard.players.offlinePlayerName";
    /**
     * @type {Object<Number, String>}
     */
    const Names = db_leaderboards.getCollection();

    const Objective = world.scoreboard.getObjective(this.objective);
    for (const participant of Objective.getParticipants()) {
      if (participant.type != 1) continue;
      try {
        if (!participant.getEntity()) continue;
      } catch (error) {
        continue;
      }
      if (participant.displayName == playerOfflineName) continue;
      db_leaderboards.set(participant.id, participant.displayName);
    }

    const Scores = Objective.getScores()
      .map((v) => {
        return {
          player:
            v.participant.displayName == playerOfflineName
              ? Names[v.participant.id]
              : v.participant.displayName,
          score: v.score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(
        (v, i) =>
          `§b#${i + 1}§r §g${v.player}§r §e${SA.Utilities.format.numFormatter(
            v.score
          )}§r`
      );

    const color = `§l§9-§f-§9-§f-§9-§f-§9-§f-§9-§f-§9-§f-§9-§f-§9-§f-§9-§f-§9-§f-§9-§f-§r`;
    this.entity.nameTag = `§l§b${
      Objective.displayName
    } §gLeaderboard\n${color}\n${Scores.join("\n")}`;
  }
}
