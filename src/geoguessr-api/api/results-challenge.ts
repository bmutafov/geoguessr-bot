import { isAxiosError } from 'axios';
import { geoGuessrClient } from '../../utils/axios-instance';
import log from '../../utils/logger';

const AVATAR_URL = 'https://www.geoguessr.com/images/auto/48/48/ce/0/plain/';

/**
 * Fetches the results of a given challenge
 * @param token Game token to fetch the results for
 * @returns An object containing data for the results of the given game
 */
export async function resultsChallenge(token: string) {
	try {
		const { data } = await geoGuessrClient.get<ChallengeResults.Response>(getResultUrl(token));

		return parseResults(data.items);
	} catch (error) {
		if (isAxiosError(error)) {
			console.log('resultsChallengeAxios: ', log.error(error.message));
		} else {
			console.log('resultsChallengeUnexpected: ', error);
		}
	}
}

/**
 * Constructs the API endpoint url for the given token
 * @param token Game token
 * @returns Url Endpoint to make a request to
 */
function getResultUrl(token: string): string {
	return `/api/v3/results/highscores/${token}?friends=true&limit=26`;
}

/**
 * Parses the results from the response gotten from the GeoGuessr API
 * and transforms them to a usable format
 * @param results Results from the API
 * @returns Transformed format results
 */
function parseResults(results: ChallengeResults.PlayerScore[]) {
	return results.map((score) => {
		const guesses = score.game.player.guesses.map((guess) => guess.roundScoreInPoints);
		const avatar = AVATAR_URL + score.pinUrl;

		const { playerName, totalScore } = score;

		return {
			playerName,
			guesses,
			totalScore,
			avatar,
		};
	});
}
