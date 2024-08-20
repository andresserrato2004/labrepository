import type { ActionFunctionArgs } from '@remix-run/node';

import { newUserFormValidator } from '@database/validators';
import {
	ClientErrorCode,
	ResponseType,
	createBasicResponse,
	createResponse,
	getErrorsFromZodError,
	parseFormData,
} from '@services/server/utility';

async function handlePostRequest(request: Request) {
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

	return null;
}

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method === 'POST') {
		return await handlePostRequest(request);
	}

	return createBasicResponse(
		'Method not allowed',
		ClientErrorCode.MethodNotAllowed,
	);
};
