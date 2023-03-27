namespace CreateChallenge {
	/**
	 * The body of the request to the GueGuessrs API
	 * /api/v3/challenges
	 */
	export type Request = {
		map: string;
		forbidMoving: boolean;
		forbidRotating: boolean;
		forbidZooming: boolean;
		timeLimit: number;
		rounds: number;
	};

	/**
	 * The response of the request to the GueGuessrs API
	 * /api/v3/challenges
	 */
	export type Response = {
		token: string;
	};
}

namespace GetChallenge {
	type Challenge = {
		challengeType: number;
		forbidMoving: boolean;
		forbidRotating: boolean;
		forbidZooming: boolean;
		gameMode: string;
		mapSlug: string;
		numberOfParticipants: number;
		roundCount: number;
		streakType: string;
		timeLimit: number;
		token: string;
	};

	//TODO: Type fully objects
	type Creator = Record<any, any>;

	type Map = {
		name: string;
		url: string;
		id: string;
		description: string;
	};

	/**
	 * The response of the GET request to the GeoGuessr API
	 * /api/v3/challenges/:token
	 */
	export type Response = {
		challenge: Challenge;
		creator: Creator;
		map: Map;
	};
}

namespace ChallengeResults {
	/**
	 * The response of the GET request to the GeoGuessr API
	 * /api/v3/results/highscores/:token
	 */
	export type Response = {
		items: Array<PlayerScore>;
	};

	export type PlayerScore = {
		game: Game;
		isLeader: boolean;
		pinUrl: string;
		playerName: string;
		totalScore: number;
		userId: string;
	};

	type Game = {
		roundCount: number;
		player: Player;
	};

	type Player = {
		guesses: Guess[];
	};

	type Guess = {
		roundScoreInPoints: number;
	};

	export type Parsed = {
		playerName: string;
		guesses: Array<number>;
		totalScore: number;
		avatar: string;
	};
}
