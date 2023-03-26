import axios, { AxiosResponse } from 'axios';

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

export async function createChallenge(options: ChallengeOptions): Promise<string> {
	//TODO: Error handling
	//TODO: Custom game configuration

	const { map, forbidMoving, forbidRotating, forbidZooming, timeLimit } = options;

	const body: ChallengeRequest = {
		map: map ?? '59a1514f17631e74145b6f47',
		forbidMoving: forbidMoving ?? false,
		forbidRotating: forbidRotating ?? false,
		forbidZooming: forbidZooming ?? false,
		timeLimit: timeLimit ?? 10,
		rounds: 5,
	};

	const { data } = await axios.post<ChallengeResponse>(
		'https://www.geoguessr.com/api/v3/challenges',
		body,
		{
			headers: {
				cookie: process.env.COOKIE,
			},
		}
	);

	return data.token;
}
