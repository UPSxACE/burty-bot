const { SlashCommandBuilder } = require('discord.js');
const gifapi = require('../modules/gifAPI.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slaps a user'),

  async execute(interaction) {
    const term = 'anime slap';
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: '${user} slapped ${user2} !',
          color: null,
          image: {
            url: await gifapi(term),
          },
        },
      ],
      attachments: [],
    });
  },
};
