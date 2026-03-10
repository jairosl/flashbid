import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import { db } from '@/lib/database/drizzle/client';

export const auth = betterAuth({
	basePath: '/auth',
	plugins: [openAPI()],
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
