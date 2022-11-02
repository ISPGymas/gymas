import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react'

import { Trainer, User } from '@/types'

import EditTrainerProfileForm from './EditProfileForm'

const EditTrainerProfileModal = ({
  user,
  trainer,
}: {
  user: User
  trainer: Trainer
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button variant='primary' width='full' onClick={onOpen}>
        Update profile
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size='xl'
        scrollBehavior='inside'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} px={10}>
            <EditTrainerProfileForm
              user={user}
              trainer={trainer}
              closeHandler={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditTrainerProfileModal
