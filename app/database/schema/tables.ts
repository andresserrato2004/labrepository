import type { IsoTimeStampConfig } from '@database/types';

import { sql } from 'drizzle-orm';
import {
	customType,
	foreignKey,
	jsonb,
	pgTable,
	primaryKey,
	text,
	uniqueIndex,
} from 'drizzle-orm/pg-core';

import * as enums from '@database/schema/enums';
import * as generators from '@database/schema/generators';

export * from '@database/schema/enums';

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
			.$defaultFn(() => generators.createUserId())
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

export const errorLogs = pgTable(
	'error_logs',
	{
		id: text('id')
			.$defaultFn(() => generators.createLogId())
			.notNull(),
		message: text('message').notNull(),
		stack: text('stack').notNull(),
		name: text('name').notNull(),
		additionalInfo: jsonb('additional_info'),
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
		};
	},
);

export const auditLogs = pgTable(
	'audit_logs',
	{
		id: text('id')
			.$defaultFn(() => generators.createLogId())
			.notNull(),
		userId: text('user').notNull(),
		action: enums
			.auditActionEnum('action')
			.$type<enums.AuditAction | `${enums.AuditAction}`>()
			.notNull(),
		table: enums
			.appResourceEnum('table')
			.$type<enums.AppResource | `${enums.AppResource}`>()
			.notNull(),
		oldData: jsonb('old_data').notNull(),
		newData: jsonb('new_data').notNull(),
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
			userReference: foreignKey({
				columns: [table.userId],
				foreignColumns: [users.id],
				name: 'audit_logs_user_fk',
			})
				.onDelete('restrict')
				.onUpdate('restrict'),
		};
	},
);
