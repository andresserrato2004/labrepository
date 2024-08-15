import type { IsoTimeStampConfig } from '@database/types';

import { sql } from 'drizzle-orm';
import {
	customType,
	pgTable,
	primaryKey,
	text,
	uniqueIndex,
} from 'drizzle-orm/pg-core';

const isoTimestamp = customType<IsoTimeStampConfig>({
	dataType() {
		return 'timestamp';
	},
	fromDriver(value) {
		return `${value.replace(' ', 'T')}Z`;
	},
});

export const users = pgTable(
	'users',
	{
		id: text('id')
			.$defaultFn(() => '1' /**TODO: Generate UUID */)
			.notNull(),
		username: text('username').notNull(),
		name: text('name').notNull(),
		password: text('password').notNull(),
		createdAt: isoTimestamp('created_at').default(sql`now()`).notNull(),
		updatedAt: isoTimestamp('updated_at')
			.default(sql`now()`)
			.$onUpdate(() => sql`now()`)
			.notNull(),
	},
	(table) => {
		return {
			primaryKey: primaryKey({
				columns: [table.id],
			}),
			uniqueUsername: uniqueIndex('users_username_unique').on(
				table.username,
			),
		};
	},
);
