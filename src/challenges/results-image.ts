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
		html: `
    <html>
    <head>
      <style>
      body {
        height: 200px;
        width: 300px;
      }

      table { 
        color: orange;
      }
      </style>
    </head>
    <body
      <table>
        {{#each playerResults}}
          <tr>
            <td>
              <img src="{{avatar}}" width="48" height="48" />
            </td>
            <td>{{playerName}}</td>
            {{#each guesses}}
              <td>{{this}}</td>
            {{/each}}
            <td>{{totalScore}}</td>
          </tr>
        {{/each}}
      </table>
    </body>
    </html>
      `,
		content: { playerResults },
		transparent: true,
	});

	return result;
}
