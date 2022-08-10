const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Displays server info.'),
  async execute(interaction) {
    await interaction.reply('Server info.');
  },
};
