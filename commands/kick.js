const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('The member to kick.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers
    ),
  async execute(interaction) {
    const member = interaction.options.getUser('target');
    interaction.guild.members.kick(member);
    interaction.reply('User was successfully kicked!');
  },
};
