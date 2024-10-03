import type { NewUser } from '@database/types';
import type { TypedResponse } from '@remix-run/node';
import type {
	ClientErrorResponse,
	NoContent,
	SuccessResponse,
} from '@services/server/types';

import { newUserFormValidator } from '@database/validators';
import { parseJson } from '@services/server/utility';
import {
	ClientErrorCode,
	ResponseType,
	RouteActionHandler,
	createBasicResponse,
	createResponse,
	getErrorsFromZodError,
} from '@services/shared/utility';

/**
 * @class JsonHandler
 * @extends RouteActionHandler
 *
 * Handles JSON-related HTTP requests for user operations.
 */
export class JsonHandler extends RouteActionHandler<NewUser> {
	async handlePostRequest(
		request: Request,
	): Promise<
		TypedResponse<SuccessResponse<NoContent> | ClientErrorResponse<NewUser>>
	> {
		const json = await parseJson(request, newUserFormValidator);

		if (!json) {
			throw createBasicResponse(
				'Invalid JSON data',
				ClientErrorCode.BadRequest,
			);
		}

		if (!json.success) {
			return createResponse({
				code: ClientErrorCode.BadRequest,
				type: ResponseType.ClientError,
				errors: getErrorsFromZodError(json.error),
			});
		}

		//TODO: Save the user to the database
		console.log(json.data);

		return new Response('Ok');
	}
	handlePatchRequest(
		_request: Request,
	): Promise<
		TypedResponse<SuccessResponse<NoContent> | ClientErrorResponse<NewUser>>
	> {
		throw new Error('Method not implemented.');
	}
	handleDeleteRequest(
		_request: Request,
	): Promise<
		TypedResponse<SuccessResponse<NoContent> | ClientErrorResponse<NewUser>>
	> {
		throw new Error('Method not implemented.');
	}
}
