import { Elysia } from 'elysia';
import { betterAuthPluguin } from '../lib/http/pluguins/better-auth';

export const userRoutes = new Elysia({
	prefix: 'users',
})
	.use(betterAuthPluguin)
	.get('/', ({ user }) => user, {
		auth: true,
	});
