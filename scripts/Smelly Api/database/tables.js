import { ItemDatabase } from "./types/Item";
import { ScoreboardDatabase } from "./types/Scoreboard";

/*
|--------------------------------------------------------------------------
| Scoreboard Databases
|--------------------------------------------------------------------------
|
| This is a list of all then Scoreboard Database consts each one
| registers the database instance on world load to add a new
| one simply construct a new ScoreboardDatabase instance
|
*/

export let basic = new ScoreboardDatabase("default");
export let permissions = new ScoreboardDatabase("permissions");

/*
|--------------------------------------------------------------------------
| Item Databases
|--------------------------------------------------------------------------
|
| This is a list of all then item Database consts each one
| registers the database instance on world load to add a new
| one simply construct a new ItemDatabase instance
|
*/
