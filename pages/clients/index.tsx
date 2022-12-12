import ClientComponent from '@/components/client/Client';
import CreateWorkoutModal from '@/components/workout/CreateWorkoutModal';
import WorkoutComponent from '@/components/workout/Workout';
import { useAuth } from '@/context/AuthContext';
import { firebaseDb } from '@/firebase';
import { GymClient, UserType } from '@/types';
import { Heading, SimpleGrid, Spinner } from '@chakra-ui/react';
import { collection, getDoc, getDocs, query, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const ClientList = () => {
  const { currentUser } = useAuth();
  const columns = [1, 1, 2, 2, 3, 3];
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClient] = useState<GymClient[]>([]);

  useEffect(() => {
    const getClients = async () => {
      const workoutCollections = await getDocs(query(collection(firebaseDb, 'clients')));
      const workoutDocs = workoutCollections.docs;
      await Promise.all(
        workoutDocs.map(async (workoutDoc) => {
          const workoutData = workoutDoc.data() as GymClient;
          setClient((currentValues) =>
            currentValues.some((currVal) => currVal.id === workoutDoc.id)
              ? currentValues
              : [
                  ...currentValues,
                  {
                    ...workoutData,
                    id: workoutDoc.id,
                  },
                ]
          );
        })
      );
      setIsLoading(false);
    };
    getClients();
  }, []);

  return (
    <div>
      {currentUser && currentUser.userType !== UserType.CLIENT ? (
        <>
          {!isLoading ? (
            <SimpleGrid columns={columns} templateRows={'masonry'}>
              {clients.map((client) => (
                <ClientComponent key={client.id} client={client}></ClientComponent>
              ))}
            </SimpleGrid>
          ) : (
            <Spinner />
          )}
        </>
      ) : (
        <Heading>You have no permissions to view clients list</Heading>
      )}
    </div>
  );
};

export default ClientList;
