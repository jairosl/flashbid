import { Elysia, t } from 'elysia';
import type { Redis } from 'ioredis';
import { logger } from '@/lib/logger';
import { redis } from '@/lib/redis';
import type { Auction } from '@/modules/auctions/types';

export const auctionWs = new Elysia().ws('/ws/auction/:id', {
	params: t.Object({
		id: t.String(),
	}),
	open(ws) {
		const { id: auctionId } = ws.data.params;
		logger.info('Client connected to auction', { auctionId });

		const subscriber = redis.duplicate();
		// @ts-expect-error - Adding dynamic property to ws.data
		ws.data.subscriber = subscriber;

		subscriber.subscribe(`auction:${auctionId}`, (err) => {
			if (err) {
				logger.error('Failed to subscribe to auction', { err, auctionId });
				ws.close();
			} else {
				logger.info('Subscribed to auction', { auctionId });
			}
		});

		subscriber.on('message', (channel, message: string) => {
			logger.info('Message received from redis', { channel, message });
			const auction = JSON.parse(message) as Auction;
			ws.send(
				JSON.stringify({
					...auction,
					startPrice: auction.startPrice.toString(),
					minStep: auction.minStep?.toString(),
					buyNowPrice: auction.buyNowPrice?.toString(),
				}),
			);
		});
	},
	message(ws, message) {
		logger.info('Message from client', {
			auctionId: (ws.data.params as any).id,
			message,
		});
	},
	close(ws) {
		const { id: auctionId } = ws.data.params as any;
		logger.info('Client disconnected from auction', { auctionId });

		const subscriber = (ws.data as any).subscriber as Redis | undefined;
		if (subscriber) {
			subscriber.unsubscribe(`auction:${auctionId}`);
			subscriber.quit();
		}
	},
});
