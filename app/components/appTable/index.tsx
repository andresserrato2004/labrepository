import type {
	ActionsButtonProps,
	AppTableAction,
	AppTableActionsMenuProps,
	AppTableColumn,
	AppTableProps,
	SingleRowAction,
	SingleRowActionSection,
} from '@components/appTable/types';

import {
	AppTableContextProvider,
	useAppTableContext,
} from '@components/appTable/providers';
import { Button } from '@nextui-org/button';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from '@nextui-org/dropdown';
import { Input } from '@nextui-org/input';
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
import {
	CaretDown,
	DotsThreeOutlineVertical,
	FloppyDisk,
	MagnifyingGlass,
	MicrosoftExcelLogo,
	Plus,
} from '@phosphor-icons/react';
import { cloneElement, useEffect, useMemo } from 'react';

import styles from './styles.module.css';

/**
 * Maps an array of sections to their corresponding values based on the provided item.
 * Each section can either be a `SingleRowActionSection` or a function that takes an item
 * and returns a `SingleRowActionSection`.
 *
 * @template T - The type of the item.
 * @returns The mapped array of sections.
 */
function getMappedSections<T>(
	sections: (
		| SingleRowActionSection<T>
		| ((item: T) => SingleRowActionSection<T>)
	)[],
	item: T,
) {
	return sections.map((section) =>
		typeof section === 'function' ? section(item) : section,
	);
}

/**
 * Maps an array of actions to their corresponding values based on the provided item.
 * Each action can either be a `SingleRowAction` or a function that takes an item
 * and returns a `SingleRowAction`.
 *
 * @template T - The type of the item.
 * @returns The mapped array of actions.
 */
function getMappedActions<T>(
	actions: (SingleRowAction<T> | ((item: T) => SingleRowAction<T>))[],
	item: T,
) {
	return actions.map((action) =>
		typeof action === 'function' ? action(item) : action,
	);
}

function getMappedTableActions<T>(
	actions:
		| (AppTableAction<T> | ((items: T[]) => AppTableAction<T>))[]
		| undefined,
	items: T[],
) {
	if (!actions) {
		return [];
	}

	return actions.map((action) =>
		typeof action === 'function' ? action(items) : action,
	);
}

/**
 * Returns a default set of table actions.
 *
 * @template T - The type of the items in the table.
 * @returns The default table actions.
 */
function getDefaultTableActions<T>(): AppTableAction<T>[] {
	return [
		{
			icon: <MicrosoftExcelLogo />,
			label: 'Export as Excel',
			description: 'Download items as an Excel file',
			action: (items) => {
				console.log('Downloaded items:', items);
			},
		},
		{
			icon: <FloppyDisk />,
			label: 'Export as CSV',
			description: 'Download items as a CSV file',
			action: (items) => {
				console.log('Downloaded items:', items);
			},
		},
	];
}

/**
 * SearchBar component renders an input field for searching within the app table.
 * It utilizes the context from `useAppTableContext` to manage the search filter state.
 */
function SearchBar() {
	const { searchFilter, setSearchFilter } = useAppTableContext();

	return (
		<Input
			placeholder='Search'
			startContent={
				<MagnifyingGlass size={20} className='text-default-500' />
			}
			variant='faded'
			value={searchFilter}
			onValueChange={setSearchFilter}
		/>
	);
}

/**
 * A component that renders an actions menu for a given item.
 */
function ActionsMenu<T>(props: AppTableActionsMenuProps<T>) {
	const { item, sections, ...dropdownProps } = props;

	const mappedSections = useMemo(
		() => getMappedSections(sections, item),
		[sections, item],
	);

	const disabledKeys = useMemo(() => {
		const keys: string[] = [];

		for (const section of mappedSections) {
			const actions = getMappedActions(section.actions, item);

			for (const action of actions) {
				if (action.isDisabled?.(item)) {
					keys.push(action.key || action.label);
				}
			}
		}

		return keys;
	}, [item, mappedSections]);

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
			<DropdownMenu variant='faded' disabledKeys={disabledKeys}>
				{mappedSections.map((section) => (
					<DropdownSection
						key={section.title}
						title={section.title}
						showDivider={section.showDivider}
					>
						{getMappedActions(section.actions, item).map(
							(action) => (
								<DropdownItem
									className={action.className}
									key={action.key || action.label}
									color={action.color}
									description={action.description}
									startContent={cloneElement(action.icon, {
										size: action.description ? 24 : 20,
										weight: 'duotone',
									})}
									onPress={() => action.action(item)}
								>
									{action.label}
								</DropdownItem>
							),
						)}
					</DropdownSection>
				))}
			</DropdownMenu>
		</Dropdown>
	);
}

/**
 * ActionsButton component renders a button that triggers a dropdown menu with actions.
 */
function ActionsButton<T>(props: ActionsButtonProps<T>) {
	const { tableActions, items, ...dropdownProps } = props;

	const finalActions = useMemo(
		() => [
			...getMappedTableActions(tableActions, items),
			...getDefaultTableActions(),
		],
		[tableActions, items],
	);

	return (
		<Dropdown
			backdrop='opaque'
			showArrow={true}
			classNames={{ backdrop: styles.actionsBackdrop }}
			{...dropdownProps}
		>
			<DropdownTrigger>
				<Button
					className={styles.actionsButton}
					color='secondary'
					endContent={<Plus size={20} />}
				>
					Actions
				</Button>
			</DropdownTrigger>
			<DropdownMenu variant='faded' items={finalActions}>
				{(action) => (
					<DropdownItem
						className={action.className}
						key={action.key || action.label}
						color={action.color}
						description={action.description}
						startContent={cloneElement(action.icon, {
							size: action.description ? 26 : 22,
							weight: 'duotone',
						})}
						onPress={() => action.action(items)}
					>
						{action.label}
					</DropdownItem>
				)}
			</DropdownMenu>
		</Dropdown>
	);
}

/**
 * ColumnsSelector component renders a dropdown menu for selecting visible columns.
 */
function ColumnsSelector<T>(props: { columns: AppTableColumn<T>[] }) {
	const { visibleColumns, setVisibleColumns } = useAppTableContext();

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button endContent={<CaretDown size={16} />}>Columns</Button>
			</DropdownTrigger>
			<DropdownMenu
				variant='faded'
				selectionMode='multiple'
				selectedKeys={visibleColumns}
				onSelectionChange={setVisibleColumns}
			>
				<DropdownSection title='Columns'>
					{props.columns.map((column) => (
						<DropdownItem key={column.title}>
							{column.title}
						</DropdownItem>
					))}
				</DropdownSection>
			</DropdownMenu>
		</Dropdown>
	);
}

/**
 * ContentWrapper component is a wrapper for the main content of the app table.
 */
function ContentWrapper<T extends Record<string, unknown>>(
	props: AppTableProps<T>,
) {
	const {
		columns,
		list,
		itemKey,
		singleRowSections,
		tableActions,
		...tableProps
	} = props;
	const { searchFilter, visibleColumns } = useAppTableContext();

	const finalColumns = useMemo(() => {
		const optionsColumn: AppTableColumn<T> = {
			title: 'Options',
			align: 'center',
			render: (item) => {
				return (
					<ActionsMenu
						sections={singleRowSections ?? []}
						item={item}
					/>
				);
			},
		};

		return [
			...columns.filter(
				(column) =>
					Array.from(visibleColumns).includes(column.title) ||
					visibleColumns === 'all',
			),
			...(singleRowSections ? [optionsColumn] : []),
		];
	}, [visibleColumns, columns, singleRowSections]);

	useEffect(() => {
		list.setFilter(searchFilter);

		return () => {
			list.setFilter('');
		};
	}, [searchFilter, list.setFilter]);

	return (
		<>
			<div className={styles.tableOptionsContainer}>
				<SearchBar />
				<ColumnsSelector columns={columns} />
				<ActionsButton tableActions={tableActions} items={list.items} />
			</div>
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
							width={column.width}
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
		</>
	);
}

export function AppTable<T extends Record<string, unknown>>(
	props: AppTableProps<T>,
) {
	return (
		<>
			<AppTableContextProvider>
				<ContentWrapper {...props} />
			</AppTableContextProvider>
		</>
	);
}
