import type { AppTableColumn } from '@components/appTable/types';
import type { InfoUser } from '@database/types';

import { AppTable } from '@components';
import { useUserList } from '@routes/users/providers';

export function UsersTable() {
	const userList = useUserList();

	const columns: AppTableColumn<InfoUser>[] = [
		{ key: 'id', title: 'User Id', render: (record) => record.id },
		{ key: 'name', title: 'Name', render: (record) => record.name },
		{
			key: 'username',
			title: 'Username',
			render: (record) => record.username,
		},
		{
			key: 'email',
			title: 'Email',
			render: (record) => record.email,
		},
		{
			key: 'role',
			title: 'Role',
			render: (record) => (
				<span className='capitalize w-12'>{record.role}</span>
			),
		},
	];

	return (
		<AppTable
			columns={columns}
			itemKey={'id'}
			items={userList}
			aria-label='Users table'
		/>
	);
}
