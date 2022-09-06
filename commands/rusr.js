const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
// ! i.user i.customId

const collectors = require('../modules/userCollectors');
const usersPlaying = require('../modules/usersPlaying');
const usersMatch = require('../modules/usersMatch');
const profilesTracker = require('../modules/profilesTracker');
const rusr = require('../games/rusr');
const checkCollectorAvailability = require('../utils/checkCollectorAvailability');
const challenge = require('../modules/challenge');
const transformMention = require('../utils/transformMention');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rusr')
    .setDescription('Play a russian roulette match!')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('start')
        .setDescription(
          'Challenge the bot for a russian roulette match. Earn some coins if you win!'
        )
        .addIntegerOption((option) =>
          option
            .setName('bet')
            .setDescription('Place an amount to bet.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('challenge')
        .setDescription(
          'Challenge someone for a russian roulette match. You can also bet some of your own coins!'
        )
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('The person to challenge.')
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName('bet')
            .setDescription('Place an amount of coins to bet.')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    let betamount = null;

    betamount = interaction.options.getInteger('bet')
      ? interaction.options.getInteger('bet')
      : 100;
    if (betamount < 100) {
      interaction.reply('You cannot bet less than **100 coins**!');
      return;
    }

    const challengedUserId = interaction.options.getMember('member')
      ? interaction.options.getMember('member').id
      : null;
    switch (interaction.options.getSubcommand()) {
      case 'start':
        if (!checkCollectorAvailability(interaction, interaction.user.id)) {
          return;
        }
        if (
          await profilesTracker.cache.subtractCoinsToUser(
            interaction.user.id,
            betamount
          )
        ) {
          rusr('ai', betamount, interaction, interaction.user);
        } else {
          await interaction.reply("You don't have enough coins!");
        }
        break;
      case 'challenge':
        if (!checkCollectorAvailability(interaction, interaction.user.id)) {
          return;
        }
        if (
          await profilesTracker.cache.subtractCoinsToUser(
            interaction.user.id,
            betamount
          )
        ) {
          try {
            await challenge(1, interaction, challengedUserId, rusr, betamount);
          } catch (err) {
            try {
              await challenge(
                1,
                interaction,
                challengedUserId,
                rusr,
                betamount
              );
            } catch (err) {
              console.log('Error CODE 9024');
              interaction.reply("Couldn't find such user :(");
            }
          }
          // rusr(betamount, interaction, interaction.user);
        } else {
          await interaction.reply("You don't have enough coins!");
        }
    }
  },
  async executeManual(message, content) {
    let betamount = null;

    /*

    betamount = interaction.options.getInteger('bet')
      ? interaction.options.getInteger('bet')
      : 100;
    if (betamount < 100) {
      interaction.reply('You cannot bet less than **100 coins**!');
      return;
    }

    const challengedUserId = interaction.options.getMember('member')
      ? interaction.options.getMember('member').id
      : null;
      */
    switch (content[1]) {
      case 'start':
        if (!checkCollectorAvailability(message, message.author.id)) {
          return;
        }
        if (!content[2]) {
          await message.reply(
            'You forgot to type how many coins you want to bet! You need to bet at least 100 coins!'
          );
          return;
        }
        if (Number(content[2]) < 100) {
          message.reply('You cannot bet less than **100 coins**!');
          return;
        }
        betamount = Number(content[2]);
        if (
          await profilesTracker.cache.subtractCoinsToUser(
            message.author.id,
            betamount
          )
        ) {
          rusr('ai', betamount, message, message.author);
        } else {
          await message.reply("You don't have enough coins!");
        }
        break;
      case 'challenge':
        if (!checkCollectorAvailability(message, message.author.id)) {
          return;
        }
        if (!content[3]) {
          await message.reply(
            'You forgot to type how many coins you want to bet! You need to bet at least 100 coins!'
          );
          return;
        }
        if (Number(content[3]) < 100) {
          message.reply('You cannot bet less than **100 coins**!');
          return;
        }
        betamount = Number(content[3]);
        try {
          const fetchedUser = await message.client.users.fetch(
            transformMention(content[2])
          );
          if (
            await profilesTracker.cache.subtractCoinsToUser(
              message.author.id,
              betamount
            )
          ) {
            try {
              await challenge(1, message, fetchedUser.id, rusr, betamount);
            } catch (err) {
              try {
                await challenge(1, message, fetchedUser.id, rusr, betamount);
              } catch (err) {
                console.log('Error CODE 9025');
                message.reply("Couldn't find such user :(");
              }
            }
            // rusr(betamount, interaction, interaction.user);
          } else {
            await message.reply("You don't have enough coins!");
          }
        } catch (err) {
          console.log('Error CODE 9026');
          await message.reply("Couldn't find such user :(");
        }
        break;
      default:
        rusr(null, null, message, message.author);
    }
  },
};
