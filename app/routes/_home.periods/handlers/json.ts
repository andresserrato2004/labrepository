import type { NewAcademicPeriod } from '@database/types';
import type { TypedResponse } from '@remix-run/node';
import type {
	ClientErrorResponse,
	NoContent,
	SuccessResponse,
} from '@services/server/types';

import { RouteActionHandler } from '@services/shared/utility';

/**
 * Handler for JSON-based academic period operations.
 *
 * This class extends `RouteActionHandler` to provide specific implementations
 * for handling POST, PATCH, and DELETE requests related to academic periods.
 *
 * @template NewAcademicPeriod - The type representing a new academic period.
 */
export class JsonAcademicPeriodHandler extends RouteActionHandler<NewAcademicPeriod> {
	handlePostRequest(
		_request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<NewAcademicPeriod>
		>
	> {
		throw new Error('Method not implemented.');
	}
	handlePatchRequest(
		_request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<NewAcademicPeriod>
		>
	> {
		throw new Error('Method not implemented.');
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
