const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('The member to unban.')
        .setRequired(true),
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers,
    ),
  async execute(interaction) {
    try {
      const id = interaction.options.get('target')?.value
      await interaction.guild.members.unban(id)
      await interaction.reply('User was successfully unbanned!')
    } catch (err) {
      console.log('ERROR CODE M102')
      await interaction.reply('Could not execute command :(')
    }
  },
}
