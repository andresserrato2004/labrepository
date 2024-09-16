import type {
	AppTableColumn,
	SingleRowActionSection,
} from '@components/appTable/types';
import type { InfoUser } from '@database/types';

import { AppTable } from '@components';
import { Chip } from '@nextui-org/chip';
import {
	Clipboard,
	Info,
	Key,
	MicrosoftExcelLogo,
	PencilLine,
	Trash,
	User,
} from '@phosphor-icons/react';
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

	const actionSections: SingleRowActionSection<InfoUser>[] = [
		{
			showDivider: true,
			title: 'Actions',
			actions: [
				{
					label: 'Edit user',
					icon: <PencilLine />,
					action: (item) => console.log('Edit', item),
				},
			],
		},
		{
			showDivider: true,
			title: 'Information',
			actions: [
				{
					label: 'Show details',
					icon: <Info />,
					action: (item) => console.log('Details', item),
				},
				{
					label: 'Copy as JSON',
					icon: <Clipboard />,
					action: (item) => console.log('Copy as JSON', item),
				},
				{
					label: 'Copy as CSV',
					icon: <MicrosoftExcelLogo />,
					action: (item) => console.log('Copy as CSV', item),
				},
			],
		},
		{
			showDivider: false,
			title: 'Danger zone',
			actions: [
				{
					className: 'text-danger',
					color: 'danger',
					description: 'This action cannot be undone',
					label: 'Delete user',
					icon: <Trash />,
					action: (item) => console.log('Deleting user', item),
				},
			],
		},
	];

	return (
		<AppTable
			columns={columns}
			list={userList}
			itemKey={'id'}
			singleRowSections={actionSections}
			aria-label='Users table'
		/>
	);
}
