import type {
	AppTableAction,
	AppTableColumn,
	SingleRowActionSection,
} from '@components/appTable/types';
import type { InfoUser } from '@database/types';

import { AppTable, toast } from '@components';
import { useModalForm } from '@components/modalForm/providers';
import { Chip } from '@nextui-org/chip';
import {
	Clipboard,
	Info,
	Key,
	MicrosoftExcelLogo,
	PencilLine,
	PlusSquare,
	Trash,
	UploadSimple,
	User,
} from '@phosphor-icons/react';
import { useUserList } from '@routes/users/providers';
import { importExcelFile } from '@services/client/imports';

import dayjs from 'dayjs';

import styles from './styles.module.css';

function copyToClipboard(text: string) {
	try {
		if (!navigator.clipboard) {
			return;
		}

		navigator.clipboard.writeText(text);

		toast.success('Copied to clipboard');
	} catch (error) {
		toast.error(`Error copying to clipboard: ${error}`);
	}
}

function copyUserAsJson(user: InfoUser) {
	copyToClipboard(JSON.stringify(user, null, 4));
}

function copyUserAsExcel(user: InfoUser) {
	let string = '';

	for (const key of Object.keys(user) as (keyof InfoUser)[]) {
		string += `${user[key]}\t`;
	}

	copyToClipboard(string.slice(0, -1));
}

function getRoleChip(role: string) {
	const isAdmin = role === 'admin';
	const variant = 'flat';
	const text = isAdmin ? 'Admin' : 'User';

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
	const { openModal } = useModalForm();

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
			width: 400,
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
		{
			key: 'createdAt',
			title: 'Created at',
			render: (record) => dayjs(record.createdAt).format('YYYY-MM-DD'),
		},
		{
			key: 'updatedAt',
			title: 'Updated at',
			render: (record) => dayjs(record.updatedAt).format('YYYY-MM-DD'),
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
					action: (item) => openModal(item, 'update'),
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
					action: (item) => openModal(item, 'details'),
				},
				{
					label: 'Copy as JSON',
					icon: <Clipboard />,
					action: (item) => copyUserAsJson(item),
				},
				{
					label: 'Copy as Excel',
					icon: <MicrosoftExcelLogo />,
					action: (item) => copyUserAsExcel(item),
				},
			],
		},
		{
			showDivider: false,
			title: 'Danger zone',
			actions: [
				(item) => {
					const description =
						item.role === 'admin'
							? 'An admin user cannot be deleted'
							: 'This action cannot be undone';

					return {
						key: 'delete',
						className: 'text-danger',
						color: 'danger',
						description: description,
						label: 'Delete user',
						icon: <Trash />,
						isDisabled: (item) => item.role === 'admin',
						action: (item) => console.log('Deleting user', item),
					};
				},
			],
		},
	];

	const tableActions: AppTableAction<InfoUser>[] = [
		{
			label: 'Add user',
			description: 'Add a new user',
			icon: <PlusSquare />,
			action: () => openModal(null, 'create'),
		},
		{
			label: 'Import from Excel',
			description: 'Import users from an Excel file',
			icon: <UploadSimple />,
			action: async () => {
				const rows = await importExcelFile<InfoUser>();
				if (!rows) {
					return;
				}

				toast.error('Importing users is not implemented yet');

				// fetcher.submit(JSON.stringify(rows), {
				// 	method: 'POST',
				// 	encType: 'application/json',
				// 	preventScrollReset: true,
				// 	relative: 'path',
				// });
			},
		},
	];

	return (
		<AppTable
			columns={columns}
			list={userList}
			singleRowSections={actionSections}
			tableActions={tableActions}
			itemKey='id'
			aria-label='Users table'
		/>
	);
}
