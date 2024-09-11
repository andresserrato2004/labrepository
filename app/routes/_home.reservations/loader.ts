import { defer } from '@remix-run/node';
import { getAllReservations } from '@services/server/reservations';

export const loader = () => {
	const reservationsPromise = getAllReservations();

	return defer({
		reservationsPromise,
	});
};
