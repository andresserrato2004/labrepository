import type { AcademicPeriod, NewAcademicPeriod } from '@database/types';
import type {
	CreateAcademicPeriodsArgs,
	Errors,
	NoContent,
	ServiceResponse,
} from '@services/server/types';

import { newAcademicPeriodValidator } from '@/database/.server/validators';
import { database, schema } from '@database';
import { AppResource } from '@database/schema/enums';
import {
	AcademicPeriodConflictError,
	InvalidNewAcademicPeriodError,
} from '@errors/services';
import {
	buildCreationAuditLog,
	handleUnknownError,
} from '@services/server/utility';
import {
	ResponseType,
	SuccessCode,
	isAppError,
} from '@services/shared/utility';

import dayjs from 'dayjs';

/**
 * Checks if an academic period with the same time interval already exists in the database.
 *
 * @param academicPeriod - The academic period to be checked.
 * @returns A promise that resolves to an object containing errors if an academic period with the same time interval exists, or null if no conflicts are found.
 */
async function checkForExistingAcademicPeriod(
	academicPeriod: NewAcademicPeriod,
): Promise<Errors<NewAcademicPeriod> | null> {
	const academicPeriods = await database
		.select()
		.from(schema.academicPeriods);

	const conflictError: Errors<NewAcademicPeriod> = {};

	if (academicPeriods.length > 0) {
		for (const period of academicPeriods) {
			const intersectLeft =
				dayjs(period.endDate).isAfter(academicPeriod.startDate) &&
				dayjs(period.endDate).isBefore(academicPeriod.endDate);

			const intersectRight =
				dayjs(period.startDate).isAfter(academicPeriod.startDate) &&
				dayjs(period.startDate).isBefore(academicPeriod.endDate);

			if (
				period.startDate === academicPeriod.startDate ||
				intersectLeft
			) {
				conflictError.startDate = 'Academic period interval conflict';
			}

			if (period.endDate === academicPeriod.endDate || intersectRight) {
				conflictError.endDate = 'Academic period interval conflict';
			}
		}

		return conflictError;
	}

	return null;
}
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

/**
 * Checks if an academic period with the same name already exists in the database.
 *
 * @param request - The new academic period request containing the name to be checked.
 * @returns A promise that resolves to an object containing errors if an academic period with the same name exists, or null if no conflicts are found.
 */
export async function createAcademicPeriod({
	request,
	session,
}: CreateAcademicPeriodsArgs): Promise<
	ServiceResponse<NoContent, NewAcademicPeriod>
> {
	try {
		const schemaValidation = newAcademicPeriodValidator.safeParse(request);

		if (!schemaValidation.success) {
			throw new InvalidNewAcademicPeriodError(schemaValidation.error);
		}

		const academicPeriod = schemaValidation.data;
		const conflictError =
			await checkForExistingAcademicPeriod(academicPeriod);

		if (conflictError) {
			throw new AcademicPeriodConflictError(conflictError);
		}

		await database.transaction(async (trx) => {
			await trx.insert(schema.auditLogs).values(
				buildCreationAuditLog({
					session,
					newData: academicPeriod,
					resource: AppResource.AcademicPeriods,
				}),
			);

			await trx.insert(schema.academicPeriods).values(academicPeriod);
		});

		return {
			type: ResponseType.Success,
			code: SuccessCode.Created,
			data: null,
		};
	} catch (error) {
		if (isAppError<NewAcademicPeriod>(error)) {
			return error.toServiceResponse();
		}

		return handleUnknownError({
			error: error,
			additionalInfo: request,
			stack: 'academicPeriods/createAcademicPeriod',
		});
	}
}
