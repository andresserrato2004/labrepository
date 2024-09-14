import type { AppTableColumn } from '@components/appTable/types';
import type { InfoUser } from '@database/types';

import { AppTable } from '@components';
import { Chip } from '@nextui-org/chip';
import { Key, User } from '@phosphor-icons/react';
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
			render: (record) => record.email,
		},
		{
			key: 'role',
			title: 'Role',
			render: (record) => getRoleChip(record.role),
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
