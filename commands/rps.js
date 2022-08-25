const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

function transformMention(mention) {
  return mention.slice(2, -1);
}
const rps = require('../games/rps');
const challenge = require('../modules/challenge');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play a rock paper scissors match!')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('start')
        .setDescription(
          'Challenge the bot for a rock paper scissors match. Earn some coins if you win!'
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('challenge')
        .setDescription(
          'Challenge someone for a rock paper scissors match. You can also bet some of your own coins!'
        )
        .addMentionableOption((option) =>
          option.setName('member').setDescription('The person to challenge.')
        )
    ),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
  async executeManual(message, content) {
    switch (content[1]) {
      case 'start':
        await rps('ai', message, message.author, null);
        break;
      case 'challenge':
        console.log(content);
        if (content[2]) {
          try {
            await challenge(0, message, transformMention(content[2]), rps);
          } catch (err) {
            try {
              await challenge(0, message, content[2], rps);
            } catch (err) {
              console.log('Error CODE 9005');
              message.reply("Couldn't find such user :(");
            }
          }
        } else {
          message.reply('You need to specify the user you want to challenge!');
        }
        // await challenge(0, message, rps);
        break;
      default:
        await rps(null, message, message.author, null);
    }
  },
};