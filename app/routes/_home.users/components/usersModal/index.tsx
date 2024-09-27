import type { User } from '@database/types';
import type { Key } from '@react-types/shared';
import type { action } from '@routes/users/action';

import { HiddenInput, ModalForm } from '@components';
import { useModalForm } from '@components/modalForm/providers';
import { useFetcherErrors } from '@hooks/fetcher';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { ResponseType } from '@services/shared/utility';
import { useEffect, useState } from 'react';

export function UserModal() {
	const [userRole, setUserRole] = useState<Key>('user');
	const { fetcher, closeModal } = useModalForm<User, typeof action>();
	const { clearErrors, createErrorProps } = useFetcherErrors(fetcher);

	const isLoading = fetcher.state !== 'idle';

	const handleRoleChange = (value: Key | null) => {
		setUserRole(value ?? 'user');
	};

	useEffect(() => {
		if (!fetcher.data) {
			return;
		}

		if (fetcher.state === 'idle') {
			if (fetcher.data.type === ResponseType.Success) {
				//TODO: Add success toast
				closeModal();
				return;
			}
		}
	});

	return (
		<>
			<ModalForm>
				<ModalHeader>
					<h2 className='text-2xl mt-4'>Creating a new {userRole}</h2>
				</ModalHeader>
				<ModalBody className='grid grid-cols-12 p-6 gap-6'>
					<Input
						label='Name'
						name='name'
						variant='faded'
						className='col-span-12'
						isRequired={true}
						onValueChange={clearErrors('name')}
						{...createErrorProps('name')}
					/>
					<Input
						label='Username'
						name='username'
						variant='faded'
						className='col-span-8'
						isRequired={true}
						onValueChange={clearErrors('username')}
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
						{...createErrorProps('email')}
					/>
					<Input
						label='Password'
						name='password'
						variant='faded'
						className='col-span-12'
						isRequired={true}
						onValueChange={clearErrors('password')}
						{...createErrorProps('password')}
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
					<Button color='primary' type='submit' isLoading={isLoading}>
						Create User
					</Button>
				</ModalFooter>
			</ModalForm>
		</>
	);
}
