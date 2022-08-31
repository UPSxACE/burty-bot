const mongoose = require('mongoose');

const profilesSchema = new mongoose.Schema({
  // _id = user ID
  _id: { type: String },
  level: { type: Number },
  currentXP: { type: Number },
  maxXP: { type: Number },
  activityPoints: { type: Number },
  lastDailyClaimedMlSec: { type: Number },
  streakLevel: { type: Number },
  coins: { type: Number, min: 0 },
  customUsername: { type: String },
  aboutMe: { type: String },
  currentTitle: { type: String },
  availableTitles: { type: [String] },
  inventory: { type: [Object] },
  // inviter: {%serverID%: %inviterID%}
  inviter: { type: Object },
  inviteCountGlobal: { type: Number },
  // Server ID = 012
  // inviteCountServer: {012 : { count: 123, invitedPeople:[123,152,155]}, ...} }
  inviteCountServer: { type: Object },
});

module.exports = mongoose.model('profiles', profilesSchema, 'profiles');
