import { pgEnum } from 'drizzle-orm/pg-core';

export enum AppResource {
	Users = 'users',
}

export enum AuditAction {
	Create = 'create',
	Read = 'read',
	Update = 'update',
	Delete = 'delete',
}

export enum UserRole {
	Admin = 'admin',
	User = 'user',
}

export const appResourceEnum = pgEnum(
	'app_resource',
	Object.values(AppResource) as [string, ...string[]],
);

export const auditActionEnum = pgEnum(
	'audit_action',
	Object.values(AuditAction) as [string, ...string[]],
);

export const userRoleEnum = pgEnum(
	'user_role',
	Object.values(UserRole) as [string, ...string[]],
);
