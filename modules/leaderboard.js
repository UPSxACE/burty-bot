const profilesSchema = require('../schema/profiles-schema');

let timeout = null;

const cache = {
  async update() {
    if (!cache['leaderboard'] || !timeout) {
      // console.log('Leaderboard updated');
      cache['leaderboard'] = await profilesSchema.find().sort({
        activityPoints: 'desc',
      });

      timeout = setTimeout(() => {
        timeout = null;
      }, 6000);

      // console.log(JSON.stringify(cache['leaderboard']));
    } else {
      // console.log('Sending cached version of leaderboard');
      // console.log(JSON.stringify(cache['leaderboard']));
    }
  },
};

module.exports = { cache };
