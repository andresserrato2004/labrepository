import type { IsoTimeStampConfig, PeriodName } from '@database/types';

import { sql } from 'drizzle-orm';
import {
	customType,
	foreignKey,
	integer,
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

//TODO: Add docs for the tables.

export const users = pgTable(
	'users',
	{
		id: text('id')
			.$defaultFn(() => generators.createUserId())
			.notNull(),
		username: text('username').notNull(),
		name: text('name').notNull(),
		password: text('password').notNull(),
		email: text('email').notNull(),
		role: enums
			.userRoleEnum('role')
			.$type<enums.UserRole | `${enums.UserRole}`>()
			.notNull(),
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

export const classrooms = pgTable(
	'classrooms',
	{
		id: text('id')
			.$defaultFn(() => generators.createClassroomId())
			.notNull(),
		name: text('name').notNull(),
		capacity: integer('capacity').notNull(),
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

export const academicPeriods = pgTable(
	'academic_periods',
	{
		id: text('id')
			.$defaultFn(() => generators.createAcademicPeriodId())
			.notNull(),
		name: text('name').$type<PeriodName>().notNull(),
		startDate: isoTimestamp('start_date').notNull(),
		endDate: isoTimestamp('end_date').notNull(),
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

export const reservations = pgTable(
	'reservations',
	{
		id: text('id')
			.$defaultFn(() => generators.createReservationId())
			.notNull(),
		userId: text('user_id').notNull(),
		classroomId: text('classroom_id').notNull(),
		startTime: isoTimestamp('start_time').notNull(),
		endTime: isoTimestamp('end_time').notNull(),
		course: text('course').notNull(),
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
				name: 'reservations_user_fk',
			})
				.onDelete('restrict')
				.onUpdate('restrict'),
			classroomReference: foreignKey({
				columns: [table.classroomId],
				foreignColumns: [classrooms.id],
				name: 'reservations_classroom_fk',
			})
				.onDelete('restrict')
				.onUpdate('restrict'),
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
		userId: text('user_id').notNull(),
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
