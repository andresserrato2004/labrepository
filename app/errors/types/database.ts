/**
 * Represents the constructor for the DatabaseMissingConnectionArgumentError.
 * This error is thrown when the database connection arguments are missing.
 */
export interface DatabaseMissingConnectionArgumentErrorConstructor {
	host?: string;
	user?: string;
	password?: string;
	port?: string;
	database?: string;
}
