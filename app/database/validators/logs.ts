import { schema } from '@database';
import { isoDate } from '@database/validators/shared';
import { createInsertSchema } from 'drizzle-zod';

const newErrorLogSchema = createInsertSchema(schema.errorLogs, {
	createdAt: (_schema) => isoDate.optional(),
	updatedAt: (_schema) => isoDate.optional(),
});

const newAuditLogSchema = createInsertSchema(schema.auditLogs, {
	createdAt: (_schema) => isoDate.optional(),
	updatedAt: (_schema) => isoDate.optional(),
});

export const newErrorLogValidator = newErrorLogSchema;
export const newAuditLogValidator = newAuditLogSchema;
