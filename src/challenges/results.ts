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

function padCenter(text: string, length: number): string {
  const padding = " ".repeat(length - text.length);
  const leftPadding = padding.slice(0, padding.length / 2);
  const rightPadding = padding.slice(padding.length / 2);
  return `${leftPadding}${text}${rightPadding}`;
}

function createResultTable(players: ChallengePlayerScore[]) {
  const nameLength = players.reduce((max, player) => {
    return Math.max(max, player.playerName.length);
  }, 6);

  const nameLengthLine = "═".repeat(nameLength);
  const nameLengthText = padCenter("Player", nameLength);
  const tableStart =
    `╔${nameLengthLine}╦════╦════╦════╦════╦════╦═════╗\n` +
    `║${nameLengthText}║ R1 ║ R2 ║ R3 ║ R4 ║ R5 ║ All ║\n` +
    `╠${nameLengthLine}╬════╬════╬════╬════╬════╬═════╣\n`;

  let playerResults = players
    .map((score) => {
      const playerGuesses = score.game.player.guesses;
      const playerGuessesRow = playerGuesses
        .map((guess) => {
          return `${padCenter(guess.roundScoreInPoints.toString(), 4)}`;
        })
        .join("║");

      const playerNamePadded = padCenter(score.playerName, nameLength);
      const playerScorePadded = padCenter(score.totalScore.toString(), 5);

      return `║${playerNamePadded}║${playerGuessesRow}║${playerScorePadded}║ \n`;
    })
    .join(`╠${nameLengthLine}╬════╬════╬════╬════╬════╬═════╣\n`);

  const tableEnd = `╚${nameLengthLine}╩════╩════╩════╩════╩════╩═════╝`;

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
