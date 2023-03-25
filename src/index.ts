import { Client, IntentsBitField } from 'discord.js';
import { config } from 'dotenv';
import { createChallenge } from './challenges/create';
import { getChallengeResults } from './challenges/results';

config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.once('ready', () => {
    console.log('Bot is online!');
});

client.login(process.env.BOT_TOKEN);

client.on('messageCreate', async message => {
    if (message.content === '!challenge') {
        const token = await createChallenge();
        message.reply(`New challenge: https://www.geoguessr.com/challenge/${token} \n\n Results after 2 minutes!`);
        getChallengeResults({ challengeToken: token, message, timeoutMs: 1000 * 120 });
    }
});
