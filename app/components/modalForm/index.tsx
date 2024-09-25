import type { ModalBody, ModalFooter, ModalHeader } from '@nextui-org/modal';

import { useModalForm } from '@components/modalForm/providers';
import { Modal, ModalContent } from '@nextui-org/modal';

import styles from './styles.module.css';

export function ModalForm({
	children,
}: {
	children: [
		ReturnType<typeof ModalHeader>,
		ReturnType<typeof ModalBody>,
		ReturnType<typeof ModalFooter>,
	];
}) {
	const { isOpen, onOpenChange } = useModalForm();

	const [ModalHeader, ModalBody, ModalFooter] = children;

	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				size='lg'
				classNames={{
					backdrop: styles.modalBackdrop,
				}}
			>
				<ModalContent>
					<form>
						{ModalHeader}
						{ModalBody}
						{ModalFooter}
					</form>
				</ModalContent>
			</Modal>
		</>
	);
}
