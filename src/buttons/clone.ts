import { ButtonInteraction } from 'discord.js';
import { newChallenge } from '../controllers/new-challenge-controller';
import { getChallenge } from '../geoguessr-api/api/get-challenge';

export async function handleCloneButtonClick(token: string, interaction: ButtonInteraction) {
	const {
		challenge: { forbidMoving, forbidRotating, forbidZooming, timeLimit, roundCount, mapSlug },
	} = await getChallenge(token);

	await newChallenge(
		{
			forbidMoving,
			forbidRotating,
			forbidZooming,
			map: mapSlug,
			rounds: roundCount,
			timeLimit,
		},
		interaction
	);
}
