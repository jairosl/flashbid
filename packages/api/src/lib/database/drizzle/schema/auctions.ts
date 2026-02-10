import { randomUUIDv7 } from 'bun';
import { relations } from 'drizzle-orm';
import {
	decimal,
	index,
	pgEnum,
	pgTable,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';
import { bid } from './bids';
import { product } from './products';

export const auctionStatusEnum = pgEnum('auction_status', [
	'PENDING',
	'ACTIVE',
	'CLOSED',
	'CANCELLED',
]);

export const auction = pgTable(
	'auction',
	{
		id: uuid('id')
			.primaryKey()
			.$default(() => randomUUIDv7()),
		productId: uuid('product_id')
			.notNull()
			.references(() => product.id),

		sellerId: uuid('product_id').notNull(),

		startPrice: decimal('start_price', {
			precision: 10,
			scale: 2,
		}).notNull(),

		minStep: decimal('min_step', {
			precision: 10,
			scale: 2,
		}).default('1.00'), // Incremento mínimo

		buyNowPrice: decimal('buy_now_price', {
			precision: 10,
			scale: 2,
		}), // Opcional: preço pra levar na hora

		status: auctionStatusEnum('status')
			.default('PENDING')
			.notNull(),

		startsAt: timestamp('starts_at').notNull(),
		endsAt: timestamp('ends_at').notNull(),

		createdAt: timestamp('created_at')
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index('auction_status_idx').on(table.status),
		index('auction_ends_at_idx').on(table.endsAt),
	],
);

export const auctionsRelations = relations(
	auction,
	({ one, many }) => ({
		product: one(product, {
			fields: [auction.productId],
			references: [product.id],
		}),
		bid: many(bid),
	}),
);
