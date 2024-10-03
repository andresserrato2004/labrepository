import type { ActionFunctionArgs } from '@remix-run/node';

import {
	FormDataClassroomHandler,
	JsonClassroomHandler,
} from '@routes/classrooms/handlers';
import { getSessionFromRequest } from '@services/server/utility';
import {
	ClientErrorCode,
	HttpContentType,
	createBasicResponse,
	getContentType,
} from '@services/shared/utility';

const handlers = {
	[HttpContentType.Json]: new JsonClassroomHandler(),
	[HttpContentType.FormData]: new FormDataClassroomHandler(),
} as const;

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await getSessionFromRequest(request, false);

	if (!session) {
		throw createBasicResponse(
			'Method not allowed',
			ClientErrorCode.MethodNotAllowed,
		);
	}

	const contentType = getContentType(request);

	if (!(contentType in handlers)) {
		throw createBasicResponse(
			'Invalid content type.',
			ClientErrorCode.BadRequest,
		);
	}
	const handler = handlers[contentType as keyof typeof handlers];

	return handler.handleRequest(request);
};
