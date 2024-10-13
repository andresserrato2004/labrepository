import { pgEnum } from 'drizzle-orm/pg-core';

/**
 * Enum representing the available resources in the app.
 */
export enum AppResource {
	Users = 'users',
	Classrooms = 'classrooms',
	AcademicPeriods = 'academicPeriods',
	Reservations = 'reservations',
}

/**
 * Enum representing different audit actions.
 */
export enum AuditAction {
	Create = 'create',
	Read = 'read',
	Update = 'update',
	Delete = 'delete',
}

/**
 * Enum representing the roles of a user.
 */
export enum UserRole {
	Admin = 'admin',
	User = 'user',
}

/**
 * Defines the app resource enum.
 *
 * @remarks
 * This enum is used only in the schema definition.
 */
export const appResourceEnum = pgEnum(
	'app_resource',
	Object.values(AppResource) as [string, ...string[]],
);

/**
 * Defines the audit action enum.
 *
 * @remarks
 * This enum is used only in the schema definition.
 */
export const auditActionEnum = pgEnum(
	'audit_action',
	Object.values(AuditAction) as [string, ...string[]],
);

/**
 * Defines the user role enum.
 *
 * @remarks
 * This enum is used only in the schema definition.
 */
export const userRoleEnum = pgEnum(
	'user_role',
	Object.values(UserRole) as [string, ...string[]],
);
