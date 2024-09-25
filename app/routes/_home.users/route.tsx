import { RouteTitle } from '@components';
import { ModalFormProvider } from '@components/modalForm/providers';
import { UserModal } from '@routes/users/components';
import { UsersTable } from '@routes/users/components';
import { UserListProvider } from '@routes/users/providers';

export { meta } from '@routes/users/meta';
export { loader } from '@routes/users/loader';
export { action } from '@routes/users/action';

export default function UsersRoute() {
	return (
		<>
			<RouteTitle>Users</RouteTitle>
			<UserListProvider>
				<ModalFormProvider>
					<UserModal />
					<UsersTable />
				</ModalFormProvider>
			</UserListProvider>
		</>
	);
}
