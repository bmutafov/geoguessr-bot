import axios from "axios";
import { Message } from "discord.js";

type ChallengeResultsOptions = {
    challengeToken: string;
    timeoutMs: number;
    message: Message;
}

type ChallengePlayerScore = {
    game: Record<any, any>,
    isLeader: boolean;
    pinUrl: string;
    playerName: string;
    totalScore: number;
    userId: string;
}

type ChallengeResultsResponse = {
    items: Array<ChallengePlayerScore>;
}

function getResultUrl(challengeToken: string): string {
    return `https://www.geoguessr.com/api/v3/results/highscores/${challengeToken}?friends=true&limit=26`;
}

export function getChallengeResults({ challengeToken, message, timeoutMs }: ChallengeResultsOptions) {
    setTimeout(async () => {
        const result = await axios.get<ChallengeResultsResponse>(getResultUrl(challengeToken), {
            headers: {
                cookie: process.env.COOKIE,
            }
        });

        const results = result.data.items.map((score) => {
            return `${score.playerName} scored **${score.totalScore}** points`;
        }).join('\n');

        message.reply('Results for the challenge: \n' + results);
    }, timeoutMs);
}