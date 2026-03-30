import type { Job } from 'bullmq';
import type { Redis } from 'ioredis';
import { container } from '@/lib/di/container';
import { TYPES } from '@/lib/di/types';
import { logger } from '@/lib/logger';
import type { AuctionsRepository } from '../repositories';
import { AuctionStatus } from '../types';

export const activateAuctionJob = async (job: Job<{ auctionId: string }>) => {
	const { auctionId } = job.data;
	logger.info('Processing activate-auction job', { auctionId });

	try {
		const auctionsRepository = container.get<AuctionsRepository>(
			TYPES.AuctionsRepository,
		);
		const redis = container.get<Redis>(TYPES.Redis);

		const auction = await auctionsRepository.findById(auctionId);

		if (!auction) {
			logger.error('Auction not found in job', { auctionId });
			return;
		}

		if (auction.status !== AuctionStatus.PENDING) {
			logger.warn('Auction is not pending, skipping activation', {
				auctionId,
				status: auction.status,
			});
			return;
		}

		// Update status to ACTIVE
		const updatedAuction = await auctionsRepository.update(auctionId, {
			status: AuctionStatus.ACTIVE,
		});

		if (!updatedAuction) {
			throw new Error('Failed to update auction status');
		}

		// Initialize Redis state
		const auctionKey = `auction:${auctionId}`;
		await redis.set(auctionKey, JSON.stringify(updatedAuction));

		// Publish event
		await redis.publish(auctionKey, JSON.stringify(updatedAuction));

		logger.info('Auction activated successfully', { auctionId });
	} catch (error) {
		logger.error('Failed to activate auction', { auctionId, error });
		throw error;
	}
};
