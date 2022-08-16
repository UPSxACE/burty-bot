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
      // for now, the reward is the same ammount for both XP and activity points (can change in the future though)
      let reward = 0;

      if (message.content.length > 0 && message.content.length <= 3) {
        messageRewardTimeout[message.author.id] = setTimeout(() => {
          messageRewardTimeout[message.author.id] = null;
        }, 2000);
        reward = 2;
      } else if (message.content.length > 3 && message.content.length <= 30) {
        messageRewardTimeout[message.author.id] = setTimeout(() => {
          messageRewardTimeout[message.author.id] = null;
        }, 4000);
        reward = 10;
      } else if (message.content.length > 30) {
        messageRewardTimeout[message.author.id] = setTimeout(() => {
          messageRewardTimeout[message.author.id] = null;
        }, 5000);
        reward = 15;
      }

      // for now, the reward is the same ammount for both XP and activity points (can change in the future though)
      await profilesTracker.cache.rewardXPAP(message.author.id, reward, reward);
      // console.log(message.author.username + ' rewarded with ' + reward + ' XP and AP!');
    } else {
      // console.log(message.author.username + ' message not rewarded!');
    }
  },
};
