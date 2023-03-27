import { red } from 'colors/safe';

const log = {
	error: (message: string) => red(message),
};

export default log;
