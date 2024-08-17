import type { HandleUnknownErrorArgs } from '@services/types';
import type { ServerErrorResponse } from '@services/types';

import { database, schema } from '@database';
import { ResponseType, ServerErrorCode } from '@services/utility/enums';

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
