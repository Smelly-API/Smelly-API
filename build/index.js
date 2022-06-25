const JSZip = require("jszip");
const fs = require("fs");
const { v4 } = require("uuid");
const {
  PLUGIN_PATH,
  DEFAULT_PLUGIN,
  PLUGIN_IGNORE_PUSH,
  BUILD_PATH,
  LANGUAGES,
} = require("./config");
const translate = require("@vitalets/google-translate-api");

const zip = new JSZip();
var args = process.argv.slice(2);

/**
 * A list of PLUGINS that are possible to be used
 */
const AVAILABLE_PLUGINS = fs.readdirSync(PLUGIN_PATH);

/**
 * List of PLUGINS to load in this pack
 */
const PLUGINS =
  (args[0] ?? "*") != "*"
    ? args[0].split(",")
    : AVAILABLE_PLUGINS.filter((f) => f != "autoload.js");

PLUGINS.push(DEFAULT_PLUGIN);

/**
 * @typedef {Object} Plugin
 * @property {String} name name of plugin
 * @property {Manifest} manifest manifest of the plugin
 */

/**
 * The main plugin this is used for grabbing readme and other files in the plugins root
 * @type {Plugin}
 */
const MAIN_PLUGIN = {
  name: PLUGINS[0],
  manifest: JSON.parse(
    fs.readFileSync(`${PLUGIN_PATH}/${PLUGINS[0]}/manifest.json`, "utf8")
  ),
};

/**
 * The VERSION of this pack
 */
const VERSION = args[2]
  ? args[2]
  : incrementVersion(
      fs
        .readdirSync(BUILD_PATH)
        .find((f) => f.startsWith(MAIN_PLUGIN.name))
        ?.match(/(\d+\.\d+\.\d+)/)?.[0]
    ) ?? "1.0.0";

/**
 * Increments a version
 * @param {String} version version to increemnt looks like 1.0.0
 * @returns {String} version but +1
 */
function incrementVersion(version) {
  if (!version) return null;
  return (parseInt(version.replaceAll(".", "")) + 1)
    .toString()
    .split("")
    .join(".");
}

/**
 * Grabs a list of files
 * @param {String} dir directory to grab
 * @param {Array<String>} files_ file names to get
 * @returns {Array<String>} paths of files
 */
function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      if (!name.startsWith("scripts/Smelly Api/vendor/"))
        getFiles(name, files_);
      if (!PLUGINS.includes(name.split("/")[3])) continue;

      getFiles(name, files_);
    } else {
      if (name == "scripts/Smelly Api/vendor/autoload.js") {
        zip.file(
          name,
          fs
            .readFileSync(name, "utf8")
            .replace(
              /const Plugins = \[([\S\s]*?)\];/,
              `const Plugins = ${JSON.stringify(PLUGINS)}`
            )
        );
        continue;
      }
      zip.file(name, fs.readFileSync(name));
    }
  }
  return files_;
}
getFiles("scripts");

/**
 * @typedef {Object} Manifest details about a plugin
 * @property {Object} header has details about plugin
 * @property {String} header.name name of plugin
 * @property {String} header.description description of plugin
 * @property {Array} header.version version of pack
 * @property {Array<Dependencie>} dependencies has details about the required other addon modules to import
 * @property {Object} metadata Meta Data about the pack
 * @property {Array<String>} metadata.authors list of authors that worked on this plugin
 * @property {String} metadata.license what pack licenese this has
 * @property {String} metadata.url url of the pack download or resoruce
 */

/**
 * @typedef {Object} Dependencie imports the plugin requires
 * @property {String} directory directory to import from
 * @property {Array<String>} include what to import from from this directory
 */

/**
 * An array of plugin manifests
 * @type {Array<Manifest>}
 */
var manifests = PLUGINS.map((p) =>
  JSON.parse(
    fs.readFileSync(`scripts/Smelly Api/vendor/${p}/manifest.json`, "utf8")
  )
);

for (const manifest of manifests) {
  if (!manifest.dependencies || manifest.dependencies.length == 0) continue;
  for (const dependencie of manifest.dependencies) {
    var files = fs.readdirSync(dependencie.directory);
    for (var i in files) {
      var name = dependencie.directory + "/" + files[i];
      if (!dependencie.include.includes(files[i])) continue;
      zip.file(name, fs.readFileSync(name, "utf8"));
    }
  }
}

zip.file(
  "manifest.json",
  JSON.stringify({
    format_version: 2,
    header: {
      name: "pack.name",
      description: "pack.description",
      min_engine_version: [1, 19, 0],
      uuid: v4(),
      version: VERSION.split(".").map((v) => parseInt(v)),
    },
    modules: [
      {
        description: "Data Module",
        type: "data",
        uuid: v4(),
        version: VERSION.split(".").map((v) => parseInt(v)),
      },
      {
        description: "Gametest Module",
        language: "javascript",
        type: "script",
        uuid: v4(),
        version: VERSION.split(".").map((v) => parseInt(v)),
        entry: "scripts/index.js",
      },
    ],
    dependencies: [
      {
        description: "mojang-minecraft module",
        uuid: "6f4b6893-1bb6-42fd-b458-7fa3d0c89616",
        version: [0, 1, 0],
      },
      {
        description: "mojang-gametest module",
        uuid: "6f4b6893-1bb6-42fd-b458-7fa3d0c89616",
        version: [0, 1, 0],
      },
      {
        description: "mojang-minecraft-ui module",
        uuid: "2BD50A27-AB5F-4F40-A596-3641627C635E",
        version: [0, 1, 0],
      },
    ],
    metadata: {
      authors: ["Smell of curry"],
      license: "MIT",
      url: "https://github.com/smell-of-curry/Smelly-Anti-Cheat",
    },
  })
);

var files = fs.readdirSync(PLUGIN_PATH + `/${MAIN_PLUGIN.name}`);
for (var i in files) {
  if (PLUGIN_IGNORE_PUSH.includes(files[i])) continue;
  var name = PLUGIN_PATH + `/${MAIN_PLUGIN.name}` + "/" + files[i];
  zip.file(files[i], fs.readFileSync(name));
}

async function generateLangFiles(name, description) {
  for (const lanuage of LANGUAGES) {
    let langName = await translate(name, {
      to: lanuage.iso,
    }).then((res) => res.text);
    let langDescription = await translate(description, {
      to: lanuage.iso,
    }).then((res) => res.text);
    zip.file(
      `texts/${lanuage.local}.lang`,
      `pack.name=${langName}\npack.description=${langDescription}`
    );
  }
  zip.file(
    "texts/languages.json",
    JSON.stringify(LANGUAGES.map((lang) => lang.local))
  );
  zip.file(
    "texts/language_names.json",
    JSON.stringify(LANGUAGES.map((lang) => [lang.local, lang.name]))
  );
}

(async () => {
  await generateLangFiles(
    MAIN_PLUGIN.manifest.header.name,
    MAIN_PLUGIN.manifest.header.description
  );

  zip
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(
      fs.createWriteStream(`${BUILD_PATH}/${MAIN_PLUGIN.name} v${VERSION}.zip`)
    )
    .on("finish", function () {
      console.log(
        `Pack.zip Compiled and Outputed in: '${BUILD_PATH}/${MAIN_PLUGIN.name} v${VERSION}.zip'`
      );
    });
  zip
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(
      fs.createWriteStream(
        `${BUILD_PATH}/${MAIN_PLUGIN.name} v${VERSION}.mcpack`
      )
    )
    .on("finish", function () {
      console.log(
        `Pack.mcpack Compiled and Outputed in: '${BUILD_PATH}/${MAIN_PLUGIN.name} v${VERSION}.zip'`
      );
    });
})();
