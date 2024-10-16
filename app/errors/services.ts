import type { NewLogin, NewUser, UpdateUser } from '@database/types';
import type {
	BasicErrorPayload,
	ClientErrorResponse,
	Errors,
} from '@services/server/types';

import { ClientErrorCode, ResponseType } from '@services/shared/utility';

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
 * Represents an error that occurs when an invalid token is encountered.
 */
export class InvalidTokenError extends AppError<BasicErrorPayload> {
	constructor() {
		const errors = {
			message: 'Invalid token',
		};
		super('Invalid token.', errors, ClientErrorCode.Unauthorized);
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

		super('Invalid password.', errors, ClientErrorCode.Unauthorized);
	}
}

/**
 * Represents an error that occurs when attempting to create a new user with invalid data.
 * @extends AppError<NewUser>
 */
export class InvalidNewUserError extends AppError<NewUser> {
	constructor(errors: Errors<NewUser>) {
		super('Invalid user data.', errors, ClientErrorCode.BadRequest);
	}
}

/**
 * Represents an error that when attempting to update a user with invalid data.
 * @extends AppError<UpdateUser>
 */
export class InvalidUpdateUserError extends AppError<UpdateUser> {
	constructor(errors: Errors<NewUser>) {
		super('Invalid user data.', errors, ClientErrorCode.BadRequest);
	}
}

/**
 * Represents an error that occurs when a user conflict is detected.
 * @extends AppError<NewUser>
 */
export class UserConflictError extends AppError<NewUser> {
	constructor(errors: Errors<NewUser>) {
		super('User already exists.', errors, ClientErrorCode.Conflict);
	}
}

/**
 * Represents an error that occurs when attempting to create a new classroom with invalid data.
 * Extends the `AppError` class with a specific type of `NewUser`.
 *
 * @class InvalidNewClassroomError
 * @extends {AppError<NewUser>}
 * @param {Errors<NewUser>} errors - The validation errors associated with the new classroom data.
 */
export class InvalidNewClassroomError extends AppError<NewUser> {
	constructor(errors: Errors<NewUser>) {
		super('Invalid classroom data.', errors, ClientErrorCode.BadRequest);
	}
}

/**
 * Represents an error that occurs when a classroom conflict is detected.
 * Extends the `AppError` class with a specific type of `NewUser`.
 *
 * @class ClassroomConflictError
 * @extends {AppError<NewUser>}
 * @param {Errors<NewUser>} errors - The validation errors associated with the new classroom data.
 */
export class ClassroomConflictError extends AppError<NewUser> {
	constructor(errors: Errors<NewUser>) {
		super('Classroom already exists.', errors, ClientErrorCode.Conflict);
	}
}

/**
 * Represents an error that occurs when attempting to create a new academic period with invalid data.
 * Extends the `AppError` class with a specific type of `NewUser`.
 *
 * @class InvalidNewAcademicPeriodError
 * @extends {AppError<NewUser>}
 * @param {Errors<NewUser>} errors - The validation errors associated with the new academic period data.
 */
export class InvalidNewAcademicPeriodError extends AppError<NewUser> {
	constructor(errors: Errors<NewUser>) {
		super(
			'Invalid academic period data.',
			errors,
			ClientErrorCode.BadRequest,
		);
	}
}

/**
 * Error class representing a conflict when an academic period already exists.
 * Extends the `AppError` class with a specific error message and client error code.
 *
 * @template NewUser - The type of the user associated with the error.
 * @extends {AppError<NewUser>}
 */
export class AcademicPeriodConflictError extends AppError<NewUser> {
	constructor(errors: Errors<NewUser>) {
		super(
			'Academic period already exists.',
			errors,
			ClientErrorCode.Conflict,
		);
	}
}

/**
 * Represents an error that occurs when attempting to create a new reservation with invalid data.
 * Extends the `AppError` class with a specific type of `NewUser`.
 *
 * @class InvalidNewReservationError
 * @extends {AppError<NewUser>}
 * @param {Errors<NewUser>} errors - The validation errors associated with the new reservation data.
 */
export class InvalidNewReservationError extends AppError<NewUser> {
	constructor(errors: Errors<NewUser>) {
		super('Invalid reservation data.', errors, ClientErrorCode.BadRequest);
	}
}

/**
 * Represents an error that occurs when a reservation conflict is detected.
 * This error is thrown when an attempt is made to create a reservation that already exists.
 *
 * @extends {AppError<NewUser>}
 */
export class ReservationConflictError extends AppError<NewUser> {
	constructor(errors: Errors<NewUser>) {
		super('Reservation already exists.', errors, ClientErrorCode.Conflict);
	}
}
