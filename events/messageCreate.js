module.exports = {
  name: 'messageCreate',
  execute(message) {
    if (message.author.bot) return;
    // console.log(
    //  `New message on the server "${message.guild}", in the channel #${message.channel.name}. Checking if its a command.`
    // );

    // Verify if the first word of the message is the same as the command
    const prefix = require('../config.json').prefix;
    const firstPartOfString = message.content.slice(0, prefix.length);

    if (firstPartOfString === prefix) {
      // console.log("It's a command confirmed.");

      const content = message.content.slice(prefix.length).split(' ');

      const command = message.client.commands.get(content[0]);
      if (content[0] !== '') {
        if (command) {
          command.executeManual
            ? command.executeManual(message, content)
            : message.reply(
                'This command cannot be executed manually. Execute it with the slashcommands feature.'
              );
        } else {
          // If the command doesn't exist it doesn't need a reply, so I commented this line below
          // message.reply("That command doesn't seem to exist!");
          return;
        }
      } else {
        console.log(content);
        if (content.length === 1) {
          message.reply("Choose a command! I'm Ready!");
        }
        return;
      }
    } else {
      console.log("It's not a command.");
    }
  },
};
