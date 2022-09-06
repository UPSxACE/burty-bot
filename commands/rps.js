const { SlashCommandBuilder } = require('discord.js');

const transformMention = require('../utils/transformMention');
const rps = require('../games/rps');
const challenge = require('../modules/challenge');
const profilesTracker = require('../modules/profilesTracker');
const checkCollectorAvailability = require('../utils/checkCollectorAvailability');

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
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('The person to challenge.')
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName('bet')
            .setDescription('Place an amount of coins to bet.')
            .setRequired(false)
        )
    ),
  async execute(interaction) {
    let betamount = 0;
    if (!checkCollectorAvailability(interaction, interaction.user.id)) {
      return;
    }
    switch (interaction.options.getSubcommand()) {
      case 'start':
        await rps('ai', interaction, interaction.user, null);
        break;
      case 'challenge':
        betamount = interaction.options.getNumber('bet');
        try {
          if (betamount > 0) {
            if (
              await profilesTracker.cache.subtractCoinsToUser(
                interaction.user.id,
                betamount
              )
            ) {
              await challenge(
                0,
                interaction,
                interaction.options.getUser('member').id,
                rps,
                betamount
              );
            } else {
              await interaction.reply("You don't have enough coins!");
            }
          } else {
            await challenge(
              0,
              interaction,
              interaction.options.getUser('member').id,
              rps
            );
          }
        } catch (err) {
          console.log('Error CODE 9005');
          interaction.reply("Couldn't find such user :(");
        }

        // await challenge(0, message, rps);
        break;
      default:
        await rps(null, interaction, interaction.user, null);
    }
  },
  async executeManual(message, content) {
    if (!checkCollectorAvailability(message, message.author.id)) {
      return;
    }
    const betamount = Number(content[3]);
    switch (content[1]) {
      case 'start':
        await rps('ai', message, message.author, null);
        break;
      case 'challenge':
        if (content[2]) {
          try {
            if (betamount > 0) {
              if (
                await profilesTracker.cache.subtractCoinsToUser(
                  message.author.id,
                  betamount
                )
              ) {
                await challenge(
                  0,
                  message,
                  transformMention(content[2]),
                  rps,
                  betamount
                );
              } else {
                await message.reply("You don't have enough coins!");
              }
            } else {
              await challenge(0, message, transformMention(content[2]), rps);
            }
          } catch (err) {
            /*
            WARNING: DANGEROUS CHANGE
            try {
              if (betamount > 0) {
                await challenge(0, message, content[2], rps, betamount);
              } else {
                await challenge(0, message, content[2], rps);
              }
            } catch (err) {
              */
            console.log('Error CODE 9005');
            message.reply("Couldn't find such user :(");
            // }
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
