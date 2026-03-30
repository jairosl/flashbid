import type { Redis } from 'ioredis';
import type { Auction, Bid } from '@/modules/auctions/types/index';
import { PLACE_BID_SCRIPT } from './scripts';

export interface PlaceBidResult {
	success?: boolean;
	err?: string;
	auction?: Auction;
	bid?: Bid;
}

export class AuctionScripts {
	constructor(private redis: Redis) {
		this.redis.defineCommand('placeBid', {
			numberOfKeys: 2,
			lua: PLACE_BID_SCRIPT,
		});
	}

	async placeBid(
		auctionId: string,
		bidId: string,
		userId: string,
		amount: number,
	): Promise<PlaceBidResult> {
		try {
			// @ts-expect-error - defineCommand dynamically adds this method
			const result = await this.redis.placeBid(
				`auction:${auctionId}`,
				`auction:${auctionId}:bid:${bidId}`,
				userId,
				amount,
				Date.now(),
			);

			if (typeof result === 'string') {
				return JSON.parse(result) as PlaceBidResult;
			}

			return result as PlaceBidResult;
		} catch (error) {
			console.error('Error executing bid script:', error);
			throw error;
		}
	}
}
