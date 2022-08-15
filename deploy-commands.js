const { Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');

require('dotenv').config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// Read the commands folder, and add every .js file to a Collection object "client.commands"
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

// delete old
rest
  .put(Routes.applicationCommands(CLIENT_ID), { body: [] })
  .then(() => console.log('Successfully deleted all application commands.'))
  .catch(console.error);

// deploy new to one server
/*
const SERVER_ID = process.env.SERVER_ID;
rest
  .put(Routes.applicationGuildCommands(CLIENT_ID, SERVER_ID), {
    headers: { Authorization: `Bot ${DISCORD_TOKEN}` },
    body: commands,
  })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
*/

// deploy new to all servers
rest
  .put(Routes.applicationCommands(CLIENT_ID), {
    headers: { Authorization: `Bot ${DISCORD_TOKEN}` },
    body: commands,
  })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
