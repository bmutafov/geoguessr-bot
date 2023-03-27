import { AttachmentBuilder } from 'discord.js';
import nodeHtmlToImage from 'node-html-to-image';
import fs from 'node:fs';
import path from 'node:path';
import { getChallenge } from '../geoguessr-api/api/get-challenge';
import { getChallengeResults } from '../geoguessr-api/api/results-challenge';
import { debugLog } from '../utils/logger';
import { snooze } from '../utils/snooze';
import { resultsCache } from './results-cache';

export type OnNewResultsCallback = Awaited<ReturnType<typeof prepareImageAttachment>>;

type PollResultsOptions = {
	token: string;
	onResultsUpdate: (attachment: OnNewResultsCallback) => void;
	onPollingEnd: () => void;
};

const WAIT_TIME_PER_ROUND = 10;
const POLLING_INTERVAL = 7_500;
const THREE_MINUTES = 3 * 60 * 1000;

const imageTemplate = fs
	.readFileSync(path.resolve(__dirname, '../../public/results-image.hbs'))
	.toString();

/**
 * Generates an image preview of the provided results
 * @param results Challenge results object - needs to be parsed
 * @returns Buffer of an image
 */
export async function resultsToImage(results: ChallengeResults.Parsed[]) {
	const result = await nodeHtmlToImage({
		html: imageTemplate,
		content: { containerHeight: results.length * 35 + 70, playerResults: results },
		transparent: true,
		selector: '.container',
	});

	return result as Buffer;
}

/**
 * Checks with the GeoGuessr API for updates to the challenge.
 * @param token The challenge token
 * @returns An object with updated property, which indicates if there are updates since last fetch.
 * Results property with the latest results.
 */
export async function checkForResultsUpdate(token: string) {
	const results = await getChallengeResults(token);
	const haveResultsUpdated = resultsCache.hasUpdates(token, results.length);

	if (haveResultsUpdated) {
		resultsCache.save(token, results.length);
	}

	return {
		updated: haveResultsUpdated,
		results,
	};
}

/**
 * Makes long-polling requests to the GeoGuessrAPI every X seconds to check for new results
 */
export async function pollResults({ token, onResultsUpdate, onPollingEnd }: PollResultsOptions) {
	const gameInfo = await getChallenge(token);
	const { timeLimit, roundCount } = gameInfo.challenge;

	const snoozeTime = WAIT_TIME_PER_ROUND * roundCount * 1000;
	debugLog(`Polling for challenge ${token} will start in ${snoozeTime} ms`);

	// Snooze for some time to let players play the game
	await snooze(snoozeTime);

	debugLog(`Polling for challenge ${token} started`);

	const interval = setInterval(() => updateResults(token, onResultsUpdate), POLLING_INTERVAL);

	const MAX_GAME_TIME = timeLimit * roundCount * 1000;
	const MAX_POLL_TIME = MAX_GAME_TIME + THREE_MINUTES;

	setTimeout(() => {
		clearInterval(interval);
		resultsCache.clear(token);
		debugLog(`Polling for challenge ${token} has ended`);
		onPollingEnd();
	}, MAX_POLL_TIME);
}

/**
 * Function which checks for updates one time and if there are updates prepares the preview
 * image. Calls the callback with the attachment, ready to be sent to discord.
 * @param token The game challenge token
 * @param onNewResultsCallback Callback which executes only when new results are detected
 */
export async function updateResults(
	token: string,
	onNewResultsCallback: (attachment: OnNewResultsCallback) => void
) {
	const { results, updated } = await checkForResultsUpdate(token);
	debugLog(`Updates for challenge: ${token} - ${updated ? 'YES' : 'NO'}`);

	if (!updated) return;
	const attachment = await prepareImageAttachment(token, results);
	onNewResultsCallback(attachment);
}

/**
 * Prepares an an image in discord attachment format. It uses resultsToImage function to generate
 * a Buffer, which then using Discord.js API is prepared to be sent as attachment. File attachment and
 * file name are returned
 * @param token The game challenge token
 * @param results The latest results for the challenge
 */
async function prepareImageAttachment(token: string, results: ChallengeResults.Parsed[]) {
	debugLog(`Preparing results image for ${token}`);

	const attachmentName = `${token}-results.png`;
	const image = await resultsToImage(results);
	const file = new AttachmentBuilder(image, { name: attachmentName });

	debugLog(`Results image attachment for ${token} ready`);

	return {
		file,
		fileName: `attachment://${attachmentName}`,
	};
}
