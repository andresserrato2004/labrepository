import type {
	DeleteReservation,
	ExtendedReservation,
	NewReservation,
	Reservation,
	UpdateReservation,
} from '@database/types';
import type { DateValue } from '@internationalized/date';
import type {
	DeleteReservationArgs,
	Errors,
	NoContent,
	ServiceResponse,
	UpdateReservationArgs,
} from '@services/server/types';
import type { CreateReservationArgs } from '@services/server/types';

import { and, database, eq, gt, lt, or, schema } from '@database';
import { AppResource } from '@database/schema/enums';
import {
	deleteReservationValidator,
	newReservationValidator,
	updateReservationValidator,
} from '@database/validators';
import {
	InvalidNewReservationError,
	InvalidUpdateReservationError,
	ReservationConflictError,
} from '@errors/services';
import { parseAbsoluteToLocal } from '@internationalized/date';
import {
	buildCreationAuditLog,
	buildDeletionAuditLog,
	buildUpdateAuditLog,
	handleUnknownError,
} from '@services/server/utility';
import { getMonday } from '@services/shared/dates';
import {
	ResponseType,
	SuccessCode,
	getErrorsFromZodError,
	isAppError,
} from '@services/shared/utility';
import { getTableColumns } from 'drizzle-orm';

import dayjs from 'dayjs';

const extendedReservationColumns = {
	...getTableColumns(schema.reservations),
	classroom: {
		id: schema.classrooms.id,
		name: schema.classrooms.name,
	},
	user: {
		id: schema.users.id,
		name: schema.users.name,
	},
};

async function getCurrentPeriod() {
	const now = new Date();
	const currentPeriod = await database
		.select()
		.from(schema.academicPeriods)
		.where(
			and(
				lt(schema.academicPeriods.startDate, now.toISOString()),
				gt(schema.academicPeriods.endDate, now.toISOString()),
			),
		);

	if (currentPeriod.length === 0) {
		return null;
	}

	return currentPeriod[0];
}

async function checkForConflictingReservation(
	reservation: NewReservation,
): Promise<Errors<NewReservation> | null> {
	const reservations = await database
		.select()
		.from(schema.reservations)
		.where(
			and(
				eq(schema.reservations.classroomId, reservation.classroomId),
				or(
					and(
						gt(
							schema.reservations.startTime,
							reservation.startTime,
						),
						lt(schema.reservations.startTime, reservation.endTime),
					),
					and(
						gt(schema.reservations.endTime, reservation.startTime),
						lt(schema.reservations.endTime, reservation.endTime),
					),
					and(
						eq(
							schema.reservations.startTime,
							reservation.startTime,
						),
						eq(schema.reservations.endTime, reservation.endTime),
					),
				),
			),
		);

	const conflictError: Errors<NewReservation> = {};

	if (reservations.length === 0) {
		return null;
	}

	if (reservations.length === 1 && reservations[0].id === reservation.id) {
		return null;
	}

	const startTime = dayjs(reservations[0].startTime).format('MMMM DD, HH:mm');
	const endTime = dayjs(reservations[0].endTime).format('HH:mm');
	const course = reservations[0].course;

	const message = `Classroom is already reserved on ${startTime} - ${endTime} to ${course}`;
	conflictError.classroomId = message;
	conflictError.startTime = message;
	conflictError.endTime = message;

	return conflictError;
}

async function getExistingReservation(
	reservation: NewReservation | UpdateReservation,
): Promise<Reservation | null> {
	const existingReservation = await database
		.select()
		.from(schema.reservations)
		.where(eq(schema.reservations.id, reservation.id ?? ''));

	if (existingReservation.length === 0) {
		return null;
	}

	return existingReservation[0];
}
/**
 * Retrieves all reservations with their corresponding classrooms.
 *
 * @returns A promise that resolves to a ServiceResponse containing an array of ExtendedReservation objects.
 */
export async function getAllReservations(): Promise<
	ServiceResponse<ExtendedReservation[]>
> {
	try {
		const reservations = await database
			.select(extendedReservationColumns)
			.from(schema.reservations)
			.innerJoin(
				schema.classrooms,
				eq(schema.reservations.classroomId, schema.classrooms.id),
			)
			.innerJoin(
				schema.users,
				eq(schema.reservations.userId, schema.users.id),
			);

		return {
			type: ResponseType.Success,
			code: SuccessCode.Ok,
			data: reservations,
		};
	} catch (error) {
		return handleUnknownError({
			error: error,
			stack: 'reservations/getAllReservations',
		});
	}
}

/**
 * Retrieves classroom reservations grouped by classroom.
 *
 * @returns A promise that resolves to a ServiceResponse containing a record of classroom reservations.
 */
export async function getClassroomReservations(): Promise<
	ServiceResponse<Record<string, ExtendedReservation[]>>
> {
	try {
		const reservationsQuery = database
			.select(extendedReservationColumns)
			.from(schema.reservations)
			.innerJoin(
				schema.classrooms,
				eq(schema.reservations.classroomId, schema.classrooms.id),
			)
			.innerJoin(
				schema.users,
				eq(schema.reservations.userId, schema.users.id),
			);

		const classroomsQuery = database.select().from(schema.classrooms);

		const [reservations, classrooms] = await Promise.all([
			reservationsQuery,
			classroomsQuery,
		]);

		const groupedReservations: Record<string, ExtendedReservation[]> =
			classrooms.reduce(
				(acc, classroom) => {
					acc[classroom.id] = reservations.filter(
						(reservation) =>
							reservation.classroomId === classroom.id,
					);

					return acc;
				},
				{} as Record<string, ExtendedReservation[]>,
			);

		return {
			type: ResponseType.Success,
			code: SuccessCode.Ok,
			data: groupedReservations,
		};
	} catch (error) {
		return handleUnknownError({
			error: error,
			stack: 'reservations/getAllReservationsGroupedByClassroom',
		});
	}
}

function getWeekFromDate(currentPeriod: DateValue, queryDate: DateValue) {
	const currentPeriodStartOfWeek = getMonday(currentPeriod);
	const queryDateStartOfWeek = getMonday(queryDate);

	const week =
		Math.floor(
			queryDateStartOfWeek.compare(currentPeriodStartOfWeek) /
				1000 /
				60 /
				60 /
				24 /
				7,
		) + 1;

	return week;
}

async function buildReservations(reservation: NewReservation) {
	const reservations: NewReservation[] = [];

	if (!reservation.repeatOnWeeks || reservation.repeatOnWeeks.length === 0) {
		reservations.push(reservation);

		return reservations;
	}

	const currentPeriod = await getCurrentPeriod();

	if (!currentPeriod) {
		throw new Error('No current period found');
	}

	const currentPeriodStart = parseAbsoluteToLocal(currentPeriod.startDate);
	const queryStartDateValue = parseAbsoluteToLocal(reservation.startTime);
	const queryEndDateValue = parseAbsoluteToLocal(reservation.endTime);
	const week = getWeekFromDate(currentPeriodStart, queryStartDateValue);

	for (const repeatWeek of reservation.repeatOnWeeks) {
		const offset = (repeatWeek > 8 ? repeatWeek + 1 : repeatWeek) - week;

		const newQueryStartDateValue = queryStartDateValue.add({
			weeks: offset,
		});
		const newQueryEndDateValue = queryEndDateValue.add({ weeks: offset });

		reservations.push({
			...reservation,
			repeatOnWeeks: undefined,
			startTime: newQueryStartDateValue.toAbsoluteString(),
			endTime: newQueryEndDateValue.toAbsoluteString(),
		});
	}

	return reservations;
}

/**
 * Creates a new reservation.
 *
 * This function validates the incoming request data against the `newReservationValidator` schema.
 * If the validation fails, it throws an `InvalidNewReservationError` with the validation errors.
 * It then builds the reservations and checks for any conflicting reservations.
 * If a conflict is found, it throws a `ReservationConflictError`.
 *
 * If no conflicts are found, it inserts the reservation data and audit logs into the database
 * within a transaction.
 *
 * @returns A promise that resolves to a service response.
 *
 * @throws {InvalidNewReservationError} - If the request data is invalid.
 * @throws {ReservationConflictError} - If there is a conflicting reservation.
 */
export async function createReservation({
	session,
	request,
}: CreateReservationArgs): Promise<ServiceResponse<NoContent, NewReservation>> {
	try {
		const schemaValidation = newReservationValidator.safeParse(request);

		if (!schemaValidation.success) {
			throw new InvalidNewReservationError(
				getErrorsFromZodError(schemaValidation.error),
			);
		}

		const reservations = await buildReservations(schemaValidation.data);

		for (const reservation of reservations) {
			const conflictError =
				await checkForConflictingReservation(reservation);

			if (conflictError) {
				throw new ReservationConflictError(conflictError);
			}
		}

		await database.transaction(async (trx) => {
			for (const reservation of reservations) {
				await trx.insert(schema.auditLogs).values(
					buildCreationAuditLog({
						session,
						newData: reservation,
						resource: AppResource.Reservations,
					}),
				);

				await trx.insert(schema.reservations).values(reservation);
			}
		});

		return {
			type: ResponseType.Success,
			code: SuccessCode.Created,
			data: null,
		};
	} catch (error) {
		if (isAppError<NewReservation>(error)) {
			return error.toServiceResponse();
		}
		return handleUnknownError({
			error: error,
			additionalInfo: { request, session },
			stack: 'reservations/createReservation',
		});
	}
}

/**
 * Updates an existing reservation.
 *
 * This function validates the incoming request data against the `updateReservationValidator` schema.
 * If the validation fails, it throws an `InvalidUpdateReservationError` with the validation errors.
 * It then retrieves the existing reservation from the database and checks for any conflicting reservations.
 * If a conflict is found, it throws a `ReservationConflictError`.
 *
 * If no conflicts are found, it updates the reservation data and audit logs in the database
 * within a transaction.
 *
 * @returns A promise that resolves to a service response.
 *
 * @throws {InvalidUpdateReservationError} - If the request data is invalid.
 * @throws {ReservationConflictError} - If there is a conflicting reservation.
 */
export async function updateReservation({
	session,
	request,
}: UpdateReservationArgs): Promise<
	ServiceResponse<NoContent, UpdateReservation>
> {
	try {
		const schemaValidation = updateReservationValidator.safeParse(request);

		if (!schemaValidation.success) {
			throw new InvalidUpdateReservationError(
				getErrorsFromZodError(schemaValidation.error),
			);
		}

		const reservation = schemaValidation.data;

		const existingReservation = await getExistingReservation(reservation);

		if (!existingReservation) {
			throw new InvalidUpdateReservationError({
				id: 'Reservation not found',
			});
		}

		const conflictError = await checkForConflictingReservation(reservation);

		if (conflictError) {
			throw new ReservationConflictError(conflictError);
		}

		await database.transaction(async (trx) => {
			await trx.insert(schema.auditLogs).values(
				buildUpdateAuditLog({
					oldData: existingReservation,
					newData: reservation,
					session: session,
					resource: AppResource.Reservations,
				}),
			);

			await trx
				.update(schema.reservations)
				.set(reservation)
				.where(eq(schema.reservations.id, reservation.id));
		});

		return {
			type: ResponseType.Success,
			code: SuccessCode.Ok,
			data: null,
		};
	} catch (error) {
		if (isAppError<UpdateReservation>(error)) {
			return error.toServiceResponse();
		}
		return handleUnknownError({
			error: error,
			additionalInfo: { request, session },
			stack: 'reservations/updateReservation',
		});
	}
}

/**
 * Deletes an existing reservation.
 *
 * This function validates the incoming request data against the `deleteReservationValidator` schema.
 * If the validation fails, it throws an `InvalidUpdateReservationError` with the validation errors.
 * It then retrieves the existing reservation from the database.
 *
 * If the reservation is not found, it throws an `InvalidUpdateReservationError`.
 *
 * If the reservation is found, it deletes the reservation data and audit logs from the database
 * within a transaction.
 *
 * @returns A promise that resolves to a service response.
 *
 * @throws {InvalidUpdateReservationError} - If the request data is invalid.
 */
export async function deleteReservation({
	session,
	request,
}: DeleteReservationArgs): Promise<
	ServiceResponse<NoContent, DeleteReservation>
> {
	try {
		const schemaValidation = deleteReservationValidator.safeParse(request);

		if (!schemaValidation.success) {
			throw new InvalidUpdateReservationError(
				getErrorsFromZodError(schemaValidation.error),
			);
		}

		const reservation = schemaValidation.data;

		const [oldReservation] = await database
			.select()
			.from(schema.reservations)
			.where(eq(schema.reservations.id, reservation.id));

		if (!oldReservation) {
			throw new InvalidUpdateReservationError({
				id: 'Reservation not found',
			});
		}

		await database.transaction(async (trx) => {
			await trx.insert(schema.auditLogs).values(
				buildDeletionAuditLog({
					oldData: oldReservation,
					session: session,
					resource: AppResource.Reservations,
				}),
			);

			await trx
				.delete(schema.reservations)
				.where(eq(schema.reservations.id, reservation.id));
		});

		return {
			type: ResponseType.Success,
			code: SuccessCode.Ok,
			data: null,
		};
	} catch (error) {
		if (isAppError<DeleteReservation>(error)) {
			return error.toServiceResponse();
		}
		return handleUnknownError({
			error: error,
			additionalInfo: { request, session },
			stack: 'reservations/deleteReservation',
		});
	}
}
