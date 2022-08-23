const { SlashCommandBuilder } = require('discord.js')
const gifapi = require('../modules/gifAPI.js')
module.exports = {
  data: new SlashCommandBuilder().setName('dab').setDescription('Dabbing!'),
  async execute(interaction) {
    const term = 'anime dab'
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user.username} Dabbed!`,
          color: null,
          image: {
            url: await gifapi(term),
          },
        },
      ],
      attachments: [],
    })
  },
  async executeManual(message, content) {
    if (content[0]) {
      const term = 'anime dab'
      await message.reply({
        content: null,
        embeds: [
          {
            title: `${message.author.username} Dabbed!`,
            color: null,
            image: {
              url: await gifapi(term),
            },
          },
        ],
        attachments: [],
      })
    }
  },
}
