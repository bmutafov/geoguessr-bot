import { Interaction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with pong');

export async function execute(interaction: Interaction) {
	if (interaction.isRepliable()) {
		interaction.reply('Pong!');
	}
}
