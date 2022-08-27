const { SlashCommandBuilder } = require('discord.js');
const gifapi = require('../modules/gifAPI.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('blush')
    .setDescription('Makes your cheeks red'),
  async execute(interaction) {
    const term = 'anime blush';
    await interaction.reply({
      content: null,
      embeds: [
        {
          author: {
            name: `${await interaction.member.user.username} blushed!`,
            icon_url: interaction.member.user.avatarURL(),
          },
          timestamp: new Date().toISOString(),
          color: 15512290,
          image: {
            url: await gifapi(term),
          },
        },
      ],
      attachments: [],
    });
  },
  async executeManual(message, content) {
    if (content[0]) {
      const term = 'anime blush';
      await message.reply({
        content: null,
        embeds: [
          {
            author: {
              name: `${await message.author.username} blushed!`,
              icon_url: message.author.avatarURL(),
            },
            timestamp: new Date().toISOString(),
            color: 15512290,
            image: {
              url: await gifapi(term),
            },
          },
        ],
        attachments: [],
      });
    }
  },
};
