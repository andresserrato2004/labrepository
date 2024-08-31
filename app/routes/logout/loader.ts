import { redirect } from '@remix-run/react';
import { removeTokenCookie } from '@services/server/utility';

export const loader = async () => {
	const removeCookie = await removeTokenCookie();

	return redirect('/login', {
		headers: {
			'Set-Cookie': removeCookie,
		},
	});
};
