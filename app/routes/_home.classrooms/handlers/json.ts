import type { Classroom, NewClassroom } from '@database/types';
import type { TypedResponse } from '@remix-run/node';
import type {
	ClientErrorResponse,
	NoContent,
	SuccessResponse,
} from '@services/server/types';

import { RouteActionHandler } from '@services/shared/utility';

export class JsonClassroomHandler extends RouteActionHandler<Classroom> {
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
