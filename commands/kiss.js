const { SlashCommandBuilder } = require('discord.js')
const gifapi = require('../modules/gifAPI.js')
function transformMention(mention) {
  return mention.slice(2, -1)
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('Kisses a user.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('Select a member to kiss')
        .setRequired(true),
    ),
  async execute(interaction) {
    const term = 'anime kiss'
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user
            .username} kissed ${await interaction.options.getUser('target')
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
          const term = 'anime kiss'
          await message.reply({
            content: null,
            embeds: [
              {
                title: `${message.author.username} kissed ${targetuser.username} !`,
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
          const term = 'anime kiss'
          await message.reply({
            content: null,
            embeds: [
              {
                title: `${message.author.username} kissed ${targetuser.username} !`,
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
      const term = 'anime kiss'
      await message.reply({
        content: null,
        embeds: [
          {
            title: `${message.author.username} kissed ${message.author.username} !`,
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
