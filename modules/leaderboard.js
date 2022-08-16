const profilesSchema = require('../schema/profiles-schema');

const cache = {
  async update() {
    console.log('got here');

    cache['leaderboard'] = await profilesSchema.find().sort({
      activityPoints: 'desc',
    });

    console.log(JSON.stringify(cache['leaderboard']));
  },
};

module.exports = { cache };
