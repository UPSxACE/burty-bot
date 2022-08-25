function stringFinder(content) {
  let found = 0;
  let indexer = content.map((part, index) => {
    if (found === 0) {
      if (part[0] === '"') {
        found = 1;
        return index;
      }
    } else if (found === 1) {
      if (part[part.length - 1] === '"') {
        found = 2;
        return index;
      }
    }
  });

  // clear empty values in array
  indexer = indexer.filter((n) => n);
  // console.log('indexer: ' + indexer);

  let result = '';

  content.forEach((part, index) => {
    if (index === indexer[0]) {
      // remove first char (")
      result = part.slice(1);
      // } else if (index > indexer[0] && index <= indexer[0]) {
    } else if (index > indexer[0] && index < indexer[1]) {
      // remove last char (")
      result += ' ' + part;
    } else if (index === indexer[1]) {
      result += ' ' + part.slice(0, -1);
    }
  });

  // console.log('result: ' + result);
  if (!indexer[1]) {
    // console.log('false');
    return [content, false];
  }
  let finalArray = content.map((part, index) => {
    if (index === indexer[0]) {
      return result;
    }
    if (index < indexer[0] || index > indexer[1]) {
      return part;
    }
  });

  // clear empty values in array
  finalArray = finalArray.filter((n) => n);
  // console.log('final array: ' + finalArray);

  return [finalArray, true];
}

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

    if (firstPartOfString.toLowerCase() === prefix.toLowerCase()) {
      // console.log("It's a command confirmed.");

      // !help commands      ----> ['help', 'commands']
      let content = message.content.slice(prefix.length).split(' ');
      // console.log(content);
      content = stringFinder(content);
      // content: [contentArray, hasString?]

      const command = message.client.commands.get(content[0][0]);
      if (content[0][0] !== '') {
        if (command) {
          command.executeManual
            ? command.executeManual(message, content[0], content[1])
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
      // console.log("It's not a command.");
    }
  },
};
