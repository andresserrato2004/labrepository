import { MissingEnvironmentVariableError } from '@errors/shared';
import { init } from '@paralleldrive/cuid2';

if (!process.env.CUID_FINGERPRINT) {
	throw new MissingEnvironmentVariableError('CUID_FINGERPRINT');
}

/**
 * Generates a unique user ID.
 *
 * @remarks This function only must be used in the database schema definition.
 * @param {number} length - The length of the user ID.
 * @param {string} fingerprint - The fingerprint used for generating the user ID.
 * @returns {string} The generated user ID.
 */
export const createUserId = init({
	length: 8,
	fingerprint: process.env.CUID_FINGERPRINT,
});

/**
 * Generates a unique log ID.
 *
 * @remarks This function only must be used in the database schema definition.
 * @param {number} length - The length of the log ID.
 * @param {string} fingerprint - The fingerprint used for generating the log ID.
 * @returns {string} The generated log ID.
 */
export const createLogId = init({
	length: 8,
	fingerprint: process.env.CUID_FINGERPRINT,
});

/**
 * Generates a unique classroom ID.
 *
 * @remarks This function only must be used in the database schema definition.
 * @param {number} length - The length of the classroom ID.
 * @param {string} fingerprint - The fingerprint used for generating the classroom ID.
 * @returns {string} The generated classroom ID.
 */
export const createClassroomId = init({
	length: 8,
	fingerprint: process.env.CUID_FINGERPRINT,
});
