export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			// Base
			BASE_URL: string;
			NEXT_PUBLIC_BASE_URL: string;
			NEXT_PUBLIC_DEVELOPED_BY: string;

			// Database
			DATABASE_URL: string;

			// Auth
			BETTER_AUTH_SECRET: string;
			BETTER_AUTH_URL: string;
			GITHUB_CLIENT_ID: string;
			GITHUB_CLIENT_SECRET: string;
			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;

			// Polar
			POLAR_ACCESS_TOKEN: string;

			// Node
			NODE_ENV: 'development' | 'production' | 'test';
		}
	}
}
