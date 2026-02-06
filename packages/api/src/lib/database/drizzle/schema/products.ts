import { randomUUIDv7 } from 'bun';
import { relations } from 'drizzle-orm';
import {
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';
import { auction } from './auctions';
import { user } from './users';

export const product = pgTable('product', {
	id: uuid('id')
		.primaryKey()
		.$default(() => randomUUIDv7()),
	name: text('name').notNull(),
	description: text('description'),
	imageUrl: text('image_url'),
	ownerId: uuid('owner_id')
		.notNull()
		.references(() => user.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const productRelations = relations(
	product,
	({ one, many }) => ({
		owner: one(user, {
			fields: [product.ownerId],
			references: [user.id],
		}),
		auctions: many(auction),
	}),
);
