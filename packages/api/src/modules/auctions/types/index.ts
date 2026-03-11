/**
 * Tipos do módulo de leilões
 */
export enum AuctionStatus {
	PENDING = 'PENDING',
	ACTIVE = 'ACTIVE',
	CLOSED = 'CLOSED',
	CANCELLED = 'CANCELLED',
}

export interface Auction {
	id: string;
	productId: string;
	sellerId: string;
	startPrice: string;
	minStep: string | null;
	buyNowPrice: string | null;
	status: AuctionStatus;
	startsAt: Date;
	endsAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateAuctionData {
	productId: string;
	startPrice: number;
	minStep?: number;
	buyNowPrice?: number;
	startsAt: Date;
	endsAt: Date;
}
