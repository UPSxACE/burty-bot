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
          option.setName('channel').setDescription('The target channel')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('setmodlogs')
        .setDescription(
          'Sets the default channel where moderation events are logged. Leave empty to clear the channel.'
        )
        .addChannelOption((option) =>
          option.setName('channel').setDescription('The target channel')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('setjoinleave')
        .setDescription(
          'Sets the default channel where people joining/leaving are logged. Leave empty to clear the channel.'
        )
        .addChannelOption((option) =>
          option.setName('channel').setDescription('The target channel')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('setwelcome')
        .setDescription(
          'Sets the default channel where welcome messages will be sent. Leave empty to clear the channel.'
        )
        .addChannelOption((option) =>
          option.setName('channel').setDescription('The target channel')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('setstarboard')
        .setDescription(
          'Sets the default channel for the starboard messages to be sent. Leave empty to clear the channel.'
        )
        .addChannelOption((option) =>
          option.setName('channel').setDescription('The target channel')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('welcomemessage')
        .setDescription(
          'Sets up a welcome message that will be sent when a new user joins. Leave empty to disable this.'
        )
        .addStringOption((option) =>
          option
            .setName('message')
            .setDescription('The message that will be sent')
        )
    ),
  async execute(interaction, serverConfig) {
    let channel = '';
    let message = '';
    // const subcommand = await ;
    switch (interaction.options.getSubcommand()) {
      case 'list':
        // ...
        break;
      case 'setlogging':
        channel = interaction.options.getChannel('channel');
        if (
          !serverConfig.cache[interaction.guildId] ||
          channel.id != serverConfig.cache[interaction.guildId].setlogging
        ) {
          await serverConfig.cache.update(interaction.guildId, {
            setlogging: channel.id,
          });
        }
        await interaction.reply('Logging channel settings updated!');
        break;
      case 'setmodlogs':
        channel = interaction.options.getChannel('channel');
        if (
          !serverConfig.cache[interaction.guildId] ||
          channel.id != serverConfig.cache[interaction.guildId].setmodlogs
        ) {
          await serverConfig.cache.update(interaction.guildId, {
            setmodlogs: channel.id,
          });
        }
        await interaction.reply('Mod logging channel settings updated!');
        break;
      case 'setjoinleave':
        channel = interaction.options.getChannel('channel');
        if (
          !serverConfig.cache[interaction.guildId] ||
          channel.id != serverConfig.cache[interaction.guildId].setjoinleave
        ) {
          await serverConfig.cache.update(interaction.guildId, {
            setjoinleave: channel.id,
          });
        }
        await interaction.reply('Join/leave logging channel settings updated!');
        break;
      case 'setwelcome':
        channel = interaction.options.getChannel('channel');
        if (
          !serverConfig.cache[interaction.guildId] ||
          channel.id != serverConfig.cache[interaction.guildId].setwelcome
        ) {
          await serverConfig.cache.update(interaction.guildId, {
            setwelcome: channel.id,
          });
        }
        await interaction.reply('Welcome channel settings updated!');
        break;
      case 'setstarboard':
        channel = interaction.options.getChannel('channel');
        if (
          !serverConfig.cache[interaction.guildId] ||
          channel.id != serverConfig.cache[interaction.guildId].setstarboard
        ) {
          await serverConfig.cache.update(interaction.guildId, {
            setstarboard: channel.id,
          });
        }
        await interaction.reply('Starboard channel settings updated!');
        break;
      case 'welcomemessage':
        message = interaction.options.getString('message');
        if (
          !serverConfig.cache[interaction.guildId] ||
          message != serverConfig.cache[interaction.guildId].welcomemessage
        ) {
          await serverConfig.cache.update(interaction.guildId, {
            welcomemessage: message,
          });
        }
        await interaction.reply('Starboard channel settings updated!');
        break;
      default:
        console.log('Default case triggered. Something went wrong.');
    }
  },
  // async executeManual(message, content) {
  // await message.reply('Pong!');
  // },
};
