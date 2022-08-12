const mongoose = require('mongoose');

const yoSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('testa', yoSchema, 'testa');
