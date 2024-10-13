import type { ModalType } from '@components/modalForm/types';
import type { ExtendedReservation } from '@database/types';
import type { Key } from '@react-types/shared';
import type { action } from '@routes/periods/action';

import { HiddenInput, ModalForm, toast } from '@components';
import { useModalForm } from '@components/modalForm/providers';
// import { useFetcherErrors } from '@hooks/fetcher';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { TimeInput } from '@nextui-org/date-input';
import { DatePicker } from '@nextui-org/date-picker';
import { Textarea } from '@nextui-org/input';
import { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/modal';
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
	const [userId, setUserId] = useState<Key>('');
	const [classroomId, setClassroomId] = useState<Key>('');

	const { modalType, fetcher, closeModal } = useModalForm<
		ExtendedReservation,
		typeof action
	>();
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

	const handleUserIdChange = (value: Key | null) => {
		setUserId(value ?? '');
	};

	const handleClassroomIdChange = (value: Key | null) => {
		setClassroomId(value ?? '');
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
					selectedKey={userId}
					onSelectionChange={handleUserIdChange}
					isRequired={true}
				>
					<AutocompleteItem key='123' value='admin'>
						Test User 1
					</AutocompleteItem>
					<AutocompleteItem key='456' value='user'>
						Test user 2
					</AutocompleteItem>
				</Autocomplete>
				<Autocomplete
					label='Classroom'
					variant='faded'
					className='col-span-12'
					isClearable={false}
					selectedKey={classroomId}
					onSelectionChange={handleClassroomIdChange}
					isRequired={true}
				>
					<AutocompleteItem key='redes' value='admin'>
						Test Classroom 1
					</AutocompleteItem>
					<AutocompleteItem key='software' value='user'>
						Test Classroom 2
					</AutocompleteItem>
				</Autocomplete>
				<HiddenInput name='role' value={userId} />
				<DatePicker
					label='End date'
					variant='faded'
					className='col-span-6'
					isRequired={true}
					granularity='day'
				/>
				<TimeInput
					label='Start hour'
					variant='faded'
					className='col-span-3'
					isRequired={true}
				/>
				<TimeInput
					label='End hour'
					variant='faded'
					className='col-span-3'
					isRequired={true}
				/>
				<Textarea
					label='Description'
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
