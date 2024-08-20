import type { NewUser } from '@database/types';
import type {
	CreateUserArgs,
	Errors,
	NoContent,
	ServiceResponse,
} from '@services/server/types';

import { database, eq, schema } from '@database';
import { newUserValidator } from '@database/validators';
import { InvalidNewUserError, UserConflictError } from '@errors/services';
import { hashPassword } from '@services/server/auth/security';
import {
	ResponseType,
	SuccessCode,
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
		user.password = await hashPassword(user.password);

		await database.transaction(async (trx) => {
			await trx.insert(schema.users).values(user).returning();
			//TODO: Implement auditory logs
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
