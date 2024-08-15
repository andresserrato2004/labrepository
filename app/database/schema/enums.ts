import { pgEnum } from 'drizzle-orm/pg-core';

export enum AppResource {
	Users = 'users',
	Clients = 'clients',
	Products = 'products',
	Resolutions = 'resolutions',
	Invoices = 'invoices',
}

export enum AuditAction {
	Create = 'create',
	Read = 'read',
	Update = 'update',
	Delete = 'delete',
}

export const appResourceEnum = pgEnum(
	'app_resource',
	Object.values(AppResource) as [string, ...string[]],
);

export const auditActionEnum = pgEnum(
	'audit_action',
	Object.values(AuditAction) as [string, ...string[]],
);
