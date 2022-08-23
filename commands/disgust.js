const { SlashCommandBuilder } = require('discord.js')
const gifapi = require('../modules/gifAPI.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('disgust')
    .setDescription('You feel disgusted!'),
  async execute(interaction) {
    const term = 'anime disgust'
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user.username} Feels disgusted!`,
          color: null,
          image: {
            url: await gifapi(term),
          },
        },
      ],
      attachments: [],
    })
  },
}
