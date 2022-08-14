const configSchema = require('../schema/config-schema');

async function updateServerConfig(guildId, updateConfigArgsObject) {
  // if it exists, find by guildId
  await configSchema.findOneAndUpdate(
    {
      _id: guildId,
    },
    // if it doesn't exist create one, if it exists update with the new configs
    { ...updateConfigArgsObject, _id: guildId },
    // (mongoose settings to make it either update or insert)
    {
      upsert: true,
    }
  );

  // Updated cached data with new values
  cache[guildId] = await configSchema.findOne({ _id: guildId });
}

// guildId: {}
const cache = {
  async update(guildId, updateConfigArgsObject) {
    await updateServerConfig(guildId, updateConfigArgsObject);
  },
};

module.exports = { cache };
