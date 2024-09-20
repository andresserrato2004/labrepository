import type { AppColor, KeysOfType } from '@components/types';
import type { useServiceAsyncList } from '@hooks/lists';
import type { DropdownProps } from '@nextui-org/dropdown';
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
 * Represents an action that can be performed on multiple rows in a table.
 * @template T - The type of the items in the table.
 */
export interface AppTableAction<T> {
	icon: ReactElement;
	label: string;
	key?: string;
	description?: string;
	className?: string;
	color?: AppColor;
	isDisabled?: (items: T[]) => boolean;
	action: (items: T[]) => void;
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
	isDisabled?: (item: T) => boolean;
	action: (item: T) => void;
}

/**
 * Represents a section of actions for a single row in a table.
 *
 * @template T - The type of the item that the actions will operate on.
 */
export interface SingleRowActionSection<T> {
	title: string;
	showDivider?: boolean;
	actions: (SingleRowAction<T> | ((item: T) => SingleRowAction<T>))[];
}

/**
 * Interface representing the properties for the AppTable component.
 *
 * @template T - The type of the items in the table.
 * @extends TableProps
 */
export interface AppTableProps<T extends Record<string, unknown>>
	extends TableProps {
	columns: AppTableColumn<T>[];
	list: ReturnType<typeof useServiceAsyncList<T>>;
	itemKey: KeysOfType<T, string | number>;
	singleRowSections?: (
		| SingleRowActionSection<T>
		| ((item: T) => SingleRowActionSection<T>)
	)[];
	tableActions?: (AppTableAction<T> | ((items: T[]) => AppTableAction<T>))[];
}

/**
 * Interface representing the properties for the ActionsButton component.
 */
export interface ActionsButtonProps<T> extends Omit<DropdownProps, 'children'> {
	tableActions?: (AppTableAction<T> | ((items: T[]) => AppTableAction<T>))[];
	items: T[];
}

/**
 * Props for the AppTableActionsMenu component.
 *
 * @template T - The type of the item.
 */
export interface AppTableActionsMenuProps<T> {
	sections: (
		| SingleRowActionSection<T>
		| ((item: T) => SingleRowActionSection<T>)
	)[];
	item: T;
}
