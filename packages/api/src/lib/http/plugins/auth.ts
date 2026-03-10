/** biome-ignore-all lint/suspicious/noExplicitAny: Docs Elysia + betterAuth */
import Elysia from 'elysia';
import { container } from '@/lib/di/container';
import { TYPES } from '@/lib/di/types';
import type { AuthService } from '@/modules/auth/services/auth.service';

const authService = container.get<AuthService>(TYPES.AuthService);
const auth = authService.client;

export const authPlugin = new Elysia({
	name: 'better-auth',
})
	.mount(auth.handler)
	.macro({
		auth: {
			async resolve({ status, request: { headers } }) {
				const session = await auth.api.getSession({
					headers,
				});

				if (!session) return status(401);

				return {
					user: session.user,
					session: session.session,
				};
			},
		},
	});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
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
	components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
