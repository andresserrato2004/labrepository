import { MissingEnvironmentVariableError } from '@errors/services';
import { createCookie } from '@remix-run/node';

const secret = process.env.COOKIE_SECRET;

if (!secret) {
	throw new MissingEnvironmentVariableError('COOKIE_SECRET');
}

const sessionToken = createCookie('__session', {
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'strict',
	httpOnly: true,
	secrets: [secret],
});

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
