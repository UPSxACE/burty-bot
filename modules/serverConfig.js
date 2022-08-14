const mongo = require('./mongo');
const configSchema = require('../schema/config-schema');

async function updateServerConfig(guildId, updateConfigArgsObject) {
  await mongo().then(async (mongoose) => {
    try {
      // if it exists, find by guildId
      await configSchema.findOneAndUpdate(
        {
          _id: guildId,
        },
        // if it doesn't exist, create one with the new configs
        { ...updateConfigArgsObject, _id: guildId },
        // (mongoose settings to make it either update or insert)
        {
          upsert: true,
        }
      );

      // Updated cached data with new values
      cache[guildId] = await configSchema.findOne({ _id: guildId });
    } finally {
      mongoose.connection.close();
    }
  });
}

// guildId: {}
const cache = {
  async update(guildId, updateConfigArgsObject) {
    await updateServerConfig(guildId, updateConfigArgsObject);
  },
};

module.exports = { cache };
