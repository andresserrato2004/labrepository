import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Users | Reservas' },
		{ name: 'description', content: 'Manage the app users' },
	];
};
