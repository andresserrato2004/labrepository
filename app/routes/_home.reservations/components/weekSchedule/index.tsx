import type { ExtendedReservation } from '@database/types';
import type { ReservationCellProps } from '@routes/reservations/components/types';

import { DateFormatter, parseAbsoluteToLocal } from '@internationalized/date';
import { useReservationList } from '@routes/reservations/providers';
import { getSeededRandom, getShortName } from '@services/shared/utility';
import { useRef } from 'react';

import cn from 'classnames';
import styles from './styles.module.css';

const reservationTimeFormatter = new DateFormatter('en-US', {
	hour: 'numeric',
	minute: 'numeric',
});

const getCourseClass = (course: string) => {
	const index = getSeededRandom(course, 5);

	switch (index) {
		case 1:
			return 'bg-secondary-100 text-secondary-800 after:bg-secondary-400 shadow-secondary';
		case 2:
			return 'bg-success-100 text-success-800 after:bg-success-400 shadow-success';
		case 3:
			return 'bg-warning-100 text-warning-800 after:bg-warning-400 shadow-warning';
		case 4:
			return 'bg-danger-100 text-danger-800 after:bg-danger-400 shadow-danger';
		default:
			return 'bg-primary-100 text-primary-800 after:bg-primary-400 shadow-primary';
	}
};

const getTimeFromDayStart = (date: Date) => {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	return hours - 7 + minutes / 60;
};

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
	const startOffset = getTimeFromDayStart(startTime.toDate());

	const height = hourHeight * duration;
	const top = hourHeight * startOffset;

	return (
		<div
			className={styles.scheduleBodyCellWrapper}
			style={{
				height,
				transform: `translateY(${top}px)`,
			}}
			{...divProps}
		>
			<div
				className={cn(
					styles.scheduleBodyCell,
					getCourseClass(reservation.course),
				)}
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
					{reservationTimeFormatter.format(endTime.toDate())}
				</p>
			</div>
		</div>
	);
}

export function WeekSchedule() {
	const reservationList = useReservationList();
	const wrapperRef = useRef<HTMLDivElement>(null);

	const days: ExtendedReservation[][] = reservationList.isLoading
		? []
		: reservationList.items.reduce((acc, reservation) => {
				const startTime = parseAbsoluteToLocal(reservation.startTime);
				const dayOfWeek = startTime.toDate().getDay();
				acc[dayOfWeek] = [...acc[dayOfWeek], reservation];
				return acc;
			}, new Array(7).fill([]));

	return (
		<div className={styles.scheduleContainer}>
			<div className={styles.scheduleHeader} />
			<div className={styles.scheduleBody}>
				<ScheduleHeaders />
				<ScheduleSidebar />
				<div className={styles.scheduleContentWrapper} ref={wrapperRef}>
					{reservationList.isLoading
						? 'Loading...' //TODO: Add loading state
						: days.map((reservationList, index) => (
								<div
									//TODO: Add key to the parent element
									// biome-ignore lint/suspicious/noArrayIndexKey: because the index is the day of the week
									key={index}
									className={styles.scheduleContentRow}
								>
									{reservationList.map((reservation) => (
										<ReservationCell
											key={reservation.id}
											reservation={reservation}
											wrapperRef={wrapperRef}
										/>
									))}
								</div>
							))}
				</div>
			</div>
		</div>
	);
}
