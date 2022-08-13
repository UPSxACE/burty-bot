const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('config', configSchema, 'config');
