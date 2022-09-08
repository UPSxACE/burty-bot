const { SlashCommandBuilder } = require('discord.js');
const specialInvites = require('../schema/specialInvites-schema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('newspecialinvite')
    .setDescription('Create a special invite!')
    .addStringOption((option) =>
      option
        .setName('invite_id')
        .setDescription('The invite ID.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('invite_name')
        .setDescription('The invite name.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const inviteID = interaction.options.getString('invite_id');
    const inviteName = interaction.options.getString('invite_name');
    if (inviteID) {
      await specialInvites.findOneAndUpdate(
        // if it exists, find by memberId
        { _id: interaction.guild.id },
        // if it doesn't exist create one, if it exists update with the new configs
        { _id: interaction.guild.id },
        // (mongoose settings to make it either update or insert)
        {
          upsert: true,
        }
      );

      const specialInvitesCache = await specialInvites.findOne(
        // if it exists, find by memberId
        {
          _id: interaction.guild.id,
        }
      );

      if (specialInvitesCache['trackedInvites']) {
        if (specialInvitesCache['trackedInvites'][inviteID]) {
          interaction.reply('That invite is already being tracked!');
          return;
        }
      }

      if (specialInvitesCache['trackedInvites']) {
        specialInvitesCache['trackedInvites'][inviteID] = inviteName;
      } else {
        specialInvitesCache['trackedInvites'] = {};
        specialInvitesCache['trackedInvites'][inviteID] = inviteName;
      }

      if (!specialInvitesCache['inviteCounts']) {
        specialInvitesCache['inviteCounts'] = {};
        specialInvitesCache['inviteCounts'][inviteID] = 0;
      } else {
        specialInvitesCache['inviteCounts'][inviteID] = 0;
      }

      if (!specialInvitesCache['invitedList']) {
        specialInvitesCache['invitedList'] = {};
        specialInvitesCache['invitedList'][inviteID] = [];
        // empty set
      } else {
        specialInvitesCache['invitedList'][inviteID] = [];
      }

      if (!specialInvitesCache['inviteRewards']) {
        specialInvitesCache['inviteRewards'] = {};
        specialInvitesCache['inviteRewards'][inviteID] = {};
      } else {
        specialInvitesCache['inviteRewards'][inviteID] = {};
      }

      specialInvitesCache['inviteRewards'][inviteID]['coins'] = 0;
      specialInvitesCache['inviteRewards'][inviteID]['role'] = '';
      specialInvitesCache['inviteRewards'][inviteID]['title'] = '';

      await specialInvites.findOneAndUpdate(
        // if it exists, find by memberId
        { _id: interaction.guild.id },
        // if it doesn't exist create one, if it exists update with the new configs
        specialInvitesCache,
        // (mongoose settings to make it either update or insert)
        {
          upsert: true,
        }
      );
    }

    await interaction.reply('Special invite added!');
  },
};
