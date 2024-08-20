import type { FormDataValidator, NewAuditLog } from '@database/types';
import type {
	BuildCreationAuditLogArgs,
	BuildUpdateAuditLogArgs,
} from '@services/server/types';
import type { SafeParseError, SafeParseSuccess } from 'zod';

/**
 * Parses the form data from a request using a validator.
 *
 * If the form data cannot be parsed, the function returns null.
 * Otherwise, it returns the parsed form data as a zod safe parse result.
 *
 * @param request - The request object.
 * @param validator - The validator object.
 * @returns A promise that resolves to the parsed form data or null if parsing fails.
 */
export async function parseFormData<T extends FormDataValidator>(
	request: Request,
	validator: T,
) {
	let formData: FormData;

	try {
		formData = await request.formData();
	} catch {
		return null;
	}

	const result = validator.safeParse(formData);

	if (!result.success) {
		return result as SafeParseError<T['_output']>;
	}

	return result as SafeParseSuccess<T['_output']>;
}

/**
 * Builds a creation audit log object.
 *
 * @param session - The session object.
 * @param resource - The resource name.
 * @param newData - The new data object.
 * @returns The new audit log object.
 */
export function buildCreationAuditLog({
	session,
	resource,
	newData,
}: BuildCreationAuditLogArgs): NewAuditLog {
	return {
		action: 'create',
		table: resource,
		userId: session.username,
		newData: newData,
		oldData: {},
	};
}

/**
 * Builds an update audit log object.
 *
 * @param session - The session object.
 * @param resource - The resource being updated.
 * @param newData - The new data being updated.
 * @param oldData - The old data before the update.
 * @returns The new audit log object.
 */
export function buildUpdateAuditLog({
	session,
	resource,
	newData,
	oldData,
}: BuildUpdateAuditLogArgs): NewAuditLog {
	return {
		action: 'update',
		table: resource,
		userId: session.userId,
		newData: newData,
		oldData: oldData,
	};
}
