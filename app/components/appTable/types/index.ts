import type { KeysOfType } from '@components/types';
import type { TableProps } from '@nextui-org/table';
import type { useAsyncList } from '@react-stately/data';
import type { ReactNode } from 'react';

/**
 * Represents a column in the AppTable component.
 * @template T - The type of data in the table.
 */
export interface AppTableColumn<T> {
	key: keyof T;
	title: string;
	render: (record: T) => ReactNode;
}

/**
 * Represents the props for the AppTable component.
 *
 * @template T - The type of data in the table.
 * @property {AppTableColumn<T>[]} columns - The columns to be displayed in the table.
 * @property {ReturnType<typeof useAsyncList<T>>} items - The list of items to be displayed in the table.
 * @property {KeysOfType<T, string | number>} itemKey - The key used to uniquely identify each item in the table.
 */
export interface AppTableProps<T> extends TableProps {
	columns: AppTableColumn<T>[];
	items: ReturnType<typeof useAsyncList<T>>;
	itemKey: KeysOfType<T, string | number>;
}
