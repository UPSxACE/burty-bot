const { SlashCommandBuilder, Role } = require('discord.js');
const profilesSchema = require('../schema/profiles-schema');
const reactionsTracker = require('../schema/reactionsTracker-schema');
const transformMention = require('../utils/transformMention');
const profilesTracker = require('../modules/profilesTracker');

async function effect(repliableObj, messages_limit) {
  /*
    await message
      .reply(String(Math.floor(Math.random() * 7)))
      .then(function (message) {
        message.react('👍');
        message.react('👎');
      });
  },
  */

  let reactionsTrackerObject = await reactionsTracker.findOneAndUpdate(
    // if it exists, find by memberId
    {
      _id: repliableObj.guild.id,
    },
    // if it doesn't exist create one, if it exists update with the new configs
    { _id: repliableObj.guild.id },
    // (mongoose settings to make it either update or insert)
    {
      upsert: true,
    }
  );
  if (!reactionsTrackerObject) {
    reactionsTrackerObject = await reactionsTracker.findOne(
      // if it exists, find by memberId
      {
        _id: repliableObj.guild.id,
      }
    );
  }

  let currentChannelReactTracker = reactionsTrackerObject['trackedChannels']
    ? reactionsTrackerObject
    : { trackedChannels: {} };
  currentChannelReactTracker = currentChannelReactTracker['trackedChannels'][
    repliableObj.channel.id
  ]
    ? currentChannelReactTracker['trackedChannels'][repliableObj.channel.id]
    : {};

  currentChannelReactTracker = new Map(
    Object.entries(currentChannelReactTracker)
  );

  // Fetch messages
  const fetchedMessages = await repliableObj.channel.messages.fetch({
    limit: messages_limit,
  });

  // Iterate through each message
  for (const message_i of fetchedMessages) {
    // Get the id, the values from that message
    const [message_id_key, val] = message_i;
    // Create a new map for that message, or get one that already exists, and then store in that variable
    let message_map = currentChannelReactTracker.get(message_id_key)
      ? currentChannelReactTracker.get(message_id_key)
      : {};

    let old_map = currentChannelReactTracker.get(message_id_key)
      ? currentChannelReactTracker.get(message_id_key)
      : {};

    // console.log('POG: ' + JSON.stringify(old_map));

    message_map = new Map(Object.entries(message_map));
    old_map = new Map(Object.entries(old_map));

    // Object with the rewards to update:
    /*
    const helperObj = {};
    const rewardArray = Array.from(old_map.get('reward'));
    console.log('REWARD ARRAY:');
    console.log(rewardArray);
    rewardArray((reward) => {
      helperObj[reward] = old_map.get('reward')[reward];
    });
    */

    // Create/update the reward key
    /*
    message_map.get('reward')
      ? message_map.set('reward', {
          ...message_map.get('reward'),
          ...helperObj,
        })
      : message_map.set('reward', helperObj);
      */

    // Set that will store the ID of each user that used a reaction
    const userSet = new Set();

    // Get list of reactions of that message
    const reactions_cache = val.reactions.cache;
    // Iterate through each reaction
    for (const [reaction_id, data] of reactions_cache) {
      // Fetch list of users that reacted with this specific emoji
      await data.users.fetch();
      // wait 1/3 of a second to not break the discord API request limit (50 per second)
      await new Promise((resolve) => setTimeout(resolve, 333));

      // Iterate through each of those users and add their ID to the Set
      for (const [user_id, user_data] of data.users.cache) {
        userSet.add(user_id);
      }
    }

    // Iterate through each reward type
    const ObjKeys = message_map.get('reward')
      ? Object.keys(message_map.get('reward'))
      : [];

    for (const userID of userSet) {
      // Variable that will store the new values of the reward checks
      const newRewardChecks = currentChannelReactTracker.get(message_id_key)
        ? {
            ...message_map.get(userID),
            ...old_map.get(userID),
          }
        : {
            ...message_map.get(userID),
          };

      for (const reward_type_var in ObjKeys) {
        // Iterate through each ID in the Set of user IDs

        // If reward was tracked before, and wasn't delivered yet, reward player
        if (newRewardChecks[ObjKeys[reward_type_var]] === false) {
          // REWARD!
          switch (ObjKeys[reward_type_var]) {
            case 'coins':
              console.log('COINS!!!');
              await profilesTracker.cache.sumCoinsToUser(userID, 10);
              break;
            default:
              console.log(ObjKeys[reward_type_var]);
          }

          newRewardChecks[ObjKeys[reward_type_var]] = true;
        }
        console.log('C: ');
        console.log(newRewardChecks);

        // Update the user's reward checks
        message_map.set(userID, newRewardChecks);
      }
    }

    // (abandoned) If message_map has more than just "reward", store it
    message_map.size > 0 &&
      currentChannelReactTracker.set(String(message_id_key), message_map);
  }

  reactionsTrackerObject['trackedChannels'] = {};
  reactionsTrackerObject['trackedChannels'][repliableObj.channel.id] =
    currentChannelReactTracker;

  // console.log(reactionsTrackerObject);

  await reactionsTracker.findOneAndUpdate(
    // if it exists, find by memberId
    {
      _id: repliableObj.guild.id,
    },
    // if it doesn't exist create one, if it exists update with the new configs
    reactionsTrackerObject,
    // (mongoose settings to make it either update or insert)
    {
      upsert: true,
    }
  );

  return;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rewardreactions')
    .setDescription(
      'Reward those who reacted to rewardable messages(that are fetched) in this channel.'
    )
    .addIntegerOption((option) =>
      option
        .setName('messages_amount')
        .setDescription('Number of messages to reward')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply('Working on it');
    await effect(interaction);
    await interaction.channel.send('Yes it worked');
  },
};
