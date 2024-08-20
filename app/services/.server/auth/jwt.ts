import { MissingEnvironmentVariableError } from '@errors/shared';
import { createSigner, createVerifier } from 'fast-jwt';

const secret = process.env.JWT_SECRET;

if (!secret) {
	throw new MissingEnvironmentVariableError('JWT_SECRET');
}

const signer = createSigner({ key: process.env.JWT_SECRET, expiresIn: '1h' });
const verifier = createVerifier({ key: process.env.JWT_SECRET });

/**
 * Signs the payload using JWT.
 *
 * @param payload - The payload to be signed.
 * @returns The signed JWT string.
 */
export function sign(payload: Record<string, unknown>): string {
	return signer(payload);
}

/**
 * Decodes a JWT token.
 *
 * @param token - The JWT token to decode.
 * @returns The decoded token or null if decoding fails.
 * @template T - The type of the decoded token.
 */
export function decode<T>(token: string): T | null {
	try {
		return verifier(token);
	} catch {
		return null;
	}
}
