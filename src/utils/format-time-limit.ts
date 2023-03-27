export function formatTimeLimit(seconds: number): string {
	if (seconds < 60) {
		return `${seconds}s`;
	} else {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		if (remainingSeconds > 0) {
			return `${minutes}m ${remainingSeconds}s`;
		} else {
			return `${minutes}m`;
		}
	}
}
