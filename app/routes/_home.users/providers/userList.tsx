import type { loader } from '@routes/users/loader';
import type { PropsWithChildren } from 'react';

import { useAsyncList } from '@react-stately/data';
import { useLoaderData } from '@remix-run/react';
import {
	ResponseType,
	createServerErrorResponse,
} from '@services/shared/utility';
import { createContext, useContext } from 'react';

/**
 * UserListContext is a context that provides the result of the userList function.
 * It is used to share the user list data across components.
 */
const UserListContext = createContext<ReturnType<typeof userList> | null>(null);

/**
 * Retrieves a list of users asynchronously.
 *
 * @returns The list of users.
 */
function userList() {
	const { usersPromise } = useLoaderData<typeof loader>();

	const list = useAsyncList({
		load: async () => {
			const response = await usersPromise;

			if (response.type === ResponseType.ServerError) {
				throw createServerErrorResponse(response);
			}

			return {
				items: response.data,
			};
		},
	});

	return list;
}

/**
 * Custom hook for accessing the user list context.
 * @returns The user list session from the UserListContext.
 * @throws {Error} If used outside of a UserListProvider.
 */
export function useUserList() {
	const session = useContext(UserListContext);

	if (!session) {
		throw new Error('useUserList must be used within a UserListProvider');
	}

	return session;
}

/**
 * Provides the UserList context to its children components.
 * @param children - The child components to be wrapped by the UserList context provider.
 */
export function UserListProvider({ children }: PropsWithChildren) {
	const session = userList();

	return (
		<UserListContext.Provider value={session}>
			{children}
		</UserListContext.Provider>
	);
}
