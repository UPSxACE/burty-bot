const { SlashCommandBuilder } = require('discord.js');
const profilesTracker = require('../modules/profilesTracker');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Change the bot settings for you.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('username')
        .setDescription(
          'Set the username in your profile card. Leave empty to let it go back to default.'
        )
        .addStringOption((option) =>
          option
            .setName('username')
            .setDescription('The new username')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('aboutme')
        .setDescription('Set the about me message in your profile card.')
        .addStringOption((option) =>
          option
            .setName('aboutme')
            .setDescription('The new about me message')
            .setRequired(true)
        )
    ),
};
