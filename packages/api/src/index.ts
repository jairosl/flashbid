import { openapi } from '@elysiajs/openapi';
import { Elysia } from 'elysia';
import { auth } from '@/lib/auth';

const app = new Elysia()
	.use(openapi())
	.mount(auth.handler)
	.get('/', () => 'Hello Elysia')
	.listen(process.env.PORT || 8080);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
