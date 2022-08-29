const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const { version, prefix } = require('../config.json')

const usersMatch = require('../modules/usersMatch')
const usersPlaying = require('../modules/usersPlaying')
const collectors = require('../modules/userCollectors')
const profilesTracker = require('../modules/profilesTracker')

module.exports = () => {
  new RusrMatch()
}
