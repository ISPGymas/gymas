import { Flex, Box } from '@chakra-ui/react';
import { UserOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';

import { ButtonLink } from './Menu';

function Header() {
  const { currentUser } = useAuth();
  return (
    <Flex bgColor="azure" w="full" justify="center">
      {currentUser ? (
        <Flex w="60%" justifyContent="space-between">
          <Box>
            <ButtonLink link="/" name={<HomeOutlined />} />
          </Box>
          <Box>
            <ButtonLink link={`/trainers`} name={<TeamOutlined />} />
            <ButtonLink link={`/users/${currentUser?.uid}`} name={<UserOutlined />} />
          </Box>
        </Flex>
      ) : null}
    </Flex>
  );
}

export default Header;
