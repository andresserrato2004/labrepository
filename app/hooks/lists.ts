import type {
	UseServiceAsyncListOptions,
	UseServiceAsyncListPromise,
} from '@hooks/types';
import type { SortDescriptor } from '@nextui-org/table';

import { useAsyncList } from '@react-stately/data';
import {
	ResponseType,
	createServerErrorResponse,
} from '@services/shared/utility';
import { useMemo, useState } from 'react';

import dayjs from 'dayjs';

/**
 * Checks if the provided date string is a valid date.
 *
 * @param date - The date string to validate.
 * @returns `true` if the date string is valid, `false` otherwise.
 */
function isValidDate(date: string): boolean {
	return dayjs(date).isValid();
}

/**
 * Sorts an array of items based on the provided sort descriptor.
 *
 * @template T - The type of items in the array.
 * @param {T[]} items - The array of items to be sorted.
 * @param {SortDescriptor} sortDescriptor - The descriptor that defines the column to sort by and the direction of sorting.
 * @returns The sorted array of items.
 *
 * @example
 * interface Item {
 *   name: string;
 *   age: number;
 *   date: string;
 * }
 *
 * const items: Item[] = [
 *   { name: 'Alice', age: 30, date: '2023-01-01' },
 *   { name: 'Bob', age: 25, date: '2023-01-02' },
 *   { name: 'Charlie', age: 35, date: '2023-01-03' },
 * ];
 *
 * const sortDescriptor: SortDescriptor = { column: 'age', direction: 'ascending' };
 * const sortedItems = sortItems(items, sortDescriptor);
 * // sortedItems will be sorted by age in ascending order
 */
function sortItems<T>(items: T[], sortDescriptor: SortDescriptor) {
	return items.sort((a, b) => {
		const first = a[sortDescriptor.column as keyof T] ?? '';
		const second = b[sortDescriptor.column as keyof T] ?? '';

		let cmp = 0;

		if (typeof first === 'number' && typeof second === 'number') {
			cmp = first < second ? -1 : 1;
		} else if (
			isValidDate(first.toString()) &&
			isValidDate(second.toString())
		) {
			cmp = dayjs(first.toString()).diff(dayjs(second.toString()));
		} else {
			cmp = first.toString().localeCompare(second.toString());
		}

		if (sortDescriptor.direction === 'descending') {
			cmp *= -1;
		}

		return cmp;
	});
}

/**
 * Custom hook to manage an asynchronous list with pagination and sorting capabilities.
 *
 * @template S - The type of the items in the list.
 * @param {UseServiceAsyncListPromise<S>} promise - A promise that resolves to the list data.
 * @param {UseServiceAsyncListOptions<S>} options - Configuration options for the list.
 * @returns The result object containing the list data and pagination state.
 */
export function useServiceAsyncList<S>(
	promise: UseServiceAsyncListPromise<S>,
	options: UseServiceAsyncListOptions<S>,
) {
	const [page, setPage] = useState(1);

	const list = useAsyncList<S>({
		initialSortDescriptor: options.initialSortDescriptor ?? {
			column: 'createdAt',
			direction: 'descending',
		},

		async load({ sortDescriptor }) {
			const response = await promise;

			if (response.type !== ResponseType.Success) {
				throw createServerErrorResponse(response);
			}

			if (sortDescriptor) {
				response.data = sortItems(response.data, sortDescriptor);
			}

			return {
				items: response.data,
			};
		},

		sort({ items, sortDescriptor }) {
			return {
				items: sortItems(items, sortDescriptor),
			};
		},
	});

	const pageSize = 9;

	const totalPages = Math.ceil(Math.max(list.items.length, 1) / pageSize);

	const paginatedItems = useMemo(() => {
		const start = (page - 1) * pageSize;
		const end = start + pageSize;

		return list.items.slice(start, end);
	}, [list.items, page]);

	return {
		...list,
		pageSize,
		paginatedItems,
		totalPages,
		page,
		setPage,
	};
}
