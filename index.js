
const { Client, GatewayIntentBits } = require('discord.js');
require("dotenv").config();
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply('Server info.');
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
});


// Login to Discord with your client's token
client.login(DISCORD_TOKEN);