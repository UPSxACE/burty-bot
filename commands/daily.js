const { SlashCommandBuilder } = require('discord.js');
const profilesTracker = require('../modules/profilesTracker');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward!'),
  async execute(interaction) {
    await interaction.reply(
      await profilesTracker.cache.claimDaily(interaction.user.id)
    );
  },
  async executeManual(message, content) {
    await message.reply(
      await profilesTracker.cache.claimDaily(message.author.id)
    );
  },
};
