import { inject, injectable } from 'inversify';
import { TYPES } from '@/lib/di/types';
import type { AuthenticatedRequest } from '@/modules/common/types';
import type { BidsService } from '../services/bids.service';
import type { Auction } from '../types';

@injectable()
export class BidsController {
	constructor(@inject(TYPES.BidsService) private bidsService: BidsService) {}

	async placeBid(
		req: AuthenticatedRequest<{ amount: number }, { id: string }>,
	): Promise<{ success: boolean; auction: Auction }> {
		const { id: auctionId } = req.params;
		const { amount } = req.body;
		const userId = req.user.id;

		return this.bidsService.placeBid(auctionId, userId, amount);
	}
}
