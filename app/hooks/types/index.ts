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
