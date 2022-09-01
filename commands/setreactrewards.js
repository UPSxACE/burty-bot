const { SlashCommandBuilder } = require('discord.js');

async function effect(repliableObj, reward_type, messages_limit, reward_value) {
  /*
    await message
      .reply(String(Math.floor(Math.random() * 7)))
      .then(function (message) {
        message.react('👍');
        message.react('👎');
      });
  },
  */

  // Fetch messages
  const fetchedMessages = await repliableObj.channel.messages.fetch({
    limit: messages_limit,
  });

  // Create object that will store tracked messages, and their rewards´
  // key: message_id, value: map of userIds plus "reward" key
  const rewardableMessagesObject = new Map();

  // Test
  const testMap = new Map();
  testMap.set('reward', { coins: 10, title: 'hero' });
  testMap.set('451074265727631361', { title: false, coins: true });
  testMap.set('1006942483030216805', { title: true });
  rewardableMessagesObject.set('1014627904853917768', testMap);

  // Iterate through each message
  for (const message_i of fetchedMessages) {
    // Get the id, the values from that message
    const [message_id_key, val] = message_i;
    // Create a new map for that message, or get one that already exists, and then store in that variable
    const message_map = rewardableMessagesObject.get(message_id_key)
      ? rewardableMessagesObject.get(message_id_key)
      : new Map();

    // Object with the rewards to update:
    const helperObj = {};
    helperObj[reward_type] = reward_value;

    // Create/update the reward key
    message_map.get('reward')
      ? message_map.set('reward', {
          ...message_map.get('reward'),
          ...helperObj,
        })
      : message_map.set('reward', helperObj);

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
    for (const reward_type_var in message_map.get('reward')) {
      // Iterate through each ID in the Set of user IDs
      for (const userID of userSet) {
        // Variable that will store the new values of the reward checks
        const newRewardChecks = rewardableMessagesObject.get(message_id_key)
          ? {
              ...message_map.get(userID),
              ...rewardableMessagesObject.get(message_id_key).get(userID),
            }
          : {
              ...message_map.get(userID),
            };

        // If this reward type wasn't tracked before, set to false
        if (!newRewardChecks[String(reward_type_var)]) {
          newRewardChecks[String(reward_type_var)] = false;
        }

        // Update the user's reward checks
        message_map.set(userID, newRewardChecks);
      }
    }

    // If message_map has more than just "reward", store it
    message_map.size > 1 &&
      rewardableMessagesObject.set(String(message_id_key), message_map);
  }
  // console.log(dataArray);
  console.log(rewardableMessagesObject);

  return;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setreactrewards')
    .setDescription(
      'Setup rewards for reacting to the messages in this channel.'
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('coins')
        .setDescription(
          'Set the coin reward for reacting to the messages in this channel.'
        )
        .addIntegerOption((option) =>
          option
            .setName('messages_amount')
            .setDescription('Number of messages to apply this setting on')
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName('coins_ammount')
            .setDescription('Number of coins to reward')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('role')
        .setDescription(
          'Set the role reward for reacting to the messages in this channel.'
        )
        .addIntegerOption((option) =>
          option
            .setName('messages_amount')
            .setDescription('Number of messages to apply this setting on')
            .setRequired(true)
        )
        .addMentionableOption((option) =>
          option
            .setName('role_to_reward')
            .setDescription('Role to reward')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('title')
        .setDescription(
          'Set the title reward for reacting to the messages in this channel.'
        )
        .addIntegerOption((option) =>
          option
            .setName('messages_amount')
            .setDescription('Number of messages to apply this setting on')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('Title to reward')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    let reward = null;
    const messages_limit = interaction.options.getInteger('messages_amount');
    if (messages_limit > 100) {
      interaction.reply(
        "The amount of messages to fetch can't be superior to 100!"
      );
      return;
    }
    switch (interaction.options.getSubcommand()) {
      case 'coins':
        reward = interaction.options.getInteger('coins_ammount');
        effect(interaction, 'coins', messages_limit, reward);
        break;
      case 'role':
        break;
      case 'title':
        break;
    }
  },
  async executeManual(message, content) {
    effect(message);
  },
};
