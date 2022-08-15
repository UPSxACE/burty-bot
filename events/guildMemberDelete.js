const serverConfig = require('../modules/serverConfig');

module.exports = {
  name: 'guildMemberRemove',
  async execute(guildMember) {
    if (!serverConfig.cache[guildMember.guild.id]) {
      await serverConfig.cache.update(guildMember.guild.id, {});
    }

    if (serverConfig.cache[guildMember.guild.id].setjoinleave) {
      const target_channel = guildMember.guild.channels.cache.find(
        (channelobject) =>
          channelobject.id ===
          serverConfig.cache[guildMember.guild.id].setjoinleave
      );
      target_channel.send({
        embeds: [
          {
            title: 'Member left',
            description: `**User:** <@${guildMember.id}>`,
            color: 14367804,
            author: {
              name: guildMember.user.tag,
              icon_url: guildMember.user.avatarURL(),
            },
            footer: {
              text: `User ID: ${guildMember.user.id}`,
            },
            timestamp: new Date().toISOString(),
          },
        ],
      });
    }
  },
};
