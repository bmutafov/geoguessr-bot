import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Client,
	Events,
	Interaction,
} from 'discord.js';
import { constructUpdateObject, getUpdatedChallengeResults } from './challenges/results-image';

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
	if (interaction.isButton()) handleButtonInteraction(interaction);
	if (interaction.isChatInputCommand()) handleChatInputInteraction(interaction);
}

/**
 * Handles interactions of embed buttons. The custom ID of the buttons should follow
 * the following pattern: {action}:{payload}
 */
async function handleButtonInteraction(interaction: ButtonInteraction) {
	const [action, payload] = interaction.customId.split(':');

	if (action === 'refetch') {
		const newResults = await getUpdatedChallengeResults(payload);
		if (newResults) {
			const messageEditOptions = constructUpdateObject({
				embed: interaction.message.embeds[0],
				token: payload,
				results: newResults,
			});

			interaction.update(messageEditOptions);
		} else {
			interaction.update({ content: interaction.message.content });
		}
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
