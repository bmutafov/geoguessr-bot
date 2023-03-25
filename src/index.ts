import { Client, IntentsBitField, Message } from "discord.js";
import { config } from "dotenv";
import { createChallenge } from "./challenges/create";
import { getChallengeResults } from "./challenges/results";
import maps from "./utils/map-codes";

config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Bot is online!");
});

client.login(process.env.BOT_TOKEN);

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!challenge")) {
    const messageTokens = message.content.split(" ");
    const forbidMoving = messageTokens.includes("nomove");
    const forbidRotating = messageTokens.includes("nopan");
    const forbidZooming = messageTokens.includes("nozoom");
    const timeLimit = messageTokens[1] ? parseInt(messageTokens[1]) : undefined;

    if (
      timeLimit &&
      (Number.isNaN(timeLimit) || timeLimit < 10 || timeLimit > 600)
    ) {
      message.reply("Invalid time limit!");
      return;
    }

    const token = await createChallenge({
      forbidMoving,
      forbidRotating,
      forbidZooming,
      timeLimit,
    });

    const currentBotMessage = await message.reply(
      `New challenge: https://www.geoguessr.com/challenge/${token} \n\n`
    );

    getChallengeResults({
      challengeToken: token,
      message: currentBotMessage,
      timeoutMs: (timeLimit ?? 10) * 5100,
    });
  }
});
