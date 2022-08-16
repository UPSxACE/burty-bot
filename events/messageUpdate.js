const serverConfig = require('../modules/serverConfig');

function fetchAttachments(oldMessage) {
  let attachmentString = '';

  oldMessage.attachments.each(
    (attachment) =>
      (attachmentString =
        attachmentString +
        `**Old Message Attachment(URL):** ${attachment.url}\n`)
  );

  return attachmentString;
}

// This event is limited to the cached messages, and currently we don't have any function to force the fetch.
// Uncached messages won't be logged.

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (oldMessage.author.bot) {
      return;
    }

    if (!serverConfig.cache[oldMessage.guildId]) {
      await serverConfig.cache.update(oldMessage.guildId, {});
    }

    if (serverConfig.cache[oldMessage.guildId].setlogging) {
      const target_channel = oldMessage.guild.channels.cache.find(
        (channelobject) =>
          channelobject.id === serverConfig.cache[oldMessage.guildId].setlogging
      );
      target_channel.send({
        embeds: [
          {
            title: `Message edited at #${oldMessage.channel.name}`,
            description: `**Channel ID:** ${
              oldMessage.channelId
            }\n**Before**: ${oldMessage}\n**After**: ${newMessage}\n${fetchAttachments(
              oldMessage
            )}`,
            url: newMessage.url,
            color: 5609935,
            author: {
              name: oldMessage.author.tag,
              icon_url: oldMessage.author.avatarURL(),
            },
            footer: {
              text: `User ID: ${oldMessage.author.id}`,
            },
            timestamp: newMessage.editedAt.toISOString(),
          },
        ],
      });
    }
  },
};
