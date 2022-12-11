import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Box,
} from '@chakra-ui/react';

import CreateWorkoutForm from './CreateWorkoutForm';

const CreateWorkoutModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box maxW="md" textAlign="center" borderWidth="1px" borderRadius="lg" overflow="hidden" m={2} onClick={onOpen}>
        <Box fontSize={100}>+</Box>
        <Box>Create new workout</Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new workout</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} px={10}>
            <CreateWorkoutForm closeHandler={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateWorkoutModal;
