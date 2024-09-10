import { RouteTitle } from '@components';
import { WeekSchedule } from '@routes/reservations/components';
import { ReservationListProvider } from '@routes/reservations/providers';

export { loader } from '@routes/reservations/loader';
export { meta } from '@routes/reservations/meta';

export default function Schedules() {
	return (
		<div>
			<RouteTitle>Reservations</RouteTitle>
			<ReservationListProvider>
				<WeekSchedule />
			</ReservationListProvider>
		</div>
	);
}
