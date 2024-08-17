import type { LoginUserArgs, ServiceResponse } from '@services/types';

import { ResponseType } from '@services/utility/enums';
import { handleUnknownError } from '@services/utility/responses';

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
