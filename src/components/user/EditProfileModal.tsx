import { User } from '@/types'
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

import EditProfileForm from './EditProfileForm'

const EditProfileModal = ({ user }: { user: User }) => {
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
            <EditProfileForm user={user} closeHandler={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditProfileModal
