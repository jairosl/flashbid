import type { Auction, CreateAuctionData } from '../types';

export interface AuctionsService {
	create(sellerId: string, data: CreateAuctionData): Promise<Auction>;
	list(): Promise<Auction[]>;
}
