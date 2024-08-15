export class MissingEnvironmentVariableError extends Error {
	constructor(variable: string) {
		super(`Missing environment variable: ${variable}`);
		this.name = 'MissingEnvironmentVariableError';
	}
}
