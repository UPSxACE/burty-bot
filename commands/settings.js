const { SlashCommandBuilder } = require('discord.js');
const profilesTracker = require('../modules/profilesTracker');

// Breaking changes were made in this file. Tests are needed.

async function effect(interaction, user, option, newValue) {
  switch (option) {
    case 'username':
      if (
        !profilesTracker.cache[user.id] ||
        newValue != profilesTracker.cache[user.id].customUsername
      ) {
        await profilesTracker.cache.update(user.id, {
          customUsername: newValue,
        });
      }
      await interaction.reply('Custom profile username settings updated!');
      break;
    case 'aboutme':
      if (
        !profilesTracker.cache[user.id] ||
        newValue != profilesTracker.cache[user.id].aboutMe
      ) {
        await profilesTracker.cache.update(user.id, {
          aboutMe: newValue,
        });
      }
      await interaction.reply('Profile about me message settings updated!');
      break;
    default:
      console.log(
        "Something went wrong. Switch statement ended on default on settings.js effect() function. Shouldn't happen"
      );
      break;
  }
}

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
        await effect(interaction, interaction.user, 'username', username);
        break;
      case 'aboutme':
        aboutme = interaction.options.getString('newmessage');
        await effect(interaction, interaction.user, 'aboutme', aboutme);
        break;
    }
  },
  async executeManual(message, content, hasString) {
    switch (content[1]) {
      case 'username':
        if (content[2]) {
          await effect(message, message.author, 'username', content[2]);
        } else {
          console.log(
            "Ace is lazy and didn't program a way of clearing the custom username yet. I'm sorry :')"
          );
          message.reply(
            "Ace is lazy and didn't program a way of clearing the custom username yet. I'm sorry :')"
          );
        }

        break;
      case 'aboutme':
        if (!hasString) {
          await message.reply(
            'You need to type a string in between two quotation marks(") if you want a custom about me message. Example: "Hello there"'
          );
          break;
        }

        await effect(message, message.author, 'aboutme', content[2]);
        break;

      default:
        await message.reply('Select a valid settings option.');
    }

    /*
    if (!hasString) {
      message.reply(
        'You need to type a string in between two quotation marks(").'
      );
    }
    */
  },
};
