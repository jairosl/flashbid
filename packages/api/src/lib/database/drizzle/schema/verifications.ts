import { randomUUIDv7 } from 'bun';
import { relations } from 'drizzle-orm';
import {
	index,
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';
import { account } from './accounts';
import { user } from './users';

export const verification = pgTable(
	'verification',
	{
		id: uuid('id')
			.primaryKey()
			.$default(() => randomUUIDv7()),

		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at')
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index('verification_identifier_idx').on(
			table.identifier,
		),
	],
);

export const accountRelations = relations(
	account,
	({ one }) => ({
		user: one(user, {
			fields: [account.userId],
			references: [user.id],
		}),
	}),
);
