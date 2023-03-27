import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { newChallenge, userChallengesMap } from '../controllers/new-challenge-controller';
import { DefaultChallengeSettings } from '../geoguessr-api/api/create-challenge';

export const data = new SlashCommandBuilder()
	.setName('next')
	.setDescription('Creates new challenge with the same settings as the last one');

export async function execute(interaction: ChatInputCommandInteraction) {
	if (interaction.isRepliable()) {
		if (userChallengesMap.has(interaction.user.id)) {
			const options = userChallengesMap.get(interaction.user.id) as CreateChallenge.Request;
			await newChallenge(options, interaction);
		} else {
			await newChallenge(DefaultChallengeSettings, interaction);
		}
	}
}
