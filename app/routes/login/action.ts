import type { ActionFunctionArgs } from '@remix-run/node';

import { newLoginFormValidator } from '@database/validators';
import { loginUser } from '@services/server/auth';
import {
	ClientErrorCode,
	ResponseType,
	createBasicResponse,
	createResponse,
	getErrorsFromZodError,
	parseFormData,
} from '@services/server/utility';

async function handlePostRequest(request: Request) {
	const formData = await parseFormData(request, newLoginFormValidator);

	if (!formData) {
		throw createBasicResponse('Invalid form data.', 400);
	}

	if (!formData.success) {
		return createResponse({
			code: ClientErrorCode.BadRequest,
			type: ResponseType.ClientError,
			errors: getErrorsFromZodError(formData.error),
		});
	}

	const { username, password } = formData.data;
	const loginResponse = await loginUser({ username, password });

	if (loginResponse.type === ResponseType.ClientError) {
		return createResponse(loginResponse);
	}

	if (loginResponse.type === ResponseType.ServerError) {
		throw createBasicResponse('Internal server error.', 400);
	}

	return null;
}

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method === 'POST') {
		return await handlePostRequest(request);
	}

	return createBasicResponse('Method not allowed.', 405);
};
