import { isAxiosError } from 'axios';
import { geoGuessrClient } from '../../utils/axios-instance';
import log, { debugLog } from '../../utils/logger';
import { GeoGuessrApiError } from '../geoguessr-error';

export async function getChallenge(token: string) {
	try {
		const { data } = await geoGuessrClient.get<GetChallenge.Response>(
			'/api/v3/challenges/' + token
		);

		debugLog(`Data for challenge fetched: ${token}`);

		return data;
	} catch (error) {
		if (isAxiosError(error)) {
			console.log('getChallengeAxios: ', log.error(error.message));
		} else {
			console.log('getChallengeUnexpected: ', error);
		}

		throw new GeoGuessrApiError('Oops. Something went wrong!');
	}
}
