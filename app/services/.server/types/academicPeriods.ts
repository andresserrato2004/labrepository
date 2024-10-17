import type { NewAcademicPeriod, UpdateAcademicPeriod } from '@database/types';
import type { Session } from '@services/server/types';

/**
 * Arguments required to create new academic periods.
 *
 * @property {NewAcademicPeriod} request - The new academic period details.
 * @property {Session} session - The session information.
 */
export interface CreateAcademicPeriodsArgs {
	request: NewAcademicPeriod;
	session: Session;
}

/**
 * Arguments required to update academic periods.
 *
 * @property {UpdateAcademicPeriod} request - The updated academic period details.
 * @property {Session} session - The session information.
 */
export interface UpdateAcademicPeriodArgs {
	request: UpdateAcademicPeriod;
	session: Session;
}
