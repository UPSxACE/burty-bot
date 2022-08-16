const mongoose = require('mongoose');

const profilesSchema = new mongoose.Schema({
  _id: { type: String },
  level: { type: Number },
  currentXP: { type: Number },
  maxXP: { type: Number },
  activityPoints: { type: Number },
  streakLevel: { type: Number },
  coins: { type: Number },
  customUsername: { type: String },
  aboutMe: { type: String },
  currentTitle: { type: String },
  availableTitles: [String],
  inventory: [Object],
  // inviter: {%serverID%: %inviterID%}
  inviter: Object,
  inviteCountGlobal: Number,
  // Server ID = 012
  // inviteCountServer: {012 : { count: 123, invitedPeople:[123,152,155]}, ...} }
  inviteCountServer: Object,
});

module.exports = mongoose.model('profiles', profilesSchema, 'profiles');