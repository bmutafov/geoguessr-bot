import { Command } from '../types/command';
import path from 'node:path';
import fs from 'node:fs';

const COMMANDS_PATH = '../commands';
const FILE_EXTENSIONS = ['.js', '.ts'];

export function isCommand(command: Command): command is Required<Command> {
	return 'data' in command && 'execute' in command;
}

export function getCommands() {
	const commandsPath = path.join(__dirname, COMMANDS_PATH);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => {
		return FILE_EXTENSIONS.some((extension) => file.endsWith(extension));
	});

	return {
		commandsPath,
		commandFiles,
	};
}
