import { world } from "mojang-minecraft";
import * as SA from "../../../Smelly Api/index.js";

const registerInformation = {
  cancelMessage: true,
  name: "test",
  description: "Sell command",
  usage: "<everything | item name>",
  example: ["sell everything", "sell diamond"],
};

SA.build.command.register(registerInformation, (chatmsg, args) => {
  SA.build.chat.runCommand(`say boi`);
  console.warn("setting tick timeout");
  SA.untils.setTickTimeout(() => {
    console.warn(`timeout`);
  }, 100);
  console.warn("timeout set");
});
