const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { version, prefix } = require('../config.json');

const usersMatch = require('../modules/usersMatch');
const usersPlaying = require('../modules/usersPlaying');
const collectors = require('../modules/userCollectors');
const profilesTracker = require('../modules/profilesTracker');
const endMatch = require('../utils/endMatch');

const transitionsArray = ['\\****sweats nervously***\\*'];

const randomTransition = () => {
  return transitionsArray[Math.floor(Math.random() * transitionsArray.length)];
};
const embedHelp = {
  title: 'Russian Roulette',
  description:
    'Russian Roulette is a lethal game in which a single bullet is put in a 6 bullet revolver.\nAfter it, the gun cylinder is spin, the gun is pointed to your head, the bets are placed, and then you pull the trigger!\n**If you have the guts for it!**\n\nAs long as you stay alive, you can keep playing for higher stakes, but the chances of surviving get lower each round.\n\u200B',
  color: 15512290,
  fields: [
    {
      name: `\`${prefix}rusr start <coins_to_bet>\``,
      value:
        'Play alone. If you survive 5 rounds, you get 4x your bet! You can also quit in the middle of the match.',
    },
    {
      name: `\`${prefix}rps challenge @user <coins_to_bet>\``,
      value:
        'Play against **someone**, by turns. Whoever wants to shoot, needs to raise the bet, and whoever dies or gives up loses everything!',
    },
  ],
  footer: {
    text: `${version}`,
  },
};

class RusrMatch {
  constructor(mode, betamount, interaction, player1obj, player2obj) {
    this.mode = mode;
    this.bot_message_id = null;
    this.fetchedMessage = null;
    this.interaction = interaction;
    this.betamount = mode === 'pvp' ? betamount * 2 : betamount;
    this.bullets = 1;
    this.player1 = player1obj;
    this.player1id = player1obj.id;
    this.player2 = player2obj ? player2obj : null;
    this.player2id = player2obj ? player2obj.id : null;
    this.currentRoundPlayer = player1obj.id;
    this.roundCost = mode === 'pvp' ? Math.floor(betamount / 2) : 0;

    // this.init();
  }

  async init() {
    await this.startGame();
  }

  async startGame() {
    if (this.mode) {
      usersPlaying[this.player1id] = {
        matchHost: this.player1id,
      };
      if (this.mode === 'pvp') {
        usersPlaying[this.player2id] = {
          matchHost: this.player2id,
        };
      }

      usersMatch[this.player1id] = {
        // "game === 0" -> rock paper scissors
        game: 0,
        bo3: false,
        score1: 0,
        score2: 0,
        player1: this.player1id,
        player2: this.mode === 'pvp' ? this.player2id : null,
        failMessage:
          "You're already participating in a 'Russian Roulette' match!",
      };

      switch (this.mode) {
        case 'ai':
          this.bot_message_id = (
            await this.interaction.reply({
              content: null,
              embeds: [
                {
                  title: 'Russian Roulette',
                  description: `Your bet is **${this.betamount} coins!**\nThe weapon has room for 6 bullets but is only loaded with ${this.bullets}!`,
                  color: 16775935,
                },
              ],
              attachments: [],
              components: [this.rowRusr(this.player1id)],
              fetchReply: true,
            })
          ).id;
          this.fetchedMessage = await this.interaction.channel.messages.fetch(
            this.bot_message_id
          );
          // maybe comment line below
          // this.player1id = this.player1.id;
          this.buildCollector(this.player1id, this.interaction);
          break;
        case 'pvp':
          this.bot_message_id = (
            await this.interaction.reply({
              content: null,
              embeds: [
                {
                  title: 'Russian Roulette',
                  description: `One on one! >:)\n**__${this.betamount}__** coins are at stake!\nThe weapon has room for **6** bullets but is only loaded with **${this.bullets}**!\nIf you want to shoot this round, you've gotta add **__${this.roundCost}__** to the bet!`,
                  color: 16775935,
                },
              ],
              attachments: [],
              components: [this.rowRusr(this.player1id, true)],
              fetchReply: true,
            })
          ).id;
          this.fetchedMessage = await this.interaction.channel.messages.fetch(
            this.bot_message_id
          );
          // this.player1id = this.interaction.user.id;
          this.buildCollector(this.player1id, this.interaction, this.player2id);
          break;
      }
    } else {
      // embed help
      this.interaction.reply({ embeds: [embedHelp] });
    }
  }
  rowRusr(player1id, notfirstround) {
    return new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('shoot' + player1id)
          .setLabel('🔫 Pull the Trigger')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(false)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('giveup' + player1id)
          .setLabel('💩 Give Up')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(notfirstround ? false : true)
      );
  }
  buildCollector(player1id, interaction, player2id) {
    const filter = async (i) => {
      // console.log(i);
      if (
        i.message &&
        i.message.id === this.bot_message_id &&
        (i.customId === 'shoot' + player1id ||
          i.customId === 'giveup' + player1id) &&
        (i.user.id === player1id || i.user.id === player2id)
      ) {
        if (i.user.id === this.currentRoundPlayer) {
          return true;
        } else {
          await i.channel.send(`<@${i.user.id}>, it's not your turn!`);
          return false;
        }
      }
      return false;
    };
    if (collectors[player1id]) {
      // console.log('Another collector exists');
      collectors[player1id].stop();
    }
    collectors[player1id] = interaction.channel.createMessageComponentCollector(
      {
        filter,
        time: 1200000,
        // 20 minutes
      }
    );
    collectors[player1id].on('collect', async (i) => {
      switch (i.customId) {
        case 'shoot' + player1id:
          i.deferUpdate();
          if (this.roundCost > 0) {
            if (
              profilesTracker.cache.subtractCoinsToUser(
                this.currentRoundPlayer,
                this.roundCost
              )
            ) {
              this.betamount = this.betamount + this.roundCost;
              this.roundCost = this.roundCost * 2;
            } else {
              i.channel.send(
                `<@${this.currentRoundPlayer}>, seems like you're too broke! You don't have enough coins!`
              );
              return;
            }
          }
          this.fetchedMessage.edit({
            content: null,
            embeds: [
              {
                title: 'Russian Roulette',
                description: `${
                  this.currentRoundPlayer === player1id
                    ? this.player1.username
                    : this.player2.username
                } pulled the trigger...`,
                color: 16768820,
              },
            ],
            attachments: [],
            components: [],
          });
          // wait 2 seconds
          await new Promise((resolve) => setTimeout(resolve, 2000));
          this.fetchedMessage.edit({
            content: null,
            embeds: [
              {
                title: 'Russian Roulette',
                description: `${randomTransition()}`,
                color: 16768820,
              },
            ],
            attachments: [],
            components: [],
          });
          // wait 2-4 seconds
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * (4000 - 2000) + 2000)
          );
          if (Math.random() * (7 - 1) + 1 <= this.bullets) {
            this.fetchedMessage.edit({
              content: null,
              embeds: [
                {
                  title: 'Russian Roulette',
                  description: 'Baaaang!!!!!!! 💀',
                  color: 16718664,
                },
              ],
              attachments: [],
              components: [],
            });
            // wait 2 seconds
            await new Promise((resolve) => setTimeout(resolve, 2000));
            if (this.mode !== 'pvp') {
              this.fetchedMessage.edit({
                content: null,
                embeds: [
                  {
                    title: 'Russian Roulette',
                    description: `How unlucky...\nYou died! 💀\nYou lost your** ${this.betamount} coins**!`,
                    color: 16718664,
                  },
                ],
                attachments: [],
                components: [],
              });
            } else {
              this.fetchedMessage.edit({
                content: null,
                embeds: [
                  {
                    title: 'Russian Roulette',
                    description: `How unlucky...\n**${
                      this.currentRoundPlayer === player1id
                        ? this.player1.username
                        : this.player2.username
                    }** died! 💀\n**${
                      this.currentRoundPlayer === player1id
                        ? this.player2.username
                        : this.player1.username
                    }** keeps the** ${this.betamount} coins**!`,
                    color: 16718664,
                  },
                ],
                attachments: [],
                components: [],
              });
            }

            await i.channel.send(
              this.currentRoundPlayer === player1id
                ? await profilesTracker.cache.rewardGameWin(
                    this.player2,
                    1,
                    true,
                    this.betamount
                  )
                : this.player2 &&
                    (await profilesTracker.cache.rewardGameWin(
                      this.player1,
                      1,
                      true,
                      this.betamount
                    ))
            );

            endMatch(player1id);
          } else {
            this.fetchedMessage.edit({
              content: null,
              embeds: [
                {
                  title: 'Russian Roulette',
                  description: `............nothing happened!`,
                  color: 47902,
                },
              ],
              attachments: [],
              components: [],
            });
            if (this.mode !== 'pvp') {
              // wait 2 seconds
              await new Promise((resolve) => setTimeout(resolve, 2000));
              switch (this.bullets) {
                case 1:
                  this.betamount = this.calculateReward(this.bullets);
                  break;
                case 2:
                  this.betamount = this.calculateReward(this.bullets);
                  break;
                case 3:
                  this.betamount = this.calculateReward(this.bullets);
                  break;
                case 4:
                  this.betamount = this.calculateReward(this.bullets);
                  break;
                case 5:
                  this.betamount = this.calculateReward(this.bullets);
                  break;
              }

              this.bullets += 1;
              if (this.bullets !== 6) {
                this.fetchedMessage.edit({
                  content: null,
                  embeds: [
                    {
                      title: 'Russian Roulette',
                      description: `Lucky one!\nYou have ${
                        6 - this.bullets
                      } round(s) left!\nYou currently have **${
                        this.betamount
                      } coins**!\nDo you wish to continue for a ${Math.floor(
                        100 * (1 - 1 / (7 - this.bullets))
                      )}% chance to gain __**${this.calculateReward(
                        this.bullets
                      )}**__ coins?\nYou can also give up and keep your coins!`,
                      color: 47902,
                    },
                  ],
                  attachments: [],
                  components: [this.rowRusr(player1id, true)],
                });
              } else {
                this.fetchedMessage.edit({
                  content: null,
                  embeds: [
                    {
                      title: 'Russian Roulette',
                      description: `You won!\nYou gained __**${this.betamount}**__ coins!`,
                      color: 47902,
                    },
                  ],
                  attachments: [],
                  components: [],
                });
                endMatch(player1id);
                await i.channel.send(
                  await profilesTracker.cache.rewardGameWin(
                    this.player1,
                    1,
                    true,
                    this.betamount
                  )
                );
              }
            } else {
              // wait 2 seconds
              await new Promise((resolve) => setTimeout(resolve, 2000));

              this.bullets += 1;
              if (this.bullets !== 6) {
                this.currentRoundPlayer =
                  this.currentRoundPlayer === player1id
                    ? this.player2id
                    : this.player1id;
                this.fetchedMessage.edit({
                  content: null,
                  embeds: [
                    {
                      title: 'Russian Roulette',
                      description: `Lucky shot! ${
                        this.currentRoundPlayer === this.player1id
                          ? this.player1.username
                          : this.player2.username
                      }, it's your turn!\n**__${
                        this.betamount
                      }__** coins are at stake!\nIf you want to shoot this round, you've gotta add **__${
                        this.roundCost
                      }__** to the bet!\nYou have __**${Math.floor(
                        100 * (1 - 1 / (7 - this.bullets))
                      )}%**__ chance of surviving!`,
                      color: 16775935,
                    },
                  ],
                  attachments: [],
                  components: [this.rowRusr(player1id, true)],
                  fetchReply: true,
                });
              } else {
                this.fetchedMessage.edit({
                  content: null,
                  embeds: [
                    {
                      title: 'Russian Roulette',
                      description: `Balls of steel! ${
                        this.currentRoundPlayer === player1id
                          ? this.player1.username
                          : this.player2.username
                      } won it all! A total of __**${
                        this.betamount
                      }**__ coins!`,
                      color: 47902,
                    },
                  ],
                  attachments: [],
                  components: [],
                });
                endMatch(player1id);
                await i.channel.send(
                  this.currentRoundPlayer === player1id
                    ? await profilesTracker.cache.rewardGameWin(
                        this.player1,
                        1,
                        true,
                        this.betamount
                      )
                    : await profilesTracker.cache.rewardGameWin(
                        this.player2,
                        1,
                        true,
                        this.betamount
                      )
                );
              }
            }
          }
          break;
        case 'giveup' + player1id:
          if (this.mode !== 'pvp') {
            this.fetchedMessage.edit({
              content: null,
              embeds: [
                {
                  title: 'Russian Roulette',
                  description: `You coward!\nYou can keep the **${this.betamount} coins**!\n *Cyka Blyat!*`,
                  color: 47902,
                },
              ],
              attachments: [],
              components: [],
            });
            endMatch(player1id);
            await i.channel.send(
              await profilesTracker.cache.rewardGameWin(
                this.player1,
                1,
                true,
                this.betamount
              )
            );
          } else {
            this.fetchedMessage.edit({
              content: null,
              embeds: [
                {
                  title: 'Russian Roulette',
                  description: `Uh, fear of dying!? Coward! ${
                    this.currentRoundPlayer === player1id
                      ? this.player2.username
                      : this.player1.username
                  } keeps the **${this.betamount} coins**!\n`,
                  color: 47902,
                },
              ],
              attachments: [],
              components: [],
            });
            endMatch(player1id);
            await i.channel.send(
              this.currentRoundPlayer === player1id
                ? await profilesTracker.cache.rewardGameWin(
                    this.player2,
                    1,
                    true,
                    this.betamount
                  )
                : await profilesTracker.cache.rewardGameWin(
                    this.player1,
                    1,
                    true,
                    this.betamount
                  )
            );
          }
      }
    });
  }
  calculateReward(bullets) {
    switch (bullets) {
      case 1:
        return Math.floor(this.betamount * 1.1);
        break;
      case 2:
        return Math.floor(this.betamount * 1.2);
        break;
      case 3:
        return Math.floor(this.betamount * 1.35);
        break;
      case 4:
        return Math.floor(this.betamount * 1.5);
        break;
      case 5:
        return Math.floor(this.betamount * 1.7);
        break;
    }
  }
}
module.exports = (mode, betamount, interaction, player1obj, player2obj) => {
  return new RusrMatch(mode, betamount, interaction, player1obj, player2obj);
};
