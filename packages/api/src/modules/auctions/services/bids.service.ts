import { randomUUIDv7 } from 'bun';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/lib/di/types';
import { logger } from '@/lib/logger';
import type { AuctionScripts } from '@/lib/redis/auction-scripts';
import { AuctionsError } from '../errors/auctions-error';
import type { AuctionsRepository } from '../repositories';
import type { Auction } from '../types';
import { AuctionStatus } from '../types';

export interface BidsService {
	placeBid(
		auctionId: string,
		userId: string,
		amount: number,
	): Promise<{ success: boolean; auction: Auction }>;
}

@injectable()
export class BidsServiceImpl implements BidsService {
	constructor(
		@inject(TYPES.AuctionsRepository)
		private auctionsRepository: AuctionsRepository,
		@inject(TYPES.AuctionScripts) private auctionScripts: AuctionScripts,
	) {}

	async placeBid(
		auctionId: string,
		userId: string,
		amount: number,
	): Promise<{ success: boolean; auction: Auction }> {
		// 1. Get auction from database
		const auction = await this.auctionsRepository.findById(auctionId);
		if (!auction) {
			throw new AuctionsError('Auction not found', 'AUCTION_NOT_FOUND', 404);
		}

		// 2. Check auction status
		if (auction.status !== AuctionStatus.ACTIVE) {
			throw new AuctionsError(
				'Auction is not active',
				'AUCTION_NOT_ACTIVE',
				400,
			);
		}

		// 3. Place bid using Lua script
		const bidId = randomUUIDv7();
		const result = await this.auctionScripts.placeBid(
			auctionId,
			bidId,
			userId,
			amount,
		);

		if (!result.success || !result.auction) {
			logger.warn('Failed to place bid', {
				auctionId,
				userId,
				amount,
				error: result.err,
			});
			throw new AuctionsError(
				result.err ?? 'Failed to place bid',
				'BID_FAILED',
				400,
			);
		}

		// Note: The Lua script now handles publishing the update to Redis Pub/Sub.

		// 4. Persist bid to database (optional, can be done async)
		// For now, we are not persisting every bid to keep the example simple.
		// In a real application, you might want to save bids to the database.
		logger.info('Bid placed successfully', { auctionId, userId, amount });

		return { success: true, auction: result.auction };
	}
}
