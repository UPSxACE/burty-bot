// normal, interrupted?
const usersMatch = require('../modules/usersMatch');
const usersPlaying = require('../modules/usersPlaying');
const collectors = require('../modules/userCollectors');

module.exports = (matchHostId) => {
  if (
    usersMatch[matchHostId].player1 &&
    collectors[usersMatch[matchHostId].player1]
  ) {
    collectors[usersMatch[matchHostId].player1].stop();
    collectors[usersMatch[matchHostId].player1] = null;
  }
  if (
    usersMatch[matchHostId].player2 &&
    collectors[usersMatch[matchHostId].player2]
  ) {
    collectors[usersMatch[matchHostId].player2].stop();
    collectors[usersMatch[matchHostId].player2] = null;
  }
  if (
    usersMatch[matchHostId].player1 &&
    usersMatch[matchHostId][usersMatch[matchHostId].player1]
  ) {
    usersMatch[usersMatch[matchHostId].player1] = null;
  }
  if (usersMatch.player2 && usersMatch[usersMatch[matchHostId].player2]) {
    usersMatch[usersMatch[matchHostId].player2] = null;
  }
  if (
    usersMatch[matchHostId].player1 &&
    usersPlaying[usersMatch[matchHostId].player1]
  ) {
    usersPlaying[usersMatch[matchHostId].player1] = null;
  }
  if (
    usersMatch[matchHostId].player2 &&
    usersPlaying[usersMatch[matchHostId].player2]
  ) {
    usersPlaying[usersMatch[matchHostId].player2] = null;
  }
};
