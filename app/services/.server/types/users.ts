import type { NewUser } from '@database/types';
import type { Session } from '@services/server/types';

/**
 * Represents the arguments for creating a user.
 */
export interface CreateUserArgs {
	request: NewUser;
	session: Session;
}
