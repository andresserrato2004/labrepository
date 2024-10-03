import { RouteTitle } from '@components';
import { ModalFormProvider } from '@components/modalForm/providers';
import { ClassroomModal, ClassroomTable } from '@routes/classrooms/components';

export { action } from '@routes/classrooms/action';
export { meta } from '@routes/classrooms/meta';

export default function ClassroomsRoute() {
	return (
		<>
			<RouteTitle>Classrooms</RouteTitle>
			<ModalFormProvider>
				<ClassroomTable />
				<ClassroomModal />
			</ModalFormProvider>
		</>
	);
}
