import type { DatabaseMissingConnectionArgumentErrorConstructor } from '@errors/types';

/**
 * Represents an error that occurs when there is a problem connecting to the database.
 */
export class DatabaseConnectionError extends Error {
	constructor() {
		super('Error connecting to the database');
		this.name = 'DatabaseConnectionError';
	}
}

/**
 * Represents an error that occurs when there are missing connection arguments for a database.
 * @see {@link DatabaseMissingConnectionArgumentErrorConstructor}
 * @see {@link https://node-postgres.com/features/connecting|Node-Postgres}
 */
export class DatabaseMissingConnectionArgumentError extends Error {
	constructor(args: DatabaseMissingConnectionArgumentErrorConstructor) {
		const requiredArguments = [
			'host',
			'user',
			'password',
			'port',
			'database',
		];

		const missingArguments = requiredArguments.filter((argument) => {
			const key =
				argument as keyof DatabaseMissingConnectionArgumentErrorConstructor;

			return !args[key];
		});

		super(`Missing arguments: [${missingArguments.join(', ')}]`);
		this.name = 'DatabaseMissingConnectionArgumentError';
	}
}
