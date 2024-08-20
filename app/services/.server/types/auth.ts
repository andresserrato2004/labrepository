import type { UserRole } from '@database/types';

/**
 * Represents a session object.
 */
export interface Session {
	role: UserRole;
	userId: string;
	username: string;
	name: string;
	iat: number;
	exp: number;
}
