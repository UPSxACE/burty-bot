const mongoose = require('mongoose');

const spcInvitesSchema = new mongoose.Schema({
  // _id = server ID
  _id: { type: String },
  trackedInvites: {
    // inviteId : invite_name
    type: Object,
    // required: true,
  },
  inviteCounts: {
    // inviteId : invitedCounter
    type: Object,
    // required: true,
  },
  invitedList: {
    // inviteId : userIdsArray / Set
    type: Object,
    // required: true,
  },
  inviteRewards: {
    // inviteId : {coins: Number, role: String, title: String}
    type: Object,
    // required: true,
  },
});

module.exports = mongoose.model(
  'spcInvitesSchema',
  spcInvitesSchema,
  'spcInvitesSchema'
);
