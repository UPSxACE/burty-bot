const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage, Image } = require('@napi-rs/canvas');
const axios = require('axios');

function generateTextDecoration(loveLevel, smallestName, biggestName) {
  if (loveLevel > 50) {
    // 51-100
    if (loveLevel > 50 && loveLevel < 58) {
      // 51-57
      return ['Would anyone approve this anyways?', '🤨'];
    }
    if (loveLevel > 57 && loveLevel < 60) {
      // 58-59
      return ['One of them would have to try really hard.', '🤔'];
    }
    if (loveLevel > 59 && loveLevel < 66) {
      // 60-65
      return [
        `There is a high chance ${smallestName} screws everything at some point!`,
        '😔',
      ];
    }
    if (loveLevel > 65 && loveLevel < 71) {
      // 66-70
      return ['Salty couple, not gonna lie.', '😑'];
    }
    if (loveLevel > 70 && loveLevel < 76) {
      // 71-75
      return ['They would be too cheesy together.', '🤣'];
    }
    if (loveLevel > 75 && loveLevel < 83) {
      // 76-82
      return ["Aren't they adorable!?", '😳'];
    }
    if (loveLevel > 89 && loveLevel < 91) {
      // 83-90
      return ['You should start naming your first 5 kids already.', '🥰'];
    }
    if (loveLevel > 90 && loveLevel < 95) {
      // 91-94
      return ['Love at first sight!', '😍'];
    }
    if (loveLevel > 95 && loveLevel < 100) {
      // 96-99
      return ['Marry!!! Now!!!!!!.', '😍'];
    }
    if (loveLevel === 100) {
      // 100
      return ['Perfect pair, twin souls!!!', '😻'];
    }
  } else {
    // 0-50
    if (loveLevel > 0 && loveLevel < 8) {
      // 1-7
      return ['It would never work!!!', '😭'];
    }
    if (loveLevel > 7 && loveLevel < 10) {
      // 8-9
      return [`${biggestName} you can get better than that.`, '😭'];
    }
    if (loveLevel > 9 && loveLevel < 16) {
      // 10-15
      return [`${biggestName} doesn´t deserve this.`, '😥'];
    }
    if (loveLevel > 15 && loveLevel < 21) {
      // 16-20
      return ['Nothing is impossible... except those two together.', '😓'];
    }
    if (loveLevel > 20 && loveLevel < 26) {
      // 21-25
      return [`${smallestName} is too horny for ${biggestName}!`, '😶'];
    }
    if (loveLevel > 25 && loveLevel < 33) {
      // 26-32
      return ['Just... No!', '😭'];
    }
    if (loveLevel > 32 && loveLevel < 41) {
      // 33-40
      return ['Not meant to happen.', '😅'];
    }
    if (loveLevel > 40 && loveLevel < 51) {
      // 41-50
      return ['Very one-sided love.', '🙄'];
    }
  }
}

async function loadUrlImage(link) {
  return (
    await axios.get(link, {
      responseType: 'arraybuffer',
    })
  ).data;
}

const transformMention = require('../utils/transformMention');

async function effect(repliableObj, person1, person2) {
  // Create a 700x250 pixel canvas and get its context
  // The context will be used to modify the canvas
  const canvas = createCanvas(384, 128);
  const context = canvas.getContext('2d');
  // ...

  // const background = await Canvas.loadImage('./wallpaper.jpg');

  // This uses the canvas dimensions to stretch the image onto the entire canvas
  // context.drawImage(background, 0, 0, canvas.width, canvas.height);

  /*
  const Image2 = new Image();
  Image2.src = await loadUrlImage(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Logo_AA.svg/1200px-Logo_AA.svg.png'
  );
  */

  const Image2 = await loadImage('assets/2small.png');

  const p1 = await repliableObj.client.users.fetch(person1);
  const p2 = await repliableObj.client.users.fetch(person2);

  if (p1.id === p2.id) {
    await repliableObj.reply("Don't be a narcissist 😑");
    return;
  }

  const Image1 = new Image();
  Image1.src = await loadUrlImage(
    `https://cdn.discordapp.com/avatars/${p1.id}/${p1.avatar}.png`
  );

  const Image3 = new Image();
  Image3.src = await loadUrlImage(
    `https://cdn.discordapp.com/avatars/${p2.id}/${p2.avatar}.png`
  );

  context.drawImage(Image1, 0, 0, 128, 128);
  context.drawImage(Image2, 142, 14, 100, 100);
  context.drawImage(Image3, 256, 0, 128, 128);

  // Use the helpful Attachment class structure to process the file for you
  const attachment = new AttachmentBuilder(await canvas.encode('png'), {
    name: 'ship.png',
  });

  const loveLevel = ((Number(person1) % 101) + (Number(person2) % 101)) % 101;
  const textDecoration = generateTextDecoration(loveLevel);

  // ----

  await repliableObj.reply({
    content: null,
    embeds: [
      {
        title: 'Love Match!',
        description: `**${p1.tag} + ${p2.tag} = __${loveLevel}__% ${
          loveLevel > 49 ? '❤' : '💔'
        }**\n **${textDecoration[0]} ${textDecoration[1]}**`,
        color: 15512290,
        image: {
          url: 'attachment://ship.png',
        },
      },
    ],
    files: [attachment],
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Check if your dream couple would work!'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
  async executeManual(message, content) {
    // doesn't work for people with default avatars -> reason: the way avatar urls are being generated probably
    // possible fix: add a condition for when user.avatar is undefined
    if (content[1] && content[2]) {
      try {
        await effect(
          message,
          transformMention(content[1]),
          transformMention(content[2])
        );
      } catch (err) {
        try {
          await effect(message, content[1], content[2]);
        } catch (err) {
          console.log('Error CODE 9021');
          message.reply("Couldn't find such users :(");
        }
      }
    } else if (content[1]) {
      try {
        await effect(
          message,
          transformMention(message.author.id),
          transformMention(content[1])
        );
      } catch (err) {
        try {
          await effect(
            message,
            transformMention(message.author.id),
            transformMention(content[1])
          );
        } catch (err) {
          console.log('Error CODE 9022');
          message.reply("Couldn't find such user :(");
        }
      }
    } else {
      message.reply('You need to specify at least one user!');
      //effect(message);
    }
  },
};
