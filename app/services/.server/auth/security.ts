import { MissingEnvironmentVariableError } from '@errors/services';
import { hash, verify } from 'argon2';

const secret = process.env.ARGON2_SECRET;
const options = {
	secret: Buffer.alloc(16, secret),
};

if (!secret) {
	throw new MissingEnvironmentVariableError('ARGON2_SECRET');
}

/**
 * Hashes a password using Argon2.
 *
 * @param password - The password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export function hashPassword(password: string): Promise<string> {
	return hash(password, options);
}

/**
 * Compares a password with its hash.
 *
 * @param password - The password to compare.
 * @param hash - The hash to compare against.
 * @returns A promise that resolves to a boolean indicating whether the password matches the hash.
 */
export function comparePassword(
	password: string,
	hash: string,
): Promise<boolean> {
	return verify(hash, password, options);
}
