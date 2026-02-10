import { randomUUIDv7 } from 'bun';
import { relations } from 'drizzle-orm';
import {
	decimal,
	index,
	pgTable,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';
import { auction } from './auctions';

export const bid = pgTable(
	'bid',
	{
		id: uuid('id')
			.primaryKey()
			.$default(() => randomUUIDv7()),

		auctionId: uuid('auction_id')
			.notNull()
			.references(() => auction.id),

		bidderId: uuid('bidder_id').notNull(),

		amount: decimal('amount', {
			precision: 10,
			scale: 2,
		}).notNull(),
		createdAt: timestamp('created_at')
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index('bid_auction_idx').on(table.auctionId)],
);

export const bidsRelations = relations(bid, ({ one }) => ({
	auction: one(auction, {
		fields: [bid.auctionId],
		references: [auction.id],
	}),
}));
