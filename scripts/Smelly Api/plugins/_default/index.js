import { world } from "mojang-minecraft";
import * as SA from "../../../Smelly Api/index.js";

SA.build.command.register(
  {
    cancelMessage: true,
    name: "test",
    description: "Test command",
    usage: [""],
  },
  (chatmsg, args) => {
    console.warn("this command was used!");
  }
);
