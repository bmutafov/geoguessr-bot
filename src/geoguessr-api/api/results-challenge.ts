import { isAxiosError } from 'axios';
import { geoGuessrClient } from '../../utils/axios-instance';
import log, { debugLog } from '../../utils/logger';
import { GeoGuessrApiError } from '../geoguessr-error';

const AVATAR_URL = 'https://www.geoguessr.com/images/auto/48/48/ce/0/plain/';

/**
 * Fetches the results of a given challenge
 * @param token Game token to fetch the results for
 * @returns An object containing data for the results of the given game
 */
export async function getChallengeResults(token: string) {
	try {
		const { data, status } = await geoGuessrClient.get<ChallengeResults.Response>(
			getResultUrl(token),
			{
				validateStatus: (status) => {
					if (status >= 200 && status <= 299) {
						return true;
					}

					if (status === 401) {
						debugLog(`No results yet for challenge ${token}`);
						return true;
					}
					return false;
				},
			}
		);

		const results = status === 200 ? data.items : [];
		debugLog(`Request to check results for ${token} - ${results.length} results detected`);

		return parseResults(results);
	} catch (error) {
		if (isAxiosError(error)) {
			console.log('getChallengeResultsAxios: ', log.error(error.message));
		} else {
			console.log('getChallengeResultsUnexpected: ', error);
		}

		throw new GeoGuessrApiError('Oops. Something went wrong!');
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
function parseResults(results: ChallengeResults.PlayerScore[]): ChallengeResults.Parsed[] {
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
