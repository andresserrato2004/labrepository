import type { NewLogin, User } from '@database/types';
import type {
	BasicErrorPayload,
	ServiceResponse,
	Session,
} from '@services/server/types';

import { database, eq, schema } from '@database';
import { newLoginValidator } from '@database/validators';
import {
	InvalidNewLoginError,
	InvalidPasswordError,
	InvalidTokenError,
	UserNotFoundError,
} from '@errors/services';
import { decode, sign } from '@services/server/auth/jwt';
import { comparePassword } from '@services/server/auth/security';
import { handleUnknownError } from '@services/server/utility';
import {
	ResponseType,
	SuccessCode,
	getErrorsFromZodError,
	isAppError,
} from '@services/shared/utility';

/**
 * Retrieves a user from the database based on the provided username.
 *
 * @param username - The username of the user to retrieve.
 * @returns A Promise that resolves to the retrieved User object, or null if the user does not exist.
 */
async function getUserFromDatabase(username: string): Promise<User | null> {
	const [user] = await database
		.select()
		.from(schema.users)
		.where(eq(schema.users.username, username))
		.limit(1);

	if (!user) {
		return null;
	}

	return user;
}

/**
 * Builds a session token for the given user.
 *
 * @param user - The user object.
 * @returns The session token.
 */
function buildSessionToken(user: User): string {
	const payload: Partial<Session> = {
		role: user.role,
		userId: user.id,
		username: user.username,
		name: user.name,
	};
	const token = sign(payload);

	return token;
}

/**
 * Authenticates a user by logging them in.
 *
 * @param request - The login request containing user credentials.
 * @returns A promise that resolves to a ServiceResponse object containing a session token on success, or an error on failure.
 */
export async function loginUser(
	request: NewLogin,
): Promise<ServiceResponse<string, NewLogin>> {
	try {
		const schemaValidation = newLoginValidator.safeParse(request);

		if (!schemaValidation.success) {
			throw new InvalidNewLoginError(
				getErrorsFromZodError(schemaValidation.error),
			);
		}

		const credentials = schemaValidation.data;

		const user = await getUserFromDatabase(credentials.username);

		if (!user) {
			throw new UserNotFoundError();
		}

		const isPasswordValid = await comparePassword(
			credentials.password,
			user.password,
		);

		if (!isPasswordValid) {
			throw new InvalidPasswordError();
		}

		const token = buildSessionToken(user);

		return {
			type: ResponseType.Success,
			code: 200,
			data: token,
		};
	} catch (error) {
		if (isAppError<NewLogin>(error)) {
			return error.toServiceResponse();
		}

		return handleUnknownError({
			error: error,
			stack: 'auth/loginUser',
			additionalInfo: { request },
		});
	}
}

/**
 * Retrieves a session from a token.
 *
 * @param token - The token to decode and retrieve the session from.
 * @returns A promise that resolves to a ServiceResponse containing the session data.
 */
export async function getSessionFromToken(
	token: string,
): Promise<ServiceResponse<Session, BasicErrorPayload>> {
	try {
		const session = decode<Session>(token);

		if (session === null) {
			throw new InvalidTokenError();
		}

		return {
			type: ResponseType.Success,
			code: SuccessCode.Ok,
			data: session,
		};
	} catch (error) {
		if (isAppError<BasicErrorPayload>(error)) {
			return error.toServiceResponse();
		}

		return await handleUnknownError({
			error,
			stack: 'auth/getSessionFromToken',
			additionalInfo: { token },
		});
	}
}
