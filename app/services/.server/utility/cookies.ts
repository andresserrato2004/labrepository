import type { Session } from '@services/server/types';

import { MissingEnvironmentVariableError } from '@errors/shared';
import { createCookie, redirect } from '@remix-run/node';
import { getSessionFromToken } from '@services/server/auth';
import { ResponseType, buildRedirectTo } from '@services/shared/utility';

const secret = process.env.COOKIE_SECRET;

if (!secret) {
	throw new MissingEnvironmentVariableError('COOKIE_SECRET');
}

const sessionToken = createCookie('__session', {
	secure: false, // Change when deploy over HTTPS
	sameSite: 'strict',
	httpOnly: true,
	secrets: [secret],
});

function buildAdminHeaderSession(): Session {
	return {
		name: 'x-admin-key',
		role: 'admin',
		userId: 'x-admin-key',
		username: 'x-admin-key',
		iat: 0,
		exp: 0,
	};
}

/**
 * Retrieves the token from the request's cookie.
 *
 * @param request - The request object.
 * @returns A promise that resolves to the token string or null if no token is found.
 */
export async function getTokenFromRequest(
	request: Request,
): Promise<string | null> {
	const token = await sessionToken.parse(request.headers.get('Cookie'));

	if (!token) {
		return null;
	}

	return token;
}

/**
 * Retrieves the session from the request.
 *
 * @param request - The request object.
 * @returns A promise that resolves to the session data.
 * @throws If the token is missing or the session retrieval fails, it throws a redirect error to the login page.
 */
export async function getSessionFromRequest(
	request: Request,
	redirectOnError = true,
): Promise<Session | null> {
	const adminKey = process.env.ADMIN_KEY;
	const adminHeader = request.headers.get('x-admin-key');

	if (adminKey && adminHeader && adminHeader === adminKey) {
		return buildAdminHeaderSession();
	}

	const token = await getTokenFromRequest(request);
	const sessionResponse = await getSessionFromToken(token ?? '');

	if (!token || sessionResponse.type !== ResponseType.Success) {
		if (!redirectOnError) {
			return null;
		}

		const redirectTo = buildRedirectTo(request);
		throw redirect(`/login?${redirectTo}`);
	}

	return sessionResponse.data;
}

/**
 * Creates a token cookie given a token.
 *
 * @param token - The token to be serialized.
 * @returns A promise that resolves to the serialized token cookie.
 */
export async function createTokenCookie(token: string): Promise<string> {
	return await sessionToken.serialize(token);
}

/**
 * Removes the token cookie.
 * @returns A promise that resolves to a string.
 */
export async function removeTokenCookie(): Promise<string> {
	return await sessionToken.serialize('', { maxAge: 0 });
}
