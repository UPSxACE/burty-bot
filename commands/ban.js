const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('The member to ban.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('target');
    interaction.guild.members.ban(user);
  },
};
