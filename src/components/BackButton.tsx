import { Flex, Box } from '@chakra-ui/react'
import { HomeOutlined } from '@ant-design/icons'
import { useAuth } from '@/context/AuthContext'

import { ButtonLink } from './Menu'

function BackButton() {
  const { currentUser } = useAuth()
  return (
    <Flex bgColor='azure' w='full' justify='center'>
      {currentUser ? (
        <Flex bgColor='azure' w='60%' justifyContent='space-between'>
          <Box>
            <ButtonLink link='/' name={<HomeOutlined />} />
          </Box>
        </Flex>
      ) : null}
    </Flex>
  )
}

export default BackButton
