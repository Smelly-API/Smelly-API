
# Smelly Chat

Welcome to Smelly chat. A fully customizable chat rank addon in minecraft bedrock.
That makes server ownership eaiser, faster and enjoyable.

## Features

Smelly Chat is feature loaded to the most possible things to add to a 
chat rank addon like:

- Instant Loaded Ranks
- Cooldown System
- Customizable config.js
- Default chat ranks
- Built in Tick Scheduling system and verious formatting options
- Simple 1 command ranks


## Commands

Add a Chat rank to a player
```
/tag @s add rank-Owner
```
To add another rank simply just run the command again
```
/tag @s add rank-Staff
```
Remove a rank by running
```
/tag @s remove rank-Staff
```

## Documentation

#### Editing the config
```js
/**
 * The default rank for someone with no rank on server
 */
export const DEFAULT_RANK = "§bMember";

/**
 * Time in seconds for cooldown
 * Set this to 0 to disable cooldowns
 */
export const CHAT_COOLDOWN = 3;
```
To change the DEFAULT_RANK just edit the const
```js
/**
 * The default rank for someone with no rank on server
 */
export const DEFAULT_RANK = "§bUser";

/**
 * Time in seconds for cooldown
 * Set this to 0 to disable cooldowns
 */
export const CHAT_COOLDOWN = 3;
```
Also you can remove the cooldown or add more time by just editing the cooldown
```js
/**
 * The default rank for someone with no rank on server
 */
export const DEFAULT_RANK = "§bUser";

/**
 * Time in seconds for cooldown
 * Set this to 0 to disable cooldowns
 */
export const CHAT_COOLDOWN = 0;
```

**WHEN EDITING THE CONFIG MAKE SURE TO INCREMENT THE `/manifest.json` VERSION**

Old:
```json
  "header": {
    "name": "pack.name",
    "description": "pack.description",
    "min_engine_version": [1, 19, 0],
    "uuid": "4d2c7522-f064-448d-a697-9d7a1c4e4aa6",
    "version": [3, 0, 0]
  },
```
New:
```json
  "header": {
    "name": "pack.name",
    "description": "pack.description",
    "min_engine_version": [1, 19, 0],
    "uuid": "4d2c7522-f064-448d-a697-9d7a1c4e4aa6",
    "version": [3, 0, 1]
  },
```



## Support

Watch the most recent video by Smell of curry:
https://youtu.be/zSiZrsqKSaQ

For support, join the discord: https://discord.gg/dMa3A5UYKX