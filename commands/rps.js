const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { version, prefix } = require('../config.json');
const usersMatch = require('../modules/usersMatch');
const usersPlaying = require('../modules/usersPlaying');

let currentRoundPlayer = null;
let matchEndBool = false;
let bot_message_id = null;

// test variable
let winner = null;

function transformMention(mention) {
  return mention.slice(2, -1);
}

// return matchEndBool
function draw(matchHostId) {
  return false;
}

// return matchEndBool
function lose(matchHostId) {
  winner = 2;
  return true;
}

// return matchEndBool
function win(matchHostId) {
  winner = 1;
  return true;
}

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

const buildCollector = (player1Obj, player2Obj, interaction) => {
  const collectors = require('../modules/userCollectors');

  if (collectors[player1Obj.id]) {
    // console.log('Another collector exists');
    collectors[player1Obj.id].stop();
  }

  // `m` is a message object that will be passed through the filter function
  // const filter = (m) => m.content.includes('next');
  const filter = (i) => {
    // console.log('entered filter');
    if (i.user.id !== player1Obj.id) {
      if (!player2Obj || (player2Obj && i.user.id !== player2Obj.id)) {
        i.reply(
          `<@${i.user.id}> don't press someone's else buttons! That's rude! >:T`
        );
      }
    } else if (i.user.id !== currentRoundPlayer) {
      i.reply(`<@${i.user.id}> it's not your turn!`);
    }
    console.log(
      i.user.id === currentRoundPlayer &&
        i.customId !== 'rock' + player1Obj.id &&
        i.customId !== 'paper' + player1Obj.id &&
        i.customId !== 'scissors' + player1Obj.id
    );
    return (
      i.user.id === currentRoundPlayer &&
      (i.customId === 'rock' + player1Obj.id ||
        i.customId === 'paper' + player1Obj.id ||
        i.customId === 'scissors' + player1Obj.id)
    );
  };
  // const collector = interaction.channel.createMessageCollector({
  collectors[player1Obj.id] =
    interaction.channel.createMessageComponentCollector({
      filter,
      time: 1200000,
      // 20 minutes
    });

  if (!player2Obj) {
    collectors[player1Obj.id].on('collect', async (i) => {
      const randomComputerPlay = Math.floor(Math.random() * 3);
      if (i.customId === 'rock' + player1Obj.id) {
        switch (randomComputerPlay) {
          case 0:
            matchEndBool = await draw(player1Obj.id);
            console.log(matchEndBool);
            break;
          case 1:
            matchEndBool = await lose(player1Obj.id);
            console.log(matchEndBool);
            break;
          case 2:
            matchEndBool = await win(player1Obj.id);
            console.log(matchEndBool);
            break;
          default:
            console.log('Error CODE 9004');
        }
      }
      if (i.customId === 'paper' + player1Obj.id) {
        switch (randomComputerPlay) {
          case 0:
            matchEndBool = await win(player1Obj.id);
            console.log(matchEndBool);
            break;
          case 1:
            matchEndBool = await draw(player1Obj.id);
            console.log(matchEndBool);
            break;
          case 2:
            matchEndBool = await lose(player1Obj.id);
            console.log(matchEndBool);
            break;
          default:
            console.log('Error CODE 9004');
        }
      }
      if (i.customId === 'scissors' + player1Obj.id) {
        switch (randomComputerPlay) {
          case 0:
            matchEndBool = await lose(player1Obj.id);
            console.log(matchEndBool);
            break;
          case 1:
            matchEndBool = await win(player1Obj.id);
            console.log(matchEndBool);
            break;
          case 2:
            matchEndBool = await draw(player1Obj.id);
            console.log(matchEndBool);
            break;
          default:
            console.log('Error CODE 9004');
        }
      }

      if (matchEndBool) {
        // await i.update({ content: `We have a winner! Player ${winner}!` });
        await i.deferUpdate();
        await collectors[player1Obj.id].stop();
        usersPlaying[player1Obj.id] = null;
        if (player2Obj) {
          usersPlaying[player2Obj.id] = null;
        }
        usersMatch[player1Obj.id] = null;
        await i.channel.send(`We have a winner! Player ${winner}!`);
        // await i.channel.send('The match has finished!');
      } else {
        await i.channel.send('It was a draw! One more turn!!!');
        // await i.update({ content: 'It was a draw! One more turn!!!' });
        await i.deferUpdate();
        // await i.channel.send('The match has finished!');
      }
    });
  }

  // collectors[player1Obj.id].on('collect', async (i) => {
  /*
    if (i.customId === next) {
      row.components[1].setDisabled(true);
      row.components[0].setDisabled(false);
    } else {
      row.components[0].setDisabled(true);
      row.components[1].setDisabled(false);
    }
    await i.update({
      embeds: i.customId === next ? [embed2] : [embed1],
      components: [row],
    });
    */
  // });

  collectors[player1Obj.id].on('end', async (collected) => {
    if (interaction.type === 0) {
      await (
        await interaction.channel.messages.fetch(bot_message_id)
      ).edit({
        components: [],
      });
    } else {
      await interaction.editReply({ components: [] });
    }
    // console.log(`Collected ${collected.size} items`);
  });
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

async function effect(mode, repliableObj, userObj, userObj2) {
  if (mode) {
    switch (mode) {
      case 'ai':
        if (!usersPlaying[userObj.id]) {
          usersPlaying[userObj.id] = {
            matchHost: userObj.id,
          };
          usersMatch[userObj.id] = {
            // "game === 0" -> rock paper scissors
            game: 0,
            bo3: false,
            score1: 0,
            score2: 0,
            player1: userObj.id,
            player2: null,
            failMessage:
              "You're already participating in a 'Rock Paper Scissors match!'",
          };
          currentRoundPlayer = userObj.id;
          // As long as "repliableObj" is always a message object or an interaction object this line below will work
          buildCollector(userObj, null, repliableObj);
          bot_message_id = await repliableObj.reply({
            content: 'So you dare challenging me? HA!',
            embeds: [embedRps(userObj, repliableObj.client.user)],
            components: [row(userObj.id)],
          });
        } else {
          // to be programmed yet
          await repliableObj.reply(
            usersMatch[usersPlaying[userObj.id].matchHost].failMessage
          );
        }

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

function challenge() {}

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
        await effect('ai', message, message.author, null);
        break;
      case 'challenge':
        if (content[1]) {
          try {
            await challenge(0, message, effect);
          } catch (err) {
            try {
              await challenge(0, message, effect);
            } catch (err) {
              console.log('Error CODE 9005');
              message.reply("Couldn't find such user :(");
            }
          }
        } else {
          try {
            await challenge(0, message, effect);
          } catch {
            console.log('Error CODE 9006');
            message.reply("Couldn't find your profile :(");
          }
        }
        await challenge(0, message, effect);
        break;
      default:
        await effect(null, message, message.author, null);
    }
  },
};
