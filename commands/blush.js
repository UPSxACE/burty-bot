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
          title: `${await interaction.member.user.username} Blushed!`,
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
            title: `${message.author.username} Blushed!`,
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
