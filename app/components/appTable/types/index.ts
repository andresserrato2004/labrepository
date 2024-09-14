import type { KeysOfType } from '@components/types';
import type { useServiceAsyncList } from '@hooks/lists';
import type { TableProps } from '@nextui-org/table';
import type { ReactNode } from 'react';

/**
 * Represents a column in the AppTable component.
 * @template T - The type of data in the table.
 */
export interface AppTableColumn<T> {
	key?: Extract<keyof T, string | number>;
	title: string;
	align?: 'start' | 'center' | 'end' | undefined;
	render: (record: T) => ReactNode;
}

export interface SingleRowAction<T> {
	icon: ReactNode;
	label: string;
	action: (item: T) => void;
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
	list: ReturnType<typeof useServiceAsyncList<T>>;
	itemKey: KeysOfType<T, string | number>;
	singleRowActions?: SingleRowAction<T>[];
}

export interface AppTableActionsMenuProps<T> {
	actions: SingleRowAction<T>[];
	item: T;
}
