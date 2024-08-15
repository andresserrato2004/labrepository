import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { Sql } from 'postgres';

export interface DatabaseInstance<S extends Record<string, unknown>> {
	client: PostgresJsDatabase<S>;
	connection: Sql;
}
