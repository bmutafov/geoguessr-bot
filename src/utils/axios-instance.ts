import axios from 'axios';

export const geoGuessrClient = axios.create({
	baseURL: 'https://www.geoguessr.com',
	headers: {
		cookie: process.env.COOKIE,
	},
});
