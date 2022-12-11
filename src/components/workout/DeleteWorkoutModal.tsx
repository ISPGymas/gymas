import { useAuth } from '@/context/AuthContext';
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
import DeleteWorkoutForm from './DeleteWorkoutForm';
import DeleteButton from './DeleteWorkoutForm';

const DeleteWorkoutModal = ({ workoutId }: { workoutId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useAuth();
  return (
    <>
      <Flex onClick={onOpen} bgColor="red.300" w="full" justify="center">
        {currentUser ? (
          <Flex bgColor="red.300" w="60%" justifyContent="center">
            <Box> Delete </Box>
          </Flex>
        ) : null}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you want to delete this workout?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} px={10}>
            <DeleteWorkoutForm workoutId={workoutId} closeHandler={undefined}></DeleteWorkoutForm>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteWorkoutModal;
