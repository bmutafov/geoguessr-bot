import colors from 'colors/safe';

const log = {
	error: (message: string) => colors.red(message),
};

export const debugLog = (message: string) => {
	if (process.env.NODE_ENV == 'development') {
		console.log(colors.black(colors.bgWhite(' DEBUG ')), message);
	}
};

export default log;
