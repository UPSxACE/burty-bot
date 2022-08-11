const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user.')
    .addUserOption(option => 
        option.setName('Target').setDescription('The member to kick.'))
    .setDefaultMemberPermissions(PermissionsFlagsBits.KickMembers | PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const member = interaction.options.getMember('target');
    member.kick();
  },
};
