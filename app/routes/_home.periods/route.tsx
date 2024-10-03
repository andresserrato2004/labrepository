import { RouteTitle } from '@components';
import { ModalFormProvider } from '@components/modalForm/providers';
import {
	AcademicPeriodsModal,
	AcademicPeriodsTable,
} from '@routes/periods/components';

export { meta } from '@routes/periods/meta';
export { action } from '@routes/periods/action';

export default function AcademicPeriodsRoute() {
	return (
		<>
			<RouteTitle>Academic Periods</RouteTitle>
			<ModalFormProvider>
				<AcademicPeriodsTable />
				<AcademicPeriodsModal />
			</ModalFormProvider>
		</>
	);
}
