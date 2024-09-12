import type { AcademicPeriod } from '@database/types';
import type { ServiceResponse } from '@services/server/types';

import { database, schema } from '@database';
import { handleUnknownError } from '@services/server/utility';
import { ResponseType, SuccessCode } from '@services/shared/utility';

/**
 * Retrieves all academic periods from the database.
 *
 * @returns A promise that resolves to a ServiceResponse containing an array of AcademicPeriod objects.
 */
export async function getAllAcademicPeriods(): Promise<
	ServiceResponse<AcademicPeriod[]>
> {
	try {
		const academicPeriods = await database
			.select()
			.from(schema.academicPeriods);

		return {
			code: SuccessCode.Ok,
			type: ResponseType.Success,
			data: academicPeriods,
		};
	} catch (error) {
		return handleUnknownError({
			error: error,
			additionalInfo: {},
			stack: 'academicPeriods/getAllAcademicPeriods',
		});
	}
}
