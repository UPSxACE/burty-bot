const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const { version, prefix } = require('../config.json')

const usersMatch = require('../modules/usersMatch')
const usersPlaying = require('../modules/usersPlaying')
const collectors = require('../modules/userCollectors')
const profilesTracker = require('../modules/profilesTracker')

class RusrMatch {
  constructor(betamount, interaction, player1id) {
    this.bot_message_id = null
    this.fetchedMessage = null
    this.interaction = interaction
    this.betamount = betamount
    this.bullets = 1
    this.player1id = player1id
    console.log('id:' + this.player1id)

    this.startgame()
  }
  async startgame() {
    this.bot_message_id = (
      await this.interaction.reply({
        content: null,
        embeds: [
          {
            title: 'Russian Roulette',
            description: `Your bet is **${this.betamount} coins!**\nThe weapon has room for 6 bullets but is only loaded with ${this.bullets}!`,
            color: null,
          },
        ],
        attachments: [],
        components: [this.rowRusr(this.interaction.user.id)],
        fetchReply: true,
      })
    ).id
    console.log('BOTMESSAGE ID' + this.bot_message_id)
    this.fetchedMessage = await this.interaction.channel.messages.fetch(
      this.bot_message_id,
    )
    this.player1id = this.interaction.user.id
    this.buildCollector(this.player1id, this.interaction)
  }
  rowRusr(player1id, notfirstround) {
    console.log('row id:' + player1id)
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
          .setDisabled(notfirstround ? false : true),
      )
  }
  buildCollector(player1id, interaction) {
    const filter = (i) => {
      console.log(i.customId)
      console.log('botid' + this.bot_message_id)
      if (
        i.message &&
        i.message.id === this.bot_message_id &&
        (i.customId === 'shoot' + this.player1id ||
          i.customId === 'giveup' + this.player1id) &&
        i.user.id === this.player1id
      ) {
        console.log('true')
        return true
      }
      console.log('false')
      return false
    }
    console.log('heyo')
    if (collectors[player1id]) {
      // console.log('Another collector exists');
      collectors[player1id].stop()
    }
    collectors[player1id] = interaction.channel.createMessageComponentCollector(
      {
        filter,
        time: 1200000,
        // 20 minutes
      },
    )
    collectors[player1id].on('collect', async (i) => {
      console.log('wassup')
      switch (i.customId) {
        case 'shoot' + player1id:
          if (Math.random() * (7 - 1) + 1 <= this.bullets) {
            this.fetchedMessage.edit({
              content: null,
              embeds: [
                {
                  title: 'Russian Roulette',
                  description: `How unlucky...\nYou died! 💀\nYou lost your** ${this.betamount} coins**!`,
                  color: null,
                },
              ],
              attachments: [],
              components: [],
            })
            collectors[player1id].stop()
          } else {
            switch (this.bullets) {
              case 1:
                this.betamount = this.calculateReward(this.bullets)
                break
              case 2:
                this.betamount = this.calculateReward(this.bullets)
                break
              case 3:
                this.betamount = this.calculateReward(this.bullets)
                break
              case 4:
                this.betamount = this.calculateReward(this.bullets)
                break
              case 5:
                this.betamount = this.calculateReward(this.bullets)
                break
            }

            this.bullets += 1
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
                      100 * (1 - 1 / (7 - this.bullets)),
                    )}% chance to gain ${this.calculateReward(
                      this.bullets,
                    )} coins?\nYou can also give up and keep your coins!`,
                    color: null,
                  },
                ],
                attachments: [],
                components: [this.rowRusr(player1id, true)],
              })
            } else {
              this.fetchedMessage.edit({
                content: null,
                embeds: [
                  {
                    title: 'Russian Roulette',
                    description: `You won!\nYou gained **${this.betamount} coins!**`,
                    color: null,
                  },
                ],
                attachments: [],
                components: [],
              })
              collectors[player1id].stop()
            }
          }
          i.deferUpdate()
          break
        case 'giveup' + player1id:
          this.fetchedMessage.edit({
            content: null,
            embeds: [
              {
                title: 'Russian Roulette',
                description: `You coward!\nYou can keep the **${this.betamount} coins**!\n *Cyka Blyat!*`,
                color: null,
              },
            ],
            attachments: [],
            components: [],
          })
          collectors[player1id].stop()
      }
    })
  }
  calculateReward(bullets) {
    switch (bullets) {
      case 1:
        return Math.floor(this.betamount * 1.2)
        break
      case 2:
        return Math.floor(this.betamount * 1.25)
        break
      case 3:
        return Math.floor(this.betamount * 1.3)
        break
      case 4:
        return Math.floor(this.betamount * 1.4)
        break
      case 5:
        return Math.floor(this.betamount * 1.5)
        break
    }
  }
}
module.exports = (betamount, interaction, player1id) => {
  return new RusrMatch(betamount, interaction, player1id)
}
