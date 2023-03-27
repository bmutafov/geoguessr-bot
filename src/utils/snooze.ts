/**
 * This function takes in a number of milliseconds to wait and returns a Promise that resolves after
 * that time has elapsed. The setTimeout function is used to delay the resolution of the
 * Promise by the specified number of milliseconds.
 * @param ms How many milliseconds to sleep
 */
export function snooze(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
