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

/**
 * Represents an error that occurs when one or more required environment variables are missing.
 * This error can throw at runtime anywhere in the application.
 */
export class MissingEnvironmentVariablesError extends Error {
	constructor(variables: string[]) {
		super(`Missing environment variables: ${variables.join(', ')}`);
		this.name = 'MissingEnvironmentVariablesError';
	}
}
