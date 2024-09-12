import type { Classroom } from '@database/types';
import type { ServiceResponse } from '@services/server/types';

import { database, schema } from '@database';
import { handleUnknownError } from '@services/server/utility';
import { ResponseType, SuccessCode } from '@services/shared/utility';

/**
 * Retrieves all classrooms from the database.
 *
 * @returns A promise that resolves to a ServiceResponse containing an array of Classroom objects.
 */
export async function getAllClassrooms(): Promise<
	ServiceResponse<Classroom[]>
> {
	try {
		const classrooms = await database.select().from(schema.classrooms);

		return {
			code: SuccessCode.Ok,
			type: ResponseType.Success,
			data: classrooms,
		};
	} catch (error) {
		return handleUnknownError({
			error: error,
			additionalInfo: {},
			stack: 'classrooms/getAllClassrooms',
		});
	}
}
