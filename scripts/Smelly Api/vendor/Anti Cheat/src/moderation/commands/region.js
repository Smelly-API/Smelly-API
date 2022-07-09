import { SA } from "../../../../../index.js";
import { STAFF_TAG } from "../../config.js";
import { Ban } from "../../utils/Ban.js";

const command = new SA.Command({
  name: "region",
  description: "Create a Region",
  tags: [STAFF_TAG],
});