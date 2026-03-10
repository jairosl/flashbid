import 'dotenv/config';
import 'reflect-metadata';
import { Elysia } from 'elysia';
import { corsConfig, openapiConfig } from './config';
import { errorPlugin } from './lib/http/plugins';
import { authRoutes } from './modules/auth';
import { productsRoutes } from './modules/products';
import { usersRoutes } from './modules/users';

const app = new Elysia()
	.use(openapiConfig)
	.use(corsConfig)
	.use(errorPlugin)
	.use(authRoutes)
	.use(usersRoutes)
	.use(productsRoutes)
	.get('/', () => 'Hello Elysia')
	.listen(process.env.PORT || 8080);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
