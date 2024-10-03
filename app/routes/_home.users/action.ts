import type { ActionFunctionArgs } from '@remix-run/node';

import { MissingEnvironmentVariableError } from '@errors/shared';
import { FormDataHandler, JsonHandler } from '@routes/users/handlers';
import {
	getSessionFromRequest,
	validateAdminKey,
} from '@services/server/utility';
import { HttpContentType, getContentType } from '@services/shared/utility';
import { ClientErrorCode, createBasicResponse } from '@services/shared/utility';

if (!process.env.ADMIN_KEY) {
	throw new MissingEnvironmentVariableError('ADMIN_KEY');
}

const handlers = {
	[HttpContentType.Json]: new JsonHandler(),
	[HttpContentType.FormData]: new FormDataHandler(),
} as const;

export const action = async ({ request }: ActionFunctionArgs) => {
	//TODO: Investigate how bypass the session checker on the _home loader
	const isValidAdminKey = validateAdminKey(request);
	const session = await getSessionFromRequest(request, false);

	if (!isValidAdminKey && !session) {
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
