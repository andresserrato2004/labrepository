import { MissingEnvironmentVariableError } from '@errors/services';
import { init } from '@paralleldrive/cuid2';

if (!process.env.CUID_FINGERPRINT) {
	throw new MissingEnvironmentVariableError('CUID_FINGERPRINT');
}

export const createUserId = init({
	length: 8,
	fingerprint: process.env.CUID_FINGERPRINT,
});

export const createLogId = init({
	length: 8,
	fingerprint: process.env.CUID_FINGERPRINT,
});
