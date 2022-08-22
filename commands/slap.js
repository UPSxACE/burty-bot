const { SlashCommandBuilder } = require('discord.js')
const gifapi = require('../modules/gifAPI.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slaps a user.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('Select a member to slap')
        .setRequired(true),
    ),
  async execute(interaction) {
    const term = 'anime slap'
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user
            .username} slapped ${await interaction.options.getUser('target')
            .username} !`,
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
    if (content[1]) {
      const term = 'anime slap'
      await interaction.reply({
        content: null,
        embeds: [
          {
            title: `${await interaction.member.user.username} slapped ${
              content[1]
            } !`,
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
