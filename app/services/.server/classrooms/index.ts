import type { Classroom, NewClassroom, UpdateClassroom } from '@database/types';
import type {
	Errors,
	NoContent,
	ServiceResponse,
} from '@services/server/types';
import type {
	CreateClassroomArgs,
	UpdateClassroomArgs,
} from '@services/server/types';

import { database, eq, schema } from '@database';
import { AppResource } from '@database/schema/enums';
import {
	newClassroomValidator,
	updateClassroomValidator,
} from '@database/validators';
import {
	ClassroomConflictError,
	InvalidNewClassroomError,
	InvalidUpdateClassroomError,
} from '@errors/services';
import {
	buildCreationAuditLog,
	buildUpdateAuditLog,
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
async function checkForExistingClassroom<
	T extends NewClassroom | UpdateClassroom,
>(request: T): Promise<Errors<T> | null> {
	const classrooms = await database
		.select()
		.from(schema.classrooms)
		.where(eq(schema.classrooms.name, request.name));

	const conflictError: Errors<T> = {};

	if (classrooms.length === 0) {
		return null;
	}

	if (classrooms.length === 1 && classrooms[0].id === request.id) {
		return null;
	}

	for (const classroom of classrooms) {
		if (classroom.name === request.name) {
			conflictError.name = 'Classroom already exists';
		}
	}

	return conflictError;
}

/**
 * Retrieves a classroom from the database.
 *
 * @param id - The ID of the classroom to retrieve.
 * @returns A promise that resolves to a ServiceResponse containing the Classroom object.
 */
async function getExistingClassroom(
	request: UpdateClassroom | NewClassroom,
): Promise<Classroom | null> {
	const classroom = await database
		.select()
		.from(schema.classrooms)
		.where(eq(schema.classrooms.id, request.id ?? ''));

	if (classroom.length === 0) {
		return null;
	}

	return classroom[0];
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
			additionalInfo: { request, session },
		});
	}
}

/**
 * Updates an existing classroom.
 *
 * This function validates the provided request data against the `updateClassroomValidator` schema.
 *
 * @param {UpdateClassroomArgs} args - The arguments for updating a classroom, including the request data and session information.
 * @returns A promise that resolves to a service response indicating the result of the operation.
 */
export async function updateClassroom({
	request,
	session,
}: UpdateClassroomArgs): Promise<ServiceResponse<NoContent, UpdateClassroom>> {
	try {
		const schemaValidation = updateClassroomValidator.safeParse(request);

		if (!schemaValidation.success) {
			throw new InvalidUpdateClassroomError(
				getErrorsFromZodError(schemaValidation.error),
			);
		}

		const classroom = schemaValidation.data;

		const existingClassroom = await getExistingClassroom(classroom);

		if (!existingClassroom) {
			throw new ClassroomConflictError({
				id: 'Classroom id not found',
			});
		}

		const conflictError = await checkForExistingClassroom(classroom);

		if (conflictError) {
			throw new ClassroomConflictError(conflictError);
		}

		await database.transaction(async (trx) => {
			await trx.insert(schema.auditLogs).values(
				buildUpdateAuditLog({
					oldData: existingClassroom,
					newData: classroom,
					session: session,
					resource: AppResource.Classrooms,
				}),
			);

			await trx
				.update(schema.classrooms)
				.set(classroom)
				.where(eq(schema.classrooms.id, existingClassroom.id));
		});

		return {
			type: ResponseType.Success,
			code: SuccessCode.Ok,
			data: null,
		};
	} catch (error) {
		if (isAppError<UpdateClassroom>(error)) {
			return error.toServiceResponse();
		}

		return handleUnknownError({
			error,
			stack: 'classrooms/updateClassroom',
			additionalInfo: { request, session },
		});
	}
}
