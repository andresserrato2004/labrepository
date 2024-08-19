import type * as schema from '@database/schema/tables';
import type { zfd } from 'zod-form-data';

/**
 * Represents the configuration for an IsoTimeStamp custom type on postgres.
 */
export type IsoTimeStampConfig = {
	data: string;
	driverData: string;
	config: undefined;
};

export type User = typeof schema.users.$inferSelect;
export type NewUser = typeof schema.users.$inferInsert;

export type Classroom = typeof schema.classrooms.$inferSelect;
export type NewClassroom = typeof schema.classrooms.$inferInsert;

export type AuditLog = typeof schema.auditLogs.$inferSelect;
export type NewAuditLog = typeof schema.auditLogs.$inferInsert;

export type ErrorLog = typeof schema.errorLogs.$inferSelect;
export type NewErrorLog = typeof schema.errorLogs.$inferInsert;

export type FormDataValidator = ReturnType<typeof zfd.formData>;

export type AuditAction = schema.AuditAction;
export type AppResource = schema.AppResource;
export type UserRole = schema.UserRole;
