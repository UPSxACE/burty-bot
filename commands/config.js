const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Change the bot settings for this server.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('setlogging')
        .setDescription(
          'Sets the default channel where message events are logged. Leave empty to clear the channel.'
        )
        .addChannelOption((option) =>
          option.setName('channel').setDescription('The channel')
        )
    ),
  async execute(interaction, serverConfig) {
    // const subcommand = await ;
    switch (interaction.options.getSubcommand()) {
      case 'setlogging':
        console.log('Set logging triggered');
        if (serverConfig.cache[interaction.guildId]) {
          console.log('Server config:' + serverConfig);
        } else {
          console.log('This server config is not cached yet');
          if (serverConfig.cache['test1']) {
            console.log('Test worked tho');
            console.log('test1: ' + serverConfig.cache['test1']);
          }
        }
        break;
      default:
        console.log('Default triggered. Something went wrong.');
    }

    await interaction.reply('Pong!');
  },
  async executeManual(message, content) {
    await message.reply('Pong!');
  },
};
