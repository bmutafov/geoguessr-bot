namespace NodeJS {
	interface ProcessEnv {
		PERMISSIONS: string;
		CLIENT_ID: string;
		BOT_TOKEN: string;
		COOKIE: string;
		GUILD_ID: string;
		NODE_ENV: 'development' | 'production';
	}
}
