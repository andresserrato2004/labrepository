import type { NewClassroom } from '@database/types';
import type { TypedResponse } from '@remix-run/node';
import type {
	ClientErrorResponse,
	NoContent,
	SuccessResponse,
} from '@services/server/types';

import { newClassroomFormValidator } from '@database/validators';
import { createClassroom } from '@services/server/classrooms';
import { getSessionFromRequest, parseFormData } from '@services/server/utility';
import {
	ClientErrorCode,
	ResponseType,
	RouteActionHandler,
	createBasicResponse,
	createResponse,
	createServerErrorResponse,
	getErrorsFromZodError,
} from '@services/shared/utility';

/**
 * @class FormDataClassroomHandler
 * @extends RouteActionHandler<NewClassroom>
 *
 * Handles HTTP requests related to classroom form data.
 */
export class FormDataClassroomHandler extends RouteActionHandler<NewClassroom> {
	async handlePostRequest(
		request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<NewClassroom>
		>
	> {
		const session = await getSessionFromRequest(request, true);

		if (!session) {
			throw createBasicResponse(
				'Method not allowed',
				ClientErrorCode.MethodNotAllowed,
			);
		}

		const formData = await parseFormData(
			request,
			newClassroomFormValidator,
		);

		if (!formData) {
			throw createBasicResponse(
				'Invalid form data.',
				ClientErrorCode.BadRequest,
			);
		}

		if (!formData.success) {
			return createResponse({
				code: ClientErrorCode.BadRequest,
				type: ResponseType.ClientError,
				errors: getErrorsFromZodError(formData.error),
			});
		}

		const createClassroomResponse = await createClassroom({
			request: formData.data,
			session: session,
		});

		if (createClassroomResponse.type === ResponseType.ServerError) {
			throw createServerErrorResponse(createClassroomResponse);
		}

		return createResponse(createClassroomResponse);
	}
	handlePatchRequest(
		_request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<NewClassroom>
		>
	> {
		throw new Error('Method not implemented.');
	}
	handleDeleteRequest(
		_request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<NewClassroom>
		>
	> {
		throw new Error('Method not implemented.');
	}
}
