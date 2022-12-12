import CreateWorkoutModal from '@/components/workout/CreateWorkoutModal';
import WorkoutComponent from '@/components/workout/Workout';
import { useAuth } from '@/context/AuthContext';
import { firebaseDb } from '@/firebase';
import { UserType } from '@/types';
import { Workout, WorkoutLocation, WorkoutWithLocation } from '@/types/gym';
import { SimpleGrid, Spinner } from '@chakra-ui/react';
import { collection, getDoc, getDocs, query, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const WorkoutsList = () => {
  const { currentUser } = useAuth();
  const columns = [1, 1, 2, 2, 3, 3];
  const [isLoading, setIsLoading] = useState(true);
  const [trainers, setWorkouts] = useState<WorkoutWithLocation[]>([]);

  useEffect(() => {
    const getWorkouts = async () => {
      const workoutCollections = await getDocs(query(collection(firebaseDb, 'workouts')));
      const workoutDocs = workoutCollections.docs;
      await Promise.all(
        workoutDocs.map(async (workoutDoc) => {
          const workoutData = workoutDoc.data() as Workout;
          const workoutLocationCollection = await getDoc(
            doc(firebaseDb, 'workout_locations', workoutData.locationId as string)
          );
          const workoutLocationData = workoutLocationCollection.data() as WorkoutLocation;
          setWorkouts((currentValues) =>
            currentValues.some((currVal) => currVal.id === workoutDoc.id)
              ? currentValues
              : [
                  ...currentValues,
                  {
                    ...workoutData,
                    id: workoutDoc.id,
                    location: { ...workoutLocationData, id: workoutLocationCollection.id },
                  },
                ]
          );
        })
      );
      setIsLoading(false);
    };

    getWorkouts();
  }, []);

  return (
    <div>
      {!isLoading ? (
        <SimpleGrid columns={columns} templateRows={'masonry'}>
          {trainers.map((workout) => (
            <WorkoutComponent key={workout.id} workout={workout}></WorkoutComponent>
          ))}
          {currentUser?.userType === UserType.TRAINER && <CreateWorkoutModal />}
        </SimpleGrid>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default WorkoutsList;
