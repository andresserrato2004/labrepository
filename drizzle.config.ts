import 'dotenv/config';

import { DatabaseMissingConnectionArgumentError } from '@errors/database';
import { defineConfig } from 'drizzle-kit';

if (process.env.ENV !== 'development') {
	console.error(
		`Cannot run drizzle commands in non-development environments. Current environment: ${process.env.ENV}`,
	);
	process.exit(1);
}

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

export default defineConfig({
	schema: './app/database/schema/tables.ts',
	out: './.drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		user: user,
		password: password,
		host: host,
		port: Number.parseInt(port),
		database: database,
	},
});
