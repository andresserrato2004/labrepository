import type { ReservationCellProps } from '@routes/reservations/components/types';

import { DateFormatter, parseAbsoluteToLocal } from '@internationalized/date';
import { useReservationList } from '@routes/reservations/providers';
import { getShortName } from '@services/shared/utility';
import { useRef } from 'react';

import cn from 'classnames';
import styles from './styles.module.css';

const reservationTimeFormatter = new DateFormatter('en-US', {
	hour: 'numeric',
	minute: 'numeric',
});

function ScheduleHeaders() {
	return (
		<>
			<div className={styles.scheduleHeaderCell}>
				<p className={styles.headerDayName}>Monday</p>
				<span className={styles.headerDayNumber}>6</span>
			</div>
			<div className={styles.scheduleHeaderCell}>
				<p className={styles.headerDayName}>Tuesday</p>
				<span className={styles.headerDayNumber}>6</span>
			</div>
			<div className={styles.scheduleHeaderCell}>
				<p className={styles.headerDayName}>Wednesday</p>
				<span className={styles.headerDayNumber}>6</span>
			</div>
			<div className={styles.scheduleHeaderCell}>
				<p className={styles.headerDayName}>Thursday</p>
				<span className={styles.headerDayNumber}>6</span>
			</div>
			<div className={styles.scheduleHeaderCell}>
				<p className={styles.headerDayName}>Friday</p>
				<span className={styles.headerDayNumber}>6</span>
			</div>
			<div className={styles.scheduleHeaderCell}>
				<p className={styles.headerDayName}>Saturday</p>
				<span className={styles.headerDayNumber}>6</span>
			</div>
			<div className={styles.scheduleHeaderCell}>
				<p className={styles.headerDayName}>Saturday</p>
				<span className={styles.headerDayNumber}>6</span>
			</div>
		</>
	);
}

function ScheduleSidebar() {
	return (
		<>
			<div className={styles.sidebarCell}>7:00 am</div>
			<div className={styles.sidebarCell}>8:00 am</div>
			<div className={styles.sidebarCell}>9:00 am</div>
			<div className={styles.sidebarCell}>10:00 am</div>
			<div className={styles.sidebarCell}>11:00 am</div>
			<div className={styles.sidebarCell}>12:00 am</div>
			<div className={styles.sidebarCell}>1:00 pm</div>
			<div className={styles.sidebarCell}>2:00 pm</div>
			<div className={styles.sidebarCell}>3:00 pm</div>
			<div className={styles.sidebarCell}>4:00 pm</div>
			<div className={styles.sidebarCell}>5:00 pm</div>
			<div className={styles.sidebarCell}>6:00 pm</div>
			<div className={styles.sidebarCell}>7:00 pm</div>
		</>
	);
}

function ReservationCell(props: ReservationCellProps) {
	const { reservation, wrapperRef, ...divProps } = props;

	const startTime = parseAbsoluteToLocal(reservation.startTime);
	const endTime = parseAbsoluteToLocal(reservation.endTime);

	const hourHeight = (wrapperRef.current?.clientHeight ?? 0) / 13;
	const duration = endTime.compare(startTime) / 3600 / 1000;
	const startOffset = startTime.hour - 7;

	const height = hourHeight * duration;
	const top = hourHeight * startOffset;

	return (
		<div
			className={cn(
				styles.scheduleBodyCell,
				'bg-primary-100 text-primary-800 after:bg-primary-400 border-primary-400',
			)}
			style={{
				height,
				transform: `translateY(${top}px)`,
			}}
			{...divProps}
		>
			<p className={styles.reservationCourse}>{reservation.course}</p>
			<p className={styles.reservationUser}>
				{getShortName(reservation.user.name)}
			</p>
			<p className={styles.reservationTime}>
				{reservationTimeFormatter.format(
					new Date(reservation.startTime),
				)}
				&nbsp;-&nbsp;
				{reservationTimeFormatter.format(new Date(reservation.endTime))}
			</p>
		</div>
	);
}

export function WeekSchedule() {
	const reservationList = useReservationList();

	const wrapperRef = useRef<HTMLDivElement>(null);

	return (
		<div className={styles.scheduleContainer}>
			<div className={styles.scheduleHeader} />
			<div className={styles.scheduleBody}>
				<ScheduleHeaders />
				<ScheduleSidebar />
				<div className={styles.scheduleContentWrapper} ref={wrapperRef}>
					{reservationList.isLoading
						? 'Loading...' //TODO: Add loading state
						: reservationList.items.map((reservation) => (
								<ReservationCell
									key={reservation.id}
									reservation={reservation}
									wrapperRef={wrapperRef}
								/>
							))}
				</div>
			</div>
		</div>
	);
}
