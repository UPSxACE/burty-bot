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
            .setName('newname')
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
            .setName('newmessage')
            .setDescription('The new about me message')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    let username = '';
    let aboutme = '';
    // const subcommand = await ;
    switch (interaction.options.getSubcommand()) {
      case 'list':
        // ...
        break;
      case 'username':
        username = interaction.options.getString('newname');
        if (
          !profilesTracker.cache[interaction.user.id] ||
          username.customUsername !=
            profilesTracker.cache[interaction.user.id].customUsername
        ) {
          await profilesTracker.cache.update(interaction.user.id, {
            customUsername: username,
          });
        }
        await interaction.reply('Custom profile username settings updated!');
        break;
      case 'aboutme':
        aboutme = interaction.options.getString('newmessage');
        if (
          !profilesTracker.cache[interaction.user.id] ||
          aboutme != profilesTracker.cache[interaction.user.id].aboutMe
        ) {
          console.log(aboutme);
          await profilesTracker.cache.update(interaction.user.id, {
            aboutMe: aboutme,
          });
        }
        await interaction.reply('Profile about me message settings updated!');
        break;
    }
  },
};
