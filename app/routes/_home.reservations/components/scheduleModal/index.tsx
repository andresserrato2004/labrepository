import type { ModalType } from '@components/modalForm/types';
import type { FormNewReservation } from '@database/types';
import type { DateValue } from '@internationalized/date';
import type { Key } from '@react-types/shared';
import type { action } from '@routes/periods/action';

import { HiddenInput, ModalForm, toast } from '@components';
import { useModalForm } from '@components/modalForm/providers';
import {
	fromDate,
	getLocalTimeZone,
	parseZonedDateTime,
} from '@internationalized/date';
// import { useFetcherErrors } from '@hooks/fetcher';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { TimeInput } from '@nextui-org/date-input';
import { DatePicker } from '@nextui-org/date-picker';
import { Input, Textarea } from '@nextui-org/input';
import { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/modal';
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

	const [userId, setUserId] = useState<Key>(modalData?.userId ?? '');
	const [classroomId, setClassroomId] = useState<Key>(
		modalData?.classroomId ?? '',
	);
	const [date, setDate] = useState<DateValue | null>(null);

	// const { clearErrors, createErrorProps } = useFetcherErrors(fetcher);

	const isLoading = fetcher.state !== 'idle';
	const isDetails = modalType === 'details';

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
		}
	}, [modalData]);

	const handleUserIdChange = (value: Key | null) => {
		setUserId(value ?? '');
	};

	const handleClassroomIdChange = (value: Key | null) => {
		setClassroomId(value ?? '');
	};

	const handleDateChange = (value: DateValue | null) => {
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

	return (
		<ModalForm>
			<ModalHeader className='text-2xl mt-4'>
				<h2>
					{getModalTitle(modalType)} - {}
				</h2>
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
					items={userList.items}
					isLoading={userList.isLoading}
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
					items={classroomList.items}
					isLoading={classroomList.isLoading}
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
				/>
				<TimeInput
					label='Start hour'
					name='startHour'
					variant='faded'
					className='col-span-3'
					defaultValue={
						modalData
							? parseZonedDateTime(modalData.date)
							: undefined
					}
					hideTimeZone={true}
					isRequired={true}
				/>
				<TimeInput
					label='End hour'
					name='endHour'
					variant='faded'
					className='col-span-3'
					isRequired={true}
				/>
				<Textarea
					label='Description'
					name='description'
					variant='faded'
					className='col-span-12'
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
