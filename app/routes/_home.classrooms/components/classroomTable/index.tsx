import type {
	AppTableAction,
	AppTableColumn,
	SingleRowActionSection,
} from '@components/appTable/types';
import type { Classroom } from '@database/types';

import { AppTable } from '@components';
import { useModalForm } from '@components/modalForm/providers';
import { Info, PencilLine, PlusSquare, Trash } from '@phosphor-icons/react';
import { useClassrooms } from '@routes/home/providers';

import dayjs from 'dayjs';

export function ClassroomTable() {
	const classrooms = useClassrooms();
	const { openModal } = useModalForm();

	const columns: AppTableColumn<Classroom>[] = [
		{
			key: 'id',
			title: 'Classroom Id',
			render: (classroom) => classroom.id,
		},
		{
			key: 'name',
			title: 'Name',
			render: (classroom) => classroom.name,
		},
		{
			key: 'capacity',
			title: 'Capacity',
			render: (classroom) => classroom.capacity,
		},
		{
			key: 'createdAt',
			title: 'Created at',
			render: (classroom) =>
				dayjs(classroom.createdAt).format('YYYY-MM-DD'),
		},
		{
			key: 'updatedAt',
			title: 'Updated at',
			render: (classroom) =>
				dayjs(classroom.updatedAt).format('YYYY-MM-DD'),
		},
	];

	const singleRowSections: SingleRowActionSection<Classroom>[] = [
		{
			showDivider: true,
			title: 'Actions',
			actions: [
				{
					label: 'Edit classroom',
					icon: <PencilLine />,
					action: (classroom) => openModal(classroom, 'update'),
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
					action: (classroom) => openModal(classroom, 'details'),
				},
			],
		},
		{
			showDivider: false,
			title: 'Danger zone',
			actions: [
				{
					key: 'delete',
					className: 'text-danger',
					color: 'danger',
					description: 'This action cannot be undone',
					label: 'Delete classroom',
					icon: <Trash />,
					isDisabled: (_item) => true,
					action: (item) => console.log('Deleting classroom', item),
				},
			],
		},
	];

	const tableActions: AppTableAction<Classroom>[] = [
		{
			label: 'Add classroom',
			description: 'Add a new classroom',
			icon: <PlusSquare />,
			action: () => openModal(null, 'create'),
		},
	];

	return (
		<AppTable
			tableActions={tableActions}
			columns={columns}
			list={classrooms}
			singleRowSections={singleRowSections}
			itemKey='id'
			aria-label='classrooms table'
		/>
	);
}
