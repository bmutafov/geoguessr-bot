import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { newChallengeEmbed, getEndGameButtons } from '../embeds/new-challenge';
import { createChallenge } from '../geoguessr-api/api/create-challenge';
import { getChallenge } from '../geoguessr-api/api/get-challenge';
import { resultsCache } from './results-cache';
import { pollResults } from './results-controller';

export async function newChallenge(
	options: CreateChallenge.Request,
	interaction: ChatInputCommandInteraction | ButtonInteraction
) {
	const token = await createChallenge(options);

	resultsCache.save(token, 0);

	const challengeInfo = await getChallenge(token);

	const { components, embed } = newChallengeEmbed({
		token,
		user: interaction.user.username,
		map: challengeInfo.map.name,
		timeLimit: options.timeLimit + 's',
		move: !options.forbidMoving,
		pan: !options.forbidRotating,
		zoom: !options.forbidZooming,
	});

	const botReplyMessage = await interaction.reply({
		embeds: [embed],
		components: [components],
		fetchReply: true,
	});

	pollResults({
		token,
		onResultsUpdate: (attachment) => {
			const updatedEmbed = EmbedBuilder.from(embed).setImage(attachment.fileName);
			botReplyMessage.edit({
				embeds: [updatedEmbed],
				components: [components],
				files: [attachment.file],
			});
		},
		onPollingEnd: () => {
			botReplyMessage.edit({
				content: '\nThis challenge has ended. To check for updates press the "Refresh" button\n',
				components: [getEndGameButtons(token)],
			});
		},
	});
}
