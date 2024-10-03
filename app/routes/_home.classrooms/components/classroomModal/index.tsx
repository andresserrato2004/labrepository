import type { ModalType } from '@components/modalForm/types';
import type { Classroom } from '@database/types';
import type { action } from '@routes/classrooms/action';

import { ModalForm } from '@components';
import { useModalForm } from '@components/modalForm/providers';
import { useFetcherErrors } from '@hooks/fetcher';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/modal';

const getModalTitle = (modalType: ModalType) => {
	switch (modalType) {
		case 'create':
			return 'Creating a new classroom';
		case 'update':
			return 'Editing classroom';
		case 'details':
			return 'Classroom details';
		default:
			return 'Modal form';
	}
};

export function ClassroomModal() {
	const { modalType, modalData, fetcher, closeModal } = useModalForm<
		Classroom,
		typeof action
	>();
	const { clearErrors, createErrorProps } = useFetcherErrors(fetcher);

	const isLoading = fetcher.state !== 'idle';

	const isDetails = modalType === 'details';

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
					className='col-span-9'
					isRequired={true}
					onValueChange={clearErrors('name')}
					defaultValue={modalData?.name}
					isReadOnly={isDetails}
					{...createErrorProps('name')}
				/>
				<Input
					label='Capacity'
					name='capacity'
					variant='faded'
					className='col-span-3'
					type='number'
					isRequired={true}
					onValueChange={clearErrors('name')}
					defaultValue={modalData?.name}
					isReadOnly={isDetails}
					{...createErrorProps('name')}
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
