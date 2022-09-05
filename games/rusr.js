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

class RusrMatch {
  constructor(betamount, interaction, player1obj) {
    this.bot_message_id = null;
    this.fetchedMessage = null;
    this.interaction = interaction;
    this.betamount = betamount;
    this.bullets = 1;
    this.player1 = player1obj;
    this.player1id = player1obj.id;
    this.currentRoundPlayer = player1obj.id;

    this.startgame();
  }
  async startgame() {
    usersPlaying[this.player1id] = {
      matchHost: this.player1id,
    };
    usersMatch[this.player1id] = {
      // "game === 0" -> rock paper scissors
      game: 0,
      bo3: false,
      score1: 0,
      score2: 0,
      player1: this.player1id,
      player2: null,
      failMessage:
        "You're already participating in a 'Russian Roulette' match!",
    };

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
        components: [this.rowRusr(this.interaction.user.id)],
        fetchReply: true,
      })
    ).id;
    this.fetchedMessage = await this.interaction.channel.messages.fetch(
      this.bot_message_id
    );
    this.player1id = this.interaction.user.id;
    this.buildCollector(this.player1id, this.interaction);
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
  buildCollector(player1id, interaction) {
    const filter = (i) => {
      if (
        i.message &&
        i.message.id === this.bot_message_id &&
        (i.customId === 'shoot' + this.player1id ||
          i.customId === 'giveup' + this.player1id) &&
        i.user.id === this.player1id
      ) {
        return true;
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
          this.fetchedMessage.edit({
            content: null,
            embeds: [
              {
                title: 'Russian Roulette',
                description: `${
                  this.currentRoundPlayer === this.player1id
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
                    description: `You won!\nYou gained **${this.betamount} coins!**`,
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
          }
          break;
        case 'giveup' + player1id:
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
module.exports = (betamount, interaction, player1obj) => {
  return new RusrMatch(betamount, interaction, player1obj);
};
