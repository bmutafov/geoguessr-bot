require('source-map-support').install();
require('dotenv').config();

import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { loadCommands } from './utils/load-commands';
import { green } from 'colors';
import { handleEvents } from './bot';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.once('ready', () => {
	console.log(green('Bot is connected and ready to use!'));
});

client.login(process.env.BOT_TOKEN);

client.commands = new Collection();

loadCommands(client);
handleEvents(client);
