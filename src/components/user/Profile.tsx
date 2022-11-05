import React from 'react';
import { useRouter } from 'next/router';
import { Center, Heading, VStack, Button } from '@chakra-ui/react';

import { User } from '@/types';
import { useAuth } from '@/context/AuthContext';

import Avatar from './Avatar';
import EditProfileModal from './EditProfileModal';

const UserProfile = ({ user }: { user: User }) => {
  const { logout, currentUser } = useAuth();
  const router = useRouter();
  const isUser = user.id === currentUser?.uid;
  const handleLogout = async (event: any) => {
    event.preventDefault();
    await logout();

    router.replace('/login');
  };

  return (
    <>
      <Center>
        <VStack>
          <Heading>{`${user.firstName} ${user.lastName}`}</Heading>
          <Avatar user={user} />
          {isUser && (
            <>
              <EditProfileModal user={user} />
              <Button variant="alarm" width="full" onClick={handleLogout}>
                Log out
              </Button>
            </>
          )}
        </VStack>
      </Center>
    </>
  );
};

export default UserProfile;
