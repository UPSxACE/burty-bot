const { SlashCommandBuilder } = require('discord.js');

const { prefix, version } = require('../config.json');

const commands = [
  [
    'leaderboard',
    'Shows the ranking of the most active members, based on activity in this server, and partner ones.',
  ],
  ['profile', 'Check your profile card.'],
  ['profile @user', "Check someone's else profile card."],
  [
    'settings username',
    'Set the username in your profile card. Leave empty to let it go back to default.',
  ],
  [
    'settings aboutme "some words here"',
    'Set the about me message in your profile card.',
  ],
  ['daily', 'Claim your daily reward.'],
  ['8ball "some words here"', 'Ask the magic 8ball something!'],
  [
    'ship [optional1: @user] [optional2: @user]',
    'Evaluate the love compatibility between two different users.',
  ],
  [
    'rps start',
    'Challenge the bot for a rock paper scissors match! Get some coins if you win.',
  ],
  [
    'rps challenge @user [optional: <bet_ammount>]',
    'Challenge someone for a rock paper scissors match. You can also bet your coins if you want.',
  ],
  [
    'rusr start <coins_to_bet>',
    'Play a russian roulette match alone. Survive 5 rounds to get 4x your bet, or quit in the middle for smaller rewards.',
  ],
  [
    'rusr challenge @user <coins_to_bet>',
    'Play russian roulette against **someone**, by turns. To shoot, one must raise the bet, giving up means losing all!',
  ],
  [
    'blush, cry, dab, dance, disgust, dodge, eat, laugh, lewd',
    'React with a gif.',
  ],
  [
    'bite, hug, kiss, lick, pat, poke, punch, shoot, slap, tickle + <user>',
    'React with a gif.',
  ],
];

const embed = {
  title: 'Command List',
  description: `This is a list of all the commands that can be executed manually,  with the ${prefix} prefix.\nMore options are available using slash commands ( **/** ).`,
  color: 15512290,
  fields: [
    ...commands.map((command) => {
      return {
        name: `\`\`\`${prefix}` + command[0] + '```',
        value: command[1],
      };
    }),
  ],
  footer: {
    text: `${version}`,
  },
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all the commands that can be used manually.'),
  async execute(interaction) {
    await interaction.reply({ content: null, embeds: [embed] });
  },
  async executeManual(message, content) {
    await message.reply({ content: null, embeds: [embed] });
  },
};
