const { SlashCommandBuilder } = require('discord.js')
const gifapi = require('../modules/gifAPI.js')
module.exports = {
  data: new SlashCommandBuilder().setName('dodge').setDescription('You dodge!'),
  async execute(interaction) {
    const term = 'anime dodge'
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user.username} Dodged!`,
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
