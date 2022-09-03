// returns true if available, returns false. It will also send the reply.

const collectors = require('../modules/userCollectors');
const usersPlaying = require('../modules/usersPlaying');
const usersMatch = require('../modules/usersMatch');

module.exports = (repliableObj, userId, userId2) => {
  if (userId2 && (collectors[userId2] || usersPlaying[userId2])) {
    repliableObj.reply('That user is currently not available!');
    // ...for a match
    return false;
  } else if (collectors[userId] || usersPlaying[userId]) {
    if (usersMatch[userId2] && usersMatch[userId2].failMessage) {
      repliableObj.reply(usersMatch[userId2].failMessage);
      return false;
    } else {
      repliableObj.reply(`<@${userId}>, you are currently not available!`);
      // ...for a match
      return false;
    }
  }

  return true;
};
