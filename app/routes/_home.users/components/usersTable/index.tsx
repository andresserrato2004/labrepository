import type {
	AppTableColumn,
	SingleRowAction,
} from '@components/appTable/types';
import type { InfoUser } from '@database/types';

import { AppTable } from '@components';
import { Chip } from '@nextui-org/chip';
import { Info, Key, User } from '@phosphor-icons/react';
import { useUserList } from '@routes/users/providers';

import styles from './styles.module.css';

function getRoleChip(role: string) {
	const isAdmin = role === 'admin';
	const variant = 'flat';
	const text = isAdmin ? 'Admin' : 'Guest';

	const color = isAdmin ? 'secondary' : 'success';
	const icon = isAdmin ? (
		<Key size={16} weight='fill' />
	) : (
		<User size={16} weight='fill' />
	);

	return (
		<Chip
			className={styles.roleChip}
			startContent={icon}
			variant={variant}
			color={color}
		>
			{text}
		</Chip>
	);
}

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
			render: (record) => (
				<span className={styles.emailColumn}>{record.email}</span>
			),
		},
		{
			key: 'role',
			title: 'Role',
			render: (record) => getRoleChip(record.role),
		},
	];

	const actions: SingleRowAction<InfoUser>[] = [
		{
			label: 'Details',
			icon: <Info size={20} weight='fill' />,
			action: (item) => console.log('Details', item),
		},
	];

	return (
		<AppTable
			columns={columns}
			list={userList}
			itemKey={'id'}
			singleRowActions={actions}
			aria-label='Users table'
		/>
	);
}
