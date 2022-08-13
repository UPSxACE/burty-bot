const mongo = require('../mongo');
const configSchema = require('../schema/config-schema');

async function fetchServerConfig(guildId) {
  await mongo().then(async (mongoose) => {
    try {
      // if it exists, find by guildId
      await configSchema.findOneAndUpdate(
        {
          _id: guildId,
        },
        // if it doesn't exist, create one with default configs
        {
          _id: guildId,
          setlogging: false,
        },
        // (mongoose settings to make it either update or insert)
        {
          upsert: true,
        }
      );
      cache[guildId] = await configSchema.findOne({ _id: guildId });
    } finally {
      mongoose.connection.close();
    }
  });
}

// guildId: {}
const cache = {
  async fetch(guildId) {
    await fetchServerConfig(guildId);
  },
};

module.exports = { cache };
