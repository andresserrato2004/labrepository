import type { ModalType } from '@components/modalForm/types';
import type { FormNewReservation } from '@database/types';
import type { DateValue } from '@internationalized/date';
import type { Key } from '@react-types/shared';
import type { action } from '@routes/reservations/action';

import { HiddenInput, ModalForm, toast } from '@components';
import { useModalForm } from '@components/modalForm/providers';
import { useFetcherErrors } from '@hooks/fetcher';
import {
	fromDate,
	getLocalTimeZone,
	parseTime,
	parseZonedDateTime,
} from '@internationalized/date';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { TimeInput } from '@nextui-org/date-input';
import { DatePicker } from '@nextui-org/date-picker';
import { Input, Textarea } from '@nextui-org/input';
import { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Select, SelectItem } from '@nextui-org/select';
import { useReservationList } from '@routes/reservations/providers';
import { ResponseType } from '@services/shared/utility';
import { useEffect, useState } from 'react';

const getModalTitle = (modalType: ModalType) => {
	switch (modalType) {
		case 'create':
			return 'Creating a new reservation';
		case 'update':
			return 'Editing reservation';
		case 'details':
			return 'Reservation details';
		default:
			return 'Modal form';
	}
};

const getSuccessMessage = (modalType: ModalType) => {
	switch (modalType) {
		case 'create':
			return 'Reservation created successfully';
		case 'update':
			return 'Reservation updated successfully';
		default:
			return 'Success';
	}
};

export function ReservationsModal() {
	const { classroomList, userList } = useReservationList();
	const { modalType, modalData, fetcher, closeModal } = useModalForm<
		FormNewReservation,
		typeof action
	>();
	const { clearErrors, createErrorProps } = useFetcherErrors(fetcher);

	const [userId, setUserId] = useState<Key | null>(null);
	const [date, setDate] = useState<DateValue | null>(null);
	const [classroomId, setClassroomId] = useState<Key | null>(null);

	const [selectedWeeks, setSelectedWeeks] = useState(new Set<Key>([]));

	const weeks = Array.from({ length: 17 }).map((_, index) => ({
		label: `${index + 1}`,
		value: `${index + 1}`,
		key: `${index + 1}`,
	}));

	const isLoading = fetcher.state !== 'idle';
	const isDetails = modalType === 'details';
	const isCreate = modalType === 'create';

	useEffect(() => {
		if (!fetcher.data) {
			return;
		}

		if (fetcher.state === 'idle') {
			if (fetcher.data.type === ResponseType.Success) {
				toast.success(getSuccessMessage(modalType));
				closeModal();
				return;
			}
		}
	});

	useEffect(() => {
		if (modalData) {
			setDate(parseZonedDateTime(modalData.date));
			setUserId(modalData.userId);
			setClassroomId(modalData.classroomId);
		}
	}, [modalData]);

	const handleUserIdChange = (value: Key | null) => {
		setUserId(value ?? '');
		clearConflictErrors();
	};

	const handleClassroomIdChange = (value: Key | null) => {
		setClassroomId(value ?? '');
		clearConflictErrors();
	};

	const handleDateChange = (value: DateValue | null) => {
		clearConflictErrors();

		if (!value) {
			return;
		}

		const isZonedDateTime = value.toString().includes('/');

		if (isZonedDateTime) {
			return setDate(value);
		}

		const nativeDate = new Date(value.toString());
		const timezone = getLocalTimeZone();
		const newDate = fromDate(nativeDate, timezone);

		setDate(newDate);
	};

	const clearConflictErrors = () => {
		clearErrors('classroomId')();
		clearErrors('startTime')();
		clearErrors('endTime')();
	};

	const selectAllWeeks = () => {
		setSelectedWeeks(new Set(weeks.map((week) => week.key)));
	};

	const selectEvenWeeks = () => {
		setSelectedWeeks(
			new Set(
				weeks
					.filter((week) => Number.parseInt(week.key) % 2 === 0)
					.map((week) => week.key),
			),
		);
	};

	const selectOddWeeks = () => {
		setSelectedWeeks(
			new Set(
				weeks
					.filter((week) => Number.parseInt(week.key) % 2 !== 0)
					.map((week) => week.key),
			),
		);
	};

	const clearWeeks = () => {
		setSelectedWeeks(new Set());
	};

	const handleKeysChange = (keys: Set<Key> | 'all') => {
		if (keys === 'all') {
			selectAllWeeks();
			return;
		}

		const sortedKeys = Array.from(keys).sort((a, b) => {
			if (!Number.isNaN(Number(a)) && !Number.isNaN(Number(b))) {
				return Number(a) - Number(b);
			}

			return 0;
		});

		setSelectedWeeks(new Set(sortedKeys));
	};

	return (
		<ModalForm>
			<ModalHeader className='text-2xl mt-4'>
				<h2>{getModalTitle(modalType)}</h2>
			</ModalHeader>
			<ModalBody className='grid grid-cols-12 p-6 gap-6'>
				<Autocomplete
					label='User to reserve'
					variant='faded'
					className='col-span-12'
					isClearable={false}
					isRequired={true}
					selectedKey={userId}
					onSelectionChange={handleUserIdChange}
					defaultItems={userList.items}
					isLoading={userList.isLoading}
					{...createErrorProps('userId')}
				>
					{(user) => (
						<AutocompleteItem key={user.id}>
							{user.name}
						</AutocompleteItem>
					)}
				</Autocomplete>
				<HiddenInput name='userId' value={userId} />
				<Autocomplete
					label='Classroom'
					variant='faded'
					className='col-span-6'
					isClearable={false}
					isRequired={true}
					selectedKey={classroomId}
					onSelectionChange={handleClassroomIdChange}
					defaultItems={classroomList.items}
					isLoading={classroomList.isLoading}
					{...createErrorProps('classroomId')}
				>
					{(classroom) => (
						<AutocompleteItem key={classroom.id}>
							{classroom.name}
						</AutocompleteItem>
					)}
				</Autocomplete>
				<HiddenInput name='classroomId' value={classroomId} />
				<Input
					label='Course'
					name='course'
					variant='faded'
					className='col-span-6'
					isRequired={true}
					defaultValue={modalData?.course}
					onChange={clearErrors('course')}
					{...createErrorProps('course')}
				/>
				<DatePicker
					label='Date'
					name='date'
					variant='faded'
					className='col-span-6'
					granularity='day'
					value={date}
					onChange={handleDateChange}
					isRequired={true}
					{...createErrorProps('startTime')}
				/>
				<TimeInput
					label='Start hour'
					name='startHour'
					variant='faded'
					className='col-span-3'
					defaultValue={
						modalData ? parseTime(modalData.startHour) : undefined
					}
					hideTimeZone={true}
					isRequired={true}
					onChange={clearConflictErrors}
					{...createErrorProps('startTime')}
				/>
				<TimeInput
					label='End hour'
					name='endHour'
					variant='faded'
					className='col-span-3'
					defaultValue={
						modalData ? parseTime(modalData.endHour) : undefined
					}
					isRequired={true}
					hideTimeZone={true}
					onChange={clearConflictErrors}
					{...createErrorProps('startTime')}
				/>
				{isCreate ? (
					<>
						<Select
							items={weeks}
							className='col-span-12'
							selectionMode='multiple'
							variant='faded'
							label='Repeat on weeks'
							selectedKeys={selectedWeeks}
							onSelectionChange={handleKeysChange}
						>
							{(item) => (
								<SelectItem key={item.key} value={item.key}>
									{item.label}
								</SelectItem>
							)}
						</Select>
						<HiddenInput
							name='repeatOnWeeks'
							value={Array.from(selectedWeeks).join(',')}
						/>
						<Button className='col-span-3' onClick={selectAllWeeks}>
							All weeks
						</Button>
						<Button
							className='col-span-3'
							onClick={selectEvenWeeks}
						>
							Even weeks
						</Button>
						<Button className='col-span-3' onClick={selectOddWeeks}>
							Odd weeks
						</Button>
						<Button className='col-span-3' onClick={clearWeeks}>
							Clear
						</Button>
					</>
				) : null}
				<Textarea
					label='Description'
					name='description'
					variant='faded'
					className='col-span-12'
					onChange={clearErrors('description')}
					defaultValue={modalData?.description ?? ''}
					{...createErrorProps('description')}
				/>
			</ModalBody>
			<ModalFooter>
				<Button
					color='danger'
					variant='light'
					onPress={closeModal}
					isDisabled={isLoading}
				>
					Cancel
				</Button>
				<Button
					color='primary'
					type='submit'
					isLoading={isLoading}
					isDisabled={isDetails}
				>
					Confirm
				</Button>
			</ModalFooter>
		</ModalForm>
	);
}
