import type { NewAcademicPeriod, UpdateAcademicPeriod } from '@database/types';
import type { TypedResponse } from '@remix-run/node';
import type {
	ClientErrorResponse,
	NoContent,
	SuccessResponse,
} from '@services/server/types';

import {
	newAcademicPeriodFormValidator,
	updateAcademicPeriodFormValidator,
} from '@database/validators';
import {
	createAcademicPeriod,
	updateAcademicPeriod,
} from '@services/server/academicPeriods';
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
 * @class FormDataAcademicPeriodHandler
 * @extends RouteActionHandler<NewAcademicPeriod>
 *
 * Handles HTTP requests related to academic periods form data.
 */
export class FormDataAcademicPeriodHandler extends RouteActionHandler<NewAcademicPeriod> {
	async handlePostRequest(
		request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<NewAcademicPeriod>
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
			newAcademicPeriodFormValidator,
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

		const createAcademicPeriodResponse = await createAcademicPeriod({
			request: formData.data,
			session: session,
		});

		if (createAcademicPeriodResponse.type === ResponseType.ServerError) {
			throw createServerErrorResponse(createAcademicPeriodResponse);
		}

		return createResponse(createAcademicPeriodResponse);
	}
	async handlePatchRequest(
		request: Request,
	): Promise<
		TypedResponse<
			| SuccessResponse<NoContent>
			| ClientErrorResponse<UpdateAcademicPeriod>
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
			updateAcademicPeriodFormValidator,
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

		const updateAcademicPeriodResponse = await updateAcademicPeriod({
			request: formData.data,
			session: session,
		});

		if (updateAcademicPeriodResponse.type === ResponseType.ServerError) {
			throw createServerErrorResponse(updateAcademicPeriodResponse);
		}

		return createResponse(updateAcademicPeriodResponse);
	}
	handleDeleteRequest(
		_request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<NewAcademicPeriod>
		>
	> {
		throw new Error('Method not implemented.');
	}
}
