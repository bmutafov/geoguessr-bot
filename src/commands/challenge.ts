import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { resultsCache } from '../controllers/results-cache';
import { pollResults } from '../controllers/results-controller';
import { getEndGameButtons, newChallengeEmbed } from '../embeds/new-challenge';
import { createChallenge, DefaultChallengeSettings } from '../geoguessr-api/api/create-challenge';
import { getChallenge } from '../geoguessr-api/api/get-challenge';

export const data = new SlashCommandBuilder()
	.setName('challenge')
	.setDescription('Creates a new challenge and sends the link in chat')
	.addStringOption((option) =>
		option
			.setName('mapid')
			.setDescription('The ID of the map you want to play. Default: A Diverse world')
			.setRequired(false)
	)
	.addStringOption((option) =>
		option
			.setName('mapname')
			.setDescription('The name of the map you want to play. Default: A Diverse world')
			.setRequired(false)
	)
	.addBooleanOption((option) =>
		option.setName('move').setDescription('Forbids moving').setRequired(false)
	)
	.addBooleanOption((option) =>
		option.setName('pan').setDescription('Forbids panning and rotating').setRequired(false)
	)
	.addBooleanOption((option) =>
		option.setName('zoom').setDescription('Forbids zooming').setRequired(false)
	)
	.addNumberOption((option) =>
		option.setName('time').setDescription('Maximum time per round allowed').setRequired(false)
	);

function getOptions(interaction: ChatInputCommandInteraction) {
	const map = interaction.options.getString('mapid') ?? DefaultChallengeSettings.map;
	const move = interaction.options.getBoolean('move') ?? !DefaultChallengeSettings.forbidMoving;
	const pan = interaction.options.getBoolean('pan') ?? !DefaultChallengeSettings.forbidRotating;
	const zoom = interaction.options.getBoolean('zoom') ?? !DefaultChallengeSettings.forbidZooming;
	const timeLimit = interaction.options.getNumber('time') ?? DefaultChallengeSettings.timeLimit;

	return {
		move,
		pan,
		zoom,
		timeLimit,
		map,
	};
}

export async function execute(interaction: ChatInputCommandInteraction) {
	if (interaction.isRepliable()) {
		const options = getOptions(interaction);
		const token = await createChallenge({
			forbidMoving: !options.move,
			forbidRotating: !options.pan,
			forbidZooming: !options.zoom,
			map: options.map,
			timeLimit: options.timeLimit,
		});

		resultsCache.save(token, 0);

		const challengeInfo = await getChallenge(token);

		const { components, embed } = newChallengeEmbed({
			token,
			user: interaction.user.username,
			map: challengeInfo.map.name,
			timeLimit: options.timeLimit + 's',
			move: options.move,
			pan: options.pan,
			zoom: options.zoom,
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
}
