import type { LoaderFunctionArgs } from '@remix-run/node';

import {
	ResponseType,
	ServerErrorCode,
	createServerErrorResponse,
} from '@services/shared/utility';

export const loader = ({ request }: LoaderFunctionArgs) => {
	const logId = new URL(request.url).searchParams.get('logId') ?? 'unknown';

	throw createServerErrorResponse({
		logId: logId,
		code: ServerErrorCode.InternalServerError,
		type: ResponseType.ServerError,
	});
};
