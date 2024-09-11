import type { TypedResponse } from '@remix-run/node';
import type {
	ClientErrorResponse,
	SuccessResponse,
} from '@services/server/types';
import type { Errors } from '@services/server/types';
import type { ServerErrorResponse } from '@services/server/types';
import type { ZodError } from 'zod';

import { AppError } from '@errors/services';
import { json } from '@remix-run/react';
import {
	ClientErrorCode,
	ResponseType,
	ServerErrorCode,
	SuccessCode,
} from '@services/shared/utility';

/**
 * Checks if the given code is a success code.
 *
 * @param code - The code to check.
 * @returns A boolean indicating whether the code is a success code.
 */
export function isSuccessCode(code: number): code is SuccessCode {
	return SuccessCode[code] !== undefined;
}

/**
 * Checks if the provided code is a client error code.
 *
 * @param code - The code to check.
 * @returns A boolean indicating whether the code is a client error code.
 */
export function isClientErrorCode(code: number): code is ClientErrorCode {
	return ClientErrorCode[code] !== undefined;
}

/**
 * Checks if the given code is a server error code.
 *
 * @param code - The code to check.
 * @returns `true` if the code is a server error code, `false` otherwise.
 */
export function isServerErrorCode(code: number): code is ServerErrorCode {
	return ServerErrorCode[code] !== undefined;
}

/**
 * Creates a Remix json response object for the given service response.
 *
 * @param serviceResponse - The service response object.
 * @returns The JSON response with the specified status code.
 */
export function createResponse<S, E>(
	serviceResponse: SuccessResponse<S> | ClientErrorResponse<E>,
) {
	return json(serviceResponse, {
		status: serviceResponse.code,
	}) as TypedResponse<SuccessResponse<S> | ClientErrorResponse<E>>;
}

export function createBasicResponse(
	message: string | null,
	code: SuccessCode,
): TypedResponse<SuccessResponse<typeof message>>;

export function createBasicResponse(
	message: string,
	code: ClientErrorCode,
): TypedResponse<ClientErrorResponse<{ message: string }>>;

/**
 * Creates a basic response object based on the provided message and code.
 * @param message - The message to include in the response.
 * @param code - The success code or client error code.
 * @returns The JSON response object.
 * @throws {TypeError} If the code is invalid or if the message is null for a client error code.
 */
export function createBasicResponse(
	message: string | null,
	code: SuccessCode | ClientErrorCode,
) {
	if (isSuccessCode(code)) {
		const response: SuccessResponse<typeof message> = {
			code: code,
			type: ResponseType.Success,
			data: message,
		};

		return json(response, {
			status: code,
		});
	}

	if (isClientErrorCode(code)) {
		if (message === null) {
			throw new TypeError('Client error message cannot be null');
		}

		const response: ClientErrorResponse<{ message: string }> = {
			code: code,
			type: ResponseType.ClientError,
			errors: { message },
		};

		return json(response, {
			status: code,
		});
	}

	throw new TypeError(
		`Invalid code: ${code}. Expected SuccessCode or ClientErrorCode`,
	);
}

/**
 * Extracts errors from a ZodError object and returns them as a dictionary
 * typed to the object containing the errors.
 *
 * @template T - The type of the object containing the errors.
 * @param {ZodError<T>} error - The ZodError object to extract errors from.
 * @returns {Errors<T>} - A dictionary containing the extracted errors.
 */
export function getErrorsFromZodError<T>(error: ZodError<T>): Errors<T> {
	const errors: Errors<T> = {};

	for (const issue of error.issues) {
		errors[issue.path.join('.') as keyof T] = issue.message;
	}

	return errors;
}

/**
 * Creates a server error response.
 * @param {ServerErrorResponse} options - The options for creating the server error response.
 * @param {number} options.code - The status code of the response.
 * @param {string} options.logId - The log ID of the response.
 * @returns {Response} The server error response.
 * @see {@link https://remix.run/docs/en/main/guides/errors | Remix Error Handling}
 */
export function createServerErrorResponse({
	code,
	logId,
}: ServerErrorResponse): Response {
	return new Response(logId, {
		status: code,
	});
}

/**
 * Checks if the given error is an instance of AppError.
 *
 * @param error - The error to check.
 * @returns A boolean indicating whether the error is an instance of AppError.
 * @template T - The type of the AppError.
 */
export function isAppError<T>(error: unknown): error is AppError<T> {
	return error instanceof AppError;
}

/**
 * Builds the redirectTO search parameter given a request object.
 * @example
 * const request = new Request('https://example.com/users?query=Juan');
 * const redirectTo = buildRedirectTo(request);
 * console.log(redirectTo); // "redirectTo=%2Fusers%3Fquery%3DJuan"
 *
 * @param request - The request object.
 * @returns The redirect URL.
 */
export function buildRedirectTo(request: Request): string {
	const url = new URL(request.url);
	const params = new URLSearchParams();

	params.set('redirectTo', url.searchParams.toString());
	const redirectTo = params.toString().replace('=', `=${url.pathname}?`);

	return redirectTo;
}
