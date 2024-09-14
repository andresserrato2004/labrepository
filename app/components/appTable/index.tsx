import type { AppTableProps } from '@components/appTable/types';

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

import styles from './styles.module.css';

export function AppTable<T>(props: AppTableProps<T>) {
	const { columns, list, itemKey, ...tableProps } = props;

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
				{columns.map((column) => (
					<TableColumn
						width={140}
						key={column.key}
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
						{columns.map((column) => (
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
