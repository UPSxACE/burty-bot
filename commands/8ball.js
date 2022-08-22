const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('8ball')
	.setDescription('A magic 8ball command 🎱')
	.addUserOption((option) =>
      option
        .setName('question')
        .setDescription('something you\'d like to ask')
        .setRequired(false)
    ),
    async execute(interaction){
        const replies = [
    'It is uncertain',
		'It is decidedly so',
		'Without a doubt',
		'Yes definitely',
		'You may rely on it',
		'Yes',
		'Most Likely No',
		'Outlook good',
		'No',
		'Signs point to no'];
        const randomIndex = Math.floor(Math.random() * replies.lenght);
        interaction.reply(replies[randomIndex]);
    }
}
