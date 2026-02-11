import Elysia from 'elysia';
import { betterAuthPluguin } from '@/lib/http/pluguins/better-auth';

export const productRoutes = new Elysia({
	prefix: '/products',
})
	.use(betterAuthPluguin)
	.guard({ auth: true })
	.post('/', () => {});
