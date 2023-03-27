import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import { updateResults } from '../controllers/results-controller';

export function handleRefetchButtonClick(token: string, interaction: ButtonInteraction) {
	updateResults(token, (attachment) => {
		const embed = interaction.message.embeds[0];
		const newEmbed = EmbedBuilder.from(embed).setImage(attachment.fileName);
		interaction.update({
			embeds: [newEmbed],
			files: [attachment.file],
		});
	});
}
