const profilesSchema = require('../schema/profiles-schema');

async function updateServerConfig(memberId, updateConfigArgsObject) {
  // if it exists, find by memberId
  await profilesSchema.findOneAndUpdate(
    {
      _id: memberId,
    },
    // if it doesn't exist create one, if it exists update with the new configs
    { ...updateConfigArgsObject, _id: memberId },
    // (mongoose settings to make it either update or insert)
    {
      upsert: true,
    }
  );

  // Updated cached data with new values
  cache[memberId] = await profilesSchema.findOne({ _id: memberId });
}

// memberId: {}
const cache = {
  async update(memberId, updateConfigArgsObject) {
    await updateServerConfig(memberId, updateConfigArgsObject);
  },
};

module.exports = { cache };
