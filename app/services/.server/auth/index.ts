import type { LoginUserArgs, ServiceResponse } from '@services/server/types';

import { ResponseType, handleUnknownError } from '@services/server/utility';

export async function loginUser({
	username,
	password,
}: LoginUserArgs): Promise<ServiceResponse<string, LoginUserArgs>> {
	try {
		await console.log({ username, password });

		return {
			type: ResponseType.Success,
			code: 200,
			data: 'Login successful',
		};
	} catch (error) {
		return handleUnknownError({
			error: error,
			stack: 'auth/loginUser',
			additionalInfo: { username, password },
		});
	}
}
