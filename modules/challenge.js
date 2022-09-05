const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { usersPlaying } = require('./usersPlaying');
const collectors = require('../modules/userCollectors');
const profilesTracker = require('../modules/profilesTracker');
const { usersMatch } = require('./usersMatch');
const checkCollectorAvailability = require('../utils/checkCollectorAvailability');

const challengeAnswerRow = (challengedId) => {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('accept' + challengedId)
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success)
        .setDisabled(false)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('decline' + challengedId)
        .setLabel('Decline')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(false)
    );
};

class Invite {
  constructor(repliableObj, gameName, challengedPersonId, effect, betamount) {
    this.interaction = repliableObj;
    this.repliableObj = repliableObj;
    this.gameName = gameName;
    this.challengedPersonId = challengedPersonId;
    this.effect = effect;
    this.betamount = betamount;
    this.bot_message_id = null;
    this.replied = false;
    if (repliableObj.type === 0) {
      this.challengerId = repliableObj.author.id;
    } else {
      this.challengerId = repliableObj.user.id;
    }

    this.generateInvite();
  }

  async generateInvite() {
    this.challengedPerson = await this.repliableObj.client.users.fetch(
      this.challengedPersonId
    );

    if (this.challengedPerson.bot) {
      this.repliableObj.reply("You can't challenge a bot!");
    } else {
      let user = null;
      if (this.repliableObj.type === 0) {
        user = this.repliableObj.author.id;
      } else {
        user = this.repliableObj.user.id;
      }

      if (
        !checkCollectorAvailability(
          this.repliableObj,
          user,
          this.challengedPersonId
        )
      ) {
        return;
      } else {
        this.bot_message_id = (
          await this.repliableObj.reply({
            // content: `<@${user}> invited you, <@${this.challengedPerson.id}>, for a ${gameName} match!`,
            embeds: [
              {
                title: `${this.gameName} challenge!`,
                description: `<@${user}> invited you, <@${this.challengedPerson.id}>, for a ${this.gameName} match!`,
                color: 15512290,
              },
            ],
            components: [challengeAnswerRow(this.challengedPersonId)],
          })
        ).id;

        this.buildCollector(
          this.challengedPersonId,
          this.repliableObj,
          this.user,
          this.effect,
          this.challengedPerson,
          this.betamount
        );
      }
    }
  }

  buildCollector() {
    let userObj = null;
    if (this.interaction.type === 0) {
      userObj = this.interaction.author;
    } else {
      userObj = this.interaction.user;
    }

    // `m` is a message object that will be passed through the filter function
    // const filter = (m) => m.content.includes('next');
    const filter = (i) => {
      // console.log('entered filter');
      if (i.user.id !== this.challengedPersonId) {
        i.reply(
          `<@${i.user.id}> don't press someone's else buttons! That's rude! >:T`
        );
      }
      return (
        i.user.id === this.challengedPersonId &&
        (i.customId === 'accept' + this.challengedPersonId ||
          i.customId === 'decline' + this.challengedPersonId)
      );
    };
    // const collector = interaction.channel.createMessageCollector({
    collectors[this.challengerId] =
      this.interaction.channel.createMessageComponentCollector({
        filter,
        time: 30000,
        // 30 seconds
      });

    collectors[this.challengerId].on('collect', async (i) => {
      if (i.customId === 'accept' + this.challengedPersonId) {
        if (!checkCollectorAvailability(i, this.challengedPersonId)) {
          return;
        }
        if (
          !this.betamount ||
          (await profilesTracker.cache.subtractCoinsToUser(
            this.challengedPersonId,
            this.betamount
          ))
        ) {
          this.replied = true;
          // changes are here
          await collectors[this.challengerId].stop();
          collectors[this.challengerId] = null;
          if (this.interaction.type === 0) {
            await (
              await this.interaction.channel.messages.fetch(this.bot_message_id)
            ).edit({
              embeds: [
                {
                  title: 'Offer accepted!',
                  description:
                    'Ready or not, here we go. Your battle will be legendary!',
                  color: 4437377,
                },
              ],
              components: [],
            });
          } else {
            // this one still not coded & prevent invite himself
            await this.interaction.editReply({
              embeds: [
                {
                  title: 'Offer accepted!',
                  description:
                    'Ready or not, here we go. Your battle will be legendary!',
                  color: 4437377,
                },
              ],
              components: [],
            });

            // collectors[challengerId].stop();
            // collectors[challengerId] = null;
          }
          await this.effect(
            'pvp',
            this.interaction,
            userObj,
            this.challengedPersonObj
          );
        } else {
          i.reply(
            `<@${this.challengedPersonId}>, you don't have enough coins!`
          );
        }
        // console.log('after effect');
      } else if (i.customId === 'decline' + this.challengedPersonId) {
        this.replied = true;
        await profilesTracker.cache.sumCoinsToUser(
          this.challengerId,
          this.betamount
        );
        await collectors[this.challengerId].stop();
        collectors[this.challengerId] = null;
        if (this.interaction.type === 0) {
          await (
            await this.interaction.channel.messages.fetch(this.bot_message_id)
          ).edit({
            embeds: [
              {
                title: 'Offer declined!',
                description:
                  "Try looking for someone else, because that one doesn't have the guts needed >:)",
                color: 15746887,
              },
            ],
            components: [],
          });
        } else {
          // this one still not coded & prevent invite himself
          await this.interaction.editReply({
            embeds: [
              {
                title: 'Offer declined!',
                description:
                  "Try looking for someone else, because that one doesn't have the guts needed >:)",
                color: 15746887,
              },
            ],
            components: [],
          });

          // collectors[challengerId].stop();
          // collectors[challengerId] = null;
        }
        await i.reply('Challenge declined!');
      }
    });

    collectors[this.challengerId].on('end', async (collected) => {
      // console.log('right one end called');

      if (!this.replied) {
        if (this.interaction.type === 0) {
          await profilesTracker.cache.sumCoinsToUser(
            this.challengerId,
            this.betamount
          );
          await (
            await this.interaction.channel.messages.fetch(this.bot_message_id)
          ).edit({
            embeds: [
              {
                title: 'Offer expired!',
                description:
                  "Try looking for someone else, because that one doesn't have the guts needed >:)",
                color: 15746887,
              },
            ],
            components: [],
          });
          collectors[this.challengerId] = null;
        } else {
          await profilesTracker.cache.sumCoinsToUser(
            this.challengerId,
            this.betamount
          );
          // this one still not coded & prevent invite himself
          await this.interaction.editReply({
            embeds: [
              {
                title: 'Offer expired!',
                description:
                  "Try looking for someone else, because that one doesn't have the guts needed >:)",
                color: 15746887,
              },
            ],
            components: [],
          });

          // collectors[challengerId].stop();
          // collectors[challengerId] = null;
        }
      }
    });
  }
}

module.exports = async (
  gameId,
  repliableObj,
  challengedPersonId,
  effectFunction,
  betamount
) => {
  let inv = {};
  let userId = null;
  if (repliableObj.type === 0) {
    userId = repliableObj.author.id;
  } else {
    userId = repliableObj.user.id;
  }

  if (userId === challengedPersonId) {
    repliableObj.reply("You can't challenge yourself!");
  } else {
    switch (gameId) {
      // Rps
      case 0:
        inv = new Invite(
          repliableObj,
          'Rock Paper Scissors',
          challengedPersonId,
          effectFunction
        );
        break;
      // Rusr
      case 1:
        inv = new Invite(
          repliableObj,
          'Russian Roulette',
          challengedPersonId,
          effectFunction,
          betamount
        );
        break;
      default:
        console.log('Error CODE 9008');
        break;
    }
  }
};
