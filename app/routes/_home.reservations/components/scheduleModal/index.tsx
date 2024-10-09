import type { ModalType } from '@components/modalForm/types';
import type { ExtendedReservation } from '@database/types';
import type { action } from '@routes/periods/action';

import { ModalForm, toast } from '@components';
import { useModalForm } from '@components/modalForm/providers';
import { useFetcherErrors } from '@hooks/fetcher';
import { Button } from '@nextui-org/button';
import { DatePicker } from '@nextui-org/date-picker';
import { Input } from '@nextui-org/input';
import { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { ResponseType } from '@services/shared/utility';
import { useEffect } from 'react';

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
	const { modalType, fetcher, closeModal } = useModalForm<
		ExtendedReservation,
		typeof action
	>();
	const { clearErrors, createErrorProps } = useFetcherErrors(fetcher);

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

	return (
		<ModalForm>
			<ModalHeader className='text-2xl mt-4'>
				<h2>{getModalTitle(modalType)}</h2>
			</ModalHeader>
			<ModalBody className='grid grid-cols-12 p-6 gap-6'>
				<Input
					label='Name'
					name='name'
					variant='faded'
					className='col-span-12'
					isRequired={true}
					onValueChange={clearErrors('name')}
					isReadOnly={isDetails}
					{...createErrorProps('name')}
				/>
				<DatePicker
					label='Start date'
					name='startDate'
					variant='faded'
					className='col-span-6'
					granularity='day'
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
