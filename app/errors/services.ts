import type { NewLogin } from '@database/types';
import type { Errors } from '@services/server/types';
import type { ClientErrorResponse } from '@services/server/types';

import { ResponseType } from '@services/server/utility';
import { ClientErrorCode } from '@services/server/utility';

/**
 * Represents an application known error. This error can throw at runtime anywhere in the application
 * services.
 * @template T - The type of errors.
 */
export class AppError<T> extends Error {
	errors: Errors<T>;
	type: ResponseType.ClientError;
	code: ClientErrorCode;

	constructor(message: string, errors: Errors<T>, code: ClientErrorCode) {
		super(message);
		this.name = 'AppError';
		this.errors = errors;
		this.code = code;
		this.type = ResponseType.ClientError;
	}

	toServiceResponse(): ClientErrorResponse<T> {
		return {
			type: this.type,
			code: this.code,
			errors: this.errors,
		};
	}
}

/**
 * Represents an error that occurs when a required environment variable is missing.
 * This error can throw at runtime anywhere in the application.
 */
export class MissingEnvironmentVariableError extends Error {
	constructor(variable: string) {
		super(`Missing environment variable: ${variable}`);
		this.name = 'MissingEnvironmentVariableError';
	}
}

/**
 * Represents an error that occurs when the login credentials are invalid.
 * @extends AppError<NewLogin>
 */
export class InvalidNewLoginError extends AppError<NewLogin> {
	constructor(errors: Errors<NewLogin>) {
		super('Invalid login credentials.', errors, ClientErrorCode.BadRequest);
	}
}

/**
 * Represents an error that occurs when a user is not found.
 */
export class UserNotFoundError extends AppError<NewLogin> {
	constructor() {
		const errors = {
			username: 'User not found',
		};

		super('User not found.', errors, ClientErrorCode.NotFound);
	}
}

/**
 * Represents an error that occurs when an invalid password is provided.
 * @extends AppError<NewLogin>
 */
export class InvalidPasswordError extends AppError<NewLogin> {
	constructor() {
		const errors = {
			password: 'Password is incorrect',
		};

		super('Invalid password.', errors, ClientErrorCode.BadRequest);
	}
}
