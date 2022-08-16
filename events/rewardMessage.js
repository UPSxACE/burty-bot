// profilesTracker event
const profilesTracker = require('../modules/profilesTracker');
const messageRewardTimeout = [];

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // const memberId = message.author.id;

    // fetch member data from database if not in cache yet (and create user profile if it doesn't exist too)
    if (!profilesTracker.cache[message.author.id]) {
      await profilesTracker.cache.update(message.author.id, {});
    }

    // check if the current user wasn't rewarded last 4 seconds already
    if (!messageRewardTimeout[message.author.id]) {
      console.log('Message reward!');
      messageRewardTimeout[message.author.id] = setTimeout(() => {
        messageRewardTimeout[message.author.id] = null;
      }, 4000);
    } else {
      console.log('Message not rewarded!');
    }
  },
};
