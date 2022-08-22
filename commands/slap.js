const { SlashCommandBuilder } = require('discord.js')
const gifapi = require('../modules/gifAPI.js')
function transformMention(mention) {
  return mention.slice(2, -1)
}
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
      try {
        try {
          const targetuser = await message.client.users.fetch(
            transformMention(content[1]),
          )
          const term = 'anime slap'
          await message.reply({
            content: null,
            embeds: [
              {
                title: `${message.author.username} slapped ${targetuser.username} !`,
                color: null,
                image: {
                  url: await gifapi(term),
                },
              },
            ],
            attachments: [],
          })
        } catch (err) {
          const targetuser = await message.client.users.fetch(content[1])
          const term = 'anime slap'
          await message.reply({
            content: null,
            embeds: [
              {
                title: `${message.author.username} slapped ${targetuser.username} !`,
                color: null,
                image: {
                  url: await gifapi(term),
                },
              },
            ],
            attachments: [],
          })
        }
      } catch (err) {
        console.log('ERROR CODE F100')
        message.reply('User not found :(')
      }
    } else {
      const term = 'anime slap'
      await message.reply({
        content: null,
        embeds: [
          {
            title: `${message.author.username} slapped ${message.author.username} !`,
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
