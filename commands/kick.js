const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('The member to kick.')
        .setRequired(true),
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers,
    ),
  async execute(interaction) {
    try {
      const member = interaction.options.getUser('target')
      await interaction.guild.members.kick(member)
      await interaction.reply('User was successfully kicked!')
    } catch (err) {
      console.log('ERROR CODE M100')
      await interaction.reply('Could not execute command :(')
    }
  },
}
