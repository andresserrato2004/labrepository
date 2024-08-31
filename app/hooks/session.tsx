import type { loader } from '@routes/home/loader';
import type { PropsWithChildren } from 'react';

import { useLoaderData } from '@remix-run/react';
import { createContext, useContext } from 'react';

/**
 * UserSessionContext is a context object created using createContext() function from React.
 * It represents the user session information.
 * The context value is of type ReturnType<typeof userSession> or null.
 */
export const UserSessionContext = createContext<ReturnType<
	typeof userSession
> | null>(null);

/**
 * Retrieves the user session.
 * @returns The user session object.
 */
function userSession() {
	const { session } = useLoaderData<typeof loader>();

	return session;
}

/**
 * Custom hook to access the user session.
 *
 * @returns The user session object.
 * @throws {Error} If used outside of a UserSessionProvider.
 */
export function useUserSession() {
	const session = useContext(UserSessionContext);

	if (!session) {
		throw new Error(
			'useUserSession must be used within a UserSessionProvider',
		);
	}

	return session;
}

/**
 * Provides the user session context to its children components.
 *
 * @param children - The child components to render.
 */
export function UserSessionProvider({ children }: PropsWithChildren) {
	const session = userSession();

	return (
		<UserSessionContext.Provider value={session}>
			{children}
		</UserSessionContext.Provider>
	);
}
