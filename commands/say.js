const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Say something in a specific channel')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel where the bot will send the message.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('What the bot will say.')
        .setRequired(true)
    ),
  async execute(interaction) {
    // "type === 0" means its a text channel!
    if (interaction.options.getChannel('channel').type === 0) {
      const channel_name = interaction.options.getChannel('channel').name;
      const message = interaction.options.getString('message');
      const channel = interaction.guild.channels.cache.find(
        (channelobject) => channelobject.name === channel_name
      );

      // Reply with the message the user typed
      await channel.send(message);
      await interaction.reply({
        content: 'The message was sent!',
        ephemeral: true,
      });
    } else {
      // In case it's not a text channel, it fails
      await interaction.reply('That is not a text channel!');
    }
  },
};
