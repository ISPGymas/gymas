import { GymClient } from '@/types';
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
import { User } from 'firebase/auth';

import CreateMealPlanForm from './CreateMealPlanForm';

const CreateMealPlanModal = ({ client }: { client: GymClient }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box onClick={onOpen}>
        <Flex bgColor="green.300" w="full" justify="center">
            <Flex bgColor="green.300" w="80%" justifyContent="center">
              <Box> Create Meal Plan</Box>
            </Flex>
        </Flex>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new Meal Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} px={10}>
            <CreateMealPlanForm closeHandler={onClose} client={client} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateMealPlanModal;
