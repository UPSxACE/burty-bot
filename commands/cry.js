const { SlashCommandBuilder } = require('discord.js')
const gifapi = require('../modules/gifAPI.js')
module.exports = {
  data: new SlashCommandBuilder().setName('cry').setDescription(':('),
  async execute(interaction) {
    const term = 'anime cry'
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user.username} Is sad`,
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
