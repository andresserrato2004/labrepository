/**
 * Represents an error that occurs when a required environment variable is missing.
 * This error can throw at runtime anywhere in the application.
 */
export class MissingEnvironmentVariableError extends Error {
	constructor(variable: string) {
		super(`Missing environment variable: ${variable}`);
		this.name = 'MissingEnvironmentVariableError';
	}
}
