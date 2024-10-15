import type { loader } from '@routes/home/loader';
import type {
	ExistingCurrentPeriod,
	MissingCurrentPeriod,
} from '@routes/home/providers/types';
import type { PropsWithChildren } from 'react';

import { useServiceAsyncList } from '@hooks/lists';
import { useLoaderData } from '@remix-run/react';
import { getMonday, getSunday } from '@services/client/dates';
import { createContext, useContext, useEffect, useState } from 'react';

/**
 * The context for academic periods.
 */
export const AcademicPeriodsContext = createContext<ReturnType<
	typeof academicPeriods
> | null>(null);

/**
 * The context for classrooms.
 */
export const ClassroomsContext = createContext<ReturnType<
	typeof classroomList
> | null>(null);

/**
 * Retrieves academic periods data and current period information.
 *
 * @returns An object containing the academic periods data, loading status, and current period.
 */
function academicPeriods() {
	const [currentPeriod, setCurrentPeriod] = useState<
		ExistingCurrentPeriod | MissingCurrentPeriod
	>({
		selectedWeek: 1,
		period: undefined,
		startDate: undefined,
		endDate: undefined,
	});

	const { academicPeriodsPromise } = useLoaderData<typeof loader>();

	const list = useServiceAsyncList(academicPeriodsPromise, {
		initialSortDescriptor: {
			column: 'name',
			direction: 'descending',
		},
	});

	useEffect(() => {
		if (list.items) {
			const now = new Date();
			const currentPeriod = list.items.find(
				(period) =>
					new Date(period.startDate) <= now &&
					new Date(period.endDate) >= now,
			);

			if (currentPeriod) {
				setCurrentPeriod((prev) => ({
					selectedWeek: prev.selectedWeek,
					period: currentPeriod,
					startDate: getMonday(currentPeriod.startDate),
					endDate: getSunday(currentPeriod.endDate),
				}));
			}
		}
	}, [list.items]);

	const setSelectedWeek = (selectedWeek: number) => {
		if (selectedWeek < 1 || selectedWeek > 17) {
			return;
		}

		setCurrentPeriod((prev) => ({
			...prev,
			selectedWeek,
		}));
	};

	return {
		...list,
		currentPeriod,
		setSelectedWeek,
	};
}

/**
 * Retrieves the classrooms data.
 *
 * @returns An object containing the classrooms data and loading status.
 */
function classroomList() {
	const { classroomsPromise } = useLoaderData<typeof loader>();

	const list = useServiceAsyncList(classroomsPromise, {
		initialSortDescriptor: {
			column: 'name',
			direction: 'ascending',
		},
	});

	return list;
}

/**
 * Custom hook that provides access to the academic periods context.
 * @returns The academic periods context.
 * @throws {Error} If used outside of an AcademicPeriodsProvider.
 */
export function useAcademicPeriods() {
	const academicPeriods = useContext(AcademicPeriodsContext);

	if (!academicPeriods) {
		throw new Error(
			'useAcademicPeriods must be used within a AcademicPeriodsProvider',
		);
	}

	return academicPeriods;
}

/**
 * Custom hook that provides access to the classrooms context.
 * @returns The classrooms context.
 * @throws {Error} If used outside of a ClassroomsProvider.
 */
export function useClassrooms() {
	const classrooms = useContext(ClassroomsContext);

	if (!classrooms) {
		throw new Error(
			'useClassrooms must be used within a ClassroomsProvider',
		);
	}

	return classrooms;
}

/**
 * Provides the academic periods to the children components.
 *
 * @param children - The child components to be wrapped by the provider.
 */
export function AcademicPeriodsProvider({ children }: PropsWithChildren) {
	const periods = academicPeriods();

	return (
		<AcademicPeriodsContext.Provider value={periods}>
			{children}
		</AcademicPeriodsContext.Provider>
	);
}

/**
 * Provides the classrooms to the children components.
 *
 * @param children - The child components to be wrapped by the provider.
 */
export function ClassroomsProvider({ children }: PropsWithChildren) {
	const classroomsData = classroomList();

	return (
		<ClassroomsContext.Provider value={classroomsData}>
			{children}
		</ClassroomsContext.Provider>
	);
}
