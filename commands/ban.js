const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user.')
    .addUserOption(option => 
        option.setName('Target').setDescription('The member to ban.'))
    .setDefaultMemberPermissions(PermissionsFlagsBits.KickMembers | PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('target');
    guild.members.ban(user);
  
},
};
