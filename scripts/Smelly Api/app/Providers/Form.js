import { Player } from "mojang-minecraft";
import {
  ModalFormData,
  MessageFormData,
  ActionFormData,
} from "mojang-minecraft-ui";
import { text } from "../../lang/text.js";

/**
 * The types a form can be
 */
const FORM_TYPES = {
  action: ActionFormData,
  modal: ModalFormData,
  message: MessageFormData,
};

class Form {
  /**
   * Creates a new SA form
   * @param {String} type the type of the form
   * @param {String} title title of this form
   * @param {Player} player player this form is for
   */
  constructor(type, title, player = null) {
    if (!Object.keys(FORM_TYPES).includes(type))
      return new Error(
        text["api.Providers.form.invaildFormtype"](
          type,
          Object.keys(FORM_TYPES)
        )
      );
    this.type = FORM_TYPES[type];
    this.player = player;

    this.title = title;

    this.features = {
      body: false,
      button: false,
      dropdown: false,
      icon: false,
      slider: false,
      textField: false,
      toggle: false,
    };
  }

  /**
   * Sets the body of the form
   * @param {String} value text to display
   * @throws
   */
  set body(value) {
    const VAILD_TYPES = ["message", "action"];
    if (!VAILD_TYPES.includes(this.type))
      return new Error(text["api.Providers.form.invaildtype"]());
    
  }
}
