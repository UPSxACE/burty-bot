// Returns true if available, otherwise returns false.
// It will also send the reply if repliableObj is given as argument.

const collectors = require('../modules/userCollectors');
const usersPlaying = require('../modules/usersPlaying');
const usersMatch = require('../modules/usersMatch');

module.exports = (repliableObj, userId, userId2) => {
  if (userId2 && usersPlaying[userId2]) {
    if (repliableObj) {
      repliableObj.reply('That user is currently not available!');
    }
    // ...for a match
    return false;
  } else if (userId2 && collectors[userId2]) {
    if (
      collectors[userId2].ended === true ||
      collectors[userId2].notImportant === true
    ) {
      if (collectors[userId2].ended !== true) {
        collectors[userId2].stop();
      }
      collectors[userId2] = null;
    } else {
      if (repliableObj) {
        repliableObj.reply('That user is currently not available!');
      }
      // ...for a match
      return false;
    }
  }

  if (usersPlaying[userId]) {
    if (usersMatch[userId] && usersMatch[userId].failMessage) {
      if (repliableObj) {
        repliableObj.reply(usersMatch[userId].failMessage);
      }
      return false;
    } else {
      console.log('THIS');
      if (repliableObj) {
        repliableObj.reply(`<@${userId}>, you are currently not available!`);
      }
      // ...for a match
      return false;
    }
  } else if (collectors[userId]) {
    if (
      collectors[userId].ended === true ||
      collectors[userId].notImportant === true
    ) {
      if (collectors[userId].ended !== true) {
        collectors[userId].stop();
      }
      collectors[userId] = null;
    } else {
      console.log('THAT');
      if (repliableObj) {
        repliableObj.reply(`<@${userId}>, you are currently not available!`);
      }
      // ...for a match
      return false;
    }
  }

  return true;
};
