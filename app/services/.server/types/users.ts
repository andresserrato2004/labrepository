import type { NewUser } from '@database/types';

/**
 * Represents the arguments for creating a user.
 */
export interface CreateUserArgs {
	request: NewUser;
}
