import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Academic periods | Reservas' },
		{
			name: 'description',
			content: 'Manage the academic periods of the app',
		},
	];
};
