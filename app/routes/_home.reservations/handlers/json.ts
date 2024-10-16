import type { NewReservation } from '@database/types';
import type { TypedResponse } from '@remix-run/node';
import type {
	ClientErrorResponse,
	NoContent,
	SuccessResponse,
} from '@services/server/types';

import { RouteActionHandler } from '@services/shared/utility';

/**
 * @class JsonReservationHandler
 * @extends RouteActionHandler<NewReservation>
 *
 * Handles HTTP requests related to reservations from JSON.
 */
export class JsonReservationHandler extends RouteActionHandler<NewReservation> {
	handlePostRequest(
		_request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<NewReservation>
		>
	> {
		throw new Error('Method not implemented.');
	}
	handlePatchRequest(
		_request: Request,
	): Promise<
		TypedResponse<
			SuccessResponse<NoContent> | ClientErrorResponse<NewReservation>
		>
	> {
		throw new Error('Method not implemented.');
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
