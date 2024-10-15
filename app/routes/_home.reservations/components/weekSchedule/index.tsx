import type { ExtendedReservation, FormNewReservation } from '@database/types';
import type { CalendarDateTime } from '@internationalized/date';
import type { Key } from '@react-types/shared';
import type { ReservationCellProps } from '@routes/reservations/components/types';
import type { MouseEvent } from 'react';

import { useModalForm } from '@components/modalForm/providers';
import { dataAttr } from '@components/utility';
import {
	DateFormatter,
	getLocalTimeZone,
	parseAbsoluteToLocal,
	toTime,
} from '@internationalized/date';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/dropdown';
import { Input, Textarea } from '@nextui-org/input';
import { Tooltip } from '@nextui-org/tooltip';
import { CalendarDots, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useAcademicPeriods, useClassrooms } from '@routes/home/providers';
import { useReservationList } from '@routes/reservations/providers';
import { getMonday, getSunday } from '@services/shared/dates';
import { getSeededRandom, getShortName } from '@services/shared/utility';
import { useMemo, useRef } from 'react';

import dayjs from 'dayjs';

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

function ReservationDetails({
	reservation,
}: { reservation: ExtendedReservation }) {
	const startTime = dayjs(reservation.startTime).format('HH:mm A');
	const endTime = dayjs(reservation.endTime).format('HH:mm A');
	const date = dayjs(reservation.startTime).format('MMM DD, YYYY');

	return (
		<div className={styles.reservationDetails}>
			<Input
				className='col-span-12'
				label='User'
				variant='faded'
				isReadOnly={true}
				defaultValue={reservation.user.name}
			/>
			<Input
				className='col-span-6'
				label='Classroom'
				variant='faded'
				isReadOnly={true}
				defaultValue={reservation.classroom.name}
			/>
			<Input
				className='col-span-6'
				variant='faded'
				label='Course'
				isReadOnly={true}
				defaultValue={reservation.course}
			/>
			<Input
				className='col-span-4'
				label='Date'
				variant='faded'
				isReadOnly={true}
				defaultValue={date}
			/>
			<Input
				className='col-span-4'
				label='Start Time'
				variant='faded'
				isReadOnly={true}
				defaultValue={startTime}
			/>
			<Input
				className='col-span-4'
				label='End Time'
				variant='faded'
				isReadOnly={true}
				defaultValue={endTime}
			/>
			<Textarea
				className='col-span-12'
				label='Description'
				variant='faded'
				isReadOnly={true}
				defaultValue={reservation.description ?? undefined}
			/>
		</div>
	);
}

function WeekSelector() {
	const { currentPeriod, setSelectedWeek } = useAcademicPeriods();

	if (!currentPeriod.period) {
		return null;
	}

	const currentWeek = currentPeriod.startDate.add({
		weeks:
			currentPeriod.selectedWeek > 8
				? currentPeriod.selectedWeek
				: currentPeriod.selectedWeek - 1,
	});
	const monday = getMonday(currentWeek);
	const sunday = getSunday(currentWeek);

	const dateValue = currentWeek.toDate(getLocalTimeZone());
	const month = dayjs(dateValue).format('MMM');

	const weeks = Array.from({ length: 17 }).map((_, index) => ({
		label: `Week ${index + 1}`,
		value: index + 1,
		key: index + 1,
	}));

	return (
		<div className={styles.weekSelector}>
			<Button
				className={styles.weekSelectorButton}
				isIconOnly={true}
				variant='light'
				onPress={() => setSelectedWeek(currentPeriod.selectedWeek - 1)}
				isDisabled={currentPeriod.selectedWeek === 1}
			>
				<CaretLeft size={17} />
			</Button>
			<p className={styles.weekSelectorText}>
				Week {currentPeriod.selectedWeek}, {month} {monday.day} -{' '}
				{sunday.day}
			</p>
			<Button
				className={styles.weekSelectorButton}
				isIconOnly={true}
				variant='light'
				onPress={() => setSelectedWeek(currentPeriod.selectedWeek + 1)}
				isDisabled={currentPeriod.selectedWeek === 17}
			>
				<CaretRight size={17} />
			</Button>

			<Dropdown>
				<DropdownTrigger>
					<Button
						className={styles.weekCalendarButton}
						isIconOnly={true}
						variant='light'
					>
						<CalendarDots size={19} weight='duotone' />
					</Button>
				</DropdownTrigger>
				<DropdownMenu items={weeks}>
					{(item) => (
						<DropdownItem
							key={item.key}
							onPress={() => setSelectedWeek(item.value)}
							className={
								'data-[active=true]:text-primary data-[active=true]:bg-primary-50'
							}
							data-active={dataAttr(
								item.value === currentPeriod.selectedWeek,
							)}
						>
							{item.label}
						</DropdownItem>
					)}
				</DropdownMenu>
			</Dropdown>
		</div>
	);
}

function ClassroomSelector() {
	const { items, isLoading, selectedClassroom, setSelectedClassroom } =
		useClassrooms();

	const handleChange = (classroomId: Key | null) => {
		if (classroomId !== null) {
			const classroom = items.find((item) => item.id === classroomId);
			if (classroom) {
				return setSelectedClassroom(classroom);
			}

			setSelectedClassroom(null);
		}
	};

	return (
		<div className={styles.classroomSelector}>
			<Autocomplete
				defaultItems={items}
				isLoading={isLoading}
				isClearable={false}
				selectedKey={selectedClassroom?.id}
				onSelectionChange={handleChange}
				variant='faded'
				aria-label='Select classroom'
			>
				{(classroom) => (
					<AutocompleteItem key={classroom.id} value={classroom.name}>
						{classroom.name}
					</AutocompleteItem>
				)}
			</Autocomplete>
		</div>
	);
}

function ScheduleHeaders() {
	const { currentPeriod } = useAcademicPeriods();

	if (!currentPeriod.period) {
		return null;
	}

	const selectedWeek = currentPeriod.selectedWeek;

	const periodStart = currentPeriod.startDate.add({
		weeks: selectedWeek > 8 ? selectedWeek : selectedWeek - 1,
	});

	return (
		<>
			<div className={styles.scheduleHeader}>
				{Array.from({ length: 7 }).map((_, index) => {
					const day = periodStart.add({ days: index });
					const dayNumber = day.day;
					const dateValue = day.toDate(getLocalTimeZone());
					const dayOfWeek = dayjs(dateValue).format('dddd');
					const month = dayjs(dateValue).format('MMM');

					return (
						<div
							className={styles.scheduleHeaderCell}
							key={dayNumber}
						>
							<p className={styles.headerDayName}>{dayOfWeek}</p>
							<span className={styles.headerDayNumber}>
								{month} {dayNumber}
							</span>
						</div>
					);
				})}
			</div>
		</>
	);
}

function ScheduleSidebar() {
	return (
		<>
			<div className={styles.scheduleSidebar}>
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
			</div>
		</>
	);
}

function ReservationCell(props: ReservationCellProps) {
	const { openModal } = useModalForm();
	const { reservation, wrapperRef, ...divProps } = props;

	const startTime = parseAbsoluteToLocal(reservation.startTime);
	const endTime = parseAbsoluteToLocal(reservation.endTime);

	const duration = endTime.compare(startTime) / 3600 / 1000;
	const startOffset = getTimeFromDayStart(startTime.toDate());

	const height = `calc(${(100 * duration) / 12}% - 1px)`;
	const top = `${(100 * startOffset) / 12}%`;

	const handleTooltipClick = (event: MouseEvent) => {
		event.stopPropagation();
	};

	const handleReservationClick = (event: MouseEvent) => {
		event.stopPropagation();

		const startTime = parseAbsoluteToLocal(reservation.startTime);
		const endTime = parseAbsoluteToLocal(reservation.endTime);

		const date = startTime.toString();
		const startHour = dayjs(startTime.toDate()).format('HH:mm');
		const endHour = dayjs(endTime.toDate()).format('HH:mm');

		openModal<FormNewReservation>(
			{
				...reservation,
				date,
				startHour,
				endHour,
			},
			'update',
		);
	};

	return (
		<Tooltip
			content={<ReservationDetails reservation={reservation} />}
			placement='right'
			showArrow={true}
			onClick={handleTooltipClick}
			closeDelay={0}
		>
			<div
				className={styles.scheduleBodyCellWrapper}
				style={{
					height,
					top,
				}}
				onClick={handleReservationClick}
				{...divProps}
			>
				<div
					className={cn(
						styles.scheduleBodyCell,
						getCourseClass(reservation.course),
					)}
				>
					<p className={styles.reservationCourse}>
						{reservation.course}
					</p>
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
		</Tooltip>
	);
}

function ScheduleContent() {
	const { openModal } = useModalForm();
	const { currentPeriod } = useAcademicPeriods();
	const { reservationList } = useReservationList();
	const { selectedClassroom } = useClassrooms();
	const wrapperRef = useRef<HTMLDivElement>(null);

	const weekReservations = useMemo(() => {
		if (!currentPeriod.period || reservationList.isLoading) {
			return [];
		}

		const currentWeek = currentPeriod.startDate.add({
			weeks:
				currentPeriod.selectedWeek > 8
					? currentPeriod.selectedWeek
					: currentPeriod.selectedWeek - 1,
		});

		const startDate = currentWeek.toDate(getLocalTimeZone());
		const endDate = currentWeek.add({ days: 7 }).toDate(getLocalTimeZone());

		return reservationList.items.filter(
			(reservation) =>
				dayjs(reservation.startTime).toDate() >= startDate &&
				dayjs(reservation.endTime).toDate() <= endDate &&
				reservation.classroomId === selectedClassroom?.id,
		);
	}, [
		reservationList.items,
		reservationList.isLoading,
		currentPeriod,
		selectedClassroom,
	]);

	const days: ExtendedReservation[][] = useMemo(() => {
		return weekReservations.reduce((acc, reservation) => {
			const startTime = parseAbsoluteToLocal(reservation.startTime);
			const dayOfWeek = startTime.toDate().getDay();

			const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

			acc[index] = [...acc[index], reservation];
			return acc;
		}, new Array(7).fill([]));
	}, [weekReservations]);

	const handleClick = (event: MouseEvent) => {
		if (!wrapperRef.current || !currentPeriod.period) {
			return;
		}

		const relativeY =
			event.clientY - wrapperRef.current.getBoundingClientRect().top;
		const relativeX = wrapperRef.current.getBoundingClientRect().left;
		const hourHeight = wrapperRef.current.clientHeight / 12;
		const dayWidth = wrapperRef.current.clientWidth / 7;
		const hour = Math.floor(relativeY / hourHeight) + 7;
		const day = Math.floor((event.clientX - relativeX) / dayWidth);

		const date = currentPeriod.startDate
			.add({
				weeks:
					currentPeriod.selectedWeek > 8
						? currentPeriod.selectedWeek
						: currentPeriod.selectedWeek - 1,
				days: day,
			})
			.set({ hour, minute: 0 }) as CalendarDateTime;

		const reservation: FormNewReservation = {
			course: '',
			classroomId: selectedClassroom?.id ?? '',
			date: date.toString(),
			startHour: toTime(date).toString(),
			endHour: toTime(date).toString(),
			userId: '',
		};

		openModal<FormNewReservation>(reservation, 'create');
	};

	return (
		<>
			<ScheduleHeaders />
			<ScheduleSidebar />
			{reservationList.isLoading ? (
				'Loading...'
			) : (
				<div className={styles.scheduleContentWrapper} ref={wrapperRef}>
					{days.map((reservationList, index) => (
						<div
							//TODO: Add key to the parent element
							// biome-ignore lint/suspicious/noArrayIndexKey: because the index is the day of the week
							key={index}
							className={styles.scheduleContentRow}
							onClick={handleClick}
							onKeyDown={undefined}
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
			)}
		</>
	);
}

function MissingCurrentPeriod() {
	return (
		<div className={styles.missingPeriod}>
			<p>
				There is no current academic period. Please contact your
				administrator to set one up.
			</p>
		</div>
	);
}

export function WeekSchedule() {
	const { currentPeriod } = useAcademicPeriods();

	return (
		<div className={styles.scheduleContainer}>
			<div className={styles.scheduleTopContent}>
				<WeekSelector />
				<ClassroomSelector />
			</div>
			<div className={styles.scheduleBody}>
				{currentPeriod.period ? (
					<ScheduleContent />
				) : (
					<MissingCurrentPeriod />
				)}
			</div>
		</div>
	);
}
