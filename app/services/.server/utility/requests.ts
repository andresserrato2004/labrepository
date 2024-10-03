import type { FormDataValidator, NewAuditLog } from '@database/types';
import type {
	BuildCreationAuditLogArgs,
	BuildUpdateAuditLogArgs,
	HandleUnknownErrorArgs,
	ServerErrorResponse,
} from '@services/server/types';
import type { SafeParseError, SafeParseSuccess } from 'zod';

import { database, schema } from '@database';
import { ResponseType, ServerErrorCode } from '@services/shared/utility';

/**
 * Handles unknown errors and returns a server error response.
 * This functions should be used as a catch-all for errors that are not handled by other error handlers
 * on the service layer.
 *
 * @param error - The error object.
 * @param stack - The error stack trace.
 * @param additionalInfo - Additional information about the error.
 * @returns A promise that resolves to a ServerErrorResponse object.
 */
export async function handleUnknownError({
	error,
	stack,
	additionalInfo,
}: HandleUnknownErrorArgs): Promise<ServerErrorResponse> {
	const values = {
		name: 'Unknown',
		message: 'Unknown server error',
		stack: stack,
		additionalInfo: { error, ...additionalInfo },
	};

	if (error instanceof Error) {
		values.message = error.message;
		values.name = error.name;
	}

	const [errorLog] = await database
		.insert(schema.errorLogs)
		.values(values)
		.returning({ id: schema.errorLogs.id });

	return {
		code: ServerErrorCode.InternalServerError,
		type: ResponseType.ServerError,
		logId: errorLog.id,
	};
}

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
 * Parses the JSON data from a request using a validator.
 *
 * If the JSON data cannot be parsed, the function returns null.
 * Otherwise, it returns the parsed JSON data as a zod safe parse result.
 *
 * @param request - The request object.
 * @param validator - The validator object.
 * @returns A promise that resolves to the parsed JSON data or null if parsing fails.
 */
export async function parseJson<T extends FormDataValidator>(
	request: Request,
	validator: T,
) {
	let data: unknown;

	try {
		data = await request.json();
		console.log({ data });
	} catch {
		return null;
	}

	if (Array.isArray(data)) {
		for (const item of data) {
			const result = validator.safeParse(item);

			if (!result.success) {
				return result as SafeParseError<T['_output']>;
			}
		}

		return data as unknown as SafeParseSuccess<T['_output']>;
	}

	const result = validator.safeParse(data);

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

/**
 * Validates the admin key in the request headers.
 *
 * @param request - The request object.
 * @returns Returns `true` if the admin key is valid, otherwise `false`.
 */
export function validateAdminKey(request: Request) {
	const adminKey = request.headers.get('x-admin-key');

	if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
		return false;
	}

	return true;
}
