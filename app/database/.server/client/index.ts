import type { DatabaseInstance } from '@database/types';

import { DatabaseMissingConnectionArgumentError } from '@errors/database';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from '@database/schema/tables';
import * as postgres from 'postgres';

/**
 * Represents a singleton instance of a database connection.
 * This class is used to create a single connection to the database.
 */
class DatabaseSingleton {
	private static instance: DatabaseInstance<typeof schema>;

	private constructor() {}

	public static getInstance(): DatabaseInstance<typeof schema> {
		if (!DatabaseSingleton.instance) {
			const user = process.env.DB_USER;
			const password = process.env.DB_PASSWORD;
			const host = process.env.DB_HOST;
			const port = process.env.DB_PORT;
			const database = process.env.DB_NAME;

			if (!user || !password || !host || !port || !database) {
				throw new DatabaseMissingConnectionArgumentError({
					user,
					password,
					host,
					port,
					database,
				});
			}

			const connection = postgres.default({
				user,
				password,
				host,
				port: Number.parseInt(port),
				database,
			});

			DatabaseSingleton.instance = {
				client: drizzle<typeof schema>(connection, { schema }),
				connection: connection,
			};
		}

		return DatabaseSingleton.instance;
	}
}

export const database = DatabaseSingleton.getInstance().client;
export const connection = DatabaseSingleton.getInstance().connection;
