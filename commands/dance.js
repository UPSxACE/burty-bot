const { SlashCommandBuilder } = require('discord.js')
const gifapi = require('../modules/gifAPI.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('dance')
    .setDescription('Feel the groove!'),
  async execute(interaction) {
    const term = 'anime dance'
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user.username} Dances!`,
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
      const term = 'anime dance'
      await message.reply({
        content: null,
        embeds: [
          {
            title: `${message.author.username} Dances!`,
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
