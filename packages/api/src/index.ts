import 'dotenv/config';
import 'reflect-metadata';
import serverTiming from '@elysiajs/server-timing';
import { Elysia } from 'elysia';
import { corsConfig, openapiConfig } from './config';
import { errorHandler, loggerPlugin } from './lib/http/plugins';
import { startWorkers } from './lib/queue/worker';
import { auctionsRoutes } from './modules/auctions';
import { authRoutes } from './modules/auth';
import { productsRoutes } from './modules/products';
import { usersRoutes } from './modules/users';

// Start Queue Workers
startWorkers();

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
	.get('/', () => 'Hello Elysia');

app.listen(process.env.PORT || 8080);
