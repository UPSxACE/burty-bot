// For now, to update the importantGuilds list, all the bots must be configured and restarted manually
// Later this will be replaced by a foreach loop in client.guilds.cache

const specialInvitesSchema = require('../schema/specialInvites-schema');

// client object will be received as the init and restart functions arguments
const importantGuilds = [
  // rtl
  '794590748473425920',
  // chills
  '812382471622492201',
  // tgs
  '1007951656945733702',
];

module.exports = {
  guildsCache: importantGuilds,
  trackedInvitesCache: {},
  // {serverId: [inviteIds...]}

  async init() {
    //FOR NOW INIT WILL BE USED TO RESTART TOO!
    this.trackedInvitesCache = {};

    for (const guild of importantGuilds) {
      let guildInvites = await specialInvitesSchema.findOneAndUpdate(
        // if it exists, find by memberId
        {
          _id: guild,
        },
        // if it doesn't exist create one, if it exists update with the new configs
        { _id: guild },
        // (mongoose settings to make it either update or insert)
        {
          upsert: true,
        }
      );

      if (!guildInvites) {
        guildInvites = await specialInvitesSchema.findOne(
          // if it exists, find by memberId
          { _id: guild }
        );
      }

      if (guildInvites['trackedInvites']) {
        Object.keys(guildInvites['trackedInvites']).forEach((inviteId) => {
          if (!this.trackedInvitesCache[guild]) {
            this.trackedInvitesCache[guild] = [];
          }
          this.trackedInvitesCache[guild].push(inviteId);
        });
      } else {
        this.trackedInvitesCache[guild] = [];
      }
    }

    console.log('Special Invites Cached!');
    console.log(this.trackedInvitesCache);
  },
  async inviteUsed(guildId, codeId, memberId) {
    //inviteCounts update
    const inviteCountsObject = {};
    inviteCountsObject[codeId] = {
      $ifNull: [{ $add: ['$inviteCounts.' + codeId, 1] }, 1],
    };

    //invitedList update
    const invitedListObject = {};
    const pushObject = {};

    //pushObject[codeId] = memberId;

    pushObject['invitedList.' + codeId] = memberId;
    // invitedListObject[codeId] = { $push: pushObject };

    await specialInvitesSchema.updateOne(
      {
        _id: String(guildId),
      },
      // project applies changes to all the results
      [
        {
          $set: {
            inviteCounts: inviteCountsObject,
          },
        },
      ]
    );

    await specialInvitesSchema.updateOne(
      {
        _id: String(guildId),
      },
      {
        $push: pushObject,
      }
    );
  },
  /*
  FOR NOW INIT WILL BE USED TO RESTART TOO!
  async restart() {
    console.log('pog');
  },
  */
};
