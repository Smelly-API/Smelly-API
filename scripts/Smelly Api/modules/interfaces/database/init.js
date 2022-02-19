import { world } from "mojang-minecraft";
import * as SA from "../../../index.js";
import { Database } from "./index.js";

export let db_factions = new Database("factions");
export let db_claims = new Database("claims");
export let db_leaderboards = new Database("leaderboards");