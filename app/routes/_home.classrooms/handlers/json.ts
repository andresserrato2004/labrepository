import type { NewClassroom } from '@database/types';
import type { TypedResponse } from '@remix-run/node';
import type {
	ClientErrorResponse,
	NoContent,
	SuccessResponse,
} from '@services/server/types';

import { RouteActionHandler } from '@services/shared/utility';

/**
 * Handler for JSON-based classroom operations.
 *
 * This class extends `RouteActionHandler` and provides methods to handle
 * HTTP POST, PATCH, and DELETE requests for classroom entities.
 *
 * @template NewClassroom - The type representing a new classroom entity.
 */
export class JsonClassroomHandler extends RouteActionHandler<NewClassroom> {
	handlePostRequest(
		_request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<NewClassroom>
		>
	> {
		throw new Error('Method not implemented.');
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
