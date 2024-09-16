import type {
	AppTableActionsMenuProps,
	AppTableColumn,
	AppTableProps,
} from '@components/appTable/types';

import { Button } from '@nextui-org/button';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from '@nextui-org/dropdown';
import { Pagination } from '@nextui-org/pagination';
import { Spinner } from '@nextui-org/spinner';
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@nextui-org/table';
import { DotsThreeOutlineVertical } from '@phosphor-icons/react';
import { cloneElement } from 'react';

import styles from './styles.module.css';

function ActionsMenu<T>(props: AppTableActionsMenuProps<T>) {
	const { item, sections, ...dropdownProps } = props;

	return (
		<Dropdown {...dropdownProps}>
			<DropdownTrigger>
				<Button isIconOnly={true} size='sm' variant='light'>
					<DotsThreeOutlineVertical
						className={styles.actionsIcon}
						weight='fill'
					/>
				</Button>
			</DropdownTrigger>
			<DropdownMenu variant='faded'>
				{sections.map((section) => (
					<DropdownSection
						key={section.title}
						title={section.title}
						showDivider={section.showDivider}
					>
						{section.actions.map((action) => (
							<DropdownItem
								className={action.className}
								key={action.key || action.label}
								color={action.color}
								description={action.description}
								startContent={cloneElement(action.icon, {
									size: action.description ? 24 : 20,
									weight: 'duotone',
								})}
								onPress={() => action.action(props.item)}
							>
								{action.label}
							</DropdownItem>
						))}
					</DropdownSection>
				))}
			</DropdownMenu>
		</Dropdown>
	);
}

export function AppTable<T>(props: AppTableProps<T>) {
	const { columns, list, itemKey, singleRowSections, ...tableProps } = props;

	const finalColumns = [...columns];

	const optionsColumn: AppTableColumn<T> = {
		title: 'Options',
		align: 'center',
		render: (item) => {
			return (
				<ActionsMenu sections={singleRowSections ?? []} item={item} />
			);
		},
	};

	if (singleRowSections) {
		finalColumns.push(optionsColumn);
	}

	return (
		<Table
			sortDescriptor={list.sortDescriptor}
			onSortChange={list.sort}
			bottomContent={
				<div className={styles.paginationContainer}>
					<Pagination
						color='secondary'
						isCompact={true}
						showControls={true}
						showShadow={true}
						initialPage={1}
						page={list.page}
						total={list.totalPages}
						onChange={list.setPage}
					/>
				</div>
			}
			{...tableProps}
		>
			<TableHeader>
				{finalColumns.map((column) => (
					<TableColumn
						width={140}
						key={column.key || column.title}
						align={column.align}
						allowsSorting={Boolean(column.key)}
					>
						{column.title}
					</TableColumn>
				))}
			</TableHeader>
			<TableBody
				items={list.paginatedItems}
				isLoading={list.isLoading}
				loadingContent={<Spinner />}
				emptyContent={'No items found'}
			>
				{(item) => (
					<TableRow key={item[itemKey] as string | number}>
						{finalColumns.map((column) => (
							<TableCell key={column.title}>
								{column.render(item)}
							</TableCell>
						))}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
