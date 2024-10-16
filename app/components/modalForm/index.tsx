import type { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/modal';

import { useModalForm } from '@components/modalForm/providers';
import { Modal, ModalContent } from '@nextui-org/modal';

import styles from './styles.module.css';

function getFormMethod(modalType: string) {
	switch (modalType) {
		case 'update':
			return 'PATCH';
		case 'delete':
			return 'DELETE';
		default:
			return 'POST';
	}
}

export function ModalForm({
	children,
}: {
	children: [
		ReturnType<typeof ModalHeader>,
		ReturnType<typeof ModalBody>,
		ReturnType<typeof ModalFooter>,
	];
}) {
	const { isOpen, onOpenChange, fetcher, modalType } = useModalForm();
	const [ModalHeader, ModalBody, ModalFooter] = children;

	const method = getFormMethod(modalType);

	return (
		<>
			<Modal
				isOpen={isOpen}
				isDismissable={true}
				onOpenChange={onOpenChange}
				size='xl'
				classNames={{
					backdrop: styles.modalBackdrop,
				}}
			>
				<ModalContent>
					<fetcher.Form method={method}>
						{ModalHeader}
						{ModalBody}
						{ModalFooter}
					</fetcher.Form>
				</ModalContent>
			</Modal>
		</>
	);
}
