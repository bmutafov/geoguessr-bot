import { isAxiosError } from 'axios';
import { geoGuessrClient } from '../../utils/axios-instance';
import log from '../../utils/logger';

type ChallengeOptions = Partial<CreateChallenge.Request>;

export const DefaultChallengeSettings: CreateChallenge.Request = {
	map: '59a1514f17631e74145b6f47',
	forbidMoving: false,
	forbidRotating: false,
	forbidZooming: false,
	timeLimit: 30,
	rounds: 5,
};

/**
 * Creates a new challenge with the provided options
 * @param options Settings for the challenge which will be played
 * @returns Challenge Token
 */
export async function createChallenge(options: ChallengeOptions) {
	const requestBody: CreateChallenge.Request = parseOptions(options);

	try {
		const { data } = await geoGuessrClient.post<CreateChallenge.Response>(
			'/api/v3/challenges',
			requestBody
		);

		return data.token;
	} catch (error) {
		if (isAxiosError(error)) {
			console.log('createChallengeAxios: ', log.error(error.message));
		} else {
			console.log('createChallengeUnexpected: ', error);
		}
	}
}

/**
 * Constructs a request object from the options passed. If an option is missing, the default
 * one is used
 * @param options The partial options object provided
 * @returns A full request object which can be safely passed to the GeoGuessr API
 */
function parseOptions(options: ChallengeOptions): CreateChallenge.Request {
	return {
		forbidMoving: options.forbidMoving || DefaultChallengeSettings.forbidMoving,
		forbidRotating: options.forbidRotating || DefaultChallengeSettings.forbidRotating,
		forbidZooming: options.forbidZooming || DefaultChallengeSettings.forbidZooming,
		map: options.map || DefaultChallengeSettings.map,
		rounds: options.rounds || DefaultChallengeSettings.rounds,
		timeLimit: options.timeLimit || DefaultChallengeSettings.timeLimit,
	};
}
