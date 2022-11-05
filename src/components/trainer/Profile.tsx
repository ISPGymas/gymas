import React from 'react';
import { useRouter } from 'next/router';
import { Center, Heading, VStack, Divider, Button } from '@chakra-ui/react';

import { Trainer, User } from '@/types';
import { useAuth } from '@/context/AuthContext';

import Avatar from '@/components/user/Avatar';
import EditTrainerProfileModal from './EditProfileModal';

const TrainerProfile = ({ trainer, user }: { trainer: Trainer; user: User }) => {
  const { logout, currentUser } = useAuth();
  const router = useRouter();
  const handleLogout = async (event: any) => {
    event.preventDefault();
    await logout();

    router.replace('/login');
  };
  const isTrainer = trainer.userId === currentUser?.uid;

  return (
    <>
      <Center>
        <VStack>
          <Heading>{`${user.firstName} ${user.lastName}`}</Heading>
          <Avatar user={user} />
          {isTrainer ? (
            <>
              <EditTrainerProfileModal user={user} trainer={trainer} />
              <Button variant="alarm" width="full" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Heading size="md">{`Experience: ${trainer.experience}`}</Heading>
              <Heading size="md">{`Education: ${trainer.education}`}</Heading>
            </>
          )}
        </VStack>
      </Center>
      <Divider py={5} />
      <Center mt={5}>
        <Heading>Upcoming workouts or whatever</Heading>
      </Center>
    </>
  );
};

export default TrainerProfile;
