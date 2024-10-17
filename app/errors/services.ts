import type {
	AcademicPeriod,
	Classroom,
	NewClassroom,
	NewLogin,
	NewReservation,
	NewUser,
	Reservation,
	UpdateClassroom,
	UpdateReservation,
	UpdateUser,
} from '@database/types';
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
 * Extends the `AppError` class with a specific type of `NewClassroom`.
 *
 * @class InvalidNewClassroomError
 * @extends {AppError<NewClassroom>}
 * @param {Errors<NewClassroom>} errors - The validation errors associated with the new classroom data.
 */
export class InvalidNewClassroomError extends AppError<NewClassroom> {
	constructor(errors: Errors<NewClassroom>) {
		super('Invalid classroom data.', errors, ClientErrorCode.BadRequest);
	}
}

/**
 * Represents an error that occurs when attempting to update a classroom with invalid data.
 * Extends the `AppError` class with a specific type of `UpdateClassroom`.
 *
 * @class InvalidUpdateClassroomError
 * @extends {AppError<UpdateClassroom>}
 * @param {Errors<UpdateClassroom>} errors - The validation errors associated with the new classroom data.
 */
export class InvalidUpdateClassroomError extends AppError<UpdateClassroom> {
	constructor(errors: Errors<UpdateClassroom>) {
		super('Invalid classroom data.', errors, ClientErrorCode.BadRequest);
	}
}

/**
 * Represents an error that occurs when a classroom conflict is detected.
 * Extends the `AppError` class with a specific type of `Classroom`.
 *
 * @class ClassroomConflictError
 * @extends {AppError<Classroom>}
 * @param {Errors<Classroom>} errors - The validation errors associated with the new classroom data.
 */
export class ClassroomConflictError extends AppError<Classroom> {
	constructor(errors: Errors<Classroom>) {
		super('Classroom already exists.', errors, ClientErrorCode.Conflict);
	}
}

/**
 * Represents an error that occurs when attempting to create a new academic period with invalid data.
 * Extends the `AppError` class with a specific type of `AcademicPeriod`.
 *
 * @class InvalidNewAcademicPeriodError
 * @extends {AppError<AcademicPeriod>}
 * @param {Errors<AcademicPeriod>} errors - The validation errors associated with the new academic period data.
 */
export class InvalidNewAcademicPeriodError extends AppError<AcademicPeriod> {
	constructor(errors: Errors<AcademicPeriod>) {
		super(
			'Invalid academic period data.',
			errors,
			ClientErrorCode.BadRequest,
		);
	}
}

/**
 * Represents an error that occurs when attempting to update an academic period with invalid data.
 * Extends the `AppError` class with a specific type of `AcademicPeriod`.
 *
 * @class InvalidUpdateAcademicPeriodError
 * @extends {AppError<AcademicPeriod>}
 * @param {Errors<AcademicPeriod>} errors - The validation errors associated with the new academic period data.
 */
export class InvalidUpdateAcademicPeriodError extends AppError<AcademicPeriod> {
	constructor(errors: Errors<AcademicPeriod>) {
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
 * @template AcademicPeriod - The type of the user associated with the error.
 * @extends {AppError<AcademicPeriod>}
 */
export class AcademicPeriodConflictError extends AppError<AcademicPeriod> {
	constructor(errors: Errors<AcademicPeriod>) {
		super(
			'Academic period already exists.',
			errors,
			ClientErrorCode.Conflict,
		);
	}
}

/**
 * Represents an error that occurs when attempting to create a new reservation with invalid data.
 * Extends the `AppError` class with a specific type of `NewReservation`.
 *
 * @class InvalidNewReservationError
 * @extends {AppError<NewReservation>}
 * @param {Errors<NewReservation>} errors - The validation errors associated with the new reservation data.
 */
export class InvalidNewReservationError extends AppError<NewReservation> {
	constructor(errors: Errors<NewReservation>) {
		super('Invalid reservation data.', errors, ClientErrorCode.BadRequest);
	}
}

/**
 * Represents an error that occurs when attempting to update a reservation with invalid data.
 * Extends the `AppError` class with a specific type of `UpdateReservation`.
 *
 * @class InvalidUpdateReservationError
 * @extends {AppError<UpdateReservation>}
 * @param {Errors<UpdateReservation>} errors - The validation errors associated with the updated reservation data.
 */
export class InvalidUpdateReservationError extends AppError<UpdateReservation> {
	constructor(errors: Errors<UpdateReservation>) {
		super('Invalid reservation data.', errors, ClientErrorCode.BadRequest);
	}
}
/**
 * Represents an error that occurs when a reservation conflict is detected.
 * This error is thrown when an attempt is made to create a reservation that already exists.
 *
 * @extends {AppError<Reservation>}
 */
export class ReservationConflictError extends AppError<Reservation> {
	constructor(errors: Errors<Reservation>) {
		super('Reservation already exists.', errors, ClientErrorCode.Conflict);
	}
}
