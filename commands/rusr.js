const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
// ! i.user i.customId

let player1id = null
let betamount = null
let bullets = 1
const calculateReward = (bullets) => {
  switch (bullets) {
    case 1:
      return Math.floor(betamount * 1.2)
      break
    case 2:
      return Math.floor(betamount * 1.25)
      break
    case 3:
      return Math.floor(betamount * 1.3)
      break
    case 4:
      return Math.floor(betamount * 1.4)
      break
    case 5:
      return Math.floor(betamount * 1.5)
      break
  }
}
const filterRusr = (i) => {
  if (
    i.message &&
    i.message.id === bot_message_id &&
    (i.customId === 'shoot' + player1id ||
      i.customId === 'giveup' + player1id) &&
    i.user.id === player1id
  ) {
    return true
  }
  return false
}
const collectors = require('../modules/userCollectors')
const usersPlaying = require('../modules/usersPlaying')
const buildCollector = (player1id, interaction) => {
  if (collectors[player1id]) {
    // console.log('Another collector exists');
    collectors[player1id].stop()
  }
  collectors[player1id] = interaction.channel.createMessageComponentCollector({
    filterRusr,
    time: 1200000,
    // 20 minutes
  })

  collectors[player1id].on('collect', async (i) => {
    switch (i.customId) {
      case 'shoot' + player1id:
        if (Math.random() * (7 - 1) + 1 <= bullets) {
          fetchedMessage.edit({
            content: null,
            embeds: [
              {
                title: 'Russian Roulette',
                description: `How unlucky...\nYou died! 💀\nYou lost your** ${betamount} coins**!`,
                color: null,
              },
            ],
            attachments: [],
            components: [],
          })
          collectors[player1id].stop()
        } else {
          switch (bullets) {
            case 1:
              betamount = calculateReward(bullets)
              break
            case 2:
              betamount = calculateReward(bullets)
              break
            case 3:
              betamount = calculateReward(bullets)
              break
            case 4:
              betamount = calculateReward(bullets)
              break
            case 5:
              betamount = calculateReward(bullets)
              break
          }

          bullets += 1
          if (bullets !== 6) {
            fetchedMessage.edit({
              content: null,
              embeds: [
                {
                  title: 'Russian Roulette',
                  description: `Lucky one!\nYou have ${
                    6 - bullets
                  } round(s) left!\nYou currently have **${betamount} coins**!\nDo you wish to continue for a ${Math.floor(
                    100 * (1 - 1 / (7 - bullets)),
                  )}% chance to gain ${calculateReward(
                    bullets,
                  )} coins?\nYou can also give up and keep your coins!`,
                  color: null,
                },
              ],
              attachments: [],
              components: [rowRusr(player1id, true)],
            })
          } else {
            fetchedMessage.edit({
              content: null,
              embeds: [
                {
                  title: 'Russian Roulette',
                  description: `You won!\nYou gained **${betamount} coins!**`,
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
        fetchedMessage.edit({
          content: null,
          embeds: [
            {
              title: 'Russian Roulette',
              description: `You coward!\nYou can keep the **${betamount} coins**!\n *Cyka Blyat!*`,
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

let bot_message_id = null
let fetchedMessage = null
const transformMention = require('../utils/transformMention')
const rps = require('../games/rusr')
const rowRusr = (player1id, notfirstround) => {
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
    betamount = interaction.options.getInteger('bet')
      ? interaction.options.getInteger('bet')
      : 100
    if (betamount < 100) {
      interaction.reply('You cannot bet less than **100 coins**!')
      return
    }
    switch (interaction.options.getSubcommand()) {
      case 'start':
        console.log('START!')
        if (usersPlaying[String(interaction.user.id)]) {
          console.log('i work woah')
          // (probably programmed already)
          await interaction.reply(
            usersMatch[usersPlaying[interaction.user.id].matchHost].failMessage,
          )
          return
        }
        if (collectors[interaction.user.id]) {
          console.log('I work')
          await interaction.reply('You are currently busy!')
          return
        }
        bot_message_id = await (
          await interaction.reply({
            content: null,
            embeds: [
              {
                title: 'Russian Roulette',
                description: `Your bet is **${betamount} coins!**\nThe weapon has room for 6 bullets but is only loaded with ${bullets}!`,
                color: null,
              },
            ],
            attachments: [],
            components: [rowRusr(interaction.user.id)],
            fetchReply: true,
          })
        ).id
        console.log(bot_message_id)
        //console.log(JSON.stringify(bot_message_id))
        fetchedMessage = await interaction.channel.messages.fetch(
          bot_message_id,
        )
        player1id = interaction.user.id
        buildCollector(player1id, interaction)
    }
  },
}
