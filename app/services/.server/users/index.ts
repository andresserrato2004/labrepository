import type { InfoUser, NewUser } from '@database/types';
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
import { handleUnknownError } from '@services/server/utility';
import {
	ResponseType,
	SuccessCode,
	getErrorsFromZodError,
	isAppError,
} from '@services/shared/utility';
import { getTableColumns } from 'drizzle-orm';

/**
 * Checks if a user with the given username already exists in the database.
 *
 * @param request - The new user object containing the username.
 * @returns A promise that resolves to an Errors object if the username already exists, or null if it doesn't.
 */
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

/**
 * Retrieves all users from the database.
 * @returns A promise that resolves to a ServiceResponse containing an array of User objects.
 */
export async function getAllUsers(): Promise<ServiceResponse<InfoUser[]>> {
	try {
		const { password, ...columns } = getTableColumns(schema.users);

		const users = await database
			.select({
				...columns,
			})
			.from(schema.users);

		return {
			type: ResponseType.Success,
			code: SuccessCode.Ok,
			data: users,
		};
	} catch (error) {
		return handleUnknownError({
			error: error,
			stack: 'users/getAllUsers',
		});
	}
}

/**
 * Creates a new user.
 *
 * @param request - The request object containing user data.
 * @returns A promise that resolves to a ServiceResponse object.
 */
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
