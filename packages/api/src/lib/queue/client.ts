import { Queue } from 'bullmq';

const connection = {
	url: process.env.REDIS_URL || 'redis://localhost:6379',
};

// Queue for auction related jobs
export const auctionQueue = new Queue('auction-queue', {
	connection: {
		...connection,
		maxRetriesPerRequest: null,
	},
});
