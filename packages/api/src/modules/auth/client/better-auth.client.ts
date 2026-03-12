import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import { db } from '@/lib/database/drizzle/client';
import { logger } from '@/lib/logger';

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITEST;

export const auth = betterAuth({
	basePath: '/auth',
	plugins: [openAPI()],
	logger: {
		disabled: isTest,
		level: 'info',
		log: (
			level: 'debug' | 'info' | 'warn' | 'error',
			message: string,
			// biome-ignore lint/suspicious/noExplicitAny: for log no necessary typing
			...args: any[]
		) => {
			switch (level) {
				case 'error':
					logger.error(message, ...args);
					break;
				case 'warn':
					logger.warn(message, ...args);
					break;
				case 'debug':
					logger.debug(message, ...args);
					break;
				default:
					logger.info(message, ...args);
			}
		},
	},
	database: drizzleAdapter(db, {
		provider: 'pg',
	}),
	advanced: {
		database: {
			generateId: false,
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		password: {
			hash: (password: string) => Bun.password.hash(password),
			verify: ({ password, hash }) => Bun.password.verify(password, hash),
		},
		requireEmailVerification: false,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5,
		},
	},
});
