import type { AcademicPeriod } from '@database/types';
import type { loader } from '@routes/home/loader';
import type { PropsWithChildren } from 'react';

import { useDeferredServiceResponse } from '@hooks/utility';
import { useLoaderData } from '@remix-run/react';
import { createContext, useContext, useEffect, useState } from 'react';

/**
 * The context for academic periods.
 */
export const AcademicPeriodsContext = createContext<ReturnType<
	typeof academicPeriods
> | null>(null);

/**
 * Retrieves academic periods data and current period information.
 *
 * @returns An object containing the academic periods data, loading status, and current period.
 */
function academicPeriods() {
	const [currentPeriod, setCurrentPeriod] = useState<
		AcademicPeriod | undefined
	>(undefined);
	const { academicPeriodsPromise } = useLoaderData<typeof loader>();

	const { data, isLoading } = useDeferredServiceResponse(
		academicPeriodsPromise,
	);

	useEffect(() => {
		if (data) {
			const now = new Date();
			const currentPeriod = data.find(
				(period) =>
					new Date(period.startDate) <= now &&
					new Date(period.endDate) >= now,
			);

			setCurrentPeriod(currentPeriod);
		}
	}, [data]);

	return { data, isLoading, currentPeriod };
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
