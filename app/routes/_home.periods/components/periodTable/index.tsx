import type {
	AppTableAction,
	AppTableColumn,
	SingleRowActionSection,
} from '@components/appTable/types';
import type { AcademicPeriod } from '@database/types';

import { AppTable } from '@components';
import { useModalForm } from '@components/modalForm/providers';
import { Info, PencilLine, PlusSquare, Trash } from '@phosphor-icons/react';
import { useAcademicPeriods } from '@routes/home/providers';

import dayjs from 'dayjs';

export function AcademicPeriodsTable() {
	const academicPeriods = useAcademicPeriods();
	const { openModal } = useModalForm();

	const columns: AppTableColumn<AcademicPeriod>[] = [
		{
			key: 'id',
			title: 'Period Id',
			render: (period) => period.id,
		},
		{
			key: 'name',
			title: 'Name',
			render: (period) => period.name,
		},
		{
			key: 'startDate',
			title: 'Start date',
			render: (period) => dayjs(period.startDate).format('YYYY-MM-DD'),
		},
		{
			key: 'endDate',
			title: 'End date',
			render: (period) => dayjs(period.endDate).format('YYYY-MM-DD'),
		},
	];

	const singleRowSections: SingleRowActionSection<AcademicPeriod>[] = [
		{
			showDivider: true,
			title: 'Actions',
			actions: [
				{
					label: 'Edit academic period',
					icon: <PencilLine />,
					action: (period) => openModal(period, 'update'),
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
					action: (period) => openModal(period, 'details'),
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
					label: 'Delete academic period',
					icon: <Trash />,
					isDisabled: (_item) => true,
					action: (item) =>
						console.log('Deleting academic period', item),
				},
			],
		},
	];

	const tableActions: AppTableAction<AcademicPeriod>[] = [
		{
			label: 'Add academic period',
			description: 'Add a new academic period',
			icon: <PlusSquare />,
			action: () => openModal(null, 'create'),
		},
	];

	return (
		<AppTable
			tableActions={tableActions}
			columns={columns}
			list={academicPeriods}
			singleRowSections={singleRowSections}
			itemKey='id'
			aria-label='academic periods table'
		/>
	);
}
