const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
    let message_id = 0;
    let embed1 = {};
    let embed2 = {};
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('Prev.')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Next')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(false)
      );

    const target_user = interaction.options.getUser('user');
    // If it has a target, then check that target's profile
    if (target_user) {
      // In case it doesn't have a target, show the user's own profile
      if (!profilesTracker.cache[target_user.id]) {
        await profilesTracker.cache.update(target_user.id, {});
      }

      const user = await interaction.client.users.fetch(target_user.id);
      const target_user_inviter =
        profilesTracker.cache[target_user.id].inviter &&
        profilesTracker.cache[target_user.id].inviter[interaction.guild.id]
          ? await interaction.client.users.fetch(
              profilesTracker.cache[target_user.id].inviter[
                interaction.guild.id
              ]
            )
          : null;

      embed1 = {
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
      };
      embed2 = {
        title: `${
          profilesTracker.cache[target_user.id].customUsername
            ? profilesTracker.cache[target_user.id].customUsername
            : target_user.tag
        }`,
        color: 16775935,
        fields: [
          {
            name: 'Activity Points',
            value: `${
              profilesTracker.cache[target_user.id].activityPoints
                ? profilesTracker.cache[target_user.id].activityPoints
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
            name: `${
              profilesTracker.cache[target_user.id].inviter &&
              profilesTracker.cache[target_user.id].inviter[
                interaction.guild.id
              ]
                ? 'Inviter'
                : '\u200B'
            }`,
            value: `${
              profilesTracker.cache[target_user.id].inviter &&
              profilesTracker.cache[target_user.id].inviter[
                interaction.guild.id
              ]
                ? target_user_inviter.tag
                : '\u200B'
            }`,
            inline: true,
          },
          {
            name: 'About Me',
            value: `${
              profilesTracker.cache[target_user.id].aboutMe
                ? profilesTracker.cache[target_user.id].aboutMe
                : 'Hey!'
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
      };

      await interaction.reply({
        content: null,
        components: [row],
        embeds: [embed1],
        attachments: [],
      });
    } else {
      // In case it doesn't have a target, show the user's own profile
      if (!profilesTracker.cache[interaction.user.id]) {
        await profilesTracker.cache.update(interaction.user.id, {});
      }

      const user_inviter =
        profilesTracker.cache[interaction.user.id].inviter &&
        profilesTracker.cache[interaction.user.id].inviter[interaction.guild.id]
          ? await interaction.client.users.fetch(
              profilesTracker.cache[interaction.user.id].inviter[
                interaction.guild.id
              ]
            )
          : null;

      embed1 = {
        title: `${
          profilesTracker.cache[interaction.user.id].customUsername
            ? profilesTracker.cache[interaction.user.id].customUsername
            : interaction.user.tag
        }`,
        color: 16775935,
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
                ? profilesTracker.cache[interaction.user.id].inviteCountGlobal
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
      };
      embed2 = {
        title: `${
          profilesTracker.cache[interaction.user.id].customUsername
            ? profilesTracker.cache[interaction.user.id].customUsername
            : interaction.user.tag
        }`,
        color: 16775935,
        fields: [
          {
            name: 'Activity Points',
            value: `${
              profilesTracker.cache[interaction.user.id].activityPoints
                ? profilesTracker.cache[interaction.user.id].activityPoints
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
            name: 'Inviter',
            value: `${
              profilesTracker.cache[interaction.user.id].inviter &&
              profilesTracker.cache[interaction.user.id].inviter[
                interaction.guild.id
              ]
                ? user_inviter.tag
                : 'None'
            }`,
            inline: true,
          },
          {
            name: 'About Me',
            value: `${
              profilesTracker.cache[interaction.user.id].aboutMe
                ? profilesTracker.cache[interaction.user.id].aboutMe
                : 'Hey!'
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
      };

      await interaction.reply({
        content: null,
        components: [row],
        embeds: [embed1],
        attachments: [],
      });
    }

    const collectors = require('../modules/userCollectors');

    if (collectors[interaction.user.id]) {
      // console.log('Another collector exists');
      collectors[interaction.user.id].stop();
    }

    // `m` is a message object that will be passed through the filter function
    // const filter = (m) => m.content.includes('next');
    const filter = (i) => {
      // console.log('entered filter');
      return (
        (i.customId === 'next' && i.user.id === interaction.user.id) ||
        (i.customId === 'prev' && i.user.id === interaction.user.id)
      );
    };
    // const collector = interaction.channel.createMessageCollector({
    collectors[interaction.user.id] =
      interaction.channel.createMessageComponentCollector({
        filter,
        time: 30000,
      });

    collectors[interaction.user.id].on('collect', async (i) => {
      if (i.customId === 'next') {
        row.components[1].setDisabled(true);
        row.components[0].setDisabled(false);
      } else {
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(false);
      }
      await i.update({
        embeds: i.customId === 'next' ? [embed2] : [embed1],
        components: [row],
      });
    });

    collectors[interaction.user.id].on('end', async (collected) => {
      await interaction.editReply({ components: [] });
      // console.log(`Collected ${collected.size} items`);
    });
  },
};
