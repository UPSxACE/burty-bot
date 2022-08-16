const { SlashCommandBuilder } = require('discord.js');
const profilesTracker = require('../modules/profilesTracker');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription("Check someone's profile!")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user whose profile you want to check')
    ),
  async execute(interaction) {
    const target_user = interaction.options.getUser('user');
    // If it has a target, then check that target's profile
    if (target_user) {
      // In case it doesn't have a target, show the user's own profile
      if (!profilesTracker.cache[target_user.id]) {
        await profilesTracker.cache.update(target_user.id, {});
      }

      const user = await interaction.client.users.fetch(target_user.id);

      interaction.reply({
        content: null,
        embeds: [
          {
            title: `${
              profilesTracker.cache[target_user.id].customUsername
                ? profilesTracker.cache[target_user.id].customUsername
                : target_user.tag
            }`,
            color: 16775935,
            fields: [
              {
                name: `Level ${
                  profilesTracker.cache[target_user.id].level
                    ? profilesTracker.cache[target_user.id].level
                    : 1
                }`,
                value: `[${
                  profilesTracker.cache[target_user.id].currentXP
                    ? profilesTracker.cache[target_user.id].currentXP
                    : 0
                } / ${
                  profilesTracker.cache[target_user.id].maxXP
                    ? profilesTracker.cache[target_user.id].maxXP
                    : 200
                }]`,
                inline: true,
              },
              {
                name: '\u200B',
                value: '\u200B',
                inline: true,
              },
              {
                name: 'Title',
                value: `${
                  profilesTracker.cache[target_user.id].currentTitle
                    ? profilesTracker.cache[target_user.id].currentTitle
                    : 'Alpha Tester'
                }`,
                inline: true,
              },
              {
                name: 'Members Invited',
                value: `${
                  profilesTracker.cache[target_user.id].inviteCountGlobal
                    ? profilesTracker.cache[target_user.id].inviteCountGlobal
                    : '0'
                }`,
                inline: true,
              },
              {
                name: '\u200B',
                value: '\u200B',
                inline: true,
              },
              {
                name: 'Coins',
                value: `${
                  profilesTracker.cache[target_user.id].coins
                    ? profilesTracker.cache[target_user.id].coins
                    : 0
                }`,
                inline: true,
              },
            ],
            author: {
              name: 'Profile Card',
            },
            footer: {
              text: 'This feature is still in alpha version! Soon it will look prettier!',
            },
            thumbnail: {
              url: `${user.avatarURL()}`,
            },
          },
        ],
        attachments: [],
      });
    } else {
      // In case it doesn't have a target, show the user's own profile
      if (!profilesTracker.cache[interaction.user.id]) {
        await profilesTracker.cache.update(interaction.user.id, {});
      }

      interaction.reply({
        content: null,
        embeds: [
          {
            title: `${
              profilesTracker.cache[interaction.user.id].customUsername
                ? profilesTracker.cache[interaction.user.id].customUsername
                : interaction.user.tag
            }`,
            color: 15953368,
            fields: [
              {
                name: `Level ${
                  profilesTracker.cache[interaction.user.id].level
                    ? profilesTracker.cache[interaction.user.id].level
                    : 1
                }`,
                value: `[${
                  profilesTracker.cache[interaction.user.id].currentXP
                    ? profilesTracker.cache[interaction.user.id].currentXP
                    : 0
                } / ${
                  profilesTracker.cache[interaction.user.id].maxXP
                    ? profilesTracker.cache[interaction.user.id].maxXP
                    : 200
                }]`,
                inline: true,
              },
              {
                name: '\u200B',
                value: '\u200B',
                inline: true,
              },
              {
                name: 'Title',
                value: `${
                  profilesTracker.cache[interaction.user.id].currentTitle
                    ? profilesTracker.cache[interaction.user.id].currentTitle
                    : 'Alpha Tester'
                }`,
                inline: true,
              },
              {
                name: 'Members Invited',
                value: `${
                  profilesTracker.cache[interaction.user.id].inviteCountGlobal
                    ? profilesTracker.cache[interaction.user.id]
                        .inviteCountGlobal
                    : '0'
                }`,
                inline: true,
              },
              {
                name: '\u200B',
                value: '\u200B',
                inline: true,
              },
              {
                name: 'Coins',
                value: `${
                  profilesTracker.cache[interaction.user.id].coins
                    ? profilesTracker.cache[interaction.user.id].coins
                    : '0'
                }`,
                inline: true,
              },
            ],
            author: {
              name: 'Profile Card',
            },
            footer: {
              text: 'This feature is still in alpha version! Soon it will look prettier!',
            },
            thumbnail: {
              url: `${interaction.user.avatarURL()}`,
            },
          },
        ],
        attachments: [],
      });
    }
  },
};
