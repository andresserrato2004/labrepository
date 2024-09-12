import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Classrooms | Reservas' },
		{ name: 'description', content: 'Manage the app classrooms' },
	];
};
