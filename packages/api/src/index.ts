import { Elysia } from 'elysia';
import { corsConfig, openapiConfig } from './config';
import { errorPlugin } from './lib/http/plugins';
import { authRoutes } from './modules/auth';
import { productsRoutes } from './modules/products';
import { storageRoutes } from './modules/storage';
import { usersRoutes } from './modules/users';

const app = new Elysia()
	.use(openapiConfig)
	.use(corsConfig)
	.use(errorPlugin)
	.use(authRoutes)
	.use(usersRoutes)
	.use(productsRoutes)
	.use(storageRoutes)
	.get('/', () => 'Hello Elysia')
	.listen(process.env.PORT || 8080);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
