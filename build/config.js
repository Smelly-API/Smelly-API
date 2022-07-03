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
  PLUGIN_IGNORE_PUSH: ["src", "manifest.json", ".git", ".github"],
  /**
   * List of languages to there local, iso and name translation
   */
  LANGUAGES: [
    { local: "en_US", iso: "en", name: "English (US)" },
    { local: "en_GB", iso: "en", name: "English (UK)" },
    { local: "de_DE", iso: "de", name: "Deutsch (Deutschland)" },
    { local: "es_ES", iso: "es", name: "Español (España)" },
    { local: "es_MX", iso: "es", name: "Español (México)" },
    { local: "fr_FR", iso: "fr", name: "Français (France)" },
    { local: "fr_CA", iso: "fr", name: "Français (Canada)" },
    { local: "it_IT", iso: "it", name: "Italiano (Italia)" },
    { local: "ja_JP", iso: "ja", name: "日本語 (日本)" },
    { local: "ko_KR", iso: "ko", name: "한국어 (대한민국)" },
    { local: "pt_BR", iso: "pt", name: "Português (Brasil)" },
    { local: "pt_PT", iso: "pt", name: "Português (Portugal)" },
    { local: "ru_RU", iso: "ru", name: "Русский (Россия)" },
    { local: "zh_CN", iso: "cs", name: "简体中文 (中国)" },
    { local: "zh_TW", iso: "cs", name: "繁體中文 (台灣)" },
    { local: "nl_NL", iso: "nl", name: "Nederlands (Nederland)" },
    { local: "bg_BG", iso: "bg", name: "Български (BG)" },
    { local: "cs_CZ", iso: "cs", name: "Čeština (Česká republika)" },
    { local: "da_DK", iso: "da", name: "Dansk (DA)" },
    { local: "el_GR", iso: "el", name: "Ελληνικά (Ελλάδα)" },
    { local: "fi_FI", iso: "fi", name: "Suomi (Suomi)" },
    { local: "hu_HU", iso: "hu", name: "Magyar (HU)" },
    { local: "id_ID", iso: "id", name: "Bahasa Indonesia (Indonesia)" },
    { local: "nb_NO", iso: "no", name: "Norsk bokmål (Norge)" },
    { local: "pl_PL", iso: "pl", name: "Polski (PL)" },
    { local: "sk_SK", iso: "sk", name: "Slovensky (SK)" },
    { local: "sv_SE", iso: "sv", name: "Svenska (Sverige)" },
    { local: "tr_TR", iso: "tr", name: "Türkçe (Türkiye)" },
    { local: "uk_UA", iso: "uk", name: "Українська (Україна)" },
  ],
};
