# Smelly Anti-Cheat

Welcome to Smelly Anti-Cheat. The Top 1% in the bedrock community. Smelly Anticheat is a bedrock focused anticheat that prevents hack clients from hacking. Smelly Anti-Cheat is mainly focused against horion but it works for toolbox and many other Hack Clients.

## Features

Smelly Anti-cheat is coded in the Brand new Smelly API V3. This API is extremly Powerful it builds and expands all the possibilites making this anti-cheat possible

- Check out Smelly API: https://github.com/smell-of-curry/Smelly-API

### Commands:

See all commands in game by running **-help** in chat

- -ban <player: string> <length: int> <unit: string> [reason: string]
- -unban <player: string>
- -freeze <player: string> <reason: string>
- -unfreeze <player: string>
- -mute <player: string> <length: int> <unit: string> <reason: string>

### Modules:

- **Minecraft Bedrock Anti Bad Packet**: This is a bad packet system it checks wether a players selected slotis bad, meaning if the slot is over 8 or under 0. if it flags it it means that the players slot will just be set back so no ban
- **Minecraft Bedrock Anti Bedrock**: This system is used to validate bedrock and make sure its not destroyed or removed. This is used to make sure map gliches cant occur and places it back instally. Works by detecting blocks above them and confirimg bedrock
- **Minecraft Bedrock Anti CBE**: This is a anti hacked items, meaning it checks a players inventory every tick then it tests if they have any banned items, then checks if they have items that have hacked enchants and clears the item from inventory
- **Minecraft Bedrock Anti CBS**: This is a anti CBS it works by testing everytime a player swings, it test if the time between theose attacks was less than 50 miliseconds if it is it will stop that attack
- **Minecraft Bedrock Anti Crasher**: This anti crasher works by testing if a player has reached a location Horion's crasher teleports the player to 30 Million so we just test for That location and if they are there we kick the player (USES: player.json)
- **Minecraft Bedrock Anti Enchants**: This is an anti enchants. This system is used to check all the players inventorys, it searches it for hacked enchants. It figures out its hacked by using a predifined max level for enchant defined in ../utils/Enchantments.js
- **Minecraft Bedrock Anti Fly**: This anti fly works by detecting horizontal velocity, bassicly when the player has reached the FLYING_VELOCITY they are considered flying And if they are considered flying for 1 second they will be teleported back.
- **Minecraft Bedrock Anti Gamemode**: This checks every tick to test if a player has entered a gamemode that they shouldnet be able to get into. If the player has the staff tag it wont check the list of illegle gamemodes are below
- **Minecraft Bedrock Anti Give**: This is a anti give system it works by tracking items. Bassicly it tracks all the possible items a player could obtain and checks if it was possible to get that item if not it will remove that item from inventory
- **Minecraft Bedrock Anti Jesus**: This is a anti phase system. It works by getting the block the player is in every tick. If the block there in is a FULL_BLOCK it will tp the player to there last position where they wernt in one of those blocks
- **Minecraft Bedrock Anti NameSpoof**: This is a anti Bad gamertag it checks when a player joins if there name is invaild it determins its invalid by checking the length and characters in it the requirememts are from xbox gamertag requiremnts
- **Minecraft Bedrock Anti Nuker**: This anti nuker works by loging everytime a player breaks a block Then the next time they break a block it tests the time from now to then And if they broke a block in 50 miliseconds than we place that block back
- **Minecraft Bedrock Anti Ender Pearl Glitching**: This is an anti enderpearl gliching. It checks if an enderpearl is inside a climbable block. if it is it will kill the ender pearl. It uses a list of cliamble blocks and tests the enderpearls location
- **Minecraft Bedrock Anti Phase**: This is a anti phase system. It works by getting the block the player is in every tick. If the block there in is a FULL_BLOCK it will tp the player to there last position where they wernt in one of those blocks
- **Minecraft Bedrock Anti Bad Blocks**: This anti block place stops players from placing unwanted blocks Simpliy when a player places a blocks it tests if that block is banned And cancles that block from being placed, (add more blocks to list)
- **Minecraft Bedrock Anti Reach**: Detect players who are reaching and autmaticly cancel that action Works with block placing, block interacting, block destroying, and hurting entitys. tests by using 7 block max reach distance
- **Minecraft Bedrock Anti Spammer**: This is a anti spammer it works by testing alot of conditions weather its possible to send chats, if its not it will flag the person it will stop the chat from being sent and warn the player
- **Minecraft Bedrock Anti Spawnrate**: This checks if a entity has spawned right after each other so it checks if one entity has spawned then if antother entity spawns in 50 miliseconds of it it will kill it
- **Minecraft Bedrock Anti Speed**: This is a anti speed it works by testing if a players velocity is at a rate that is not possible for normal players.

### Staff Management

Smelly Anti-cheat builds many oportunitys for servers who are using It. Smelly Anti-cheat has a premade Staff tag that **MUST** be added to a player who wants to bypass the anticheat to get staff running

```bash
/tag @s add bd2b2da8-2811-4fb0-8bbd-b544dd01c2ff
```

This tag is grabbed from `scripts\Smelly Api\vendor\Anti Cheat\config.js` You can change it there and regenerate a new Staff Tag or choose your own. This staff tag will disable ALL Modules from running on that player

### Other Plugins

Smelly Anti-cheat also has some other premade plugins auto installed in it. These plugins are

- Chat Ranks,
- Stackable Mobs,
- And Smelly API Default Plugin Folder

## Support

As Smelly Anti-cheat is Still in beta, there might be bugs that you could face. If you need support PLEASE Join the discord and subbmit your problems here: https://discord.gg/dMa3A5UYKX
