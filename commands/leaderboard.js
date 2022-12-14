const { SlashCommandBuilder } = require('discord.js');
const leaderboard = require('../modules/leaderboard');

async function generateLeaderboard(client) {
  let result = '';

  // iterate through first 10 from the leaderboard
  for (let i = 0; i < 10; i++) {
    if (i + 1 > leaderboard.cache['leaderboard'].length) {
      break;
    }

    let user = await client.users.fetch(
      leaderboard.cache['leaderboard'][i]['_id']
    );

    result += `**#${('00' + (i + 1)).slice(-2)} - ${user.username} - level ${
      leaderboard.cache['leaderboard'][i].level
        ? leaderboard.cache['leaderboard'][i].level
        : 1
    } [ ${
      leaderboard.cache['leaderboard'][i].currentXP
        ? leaderboard.cache['leaderboard'][i].currentXP
        : 0
    }/${
      leaderboard.cache['leaderboard'][i].maxXP
        ? leaderboard.cache['leaderboard'][i].maxXP
        : 200
    } XP ]**\n`;
  }

  if (result != '') {
    return result;
  }
  return 'No one gained activity points yet!';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Shows the leaderboard!'),
  async execute(interaction) {
    await leaderboard.cache.update();
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: 'Global Ranking',
          description: `${await generateLeaderboard(interaction.client)}`,
          color: 14367804,
          footer: {
            text: 'This feature is still in alpha version! Soon it will look prettier!',
          },
        },
      ],
      attachments: [],
    });
  },
  async executeManual(message, content) {
    await leaderboard.cache.update();
    await message.reply({
      content: null,
      embeds: [
        {
          title: 'Global Ranking',
          description: `${await generateLeaderboard(message.client)}`,
          color: 15953368,
          footer: {
            text: 'This feature is still in alpha version! Soon it will look prettier!',
          },
        },
      ],
      attachments: [],
    });
  },
};
