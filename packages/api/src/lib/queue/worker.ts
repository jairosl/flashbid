import { Worker } from 'bullmq';
import { logger } from '@/lib/logger';
import { activateAuctionJob } from '@/modules/auctions/jobs/activate-auction.job';

const connection = {
	url: process.env.REDIS_URL || 'redis://localhost:6379',
};

export const startWorkers = () => {
	logger.info('Starting queue workers...');

	const worker = new Worker('auction-queue', async (job) => {
		if (job.name === 'activate-auction') {
			await activateAuctionJob(job);
		} else {
			logger.warn('Unknown job type', { jobName: job.name });
		}
	}, {
		connection: {
			...connection,
			maxRetriesPerRequest: null,
		},
	});

	worker.on('completed', (job) => {
		logger.info('Job completed', { jobId: job.id, jobName: job.name });
	});

	worker.on('failed', (job, err) => {
		logger.error('Job failed', { jobId: job?.id, jobName: job?.name, err });
	});

	logger.info('Queue workers started');
};
