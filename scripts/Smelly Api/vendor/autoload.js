/*
|--------------------------------------------------------------------------
| Autoload Plugins
|--------------------------------------------------------------------------
|
| This file is for loading in the plugins that have been imported in
| as these files need to be loaded in my import you need to List the
| import refrence down below leadint to the directors respected index file
| 
*/

/**
 * An array of folder names, to add a plugin simply add the folder name to this array
 */
const Plugins = ["Smelly Api", "Chat Ranks"];

for (const plugin of Plugins) {
  const start = Date.now();
  import(`./${plugin}/index.js`)
    .then(() => {
      console.warn(
        `Loaded Plugin: ${plugin} Successfully, in ${Date.now() - start} ms`
      );
    })
    .catch((error) => {
      console.warn(`Error on Loading Plugin ${plugin}: ` + error + error.stack);
    });
}
