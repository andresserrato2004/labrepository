import type { UseDeferredServiceResponseResult } from '@hooks/types';
import type { ServiceResponse } from '@services/server/types';

import {
	ResponseType,
	createServerErrorResponse,
} from '@services/shared/utility';
import { useEffect, useState } from 'react';

/**
 * Custom hook that handles a deferred service response.
 *
 * @template S - The type of the service response data.
 * @param {Promise<ServiceResponse<S>>} promise - The promise representing the service response.
 * @returns {UseDeferredServiceResponseResult<S>} - An object containing the loading state and the data from the service response.
 */
export function useDeferredServiceResponse<S>(
	promise: Promise<ServiceResponse<S>>,
): UseDeferredServiceResponseResult<S> {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<S | undefined>(undefined);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Because the promise is the only dependency, we only want to run this effect once.
	useEffect(() => {
		let isMounted = true;

		promise.then((result) => {
			if (isMounted) {
				if (result.type === ResponseType.ServerError) {
					throw createServerErrorResponse(result);
				}

				setData(result.data);
				setIsLoading(false);
			}
		});

		return () => {
			isMounted = false;
		};
	}, [data]);

	return { isLoading, data };
}
