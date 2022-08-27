const { SlashCommandBuilder } = require('discord.js');
const gifapi = require('../modules/gifAPI.js');
const transformMention = require('../utils/transformMention');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('bite')
    .setDescription('Bites a user.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('Select a member to bite')
        .setRequired(true)
    ),
  async execute(interaction) {
    const term = 'anime bite';
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user
            .username} bit ${await interaction.options.getUser('target')
            .username} !`,
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
    if (content[1]) {
      try {
        try {
          const targetuser = await message.client.users.fetch(
            transformMention(content[1])
          );
          const term = 'anime bite';
          await message.reply({
            content: null,
            embeds: [
              {
                title: `${message.author.username} bit ${targetuser.username} !`,
                color: 15512290,
                image: {
                  url: await gifapi(term),
                },
              },
            ],
            attachments: [],
          });
        } catch (err) {
          const targetuser = await message.client.users.fetch(content[1]);
          const term = 'anime bite';
          await message.reply({
            content: null,
            embeds: [
              {
                title: `${message.author.username} bit ${targetuser.username} !`,
                color: 15512290,
                image: {
                  url: await gifapi(term),
                },
              },
            ],
            attachments: [],
          });
        }
      } catch (err) {
        console.log('ERROR CODE F100');
        message.reply('User not found :(');
      }
    } else {
      const term = 'anime bite';
      await message.reply({
        content: null,
        embeds: [
          {
            title: `${message.author.username} bit ${message.author.username} !`,
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
