import type { UseFetcherWithResetArgs } from '@hooks/types';
import type {
	ClientErrorResponse,
	Errors,
	ServiceResponse,
} from '@services/server/types';

import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';

/**
 * Custom hook that extends the `useFetcher` hook by adding a `reset` function to clear the data.
 *
 * @template T - The type of the response data.
 *
 * @param options - The options to pass to the `useFetcher` hook.
 * @returns An object containing the fetcher state, the response data, a function to clear the data, and the `reset` function.
 */
export function useFetcherWithReset<T>(options?: UseFetcherWithResetArgs) {
	const fetcher = useFetcher<T>(options);
	const [data, setData] = useState(fetcher.data);

	useEffect(() => {
		if (fetcher.state === 'idle') {
			setData(fetcher.data);
		}
	}, [fetcher.state, fetcher.data]);

	return { ...fetcher, data, reset: () => setData(undefined) };
}

/**
 * Custom hook that handles errors returned by a fetcher.
 *
 * @template S - The type of the success response data.
 * @template E - The type of the error response data.
 *
 * @param fetcher - The fetcher instance returned by the `useFetcherWithReset` hook.
 * @returns An object containing the errors, a function to clear specific errors, and a function to create error props for a specific error key.
 */
export function useFetcherErrors<S, E>(
	fetcher: ReturnType<typeof useFetcherWithReset<ServiceResponse<S, E>>>,
) {
	const [errors, setErrors] = useState<Errors<E>>({});

	// biome-ignore lint/correctness/useExhaustiveDependencies: Because the `fetcher.reset` function is not a dependency.
	useEffect(() => {
		if (fetcher.state === 'submitting') {
			fetcher.reset();
		}
		if (fetcher.state === 'idle' && fetcher.data) {
			if (fetcher.data.type === 'clientError') {
				const data = fetcher.data as unknown as ClientErrorResponse<E>;
				setErrors({ ...data.errors });
			}

			if (fetcher.data.type === 'success') {
				setErrors({});
			}
		}
	}, [fetcher.state, fetcher.data]);

	const clearErrors = (...keys: [keyof E, ...(keyof E)[]]) => {
		return () => {
			const shouldUpdate = keys.some((key) => errors[key]);

			if (!shouldUpdate) {
				return;
			}

			setErrors((prev) => {
				const newErrors = { ...prev };

				for (const key of keys) {
					delete newErrors[key];
				}

				return newErrors;
			});
		};
	};

	const createErrorProps = (key: keyof typeof errors) => {
		const attrs = {
			isInvalid: Boolean(errors[key]),
			errorMessage: errors[key],
		};

		return attrs;
	};

	return { errors, clearErrors, createErrorProps };
}
