const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { usersPlaying } = require('./usersPlaying');
const collectors = require('../modules/userCollectors');
const { usersMatch } = require('./usersMatch');
const checkCollectorAvailability = require('../utils/checkCollectorAvailability');
let bot_message_id = null;

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

const buildCollector = (
  challengedPersonId,
  interaction,
  challengerId,
  effect,
  challengedPersonObj
) => {
  let userObj = null;
  if (interaction.type === 0) {
    userObj = interaction.author;
  } else {
    userObj = interaction.user;
  }

  // `m` is a message object that will be passed through the filter function
  // const filter = (m) => m.content.includes('next');
  const filter = (i) => {
    // console.log('entered filter');
    if (i.user.id !== challengedPersonId) {
      i.reply(
        `<@${i.user.id}> don't press someone's else buttons! That's rude! >:T`
      );
    }
    return (
      i.user.id === challengedPersonId &&
      (i.customId === 'accept' + challengedPersonId ||
        i.customId === 'decline' + challengedPersonId)
    );
  };
  // const collector = interaction.channel.createMessageCollector({
  collectors[challengerId] =
    interaction.channel.createMessageComponentCollector({
      filter,
      time: 30000,
      // 30 seconds
    });

  collectors[challengerId].on('collect', async (i) => {
    if (i.customId === 'accept' + challengedPersonId) {
      if (!checkCollectorAvailability(i, challengedPersonId)) {
        return;
      }
      // changes are here
      await collectors[challengerId].stop();
      collectors[challengerId] = null;
      await effect('pvp', interaction, userObj, challengedPersonObj);
      // console.log('after effect');
    } else if (i.customId === 'decline' + challengedPersonId) {
      i.reply('Challenge declined!');
      await collectors[challengerId].stop();
      collectors[challengerId] = null;
    }
  });

  collectors[challengerId].on('end', async (collected) => {
    // console.log('right one end called');
    const last = collected.last();
    if (last && last.customId === 'accept' + challengedPersonId) {
      if (interaction.type === 0) {
        await (
          await interaction.channel.messages.fetch(bot_message_id)
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
        await interaction.editReply({
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
    } else if (last && last.customId === 'decline' + challengedPersonId) {
      if (interaction.type === 0) {
        await (
          await interaction.channel.messages.fetch(bot_message_id)
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
        await interaction.editReply({
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
    } else if (interaction.type === 0) {
      await (
        await interaction.channel.messages.fetch(bot_message_id)
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
      collectors[challengerId] = null;
    } else {
      // this one still not coded & prevent invite himself
      await interaction.editReply({
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
  });
};

async function generateInvite(
  repliableObj,
  gameName,
  challengedPersonId,
  effect
) {
  const challengedPerson = await repliableObj.client.users.fetch(
    challengedPersonId
  );

  if (challengedPerson.bot) {
    repliableObj.reply("You can't challenge a bot!");
  } else {
    let user = null;
    if (repliableObj.type === 0) {
      user = repliableObj.author.id;
    } else {
      user = repliableObj.user.id;
    }

    if (!checkCollectorAvailability(repliableObj, user, challengedPersonId)) {
      return;
    } else {
      bot_message_id = (
        await repliableObj.reply({
          // content: `<@${user}> invited you, <@${challengedPerson.id}>, for a ${gameName} match!`,
          embeds: [
            {
              title: `${gameName} challenge!`,
              description: `<@${user}> invited you, <@${challengedPerson.id}>, for a ${gameName} match!`,
              color: 15512290,
            },
          ],
          components: [challengeAnswerRow(challengedPersonId)],
        })
      ).id;

      buildCollector(
        challengedPersonId,
        repliableObj,
        user,
        effect,
        challengedPerson
      );
    }
  }
}

module.exports = async (
  gameId,
  repliableObj,
  challengedPersonId,
  effectFunction
) => {
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
      case 0:
        await generateInvite(
          repliableObj,
          'Rock Paper Scissors',
          challengedPersonId,
          effectFunction
        );
        break;
      default:
        console.log('Error CODE 9008');
        break;
    }
  }
};
