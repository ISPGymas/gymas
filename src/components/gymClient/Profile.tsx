import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Center, Heading, VStack, Divider, Button, SimpleGrid } from '@chakra-ui/react';
import { collection, doc, documentId, getDocs, query, updateDoc, where } from 'firebase/firestore';

import { GymClient, Trainer, User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import TrainerComponent from '@/components/trainer/Trainer';
import MembershipComponent from '@/components/gym/Membership';
import Avatar from '@/components/user/Avatar';
import { Membership, Reservation } from '@/types/gym';
import { firebaseDb } from '@/firebase';

import EditClientProfileModal from './EditProfileModal';

const GymClientProfile = ({ client, user }: { client: GymClient; user: User }) => {
  const { logout, currentUser } = useAuth();
  const router = useRouter();
  const isClient = client.userId === currentUser?.uid;
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [userTrainers, setUserTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async (event: any) => {
    event.preventDefault();
    await logout();

    router.replace('/login');
  };

  const retrieveData = useCallback(async () => {
    setMemberships([]);
    setUserTrainers([]);

    const reservationsCollections = await getDocs(
      query(collection(firebaseDb, 'reservations'), where('clientId', '==', client.id))
    );

    const reservationsDocs = reservationsCollections.docs;
    const allReservations = await Promise.all(
      reservationsDocs.map(async (doc) => {
        const reservationData = doc.data() as Reservation;
        return { ...reservationData, id: doc.id };
      })
    );
    const uniqueTrainerIds = [...new Set(allReservations.map((res) => res.trainerId))];

    if (uniqueTrainerIds.length > 0) {
      const trainersCollections = await getDocs(
        query(collection(firebaseDb, 'trainers'), where(documentId(), 'in', uniqueTrainerIds))
      );
      const trainersDocs = trainersCollections.docs;
      const trainersList: Trainer[] = [];
      trainersDocs.map(async (doc) => {
        const trainerData = doc.data() as Trainer;
        trainersList.push({ ...trainerData, id: doc.id });
      });
      setUserTrainers(trainersList);
    }

    const membershipCollections = await getDocs(
      query(collection(firebaseDb, 'memberships'), where('clientId', '==', client.id))
    );

    const membershipDocs = membershipCollections.docs;
    const membershipsList: Membership[] = [];
    await Promise.all(
      membershipDocs.map((doc) => {
        const membershipData = doc.data() as Membership;
        membershipsList.push({ ...membershipData, id: doc.id });
      })
    );
    setMemberships(membershipsList);

    setLoading(false);
    return;
  }, [client]);

  useEffect(() => {
    retrieveData();
  }, [retrieveData]);

  const handleMembershipStatusChange = async (membershipId: string, status: string) => {
    const docRef = await doc(firebaseDb, 'memberships', membershipId);
    await updateDoc(docRef, { status });
    retrieveData();
  };

  return (
    <>
      <Center>
        <VStack>
          <Heading>{`${user.firstName} ${user.lastName}`}</Heading>
          <Avatar user={user} />
          {isClient && (
            <>
              <EditClientProfileModal user={user} client={client} />
              <Button variant="alarm" width="full" onClick={handleLogout}>
                Log out
              </Button>
            </>
          )}
        </VStack>
      </Center>
      <Divider py={5} />
      {isClient && (
        <>
          <Center mt={5} display="grid" justifyItems="center" alignItems="center">
            <Heading>Memberships</Heading>
            <SimpleGrid columns={[1, 1, 2, 2, 3, 3]} templateRows={'masonry'}>
              {memberships.map((membership) => (
                <MembershipComponent
                  key={membership.id}
                  membership={membership}
                  onStatusChange={handleMembershipStatusChange}
                />
              ))}
            </SimpleGrid>
          </Center>
          <Divider py={5} />
          <Center mt={5} display="grid" justifyItems="center" alignItems="center">
            <Heading>Trainers history</Heading>
            <SimpleGrid columns={[1, 1, 2, 2, 3, 3]} templateRows={'masonry'}>
              {userTrainers.map((trainer) => (
                <TrainerComponent key={trainer.id} trainer={trainer}></TrainerComponent>
              ))}
            </SimpleGrid>
          </Center>
          <Divider py={5} />
        </>
      )}
    </>
  );
};

export default GymClientProfile;
