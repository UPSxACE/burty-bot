const { SlashCommandBuilder } = require('discord.js');
const gifapi = require('../modules/gifAPI.js');
module.exports = {
  data: new SlashCommandBuilder().setName('laugh').setDescription('Lol!'),
  async execute(interaction) {
    const term = 'anime laugh';
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user.username} Laughed!`,
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
      const term = 'anime laugh';
      await message.reply({
        content: null,
        embeds: [
          {
            title: `${message.author.username} Laughed!`,
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
