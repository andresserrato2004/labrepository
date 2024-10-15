import type { loader } from '@routes/reservations/loader';
import type { PropsWithChildren } from 'react';

import { useServiceAsyncList } from '@hooks/lists';
import { useLoaderData } from '@remix-run/react';
import { createContext, useContext } from 'react';

export const ReservationListContext = createContext<ReturnType<
	typeof reservationList
> | null>(null);

function reservationList() {
	const { reservationsPromise, classroomsPromise, usersPromise } =
		useLoaderData<typeof loader>();

	const reservationList = useServiceAsyncList(reservationsPromise, {});

	const classroomList = useServiceAsyncList(classroomsPromise, {});

	const userList = useServiceAsyncList(usersPromise, {});

	return { reservationList, classroomList, userList };
}

export function useReservationList() {
	const session = useContext(ReservationListContext);

	if (!session) {
		throw new Error(
			'useReservationList must be used within a ReservationListProvider',
		);
	}

	return session;
}

export function ReservationListProvider({ children }: PropsWithChildren) {
	const session = reservationList();

	return (
		<ReservationListContext.Provider value={session}>
			{children}
		</ReservationListContext.Provider>
	);
}
