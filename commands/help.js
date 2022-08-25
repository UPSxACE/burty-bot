const { SlashCommandBuilder } = require('discord.js');

const { prefix, version } = require('../config.json');

const commands = [
  [
    'leaderboard',
    'Shows the ranking of the most active members, based on activity in this server, and partner ones.',
  ],
  ['profile', 'Check your profile card.'],
  ['profile <user>', "Check someone's else profile card."],
  [
    'settings username',
    'Set the username in your profile card. Leave empty to let it go back to default.',
  ],
  ['settings aboutme', 'Set the about me message in your profile card.'],
  ['daily', 'Claim your daily reward.'],
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
