import { Client, Collection } from 'discord.js';
import path from 'node:path';
import { cyan, yellow } from 'colors/safe';
import { Command } from '../types/command';
import { getCommands, isCommand } from './command-utils';

export function loadCommands(client: Client) {
	client.commands = new Collection();

	const { commandFiles, commandsPath } = getCommands();

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath) as Command;

		if (isCommand(command)) {
			console.log(cyan('Available command: ') + yellow('/' + command.data.name));

			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}
