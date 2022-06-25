module.exports = {
  /**
   * The path to the addons get outputed
   */
  BUILD_PATH: "./build/output",
  /**
   * The path to where a list of plugin folders are stored
   */
  PLUGIN_PATH: "./scripts/Smelly Api/vendor",
  /**
   * The default plugin that will be enabled
   */
  DEFAULT_PLUGIN: "Smelly Api",
  /**
   * items to ignore in a plugin directory that shouldnt be pushed
   */
  PLUGIN_IGNORE_PUSH: ["src", "manifest.json"],
};
