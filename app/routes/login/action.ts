import type { ActionFunctionArgs } from '@remix-run/node';

import { newLoginFormValidator } from '@database/validators';
import { redirect } from '@remix-run/node';
import { loginUser } from '@services/server/auth';
import {
	ClientErrorCode,
	HttpMethod,
	ResponseType,
	createBasicResponse,
	createResponse,
	createServerErrorResponse,
	createTokenCookie,
	getErrorsFromZodError,
	parseFormData,
} from '@services/server/utility';

async function handlePostRequest(request: Request) {
	const formData = await parseFormData(request, newLoginFormValidator);

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

	const { username, password } = formData.data;
	const loginResponse = await loginUser({ username, password });

	if (loginResponse.type === ResponseType.ClientError) {
		return createResponse(loginResponse);
	}

	if (loginResponse.type === ResponseType.ServerError) {
		throw createServerErrorResponse(loginResponse);
	}

	return redirect('/dashboard', {
		headers: {
			'Set-Cookie': await createTokenCookie(loginResponse.data),
		},
	});
}

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method === HttpMethod.Post) {
		return await handlePostRequest(request);
	}

	throw createBasicResponse(
		'Method not allowed.',
		ClientErrorCode.MethodNotAllowed,
	);
};
