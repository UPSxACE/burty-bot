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
const rusr = require('../games/rusr');

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
    console.log(JSON.stringify(collectors[interaction.user.id]));
    switch (interaction.options.getSubcommand()) {
      case 'start':
        console.log('START!');
        if (usersPlaying[String(interaction.user.id)]) {
          console.log('i work woah');
          // (probably programmed already)
          await interaction.reply(
            usersMatch[usersPlaying[interaction.user.id].matchHost].failMessage
          );
          return;
        }
        if (collectors[interaction.user.id]) {
          console.log('I work');
          await interaction.reply('You are currently busy!');
          return;
        }
        rusr(betamount, interaction, interaction.user.id);
    }
  },
};
