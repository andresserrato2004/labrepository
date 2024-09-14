import { RouteTitle } from '@components';
import { UserListProvider } from '@routes/users/providers';

import { UsersTable } from '@routes/users/components';

export { meta } from '@routes/users/meta';
export { loader } from '@routes/users/loader';
export { action } from '@routes/users/action';

export default function UsersRoute() {
	return (
		<>
			<RouteTitle>Users</RouteTitle>
			<UserListProvider>
				<UsersTable />
			</UserListProvider>
		</>
	);
}
