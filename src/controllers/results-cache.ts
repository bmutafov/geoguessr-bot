class ResultsCache {
	private cache: Map<string, number> = new Map();

	save(token: string, resultsCount: number) {
		this.cache.set(token, resultsCount);
	}

	hasUpdates(token: string, resultsCount: number): boolean {
		if (this.cache.has(token)) {
			return this.cache.get(token) !== resultsCount;
		}

		return false;
	}

	clear(token: string) {
		this.cache.delete(token);
	}
}

export const resultsCache = new ResultsCache();
