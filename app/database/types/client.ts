import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { Sql } from 'postgres';

/**
 * Represents a database instance.
 * @template S - The schema of the database.
 */
export interface DatabaseInstance<S extends Record<string, unknown>> {
	client: PostgresJsDatabase<S>;
	connection: Sql;
}
