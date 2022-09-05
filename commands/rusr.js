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
          option.setName('bet').setDescription('Place an amount to bet.')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('challenge')
        .setDescription(
          'Challenge someone for a russian roulette match. You can also bet some of your own coins!'
        )
        .addUserOption((option) =>
          option.setName('member').setDescription('The person to challenge.')
        )
        .addIntegerOption((option) =>
          option.setName('bet').setDescription('Place an amount to bet.')
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

    const challengedUserId = interaction.options.getMember('member').id;
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
          rusr(betamount, interaction, interaction.user);
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
};
