const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('A magic 8ball command 🎱')
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription("something you'd like to ask")
        .setRequired(false)
    ),
  async execute(interaction) {
    const replies = [
      // yes 10
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      // maybe 3
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      // no 10
      "Don't count on it",
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.',
      'Definitely not.',
      'As I see it, no.',
      'Most likely not.',
      'No.',
      'Signs point to no.',
    ];
    const randomIndex = Math.floor(Math.random() * replies.length);
    await interaction.reply({
      content: null,
      embeds: [
        {
          title: interaction.options.getString('question'),
          description: '🎱' + replies[randomIndex],
          color: 15512290,
        },
      ],
    });
  },
};
