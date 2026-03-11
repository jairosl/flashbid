import { inject, injectable } from 'inversify';
import { TYPES } from '@/lib/di/types';
import type { ProductsService } from '@/modules/products/services/products.service';
import { AuctionsError } from '../errors/auctions-error';
import type { AuctionsRepository } from '../repositories';
import type { Auction, CreateAuctionData } from '../types';
import type { AuctionsService } from './auctions.service';

@injectable()
export class AuctionsDbService implements AuctionsService {
	constructor(
		@inject(TYPES.AuctionsRepository)
		private auctionsRepository: AuctionsRepository,
		@inject(TYPES.ProductsService)
		private productsService: ProductsService,
	) {}

	async create(sellerId: string, data: CreateAuctionData): Promise<Auction> {
		// 1. Verify if product exists
		const product = await this.productsService.getById(data.productId);
		if (!product) {
			throw new AuctionsError('Product not found', 'PRODUCT_NOT_FOUND', 404);
		}

		// 2. Verify if seller owns the product
		if (product.ownerId !== sellerId) {
			throw new AuctionsError(
				'You do not own this product',
				'UNAUTHORIZED_SELLER',
				403,
			);
		}

		// 3. Verify if there is already an active auction for this product
		const activeAuction = await this.auctionsRepository.findActiveByProductId(
			data.productId,
		);

		if (activeAuction) {
			throw new AuctionsError(
				'There is already an active or pending auction for this product',
				'ACTIVE_AUCTION_EXISTS',
				400,
			);
		}

		// 4. Verify dates
		if (data.startsAt >= data.endsAt) {
			throw new AuctionsError(
				'Start date must be before end date',
				'INVALID_DATES',
				400,
			);
		}

		return this.auctionsRepository.create(sellerId, data);
	}

	async list(): Promise<Auction[]> {
		return this.auctionsRepository.findAll();
	}
}
