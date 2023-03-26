import { geoGuessrClient } from '../utils/axios-instance';

type ChallengeRequest = {
	map: string;
	forbidMoving: boolean;
	forbidRotating: boolean;
	forbidZooming: boolean;
	timeLimit: number;
	rounds: number;
};

type ChallengeOptions = Partial<ChallengeRequest>;

type ChallengeResponse = {
	token: string;
};

export const DefaultChallengeSettings: ChallengeRequest = {
	map: '59a1514f17631e74145b6f47',
	forbidMoving: false,
	forbidRotating: false,
	forbidZooming: false,
	timeLimit: 30,
	rounds: 5,
};

export async function createChallenge({
	map = DefaultChallengeSettings.map,
	forbidMoving = DefaultChallengeSettings.forbidMoving,
	forbidRotating = DefaultChallengeSettings.forbidRotating,
	forbidZooming = DefaultChallengeSettings.forbidZooming,
	timeLimit = DefaultChallengeSettings.timeLimit,
}: ChallengeOptions): Promise<string> {
	//TODO: Error handling
	//TODO: Custom game configuration

	const body: ChallengeRequest = {
		map,
		forbidMoving,
		forbidRotating,
		forbidZooming,
		timeLimit,
		rounds: 5,
	};

	const { data } = await geoGuessrClient.post<ChallengeResponse>('/api/v3/challenges', body);

	return data.token;
}
