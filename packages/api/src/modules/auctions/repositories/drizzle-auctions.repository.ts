import { and, eq, or } from 'drizzle-orm';
import { injectable } from 'inversify';
import { db } from '@/lib/database/drizzle/client';
import { auction } from '@/lib/database/drizzle/schema';
import { AuctionStatus } from '../types';
import type { Auction, CreateAuctionData } from '../types';
import type { AuctionsRepository } from './auctions.repository';

@injectable()
export class DrizzleAuctionsRepository implements AuctionsRepository {
	async create(sellerId: string, data: CreateAuctionData): Promise<Auction> {
		const [newAuction] = await db
			.insert(auction)
			.values({
				productId: data.productId,
				sellerId: sellerId,
				startPrice: data.startPrice.toString(),
				minStep: data.minStep?.toString(),
				buyNowPrice: data.buyNowPrice?.toString(),
				startsAt: data.startsAt,
				endsAt: data.endsAt,
				status: AuctionStatus.PENDING,
			})
			.returning();

		return newAuction as Auction;
	}

	async findAll(): Promise<Auction[]> {
		const results = await db.select().from(auction);
		return results as Auction[];
	}

	async findById(id: string): Promise<Auction | null> {
		const [result] = await db.select().from(auction).where(eq(auction.id, id));
		return (result as Auction) || null;
	}

	async findActiveByProductId(productId: string): Promise<Auction | null> {
		const [result] = await db
			.select()
			.from(auction)
			.where(
				and(
					eq(auction.productId, productId),
					or(
						eq(auction.status, AuctionStatus.ACTIVE),
						eq(auction.status, AuctionStatus.PENDING),
					),
				),
			);

		return (result as Auction) || null;
	}
}
