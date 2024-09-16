import type { AppColor, KeysOfType } from '@components/types';
import type { useServiceAsyncList } from '@hooks/lists';
import type { TableProps } from '@nextui-org/table';
import type { ReactElement, ReactNode } from 'react';

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

/**
 * Represents an action that can be performed on a single row in a table.
 *
 * @template T - The type of the item on which the action will be performed.
 */
export interface SingleRowAction<T> {
	icon: ReactElement;
	label: string;
	key?: string;
	description?: string;
	className?: string;
	color?: AppColor;
	action: (item: T) => void;
}

/**
 * Represents a section of actions that can be performed on a single row in a table.
 *
 * @template T - The type of the data associated with each action.
 */
export interface SingleRowActionSection<T> {
	title: string;
	showDivider?: boolean;
	actions: SingleRowAction<T>[];
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
	singleRowSections?: SingleRowActionSection<T>[];
}

/**
 * Interface representing the properties for the AppTableActionsMenu component.
 */
export interface AppTableActionsMenuProps<T> {
	sections: SingleRowActionSection<T>[];
	item: T;
}
