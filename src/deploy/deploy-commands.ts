import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';
import { Command } from '../types/command';
import { getCommands, isCommand } from '../utils/command-utils';

config({ path: path.join(__dirname, '../../.env') });

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

const { commandFiles, commandsPath } = getCommands();

for (const file of commandFiles) {
	const command = require(`${commandsPath}/${file}`) as Command;
	if (isCommand(command)) {
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

async function deployCommands() {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data: any = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{
				body: commands,
			}
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}

deployCommands();
