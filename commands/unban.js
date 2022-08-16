const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('The member to unban.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers
    ),
  async execute(interaction) {
    const id = interaction.options.get('target')?.value;
    interaction.guild.members.unban(id);
    interaction.reply('User was successfully unbanned!');
  },
};
