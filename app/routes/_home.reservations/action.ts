import type { ActionFunctionArgs } from '@remix-run/node';

import {
	FormDataReservationHandler,
	JsonReservationHandler,
} from '@routes/reservations/handlers';
import {
	ClientErrorCode,
	HttpContentType,
	createBasicResponse,
	getContentType,
} from '@services/shared/utility';

const handlers = {
	[HttpContentType.FormData]: new FormDataReservationHandler(),
	[HttpContentType.Json]: new JsonReservationHandler(),
} as const;

export const action = async ({ request }: ActionFunctionArgs) => {
	const contentType = getContentType(request);

	if (!(contentType in handlers)) {
		throw createBasicResponse(
			'Invalid content type.',
			ClientErrorCode.BadRequest,
		);
	}
	const handler = handlers[contentType as keyof typeof handlers];

	return await handler.handleRequest(request);
};
