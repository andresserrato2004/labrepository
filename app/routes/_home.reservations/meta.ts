import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Reservations | Reservas' },
		{
			name: 'description',
			content: 'Manage your reservations for classrooms',
		},
	];
};
