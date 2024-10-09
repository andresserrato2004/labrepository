import { RouteTitle } from '@components';
import { ModalFormProvider } from '@components/modalForm/providers';
import {
	ReservationsModal,
	WeekSchedule,
} from '@routes/reservations/components';
import { ReservationListProvider } from '@routes/reservations/providers';

export { loader } from '@routes/reservations/loader';
export { meta } from '@routes/reservations/meta';

export default function Schedules() {
	return (
		<div>
			<RouteTitle>Reservations</RouteTitle>
			<ReservationListProvider>
				<ModalFormProvider>
					<WeekSchedule />
					<ReservationsModal />
				</ModalFormProvider>
			</ReservationListProvider>
		</div>
	);
}
