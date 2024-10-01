import type { ModalType } from '@components/modalForm/types';
import type { ReactNode } from 'react';

import { useFetcherWithReset } from '@hooks/fetcher';
import { useDisclosure } from '@nextui-org/modal';
import { createContext, useContext, useState } from 'react';

/**
 * Context for the ModalForm component.
 *
 * This context provides the state and actions related to the modal form.
 * It uses the `modalForm` function to generate the context value.
 */
const ModalFormContext = createContext<ReturnType<typeof modalForm> | null>(
	null,
);

/**
 * A custom hook that manages the state and behavior of a modal form.
 *
 * @template T - The type of the modal data.
 * @template F - The type of the fetcher data, defaults to `unknown`.
 */
function modalForm<T, F = unknown>() {
	const [modalData, setModalData] = useState<T | null>(null);
	const [modalType, setModalType] = useState<ModalType>('create');

	const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
	const fetcher = useFetcherWithReset<F>();

	const openModal = (data: T, modalType: ModalType) => {
		setModalData(data);
		setModalType(modalType);
		onOpen();
	};

	const closeModal = () => {
		setModalData(null);
		fetcher.reset();
		onClose();
	};

	return {
		isOpen,
		fetcher,
		modalData,
		modalType,
		onClose,
		onOpen,
		onOpenChange,
		openModal,
		closeModal,
	};
}

/**
 * Custom hook to use the ModalForm context.
 *
 * @template T - The type of the form data.
 * @template F - The type of the form state, defaults to unknown.
 * @returns The context value of the ModalForm.
 * @throws Will throw an error if the hook is used outside of a ModalFormProvider.
 */
export function useModalForm<T, F = unknown>() {
	const context = useContext(ModalFormContext) as ReturnType<
		typeof modalForm<T, F>
	>;

	if (!context) {
		throw new Error('useModalForm must be used within a ModalFormProvider');
	}

	return context;
}

/**
 * Provider for the ModalForm context.
 *
 * @param children - The children components to render.
 */
export function ModalFormProvider({ children }: { children: ReactNode }) {
	const value = modalForm();

	return (
		<ModalFormContext.Provider value={value}>
			{children}
		</ModalFormContext.Provider>
	);
}
