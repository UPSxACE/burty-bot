const profilesSchema = require('../schema/profiles-schema');
const maxXpPerLevel = 200;

function rewardDaily(userObject, streakLevel) {
  let daily_claim_message = '';

  switch (streakLevel) {
    case 1:
      userObject.coins = userObject.coins ? userObject.coins + 100 : 100;
      addXP(userObject, 100);
      daily_claim_message =
        "You've successefully claimed 100 coins and 100 XP from the daily reward! Streak Points: 1!";
      break;
    case 2:
      userObject.coins = userObject.coins ? userObject.coins + 150 : 150;
      addXP(userObject, 100);
      daily_claim_message =
        "You've successefully claimed 150 coins and 100 XP from the daily reward! Streak Points: 2!";
      break;
    case 3:
      userObject.coins = userObject.coins ? userObject.coins + 210 : 210;
      addXP(userObject, 100);
      daily_claim_message =
        "You've successefully claimed 210 coins and 100 XP from the daily reward! Streak Points: 3!";
      break;
    case 4:
      userObject.coins = userObject.coins ? userObject.coins + 280 : 280;
      addXP(userObject, 100);
      daily_claim_message =
        "You've successefully claimed 280 Coins and 100XP from the daily reward! Streak Points: 4!";
      break;
    case 5:
      userObject.coins = userObject.coins ? userObject.coins + 360 : 360;
      addXP(userObject, 100);
      daily_claim_message =
        "You've successefully claimed 360 Coins and 100XP from the daily reward! Streak Points: 5!";
      break;
    case 6:
      userObject.coins = userObject.coins ? userObject.coins + 420 : 420;
      addXP(userObject, 100);
      daily_claim_message =
        "You've successefully claimed 420 Coins and 100XP from the daily reward! Streak Points: 6!";
      break;
    case 7:
      userObject.coins = userObject.coins ? userObject.coins + 500 : 500;
      addXP(userObject, 100);
      daily_claim_message =
        "You've successefully claimed 500 Coins and 100XP from the daily reward! Streak Points: 7!";
      break;
    default:
      console.log('Something went wrong on the daily reward switch statement!');
  }

  return daily_claim_message;
}

async function daily(userId) {
  let daily_claim_message = '';

  if (!cache[userId]) {
    // if it exists, find by memberId
    await profilesSchema.findOneAndUpdate(
      {
        _id: userId,
      },
      // if it doesn't exist create one, if it exists update with the new configs
      { _id: userId },
      // (mongoose settings to make it either update or insert)
      {
        upsert: true,
      }
    );

    // Updated cached data with new values
    cache[userId] = await profilesSchema.findOne({ _id: userId });
  }

  if (!cache[userId].streakLevel) {
    cache[userId].streakLevel = 0;
  }

  const lastDaily = cache[userId].lastDailyClaimedMlSec
    ? cache[userId].lastDailyClaimedMlSec
    : null;

  // console.log(lastDaily);

  if (lastDaily) {
    // 24 hours
    const dayMlSeconds = 24 * 60 * 60 * 1000;
    const nowMlSeconds = new Date().getTime();
    const lastDailyMlSeconds = cache[userId].lastDailyClaimedMlSec;
    const difMlSeconds = nowMlSeconds - lastDailyMlSeconds;
    const div24 = difMlSeconds / dayMlSeconds;
    // console.log('dif: ' + difMlSeconds + ' day: ' + dayMlSeconds);

    // REVISE THIS MiliSec LOGIC!!!
    if (difMlSeconds < dayMlSeconds) {
      daily_claim_message =
        "It's still too early to claim your next daily reward!";
    } else if (difMlSeconds > dayMlSeconds * 7) {
      cache[userId].streakLevel = 0;
      cache[userId].lastDailyClaimedMlSec = nowMlSeconds;
      cache[userId].streakLevel += 1;
      if (cache[userId].streakLevel > 7) {
        cache[userId].streakLevel = 7;
      }
      daily_claim_message = rewardDaily(
        cache[userId],
        cache[userId].streakLevel
      );
    } else {
      cache[userId].streakLevel = cache[userId].streakLevel - Math.trunc(div24);
      if (cache[userId].streakLevel < 0) {
        cache[userId].streakLevel = 0;
      }
      cache[userId].lastDailyClaimedMlSec = nowMlSeconds;
      cache[userId].streakLevel += 1;
      if (cache[userId].streakLevel > 7) {
        cache[userId].streakLevel = 7;
      }
      daily_claim_message = rewardDaily(
        cache[userId],
        cache[userId].streakLevel
      );
    }
  } else {
    cache[userId].lastDailyClaimedMlSec = new Date().getTime();
    cache[userId].streakLevel = 1;
    daily_claim_message = rewardDaily(cache[userId], 1);
  }

  // Updated cached data with new values
  cache[userId] = await updateProfile(userId, {
    _id: userId,
    level: cache[userId].level,
    currentXP: cache[userId].currentXP,
    maxXP: cache[userId].maxXP,
    streakLevel: cache[userId].streakLevel,
    lastDailyClaimedMlSec: cache[userId].lastDailyClaimedMlSec,
    coins: cache[userId].coins,
  });
  return daily_claim_message;
}

function levelUp(level, currentXP, maxXP) {
  level += 1;
  currentXP = currentXP - maxXP;
  maxXP = level * maxXpPerLevel;
  if (currentXP > maxXP) {
    return levelUp(level, currentXP, maxXP);
  } else {
    return [level, currentXP, maxXP];
  }
}

function addXP(memberObject, newXP) {
  let level = memberObject.level;
  let currentXP = memberObject.currentXP;
  let maxXP = memberObject.maxXP;

  currentXP = currentXP + newXP;

  if (currentXP > maxXP) {
    [memberObject.level, memberObject.currentXP, memberObject.maxXP] = levelUp(
      level,
      currentXP,
      maxXP
    );
  } else {
    [memberObject.level, memberObject.currentXP, memberObject.maxXP] = [
      level,
      currentXP,
      maxXP,
    ];
  }
}

async function updateProfile(memberId, updateConfigArgsObject) {
  // if it exists, find by memberId
  await profilesSchema.findOneAndUpdate(
    {
      _id: memberId,
    },
    // if it doesn't exist create one, if it exists update with the new configs
    { ...updateConfigArgsObject, _id: memberId },
    // (mongoose settings to make it either update or insert)
    {
      upsert: true,
    }
  );

  // Updated cached data with new values
  cache[memberId] = await profilesSchema.findOne({ _id: memberId });
}
async function updateInviteMerge(serverId, inviterId, memberWhoJoinedId) {
  if (!cache[inviterId]) {
    // if it exists, find by memberId
    await profilesSchema.findOneAndUpdate(
      {
        _id: inviterId,
      },
      // if it doesn't exist create one, if it exists update with the new configs
      { _id: inviterId },
      // (mongoose settings to make it either update or insert)
      {
        upsert: true,
      }
    );

    // Updated cached data with new values
    cache[inviterId] = await profilesSchema.findOne({ _id: inviterId });
  }

  if (!cache[memberWhoJoinedId]) {
    // if it exists, find by memberId
    await profilesSchema.findOneAndUpdate(
      {
        _id: memberWhoJoinedId,
      },
      // if it doesn't exist create one, if it exists update with the new configs
      { _id: memberWhoJoinedId },
      // (mongoose settings to make it either update or insert)
      {
        upsert: true,
      }
    );

    // Updated cached data with new values
    cache[memberWhoJoinedId] = await profilesSchema.findOne({
      _id: memberWhoJoinedId,
    });
  }

  if (!cache[inviterId]['inviteCountGlobal']) {
    cache[inviterId]['inviteCountGlobal'] = 0;
  }

  if (!cache[inviterId]['inviteCountServer']) {
    cache[inviterId]['inviteCountServer'] = {};
  }

  if (!cache[inviterId]['inviteCountServer'][serverId]) {
    cache[inviterId]['inviteCountServer'][serverId] = {
      count: 0,
      invitedPeople: [],
    };
  }

  cache[inviterId]['inviteCountGlobal'] += 1;
  cache[inviterId]['inviteCountServer'][serverId]['count'] += 1;
  cache[inviterId]['inviteCountServer'][serverId]['invitedPeople'] = [
    ...cache[inviterId]['inviteCountServer'][serverId]['invitedPeople'],
    memberWhoJoinedId,
  ];

  if (!cache[memberWhoJoinedId]['inviter']) {
    cache[memberWhoJoinedId]['inviter'] = {};
  }

  cache[memberWhoJoinedId]['inviter'][serverId] = inviterId;
  console.log('this: ' + JSON.stringify(cache[inviterId]['inviteCountGlobal']));
  console.log('that: ' + JSON.stringify(cache[inviterId]['inviteCountServer']));

  await updateProfile(inviterId, {
    inviteCountGlobal: cache[inviterId]['inviteCountGlobal'],
    inviteCountServer: cache[inviterId]['inviteCountServer'],
  });
  await updateProfile(memberWhoJoinedId, {
    inviter: cache[memberWhoJoinedId]['inviter'],
  });
}

async function rewardMemberXPAP(memberId, xpAmmount, apAmmount) {
  if (!cache[memberId]) {
    // console.log("User wasn't cached");
    await cache.update(memberId, {});
  }

  if (!cache[memberId].level) {
    // console.log("User didn't have profile. Creating on cache...");
    cache[memberId].level = 1;
    cache[memberId].currentXP = 0;
    cache[memberId].maxXP = maxXpPerLevel;
    cache[memberId].activityPoints = 0;
  }

  addXP(cache[memberId], xpAmmount);
  cache[memberId].activityPoints += apAmmount;

  // if it exists, find by memberId
  await profilesSchema.findOneAndUpdate(
    {
      _id: memberId,
    },
    // if it doesn't exist create one, if it exists update with the new configs
    {
      level: cache[memberId].level,
      currentXP: cache[memberId].currentXP,
      maxXP: cache[memberId].maxXP,
      activityPoints: cache[memberId].activityPoints,
      _id: memberId,
    },
    // (mongoose settings to make it either update or insert)
    {
      upsert: true,
    }
  );

  // Updated cached data with new values
  cache[memberId] = await profilesSchema.findOne({ _id: memberId });
}

// memberId: {}
const cache = {
  async update(memberId, updateConfigArgsObject) {
    await updateProfile(memberId, updateConfigArgsObject);
  },
  async updateInvite(serverId, inviterId, memberId) {
    await updateInviteMerge(serverId, inviterId, memberId);
  },
  async rewardXPAP(memberId, xpAmmount, apAmmount) {
    await rewardMemberXPAP(memberId, xpAmmount, apAmmount);
  },
  async claimDaily(userId) {
    const daily_reward_message = await daily(userId);
    return daily_reward_message;
  },
};

module.exports = { cache };
