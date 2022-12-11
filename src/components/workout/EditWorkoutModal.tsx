import { useAuth } from '@/context/AuthContext';
import { WorkoutWithLocation } from '@/types/gym';
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
  Flex,
} from '@chakra-ui/react';

import EditWorkoutForm from './EditWorkoutForm';

const EditWorkoutModal = ({ workout }: { workout: WorkoutWithLocation }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useAuth();
  //ok
  return (
    <>
      <Box onClick={onOpen}>
        <Flex bgColor="green.300" w="full" justify="center">
          {currentUser ? (
            <Flex bgColor="green.300" w="60%" justifyContent="center">
              <Box> Edit </Box>
            </Flex>
          ) : null}
        </Flex>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit workout</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} px={10}>
            <EditWorkoutForm workout={workout} closeHandler={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditWorkoutModal;
