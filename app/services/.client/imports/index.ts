import { toast } from '@components';

import readExcelFile from 'read-excel-file';

/**
 * Prompts the user to select an Excel (.xlsx) file and reads its contents.
 *
 * @template T - The type of the objects to be returned.
 *
 * @returns A promise that resolves to an array of objects of type T
 * or null if no file is selected or an error occurs.
 *
 * @remarks
 * The first row of the Excel file is expected to contain the keys for the objects.
 * Subsequent rows are mapped to objects of type T.
 * If the file contains no data or only one row (the header), an error toast is shown.
 *
 * @example
 * ```typescript
 * interface MyData {
 *   name: string;
 *   age: string;
 * }
 *
 * importExcelFile<MyData>().then((data) => {
 *   if (data) {
 *     console.log(data);
 *   } else {
 *     console.log('No data imported');
 *   }
 * });
 * ```
 */
export async function importExcelFile<T>() {
	return new Promise<T[] | null>((resolve, _reject) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.xlsx';
		input.onchange = async () => {
			try {
				if (!input.files || input.files.length <= 0) {
					return resolve(null);
				}

				const file = input.files[0];
				const rows = await readExcelFile(file);

				if (rows.length <= 1) {
					toast.error('No data found in the file');
					return;
				}

				const data = rows.slice(1).map((row) => {
					return row.reduce((acc, value, index) => {
						const key = rows[0][index] as keyof T;
						acc[key] = value.toString().trim() as T[keyof T];

						return acc;
					}, {} as T);
				});

				resolve(data);
			} catch (error) {
				toast.error(`Error reading file: ${error}`);
				resolve(null);
			}
		};

		input.click();
		input.remove();
	});
}
