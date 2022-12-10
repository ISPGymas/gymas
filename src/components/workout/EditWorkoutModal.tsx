import { useAuth } from '@/context/AuthContext';
import { Workout } from '@/types/gym';
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
  
  const EditWorkoutModal = ({workout}: {workout: Workout}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { currentUser } = useAuth();
    //ok
    return (
      <>
        <Box  onClick={onOpen}>
            <Flex bgColor='azure' w='full' justify='center'>
            {currentUser ? (
            <Flex bgColor='azure' w='60%' justifyContent='space-between'>
            <Box> Edit </Box>
            </Flex>) : null}
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
  