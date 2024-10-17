import type { ModalType } from '@components/modalForm/types';
import type { AcademicPeriod } from '@database/types';
import type { DateValue } from '@internationalized/date';
import type { action } from '@routes/periods/action';

import { HiddenInput, ModalForm, toast } from '@components';
import { useModalForm } from '@components/modalForm/providers';
import { useFetcherErrors } from '@hooks/fetcher';
import {
	getLocalTimeZone,
	parseAbsoluteToLocal,
	toZoned,
} from '@internationalized/date';
import { Button } from '@nextui-org/button';
import { DatePicker } from '@nextui-org/date-picker';
import { Input } from '@nextui-org/input';
import { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { ResponseType } from '@services/shared/utility';
import { useEffect, useState } from 'react';

const getModalTitle = (modalType: ModalType) => {
	switch (modalType) {
		case 'create':
			return 'Creating a new academic period';
		case 'update':
			return 'Editing academic period';
		case 'details':
			return 'Academic period details';
		default:
			return 'Modal form';
	}
};

const getSuccessMessage = (modalType: ModalType) => {
	switch (modalType) {
		case 'create':
			return 'Academic period created successfully';
		case 'update':
			return 'Academic period updated successfully';
		default:
			return 'Success';
	}
};

export function AcademicPeriodsModal() {
	const { modalType, modalData, fetcher, closeModal } = useModalForm<
		AcademicPeriod,
		typeof action
	>();
	const { clearErrors, createErrorProps } = useFetcherErrors(fetcher);
	const [startDate, setStartDate] = useState<DateValue | null>(null);
	const [endDate, setEndDate] = useState<DateValue | null>(null);
	const minEndDate = startDate ? startDate.add({ days: 1 }) : undefined;

	const isLoading = fetcher.state !== 'idle';
	const isDetails = modalType === 'details';
	const isUpdate = modalType === 'update';

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
			setStartDate(parseAbsoluteToLocal(modalData.startDate));
			setEndDate(parseAbsoluteToLocal(modalData.endDate));
		}
	}, [modalData]);

	const handleStartDateChange = (date: DateValue) => {
		setStartDate(toZoned(date, getLocalTimeZone()));
		setEndDate(null);
		clearErrors('startDate', 'endDate')();
	};

	const handleEndDateChange = (date: DateValue) => {
		setEndDate(toZoned(date, getLocalTimeZone()));
		clearErrors('endDate')();
	};

	return (
		<ModalForm>
			<ModalHeader className='text-2xl mt-4'>
				<h2>{getModalTitle(modalType)}</h2>
			</ModalHeader>
			<ModalBody className='grid grid-cols-12 p-6 gap-6'>
				{isUpdate ? (
					<HiddenInput name='id' value={modalData?.id} />
				) : null}
				<Input
					label='Name'
					name='name'
					variant='faded'
					className='col-span-12'
					isRequired={true}
					onValueChange={clearErrors('name')}
					defaultValue={modalData?.name}
					isReadOnly={isDetails}
					{...createErrorProps('name')}
				/>
				<DatePicker
					label='Start date'
					name='startDate'
					variant='faded'
					className='col-span-6'
					granularity='day'
					onChange={handleStartDateChange}
					value={startDate}
					isRequired={true}
					showMonthAndYearPickers={true}
					isReadOnly={isDetails}
					{...createErrorProps('startDate')}
				/>
				<DatePicker
					label='End date'
					name='endDate'
					variant='faded'
					className='col-span-6'
					granularity='day'
					onChange={handleEndDateChange}
					minValue={minEndDate}
					value={endDate}
					isRequired={true}
					showMonthAndYearPickers={true}
					isReadOnly={isDetails}
					{...createErrorProps('endDate')}
				/>
				{/*TODO: Implement the rest of this form*/}
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
