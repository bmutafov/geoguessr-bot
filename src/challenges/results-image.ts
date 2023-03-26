import { Message } from 'discord.js';
import nodeHtmlToImage from 'node-html-to-image';
import { geoGuessrClient } from '../utils/axios-instance';
import fs from 'node:fs';
import path from 'node:path';
import { challengeComponents } from '../embeds/new-challenge';

type ChallengeResultsOptions = {
	challengeToken: string;
	timeoutMs: number;
	message: Message;
};

type ChallengePlayerGuess = {
	roundScoreInPoints: number;
};

type ChallengePlayer = {
	guesses: ChallengePlayerGuess[];
};

type ChallengeGame = {
	roundCount: number;
	player: ChallengePlayer;
};

type ChallengePlayerScore = {
	game: ChallengeGame;
	isLeader: boolean;
	pinUrl: string;
	playerName: string;
	totalScore: number;
	userId: string;
};

type ChallengeResultsResponse = {
	items: Array<ChallengePlayerScore>;
};

const POLLING_INTERVAL = 5000;

const resultsLengths: Map<string, number> = new Map();

function getResultUrl(challengeToken: string): string {
	return `/api/v3/results/highscores/${challengeToken}?friends=true&limit=26`;
}

async function getPlayersResults(token: string) {
	const { data } = await geoGuessrClient.get<ChallengeResultsResponse>(getResultUrl(token));

	if (resultsLengths.has(token)) {
		if (resultsLengths.get(token) === data.items.length) return null;
		resultsLengths.set(token, data.items.length);
	}

	return data.items.map((score) => {
		const guesses = score.game.player.guesses.map((guess) => guess.roundScoreInPoints);
		const avatar = 'https://www.geoguessr.com/images/auto/48/48/ce/0/plain/' + score.pinUrl;

		const { playerName, totalScore } = score;

		return {
			playerName,
			guesses,
			totalScore,
			avatar,
		};
	});
}

export function pollResults({ challengeToken, timeoutMs, message }: ChallengeResultsOptions) {
	resultsLengths.set(challengeToken, 0);

	const interval = setInterval(async () => {
		const newResults = await getUpdatedChallengeResults(challengeToken);
		if (newResults) {
			const components = challengeComponents(challengeToken);
			message.edit({ components: [components], files: [{ attachment: newResults }] });
		}
	}, POLLING_INTERVAL);

	setTimeout(() => {
		clearInterval(interval);
		const results = resultsLengths.get(challengeToken);
		if (results === 0) {
			const components = challengeComponents(challengeToken);
			message.edit({ components: [components] });
		}
		resultsLengths.delete(challengeToken);
		console.log('Stopped polling results');
	}, timeoutMs);
}

export async function getUpdatedChallengeResults(token: string) {
	try {
		const result = await resultsToImage(token);
		if (result instanceof Buffer) {
			return result;
		}
		return null;
	} catch (err) {}
}

const template = fs
	.readFileSync(path.resolve(__dirname, '../../public/results-image.hbs'))
	.toString();

export async function resultsToImage(token: string) {
	const playerResults = await getPlayersResults(token);
	if (!playerResults) return null;

	const result = await nodeHtmlToImage({
		html: template,
		content: { containerHeight: playerResults.length * 35 + 70, playerResults },
		transparent: true,
		selector: '.container',
	});

	return result;
}
