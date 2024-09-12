import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Requests | Reservas' },
		{
			name: 'description',
			content: 'Manage the reservations pending requests',
		},
	];
};
