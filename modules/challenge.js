const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { usersPlaying } = require('./usersPlaying');
const collectors = require('../modules/userCollectors');
const { usersMatch } = require('./usersMatch');
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
  effect
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
      // 30 segundos
    });

  collectors[challengerId].on('collect', async (i) => {
    const randomComputerPlay = Math.floor(Math.random() * 3);
    if (i.customId === 'accept' + challengedPersonId) {
      await effect('ai', interaction, userObj, null);
    } else if (i.customId === 'decline' + challengedPersonId) {
      i.reply('Challenge declined!');
    }
  });

  collectors[challengerId].on('end', async (collected) => {
    if (interaction.type === 0) {
      await (
        await interaction.channel.messages.fetch(bot_message_id)
      ).edit({
        embeds: [
          {
            title: 'Offer declined or expired!',
            description:
              "Try looking for someone else, because that one doesn't have the guts needed >:)",
          },
        ],
        components: [],
      });
    } else {
      //this one still not coded & prevent invite himself
      await interaction.editReply({
        embeds: [
          {
            title: 'Offer declined or expired!',
            description:
              "Try looking for someone else, because that one doesn't have the guts needed >:)",
          },
        ],
        components: [],
      });
    }
    // console.log(`Collected ${collected.size} items`);

    collectors[challengerId] = null;
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

    if (collectors[challengedPersonId] || usersPlaying[challengedPersonId]) {
      repliableObj.reply('That user is currently not available for a match!');
    } else if (collectors[user] || usersPlaying[user]) {
      if (
        usersMatch[challengedPersonId] &&
        usersMatch[challengedPersonId].failMessage
      ) {
        repliableObj.reply(usersMatch[challengedPersonId].failMessage);
      } else {
        repliableObj.reply('You are currently not available for a match!');
      }
    } else {
      bot_message_id = await repliableObj.reply({
        // content: `<@${user}> invited you, <@${challengedPerson.id}>, for a ${gameName} match!`,
        embeds: [
          {
            title: `${gameName} challenge!`,
            description: `<@${user}> invited you, <@${challengedPerson.id}>, for a ${gameName} match!`,
          },
        ],
        components: [challengeAnswerRow(challengedPersonId)],
      });

      buildCollector(challengedPersonId, repliableObj, user, effect);
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
