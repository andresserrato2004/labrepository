import type { NewUser } from '@database/types';
import type {
	CreateUserArgs,
	Errors,
	NoContent,
	ServiceResponse,
} from '@services/server/types';

import { database, enums, eq, schema } from '@database';
import { newUserValidator } from '@database/validators';
import { InvalidNewUserError, UserConflictError } from '@errors/services';
import {
	ResponseType,
	SuccessCode,
	buildCreationAuditLog,
	getErrorsFromZodError,
	handleUnknownError,
	isAppError,
} from '@services/server/utility';

async function checkForExistingUser(
	request: NewUser,
): Promise<Errors<NewUser> | null> {
	const [user] = await database
		.select()
		.from(schema.users)
		.where(eq(schema.users.username, request.username))
		.limit(1);

	if (user) {
		return {
			username: 'Username already exists.',
		};
	}

	return null;
}

export async function createUser({
	request,
	session,
}: CreateUserArgs): Promise<ServiceResponse<NoContent, NewUser>> {
	try {
		//TODO: Check user permissions

		const schemaValidation = newUserValidator.safeParse(request);

		if (!schemaValidation.success) {
			throw new InvalidNewUserError(
				getErrorsFromZodError(schemaValidation.error),
			);
		}

		const conflictError = await checkForExistingUser(request);

		if (conflictError) {
			throw new UserConflictError(conflictError);
		}

		const user = schemaValidation.data;

		await database.transaction(async (trx) => {
			const [insertedUser] = await trx
				.insert(schema.users)
				.values(user)
				.returning();

			await trx.insert(schema.auditLogs).values(
				buildCreationAuditLog({
					session: session,
					newData: insertedUser,
					resource: enums.AppResource.Users,
				}),
			);
		});

		return {
			type: ResponseType.Success,
			code: SuccessCode.Created,
			data: null,
		};
	} catch (error) {
		if (isAppError<NewUser>(error)) {
			return error.toServiceResponse();
		}

		return handleUnknownError({
			error: error,
			stack: 'users/createUser',
			additionalInfo: { request },
		});
	}
}
