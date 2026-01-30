import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './database/drizzle/client';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
	}),
	advanced: {
		database: {
			generateId: false,
		},
	},
});
