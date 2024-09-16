import type {
	ServerErrorResponse,
	SuccessResponse,
} from '@services/server/types';

/**
 * Represents the arguments for the `useFetcherWithReset` hook.
 */
export interface UseFetcherWithResetArgs {
	key?: string;
}

/**
 * Represents the response result of the `useDeferredService` hook.
 * @template T - The type of data returned by the service.
 */
export interface UseDeferredServiceResponseResult<T> {
	isLoading: boolean;
	data: T | undefined;
}

/**
 * A type representing a promise that resolves to either a successful response
 * containing an array of service objects or a server error response.
 *
 * @template S - The type of the service objects in the successful response.
 */
export type UseServiceAsyncListPromise<S> = Promise<
	SuccessResponse<S[]> | ServerErrorResponse
>;

/**
 * Options for the `useServiceAsyncList` hook.
 *
 * @template S - The type of the items in the list.
 *
 * @property filter - A function to filter items based on a search value.
 * @property initialSortDescriptor - An optional object to specify the initial sorting of the list.
 * @property initialSortDescriptor.column - The column to sort by, which must be a key of the item type.
 * @property initialSortDescriptor.direction - The direction of the sort, either 'ascending' or 'descending'.
 */
export type UseServiceAsyncListOptions<S> = {
	filter?: (item: S, searchValue: string) => boolean;
	initialSortDescriptor?: {
		column: Extract<keyof S, string | number>;
		direction: 'ascending' | 'descending';
	};
};
