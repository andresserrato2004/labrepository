import type { Classroom, NewClassroom } from '@database/types';
import type {
	Errors,
	NoContent,
	ServiceResponse,
} from '@services/server/types';
import type { CreateClassroomArgs } from '@services/server/types';

import { database, eq, schema } from '@database';
import { AppResource } from '@database/schema/enums';
import { newClassroomValidator } from '@database/validators';
import {
	ClassroomConflictError,
	InvalidNewClassroomError,
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

/**
 * Checks if a classroom with the same name already exists in the database.
 *
 * @param request - The new classroom request containing the name to be checked.
 * @returns A promise that resolves to an object containing errors if a classroom with the same name exists, or null if no conflicts are found.
 */
async function checkForExistingClassroom(
	request: NewClassroom,
): Promise<Errors<NewClassroom> | null> {
	const classrooms = await database
		.select()
		.from(schema.classrooms)
		.where(eq(schema.classrooms.name, request.name));

	const conflictError: Errors<NewClassroom> = {};

	if (classrooms.length > 0) {
		for (const classroom of classrooms) {
			if (classroom.name === request.name) {
				conflictError.name = 'Classroom already exists';
			}
		}

		return conflictError;
	}

	return null;
}

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

/**
 * Creates a new classroom.
 *
 * This function validates the provided request data against the `newClassroomValidator` schema.
 *
 * @param {CreateClassroomArgs} args - The arguments for creating a classroom, including the request data and session information.
 * @returns A promise that resolves to a service response indicating the result of the operation.
 */
export async function createClassroom({
	request,
	session,
}: CreateClassroomArgs): Promise<ServiceResponse<NoContent, NewClassroom>> {
	try {
		const schemaValidation = newClassroomValidator.safeParse(request);

		if (!schemaValidation.success) {
			throw new InvalidNewClassroomError(
				getErrorsFromZodError(schemaValidation.error),
			);
		}

		const classroom = schemaValidation.data;
		const conflictError = await checkForExistingClassroom(classroom);

		if (conflictError) {
			throw new ClassroomConflictError(conflictError);
		}

		await database.transaction(async (trx) => {
			await trx.insert(schema.auditLogs).values(
				buildCreationAuditLog({
					session,
					newData: classroom,
					resource: AppResource.Classrooms,
				}),
			);

			await trx.insert(schema.classrooms).values(classroom);
		});

		return {
			type: ResponseType.Success,
			code: SuccessCode.Created,
			data: null,
		};
	} catch (error) {
		if (isAppError<NewClassroom>(error)) {
			return error.toServiceResponse();
		}

		return handleUnknownError({
			error: error,
			stack: 'classrooms/createClassroom',
			additionalInfo: { request },
		});
	}
}
