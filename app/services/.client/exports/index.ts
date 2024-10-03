import type { Schema } from 'write-excel-file';

import { toast } from '@components';

import writeExcel from 'write-excel-file';

/**
 * Saves the provided table data as an Excel file.
 *
 * @template T - The type of the table data.
 * @param {T[]} table - The table data to be saved.
 * @param {Schema<T>} schema - The schema defining the structure and styling of the table columns.
 * @returns A promise that resolves when the table has been saved as an Excel file.
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

/**
 * Exports a given table of objects as a CSV file and triggers a download in the browser.
 *
 * @template T - The type of objects in the table.
 * @param {T[]} table - The table of objects to be converted to CSV format.
 * @returns A promise that resolves when the CSV file has been created and the download has been triggered.
 */
export async function saveTableAsCsv<T extends object>(table: T[]) {
	try {
		const csv = table.map((row) => Object.values(row).join(',')).join('\n');

		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = 'table.csv';
		link.click();
		URL.revokeObjectURL(url);
	} catch (error) {
		toast.error(`Failed to save table as csv ${error}`);
	}
}
