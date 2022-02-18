import { configuration } from "./config.js";

export const prefix = configuration.prefix;

//modules
export { build, untils, tables } from "./modules/index.js";

// Plugins
import "./plugins/index.js";