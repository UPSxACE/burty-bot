const { SlashCommandBuilder } = require('discord.js');
const gifapi = require('../modules/gifAPI.js');
function transformMention(mention) {
  return mention.slice(2, -1);
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName('shoot')
    .setDescription('Shoots a user.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('Select a member to shoot')
        .setRequired(true)
    ),
  async execute(interaction) {
    const term = 'anime shoot';
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: `${await interaction.member.user
            .username} shoots ${await interaction.options.getUser('target')
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
          const term = 'anime shoot';
          await message.reply({
            content: null,
            embeds: [
              {
                title: `${message.author.username} shoots ${targetuser.username} !`,
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
          const term = 'anime shoot';
          await message.reply({
            content: null,
            embeds: [
              {
                title: `${message.author.username} shoots ${targetuser.username} !`,
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
      const term = 'anime shoot';
      await message.reply({
        content: null,
        embeds: [
          {
            title: `${message.author.username} shoots ${message.author.username} !`,
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
