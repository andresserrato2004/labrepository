import type { Schema } from 'write-excel-file';

import { toast } from '@components';

import writeExcel from 'write-excel-file';

/**
 * Saves the provided table data as an Excel file.
 *
 * @template T - The type of the table data.
 * @param {T[]} table - The table data to be saved.
 * @param {Schema<T>} schema - The schema defining the structure and styling of the table columns.
 * @throws Will display an error toast if the table cannot be saved as an Excel file.
 */
export async function saveTableAsExcel<T>(table: T[], schema: Schema<T>) {
	try {
		await writeExcel(table, {
			schema: schema.map((column) => ({
				...column,
				borderColor: '#262626',
				width: 30,
				height: 22,
				alignVertical: 'center',
			})),

			getHeaderStyle: (column) => ({
				backgroundColor: '#262626',
				color: '#ffffff',
				borderColor: '#656565',
				fontWeight: 'bold',
				align: column.align,
				indent: column.indent,
				height: 28,
				alignVertical: 'center',
			}),

			fileName: 'table.xlsx',
		});
	} catch (error) {
		toast.error(`Failed to save table as excel ${error}`);
	}
}
