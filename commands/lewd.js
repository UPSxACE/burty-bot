const { SlashCommandBuilder } = require('discord.js')
const gifapi = require('../modules/gifAPI.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('lewd')
    .setDescription('Naughty stuff!'),
  async execute(interaction) {
    const term = 'anime lewd'
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user.username} ;)`,
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
