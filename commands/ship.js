const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

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

  const Image1 = await loadImage('assets/1.webp');
  const Image2 = await loadImage('assets/2small.png');
  const Image3 = await loadImage('assets/3.webp');

  context.drawImage(Image1, 0, 0, 128, 128);
  context.drawImage(Image2, 142, 14, 100, 100);
  context.drawImage(Image3, 256, 0, 128, 128);

  // Use the helpful Attachment class structure to process the file for you
  const attachment = new AttachmentBuilder(await canvas.encode('png'), {
    name: 'ship.png',
  });

  repliableObj.reply({ files: [attachment] });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Check if your dream couple would work!'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
  async executeManual(message, content) {
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
        await effect(message, transformMention(content[1]), message.author);
      } catch (err) {
        try {
          await effect(message, content[1], message.author);
        } catch (err) {
          console.log('Error CODE 9022');
          message.reply("Couldn't find such user :(");
        }
      }
    } else {
      message.reply('You need to specify at least one user!');
    }
  },
};
