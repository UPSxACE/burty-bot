const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { version, prefix } = require('../config.json');

const usersMatch = require('../modules/usersMatch');
const usersPlaying = require('../modules/usersPlaying');
const collectors = require('../modules/userCollectors');

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

/*
module.exports = async (mode, repliableObj, userObj, userObj2) => {
  await effect(mode, repliableObj, userObj, userObj2);
};
*/

class RpsMatch {
  constructor(mode, repliableObj, userObj, userObj2) {
    this.currentRoundPlayer = null;
    this.matchEndBool = false;
    this.bot_message_id = null;
    this.fetchedMessage = null;
    this.turnMovesCount = 0;
    this.turnMoves = [];
    this.winner = null;
    this.userObj = userObj;
    this.userObj2 = userObj2;
    this.client_user = repliableObj.client.user;

    this.effect(mode, repliableObj, userObj, userObj2);
  }

  async effect(mode, repliableObj, userObj, userObj2) {
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
            this.currentRoundPlayer = userObj.id;
            // As long as "repliableObj" is always a message object or an interaction object this line below will work
            this.buildCollector(userObj, null, repliableObj);
            this.bot_message_id = (
              await repliableObj.reply({
                content: 'So you dare challenging me? HA!',
                embeds: [
                  this.embedRpsRoundStart(userObj, repliableObj.client.user),
                ],
                components: [this.row(userObj.id)],
              })
            ).id;
            this.fetchedMessage = await repliableObj.channel.messages.fetch(
              this.bot_message_id
            );
          } else {
            // (probably programmed already)
            await repliableObj.reply(
              usersMatch[usersPlaying[userObj.id].matchHost].failMessage
            );
          }

          break;
        case 'pvp':
          console.log('ANOTHER TEST OBJ2: ' + userObj2);
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
              player2: userObj2.id,
              failMessage:
                "You're already participating in a 'Rock Paper Scissors match!'",
            };
            this.currentRoundPlayer = userObj.id;
            // As long as "repliableObj" is always a message object or an interaction object this line below will work
            this.buildCollector(userObj, userObj2, repliableObj);
            this.bot_message_id = (
              await repliableObj.reply({
                content: 'Let the battle begin!',
                embeds: [
                  this.embedRpsRoundStart(userObj, repliableObj.client.user),
                ],
                components: [this.row(userObj.id)],
              })
            ).id;
            this.fetchedMessage = await repliableObj.channel.messages.fetch(
              this.bot_message_id
            );
          } else {
            // (probably programmed already)
            await repliableObj.reply(
              usersMatch[usersPlaying[userObj.id].matchHost].failMessage
            );
          }

          break;
        default:
          console.log('Error CODE 9003');
          break;
      }
    } else {
      repliableObj.reply({ embeds: [embedHelp] });
    }
  }

  // return matchEndBool
  draw(matchHostId) {
    return false;
  }

  // return matchEndBool
  lose(matchHostId) {
    this.winner = 2;
    // Collectore, Match, and Playing Cleanup!
    if (
      usersMatch[matchHostId].player1 &&
      collectors[usersMatch[matchHostId].player1]
    ) {
      collectors[usersMatch[matchHostId].player1].stop();
      collectors[usersMatch[matchHostId].player1] = null;
    }
    if (
      usersMatch[matchHostId].player2 &&
      collectors[usersMatch[matchHostId].player2]
    ) {
      collectors[usersMatch[matchHostId].player2].stop();
      collectors[usersMatch[matchHostId].player2] = null;
    }
    if (
      usersMatch[matchHostId].player1 &&
      usersMatch[matchHostId][usersMatch[matchHostId].player1]
    ) {
      usersMatch[usersMatch[matchHostId].player1] = null;
    }
    if (usersMatch.player2 && usersMatch[usersMatch[matchHostId].player2]) {
      usersMatch[usersMatch[matchHostId].player2] = null;
    }
    if (
      usersMatch[matchHostId].player1 &&
      usersPlaying[usersMatch[matchHostId].player1]
    ) {
      usersPlaying[usersMatch[matchHostId].player1] = null;
    }
    if (
      usersMatch[matchHostId].player2 &&
      usersPlaying[usersMatch[matchHostId].player2]
    ) {
      usersPlaying[usersMatch[matchHostId].player2] = null;
    }
    return true;
  }

  // return matchEndBool
  win(matchHostId) {
    this.winner = 1;
    // Collectore, Match, and Playing Cleanup!
    console.log(typeof usersMatch[matchHostId].player1);
    console.log(usersMatch[matchHostId]);
    console.log(collectors[usersMatch[matchHostId].player1.id]);
    console.log(
      'usersmatch: ' +
        Boolean(
          usersMatch[matchHostId].player1 &&
            collectors[usersMatch[matchHostId].player1]
        )
    );
    if (
      usersMatch[matchHostId].player1 &&
      collectors[usersMatch[matchHostId].player1]
    ) {
      console.log('found');
      collectors[usersMatch[matchHostId].player1].stop();
      collectors[usersMatch[matchHostId].player1] = null;
    }
    if (
      usersMatch[matchHostId].player2 &&
      collectors[usersMatch[matchHostId].player2]
    ) {
      console.log('found');
      collectors[usersMatch[matchHostId].player2].stop();
      collectors[usersMatch[matchHostId].player2] = null;
    }
    if (
      usersMatch[matchHostId].player1 &&
      usersMatch[matchHostId][usersMatch[matchHostId].player1]
    ) {
      usersMatch[usersMatch[matchHostId].player1] = null;
    }
    if (usersMatch.player2 && usersMatch[usersMatch[matchHostId].player2]) {
      usersMatch[usersMatch[matchHostId].player2] = null;
    }
    if (
      usersMatch[matchHostId].player1 &&
      usersPlaying[usersMatch[matchHostId].player1]
    ) {
      usersPlaying[usersMatch[matchHostId].player1] = null;
    }
    if (
      usersMatch[matchHostId].player2 &&
      usersPlaying[usersMatch[matchHostId].player2]
    ) {
      usersPlaying[usersMatch[matchHostId].player2] = null;
    }
    return true;
  }

  embedRpsRoundStart(player1, player2, score1, score2) {
    return {
      title: 'Rock Paper Scissors',
      description: 'The game has started! Be careful with what you choose!',
      color: 15512290,
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
  }

  embedRpsNewMove(playerNumber) {
    return {
      title: 'Rock Paper Scissors',
      description: `Player ${playerNumber} made it's choice!`,
      color: 15512290,
    };
  }
  embedRpsResult(player1Move, player2Move, GameEndBoolean) {
    // return: 0 -> draw, 1 -> player 1 win, 2 -> player 2 win
    function result(pl1Move, pl2Move) {
      switch (pl1Move) {
        case 0:
          switch (pl2Move) {
            case 0:
              return 0;
              break;
            case 1:
              return 2;
              break;
            case 2:
              return 1;
              break;
            default:
              console.log('Error CODE 9017');
          }
          break;
        case 1:
          switch (pl2Move) {
            case 0:
              return 1;
              break;
            case 1:
              return 0;
              break;
            case 2:
              return 2;
              break;
            default:
              console.log('Error CODE 9018');
          }
          break;
        case 2:
          switch (pl2Move) {
            case 0:
              return 2;
              break;
            case 1:
              return 1;
              break;
            case 2:
              return 0;
              break;
            default:
              console.log('Error CODE 9019');
          }
          break;
        default:
          console.log('Error Code 9020');
      }
    }

    function numberToMove(number) {
      switch (number) {
        case 0:
          return '**rock**';
          break;
        case 1:
          return '**paper**';
          break;
        case 2:
          return '**scissors**';
          break;
        default:
          console.log('Error CODE 9016');
      }
    }

    const winner = result(player1Move, player2Move);
    function winnercolor(winner_number) {
      switch (winner_number) {
        case 0:
          return 16580521;
        case 1:
          return 10266879;
        case 2:
          return 16737123;
      }
    }

    return {
      title: 'Rock Paper Scissors',
      description: `Player 1 chose ${numberToMove(
        player1Move
      )}! Player 2 chose ${numberToMove(player2Move)}!\n${
        winner !== 0 ? `The winner is Player ${winner}!` : "It's a draw!"
      }`,
      color: winnercolor(winner),
    };
  }

  buildCollector(player1Obj, player2Obj, interaction) {
    if (collectors[player1Obj.id]) {
      console.log('Another collector exists');
      collectors[player1Obj.id].stop();
    }
    // hopefully this code below won't break anything lol
    if (player2Obj && collectors[player2Obj.id]) {
      console.log('Another collector exists');
      collectors[player2Obj.id].stop();
    }

    // `m` is a message object that will be passed through the filter function
    // const filter = (m) => m.content.includes('next');
    const filter = (i) => {
      if (i.message && i.message.id === this.bot_message_id) {
        // console.log('entered filter');
        if (i.user.id !== player1Obj.id) {
          if (!player2Obj || (player2Obj && i.user.id !== player2Obj.id)) {
            i.reply(
              `<@${i.user.id}> don't press someone's else buttons! That's rude! >:T`
            );
          } else if (
            player2Obj &&
            i.user.id === player2Obj.id &&
            player2Obj.id !== this.currentRoundPlayer
          ) {
            i.reply(`<@${i.user.id}> it's not your turn!`);
          }
        } else if (i.user.id !== this.currentRoundPlayer) {
          i.reply(`<@${i.user.id}> it's not your turn!`);
        }
        console.log(
          i.user.id === this.currentRoundPlayer &&
            i.customId !== 'rock' + player1Obj.id &&
            i.customId !== 'paper' + player1Obj.id &&
            i.customId !== 'scissors' + player1Obj.id
        );
        return (
          i.user.id === this.currentRoundPlayer &&
          (i.customId === 'rock' + player1Obj.id ||
            i.customId === 'paper' + player1Obj.id ||
            i.customId === 'scissors' + player1Obj.id)
        );
      } else {
        return false;
      }
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
        await this.fetchedMessage.edit({
          embeds: [this.embedRpsNewMove(1)],
          components: [this.rowDisabled(this.userObj.id)],
        });
        await i.deferUpdate();
        // wait 3 seconds
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const randomComputerPlay = Math.floor(Math.random() * 3);
        if (i.customId === 'rock' + player1Obj.id) {
          switch (randomComputerPlay) {
            case 0:
              await this.fetchedMessage.edit({
                embeds: [this.embedRpsResult(0, randomComputerPlay)],
                components: [this.rowDisabled(this.userObj.id)],
              });
              this.matchEndBool = await this.draw(player1Obj.id);
              console.log(this.matchEndBool);
              break;
            case 1:
              await this.fetchedMessage.edit({
                embeds: [this.embedRpsResult(0, randomComputerPlay)],
                components: [this.rowDisabled(this.userObj.id)],
              });
              this.matchEndBool = await this.lose(player1Obj.id);
              console.log(this.matchEndBool);
              break;
            case 2:
              await this.fetchedMessage.edit({
                embeds: [this.embedRpsResult(0, randomComputerPlay)],
                components: [this.rowDisabled(this.userObj.id)],
              });
              this.matchEndBool = await this.win(player1Obj.id);
              console.log(this.matchEndBool);
              break;
            default:
              console.log('Error CODE 9004');
          }
        }
        if (i.customId === 'paper' + player1Obj.id) {
          switch (randomComputerPlay) {
            case 0:
              await this.fetchedMessage.edit({
                embeds: [this.embedRpsResult(1, randomComputerPlay)],
                components: [this.rowDisabled(this.userObj.id)],
              });
              this.matchEndBool = await this.win(player1Obj.id);
              console.log(this.matchEndBool);
              break;
            case 1:
              await this.fetchedMessage.edit({
                embeds: [this.embedRpsResult(1, randomComputerPlay)],
                components: [this.rowDisabled(this.userObj.id)],
              });
              this.matchEndBool = await this.draw(player1Obj.id);
              console.log(this.matchEndBool);
              break;
            case 2:
              await this.fetchedMessage.edit({
                embeds: [this.embedRpsResult(1, randomComputerPlay)],
                components: [this.rowDisabled(this.userObj.id)],
              });
              this.matchEndBool = await this.lose(player1Obj.id);
              console.log(this.matchEndBool);
              break;
            default:
              console.log('Error CODE 9004');
          }
        }
        if (i.customId === 'scissors' + player1Obj.id) {
          switch (randomComputerPlay) {
            case 0:
              await this.fetchedMessage.edit({
                embeds: [this.embedRpsResult(2, randomComputerPlay)],
                components: [this.rowDisabled(this.userObj.id)],
              });
              this.matchEndBool = await this.lose(player1Obj.id);
              console.log(this.matchEndBool);
              break;
            case 1:
              await this.fetchedMessage.edit({
                embeds: [this.embedRpsResult(2, randomComputerPlay)],
                components: [this.rowDisabled(this.userObj.id)],
              });
              this.matchEndBool = await this.win(player1Obj.id);
              console.log(this.matchEndBool);
              break;
            case 2:
              await this.fetchedMessage.edit({
                embeds: [this.embedRpsResult(2, randomComputerPlay)],
                components: [this.rowDisabled(this.userObj.id)],
              });
              this.matchEndBool = await this.draw(player1Obj.id);
              console.log(this.matchEndBool);
              break;
            default:
              console.log('Error CODE 9004');
          }
        }

        if (this.matchEndBool) {
          console.log('MATCH END');
          // await i.update({ content: `We have a winner! Player ${winner}!` });
          // DANGEROUS CHANGE
          // await i.deferUpdate();
          await i.channel.send(`We have a winner! Player ${this.winner}!`);
          // await i.channel.send('The match has finished!');
        } else {
          await this.fetchedMessage.edit({
            components: [this.row(this.userObj.id)],
          });
          await i.channel.send('It was a draw! One more turn!!!');
          // await i.update({ content: 'It was a draw! One more turn!!!' });

          // DANGEROUS CHANGE
          // await i.deferUpdate();
          // await i.channel.send('The match has finished!');
        }
      });
    } else {
      console.log('atleast here ...');
      collectors[player1Obj.id].on('collect', async (i) => {
        switch (this.turnMovesCount) {
          case 0:
            console.log('zero moves');
            console.log(this.turnMoves);
            switch (i.customId) {
              case 'rock' + player1Obj.id:
                console.log('rock');
                this.turnMoves = [...this.turnMoves, 0];
                // 0 means rock
                break;
              case 'paper' + player1Obj.id:
                console.log('pap');
                this.turnMoves = [...this.turnMoves, 1];
                // 1 means paper
                break;
              case 'scissors' + player1Obj.id:
                console.log('scis');
                this.turnMoves = [...this.turnMoves, 2];
                // 2 means scissors
                break;
              default:
                console.log('Error CODE 9009');
            }

            await this.fetchedMessage.edit({
              embeds: [this.embedRpsNewMove(1)],
              components: [this.rowDisabled(this.userObj.id)],
            });
            await i.deferUpdate();
            // wait 2 seconds
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await this.fetchedMessage.edit({
              embeds: [
                this.embedRpsRoundStart(
                  this.userObj,
                  this.userObj2 ? this.userObj2 : this.client_user
                ),
              ],
              components: [this.row(this.userObj.id)],
            });

            this.currentRoundPlayer = player2Obj.id;
            break;
          case 1:
            console.log('one move');
            console.log('turn moves: ');
            console.log(this.turnMoves);
            switch (i.customId) {
              case 'rock' + player1Obj.id:
                this.turnMoves = [...this.turnMoves, 0];
                // 0 means rock
                break;
              case 'paper' + player1Obj.id:
                this.turnMoves = [...this.turnMoves, 1];
                // 1 means paper
                break;
              case 'scissors' + player1Obj.id:
                this.turnMoves = [...this.turnMoves, 2];
                // 2 means scissors
                break;
              default:
                console.log('Error CODE 9010');
            }

            await this.fetchedMessage.edit({
              embeds: [this.embedRpsNewMove(2)],
              components: [this.rowDisabled(this.userObj.id)],
            });
            await i.deferUpdate();
            // wait 3 seconds
            await new Promise((resolve) => setTimeout(resolve, 3000));
            await this.fetchedMessage.edit({
              embeds: [
                this.embedRpsResult(this.turnMoves[0], this.turnMoves[1]),
              ],
              components: [this.rowDisabled(this.userObj.id)],
            });

            this.currentRoundPlayer = player1Obj.id;
            break;
          default:
            console.log('Error CODE 9011');
        }
        if (this.turnMovesCount === 1) {
          console.log('should be turn over');
          console.log(this.turnMoves);
          switch (this.turnMoves[0]) {
            case 0:
              switch (this.turnMoves[1]) {
                case 0:
                  this.matchEndBool = await this.draw(player1Obj.id);
                  break;
                case 1:
                  this.matchEndBool = await this.lose(player1Obj.id);
                  break;
                case 2:
                  this.matchEndBool = await this.win(player1Obj.id);
                  break;
                default:
                  console.log('Error CODE 9012');
              }
              break;
            case 1:
              switch (this.turnMoves[1]) {
                case 0:
                  this.matchEndBool = await this.win(player1Obj.id);
                  break;
                case 1:
                  this.matchEndBool = await this.draw(player1Obj.id);
                  break;
                case 2:
                  this.matchEndBool = await this.lose(player1Obj.id);
                  break;
                default:
                  console.log('Error CODE 9013');
              }
              break;
            case 2:
              switch (this.turnMoves[1]) {
                case 0:
                  this.matchEndBool = await this.lose(player1Obj.id);
                  break;
                case 1:
                  this.matchEndBool = await this.win(player1Obj.id);
                  break;
                case 2:
                  this.matchEndBool = await this.draw(player1Obj.id);
                  break;
                default:
                  console.log('Error CODE 9014');
              }
              break;
            default:
              console.log('Error Code 9015');
          }
          this.turnMovesCount = 0;
          this.turnMoves = [];
        } else if (this.turnMovesCount === 0) {
          this.turnMovesCount++;
        }

        if (this.matchEndBool) {
          console.log('MATCH END');
          // await i.update({ content: `We have a winner! Player ${winner}!` });
          // DANGEROUS CHANGE
          // await i.deferUpdate();
          await i.channel.send(`We have a winner! Player ${this.winner}!`);
          // await i.channel.send('The match has finished!');
        } else {
          if (this.turnMovesCount === 0) {
            await i.channel.send('It was a draw! One more turn!!!');
            // await i.update({ content: 'It was a draw! One more turn!!!' });
          }

          await this.fetchedMessage.edit({
            components: [this.row(this.userObj.id)],
          });
          // DANGEROUS CHANGE
          // await i.deferUpdate();
          // await i.channel.send('The match has finished!');
        }
      });
    }

    console.log('ITS GETTING HERE RIGHT?');
    collectors[player1Obj.id].on('end', async (collected) => {
      console.log('Collector end being called');
      if (interaction.type === 0) {
        console.log('end1');
        await (
          await interaction.channel.messages.fetch(this.bot_message_id)
        ).edit({
          components: [],
        });
      } else {
        console.log('end2');
        await interaction.editReply({ components: [] });
      }
      // console.log(`Collected ${collected.size} items`);
    });
  }

  row(player1id) {
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
  }

  rowDisabled(player1id) {
    return new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('rock' + player1id)
          .setLabel('✊🏻 Rock')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('paper' + player1id)
          .setLabel('✋🏻 Paper')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('scissors' + player1id)
          .setLabel('✌🏻 Scissors')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true)
      );
  }
}

module.exports = (mode, repliableObj, userObj, userObj2) => {
  new RpsMatch(mode, repliableObj, userObj, userObj2);
};
