const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
require("dotenv").config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const SERVER_ID = process.env.SERVER_ID;
const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());


const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID,SERVER_ID), { headers: {"Authorization": `Bot ${DISCORD_TOKEN}`} ,body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);