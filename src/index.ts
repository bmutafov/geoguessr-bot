require('source-map-support').install();
require('dotenv').config();

import { Client, Collection, EmbedBuilder, Events, GatewayIntentBits } from 'discord.js';
import { loadCommands } from './utils/load-commands';
import { green } from 'colors';
import { constructUpdateObject, getUpdatedChallengeResults } from './challenges/results-image';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.once('ready', () => {
	console.log(green('\n🟢 Bot is connected and ready to use!'));
});

client.login(process.env.BOT_TOKEN);

client.commands = new Collection();

loadCommands(client);

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isButton()) {
		const [action, challengeToken] = interaction.customId.split(':');

		if (action === 'refetch') {
			const newResults = await getUpdatedChallengeResults(challengeToken);
			if (newResults) {
				const messageEditOptions = constructUpdateObject({
					embed: interaction.message.embeds[0],
					token: challengeToken,
					results: newResults,
				});

				interaction.update(messageEditOptions);
			} else {
				interaction.update({ content: interaction.message.content });
			}
		}
	}

	if (interaction.isChatInputCommand()) {
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
});
