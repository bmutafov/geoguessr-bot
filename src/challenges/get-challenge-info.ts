import { geoGuessrClient } from '../utils/axios-instance';

type Challenge = any;
type Creator = any;
type Map = {
	name: string;
	url: string;
	id: string;
	description: string;
};

type GetChallengeInfoResponse = {
	challenge: Challenge;
	creator: Creator;
	map: Map;
};

export async function getChallengeInfo(token: string) {
	const response = await geoGuessrClient.get<GetChallengeInfoResponse>(
		'/api/v3/challenges/' + token
	);
	return response.data;
}
