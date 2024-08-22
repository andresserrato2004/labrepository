import type { LoaderFunctionArgs } from '@remix-run/node';

import { getSessionFromRequest } from '@services/server/utility';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSessionFromRequest(request);

	return { session };
};
