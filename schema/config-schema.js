const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  // _id = server ID
  _id: { type: String },
  setlogging: {
    type: String,
    // required: true,
  },
  setmodlogs: {
    type: String,
    // required: true,
  },
  setjoinleave: {
    type: String,
    // required: true,
  },
  setwelcome: {
    type: String,
    // required: true,
  },
  setstarboard: {
    type: String,
    // required: true,
  },
  welcomemessage: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model('config', configSchema, 'config');
