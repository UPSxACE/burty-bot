const profilesSchema = require('../schema/profiles-schema');
const maxXpPerLevel = 200;

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
};

module.exports = { cache };
