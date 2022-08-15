const { Collection } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log(
      'Mongoose default connection disconnected through app termination'
    );
    process.exit(0);
  });
});

// Modules:
const serverConfig = require('./modules/serverConfig');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
  ],
});

// Read the commands folder, and add every .js file to a Collection object "client.commands"
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // After this line believe the variable "command" will have everything exported from the respective file "{interaction.commandName}.js"
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    // Some commands require special modules
    switch (interaction.commandName) {
      case 'config':
        await command.execute(interaction, serverConfig);
        break;
      default:
        await command.execute(interaction);
    }
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.on('ready', async () => {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
  });
  console.log('Connected to MongoDB Database!');
});

// Code to track invites!
const guildInvites = new Map();

client.on('inviteCreate', async (invite) => {
  console.log('New invite created: ' + invite.code);
  const invites = await invite.guild.invites.fetch();

  const codeUses = new Map();
  invites.each((inv) => codeUses.set(inv.code, inv.uses));

  guildInvites.set(invite.guild.id, codeUses);
});

client.once('ready', () => {
  client.guilds.cache.forEach((guild) => {
    guild.invites
      .fetch()
      .then((invites) => {
        console.log('INVITES CACHED');
        const codeUses = new Map();
        invites.each((inv) => codeUses.set(inv.code, inv.uses));

        guildInvites.set(guild.id, codeUses);
      })
      .catch((err) => {
        console.log('OnReady Error:', err);
      });
  });
});

client.on('guildMemberAdd', async (member) => {
  const cachedInvites = guildInvites.get(member.guild.id);
  const newInvites = await member.guild.invites.fetch();
  try {
    const usedInvite = newInvites.find(
      (inv) => cachedInvites.get(inv.code) < inv.uses
    );
    // console.log('Cached', [...cachedInvites.keys()]);
    // console.log('New',[...newInvites.values()].map((inv) => inv.code));
    // console.log('Used', usedInvite);
    console.log(
      `The code ${usedInvite.code} was just used by ${member.user.username}.`
    );
    console.log(`Invite owner ID: ${usedInvite.inviterId}`);
  } catch (err) {
    console.log('OnGuildMemberAdd Error:', err);
  }

  newInvites.each((inv) => cachedInvites.set(inv.code, inv.uses));
  guildInvites.set(member.guild.id, cachedInvites);
});

// Login to Discord with your client's token
client.login(DISCORD_TOKEN);
