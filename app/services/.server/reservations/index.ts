import type { ExtendedReservation, NewReservation } from '@database/types';
import type {
	Errors,
	NoContent,
	ServiceResponse,
} from '@services/server/types';
import type { CreateReservationArgs } from '@services/server/types';

import { newReservationValidator } from '@/database/.server/validators';
import { and, database, eq, gt, lt, schema } from '@database';
import { AppResource } from '@database/schema/enums';
import {
	InvalidNewReservationError,
	ReservationConflictError,
} from '@errors/services';
import {
	buildCreationAuditLog,
	handleUnknownError,
} from '@services/server/utility';
import {
	ResponseType,
	SuccessCode,
	getErrorsFromZodError,
	isAppError,
} from '@services/shared/utility';
import { getTableColumns, or } from 'drizzle-orm';

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

async function checkForExistingReservation(
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

	if (reservations.length > 0) {
		conflictError.classroomId = 'Classroom is already reserved';
		conflictError.startTime = 'Classroom is already reserved';
		conflictError.endTime = 'Classroom is already reserved';

		return conflictError;
	}

	return null;
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

		const reservation = schemaValidation.data;
		const conflictError = await checkForExistingReservation(reservation);

		if (conflictError) {
			throw new ReservationConflictError(conflictError);
		}

		await database.transaction(async (trx) => {
			await trx.insert(schema.auditLogs).values(
				buildCreationAuditLog({
					session,
					newData: reservation,
					resource: AppResource.Reservations,
				}),
			);

			await trx.insert(schema.reservations).values(reservation);
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
			additionalInfo: { request: request, session: session },
			stack: 'reservations/createReservation',
		});
	}
}
