import type { NewClassroom } from '@database/types';
import type { Session } from '@services/server/types';

/**
 * Arguments required to create a new classroom.
 */
export interface CreateClassroomArgs {
	request: NewClassroom;
	session: Session;
}
