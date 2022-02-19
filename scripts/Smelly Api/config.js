export const configuration = {
  version: '1.0.0',
  mcbe_version: '1.18.10',
  prefix: "-", //Default custom command prefix
  DATABASE: {
    FILE_NAME: "database",
    ENTITY_LOCATION: { x: 0, y: 0, z: 0 },
    ENTITY_IDENTIFIER: "database:database",
    ON_SUMMON_EVENT: "minecraft:entity_spawned",
    ON_SUMMON_NAME: "updating",
    KILL_EVENT: "kill",
  },
};
