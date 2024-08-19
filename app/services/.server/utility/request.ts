import type { FormDataValidator } from '@database/types';
import type { SafeParseError, SafeParseSuccess } from 'zod';

/**
 * Parses the form data from a request using a validator.
 *
 * If the form data cannot be parsed, the function returns null.
 * Otherwise, it returns the parsed form data as a zod safe parse result.
 *
 * @param request - The request object.
 * @param validator - The validator object.
 * @returns A promise that resolves to the parsed form data or null if parsing fails.
 */
export async function parseFormData<T extends FormDataValidator>(
	request: Request,
	validator: T,
) {
	let formData: FormData;

	try {
		formData = await request.formData();
	} catch {
		return null;
	}

	const result = validator.safeParse(formData);

	if (!result.success) {
		return result as SafeParseError<T['_output']>;
	}

	return result as SafeParseSuccess<T['_output']>;
}
