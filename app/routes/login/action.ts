import type { ActionFunctionArgs } from '@remix-run/node';

import { loginUser } from '@services/server/auth';

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();

	const { username, password } = Object.fromEntries(formData);

	const response = await loginUser({
		username: username.toString(),
		password: password.toString(),
	});

	console.log({ response });

	return null;
};
