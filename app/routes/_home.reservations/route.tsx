import { ReservationListProvider } from './providers';

export { loader } from '@routes/reservations/loader';

export default function Schedules() {
	return (
		<div>
			<h2>Schedules</h2>
			<ReservationListProvider>Main content</ReservationListProvider>
		</div>
	);
}
