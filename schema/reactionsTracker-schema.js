const mongoose = require('mongoose');

const reactionsTracker = new mongoose.Schema({
  // _id = server ID
  _id: { type: String },
  trackedChannels: {
    type: Object,
  },
});

module.exports = mongoose.model(
  'reactionsTracker',
  reactionsTracker,
  'reactionsTracker'
);
