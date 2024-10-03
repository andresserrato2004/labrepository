import { RouteTitle } from '@components';
import { ClassroomTable } from '@routes/classrooms/components';

export { meta } from '@routes/classrooms/meta';

export default function ClassroomsRoute() {
	return (
		<>
			<RouteTitle>Classrooms</RouteTitle>
			<ClassroomTable />
		</>
	);
}
