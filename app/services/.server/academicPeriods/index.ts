import type {
	AcademicPeriod,
	NewAcademicPeriod,
	UpdateAcademicPeriod,
} from '@database/types';
import type {
	CreateAcademicPeriodsArgs,
	Errors,
	NoContent,
	ServiceResponse,
	UpdateAcademicPeriodArgs,
} from '@services/server/types';

import { database, eq, schema } from '@database';
import { AppResource } from '@database/schema/enums';
import {
	newAcademicPeriodValidator,
	updateAcademicPeriodValidator,
} from '@database/validators';
import {
	AcademicPeriodConflictError,
	InvalidNewAcademicPeriodError,
	InvalidUpdateAcademicPeriodError,
} from '@errors/services';
import {
	buildCreationAuditLog,
	buildUpdateAuditLog,
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
 * @param request - The academic period to be checked.
 * @returns A promise that resolves to an object containing errors if an academic period with the same time interval exists, or null if no conflicts are found.
 */
async function checkForExistingAcademicPeriod<
	T extends NewAcademicPeriod | UpdateAcademicPeriod,
>(request: T): Promise<Errors<T> | null> {
	const academicPeriods = await database
		.select()
		.from(schema.academicPeriods);

	const conflictError: Errors<T> = {};

	console.log({ request, academicPeriods });

	if (academicPeriods.length === 0) {
		return null;
	}

	if (academicPeriods.length === 1 && academicPeriods[0].id === request.id) {
		return null;
	}

	for (const period of academicPeriods) {
		if (period.id === request.id) {
			continue;
		}

		const parsedStartDate = dayjs(request.startDate);
		const parsedEndDate = dayjs(request.endDate);

		const intersectLeft =
			parsedStartDate.isAfter(period.startDate) &&
			parsedStartDate.isBefore(period.endDate);

		const intersectRight =
			parsedEndDate.isAfter(period.startDate) &&
			parsedEndDate.isBefore(period.endDate);

		if (parsedStartDate.isSame(period.startDate, 'day') || intersectLeft) {
			conflictError.startDate = `Conflicts with period ${period.name}`;
		}

		if (parsedEndDate.isSame(period.endDate, 'day') || intersectRight) {
			conflictError.endDate = `Conflicts with period ${period.name}`;
		}

		if (request.name === period.name) {
			conflictError.name =
				'Academic period with this name already exists';
		}
	}

	if (Object.keys(conflictError).length === 0) {
		return null;
	}

	return conflictError;
}

/**
 * Retrieves an academic period from the database using the provided ID.
 *
 * @param academicPeriod - The academic period to be retrieved.
 * @returns A promise that resolves to an object containing the academic period if it exists, or null if no academic period is found.
 */
async function getExistingAcademicPeriod(
	academicPeriod: NewAcademicPeriod | UpdateAcademicPeriod,
): Promise<AcademicPeriod | null> {
	const existingPeriod = await database
		.select()
		.from(schema.academicPeriods)
		.where(eq(schema.academicPeriods.id, academicPeriod.id ?? ''));

	if (existingPeriod.length === 0) {
		return null;
	}

	return existingPeriod[0];
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
			additionalInfo: { request, session },
			stack: 'academicPeriods/createAcademicPeriod',
		});
	}
}

/**
 * Updates an academic period in the database.
 *
 * @param request - The academic period to be updated.
 * @returns A promise that resolves to a ServiceResponse containing a NoContent object.
 */
export async function updateAcademicPeriod({
	request,
	session,
}: UpdateAcademicPeriodArgs): Promise<
	ServiceResponse<NoContent, UpdateAcademicPeriod>
> {
	try {
		const schemaValidation =
			updateAcademicPeriodValidator.safeParse(request);

		if (!schemaValidation.success) {
			throw new InvalidUpdateAcademicPeriodError(schemaValidation.error);
		}

		const academicPeriod = schemaValidation.data;

		const existingPeriod = await getExistingAcademicPeriod(academicPeriod);

		if (!existingPeriod) {
			throw new InvalidUpdateAcademicPeriodError({
				id: 'Academic period not found',
			});
		}

		const conflictError =
			await checkForExistingAcademicPeriod(academicPeriod);

		if (conflictError) {
			console.log('conflictError', conflictError);

			throw new AcademicPeriodConflictError(conflictError);
		}

		await database.transaction(async (trx) => {
			await trx.insert(schema.auditLogs).values(
				buildUpdateAuditLog({
					oldData: existingPeriod,
					newData: academicPeriod,
					session: session,
					resource: AppResource.AcademicPeriods,
				}),
			);

			await trx
				.update(schema.academicPeriods)
				.set(academicPeriod)
				.where(eq(schema.academicPeriods.id, academicPeriod.id));
		});

		return {
			type: ResponseType.Success,
			code: SuccessCode.Ok,
			data: null,
		};
	} catch (error) {
		if (isAppError<UpdateAcademicPeriod>(error)) {
			return error.toServiceResponse();
		}

		return handleUnknownError({
			error,
			additionalInfo: { request, session },
			stack: 'academicPeriods/updateAcademicPeriod',
		});
	}
}
