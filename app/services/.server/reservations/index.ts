import type { ExtendedReservation } from '@database/types';
import type { ServiceResponse } from '@services/server/types';

import { database, eq, schema } from '@database';
import { handleUnknownError } from '@services/server/utility';
import { ResponseType, SuccessCode } from '@services/shared/utility';
import { getTableColumns } from 'drizzle-orm';

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
