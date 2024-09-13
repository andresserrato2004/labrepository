import type { AppTableProps } from '@components/appTable/types';

import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@nextui-org/table';

export function AppTable<T>(props: AppTableProps<T>) {
	const { columns, items, itemKey, ...tableProps } = props;

	return (
		<Table {...tableProps}>
			<TableHeader>
				{columns.map((column) => (
					<TableColumn key={column.title}>{column.title}</TableColumn>
				))}
			</TableHeader>
			<TableBody>
				{items.items.map((item) => (
					<TableRow key={item[itemKey] as string | number}>
						{columns.map((column) => (
							<TableCell key={column.title}>
								{column.render(item)}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
