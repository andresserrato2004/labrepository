import { defer } from '@remix-run/node';
import { getAllClassrooms } from '@services/server/classrooms';
import { getAllReservations } from '@services/server/reservations';
import { getAllUsers } from '@services/server/users';

export const loader = () => {
	const reservationsPromise = getAllReservations();
	const classroomsPromise = getAllClassrooms();
	const usersPromise = getAllUsers();

	return defer({
		reservationsPromise,
		classroomsPromise,
		usersPromise,
	});
};
