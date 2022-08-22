const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('The member to ban.')
        .setRequired(true),
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers,
    ),
  async execute(interaction) {
    try {
      const user = interaction.options.getUser('target')
      await interaction.guild.members.ban(user)
      await interaction.reply('User was successfully banned!')
    } catch (err) {
      console.log('ERROR CODE M101')
      await interaction.reply('Could not execute command :(')
    }
  },
}
