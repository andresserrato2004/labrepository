import type { NewUser, UpdateUser } from '@database/types';

/**
 * Represents the arguments for creating a user.
 */
export interface CreateUserArgs {
	request: NewUser;
}

/**
 * Arguments required to update a user.
 *
 * @property request - The details of the user to be updated.
 */
export interface UpdateUserArgs {
	request: UpdateUser;
}
