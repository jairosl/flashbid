import { randomUUIDv7 } from 'bun';
import { relations } from 'drizzle-orm';
import { bigint, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { product } from './products';
import { user } from './users';

export const image = pgTable('image', {
	id: uuid('id')
		.primaryKey()
		.$default(() => randomUUIDv7()),
	url: text('url').notNull(),
	urlPublic: text('url_public').notNull(),
	sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
	ownerId: uuid('owner_id')
		.notNull()
		.references(() => user.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const imageRelations = relations(image, ({ one, many }) => ({
	owner: one(user, {
		fields: [image.ownerId],
		references: [user.id],
	}),
	products: many(product),
}));
