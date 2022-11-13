import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react';

import BecomeClientForm from './BecomeClientForm';

const BecomeClientModal = ({ userId }: { userId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button variant="primary" width="full" onClick={onOpen}>
        Become client
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Become our gym client</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} px={10}>
            <BecomeClientForm userId={userId} closeHandler={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BecomeClientModal;
