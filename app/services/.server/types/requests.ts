import type { AppResource } from '@database/schema/enums';
import type {
	NewAcademicPeriod,
	NewClassroom,
	NewReservation,
	NewUser,
} from '@database/types';
import type { Session } from '@services/server/types';

//TODO: Update when more resources are added
type Data =
	| NewUser
	| NewClassroom
	| NewAcademicPeriod
	| NewReservation /*| NewRequest */;

/**
 * Represents the arguments for building a creation audit log.
 */
export interface BuildCreationAuditLogArgs {
	session: Session;
	resource: AppResource;
	newData: Data;
}

/**
 * Represents the arguments for building an update audit log.
 */
export interface BuildUpdateAuditLogArgs {
	session: Session;
	resource: AppResource;
	oldData: Data;
	newData: Data;
}
