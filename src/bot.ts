import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Client,
	Events,
	Interaction,
} from 'discord.js';
import { handleRefetchButtonClick } from './buttons/refetch';
import { GeoGuessrApiError } from './geoguessr-api/geoguessr-error';

/**
 * Registers event listeners for the discord client
 * @param client Discord.Client instance
 */
export function handleEvents(client: Client) {
	client.on(Events.InteractionCreate, handleInteraction);
}

/**
 * Handles all types of interactions, listener to InteractionCreate event
 */
function handleInteraction(interaction: Interaction) {
	try {
		if (interaction.isButton()) handleButtonInteraction(interaction);
		if (interaction.isChatInputCommand()) handleChatInputInteraction(interaction);
	} catch (error) {
		let message: string = 'Unknown error occurred';

		if (error instanceof GeoGuessrApiError) {
			message = error.message;
		}

		if (interaction.isRepliable()) {
			interaction.reply(message);
		}

		interaction.channel?.send(message);
	}
}

/**
 * Handles interactions of embed buttons. The custom ID of the buttons should follow
 * the following pattern: {action}:{payload}
 */
async function handleButtonInteraction(interaction: ButtonInteraction) {
	const [action, payload] = interaction.customId.split(':');

	if (action === 'refetch') {
		handleRefetchButtonClick(payload, interaction);
	}
}

/**
 * Handles slash commands chat inputs to the bot and determines what command
 * to execute
 */
async function handleChatInputInteraction(interaction: ChatInputCommandInteraction) {
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}
}
