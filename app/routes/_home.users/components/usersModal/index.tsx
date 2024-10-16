import type { ModalType } from '@components/modalForm/types';
import type { User } from '@database/types';
import type { Key } from '@react-types/shared';
import type { action } from '@routes/users/action';

import { HiddenInput, ModalForm, toast } from '@components';
import { useModalForm } from '@components/modalForm/providers';
import { useFetcherErrors } from '@hooks/fetcher';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { ResponseType } from '@services/shared/utility';
import { useEffect, useState } from 'react';

const getModalTitle = (modalType: ModalType) => {
	switch (modalType) {
		case 'create':
			return 'Creating a new user';
		case 'update':
			return 'Editing user';
		case 'details':
			return 'User details';
		default:
			return 'Modal form';
	}
};

const getSuccessMessage = (modalType: ModalType) => {
	switch (modalType) {
		case 'create':
			return 'User created successfully';
		case 'update':
			return 'User updated successfully';
		default:
			return 'Success';
	}
};

export function UserModal() {
	const { fetcher, closeModal, modalData, modalType } = useModalForm<
		User,
		typeof action
	>();
	const { clearErrors, createErrorProps } = useFetcherErrors(fetcher);
	const [userRole, setUserRole] = useState<Key>(modalData?.role ?? 'user');

	const isLoading = fetcher.state !== 'idle';

	const isDetails = modalType === 'details';
	const isCreate = modalType === 'create';
	const isUpdate = modalType === 'update';

	const handleRoleChange = (value: Key | null) => {
		setUserRole(value ?? 'user');
	};

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
		<>
			<ModalForm>
				<ModalHeader>
					<h2 className='text-2xl mt-4'>
						{getModalTitle(modalType)}
					</h2>
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
					<Input
						label='Username'
						name='username'
						variant='faded'
						className='col-span-8'
						isRequired={true}
						onValueChange={clearErrors('username')}
						defaultValue={modalData?.username}
						isReadOnly={isDetails}
						{...createErrorProps('username')}
					/>
					<Autocomplete
						label='Role'
						variant='faded'
						className='col-span-4'
						isClearable={false}
						selectedKey={userRole}
						onSelectionChange={handleRoleChange}
						isRequired={true}
						onValueChange={clearErrors('role')}
						isReadOnly={isDetails}
						{...createErrorProps('role')}
					>
						<AutocompleteItem key='admin' value='admin'>
							Admin
						</AutocompleteItem>
						<AutocompleteItem key='user' value='user'>
							User
						</AutocompleteItem>
					</Autocomplete>
					<HiddenInput name='role' value={userRole} />
					<Input
						label='Email'
						name='email'
						variant='faded'
						className='col-span-12'
						isRequired={true}
						type='email'
						onValueChange={clearErrors('email')}
						defaultValue={modalData?.email}
						isReadOnly={isDetails}
						{...createErrorProps('email')}
					/>
					{isCreate ? (
						<Input
							label='Password'
							name='password'
							variant='faded'
							className='col-span-12'
							isRequired={true}
							onValueChange={clearErrors('password')}
							defaultValue={modalData?.password}
							isReadOnly={isDetails}
							{...createErrorProps('password')}
						/>
					) : null}
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
		</>
	);
}
