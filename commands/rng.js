const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('rng'),
  async executeManual(message) {
    await message
      .reply(String(Math.floor(Math.random() * 7)))
      .then(function (message) {
        message.react('👍');
        message.react('👎');
      });
  },
};
