import type { LoaderFunctionArgs } from '@remix-run/node';

import { defer } from '@remix-run/node';
import { getAllAcademicPeriods } from '@services/server/academicPeriods';
import { getAllClassrooms } from '@services/server/classrooms';
import { getSessionFromRequest } from '@services/server/utility';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSessionFromRequest(request);
	const academicPeriodsPromise = getAllAcademicPeriods();
	const classroomsPromise = getAllClassrooms();

	return defer({ session, academicPeriodsPromise, classroomsPromise });
};
