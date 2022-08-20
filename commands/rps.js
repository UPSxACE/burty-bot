const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { version, prefix } = require('../config.json');

const embedHelp = {
  title: 'Rock Paper Scissors',
  description:
    "Rock, Paper, Scissors looks like a simple hand game, but don't get fooled!!!\nIt can quickly become a deadly mindgame!\n\n__**Rules are simple:**__\n**Rock** crushes **Scissors**\n**Scissors** cuts **Paper**\n**Paper** covers **Rock**\n\u200B",
  color: null,
  fields: [
    {
      name: `\`${prefix}rps start [optional: bo3]\``,
      value:
        'Play against **me**. If you win I will give you some coins!\nYou can add "bo3" in the end to make it a best of three match.',
    },
    {
      name: `\`${prefix}rps challenge @user [optional: bo3]\``,
      value:
        'Play against **someone**. The winner also gets some coins.\nYou can add "bo3" in the end to make it a best of three match.',
    },
    {
      name: `\`${prefix}rps challenge @user <ammount> [optional: bo3]\``,
      value:
        '**Bet** any ammount of coins in a match against **someone**.\nYou can add "bo3" in the end to make it a best of three match.',
    },
  ],
  footer: {
    text: `${version}`,
  },
};

const embedRps = (player1, player2, score1, score2) => {
  return {
    title: 'Rock Paper Scissors',
    description: 'The game has started!\n Be careful with what you choose!',
    fields: [
      {
        name: 'Player 1',
        value: `<@${player1.id}>\n${score1 ? score1 : ''}`,
        inline: true,
      },
      {
        name: 'Player 2',
        value: `<@${player2.id}>\n${score2 ? score2 : ''}`,
        inline: true,
      },
    ],
  };
};

const row = (player1id) => {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('rock' + player1id)
        .setLabel('✊🏻 Rock')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('paper' + player1id)
        .setLabel('✋🏻 Paper')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('scissors' + player1id)
        .setLabel('✌🏻 Scissors')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false)
    );
};

async function effect(mode, repliableObj, userObj) {
  if (mode) {
    switch (mode) {
      case 'ai':
        await repliableObj.reply({
          content: 'So you dare challenging me? HA!',
          embeds: [embedRps(userObj, repliableObj.client.user)],
          components: [row(userObj.id)],
        });
        break;
      case 'pvp':
        break;
      default:
        console.log('Error CODE 9003');
        break;
    }
  } else {
    repliableObj.reply({ embeds: [embedHelp] });
  }
}

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
        await effect('ai', message, message.author);
        break;
      case 'challenge':
        break;
      default:
        await effect(null, message, message.author);
    }
  },
};
