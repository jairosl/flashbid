import { openapi } from '@elysiajs/openapi';
import { Elysia } from 'elysia';
import { OpenAPI } from '@/lib/auth';
import { betterAuthPluguin } from './lib/http/pluguins/better-auth';

const app = new Elysia()
	.use(
		openapi({
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
		}),
	)
	.use(betterAuthPluguin)
	.get('/', () => 'Hello Elysia')
	.get('/user', ({ user }) => user, {
		auth: true,
	})
	.listen(process.env.PORT || 8080);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
