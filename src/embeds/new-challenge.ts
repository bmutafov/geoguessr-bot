import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';

type NewChallengeEmbedOptions = {
	challengeUrl: string;
	user: string;
	map: string;
	timeLimit: string;
	move: boolean;
	pan: boolean;
	zoom: boolean;
};

const getBooleanEmoji = (value: boolean) => (value ? '✅' : '❌');

export const newChallengeEmbed = (options: NewChallengeEmbedOptions) => ({
	embed: new EmbedBuilder()
		.setColor(0xff0000)
		.setThumbnail('https://www.geoguessr.com/static/icon-192x192.png')
		.setTitle('New GeoGuessr Challenge!')
		.setURL(options.challengeUrl)
		.setDescription(`${options.user} has challenged you to play GeoGuessr!`)
		.addFields(
			{ name: 'Map', value: options.map, inline: true },
			{ name: 'Time Limit', value: options.timeLimit, inline: true },
			{ name: '\u200B', value: '\u200B', inline: true },
			{ name: 'Move', value: getBooleanEmoji(options.move), inline: true },
			{ name: 'Pan', value: getBooleanEmoji(options.pan), inline: true },
			{ name: 'Zoom', value: getBooleanEmoji(options.zoom), inline: true }
		),
	components: new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setLabel('Play challenge')
			.setStyle(ButtonStyle.Link)
			.setURL(options.challengeUrl)
	),
});
