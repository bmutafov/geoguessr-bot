import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';
import { formatTimeLimit } from '../utils/format-time-limit';
import { debugLog } from '../utils/logger';

type NewChallengeEmbedOptions = {
	token: string;
	user: string;
	map: string;
	timeLimit: number;
	move: boolean;
	pan: boolean;
	zoom: boolean;
};

const getBooleanEmoji = (value: boolean) => (value ? '✅' : '❌');

const getChallengeUrl = (token: string) => `https://www.geoguessr.com/challenge/${token}`;

const getPlayButton = (url: string) =>
	new ButtonBuilder().setLabel('Play').setStyle(ButtonStyle.Link).setURL(url);

const getCloneButton = (token: string) =>
	new ButtonBuilder()
		.setLabel('Clone')
		.setStyle(ButtonStyle.Secondary)
		.setCustomId(`clone:${token}`);

const getRefreshButton = (token: string) =>
	new ButtonBuilder()
		.setLabel('Refresh')
		.setCustomId(`refetch:${token}`)
		.setStyle(ButtonStyle.Secondary);

export const getEndGameButtons = (token: string) =>
	new ActionRowBuilder<ButtonBuilder>().addComponents(
		getPlayButton(getChallengeUrl(token)),
		getRefreshButton(token),
		getCloneButton(token)
	);

export const newChallengeEmbed = (options: NewChallengeEmbedOptions) => {
	debugLog(`New embed created for challenge: ${options.token}`);

	const url = getChallengeUrl(options.token);

	return {
		embed: new EmbedBuilder()
			.setColor(0xff0000)
			.setThumbnail('https://www.geoguessr.com/static/icon-192x192.png')
			.setTitle(`${options.map} challenge`)
			.setURL(url)
			.setDescription(`${options.user} has challenged you to play GeoGuessr!`)
			.addFields(
				{ name: 'Time', value: formatTimeLimit(options.timeLimit), inline: true },
				{
					name: 'M | P | Z',
					value: [
						getBooleanEmoji(options.move),
						getBooleanEmoji(options.pan),
						getBooleanEmoji(options.zoom),
					].join(' | '),
					inline: true,
				}
			),
		components: new ActionRowBuilder<ButtonBuilder>().addComponents(
			getPlayButton(url),
			getCloneButton(options.token)
		),
	};
};
