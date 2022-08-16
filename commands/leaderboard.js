const { SlashCommandBuilder } = require('discord.js');
const leaderboard = require('../modules/leaderboard');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Shows the leaderboard ranking!'),
  async execute(interaction) {
    leaderboard.cache.update();
    await interaction.reply('Leaderboard updated!');
  },
  async executeManual(message, content) {
    leaderboard.cache.update();
    await message.reply('Leaderboard updated!');
  },
};
