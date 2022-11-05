import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Center, Heading, VStack, Divider, Button, SimpleGrid, Spinner } from '@chakra-ui/react';

import { Administrator, Trainer, User } from '@/types';
import { useAuth } from '@/context/AuthContext';

import Avatar from '@/components/user/Avatar';
import EditProfileModal from '@/components/user/EditProfileModal';
import { collection, getDocs, query } from 'firebase/firestore';
import { firebaseDb } from '@/firebase';

const AdminProfile = ({ admin, user }: { admin: Administrator; user: User }) => {
  const { logout, currentUser } = useAuth();
  const isAdmin = currentUser?.uid === admin.userId;
  const router = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTrainers = async () => {
      const trainersCollections = await getDocs(query(collection(firebaseDb, 'trainers')));
      const trainersDocs = trainersCollections.docs;
      await Promise.all(
        trainersDocs.map(async (doc) => {
          const trainerData = doc.data() as Trainer;
          setTrainers((currentValues) => [...currentValues, { ...trainerData, id: doc.id }]);
        })
      );
      setLoading(false);
    };

    getTrainers();
  }, []);

  const handleLogout = async (event: any) => {
    event.preventDefault();
    await logout();

    router.replace('/login');
  };

  return loading ? (
    <Spinner />
  ) : (
    <>
      <Center>
        <VStack>
          <Heading>{`${user.firstName} ${user.lastName}`}</Heading>
          <Avatar user={user} />
          {isAdmin && (
            <>
              <EditProfileModal user={user} />
              <Button variant="alarm" width="full" onClick={handleLogout}>
                Log out
              </Button>
            </>
          )}
        </VStack>
      </Center>
      {isAdmin && (
        <>
          <Divider py={5} />
          <Center mt={5}>
            <Heading>Trainers</Heading>
            {trainers.length ? (
              <SimpleGrid columns={[1, 1, 2, 2, 3, 3]} templateRows={'masonry'}></SimpleGrid>
            ) : (
              <Heading>{`There are no trainers`}</Heading>
            )}
          </Center>
        </>
      )}
    </>
  );
};

export default AdminProfile;
