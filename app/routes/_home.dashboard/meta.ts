import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Dashboard | Reservas' },
		{
			name: 'description',
			content: 'Administra tu cuenta de reservas de laboratorios',
		},
	];
};
