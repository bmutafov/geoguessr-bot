import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	IntentsBitField,
	MessageReaction,
	User,
} from 'discord.js';
import { config } from 'dotenv';
import { createChallenge } from './challenges/create';
import {
	getChallengeResults,
	toggleTableShort,
	updateChallengeResults,
} from './challenges/results';
import path from 'node:path';
import fs from 'node:fs';
import { loadCommands } from './utils/load-commands';

config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
	],
});

client.once('ready', () => {
	console.log('Bot is online!');
});

client.login(process.env.BOT_TOKEN);

client.commands = new Collection();

loadCommands(client);

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
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
});

// client.on('messageCreate', async (message) => {
// 	if (message.content.startsWith('!challenge')) {
// 		const messageTokens = message.content.split(' ');
// 		const forbidMoving = messageTokens.includes('nomove');
// 		const forbidRotating = messageTokens.includes('nopan');
// 		const forbidZooming = messageTokens.includes('nozoom');
// 		const timeLimit = messageTokens[1] ? parseInt(messageTokens[1]) : undefined;

// 		if (timeLimit && (Number.isNaN(timeLimit) || timeLimit < 10 || timeLimit > 600)) {
// 			message.reply('Invalid time limit!');
// 			return;
// 		}

// 		const token = await createChallenge({
// 			forbidMoving,
// 			forbidRotating,
// 			forbidZooming,
// 			timeLimit,
// 		});

// 		const currentBotMessage = await message.reply(
// 			`New challenge: https://www.geoguessr.com/challenge/${token} \n\n`
// 		);

// 		currentBotMessage.react('🔁');
// 		currentBotMessage.react('🔍');

// 		const filter = (reaction: MessageReaction, user: User) => {
// 			return (
// 				(reaction.emoji.name === '🔍' || reaction.emoji.name === '🔁') &&
// 				user.id !== client.user?.id
// 			);
// 		};

// 		const collector = currentBotMessage.createReactionCollector({ filter });

// 		collector.on('collect', (reaction, user) => {
// 			if (reaction.emoji.name === '🔍') toggleTableShort();

// 			updateChallengeResults({
// 				challengeToken: token,
// 				message: currentBotMessage,
// 			});
// 			reaction.users.remove(user.id);
// 		});

// 		getChallengeResults({
// 			challengeToken: token,
// 			message: currentBotMessage,
// 			timeoutMs: (timeLimit ?? 10) * 5100,
// 		});
// 	}
// });
