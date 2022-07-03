import { SA } from "../../../../index.js";
import { db_leaderboards } from "../index.js";
import { Leaderboard } from "./Leaderboard.js";

const command = new SA.Command({
  name: "leaderboard",
  aliases: ["lb"],
  description:
    "Create custom leaderboards that track players data in the world",
  tags: ["owner"],
});

command
  .addSubCommand({
    name: "create",
    description: "Create a Leaderboard",
    tags: ["owner"],
  })
  .addOption("objective", "string", "Objective for leaderboard")
  .addOption("position", "location", "Location to create the leaderboard")
  .executes((ctx, { objective, position }) => {
    new Leaderboard(objective, position, ctx.sender.dimension);
    ctx.reply("slb.success.command.createlb", [
      objective,
      position.x,
      position.y,
      position.z,
    ]);
    return ctx.sender.playSound(`random.orb`);
  });

command
  .addSubCommand({
    name: "remove",
    description: "Removes a leaderboard by postion in your current dimension",
    tags: ["owner"],
  })
  .addOption("position", "location", "Location to create the leaderboard")
  .executes((ctx, { position }) => {
    const entities = ctx.sender.dimension
      .getEntitiesAtBlockLocation(position)
      .filter((entity) => entity.id == "mcbehub:floating_text");
    if (!entities[0])
      return ctx.reply(
        `No Leaderboard exsists at ${position.x} ${position.y} ${position.z}`
      );
    entities[0].triggerEvent("kill");
    ctx.reply("slb.success.command.removelb", [
      position.x,
      position.y,
      position.z,
    ]);
    return ctx.sender.playSound(`random.orb`);
  });

command
  .addSubCommand({
    name: "list",
    description: "Lists all leaderboards",
    tags: ["owner"],
  })
  .addOption("page", "int", "Page number", true)
  .executes((ctx, { page }) => {
    const leaderboards = db_leaderboards.values();
    let current_page = isNaN(page) ? 1 : page;
    const max_pages = Math.ceil(leaderboards.length / 7);
    if (current_page > max_pages) current_page = max_pages;
    SA.Providers.chat.broadcast(
      `§2--- Showing Leaderboard's page ${current_page} of ${max_pages} (-lb list <page>) ---`
    );
    [...leaderboards]
      .splice(current_page * 7 - 7, current_page * 7)
      .forEach((leaderboard) => {
        ctx.reply(`slb.command.list.leaderboard`, [
          leaderboard.objective,
          leaderboard.location["x"],
          leaderboard.location["y"],
          leaderboard.location["z"],
          leaderboard.location["dimension"],
        ]);
      });
  });
