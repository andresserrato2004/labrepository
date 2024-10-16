import type { InfoUser, NewUser, UpdateUser } from '@database/types';
import type {
	CreateUserArgs,
	Errors,
	NoContent,
	ServiceResponse,
	UpdateUserArgs,
} from '@services/server/types';

import { database, eq, or, schema } from '@database';
import { newUserValidator, updateUserValidator } from '@database/validators';
import {
	InvalidNewUserError,
	InvalidUpdateUserError,
	UserConflictError,
} from '@errors/services';
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
async function checkForExistingUser<T extends NewUser | UpdateUser>(
	request: T,
): Promise<Errors<T> | null> {
	const users = await database
		.select()
		.from(schema.users)
		.where(
			or(
				eq(schema.users.username, request.username),
				eq(schema.users.email, request.email),
			),
		);

	const conflictError: Errors<T> = {};

	if (users.length === 0) {
		return null;
	}

	if (users.length === 1 && request.id === users[0].id) {
		return null;
	}

	for (const user of users) {
		if (user.username === request.username) {
			conflictError.username = 'Username already exists';
		}

		if (user.email === request.email) {
			conflictError.email = 'Email already exists';
		}
	}

	return conflictError;
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
		const user = schemaValidation.data;
		const conflictError = await checkForExistingUser(user);

		if (conflictError) {
			throw new UserConflictError(conflictError);
		}

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

/**
 * Updates a user.
 *
 * @param request - The request object containing the updated user data.
 * @returns A promise that resolves to a ServiceResponse object.
 */
export async function updateUser({
	request,
}: UpdateUserArgs): Promise<ServiceResponse<NoContent, UpdateUser>> {
	try {
		const schemaValidation = updateUserValidator.safeParse(request);

		if (!schemaValidation.success) {
			throw new InvalidUpdateUserError(
				getErrorsFromZodError(schemaValidation.error),
			);
		}

		const user = schemaValidation.data;
		const conflictError = await checkForExistingUser(user);

		if (conflictError) {
			throw new UserConflictError(conflictError);
		}

		await database.transaction(async (trx) => {
			await trx
				.update(schema.users)
				.set(user)
				.where(eq(schema.users.id, user.id));
		});

		return {
			type: ResponseType.Success,
			code: SuccessCode.Ok,
			data: null,
		};
	} catch (error) {
		if (isAppError<UpdateUser>(error)) {
			return error.toServiceResponse();
		}

		return handleUnknownError({
			error: error,
			stack: 'users/updateUser',
			additionalInfo: { request },
		});
	}
}
