import type { ActionFunctionArgs } from '@remix-run/node';

import { newUserFormValidator } from '@database/validators';
import { MissingEnvironmentVariableError } from '@errors/shared';
import { createUser } from '@services/server/users';
import { parseFormData } from '@services/server/utility';
import {
	ClientErrorCode,
	HttpMethod,
	ResponseType,
	createBasicResponse,
	createResponse,
	createServerErrorResponse,
	getErrorsFromZodError,
} from '@services/shared/utility';

if (!process.env.ADMIN_KEY) {
	throw new MissingEnvironmentVariableError('ADMIN_KEY');
}

function validateAdminKey(request: Request) {
	const adminKey = request.headers.get('x-admin-key');

	if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
		return false;
	}

	return true;
}

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

	const createUserResponse = await createUser({ request: formData.data });

	if (createUserResponse.type === ResponseType.ServerError) {
		throw createServerErrorResponse(createUserResponse);
	}

	return createResponse(createUserResponse);
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const isValidAdminKey = validateAdminKey(request);

	if (!isValidAdminKey) {
		throw createBasicResponse(
			'Method not allowed',
			ClientErrorCode.MethodNotAllowed,
		);
	}

	if (request.method === HttpMethod.Post) {
		return await handlePostRequest(request);
	}

	throw createBasicResponse(
		'Method not allowed',
		ClientErrorCode.MethodNotAllowed,
	);
};
