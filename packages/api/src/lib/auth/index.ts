/** biome-ignore-all lint/suspicious/noExplicitAny: Docs Elysia + betterAuth */
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
			hash: (password: string) =>
				Bun.password.hash(password),
			verify: ({ password, hash }) =>
				Bun.password.verify(password, hash),
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

let _schema: ReturnType<
	typeof auth.api.generateOpenAPISchema
>;
const getSchema = async () =>
	// biome-ignore lint/suspicious/noAssignInExpressions: Necessary by generate Doc better-auth
	(_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
	getPaths: (prefix = '/auth') =>
		getSchema().then(({ paths }) => {
			const reference: typeof paths = Object.create(null);

			for (const path of Object.keys(paths)) {
				const key = prefix + path;
				reference[key] = paths[path];

				for (const method of Object.keys(paths[path])) {
					const operation = (reference[key] as any)[method];

					operation.tags = ['Better Auth'];
				}
			}

			return reference;
		}) as Promise<any>,
	components: getSchema().then(
		({ components }) => components,
	) as Promise<any>,
} as const;
