import type { NewReservation, UpdateReservation } from '@database/types';
import type { TypedResponse } from '@remix-run/node';
import type {
	ClientErrorResponse,
	NoContent,
	SuccessResponse,
} from '@services/server/types';

import {
	newReservationFormValidator,
	updateReservationFormValidator,
} from '@database/validators';
import {
	createReservation,
	updateReservation,
} from '@services/server/reservations';
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
 * @class FormDataReservationHandler
 * @extends RouteActionHandler<NewReservation>
 *
 * Handles HTTP requests related to reservations form data.
 */
export class FormDataReservationHandler extends RouteActionHandler<NewReservation> {
	async handlePostRequest(
		request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<NewReservation>
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
			newReservationFormValidator,
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

		const createReservationResponse = await createReservation({
			request: formData.data,
			session: session,
		});

		if (createReservationResponse.type === ResponseType.ServerError) {
			throw createServerErrorResponse(createReservationResponse);
		}

		return createResponse(createReservationResponse);
	}

	async handlePatchRequest(
		request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<UpdateReservation>
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
			updateReservationFormValidator,
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

		const updateReservationResponse = await updateReservation({
			request: formData.data,
			session: session,
		});

		if (updateReservationResponse.type === ResponseType.ServerError) {
			throw createServerErrorResponse(updateReservationResponse);
		}

		return createResponse(updateReservationResponse);
	}
	handleDeleteRequest(
		_request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<NewReservation>
		>
	> {
		throw new Error('Method not implemented.');
	}
}
