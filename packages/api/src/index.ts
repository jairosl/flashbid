import 'dotenv/config';
import 'reflect-metadata';
import serverTiming from '@elysiajs/server-timing';
import { Elysia } from 'elysia';
import { corsConfig, openapiConfig } from './config';
import { errorHandler, loggerPlugin } from './lib/http/plugins';
import { auctionsRoutes } from './modules/auctions';
import { authRoutes } from './modules/auth';
import { productsRoutes } from './modules/products';
import { usersRoutes } from './modules/users';

const app = new Elysia()
	.onError(errorHandler)
	.use(loggerPlugin)
	.use(serverTiming())
	.use(openapiConfig)
	.use(corsConfig)
	.use(authRoutes)
	.use(usersRoutes)
	.use(productsRoutes)
	.use(auctionsRoutes)
	.get('/', () => 'Hello Elysia')
	.listen(process.env.PORT || 8080);
