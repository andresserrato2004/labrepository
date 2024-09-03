import type { Reservation } from '@database/types';
import type { ServiceResponse } from '@services/server/types';

import { database, schema } from '@database';
import { handleUnknownError } from '@services/server/utility';
import { ResponseType, SuccessCode } from '@services/shared/utility';

export async function getAllReservations(): Promise<
	ServiceResponse<Reservation[]>
> {
	try {
		const reservations = await database.select().from(schema.reservations);

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
