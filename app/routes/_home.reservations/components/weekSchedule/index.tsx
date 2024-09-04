import { useReservationList } from '@routes/reservations/providers';

import styles from './styles.module.css';

export function WeekSchedule() {
	const reservationList = useReservationList();

	return (
		<div className={styles.scheduleContainer}>
			<h3 className={styles.classroomTitle}>Test title</h3>
			<p>Lab info {JSON.stringify(reservationList.items, null, 4)}</p>
		</div>
	);
}
