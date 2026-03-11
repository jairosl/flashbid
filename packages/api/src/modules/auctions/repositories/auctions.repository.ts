import type { Auction, CreateAuctionData } from '../types';

export interface AuctionsRepository {
	create(sellerId: string, data: CreateAuctionData): Promise<Auction>;
	findAll(): Promise<Auction[]>;
	findById(id: string): Promise<Auction | null>;
	findActiveByProductId(productId: string): Promise<Auction | null>;
}
