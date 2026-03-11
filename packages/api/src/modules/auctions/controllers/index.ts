import { inject, injectable } from 'inversify';
import { TYPES } from '@/lib/di/types';
import type { ApiResponse, AuthenticatedRequest } from '@/modules/common/types';
import type { AuctionsService } from '../services/auctions.service';
import type { Auction, CreateAuctionData } from '../types';

@injectable()
export class AuctionsController {
	constructor(
		@inject(TYPES.AuctionsService) private auctionsService: AuctionsService,
	) {}

	create = async ({
		user,
		body,
	}: AuthenticatedRequest<CreateAuctionData>): Promise<
		ApiResponse<Auction>
	> => {
		const auction = await this.auctionsService.create(user.id, body);

		return {
			success: true,
			data: auction,
		};
	};

	list = async (): Promise<ApiResponse<Auction[]>> => {
		const data = await this.auctionsService.list();
		return { success: true, data };
	};
}
