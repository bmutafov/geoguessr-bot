import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';
import { debugLog } from '../utils/logger';

type NewChallengeEmbedOptions = {
	token: string;
	user: string;
	map: string;
	timeLimit: string;
	move: boolean;
	pan: boolean;
	zoom: boolean;
};

const getBooleanEmoji = (value: boolean) => (value ? '✅' : '❌');

const getChallengeUrl = (token: string) => `https://www.geoguessr.com/challenge/${token}`;

const getPlayButton = (url: string) =>
	new ButtonBuilder().setLabel('Play').setStyle(ButtonStyle.Link).setURL(url);

const getRefreshButton = (token: string) =>
	new ButtonBuilder()
		.setLabel('Refresh')
		.setCustomId(`refetch:${token}`)
		.setStyle(ButtonStyle.Secondary);

export const getEndGameButtons = (token: string) =>
	new ActionRowBuilder<ButtonBuilder>().addComponents(
		getPlayButton(getChallengeUrl(token)),
		getRefreshButton(token)
	);

export const newChallengeEmbed = (options: NewChallengeEmbedOptions) => {
	debugLog(`New embed created for challenge: ${options.token}`);

	const url = getChallengeUrl(options.token);

	return {
		embed: new EmbedBuilder()
			.setColor(0xff0000)
			.setThumbnail('https://www.geoguessr.com/static/icon-192x192.png')
			.setTitle('New GeoGuessr Challenge!')
			.setURL(url)
			.setDescription(`${options.user} has challenged you to play GeoGuessr!`)
			.addFields(
				{ name: 'Map', value: options.map, inline: true },
				{ name: 'Time Limit', value: options.timeLimit, inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: 'Move', value: getBooleanEmoji(options.move), inline: true },
				{ name: 'Pan', value: getBooleanEmoji(options.pan), inline: true },
				{ name: 'Zoom', value: getBooleanEmoji(options.zoom), inline: true }
			),
		components: new ActionRowBuilder<ButtonBuilder>().addComponents(getPlayButton(url)),
	};
};
