import { GymClient, User } from '@/types'
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
import EditClientProfileForm from './EditProfileForm'

const EditClientProfileModal = ({
  user,
  client,
}: {
  user: User
  client: GymClient
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
            <EditClientProfileForm
              user={user}
              client={client}
              closeHandler={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditClientProfileModal
