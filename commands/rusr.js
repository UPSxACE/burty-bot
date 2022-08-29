const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const bot_message_id = null
const fetchedMessage = null
const transformMention = require('../utils/transformMention')
const rps = require('../games/rusr')
const rowRusr = (player1id) => {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('shoot' + player1id)
        .setLabel('🔫 Pull the Trigger')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false),
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('giveup' + player1id)
        .setLabel('💩 Give Up')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    )
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rusr')
    .setDescription('Play a russian roulette match!')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('start')
        .setDescription(
          'Challenge the bot for a russian roulette match. Earn some coins if you win!',
        )
        .addIntegerOption((option) =>
          option.setName('bet').setDescription('Place an amount to bet.'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('challenge')
        .setDescription(
          'Challenge someone for a russian roulette match. You can also bet some of your own coins!',
        )
        .addUserOption((option) =>
          option.setName('member').setDescription('The person to challenge.'),
        )
        .addIntegerOption((option) =>
          option.setName('bet').setDescription('Place an amount to bet.'),
        ),
    ),

  async execute(interaction) {
    const betamount = interaction.options.getInteger('bet')
      ? interaction.options.getInteger('bet')
      : 100
    if (betamount < 100) {
      interaction.reply('You cannot bet less than 100 coins!')
      return
    }
    switch (interaction.options.getSubcommand()) {
      case 'start':
        bot_message_id = (
          await interaction.reply({
            content: null,
            embeds: [
              {
                title: 'Russian Roulette',
                description: `Your bet is ${betamount}`,
                color: null,
              },
            ],
            attachments: [],
            components: [rowRusr(interaction.user.id)],
          })
        ).id
        fetchedMessage = await repliableObj.channel.messages.fetch(
          bot_message_id,
        )
    }
  },
}
