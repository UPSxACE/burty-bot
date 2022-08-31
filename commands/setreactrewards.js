const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('setreactrewards'),
  async executeManual(message, content) {
    /*
    await message
      .reply(String(Math.floor(Math.random() * 7)))
      .then(function (message) {
        message.react('👍');
        message.react('👎');
      });
  },
  */
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    const fetchedMessages = await message.channel.messages.fetch({
      limit: 100,
    });

    /*
    fetchedMessages.each(async (message_i) => {
      console.log('call');
      const fetched = await message_i.fetch();
      console.log(JSON.stringify(fetched.reactions.cache));
    });*/

    //const rewardableMessages = []; // list of ids
    const rewardableMessagesObject = new Map(); // key: message_id, value: map of userIds plus "reward" key
    const dataArray = new Set([]);

    const testMap = new Map();
    testMap.set('reward', { coins: 10, title: 'hero' });
    testMap.set('451074265727631361', { coins: true, title: false });
    testMap.set('1006942483030216805', { title: true });
    rewardableMessagesObject.set('1014487228552052796', testMap);

    for (const message_i of fetchedMessages) {
      const [message_id_key, val] = message_i;
      const message_map = rewardableMessagesObject.get(message_id_key)
        ? rewardableMessagesObject.get(message_id_key)
        : new Map();

      // simulating reward settings just for the test:
      message_map.get('reward')
        ? (message_map.get('reward')['coins'] = 50)
        : message_map.set('reward', { coins: 50 });

      const reactions_cache = val.reactions.cache;
      for (const [reaction_id, data] of reactions_cache) {
        const userSet = new Set();
        await data.users.fetch();
        // wait 1/3 of a second to not break the discord API request limit (50 per second)
        await new Promise((resolve) => setTimeout(resolve, 333));
        console.log(data.users.cache);
        for (const [user_id, user_data] of data.users.cache) {
          userSet.add(user_id);
        }
        console.log(userSet);

        for (const reward_type in message_map.get('reward')) {
          for (const userID of userSet) {
            // get the old check values
            // const newRewardChecks = { ...message_map[userID] };
            console.log(message_id_key);
            console.log('A:' + rewardableMessagesObject.get(message_id_key));
            try {
              console.log(
                'B:' + rewardableMessagesObject.get(message_id_key).get(userID)
              );
            } catch (err) {
              console.log('B');
            }
            const newRewardChecks = rewardableMessagesObject.get(message_id_key)
              ? {
                  ...message_map.get(userID),
                  ...rewardableMessagesObject.get(message_id_key).get(userID),
                }
              : {
                  ...message_map.get(userID),
                };
            if (!newRewardChecks[String(reward_type)]) {
              newRewardChecks[String(reward_type)] = false;
            }
            message_map.set(userID, newRewardChecks);
          }
        }
      }
      // console.log(message_map.get('reward'));
      /* QUEIJO
      for (const reward_type in message_map.get('reward')) {
        for (const [reaction_id, data] of reactions_cache) {
          const helperObj = {};
          helperObj[String(reward_type)] = false;
          message_map.set(reaction_id, {
            ...message_map[reaction_id],
            ...helperObj,
          });
        }
      }
      MOZARELA
      */

      /*
      for (const [reaction_id, data] of reactions_cache) {
        message_map.set(reaction_id, false);
      }*/
      // console.log(fetched.reactions.reactions_cache);
      message_map.size > 1 &&
        rewardableMessagesObject.set(String(message_id_key), message_map);
    }
    // console.log(dataArray);
    console.log(rewardableMessagesObject);

    return;
  },
};
