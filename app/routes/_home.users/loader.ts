import { defer } from '@remix-run/node';
import { getAllUsers } from '@services/server/users';

export const loader = () => {
	const usersPromise = getAllUsers();

	return defer({
		usersPromise,
	});
};
