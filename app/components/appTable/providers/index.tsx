import type { Key } from '@react-types/shared';
import type { PropsWithChildren } from 'react';

import { createContext, useContext, useState } from 'react';

/**
 * Context for the AppTable component.
 *
 * This context is created using the `createContext` function and is initialized
 * with the return type of the `buildAppTableContext` function or `null`.
 */
export const AppTableContext = createContext<ReturnType<
	typeof buildAppTableContext
> | null>(null);

/**
 * Builds the context for the AppTable component.
 *
 * @returns An object containing:
 * - `searchFilter`: The current search filter string.
 * - `setSearchFilter`: Function to update the search filter.
 * - `visibleColumns`: A set of visible column keys or 'all' if all columns are visible.
 * - `setVisibleColumns`: Function to update the visible columns.
 */
export function buildAppTableContext() {
	const [searchFilter, setSearchFilter] = useState('');
	const [visibleColumns, setVisibleColumns] = useState<Set<Key> | 'all'>(
		'all',
	);

	return {
		searchFilter,
		setSearchFilter,
		visibleColumns,
		setVisibleColumns,
	};
}

/**
 * Custom hook to access the AppTableContext.
 *
 * This hook provides the current context value for the AppTableContext.
 * It must be used within a component that is a descendant of an AppTableProvider.
 *
 * @throws {Error} If the hook is used outside of an AppTableProvider.
 */
export function useAppTableContext() {
	const context = useContext(AppTableContext);

	if (!context) {
		throw new Error(
			'useAppTableContext must be used within an AppTableProvider',
		);
	}

	return context;
}

/**
 * Provider for the AppTableContext.
 *
 * @param props - The component props.
 * @returns The AppTableContextProvider component.
 */
export function AppTableContextProvider({ children }: PropsWithChildren) {
	const context = buildAppTableContext();

	return (
		<AppTableContext.Provider value={context}>
			{children}
		</AppTableContext.Provider>
	);
}
