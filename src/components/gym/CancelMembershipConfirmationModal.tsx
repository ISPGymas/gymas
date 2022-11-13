import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';

export const CancelMembershipConfirmationModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm membership cancellation</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} px={10}>
          This action cannot be undone. Are you sure you want to delete this membership?
        </ModalBody>
        <Button variant="primary" onClick={onSubmit}>
          Confirm
        </Button>
      </ModalContent>
    </Modal>
  );
};
