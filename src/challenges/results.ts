import axios, { AxiosResponse } from "axios";
import { Message } from "discord.js";

type ChallengeResultsOptions = {
  challengeToken: string;
  timeoutMs: number;
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
  return `https://www.geoguessr.com/api/v3/results/highscores/${challengeToken}?friends=true&limit=26`;
}

function createResultTable(players: ChallengePlayerScore[]) {
  const tableStart =
    "╔════════════════╦═══════════╦═══════════╦═══════════╦═══════════╦═══════════╦═══════════╗\n" +
    "║ Player         ║ Round 1   ║ Round 2   ║ Round 3   ║ Round 4   ║ Round 5   ║ Total     ║\n" +
    "╠════════════════╬═══════════╬═══════════╬═══════════╬═══════════╬═══════════╬═══════════╣\n";

  let playerResults = players
    .map((score) => {
      const playerGuesses = score.game.player.guesses;
      const playerGuessesRow = playerGuesses
        .map((guess) => {
          return ` ${guess.roundScoreInPoints.toString().padEnd(10)}`;
        })
        .join("║");

      const playerNamePadded = score.playerName.padEnd(15);
      const playerScorePadded = score.totalScore.toString().padEnd(10);

      return `║ ${playerNamePadded}║${playerGuessesRow}║ ${playerScorePadded}║ \n`;
    })
    .join(
      "╠════════════════╬═══════════╬═══════════╬═══════════╬═══════════╬═══════════╬═══════════╣\n"
    );

  const tableEnd =
    "╚════════════════╩═══════════╩═══════════╩═══════════╩═══════════╩═══════════╩═══════════╝";

  return `\`\`\`\n${tableStart}${playerResults}${tableEnd}\n\`\`\``;
}

export function getChallengeResults({
  challengeToken,
  message,
  timeoutMs,
}: ChallengeResultsOptions) {
  const interval = setInterval(async () => {
    let result: AxiosResponse<ChallengeResultsResponse>;
    try {
      result = await axios.get<ChallengeResultsResponse>(
        getResultUrl(challengeToken),
        {
          headers: {
            cookie: process.env.COOKIE,
          },
        }
      );
    } catch (error) {
      return;
    }

    const table = createResultTable(result.data.items);
    message.edit(
      `New challenge: https://www.geoguessr.com/challenge/${challengeToken} \n${table}`
    );
    message.suppressEmbeds(true);
  }, 5000);

  setTimeout(() => {
    clearInterval(interval);
    message.edit(message.content + "\n Challenge has ended.");
  }, timeoutMs);
}
