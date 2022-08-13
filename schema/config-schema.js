const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  _id: { type: String },
  setlogging: {
    type: Boolean,
    // required: true,
  },
});

module.exports = mongoose.model('config', configSchema, 'config');
