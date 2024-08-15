import type { DatabaseMissingConnectionArgumentErrorConstructor } from '@errors/types';

export class DatabaseConnectionError extends Error {
	constructor() {
		super('Error connecting to the database');
		this.name = 'DatabaseConnectionError';
	}
}

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
