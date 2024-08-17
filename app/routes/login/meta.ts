import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Iniciar sesión | Reservas' },
		{
			name: 'description',
			content:
				'Inicia sesión para acceder a tu cuenta de reservas de laboratorios',
		},
	];
};
