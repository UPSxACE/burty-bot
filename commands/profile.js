const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const profilesTracker = require('../modules/profilesTracker');

const transformMention = require('../utils/transformMention');
const checkCollectorAvailability = require('../utils/checkCollectorAvailability');

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
    try {
      await effect(interaction, target_user, interaction.user);
    } catch (err) {
      console.log('Error CODE 9002');
      interaction.reply("Couldn't find the profile :(");
    }
  },
  async executeManual(message, content, hasString) {
    if (content[1]) {
      try {
        await effect(message, transformMention(content[1]), message.author);
      } catch (err) {
        try {
          await effect(message, content[1], message.author);
        } catch (err) {
          console.log('Error CODE 9000');
          message.reply("Couldn't find such user :(");
        }
      }
    } else {
      try {
        await effect(message, null, message.author);
      } catch (err) {
        console.log(err);
        message.reply("Couldn't find your profile :(");
      }
    }
  },
};

async function effect(interaction, target, userArg) {
  let embed1 = {};
  let embed2 = {};
  const prev = 'prev' + userArg.id;
  // console.log(prev);
  const next = 'next' + userArg.id;
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(prev)
        .setLabel('Prev.')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId(next)
        .setLabel('Next')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false)
    );

  let target_user = null;
  if (target) {
    target_user = (await interaction.client.users.fetch(target)).id;
  }

  let bot_message_id = null;

  if (target_user) {
    // In case it doesn't have a target, show the user's own profile
    if (!profilesTracker.cache[target_user]) {
      await profilesTracker.cache.update(target_user, {});
    }

    const user = await interaction.client.users.fetch(target_user);
    const target_user_inviter =
      profilesTracker.cache[target_user].inviter &&
      profilesTracker.cache[target_user].inviter[interaction.guild.id]
        ? await interaction.client.users.fetch(
            profilesTracker.cache[target_user].inviter[interaction.guild.id]
          )
        : null;

    embed1 = {
      title: `${
        profilesTracker.cache[target_user].customUsername
          ? profilesTracker.cache[target_user].customUsername
          : user.tag
      }`,
      color: 16775935,
      fields: [
        {
          name: `Level ${
            profilesTracker.cache[target_user].level
              ? profilesTracker.cache[target_user].level
              : 1
          }`,
          value: `[${
            profilesTracker.cache[target_user].currentXP
              ? profilesTracker.cache[target_user].currentXP
              : 0
          } / ${
            profilesTracker.cache[target_user].maxXP
              ? profilesTracker.cache[target_user].maxXP
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
            profilesTracker.cache[target_user].currentTitle
              ? profilesTracker.cache[target_user].currentTitle
              : 'Alpha Tester'
          }`,
          inline: true,
        },
        {
          name: 'Members Invited',
          value: `${
            profilesTracker.cache[target_user].inviteCountGlobal
              ? profilesTracker.cache[target_user].inviteCountGlobal
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
            profilesTracker.cache[target_user].coins
              ? profilesTracker.cache[target_user].coins
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
        profilesTracker.cache[target_user].customUsername
          ? profilesTracker.cache[target_user].customUsername
          : user.tag
      }`,
      color: 16775935,
      fields: [
        {
          name: 'Activity Points',
          value: `${
            profilesTracker.cache[target_user].activityPoints
              ? profilesTracker.cache[target_user].activityPoints
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
            profilesTracker.cache[target_user].inviter &&
            profilesTracker.cache[target_user].inviter[interaction.guild.id]
              ? 'Inviter'
              : '\u200B'
          }`,
          value: `${
            profilesTracker.cache[target_user].inviter &&
            profilesTracker.cache[target_user].inviter[interaction.guild.id]
              ? target_user_inviter.tag
              : '\u200B'
          }`,
          inline: true,
        },
        {
          name: 'About Me',
          value: `${
            profilesTracker.cache[target_user].aboutMe
              ? profilesTracker.cache[target_user].aboutMe
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

    bot_message_id = (
      await interaction.reply({
        content: null,
        components: checkCollectorAvailability(null, userArg.id) ? [row] : [],
        embeds: [embed1],
        attachments: [],
      })
    ).id;
  } else {
    // In case it doesn't have a target, show the user's own profile
    if (!profilesTracker.cache[userArg.id]) {
      await profilesTracker.cache.update(userArg.id, {});
    }

    const user_inviter =
      profilesTracker.cache[userArg.id].inviter &&
      profilesTracker.cache[userArg.id].inviter[interaction.guild.id]
        ? await interaction.client.users.fetch(
            profilesTracker.cache[userArg.id].inviter[interaction.guild.id]
          )
        : null;

    embed1 = {
      title: `${
        profilesTracker.cache[userArg.id].customUsername
          ? profilesTracker.cache[userArg.id].customUsername
          : userArg.tag
      }`,
      color: 16775935,
      fields: [
        {
          name: `Level ${
            profilesTracker.cache[userArg.id].level
              ? profilesTracker.cache[userArg.id].level
              : 1
          }`,
          value: `[${
            profilesTracker.cache[userArg.id].currentXP
              ? profilesTracker.cache[userArg.id].currentXP
              : 0
          } / ${
            profilesTracker.cache[userArg.id].maxXP
              ? profilesTracker.cache[userArg.id].maxXP
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
            profilesTracker.cache[userArg.id].currentTitle
              ? profilesTracker.cache[userArg.id].currentTitle
              : 'Alpha Tester'
          }`,
          inline: true,
        },
        {
          name: 'Members Invited',
          value: `${
            profilesTracker.cache[userArg.id].inviteCountGlobal
              ? profilesTracker.cache[userArg.id].inviteCountGlobal
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
            profilesTracker.cache[userArg.id].coins
              ? profilesTracker.cache[userArg.id].coins
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
        url: `${userArg.avatarURL()}`,
      },
    };
    embed2 = {
      title: `${
        profilesTracker.cache[userArg.id].customUsername
          ? profilesTracker.cache[userArg.id].customUsername
          : userArg.tag
      }`,
      color: 16775935,
      fields: [
        {
          name: 'Activity Points',
          value: `${
            profilesTracker.cache[userArg.id].activityPoints
              ? profilesTracker.cache[userArg.id].activityPoints
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
            profilesTracker.cache[userArg.id].inviter &&
            profilesTracker.cache[userArg.id].inviter[interaction.guild.id]
              ? user_inviter.tag
              : 'None'
          }`,
          inline: true,
        },
        {
          name: 'About Me',
          value: `${
            profilesTracker.cache[userArg.id].aboutMe
              ? profilesTracker.cache[userArg.id].aboutMe
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
        url: `${userArg.avatarURL()}`,
      },
    };

    bot_message_id = (
      await interaction.reply({
        content: null,
        components: checkCollectorAvailability(null, userArg.id) ? [row] : [],
        embeds: [embed1],
        attachments: [],
      })
    ).id;
  }

  const collectors = require('../modules/userCollectors');

  /*
  WARNING: POSSIBLY BREAKING CHANGES
  if (collectors[userArg.id]) {
    // console.log('Another collector exists');
    collectors[userArg.id].stop();
  }
  */

  // `m` is a message object that will be passed through the filter function
  // const filter = (m) => m.content.includes('next');

  if (checkCollectorAvailability(null, userArg.id)) {
    const filter = (i) => {
      // console.log('entered filter');
      if (
        (i.customId === next || i.customId === prev) &&
        i.user.id !== userArg.id
      ) {
        i.reply(
          `<@${i.user.id}> don't press someone's else buttons! That's rude! >:T`
        );
      }
      return (
        (i.customId === next && i.user.id === userArg.id) ||
        (i.customId === prev && i.user.id === userArg.id)
      );
    };
    // const collector = interaction.channel.createMessageCollector({
    collectors[userArg.id] =
      interaction.channel.createMessageComponentCollector({
        filter,
        time: 30000,
      });

    // this collector should be destroyed anytime if needed
    collectors[userArg.id].notImportant = true;

    collectors[userArg.id].on('collect', async (i) => {
      if (i.customId === next) {
        row.components[1].setDisabled(true);
        row.components[0].setDisabled(false);
      } else {
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(false);
      }
      await i.update({
        embeds: i.customId === next ? [embed2] : [embed1],
        components: [row],
      });
    });

    collectors[userArg.id].on('end', async (collected) => {
      if (interaction.type === 0) {
        await (
          await interaction.channel.messages.fetch(bot_message_id)
        ).edit({
          components: [],
        });
      } else {
        await interaction.editReply({ components: [] });
      }
      // console.log(`Collected ${collected.size} items`);
    });
  }
}
