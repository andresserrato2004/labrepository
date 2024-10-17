import type { NewUser, UpdateUser } from '@database/types';
import type { TypedResponse } from '@remix-run/node';
import type {
	ClientErrorResponse,
	NoContent,
	SuccessResponse,
} from '@services/server/types';

import {
	newUserFormValidator,
	updateUserFormValidator,
} from '@database/validators';
import { createUser, updateUser } from '@services/server/users';
import { parseFormData } from '@services/server/utility';
import {
	ClientErrorCode,
	ResponseType,
	createBasicResponse,
	createResponse,
	createServerErrorResponse,
	getErrorsFromZodError,
} from '@services/shared/utility';
import { RouteActionHandler } from '@services/shared/utility';

/**
 * Handles form data related requests for user operations.
 *
 * @class FormDataHandler
 * @extends {RouteActionHandler}
 */
export class FormDataHandler extends RouteActionHandler<NewUser> {
	async handlePostRequest(
		request: Request,
	): Promise<
		TypedResponse<SuccessResponse<NoContent> | ClientErrorResponse<NewUser>>
	> {
		const formData = await parseFormData(request, newUserFormValidator);

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

		const createUserResponse = await createUser({ request: formData.data });

		if (createUserResponse.type === ResponseType.ServerError) {
			throw createServerErrorResponse(createUserResponse);
		}

		return createResponse(createUserResponse);
	}

	async handlePatchRequest(
		request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<UpdateUser>
		>
	> {
		const formData = await parseFormData(request, updateUserFormValidator);

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

		const updateUserResponse = await updateUser({ request: formData.data });

		if (updateUserResponse.type === ResponseType.ServerError) {
			throw createServerErrorResponse(updateUserResponse);
		}

		return createResponse(updateUserResponse);
	}

	handleDeleteRequest(
		_request: Request,
	): Promise<
		TypedResponse<SuccessResponse<NoContent> | ClientErrorResponse<NewUser>>
	> {
		throw createBasicResponse(
			'Method not allowed',
			ClientErrorCode.MethodNotAllowed,
		);
	}
}
