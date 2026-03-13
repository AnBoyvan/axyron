export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			// Base
			APP_URL: string;
			NEXT_PUBLIC_APP_URL: string;
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

			// R2
			R2_ACCOUNT_ID: string;
			R2_ACCESS_KEY_ID: string;
			R2_SECRET_ACCESS_KEY: string;
			R2_BUCKET_NAME: string;
			R2_TOKEN: string;
			NEXT_PUBLIC_R2_PUBLIC_URL: string;

			// Node
			NODE_ENV: 'development' | 'production' | 'test';
		}
	}
}
