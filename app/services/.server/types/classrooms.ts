import type { NewClassroom, UpdateClassroom } from '@database/types';
import type { Session } from '@services/server/types';

/**
 * Arguments required to create a new classroom.
 */
export interface CreateClassroomArgs {
	request: NewClassroom;
	session: Session;
}

/**
 * Arguments required to update a classroom.
 */
export interface UpdateClassroomArgs {
	request: UpdateClassroom;
	session: Session;
}
