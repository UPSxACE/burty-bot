const serverConfig = require('../modules/serverConfig');

function fetchAttachments(oldMessage) {
  let attachmentString = '';

  oldMessage.attachments.each(
    (attachment) =>
      (attachmentString =
        attachmentString +
        `**Deleted Message Attachment(URL):** ${attachment.url}\n`)
  );

  return attachmentString;
}

// This event is limited to the cached messages, and currently we don't have any function to force the fetch.
// Uncached messages won't be logged.

module.exports = {
  name: 'messageDelete',
  async execute(messageDeleted) {
    if (!serverConfig.cache[messageDeleted.guildId]) {
      await serverConfig.cache.update(messageDeleted.guildId, {});
    }

    if (serverConfig.cache[messageDeleted.guildId].setlogging) {
      const target_channel = messageDeleted.guild.channels.cache.find(
        (channelobject) =>
          channelobject.id ===
          serverConfig.cache[messageDeleted.guildId].setlogging
      );
      target_channel.send({
        embeds: [
          {
            title: `Message deleted at #${messageDeleted.channel.name}`,
            description: `**Channel ID:** ${
              messageDeleted.channelId
            }\n**Message**: ${messageDeleted}\n${fetchAttachments(
              messageDeleted
            )}`,
            color: 14367804,
            author: {
              name: messageDeleted.author.tag,
              icon_url: messageDeleted.author.avatarURL(),
            },
            footer: {
              text: `User ID: ${messageDeleted.author.id}`,
            },
            timestamp: new Date().toISOString(),
          },
        ],
      });
    }
  },
};
