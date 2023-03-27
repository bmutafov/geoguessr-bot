import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { newChallenge } from '../controllers/new-challenge-controller';
import { DefaultChallengeSettings } from '../geoguessr-api/api/create-challenge';

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
	const rounds = DefaultChallengeSettings.rounds;

	return {
		move,
		pan,
		zoom,
		timeLimit,
		map,
		rounds,
	};
}

export async function execute(interaction: ChatInputCommandInteraction) {
	if (interaction.isRepliable()) {
		const options = getOptions(interaction);
		await newChallenge(
			{
				forbidMoving: !options.move,
				forbidRotating: !options.pan,
				forbidZooming: !options.zoom,
				map: options.map,
				timeLimit: options.timeLimit,
				rounds: options.rounds,
			},
			interaction
		);
	}
}
