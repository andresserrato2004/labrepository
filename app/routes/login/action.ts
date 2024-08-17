import type { ActionFunctionArgs } from '@remix-run/node';

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();

	console.log({ formData });

	return null;
};
