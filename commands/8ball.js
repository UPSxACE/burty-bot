const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('8ball')
	.setDescription('A magic 8ball command 🎱')
	.addUserOption((option) =>
      option
        .setName('question')
        .setRequired(false)
    ),
    async execute(interaction){
        const replies = [
        "It is certain",
		"It is decidedly so",
		"Without a doubt",
		"Yes – definitely",
		"You may rely on it",
		"As I see it",
		"yes",
		"Most Likely",
		"Outlook good",
		"Yes",
		"Signs point to yes"];
        const randomIndex = Math.floor(Math.random() * replies.lenght);
        interaction.reply(replies[randomIndex]);
    }
		}