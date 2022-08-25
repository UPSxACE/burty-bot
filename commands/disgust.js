const { SlashCommandBuilder } = require('discord.js');
const gifapi = require('../modules/gifAPI.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('disgust')
    .setDescription('You feel disgusted!'),
  async execute(interaction) {
    const term = 'anime disgust';
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user.username} Feels disgusted!`,
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
      const term = 'anime disgust';
      await message.reply({
        content: null,
        embeds: [
          {
            title: `${message.author.username} Feels disgusted!`,
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
