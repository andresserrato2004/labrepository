import { WeekSchedule } from '@routes/reservations/components';
import { ReservationListProvider } from '@routes/reservations/providers';

export { loader } from '@routes/reservations/loader';
export { meta } from '@routes/reservations/meta';

export default function Schedules() {
	return (
		<div>
			<h2>Schedules</h2>
			<ReservationListProvider>
				<WeekSchedule />
			</ReservationListProvider>
		</div>
	);
}
