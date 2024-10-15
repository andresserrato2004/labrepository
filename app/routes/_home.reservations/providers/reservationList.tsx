import type { loader } from '@routes/reservations/loader';
import type { PropsWithChildren } from 'react';

import { useAsyncList } from '@react-stately/data';
import { useLoaderData } from '@remix-run/react';
import {
	ResponseType,
	createServerErrorResponse,
} from '@services/shared/utility';
import { createContext, useContext } from 'react';

export const ReservationListContext = createContext<ReturnType<
	typeof reservationList
> | null>(null);

function reservationList() {
	const { reservationsPromise, classroomsPromise, usersPromise } =
		useLoaderData<typeof loader>();

	const reservationList = useAsyncList({
		async load() {
			const response = await reservationsPromise;

			if (response.type === ResponseType.ServerError) {
				throw createServerErrorResponse(response);
			}

			return {
				items: response.data,
			};
		},
	});

	const classroomList = useAsyncList({
		async load() {
			const response = await classroomsPromise;

			if (response.type === ResponseType.ServerError) {
				throw createServerErrorResponse(response);
			}

			return {
				items: response.data,
			};
		},
	});

	const userList = useAsyncList({
		async load() {
			const response = await usersPromise;

			if (response.type === ResponseType.ServerError) {
				throw createServerErrorResponse(response);
			}

			return {
				items: response.data,
			};
		},
	});

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
