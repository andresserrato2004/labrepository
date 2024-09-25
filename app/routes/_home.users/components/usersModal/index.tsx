import type { User } from '@database/types';
import type { Key } from '@react-types/shared';
import type { action } from '@routes/users/action';

import { ModalForm } from '@components';
import { useModalForm } from '@components/modalForm/providers';
import { useFetcherErrors } from '@hooks/fetcher';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { useState } from 'react';

export function UserModal() {
	const [userRole, setUserRole] = useState<Key>('user');
	const { fetcher, closeModal } = useModalForm<User, typeof action>();
	const { clearErrors, createErrorProps } = useFetcherErrors(fetcher);

	const handleRoleChange = (value: Key | null) => {
		setUserRole(value ?? 'user');
	};

	return (
		<>
			<ModalForm>
				<ModalHeader>
					<h2 className='text-2xl mt-4'>Creating new user</h2>
				</ModalHeader>
				<ModalBody className='grid grid-cols-12 p-6 gap-6'>
					<Input
						label='Name'
						variant='faded'
						className='col-span-12'
						isRequired={true}
						onValueChange={clearErrors('name')}
						{...createErrorProps('name')}
					/>
					<Input
						label='Username'
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
					<Input
						label='Email'
						variant='faded'
						className='col-span-12'
						isRequired={true}
						type='email'
						onValueChange={clearErrors('email')}
						{...createErrorProps('email')}
					/>
					<Input
						label='Password'
						variant='faded'
						className='col-span-12'
						isRequired={true}
						onValueChange={clearErrors('password')}
						{...createErrorProps('password')}
					/>
				</ModalBody>
				<ModalFooter>
					<Button color='danger' variant='light' onPress={closeModal}>
						Cancel
					</Button>
					<Button color='primary' type='submit'>
						Create User
					</Button>
				</ModalFooter>
			</ModalForm>
		</>
	);
}
