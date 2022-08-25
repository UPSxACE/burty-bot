const { SlashCommandBuilder } = require('discord.js');
const gifapi = require('../modules/gifAPI.js');
module.exports = {
  data: new SlashCommandBuilder().setName('eat').setDescription('You eat!'),
  async execute(interaction) {
    const term = 'anime eat';
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user.username} Eats!`,
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
      const term = 'anime eat';
      await message.reply({
        content: null,
        embeds: [
          {
            title: `${message.author.username} Eats!`,
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
