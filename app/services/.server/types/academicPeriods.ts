import type { NewAcademicPeriod } from '@database/types';
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
