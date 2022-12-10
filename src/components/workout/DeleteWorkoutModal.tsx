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

const DeleteWorkoutModal = ({ userId, workoutId }: { userId: string, workoutId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useAuth();
  //ok
  return (
    <>
      <Flex onClick={onOpen} bgColor='azure' w='full' justify='center'>
          {currentUser ? (
          <Flex bgColor='azure' w='60%' justifyContent='space-between'>
          <Box> Delete </Box>
          </Flex>) : null}
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
