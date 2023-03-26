import { Message } from 'discord.js';
import nodeHtmlToImage from 'node-html-to-image';
import { geoGuessrClient } from '../utils/axios-instance';

type ChallengeResultsOptions = {
	challengeToken: string;
	timeoutMs: number;
	message: Message;
};

type UpdateResultParams = {
	challengeToken: string;
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

function getResultUrl(challengeToken: string): string {
	return `/api/v3/results/highscores/${challengeToken}?friends=true&limit=26`;
}

function getPlayersResults(players: ChallengePlayerScore[]) {
	return players.map((score) => {
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

export async function resultsImage(token: string) {
	const { data } = await geoGuessrClient<ChallengeResultsResponse>(getResultUrl(token));
	const playerResults = getPlayersResults(data.items);
	const result = await nodeHtmlToImage({
		html: `<style>
		@import url("https://fonts.cdnfonts.com/css/neo-sans-pro"); table { font-family: "Neo Sans Pro",
		sans-serif; background: rgb(2, 0, 36); background: linear-gradient( 128deg, rgba(2, 0, 36, 1) 0%,
		rgba(9, 9, 121, 1) 47%, rgba(146, 20, 255, 1) 100% ); padding: 1rem; border-radius: 20px; color:
		white; } th, td { text-align: left; padding: 2px 15px; } th { padding-bottom: 10px; } .player-info
		{ display: flex; align-items: center; gap: 10px; } .player-info img { border: 3px solid white;
		border-radius: 50%; }

		.container { height: {{containerHeight}}px, width: 1300px }
	</style>
	<div class='container'>
		<table>
			<thead>
				<tr>
					<th>Player</th>
					<th>Round 1</th>
					<th>Round 2</th>
					<th>Round 3</th>
					<th>Round 4</th>
					<th>Round 5</th>
					<th>Total Score</th>
				</tr>
			</thead>
			<tbody>
				{{#each playerResults}}
					<tr>
						<td>
							<div class='player-info'>
								<img src='{{avatar}}' width='24' height='24' />
								{{playerName}}
							</div>
						</td>
						{{#each guesses}}
							<td>{{this}}</td>
						{{/each}}
						<td>{{totalScore}}</td>
					</tr>
				{{/each}}
			</tbody>
		</table>
	</div>`,
		content: { containerHeight: playerResults.length * 35 + 70, playerResults },
		transparent: true,
		selector: '.container',
	});

	return result;
}
